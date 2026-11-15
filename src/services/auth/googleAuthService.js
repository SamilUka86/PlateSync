import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../firebase/config';

/**
 * PlateSync - Google Auth & Google Identity Services (GIS)
 * Standard OAuth 2.0 Web Client authentication with silent Firebase Auth synchronization.
 */

const GOOGLE_CLIENT_ID_KEY = 'platesync_google_client_id';
const GOOGLE_USER_SESSION_KEY = 'platesync_google_user';
const LOCAL_USERS_KEY = 'platesync_local_users';
export const DEFAULT_GOOGLE_CLIENT_ID = '1073911515845-eoatnga7oblfb7qkcnspsnoqjg5i73r0.apps.googleusercontent.com';

/**
 * Retrieve configured Google Client ID from environment or localStorage
 */
export const getGoogleClientId = () => {
  try {
    return (
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      (typeof localStorage !== 'undefined' ? localStorage.getItem(GOOGLE_CLIENT_ID_KEY) : '') ||
      DEFAULT_GOOGLE_CLIENT_ID
    );
  } catch (e) {
    return DEFAULT_GOOGLE_CLIENT_ID;
  }
};

/**
 * Check if Google Client ID is configured
 */
export const isGoogleAuthConfigured = () => {
  const clientId = getGoogleClientId();
  return Boolean(clientId && clientId.length > 15 && clientId.includes('.apps.googleusercontent.com'));
};

/**
 * Save runtime Google Client ID
 */
export const saveGoogleClientId = (clientId) => {
  if (clientId) {
    localStorage.setItem(GOOGLE_CLIENT_ID_KEY, clientId.trim());
  } else {
    localStorage.removeItem(GOOGLE_CLIENT_ID_KEY);
  }
};

/**
 * Decode JWT token returned by Google Identity Services
 */
export const parseGoogleJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Failed to parse Google JWT credential:', e);
    return null;
  }
};

/**
 * Silently authenticate with Firebase Auth using Google OAuth credentials.
 * This registers/updates the user in Firebase Authentication (Users tab)
 * and sets auth.currentUser for Firestore security rules without any Firebase popup.
 */
export const silentSignInFirebaseWithGoogleCredential = async ({ idToken, accessToken }) => {
  if (!isFirebaseConfigured() || !auth) {
    return null;
  }

  try {
    const credential = GoogleAuthProvider.credential(idToken || null, accessToken || null);
    const userCredential = await signInWithCredential(auth, credential);
    return userCredential.user;
  } catch (err) {
    console.warn('Silent Firebase Auth synchronization notice:', err);
    return null;
  }
};

/**
 * Dynamically load Google Identity Services script
 */
export const loadGoogleIdentityScript = () => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);

    if (window.google?.accounts?.id || window.google?.accounts?.oauth2) {
      return resolve(true);
    }

    const existingScript = 
      document.getElementById('google-identity-services') ||
      document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    
    if (existingScript) {
      if (window.google?.accounts) return resolve(true);
      existingScript.addEventListener('load', () => resolve(true));
      let count = 0;
      const poll = setInterval(() => {
        count++;
        if (window.google?.accounts) {
          clearInterval(poll);
          resolve(true);
        } else if (count > 25) {
          clearInterval(poll);
          resolve(Boolean(window.google?.accounts));
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-identity-services';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.warn('Google Identity script failed to load.');
      resolve(false);
    };
    document.head.appendChild(script);
  });
};

/**
 * Trigger Google Sign In using Google Identity Services (GIS OAuth 2.0 Popup & One Tap)
 */
