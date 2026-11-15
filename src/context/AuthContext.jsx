import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginWithGoogle as fbLoginWithGoogle,
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

    // Check saved demo mode
    const savedDemo = localStorage.getItem('platesync_demo_active');
    const cachedUnit = localStorage.getItem('platesync_preferred_unit');
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
      return;
    }

    if (!ready) {
      setLoading(false);
      return;
    }

    // Check redirect auth result (for mobile redirect flow)
    checkRedirectAuthResult().then((user) => {
      if (user) {
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

    const unsubscribe = subscribeToAuthChanges(async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsDemoMode(false);
        localStorage.removeItem('platesync_demo_active');
        localStorage.removeItem('platesync_demo_workouts');
        try {
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            profile = await createUserProfileDocument(user);
          }
          const savedUnit = localStorage.getItem('platesync_preferred_unit');
          if (savedUnit) {
            profile = { ...profile, preferredUnit: savedUnit };
          }
          setUserProfile(profile);
        } catch (err) {
          console.error('Profile sync notice:', err);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginGoogle = async () => {
    try {
      const user = await fbLoginWithGoogle();
      if (user) {
        const profile = await getUserProfile(user.uid);
        setUserProfile(profile);
        setIsDemoMode(false);
        localStorage.removeItem('platesync_demo_active');
      }
      return user;
    } catch (error) {
      console.error('Google Login Error:', error);
      throw error;
    }
  };

  const loginEmail = async (email, password) => {
    try {
      const user = await fbLoginWithEmail(email, password);
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      setIsDemoMode(false);
      localStorage.removeItem('platesync_demo_active');
      return user;
    } catch (error) {
      console.error('Email Login Error:', error);
      throw error;
    }
  };

  const registerEmail = async (email, password, displayName) => {
    try {
      const user = await fbRegisterWithEmail(email, password, displayName);
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
      setIsDemoMode(false);
      localStorage.removeItem('platesync_demo_active');
      return user;
    } catch (error) {
      console.error('Email Registration Error:', error);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    return fbResetPassword(email);
  };

  const logout = async () => {
    if (isDemoMode) {
      localStorage.removeItem('platesync_demo_active');
      localStorage.removeItem('platesync_demo_access_mode');
      localStorage.removeItem('platesync_demo_workouts');
      setIsDemoMode(false);
      setDemoAccessMode('calculator-only');
      setCurrentUser(null);
      setUserProfile(null);
      return;
    }
    await fbLogout();
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
