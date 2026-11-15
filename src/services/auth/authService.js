import {
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../firebase/config';
import { createUserProfileDocument } from '../firestore/firestoreService';
import { endUserSession } from '../analytics/activityTracker';

/**
 * Comprehensive check for mobile devices, tablets, and standalone PWA environments
 */
export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const ua = navigator.userAgent || navigator.vendor || window.opera || '';
  const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(ua);
  const isStandalone = window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
  const isTouchScreen = (navigator.maxTouchPoints > 1 || 'ontouchstart' in window) && window.innerWidth <= 1024;
  return Boolean(isMobileUA || isStandalone || isTouchScreen);
};

/**
 * Handle Google Sign-In with mobile redirect & desktop popup
 */
export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured() || !auth || !googleProvider) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }

  const onMobile = isMobileDevice();

  // 1. Mobile devices & standalone PWAs: signInWithRedirect is the official standard
  // It completely bypasses popup-blockers, multi-tab context detachment, and mobile FedCM restrictions
  if (onMobile) {
    try {
      await signInWithRedirect(auth, googleProvider);
      return { redirecting: true };
    } catch (redirectErr) {
      console.error('Mobile Google Redirect Error:', redirectErr);
      throw redirectErr;
    }
  }

  // 2. Desktop environments: attempt fast non-reloading popup first
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await createUserProfileDocument(user, {
      displayName: user.displayName || 'Athlete',
      photoURL: user.photoURL || null,
      email: user.email
    });

    return user;
  } catch (error) {
    // If desktop popup is blocked by browser or extension, seamlessly fallback to redirect
    if (
      error.code === 'auth/popup-blocked' || 
      error.code === 'auth/popup-closed-by-user' ||
      error.code === 'auth/cancelled-popup-request'
    ) {
      console.info('Desktop popup blocked or closed, falling back to Google redirect flow...');
      try {
        await signInWithRedirect(auth, googleProvider);
        return { redirecting: true };
      } catch (redirectErr) {
        throw redirectErr;
      }
    }
    console.error('Google Auth Error:', error);
    throw error;
  }
};

/**
 * Check for pending redirect result after page load (mobile authentication callback)
 */
export const checkRedirectAuthResult = async () => {
  if (!isFirebaseConfigured() || !auth) return null;
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      await createUserProfileDocument(result.user, {
        displayName: result.user.displayName || 'Athlete',
        photoURL: result.user.photoURL || null,
        email: result.user.email
      });
      return result.user;
    }
    return null;
  } catch (err) {
    console.error('Error fetching redirect auth result:', err);
    return { error: err };
  }
};

/**
 * Register with Email and Password
 */
export const registerWithEmail = async (email, password, displayName) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (displayName) {
      await updateProfile(user, { displayName });
    }

    await createUserProfileDocument(user, {
      displayName: displayName || email.split('@')[0],
      email: user.email
    });

    return user;
  } catch (error) {
    console.error('Email Registration Error:', error);
    throw error;
  }
};

/**
 * Login with Email and Password
 */
export const loginWithEmail = async (email, password) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Immediately synchronize authentic Firebase Authenticator metadata to Firestore
    try {
      await createUserProfileDocument(user, {
        displayName: user.displayName || email.split('@')[0],
        email: user.email
      });
    } catch (syncErr) {
      console.warn('Profile sync notice on email login:', syncErr);
    }

    return user;
  } catch (error) {
    console.error('Email Login Error:', error);
    throw error;
  }
};

/**
 * Dispatch Password Reset Email
 */
export const resetUserPassword = async (email) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error('Password Reset Error:', error);
    throw error;
  }
};

/**
 * Sign Out
 */
export const logoutUser = async () => {
  if (!isFirebaseConfigured() || !auth) {
    return true;
  }
  try {
    if (auth.currentUser) {
      await endUserSession(auth.currentUser, 'LOGOUT');
    }
  } catch (e) {}
  return signOut(auth);
};

/**
 * Subscribe to Auth State Changes
 * Automatically keeps Firestore user record synchronized with Firebase Authenticator
 */
export const subscribeToAuthChanges = (callback) => {
  if (!isFirebaseConfigured() || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        await createUserProfileDocument(user, {
          displayName: user.displayName || user.email?.split('@')[0],
          email: user.email
        });
      } catch (err) {}
    }
    callback(user);
  });
};
