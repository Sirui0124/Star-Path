import { useEffect, useRef } from 'react';
import { logGameEvent } from '../services/firebase';

export const useGameAnalytics = (currentPhase: string, currentStage: string) => {
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pageId = `${currentPhase}_${currentStage}`; // Construct a meaningful Page ID

  // 1. Screen View & Idle Monitoring
  useEffect(() => {
    // Log Screen View on change
    logGameEvent('screen_view', { page_id: pageId });

    const resetIdleTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      // Set new 60s timer
      timerRef.current = setTimeout(() => {
        logGameEvent('user_idle', { page_id: pageId });
      }, 60000);
    };

    // Events to detect activity
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'touchstart', 'scroll'];

    // Attach listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });

    // Start timer initially
    resetIdleTimer();

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [pageId]); // Re-run when page_id changes

  // 2. Session Duration (Run once on mount/unmount)
  useEffect(() => {
    return () => {
      const duration = (Date.now() - startTimeRef.current) / 1000; // in seconds
      logGameEvent('session_duration', { duration_seconds: duration });
    };
  }, []);
};