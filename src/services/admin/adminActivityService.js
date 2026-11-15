import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  limit as firestoreLimit 
} from 'firebase/firestore';
import { db, auth, isFirebaseConfigured } from '../firebase/config';

// 5 Minutes cutoff for live active users
const LIVE_ACTIVE_WINDOW_MS = 5 * 60 * 1000;
// 30 Minutes cutoff for recently active
const RECENTLY_ACTIVE_WINDOW_MS = 30 * 60 * 1000;

/**
 * Helper to determine user activity status
 */
export const getUserActivityStatus = (presenceDoc) => {
  if (!presenceDoc || !presenceDoc.lastHeartbeat) {
    return 'Offline';
  }

  const lastHeartbeatTime = new Date(presenceDoc.lastHeartbeat).getTime();
  const diffMs = Date.now() - lastHeartbeatTime;

  if (diffMs <= LIVE_ACTIVE_WINDOW_MS) {
    return 'Active';
  } else if (diffMs <= RECENTLY_ACTIVE_WINDOW_MS) {
    return 'Recently Active';
  } else {
    return 'Offline';
  }
};

/**
 * Format duration in seconds to human readable string (e.g., "1h 24m" or "45s")
 */
export const formatDuration = (totalSeconds) => {
  const sec = Math.max(0, Math.round(Number(totalSeconds) || 0));
  if (sec < 60) return `${sec}s`;
  const mins = Math.floor(sec / 60);
  const remainingSec = sec % 60;
  if (mins < 60) {
    return remainingSec > 0 ? `${mins}m ${remainingSec}s` : `${mins}m`;
  }
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
};

/**
 * Format ISO date string into readable local timestamp
 */
export const formatTimestamp = (isoString) => {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (e) {
    return '—';
  }
};

/**
 * Format ISO date string into readable short date
 */
export const formatShortDate = (isoString) => {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return '—';
  }
};

/**
 * Fetch complete Live Active Users Telemetry
 * Provides: Currently Active, Active Today, Yesterday, This Week, This Month,
 * Total Registered Users, New Today, Returning Today, DAU/MAU ratio, etc.
 */
