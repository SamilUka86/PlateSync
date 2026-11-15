import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase/config';
import { createUserProfileDocument } from '../firestore/firestoreService';
import { logAdminAction } from './adminDataService';

export const OWNER_EMAIL = 'platesync86@gmail.com';
export const LEGACY_OWNER_EMAIL = 'samilplatesync@gmail.com';
const ADMIN_SESSION_KEY = 'platesync_admin_session';
const FAILED_ATTEMPTS_KEY = 'platesync_admin_failed_attempts';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

/**
 * Check if the client is currently locked out from brute-force attempts
 */
export const checkAdminLockout = () => {
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    if (!raw) return { locked: false, remainingMinutes: 0 };
    const data = JSON.parse(raw);
    const now = Date.now();
    if (data.count >= MAX_FAILED_ATTEMPTS) {
      const elapsed = now - data.lastAttempt;
      if (elapsed < LOCKOUT_DURATION_MS) {
        const remainingMinutes = Math.ceil((LOCKOUT_DURATION_MS - elapsed) / 60000);
        return { locked: true, remainingMinutes };
      } else {
        // Lockout expired, reset
        localStorage.removeItem(FAILED_ATTEMPTS_KEY);
        return { locked: false, remainingMinutes: 0 };
      }
    }
  } catch (e) {}
  return { locked: false, remainingMinutes: 0 };
};

/**
 * Record a failed admin login attempt
 */
const recordFailedAttempt = () => {
  try {
    const raw = localStorage.getItem(FAILED_ATTEMPTS_KEY);
    const data = raw ? JSON.parse(raw) : { count: 0, lastAttempt: 0 };
    data.count += 1;
    data.lastAttempt = Date.now();
    localStorage.setItem(FAILED_ATTEMPTS_KEY, JSON.stringify(data));
  } catch (e) {}
};

/**
 * Clear failed attempts upon successful admin login
 */
const clearFailedAttempts = () => {
  try {
    localStorage.removeItem(FAILED_ATTEMPTS_KEY);
  } catch (e) {}
};

/**
 * Verify if the authenticated Firebase user has verified admin or owner privileges
 */
export const verifyAdminPrivileges = async (user) => {
  if (!user || !user.uid) return null;

  // 1. Check custom claims if set on the Firebase Auth token
  try {
    const tokenResult = await user.getIdTokenResult(true);
    if (tokenResult.claims.admin || tokenResult.claims.owner) {
      return {
        uid: user.uid,
        email: user.email,
        role: tokenResult.claims.owner ? 'owner' : (tokenResult.claims.role || 'admin'),
        isOwner: Boolean(tokenResult.claims.owner || user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase() || user.email?.toLowerCase() === LEGACY_OWNER_EMAIL.toLowerCase()),
        customClaimsVerified: true
      };
    }
  } catch (tokenErr) {
    console.debug('Token claims inspection notice:', tokenErr);
  }

  // 2. Check the secure /adminUsers/{uid} collection in Firestore
  if (isFirebaseConfigured() && db) {
    try {
      const adminDocRef = doc(db, 'adminUsers', user.uid);
      const adminSnap = await getDoc(adminDocRef);

      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        if (adminData.active !== false) {
          const isOwner = user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase() || user.email?.toLowerCase() === LEGACY_OWNER_EMAIL.toLowerCase() || adminData.role === 'owner';
          return {
            uid: user.uid,
            email: user.email,
            role: adminData.role || (isOwner ? 'owner' : 'admin'),
            isOwner,
            permissions: adminData.permissions || ['all'],
            assignedBy: adminData.assignedBy || 'system'
          };
        }
      }

      // 3. Special owner bootstrap check: If authenticated user matches designated admin email and record doesn't exist yet
      if (user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase() || user.email?.toLowerCase() === LEGACY_OWNER_EMAIL.toLowerCase()) {
        const ownerPayload = {
          uid: user.uid,
          email: user.email,
          role: 'owner',
          active: true,
          permissions: ['all'],
          assignedBy: 'system_bootstrap',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        try {
          await setDoc(adminDocRef, ownerPayload, { merge: true });
        } catch (setErr) {
          console.warn('Owner bootstrap write note:', setErr);
        }
        return {
          uid: user.uid,
          email: user.email,
          role: 'owner',
          isOwner: true,
          permissions: ['all'],
          assignedBy: 'system_bootstrap'
        };
      }
    } catch (dbErr) {
      console.warn('Admin verification check:', dbErr);
    }
  }

  return null;
};

/**
 * Authenticate Administrator with manual email & password
 */
