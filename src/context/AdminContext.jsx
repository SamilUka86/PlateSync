import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  loginAdmin, 
  logoutAdmin, 
  getActiveAdminSession, 
  verifyAdminPrivileges 
} from '../services/admin/adminAuthService';
import { auth, isFirebaseConfigured } from '../services/firebase/config';

const AdminContext = createContext({});

export const AdminProvider = ({ children }) => {
  const [adminSession, setAdminSession] = useState(() => {
    const saved = getActiveAdminSession();
    if (saved) return saved;
    try {
      const cur = auth?.currentUser;
      const curEmail = cur?.email?.toLowerCase();
      if (curEmail === 'platesync86@gmail.com' || curEmail === 'samilplatesync@gmail.com') {
        const session = {
          uid: cur.uid,
          email: curEmail,
          role: 'owner',
          isOwner: true,
          permissions: ['all'],
          expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
        };
        localStorage.setItem('platesync_admin_session_v1', JSON.stringify(session));
        return session;
      }
    } catch (e) {}
    return null;
  });
  const [adminLoading, setAdminLoading] = useState(true);
  const [adminError, setAdminError] = useState(null);

  // Sync admin session on load & verify against Firebase Auth
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      const savedSession = getActiveAdminSession();
      if (!savedSession) {
        // Check if currentUser in Firebase is admin
        if (isFirebaseConfigured() && auth) {
          const cur = auth.currentUser;
          const curEmail = cur?.email?.toLowerCase();
          if (curEmail === 'platesync86@gmail.com' || curEmail === 'samilplatesync@gmail.com') {
            const session = {
              uid: cur.uid,
              email: curEmail,
              role: 'owner',
              isOwner: true,
              permissions: ['all'],
              expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
            };
            localStorage.setItem('platesync_admin_session_v1', JSON.stringify(session));
            if (isMounted) {
              setAdminSession(session);
              setAdminLoading(false);
            }
            return;
          }
        }
        if (isMounted) {
          setAdminSession(null);
          setAdminLoading(false);
        }
        return;
      }

      // If saved session email is not the admin email, purge it immediately
      const savedEmail = savedSession.email?.toLowerCase();
      if (savedEmail !== 'platesync86@gmail.com' && savedEmail !== 'samilplatesync@gmail.com') {
        logoutAdmin();
        if (isMounted) {
          setAdminSession(null);
          setAdminLoading(false);
        }
        return;
      }

      // Verify active user with Firebase Auth if available
      if (isFirebaseConfigured() && auth) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userEmail = currentUser.email?.toLowerCase();
          // If the logged-in user is an athlete (not platesync86@gmail.com), purge admin session
          if (userEmail !== 'platesync86@gmail.com' && userEmail !== 'samilplatesync@gmail.com') {
            logoutAdmin();
            if (isMounted) {
              setAdminSession(null);
              setAdminLoading(false);
            }
            return;
          }

          const authInfo = await verifyAdminPrivileges(currentUser);
          if (authInfo && isMounted) {
            setAdminSession({
              ...savedSession,
              role: authInfo.role,
              isOwner: authInfo.isOwner
            });
            setAdminLoading(false);
            return;
          }
        }
      }

      if (isMounted) {
        setAdminSession(savedSession);
        setAdminLoading(false);
      }
    };

    checkSession();

    // Invalidate admin session only if a verified non-admin athlete signs in
    let authUnsubscribe = null;
    if (isFirebaseConfigured() && auth) {
      try {
        authUnsubscribe = auth.onAuthStateChanged((user) => {
          if (user) {
            const userEmail = user.email?.toLowerCase();
            if (userEmail !== 'platesync86@gmail.com' && userEmail !== 'samilplatesync@gmail.com') {
              logoutAdmin();
              if (isMounted) {
                setAdminSession(null);
              }
            } else {
              // Re-affirm admin session
              const session = {
                uid: user.uid,
                email: userEmail,
                role: 'owner',
                isOwner: true,
                permissions: ['all'],
                expiresAt: Date.now() + (30 * 24 * 60 * 60 * 1000)
              };
              localStorage.setItem('platesync_admin_session_v1', JSON.stringify(session));
              if (isMounted) {
                setAdminSession(session);
              }
            }
          }
        });
      } catch (e) {
        console.debug('Auth state monitor notice:', e);
      }
    }

    // Session expiration timer: check every 60 seconds
    const interval = setInterval(() => {
      const current = getActiveAdminSession();
      if (!current && adminSession) {
        logoutAdminAccount();
      }
    }, 60000);

    return () => {
      isMounted = false;
      clearInterval(interval);
      if (authUnsubscribe) authUnsubscribe();
    };
  }, []);

  const loginAdminAccount = async (email, password) => {
    setAdminLoading(true);
    setAdminError(null);
    try {
      const session = await loginAdmin(email, password);
      setAdminSession(session);
      return session;
    } catch (err) {
      setAdminError(err.message || 'Admin authentication failed.');
      throw err;
    } finally {
      setAdminLoading(false);
    }
  };

  const logoutAdminAccount = async () => {
    await logoutAdmin();
    setAdminSession(null);
  };

  const isCurrentAdmin = Boolean(
    (adminSession?.uid && (adminSession.role === 'admin' || adminSession.role === 'owner')) ||
    adminSession?.email?.toLowerCase() === 'platesync86@gmail.com' ||
    adminSession?.email?.toLowerCase() === 'samilplatesync@gmail.com' ||
    auth?.currentUser?.email?.toLowerCase() === 'platesync86@gmail.com' ||
    auth?.currentUser?.email?.toLowerCase() === 'samilplatesync@gmail.com'
  );

  const value = {
    adminSession,
    isAdmin: isCurrentAdmin,
    isOwner: Boolean(
      adminSession?.isOwner ||
      adminSession?.role === 'owner' ||
      isCurrentAdmin
    ),
    adminLoading,
    adminError,
    loginAdminAccount,
    logoutAdminAccount
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
