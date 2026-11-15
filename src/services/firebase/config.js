import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  browserLocalPersistence, 
  setPersistence 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

/**
 * PlateSync - Firebase Configuration
 * Midnight Neon Theme Platform
 * Reads from Vite env (VITE_FIREBASE_*) with localStorage fallback.
 */

const getStoredConfig = () => {
  try {
    const raw = localStorage.getItem('platesync_firebase_config');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const localConfig = getStoredConfig();

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localConfig?.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localConfig?.authDomain || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localConfig?.projectId || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localConfig?.storageBucket || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localConfig?.messagingSenderId || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || localConfig?.appId || ""
};

export const isFirebaseConfigured = () => {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    !firebaseConfig.apiKey.includes('YOUR_') &&
    firebaseConfig.apiKey.length > 10
  );
};

let app = null;
let auth = null;
let db = null;
let googleProvider = null;

if (isFirebaseConfigured()) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Persistence initialization notice:', err);
    });
  } catch (err) {
    console.error('Firebase initialization error:', err);
  }
}

export const googleClientId = 
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  (typeof localStorage !== 'undefined' ? localStorage.getItem('platesync_google_client_id') : '') || 
  '1073911515845-eoatnga7oblfb7qkcnspsnoqjg5i73r0.apps.googleusercontent.com';

export { app, auth, db, googleProvider };

export const saveRuntimeFirebaseConfig = (cfg) => {
  localStorage.setItem('platesync_firebase_config', JSON.stringify(cfg));
  window.location.reload();
};

export const clearRuntimeFirebaseConfig = () => {
  localStorage.removeItem('platesync_firebase_config');
  window.location.reload();
};
