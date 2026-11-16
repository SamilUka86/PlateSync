import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../firebase/config';

// Offline cache prefix for resilience
const LOCAL_STORAGE_PREFIX = 'platesync_v2_';

const getLocalItem = (key, fallback) => {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setLocalItem = (key, data) => {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_PREFIX}${key}`, JSON.stringify(data));
  } catch (e) {}
};

/**
 * 1. User Profile Document
 * Synchronizes authentic Firebase Authenticator identity & metadata to Cloud Firestore (/users/{uid})
 */
export const createUserProfileDocument = async (user, additionalData = {}) => {
  if (!user || !user.uid) return null;

  const authProvider = user.providerData && user.providerData.length > 0 
    ? user.providerData[0].providerId 
    : (user.provider || (user.email ? 'password' : 'custom'));

  const creationTime = user.metadata?.creationTime || user.createdAt || new Date().toISOString();
  const lastSignInTime = user.metadata?.lastSignInTime || user.lastLogin || new Date().toISOString();
  const isEmailVerified = Boolean(user.emailVerified);

  const defaultProfile = {
    uid: user.uid,
    name: user.displayName || additionalData.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Athlete'),
    displayName: user.displayName || additionalData.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Athlete'),
    email: user.email || '',
    profileImage: user.photoURL || additionalData.photoURL || null,
    photoURL: user.photoURL || additionalData.photoURL || null,
    height: 178, // in cm
    bodyWeight: 75, // in kg
    preferredUnit: 'KG', // 'KG' | 'LB'
    defaultBarbellWeight: 20,
    defaultBarbellUnit: 'KG',
    theme: 'midnight-neon',
    createdAt: creationTime,
    updatedAt: new Date().toISOString(),
    authProvider,
    authCreationTime: creationTime,
    authLastSignInTime: lastSignInTime,
    emailVerified: isEmailVerified,
    status: 'active',
    source: 'Firebase Authenticator',
    ...additionalData
  };

  if (!isFirebaseConfigured() || !db) {
    setLocalItem(`profile_${user.uid}`, defaultProfile);
    return defaultProfile;
  }

  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        ...defaultProfile,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      return defaultProfile;
    } else {
      const existing = snap.data();
      const updates = {
        lastLogin: serverTimestamp(),
        authLastSignInTime: lastSignInTime,
        emailVerified: Boolean(user.emailVerified !== undefined ? user.emailVerified : existing.emailVerified)
      };

      if (user.displayName && user.displayName !== existing.name) {
        updates.name = user.displayName;
        updates.displayName = user.displayName;
      }
      if (user.photoURL && user.photoURL !== existing.profileImage) {
        updates.profileImage = user.photoURL;
        updates.photoURL = user.photoURL;
      }
      if (user.email && user.email !== existing.email) updates.email = user.email;
      if (authProvider && !existing.authProvider) updates.authProvider = authProvider;
      if (!existing.authCreationTime) updates.authCreationTime = creationTime;
      if (additionalData.role && additionalData.role !== existing.role) updates.role = additionalData.role;

      updates.updatedAt = serverTimestamp();
      await updateDoc(userRef, updates);
      return { id: snap.id, ...existing, ...updates };
    }
  } catch (error) {
    console.warn('Firestore profile access notice (offline fallback used):', error);
    setLocalItem(`profile_${user.uid}`, defaultProfile);
    return defaultProfile;
  }
};

export const getUserProfile = async (userId) => {
  if (!userId) return null;

  if (!isFirebaseConfigured() || !db) {
    return getLocalItem(`profile_${userId}`, null);
  }

  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
    return getLocalItem(`profile_${userId}`, null);
  } catch (error) {
    return getLocalItem(`profile_${userId}`, null);
  }
};

export const updateUserProfile = async (userId, updates) => {
  if (!userId) return false;

  const currentLocal = getLocalItem(`profile_${userId}`, {});
  const updatedLocal = { ...currentLocal, ...updates, updatedAt: new Date().toISOString() };
  setLocalItem(`profile_${userId}`, updatedLocal);

  if (!isFirebaseConfigured() || !db) {
    return updatedLocal;
  }

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return updatedLocal;
  } catch (error) {
    console.error('Error updating profile in Firestore:', error);
    return updatedLocal;
  }
};

/**
 * 2. Workout Sessions
 */
export const saveWorkoutSession = async (userId, workoutData) => {
  if (!userId) throw new Error('User ID required');

  const workoutId = workoutData.id || `w_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const payload = {
    ...workoutData,
    id: workoutId,
    userId,
    createdAt: workoutData.date || workoutData.createdAt || new Date().toISOString()
  };

  // Immediate local cache update
  const localList = getLocalItem(`workouts_${userId}`, []);
  const updatedLocal = [payload, ...localList.filter(w => w.id !== workoutId)];
  setLocalItem(`workouts_${userId}`, updatedLocal);

  if (!isFirebaseConfigured() || !db) {
    return payload;
  }

  try {
    // Use setDoc so document ID in Firestore matches workoutId 100%
    const docRef = doc(db, 'users', userId, 'workouts', workoutId);
    await setDoc(docRef, {
      ...payload,
      createdAt: serverTimestamp()
    }, { merge: true });
    return payload;
  } catch (err) {
    console.warn('Firestore save notice, preserved locally:', err);
    return payload;
  }
};