export const getLiveUsersTelemetry = async () => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const startOfWeek = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  let registeredUsers = [];
  let presenceList = [];
  let sessionsList = [];
  let eventsList = [];

  if (isFirebaseConfigured() && db) {
    try {
      // 1. Fetch Users
      const usersSnap = await getDocs(collection(db, 'users'));
      registeredUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // 2. Fetch Presence
      const presenceSnap = await getDocs(collection(db, 'userPresence'));
      presenceList = presenceSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // 3. Fetch Sessions (Last 30 days)
      const sessionsSnap = await getDocs(query(
        collection(db, 'userSessions'),
        orderBy('startTime', 'desc'),
        firestoreLimit(500)
      ));
      sessionsList = sessionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      // 4. Fetch Recent Events
      const eventsSnap = await getDocs(query(
        collection(db, 'userActivityEvents'),
        orderBy('timestamp', 'desc'),
        firestoreLimit(200)
      ));
      eventsList = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn('[AdminActivityService] Firestore telemetry query notice:', err);
    }
  }

  // Fallback to local storage if unconfigured or empty in dev
  if (registeredUsers.length === 0) {
    try {
      const cached = localStorage.getItem('platesync_admin_users');
      if (cached) registeredUsers = JSON.parse(cached);
    } catch (e) {}
  }

  // Ensure authenticated Firebase user is represented
  if (auth?.currentUser) {
    const cur = auth.currentUser;
    const exists = registeredUsers.some(u => (u.id || u.uid) === cur.uid);
    if (!exists) {
      registeredUsers.push({
        id: cur.uid,
        uid: cur.uid,
        email: cur.email,
        name: cur.displayName || cur.email?.split('@')[0],
        createdAt: cur.metadata?.creationTime || new Date().toISOString()
      });
    }
  }

  const nowMs = Date.now();

  // 1. Currently Active Users (Rolling 5-minute activity window)
  const currentlyActiveUsers = presenceList.filter(p => {
    if (!p.lastHeartbeat) return false;
    const hb = new Date(p.lastHeartbeat).getTime();
    return (nowMs - hb) <= LIVE_ACTIVE_WINDOW_MS;
  });

  // 2. Users active today
  const activeTodayUserIds = new Set();
  const activeYesterdayUserIds = new Set();
  const activeWeekUserIds = new Set();
  const activeMonthUserIds = new Set();

  presenceList.forEach(p => {
    const t = new Date(p.lastHeartbeat || p.lastActiveAt || 0).getTime();
    if (t >= startOfToday) activeTodayUserIds.add(p.id || p.uid);
    if (t >= startOfYesterday && t < startOfToday) activeYesterdayUserIds.add(p.id || p.uid);
    if (t >= startOfWeek) activeWeekUserIds.add(p.id || p.uid);
    if (t >= startOfMonth) activeMonthUserIds.add(p.id || p.uid);
  });

  sessionsList.forEach(s => {
    const t = new Date(s.startTime || s.lastHeartbeat || 0).getTime();
    const uid = s.userId;
    if (!uid) return;
    if (t >= startOfToday) activeTodayUserIds.add(uid);
    if (t >= startOfYesterday && t < startOfToday) activeYesterdayUserIds.add(uid);
    if (t >= startOfWeek) activeWeekUserIds.add(uid);
    if (t >= startOfMonth) activeMonthUserIds.add(uid);
  });

  // 3. New Registrations Today & Returning Users Today
  let newUsersToday = 0;
  let returningUsersToday = 0;

  registeredUsers.forEach(u => {
    const createdTime = new Date(u.createdAt || u.registrationDate || 0).getTime();
    const isNew = createdTime >= startOfToday;
    if (isNew) {
      newUsersToday++;
    }
    if (activeTodayUserIds.has(u.id || u.uid)) {
      if (!isNew) {
        returningUsersToday++;
      }
    }
  });

  // DAU, WAU, MAU calculations
  const dau = activeTodayUserIds.size;
  const wau = activeWeekUserIds.size;
  const mau = activeMonthUserIds.size;
  const dauMauRatio = mau > 0 ? Math.round((dau / mau) * 100) : 0;

  // Active duration calculations today
  let totalActiveSecondsToday = 0;
  sessionsList.forEach(s => {
    const t = new Date(s.startTime || 0).getTime();
    if (t >= startOfToday) {
      totalActiveSecondsToday += Number(s.activeSeconds) || 0;
    }
  });

  const avgActiveTimePerUser = dau > 0 ? Math.round(totalActiveSecondsToday / dau) : 0;

  return {
    currentlyActiveCount: currentlyActiveUsers.length,
    activeTodayCount: dau,
    activeYesterdayCount: activeYesterdayUserIds.size,
    activeThisWeekCount: wau,
    activeThisMonthCount: mau,
    totalRegisteredUsers: registeredUsers.length,
    newRegistrationsToday: newUsersToday,
    returningUsersToday: returningUsersToday,
    dauMauRatio,
    totalActiveSecondsToday,
    avgActiveTimePerUser,
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Fetch Individual User Activity records
 * Merges user profiles with real presence, session durations, and device category
 */
export const getIndividualUsersActivityList = async () => {
  let registeredUsers = [];
  let presenceMap = new Map();
  let sessionsByUser = new Map();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfWeek = now.getTime() - 7 * 24 * 60 * 60 * 1000;
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  if (isFirebaseConfigured() && db) {
    try {
      const [usersSnap, presenceSnap, sessionsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'userPresence')),
        getDocs(query(collection(db, 'userSessions'), orderBy('startTime', 'desc'), firestoreLimit(1000)))
      ]);

      registeredUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      presenceSnap.docs.forEach(d => {
        presenceMap.set(d.id, { id: d.id, ...d.data() });
      });

      sessionsSnap.docs.forEach(d => {
        const data = d.data();
        const uid = data.userId;
        if (!uid) return;
        if (!sessionsByUser.has(uid)) {
          sessionsByUser.set(uid, []);
        }
        sessionsByUser.get(uid).push({ id: d.id, ...data });
      });
    } catch (err) {
      console.warn('[AdminActivityService] Individual users query notice:', err);
    }
  }

  // Fallback to local storage if unconfigured
  if (registeredUsers.length === 0) {
    try {
      const cached = localStorage.getItem('platesync_admin_users');
      if (cached) registeredUsers = JSON.parse(cached);
    } catch (e) {}
  }

  // Ensure authenticated Firebase user is represented
  if (auth?.currentUser) {
    const cur = auth.currentUser;
    const exists = registeredUsers.some(u => (u.id || u.uid) === cur.uid);
    if (!exists) {
      registeredUsers.push({
        id: cur.uid,
        uid: cur.uid,
        email: cur.email,
        name: cur.displayName || cur.email?.split('@')[0],
        displayName: cur.displayName || cur.email?.split('@')[0],
        authProvider: cur.providerData?.[0]?.providerId || 'password',
        emailVerified: Boolean(cur.emailVerified),
        createdAt: cur.metadata?.creationTime || new Date().toISOString(),
        lastLogin: cur.metadata?.lastSignInTime || new Date().toISOString()
      });
    }
  }

  const results = registeredUsers.map(user => {
    const uid = user.id || user.uid;
    const presence = presenceMap.get(uid) || null;
    const userSessions = sessionsByUser.get(uid) || [];

    // Calculate status
    let status = getUserActivityStatus(presence);
    if (auth?.currentUser?.uid === uid && status === 'Offline') {
      // Current active user in browser
      status = 'Active';
    }

    // Calculate durations
    let durationTodaySec = 0;
    let durationWeekSec = 0;
    let durationMonthSec = 0;
    let sessionsTodayCount = 0;

    userSessions.forEach(s => {
      const t = new Date(s.startTime || 0).getTime();
      const sec = Number(s.activeSeconds) || 0;
      if (t >= startOfToday) {
        durationTodaySec += sec;
        sessionsTodayCount++;
      }
      if (t >= startOfWeek) {
        durationWeekSec += sec;
      }
      if (t >= startOfMonth) {
        durationMonthSec += sec;
      }
    });

    const currentSessionStart = presence?.currentSessionId && status === 'Active'
      ? presence.lastHeartbeat
      : null;

    const device = presence?.device || user.device || userSessions[0]?.device || 'Desktop';
    const lastActivityTime = presence?.lastActiveAt || presence?.lastHeartbeat || user.lastLogin || null;

    return {
      uid,
      name: user.name || user.displayName || (user.email ? user.email.split('@')[0] : 'Athlete'),
      email: user.email || 'athlete@platesync.app',
      status, // 'Active', 'Recently Active', 'Offline'
      currentSessionStart,
      lastActivityTime,
      durationTodaySec,
      durationWeekSec,
      durationMonthSec,
      sessionsTodayCount,
      lastLogin: user.authLastSignInTime || user.lastLogin || user.createdAt || null,
      device,
      createdAt: user.authCreationTime || user.createdAt || user.registrationDate || null,
      workoutCount: user.workoutCount || 0,
      authProvider: user.authProvider || (user.email?.includes('gmail') ? 'google.com' : 'password'),
      emailVerified: Boolean(user.emailVerified)
    };
  });

  return results;
};

