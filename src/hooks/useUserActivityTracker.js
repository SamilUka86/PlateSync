import { useEffect } from 'react';
import { 
  initActivityListeners, 
  startUserSession, 
  startHeartbeatLoop, 
  endUserSession,
  logUserActivityEvent 
} from '../services/analytics/activityTracker';

/**
 * useUserActivityTracker Hook
 * Seamlessly manages session lifecycle, multi-tab coordination,
 * tab visibility detection, idle detection, and background tab heartbeats.
 */
export const useUserActivityTracker = (user) => {
  useEffect(() => {
    // Only track real authenticated users; skip demo users
    if (!user || user.isDemo || !user.uid) {
      return;
    }

    // 1. Initialize user interaction and visibility listeners
    initActivityListeners(user);

    // 2. Start session
    startUserSession(user);

    // 3. Start 45s heartbeat interval while tab is active and visible
    const cleanupHeartbeat = startHeartbeatLoop(user);

    return () => {
      if (cleanupHeartbeat) {
        cleanupHeartbeat();
      }
    };
  }, [user?.uid, user?.isDemo]);

  return {
    logActivity: logUserActivityEvent
  };
};

export default useUserActivityTracker;