export const getUserWorkouts = async (userId) => {
  if (!userId) return [];
  const localWorkouts = getLocalItem(`workouts_${userId}`, []);

  if (!isFirebaseConfigured() || !db) {
    return localWorkouts;
  }

  try {
    const colRef = collection(db, 'users', userId, 'workouts');
    let snapshot;
    try {
      const q = query(colRef, orderBy('createdAt', 'desc'));
      snapshot = await getDocs(q);
    } catch (indexErr) {
      snapshot = await getDocs(colRef);
    }

    // If Firestore connected successfully and returned 0 documents, user has 0 workouts!
    if (snapshot.empty) {
      setLocalItem(`workouts_${userId}`, []);
      return [];
    }

    const remoteWorkouts = snapshot.docs.map(doc => {
      const data = doc.data() || {};
      return {
        ...data,
        // CRITICAL: id must be doc.id so deleteDoc(doc(..., id)) will always match!
        id: doc.id,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || new Date().toISOString()
      };
    });

    remoteWorkouts.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));

    setLocalItem(`workouts_${userId}`, remoteWorkouts);
    return remoteWorkouts;
  } catch (err) {
    console.warn('Notice reading from Firestore, using local cache:', err);
    return localWorkouts;
  }
};

export const deleteWorkoutSession = async (userId, workoutId) => {
  if (!userId || !workoutId) return false;

  // 1. Immediately delete from local cache
  const localWorkouts = getLocalItem(`workouts_${userId}`, []);
  const remaining = localWorkouts.filter(w => w.id !== workoutId && w._origId !== workoutId);
  setLocalItem(`workouts_${userId}`, remaining);

  // Clean any legacy keys if present
  try {
    const legacy = getLocalItem('workouts_local', []);
    if (legacy && legacy.length > 0) {
      setLocalItem('workouts_local', legacy.filter(w => w.id !== workoutId));
    }
  } catch (e) {}

  if (!isFirebaseConfigured() || !db) return true;

  // 2. Delete from Firestore
  try {
    // Delete direct document by workoutId
    const docRef = doc(db, 'users', userId, 'workouts', workoutId);
    await deleteDoc(docRef);

    // Also check and delete any document where internal id matches workoutId
    try {
      const colRef = collection(db, 'users', userId, 'workouts');
      const q = query(colRef, where('id', '==', workoutId));
      const snap = await getDocs(q);
      const deletePromises = snap.docs.map(d => deleteDoc(d.ref));
      await Promise.all(deletePromises);
    } catch (subErr) {}

    return true;
  } catch (err) {
    console.warn('Firestore delete notice:', err);
    return true;
  }
};

/**
 * 3. Weekly Workout Routine Planner
 */
