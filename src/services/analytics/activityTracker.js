import { 
  doc, 
  setDoc, 
  updateDoc, 
  collection, 
  serverTimestamp, 
  increment, 
  arrayUnion 
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from '../firebase/config';

// Storage Keys
const SESSION_KEY = 'platesync_current_session';
const LEADER_TAB_KEY = 'platesync_active_leader_tab';
const TAB_ID = `tab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

// Activity Timing Constants
const INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes inactivity cutoff
const HEARTBEAT_INTERVAL_MS = 45 * 1000;     // 45 seconds heartbeat interval
const LEADER_HEARTBEAT_TTL_MS = 3000;        // 3 seconds leader check

let heartbeatTimer = null;
let lastInteractionTime = Date.now();
let isInitialized = false;

/**
 * Accurately classify client device category
 */
export const detectDeviceCategory = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'Desktop';
  }

  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth || screen.width || 1024;
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // Tablet checks
  if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk)/i.test(ua)) {
    return 'Tablet';
  }
  if (isTouch && width >= 768 && width <= 1024) {
    return 'Tablet';
  }

  // Mobile checks
  if (/android.*mobile|iphone|ipod|blackberry|iemobile|opera mini|mobile/i.test(ua)) {
    if (ua.includes('android')) return 'Android';
    if (ua.includes('iphone') || ua.includes('ipod')) return 'iOS';
    return 'Android';
  }

  // Fallback for iOS detection on iPadOS 13+ desktop-class Safari
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return 'Tablet';
  }

  return 'Desktop';
};

/**
 * Format today date as YYYY-MM-DD
 */
export const getTodayDateKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/**
 * Multi-tab leader election: ensure only the actively focused visible tab
 * sends heartbeats and accumulates active duration seconds.
 */
const claimLeaderTab = () => {
  try {
    if (document.hidden) return false;
    const now = Date.now();
    const raw = localStorage.getItem(LEADER_TAB_KEY);
    if (raw) {
      const leaderData = JSON.parse(raw);
      if (leaderData.tabId !== TAB_ID && (now - leaderData.timestamp) < LEADER_HEARTBEAT_TTL_MS) {
        // Another active tab currently holds leader
        return false;
      }
    }
    // Claim or renew leadership
    localStorage.setItem(LEADER_TAB_KEY, JSON.stringify({ tabId: TAB_ID, timestamp: now }));
    return true;
  } catch (e) {
    return true;
  }
};

/**
 * Check if the current user session is active and not idle
 */
export const isUserActive = () => {
  if (typeof document === 'undefined') return false;
  if (document.hidden) return false;
  const idleTime = Date.now() - lastInteractionTime;
  return idleTime < INACTIVITY_TIMEOUT_MS;
};

/**
 * Start a tracked user session
 */
export const startUserSession = async (user) => {
  if (!user || user.isDemo || !user.uid) return null;
  if (!isFirebaseConfigured() || !db) return null;

  try {
    const existingSession = sessionStorage.getItem(SESSION_KEY);
    if (existingSession) {
      try {
        const parsed = JSON.parse(existingSession);
        if (parsed.userId === user.uid && parsed.sessionId) {
          return parsed.sessionId;
        }
      } catch (e) {}
    }

    const sessionId = `sess_${user.uid}_${Date.now()}`;
    const device = detectDeviceCategory();
    const todayKey = getTodayDateKey();

    const sessionData = {
      sessionId,
      userId: user.uid,
      userEmail: user.email || 'athlete@platesync.app',
      displayName: user.displayName || user.name || (user.email ? user.email.split('@')[0] : 'Athlete'),
      startTime: new Date().toISOString(),
      lastHeartbeat: new Date().toISOString(),
      endTime: null,
      activeSeconds: 0,
      device,
      status: 'active',
      date: todayKey,
      activities: ['Session Started']
    };

    // 1. Write user presence doc
    const presenceRef = doc(db, 'userPresence', user.uid);
    await setDoc(presenceRef, {
      uid: user.uid,
      email: user.email || 'athlete@platesync.app',
      displayName: sessionData.displayName,
      status: 'active',
      currentSessionId: sessionId,
      device,
      lastHeartbeat: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // 2. Write session doc
    const sessionRef = doc(db, 'userSessions', sessionId);
    await setDoc(sessionRef, sessionData);

    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      sessionId,
      userId: user.uid,
      startTime: Date.now()
    }));

    return sessionId;
  } catch (err) {
    console.warn('[ActivityTracker] Failed to start user session:', err);
    return null;
  }
};

/**
 * Send heartbeat to keep presence and active seconds updated
 */
export const sendUserHeartbeat = async (user) => {
  if (!user || user.isDemo || !user.uid) return;
  if (!isFirebaseConfigured() || !db) return;

  // Verify tab is active leader and not idle
  if (!claimLeaderTab() || !isUserActive()) {
    return;
  }

  try {
    const sessionRaw = sessionStorage.getItem(SESSION_KEY);
    if (!sessionRaw) {
      await startUserSession(user);
      return;
    }

    const parsed = JSON.parse(sessionRaw);
    const sessionId = parsed.sessionId;
    const nowIso = new Date().toISOString();
    const elapsedSeconds = Math.round(HEARTBEAT_INTERVAL_MS / 1000);

    // 1. Update presence
    const presenceRef = doc(db, 'userPresence', user.uid);
    await updateDoc(presenceRef, {
      status: 'active',
      lastHeartbeat: nowIso,
      lastActiveAt: nowIso,
      updatedAt: nowIso
    }).catch(async (e) => {
      // If doc was missing, recreate
      if (e.code === 'not-found') {
        await startUserSession(user);
      }
    });

    // 2. Update session doc
    if (sessionId) {
      const sessionRef = doc(db, 'userSessions', sessionId);
      await updateDoc(sessionRef, {
        lastHeartbeat: nowIso,
        activeSeconds: increment(elapsedSeconds)
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('[ActivityTracker] Heartbeat error:', err);
  }
};

/**
 * End a user session cleanly
 */
export const endUserSession = async (user, reason = 'LOGOUT') => {
  if (!user || user.isDemo || !user.uid) return;
  if (!isFirebaseConfigured() || !db) return;

  try {
    const sessionRaw = sessionStorage.getItem(SESSION_KEY);
    const sessionId = sessionRaw ? JSON.parse(sessionRaw)?.sessionId : null;
    const nowIso = new Date().toISOString();

    // 1. Mark presence offline
    const presenceRef = doc(db, 'userPresence', user.uid);
    await updateDoc(presenceRef, {
      status: 'offline',
      lastActiveAt: nowIso,
      updatedAt: nowIso
    }).catch(() => {});

    // 2. Mark session completed
    if (sessionId) {
      const sessionRef = doc(db, 'userSessions', sessionId);
      await updateDoc(sessionRef, {
        endTime: nowIso,
        status: 'completed',
        activities: arrayUnion(reason === 'LOGOUT' ? 'User Logged Out' : 'Session Ended')
      }).catch(() => {});
    }

    sessionStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.warn('[ActivityTracker] End session error:', err);
  }
};

/**
 * Log a high-fidelity qualifying user activity event
 */
export const logUserActivityEvent = async (eventType, description, metadata = {}) => {
  const user = auth?.currentUser;
  if (!user || !user.uid) return;
  if (!isFirebaseConfigured() || !db) return;

  try {
    // Refresh user interaction clock
    lastInteractionTime = Date.now();

    const sessionRaw = sessionStorage.getItem(SESSION_KEY);
    let sessionId = sessionRaw ? JSON.parse(sessionRaw)?.sessionId : null;

    if (!sessionId) {
      sessionId = await startUserSession(user);
    }

    const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const device = detectDeviceCategory();
    const nowIso = new Date().toISOString();
    const displayName = user.displayName || (user.email ? user.email.split('@')[0] : 'Athlete');

    const eventDoc = {
      eventId,
      userId: user.uid,
      userEmail: user.email || 'athlete@platesync.app',
      displayName,
      sessionId: sessionId || 'unknown',
      eventType,
      description: description || eventType,
      device,
      metadata: metadata || {},
      timestamp: nowIso
    };

    // 1. Write immutable event
    const eventRef = doc(db, 'userActivityEvents', eventId);
    await setDoc(eventRef, eventDoc);

    // 2. Update presence with last active event
    const presenceRef = doc(db, 'userPresence', user.uid);
    await updateDoc(presenceRef, {
      status: 'active',
      lastActiveAt: nowIso,
      lastHeartbeat: nowIso,
      lastEvent: description || eventType,
      updatedAt: nowIso
    }).catch(() => {});

    // 3. Append to session activities
    if (sessionId) {
      const sessionRef = doc(db, 'userSessions', sessionId);
      await updateDoc(sessionRef, {
        activities: arrayUnion(description || eventType),
        lastHeartbeat: nowIso
      }).catch(() => {});
    }
  } catch (err) {
    console.warn('[ActivityTracker] Log activity error:', err);
  }
};

/**
 * Register global interaction listeners to track active vs idle state
 */
export const initActivityListeners = (user) => {
  if (isInitialized || typeof window === 'undefined') return;
  isInitialized = true;

  const onUserInteraction = () => {
    lastInteractionTime = Date.now();
  };

  const events = ['pointerdown', 'keydown', 'touchstart', 'scroll', 'click'];
  events.forEach((evt) => {
    window.addEventListener(evt, onUserInteraction, { passive: true });
  });

  // Track tab visibility changes
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      lastInteractionTime = Date.now();
      claimLeaderTab();
      if (user) {
        sendUserHeartbeat(user);
      }
    }
  });

  // Handle browser close / unload
  window.addEventListener('beforeunload', () => {
    try {
      const sessionRaw = sessionStorage.getItem(SESSION_KEY);
      if (sessionRaw && user?.uid) {
        // Attempt clean heartbeat before unload
        const nowIso = new Date().toISOString();
        const sessionId = JSON.parse(sessionRaw)?.sessionId;
        // In modern browsers, fetch/beacon or firestore may run or get interrupted.
        // If interrupted, admin panel will inspect and mark as "Inferred / Interrupted".
      }
    } catch (e) {}
  });
};

/**
 * Start heartbeat polling loop
 */
export const startHeartbeatLoop = (user) => {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
  }

  // Initial heartbeat
  sendUserHeartbeat(user);

  heartbeatTimer = setInterval(() => {
    sendUserHeartbeat(user);
  }, HEARTBEAT_INTERVAL_MS);

  return () => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      heartbeatTimer = null;
    }
  };
};
