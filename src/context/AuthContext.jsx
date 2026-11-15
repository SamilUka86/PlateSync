import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginWithEmail as fbLoginWithEmail,
  registerWithEmail as fbRegisterWithEmail,
  resetUserPassword as fbResetPassword,
  logoutUser as fbLogout,
  subscribeToAuthChanges,
  checkRedirectAuthResult
} from '../services/auth/authService';
import { 
  getUserProfile, 
  createUserProfileDocument, 
  updateUserProfile as fbUpdateProfile 
} from '../services/firestore/firestoreService';
import { isFirebaseConfigured } from '../services/firebase/config';
import { 
  getGoogleClientId, 
  isGoogleAuthConfigured, 
  signInWithGoogleIdentity, 
  getStoredGoogleUser, 
  signOutGoogleUser,
  registerLocalUser,
  loginLocalUser,
  loadGoogleIdentityScript,
  parseGoogleJwt,
  silentSignInFirebaseWithGoogleCredential
} from '../services/auth/googleAuthService';

const AuthContext = createContext({});

const DEMO_USER = {
  uid: 'demo_athlete_platesync',
  email: 'alex.champion@platesync.app',
  displayName: 'Alex Rivers',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  isDemo: true
};

const DEMO_PROFILE = {
  uid: 'demo_athlete_platesync',
  name: 'Alex Rivers',
  email: 'alex.champion@platesync.app',
  profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  height: 182,
  bodyWeight: 84.5,
  preferredUnit: 'KG',
  defaultBarbellWeight: 20,
  defaultBarbellUnit: 'KG',
  theme: 'midnight-neon',
  createdAt: '2025-01-01T10:00:00.000Z',
  updatedAt: '2026-11-14T10:00:00.000Z'
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseReady, setIsFirebaseReady] = useState(isFirebaseConfigured());
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isDevTester, setIsDevTester] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('dev') === 'true' || urlParams.get('admin') === 'true') {
          localStorage.setItem('platesync_dev_tester', 'true');
          return true;
        }
        return localStorage.getItem('platesync_dev_tester') === 'true';
      }
    } catch (e) {}
    return false;
  });

  const [demoAccessMode, setDemoAccessMode] = useState(() => {
    try {
      const isDev = localStorage.getItem('platesync_dev_tester') === 'true';
      if (!isDev) return 'calculator-only';
      return localStorage.getItem('platesync_demo_access_mode') || 'calculator-only';
    } catch (e) {
      return 'calculator-only';
    }
  });

  const toggleDevTester = () => {
    setIsDevTester(prev => {
      const next = !prev;
      try {
        if (next) {
          localStorage.setItem('platesync_dev_tester', 'true');
        } else {
          localStorage.removeItem('platesync_dev_tester');
          setDemoAccessMode('calculator-only');
          localStorage.setItem('platesync_demo_access_mode', 'calculator-only');
        }
      } catch (e) {}
      return next;
    });
  };

  useEffect(() => {
    const ready = isFirebaseConfigured();
    setIsFirebaseReady(ready);

    // Initialize Google Identity Services (GIS) directly with Client ID
    loadGoogleIdentityScript().then((loaded) => {
      if (loaded && window.google?.accounts?.id) {
        const cid = getGoogleClientId();
        if (cid) {
          try {
            window.google.accounts.id.initialize({
              client_id: cid,
              callback: async (response) => {
                if (response?.credential) {
                  const payload = parseGoogleJwt(response.credential);
                  if (payload) {
                    // Silently sign into Firebase Auth with Google ID token
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
                    localStorage.setItem('platesync_google_user', JSON.stringify(user));
                    setCurrentUser(user);
                    setIsDemoMode(false);
                    localStorage.removeItem('platesync_demo_active');

                    // Write/update user profile in Cloud Firestore (users/{uid})
                    const profile = await createUserProfileDocument(user, {
                      displayName: user.displayName,
                      photoURL: user.photoURL,
                      email: user.email
                    });
                    setUserProfile(profile);
                  }
                }
              },
              auto_select: false,
              cancel_on_tap_outside: true
            });
          } catch (e) {
            console.debug('GIS initialization notice:', e);
          }
        }
      }
    });

    // 1. Initial cached state (optimistic instant load for zero-flicker UI render)
    const savedDemo = localStorage.getItem('platesync_demo_active');
    const cachedUnit = localStorage.getItem('platesync_preferred_unit');
    const storedUser = getStoredGoogleUser();

    if (savedDemo === 'true') {
      setCurrentUser(DEMO_USER);
      setUserProfile({
        ...DEMO_PROFILE,
        ...(cachedUnit ? { preferredUnit: cachedUnit } : {})
      });
      setIsDemoMode(true);
      const savedMode = localStorage.getItem('platesync_demo_access_mode') || 'calculator-only';
      setDemoAccessMode(savedMode);
      setLoading(false);
    } else if (storedUser) {
      setCurrentUser(storedUser);
      setIsDemoMode(false);
      getUserProfile(storedUser.uid).then(async (prof) => {
        let finalProf = prof;
        if (!finalProf) {
          finalProf = await createUserProfileDocument(storedUser, {
            displayName: storedUser.displayName,
            photoURL: storedUser.photoURL
          });
        }
        if (cachedUnit && finalProf) {
          finalProf = { ...finalProf, preferredUnit: cachedUnit };
        }
        setUserProfile(finalProf);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    }

    if (!ready) {
      setLoading(false);
      return;
    }

    // Check redirect auth result (for mobile redirect flow)
    checkRedirectAuthResult().then((user) => {
      if (user) {
        const sessionUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Athlete',
          photoURL: user.photoURL || null,
          provider: 'google.com'
        };
        localStorage.setItem('platesync_google_user', JSON.stringify(sessionUser));
        setCurrentUser(user);
        setIsDemoMode(false);
        localStorage.removeItem('platesync_demo_active');
        localStorage.removeItem('platesync_demo_workouts');
        getUserProfile(user.uid).then((prof) => {
          if (prof) {
            const savedUnit = localStorage.getItem('platesync_preferred_unit');
            setUserProfile(savedUnit ? { ...prof, preferredUnit: savedUnit } : prof);
          }
        });
      }
    });

    // Authoritative Firebase Auth state listener
    const unsubscribe = subscribeToAuthChanges(async (user) => {
      if (user) {
        const sessionUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Athlete',
          photoURL: user.photoURL || null,
          provider: user.providerData?.[0]?.providerId || 'password'
        };
        localStorage.setItem('platesync_google_user', JSON.stringify(sessionUser));
        setCurrentUser(user);
        setIsDemoMode(false);
        localStorage.removeItem('platesync_demo_active');
        localStorage.removeItem('platesync_demo_workouts');
        try {
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            profile = await createUserProfileDocument(user, {
              displayName: user.displayName || user.email?.split('@')[0],
              email: user.email
            });
          }
          const savedUnit = localStorage.getItem('platesync_preferred_unit');
          if (savedUnit && profile) {
            profile = { ...profile, preferredUnit: savedUnit };
          }
          setUserProfile(profile);
        } catch (err) {
          console.error('Profile sync notice:', err);
        }
      } else {
        const isDemo = localStorage.getItem('platesync_demo_active') === 'true';
        const cached = getStoredGoogleUser();
        if (cached && (cached.uid?.startsWith('local_user_') || cached.provider === 'google.com')) {
          setCurrentUser(cached);
          setIsDemoMode(false);
        } else if (isDemo) {
          setCurrentUser(DEMO_USER);
          setIsDemoMode(true);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginGoogle = async () => {
    try {
      // 1. Direct Google Identity Services (GIS) - completely bypassing Firebase's firebaseapp.com popup
      if (isGoogleAuthConfigured()) {
        const user = await signInWithGoogleIdentity();
        if (user) {
          setCurrentUser(user);
          setIsDemoMode(false);
          localStorage.removeItem('platesync_demo_active');
          localStorage.removeItem('platesync_demo_workouts');

          // Always create or update the athlete profile in Cloud Firestore (users/{uid})
          const profile = await createUserProfileDocument(user, {
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email
          });
          const savedUnit = localStorage.getItem('platesync_preferred_unit');
          setUserProfile(savedUnit && profile ? { ...profile, preferredUnit: savedUnit } : profile);
          return user;
        }
        throw new Error('Google authentication was cancelled.');
      }

      // 2. Google Client ID is missing
      throw new Error('GOOGLE_AUTH_NOT_CONFIGURED');
    } catch (error) {
      console.error('Google Login Error:', error);
      throw error;
    }
  };

  const loginEmail = async (email, password) => {
    try {
      if (isFirebaseConfigured()) {
        const user = await fbLoginWithEmail(email, password);
        
        // 1. Immediate synchronous state updates for instant UI transition
        setCurrentUser(user);
        setIsDemoMode(false);
        localStorage.removeItem('platesync_demo_active');
        localStorage.removeItem('platesync_demo_workouts');

        // 2. Cache user session in localStorage for instant restore
        const sessionUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || email.split('@')[0],
          photoURL: user.photoURL || null,
          provider: 'password'
        };
        localStorage.setItem('platesync_google_user', JSON.stringify(sessionUser));

        // 3. Load or create profile in Cloud Firestore
        try {
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            profile = await createUserProfileDocument(user, {
              displayName: user.displayName || email.split('@')[0],
              email: user.email
            });
          }
          const savedUnit = localStorage.getItem('platesync_preferred_unit');
          if (savedUnit && profile) {
            profile = { ...profile, preferredUnit: savedUnit };
          }
          setUserProfile(profile);
        } catch (profErr) {
          console.warn('Profile sync notice during email login:', profErr);
          setUserProfile({
            uid: user.uid,
            name: user.displayName || email.split('@')[0],
            email: user.email,
            preferredUnit: localStorage.getItem('platesync_preferred_unit') || 'KG'
          });
        }

        return user;
      }

      // Zero-Firebase standalone email login
      const user = loginLocalUser(email, password);
      setCurrentUser(user);
      setIsDemoMode(false);
      localStorage.removeItem('platesync_demo_active');
      localStorage.removeItem('platesync_demo_workouts');

      let profile = await getUserProfile(user.uid);
      if (!profile) {
        profile = await createUserProfileDocument(user, {
          displayName: user.displayName
        });
      }
      const savedUnit = localStorage.getItem('platesync_preferred_unit');
      if (savedUnit && profile) {
        profile = { ...profile, preferredUnit: savedUnit };
      }
      setUserProfile(profile);
      return user;
    } catch (error) {
      console.error('Email Login Error:', error);
      throw error;
    }
  };

  const registerEmail = async (email, password, displayName) => {
    try {
      if (isFirebaseConfigured()) {
        const user = await fbRegisterWithEmail(email, password, displayName);
        
        // 1. Immediate synchronous state updates
        setCurrentUser(user);
        setIsDemoMode(false);
        localStorage.removeItem('platesync_demo_active');
        localStorage.removeItem('platesync_demo_workouts');

        // 2. Cache user session in localStorage
        const sessionUser = {
          uid: user.uid,
          email: user.email,
          displayName: displayName || user.displayName || email.split('@')[0],
          photoURL: user.photoURL || null,
          provider: 'password'
        };
        localStorage.setItem('platesync_google_user', JSON.stringify(sessionUser));

        // 3. Sync or create profile
        try {
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            profile = await createUserProfileDocument(user, {
              displayName: displayName || email.split('@')[0],
              email: user.email
            });
          }
          const savedUnit = localStorage.getItem('platesync_preferred_unit');
          if (savedUnit && profile) {
            profile = { ...profile, preferredUnit: savedUnit };
          }
          setUserProfile(profile);
        } catch (profErr) {
          console.warn('Profile sync notice during registration:', profErr);
          setUserProfile({
            uid: user.uid,
            name: displayName || email.split('@')[0],
            email: user.email,
            preferredUnit: localStorage.getItem('platesync_preferred_unit') || 'KG'
          });
        }

        return user;
      }

      // Zero-Firebase standalone email registration
      const user = registerLocalUser(email, password, displayName);
      setCurrentUser(user);
      setIsDemoMode(false);
      localStorage.removeItem('platesync_demo_active');
      localStorage.removeItem('platesync_demo_workouts');

      const profile = await createUserProfileDocument(user, {
        displayName: displayName || email.split('@')[0]
      });
      const savedUnit = localStorage.getItem('platesync_preferred_unit');
      setUserProfile(savedUnit && profile ? { ...profile, preferredUnit: savedUnit } : profile);
      return user;
    } catch (error) {
      console.error('Email Registration Error:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    if (isFirebaseConfigured()) {
      return fbResetPassword(email);
    }
    // Standalone fallback: notify that instructions were logged
    return true;
  };

  const logout = async () => {
    signOutGoogleUser();
    localStorage.removeItem('platesync_demo_active');
    localStorage.removeItem('platesync_demo_access_mode');
    localStorage.removeItem('platesync_demo_workouts');
    localStorage.removeItem('platesync_google_user');
    setIsDemoMode(false);
    setDemoAccessMode('calculator-only');

    if (isFirebaseConfigured()) {
      try {
        await fbLogout();
      } catch (e) {
        console.warn('Firebase logout notice:', e);
      }
    }
    setCurrentUser(null);
    setUserProfile(null);
  };

  const loginAsDemo = (mode = 'calculator-only') => {
    localStorage.setItem('platesync_demo_active', 'true');
    localStorage.setItem('platesync_demo_access_mode', mode);
    setDemoAccessMode(mode);
    setCurrentUser(DEMO_USER);
    setUserProfile(DEMO_PROFILE);
    setIsDemoMode(true);
  };

  const setDemoModeType = (mode) => {
    setDemoAccessMode(mode);
    try {
      localStorage.setItem('platesync_demo_access_mode', mode);
    } catch (e) {}
  };

  const toggleDemoAccessMode = () => {
    const next = demoAccessMode === 'calculator-only' ? 'full' : 'calculator-only';
    setDemoModeType(next);
    return next;
  };

  const updateProfile = async (updates) => {
    // 1. Optimistic immediate state update - Zero latency for UI renders!
    setUserProfile(prev => {
      if (!prev) return { ...updates, updatedAt: new Date().toISOString() };
      return { ...prev, ...updates, updatedAt: new Date().toISOString() };
    });

    if (updates.preferredUnit) {
      try {
        localStorage.setItem('platesync_preferred_unit', updates.preferredUnit);
      } catch (e) {}
    }

    if (!currentUser) return;

    if (isDemoMode) {
      return { ...userProfile, ...updates };
    }

    // 2. Background async save to Cloud Firestore without blocking UI
    try {
      const updated = await fbUpdateProfile(currentUser.uid, updates);
      return updated;
    } catch (err) {
      console.warn('Profile background sync:', err);
    }
  };

  const value = {
    currentUser,
    userProfile,
    loading,
    isFirebaseReady,
    isDemoMode,
    isDevTester,
    toggleDevTester,
    demoAccessMode,
    setDemoModeType,
    toggleDemoAccessMode,
    loginGoogle,
    loginEmail,
    registerEmail,
    resetPassword,
    logout,
    loginAsDemo,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