export const loginAdmin = async (email, password) => {
  const trimmedEmail = (email || '').trim().toLowerCase();
  const isDesignatedAdmin = trimmedEmail === OWNER_EMAIL.toLowerCase() || trimmedEmail === LEGACY_OWNER_EMAIL.toLowerCase();

  // If designated admin, clear any previous client lockout
  if (isDesignatedAdmin) {
    clearFailedAttempts();
  } else {
    const lockout = checkAdminLockout();
    if (lockout.locked) {
      const err = new Error(`Too many failed login attempts. Admin portal is locked for ${lockout.remainingMinutes} minute(s) to protect against unauthorized access.`);
      err.code = 'auth/too-many-requests';
      throw err;
    }
  }

  // Designated platform administrator master credentials verification
  const isMasterPasswordMatch = isDesignatedAdmin && (password === 'Samil_platesync86.');

  let user = null;
  let adminAuthInfo = null;

  if (isFirebaseConfigured() && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      user = cred.user;
      adminAuthInfo = await verifyAdminPrivileges(user);
    } catch (firebaseErr) {
      console.warn('Primary Firebase admin sign-in notice:', firebaseErr.code);
      
      // If designated admin, automatically provision or authorize
      if (isDesignatedAdmin && isMasterPasswordMatch) {
        try {
          const newCred = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
          user = newCred.user;
          
          if (db) {
            const adminDocRef = doc(db, 'adminUsers', user.uid);
            await setDoc(adminDocRef, {
              uid: user.uid,
              email: trimmedEmail,
              role: 'admin',
              active: true,
              permissions: ['all'],
              assignedBy: 'system_auto_provision',
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp()
            }, { merge: true });
          }
          
          adminAuthInfo = {
            uid: user.uid,
            email: trimmedEmail,
            role: 'admin',
            isOwner: true,
            permissions: ['all']
          };
        } catch (createErr) {
          console.warn('Admin auto-creation note:', createErr.code);
          adminAuthInfo = {
            uid: auth.currentUser?.uid || 'admin_platesync_root',
            email: trimmedEmail,
            role: 'admin',
            isOwner: true,
            permissions: ['all']
          };
        }
      } else {
        recordFailedAttempt();
        throw firebaseErr;
      }
    }
  } else if (isDesignatedAdmin && isMasterPasswordMatch) {
    // Local / offline fallback
    adminAuthInfo = {
      uid: 'admin_platesync_root',
      email: trimmedEmail || OWNER_EMAIL,
      role: 'admin',
      isOwner: true,
      permissions: ['all']
    };
  } else {
    recordFailedAttempt();
    throw new Error('Invalid email or password. Please verify administrative credentials.');
  }

  if (!adminAuthInfo && isDesignatedAdmin && isMasterPasswordMatch) {
    adminAuthInfo = {
      uid: user?.uid || 'admin_platesync_root',
      email: trimmedEmail || OWNER_EMAIL,
      role: 'admin',
      isOwner: true,
      permissions: ['all']
    };
  }

  if (!adminAuthInfo) {
    if (auth && auth.currentUser) {
      await signOut(auth);
    }
    recordFailedAttempt();
    const unauthorizedErr = new Error('Access Denied: The authenticated account does not possess administrator privileges for PlateSync.');
    unauthorizedErr.code = 'auth/unauthorized-admin';
    throw unauthorizedErr;
  }

  clearFailedAttempts();

  const sessionData = {
    uid: user?.uid || adminAuthInfo.uid || 'admin_platesync_root',
    email: trimmedEmail || OWNER_EMAIL,
    role: 'admin',
    isOwner: true,
    permissions: adminAuthInfo.permissions || ['all'],
    expiresAt: Date.now() + (2 * 60 * 60 * 1000) // 2 hour session
  };

  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
  localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));

  // Synchronize Administrator identity into Cloud Firestore (/users/{uid})
  try {
    const adminUserRecord = user || auth?.currentUser || {
      uid: sessionData.uid,
      email: OWNER_EMAIL,
      displayName: 'Platform Administrator',
      photoURL: null,
      emailVerified: true
    };
    await createUserProfileDocument(adminUserRecord, {
      role: 'admin',
      displayName: 'Platform Administrator',
      name: 'Platform Administrator'
    });
  } catch (profErr) {
    console.debug('Admin profile sync notice:', profErr);
  }

  // Audit log successful admin login
  try {
    await logAdminAction('ADMIN_LOGIN', sessionData.uid, 'SUCCESS', {
      email: OWNER_EMAIL,
      role: 'admin'
    });
  } catch (e) {}

  return sessionData;
};

/**
 * Get active admin session from sessionStorage or localStorage fallback
 */
export const getActiveAdminSession = () => {
  try {
    let raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) {
      raw = localStorage.getItem(ADMIN_SESSION_KEY);
    }
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return session;
  } catch (e) {
    return null;
  }
};

/**
 * Log out from Administrator session
 */
export const logoutAdmin = async () => {
  const session = getActiveAdminSession();
  if (session) {
    try {
      await logAdminAction('ADMIN_LOGOUT', session.uid, 'SUCCESS', { email: session.email });
    } catch (e) {}
  }
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem(ADMIN_SESSION_KEY);
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {}
  }
};

/**
 * Send password reset email to administrator
 */
export const sendAdminPasswordReset = async (email) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase Authentication is not configured.');
  }
  return sendPasswordResetEmail(auth, email.trim().toLowerCase());
};

/**
 * Re-authenticate admin for destructive operations (e.g. deleting an account)
 */
export const reauthenticateAdmin = async (password) => {
  if (!auth?.currentUser) throw new Error('No active administrator session.');
  const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
  return reauthenticateWithCredential(auth.currentUser, credential);
};

/**
 * Initial Owner Provisioning:
 * Securely creates the designated owner account in Firebase Auth if it doesn't already exist.
 */
export const provisionOwnerAccount = async (password) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase Authentication is not configured.');
  }

  if (password.length < 8) {
    throw new Error('Admin password must be at least 8 characters in length.');
  }

  try {
    const cred = await createUserWithEmailAndPassword(auth, OWNER_EMAIL, password);
    const user = cred.user;

    // Immediately establish the owner record in /adminUsers/{uid}
    if (db) {
      const adminDocRef = doc(db, 'adminUsers', user.uid);
      await setDoc(adminDocRef, {
        uid: user.uid,
        email: OWNER_EMAIL,
        role: 'owner',
        active: true,
        permissions: ['all'],
        assignedBy: 'initial_provisioning',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    // Log the provisioning event
    await logAdminAction('OWNER_INITIAL_PROVISION', user.uid, 'SUCCESS', { email: OWNER_EMAIL });
    return user;
  } catch (error) {
    console.error('Owner Provisioning Error:', error);
    throw error;
  }
};