export const signInWithGoogleIdentity = () => {
  return new Promise(async (resolve, reject) => {
    const clientId = getGoogleClientId();

    if (!clientId) {
      return reject(new Error('GOOGLE_AUTH_NOT_CONFIGURED'));
    }

    const loaded = await loadGoogleIdentityScript();
    if (!loaded || !window.google?.accounts) {
      return reject(new Error('Google Identity Services library is unreachable.'));
    }

    try {
      // 1. Google OAuth2 Token Client Popup (recommended & most reliable for button clicks)
      if (window.google.accounts.oauth2) {
        let settled = false;

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: async (tokenResponse) => {
            if (settled) return;
            settled = true;

            if (tokenResponse?.error) {
              if (
                tokenResponse.error === 'popup_closed_by_user' || 
                tokenResponse.error === 'access_denied'
              ) {
                const err = new Error('Sign-in popup was closed before completion.');
                err.code = 'auth/popup-closed-by-user';
                return reject(err);
              }
              return reject(new Error(tokenResponse.error_description || tokenResponse.error));
            }

            if (tokenResponse?.access_token) {
              try {
                const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`
                  }
                });
                const info = await res.json();

                // Silently authenticate with Firebase Auth using the Google access token
                const fbUser = await silentSignInFirebaseWithGoogleCredential({
                  accessToken: tokenResponse.access_token,
                  idToken: tokenResponse.id_token || null
                });

                const user = {
                  uid: fbUser?.uid || info.sub,
                  email: fbUser?.email || info.email,
                  displayName: fbUser?.displayName || info.name || info.given_name || 'Athlete',
                  photoURL: fbUser?.photoURL || info.picture || null,
                  provider: 'google.com'
                };
                localStorage.setItem(GOOGLE_USER_SESSION_KEY, JSON.stringify(user));
                return resolve(user);
              } catch (fetchErr) {
                return reject(fetchErr);
              }
            }
            reject(new Error('Google authentication did not return an access token.'));
          },
          error_callback: (error) => {
            if (settled) return;
            settled = true;
            if (error?.type === 'popup_closed') {
              const err = new Error('Sign-in popup was closed before completion.');
              err.code = 'auth/popup-closed-by-user';
              return reject(err);
            }
            reject(new Error(error?.message || 'Google sign-in popup could not open.'));
          }
        });

        tokenClient.requestAccessToken({ prompt: 'select_account' });
        return;
      }

      // 2. Google Identity One Tap fallback
      if (window.google.accounts.id) {
        let resolved = false;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (resolved) return;
            resolved = true;
            if (response?.credential) {
              const payload = parseGoogleJwt(response.credential);
              if (payload) {
                // Silently authenticate with Firebase Auth using Google ID token
                const fbUser = await silentSignInFirebaseWithGoogleCredential({
                  idToken: response.credential
                });

                const user = {
                  uid: fbUser?.uid || payload.sub,
                  email: fbUser?.email || payload.email,
                  displayName: fbUser?.displayName || payload.name || payload.given_name || 'Athlete',
                  photoURL: fbUser?.photoURL || payload.picture || null,
                  provider: 'google.com'
                };
                localStorage.setItem(GOOGLE_USER_SESSION_KEY, JSON.stringify(user));
                return resolve(user);
              }
            }
            reject(new Error('Google authentication returned invalid credential.'));
          },
          auto_select: false,
          cancel_on_tap_outside: true
        });

        window.google.accounts.id.prompt((notification) => {
          if ((notification.isNotDisplayed() || notification.isSkippedMoment()) && !resolved) {
            resolved = true;
            const err = new Error('Google sign-in prompt was closed or skipped.');
            err.code = 'auth/popup-closed-by-user';
            reject(err);
          }
        });
      }
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Retrieve saved Google user from localStorage
 */
export const getStoredGoogleUser = () => {
  try {
    const raw = localStorage.getItem(GOOGLE_USER_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

/**
 * Sign out Google user
 */
export const signOutGoogleUser = () => {
  try {
    const user = getStoredGoogleUser();
    if (user?.email && window.google?.accounts?.id?.revoke) {
      window.google.accounts.id.revoke(user.email, () => {});
    }
    localStorage.removeItem(GOOGLE_USER_SESSION_KEY);
  } catch (e) {}
};

/**
 * Standalone Local User Registration (Zero Firebase dependency fallback)
 */
export const registerLocalUser = (email, password, displayName) => {
  try {
    const usersRaw = localStorage.getItem(LOCAL_USERS_KEY);
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const err = new Error('An account with this email already exists.');
      err.code = 'auth/email-already-in-use';
      throw err;
    }

    const newUser = {
      uid: `local_user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: email.trim(),
      password, // Local sandbox storage
      displayName: displayName.trim() || email.split('@')[0],
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(displayName || email)}`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    localStorage.setItem(GOOGLE_USER_SESSION_KEY, JSON.stringify(newUser));

    return newUser;
  } catch (e) {
    throw e;
  }
};

/**
 * Standalone Local User Login (Zero Firebase dependency fallback)
 */
export const loginLocalUser = (email, password) => {
  try {
    const usersRaw = localStorage.getItem(LOCAL_USERS_KEY);
    const users = usersRaw ? JSON.parse(usersRaw) : [];

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      const err = new Error('No athlete account found with this email. Please create an account.');
      err.code = 'auth/user-not-found';
      throw err;
    }

    if (user.password !== password) {
      const err = new Error('Invalid email or password.');
      err.code = 'auth/wrong-password';
      throw err;
    }

    localStorage.setItem(GOOGLE_USER_SESSION_KEY, JSON.stringify(user));
    return user;
  } catch (e) {
    throw e;
  }
};
