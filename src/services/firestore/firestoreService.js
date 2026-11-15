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
 */
export const createUserProfileDocument = async (user, additionalData = {}) => {
  if (!user) return null;

  const defaultProfile = {
    uid: user.uid,
    name: user.displayName || additionalData.displayName || 'Athlete',
    email: user.email || '',
    profileImage: user.photoURL || null,
    height: 178, // in cm
    bodyWeight: 75, // in kg
    preferredUnit: 'KG', // 'KG' | 'LB'
    defaultBarbellWeight: 20,
    defaultBarbellUnit: 'KG',
    theme: 'midnight-neon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
        updatedAt: serverTimestamp()
      });
      return defaultProfile;
    } else {
      return { id: snap.id, ...snap.data() };
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