/**
 * Fetch detailed session history for a specific user
 * Inferred session handling: if session is marked 'active' and lastHeartbeat is older than 5m,
 * status is shown as 'Inferred / Interrupted' using lastHeartbeat as endTime.
 */
export const getUserSessionHistory = async (userId) => {
  if (!userId) return [];

  let sessions = [];

  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, 'userSessions'),
        where('userId', '==', userId),
        orderBy('startTime', 'desc'),
        firestoreLimit(50)
      );
      const snap = await getDocs(q);
      sessions = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn('[AdminActivityService] User sessions query notice:', err);
    }
  }

  const nowMs = Date.now();

  return sessions.map(s => {
    const startTimeMs = new Date(s.startTime).getTime();
    const lastHbMs = s.lastHeartbeat ? new Date(s.lastHeartbeat).getTime() : startTimeMs;
    let endTime = s.endTime;
    let status = s.status || 'completed';

    // Handle unexpected close / crash inference
    if (!endTime && status === 'active') {
      if ((nowMs - lastHbMs) > LIVE_ACTIVE_WINDOW_MS) {
        status = 'Inferred / Interrupted';
        endTime = s.lastHeartbeat;
      } else {
        status = 'Active';
      }
    } else if (status === 'completed') {
      status = 'Completed';
    }

    return {
      id: s.id || s.sessionId,
      sessionDate: s.date || formatShortDate(s.startTime),
      startTime: s.startTime,
      endTime: endTime || s.lastHeartbeat || 'Ongoing',
      activeDurationSec: s.activeSeconds || 0,
      device: s.device || 'Desktop',
      activities: Array.isArray(s.activities) && s.activities.length > 0 
        ? s.activities 
        : ['Browsed PlateSync'],
      status
    };
  });
};

