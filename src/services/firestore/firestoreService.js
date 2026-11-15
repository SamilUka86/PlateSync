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

  const payload = {
    ...workoutData,
    userId,
    createdAt: workoutData.date || workoutData.createdAt || new Date().toISOString()
  };

  if (!isFirebaseConfigured() || !db) {
    const localList = getLocalItem(`workouts_${userId}`, []);
    const tempId = workoutData.id || `local_${Date.now()}`;
    const localSaved = { id: tempId, ...payload };
    setLocalItem(`workouts_${userId}`, [localSaved, ...localList.filter(w => w.id !== tempId)]);
    return localSaved;
  }

  try {
    const colRef = collection(db, 'users', userId, 'workouts');
    const docRef = await addDoc(colRef, {
      ...payload,
      createdAt: serverTimestamp()
    });
    const saved = { id: docRef.id, ...payload };
    const localList = getLocalItem(`workouts_${userId}`, []);
    setLocalItem(`workouts_${userId}`, [saved, ...localList.filter(w => w.id !== docRef.id && w.id !== workoutData.id)]);
    return saved;
  } catch (err) {
    console.warn('Firestore save notice, falling back to local:', err);
    const localList = getLocalItem(`workouts_${userId}`, []);
    const tempId = workoutData.id || `local_${Date.now()}`;
    const localSaved = { id: tempId, ...payload };
    setLocalItem(`workouts_${userId}`, [localSaved, ...localList.filter(w => w.id !== tempId)]);
    return localSaved;
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
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    // If Firestore query succeeded and returned 0 documents, user has 0 workouts!
    if (snapshot.empty) {
      setLocalItem(`workouts_${userId}`, []);
      return [];
    }

    const remoteWorkouts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate().toISOString() : doc.data().createdAt || new Date().toISOString()
    }));
    setLocalItem(`workouts_${userId}`, remoteWorkouts);
    return remoteWorkouts;
  } catch (err) {
    console.warn('Notice reading from Firestore, using local cache:', err);
    return localWorkouts;
  }
};

export const deleteWorkoutSession = async (userId, workoutId) => {
  if (!userId || !workoutId) return false;
  const localWorkouts = getLocalItem(`workouts_${userId}`, []);
  const remaining = localWorkouts.filter(w => w.id !== workoutId);
  setLocalItem(`workouts_${userId}`, remaining);

  // Clean any legacy keys if present
  try {
    const legacy = getLocalItem('workouts_local', []);
    if (legacy && legacy.length > 0) {
      setLocalItem('workouts_local', legacy.filter(w => w.id !== workoutId));
    }
  } catch (e) {}

  if (!isFirebaseConfigured() || !db) return true;

  try {
    const docRef = doc(db, 'users', userId, 'workouts', workoutId);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.warn('Firestore delete notice:', err);
    return true;
  }
};