export const saveWeeklyRoutine = async (userId, weeklyPlan) => {
  if (!userId || !weeklyPlan) return false;
  setLocalItem(`weekly_plan_${userId}`, weeklyPlan);

  if (!isFirebaseConfigured() || !db) return true;

  try {
    const docRef = doc(db, 'users', userId, 'planner', 'weekly');
    await setDoc(docRef, {
      weeklyPlan,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    console.warn('Firestore weekly routine save notice:', err);
    return true;
  }
};

export const getWeeklyRoutine = async (userId) => {
  if (!userId) return null;
  const localPlan = getLocalItem(`weekly_plan_${userId}`, null);

  if (!isFirebaseConfigured() || !db) {
    return localPlan;
  }

  try {
    const docRef = doc(db, 'users', userId, 'planner', 'weekly');
    const snap = await getDoc(docRef);
    if (snap.exists() && snap.data()?.weeklyPlan) {
      const remotePlan = snap.data().weeklyPlan;
      setLocalItem(`weekly_plan_${userId}`, remotePlan);
      return remotePlan;
    }
    return localPlan;
  } catch (err) {
    console.warn('Firestore weekly routine get notice:', err);
    return localPlan;
  }
};

/**
 * 4. Body Weight Logs Tracker
 */
const KG_TO_LBS_CONST = 2.2046226218;

export const saveWeightLog = async (userId, weightEntry) => {
  if (!userId) throw new Error('User ID required');
  const entryId = weightEntry.id || `bw_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  const rawUnit = (weightEntry.unit || 'KG').toUpperCase();
  const unit = (rawUnit === 'LB' || rawUnit === 'LBS') ? 'LBS' : 'KG';
  const weightVal = Number(weightEntry.weight) || 0;
  const weightKg = unit === 'LBS' ? Math.round((weightVal / KG_TO_LBS_CONST) * 100) / 100 : Math.round(weightVal * 100) / 100;
  const weightLb = unit === 'KG' ? Math.round((weightVal * KG_TO_LBS_CONST) * 100) / 100 : Math.round(weightVal * 100) / 100;

  const payload = {
    id: entryId,
    userId,
    date: weightEntry.date || new Date().toISOString().split('T')[0],
    weight: weightVal,
    unit,
    weightKg,
    weightLb,
    notes: weightEntry.notes || '',
    createdAt: weightEntry.createdAt || new Date().toISOString()
  };

  // 1. Immediate Local Storage cache
  const localLogs = getLocalItem(`weight_logs_${userId}`, []);
  const updatedLogs = [payload, ...localLogs.filter(l => l.id !== entryId)];
  updatedLogs.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
  setLocalItem(`weight_logs_${userId}`, updatedLogs);

  // Update profile bodyWeight cache
  const currentProfile = getLocalItem(`profile_${userId}`, {});
  if (currentProfile) {
    setLocalItem(`profile_${userId}`, {
      ...currentProfile,
      bodyWeight: weightKg,
      updatedAt: new Date().toISOString()
    });
  }

  if (!isFirebaseConfigured() || !db) {
    return payload;
  }

  // 2. Cloud Firestore
  try {
    const docRef = doc(db, 'users', userId, 'weight_logs', entryId);
    await setDoc(docRef, {
      ...payload,
      createdAt: serverTimestamp()
    }, { merge: true });

    // Update bodyWeight on users/{userId}
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      bodyWeight: weightKg,
      updatedAt: serverTimestamp()
    });

    return payload;
  } catch (err) {
    console.warn('Firestore weight log save notice, cached locally:', err);
    return payload;
  }
};

export const getWeightLogs = async (userId) => {
  if (!userId) return [];
  const localLogs = getLocalItem(`weight_logs_${userId}`, []);

  if (!isFirebaseConfigured() || !db) {
    return localLogs;
  }

  try {
    const colRef = collection(db, 'users', userId, 'weight_logs');
    let snapshot;
    try {
      const q = query(colRef, orderBy('date', 'desc'));
      snapshot = await getDocs(q);
    } catch (indexErr) {
      snapshot = await getDocs(colRef);
    }

    if (snapshot.empty) {
      return localLogs;
    }

    const remoteLogs = snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    remoteLogs.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    setLocalItem(`weight_logs_${userId}`, remoteLogs);
    return remoteLogs;
  } catch (err) {
    console.warn('Firestore weight logs read notice:', err);
    return localLogs;
  }
};

export const deleteWeightLog = async (userId, entryId) => {
  if (!userId || !entryId) return false;

  const localLogs = getLocalItem(`weight_logs_${userId}`, []);
  const remaining = localLogs.filter(l => l.id !== entryId);
  setLocalItem(`weight_logs_${userId}`, remaining);

  if (!isFirebaseConfigured() || !db) return true;

  try {
    const docRef = doc(db, 'users', userId, 'weight_logs', entryId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Firestore weight log delete notice:', err);
    return true;
  }
};

