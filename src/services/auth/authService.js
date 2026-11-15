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
 * Check if current user is on mobile browser
 */
const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Handle Google Sign-In with popup & mobile redirect fallback
 */
export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured() || !auth || !googleProvider) {
    throw new Error('FIREBASE_NOT_CONFIGURED');
  }

  try {
    // Attempt popup first (works on desktop and modern mobile)
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    await createUserProfileDocument(user, {
      displayName: user.displayName || 'Athlete',
      photoURL: user.photoURL || null
    });

    return user;
  } catch (error) {
    // If popup is blocked by mobile browser, fallback to redirect
    if (error.code === 'auth/popup-blocked' && isMobileDevice()) {
      await signInWithRedirect(auth, googleProvider);
      return null;
    }
    console.error('Google Auth Error:', error);
    throw error;
  }
};

/**
 * Check for pending redirect result after page load
 */
export const checkRedirectAuthResult = async () => {
  if (!isFirebaseConfigured() || !auth) return null;
  try {
    const result = await getRedirectResult(auth);
    if (result && result.user) {
      await createUserProfileDocument(result.user, {
        displayName: result.user.displayName || 'Athlete',
        photoURL: result.user.photoURL || null
      });
      return result.user;
    }
    return null;
  } catch (err) {
    console.error('Error fetching redirect auth result:', err);
    return null;
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
