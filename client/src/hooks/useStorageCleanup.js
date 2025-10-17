import { useEffect } from 'react';
import { clearExpiredCache, getStorageStats } from '../utils/storage';

/**
 * Hook to periodically clean up expired cache entries
 * @param {number} intervalMs - Cleanup interval in milliseconds (default: 5 minutes)
 */
export const useStorageCleanup = (intervalMs = 5 * 60 * 1000) => {
  useEffect(() => {
    // Initial cleanup
    const initialCleanup = () => {
      clearExpiredCache();
      getStorageStats();
    };

    initialCleanup();

    // Set up periodic cleanup
    const interval = setInterval(() => {
      initialCleanup();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);
};

export default useStorageCleanup;