/**
 * Fetch real-time live activity events stream
 */
export const getLiveActivityFeed = async (limitCount = 50) => {
  let events = [];

  if (isFirebaseConfigured() && db) {
    try {
      const q = query(
        collection(db, 'userActivityEvents'),
        orderBy('timestamp', 'desc'),
        firestoreLimit(limitCount)
      );
      const snap = await getDocs(q);
      events = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (err) {
      console.warn('[AdminActivityService] Activity feed query notice:', err);
    }
  }

  return events;
};

/**
 * Fetch Daily Active User Analytics for selected range
 * Filter options: 'today', 'yesterday', '7d', '30d', '90d', 'custom'
 */
export const getDailyActiveAnalytics = async (filterRange = '7d', customStart = null, customEnd = null) => {
  let sessions = [];
  let registeredUsers = [];

  if (isFirebaseConfigured() && db) {
    try {
      const [sessionsSnap, usersSnap] = await Promise.all([
        getDocs(query(collection(db, 'userSessions'), orderBy('startTime', 'asc'), firestoreLimit(1500))),
        getDocs(collection(db, 'users'))
      ]);
      sessions = sessionsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      registeredUsers = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (e) {
      console.warn('[AdminActivityService] Daily analytics query notice:', e);
    }
  }

  // Calculate day range dates
  const now = new Date();
  let daysToCover = 7;
  let startDate = new Date();

  if (filterRange === 'today') {
    daysToCover = 1;
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (filterRange === 'yesterday') {
    daysToCover = 2;
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  } else if (filterRange === '7d') {
    daysToCover = 7;
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
  } else if (filterRange === '30d') {
    daysToCover = 30;
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
  } else if (filterRange === '90d') {
    daysToCover = 90;
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 89);
  } else if (filterRange === 'custom' && customStart && customEnd) {
    const s = new Date(customStart);
    const e = new Date(customEnd);
    daysToCover = Math.max(1, Math.min(180, Math.round((e - s) / (24 * 60 * 60 * 1000)) + 1));
    startDate = s;
  }

  // Build daily buckets
  const dailyBuckets = [];
  for (let i = 0; i < daysToCover; i++) {
    const d = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const displayLabel = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    
    dailyBuckets.push({
      dateKey,
      label: displayLabel,
      uniqueUsers: new Set(),
      newUsers: new Set(),
      returningUsers: new Set(),
      totalActiveSeconds: 0,
      totalSessions: 0
    });
  }

  const bucketMap = new Map();
  dailyBuckets.forEach(b => bucketMap.set(b.dateKey, b));

  // Populate from sessions
  sessions.forEach(s => {
    if (!s.startTime) return;
    const sessionDateKey = s.date || s.startTime.substring(0, 10);
    const bucket = bucketMap.get(sessionDateKey);
    if (!bucket) return;

    const uid = s.userId;
    if (uid) {
      bucket.uniqueUsers.add(uid);
    }
    bucket.totalSessions++;
    bucket.totalActiveSeconds += Number(s.activeSeconds) || 0;
  });

  // Calculate new vs returning for each bucket
  dailyBuckets.forEach(bucket => {
    bucket.uniqueUsers.forEach(uid => {
      const user = registeredUsers.find(u => (u.id || u.uid) === uid);
      if (user && user.createdAt && user.createdAt.startsWith(bucket.dateKey)) {
        bucket.newUsers.add(uid);
      } else {
        bucket.returningUsers.add(uid);
      }
    });
  });

  // Format final chart data
  const chartData = dailyBuckets.map(b => {
    const uniqueCount = b.uniqueUsers.size;
    const avgSeconds = uniqueCount > 0 ? Math.round(b.totalActiveSeconds / uniqueCount) : 0;
    const avgSessions = uniqueCount > 0 ? Number((b.totalSessions / uniqueCount).toFixed(1)) : 0;

    return {
      date: b.label,
      dateKey: b.dateKey,
      activeUsers: uniqueCount,
      newUsers: b.newUsers.size,
      returningUsers: b.returningUsers.size,
      totalActiveMinutes: Math.round(b.totalActiveSeconds / 60),
      avgActiveMinutes: Math.round(avgSeconds / 60),
      avgSessionsPerUser: avgSessions,
      totalSessions: b.totalSessions
    };
  });

  return chartData;
};

/**
 * Fetch Comprehensive User Engagement Analytics
 * Most active days, peak hours, feature breakdown, DAU/WAU/MAU
 */
export const getEngagementAnalytics = async () => {
  let events = [];
  let sessions = [];

  if (isFirebaseConfigured() && db) {
    try {
      const [eventsSnap, sessionsSnap] = await Promise.all([
        getDocs(query(collection(db, 'userActivityEvents'), orderBy('timestamp', 'desc'), firestoreLimit(1000))),
        getDocs(query(collection(db, 'userSessions'), orderBy('startTime', 'desc'), firestoreLimit(1000)))
      ]);
      events = eventsSnap.docs.map(d => d.data());
      sessions = sessionsSnap.docs.map(d => d.data());
    } catch (e) {
      console.warn('[AdminActivityService] Engagement query notice:', e);
    }
  }

  // Days of week distribution (0 = Sun, 1 = Mon, ..., 6 = Sat)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dayCounts = [0, 0, 0, 0, 0, 0, 0];

  // Hourly distribution (0 - 23)
  const hourCounts = new Array(24).fill(0);

  // Feature breakdown counts
  const featureBreakdown = {
    'Workout Tracker': 0,
    'Plate Calculator': 0,
    'Weekly Planner': 0,
    'Weight Tracker': 0,
    'Exercise Library': 0
  };

  events.forEach(e => {
    if (!e.timestamp) return;
    const d = new Date(e.timestamp);
    if (!isNaN(d.getTime())) {
      dayCounts[d.getDay()]++;
      hourCounts[d.getHours()]++;
    }

    const type = e.eventType || '';
    const desc = (e.description || '').toLowerCase();

    if (type.includes('WORKOUT') || desc.includes('workout') || desc.includes('set')) {
      featureBreakdown['Workout Tracker']++;
    } else if (type.includes('CALCULATOR') || desc.includes('calculator') || desc.includes('plate') || desc.includes('barbell')) {
      featureBreakdown['Plate Calculator']++;
    } else if (type.includes('PLAN') || desc.includes('plan') || desc.includes('program')) {
      featureBreakdown['Weekly Planner']++;
    } else if (type.includes('WEIGHT') || desc.includes('weight')) {
      featureBreakdown['Weight Tracker']++;
    } else if (type.includes('EXERCISE') || desc.includes('exercise')) {
      featureBreakdown['Exercise Library']++;
    }
  });

  const dayOfWeekData = daysOfWeek.map((day, idx) => ({
    day,
    events: dayCounts[idx]
  }));

  const hourlyData = hourCounts.map((count, hour) => ({
    hour: `${String(hour).padStart(2, '0')}:00`,
    events: count
  }));

  const featureData = Object.entries(featureBreakdown).map(([name, count]) => ({
    name,
    count
  }));

  // Overall session metrics
  let totalSessionSeconds = 0;
  sessions.forEach(s => {
    totalSessionSeconds += Number(s.activeSeconds) || 0;
  });
  const avgSessionDurationSec = sessions.length > 0 
    ? Math.round(totalSessionSeconds / sessions.length) 
    : 0;

  return {
    dayOfWeekData,
    hourlyData,
    featureData,
    avgSessionDurationSec,
    totalActiveMinutes: Math.round(totalSessionSeconds / 60)
  };
};
