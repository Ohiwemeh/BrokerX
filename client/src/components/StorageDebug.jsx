import React, { useState, useEffect } from 'react';
import { getStorageStats, clearAllCache, clearExpiredCache } from '../utils/storage';

/**
 * Storage Debug Component
 * Shows storage usage and provides manual cleanup controls
 * Only use in development or for debugging
 */
const StorageDebug = () => {
  const [stats, setStats] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const refreshStats = () => {
    setStats(getStorageStats());
  };

  useEffect(() => {
    refreshStats();
    const interval = setInterval(refreshStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClearExpired = () => {
    const cleared = clearExpiredCache();
    alert(`Cleared ${cleared} expired cache entries`);
    refreshStats();
  };

  const handleClearAll = () => {
    if (confirm('Clear all cache? This will not affect your login.')) {
      const cleared = clearAllCache();
      alert(`Cleared ${cleared} cache entries`);
      refreshStats();
    }
  };

  if (!stats) return null;

  const getColorClass = () => {
    const percent = parseFloat(stats.percentUsed);
    if (percent > 90) return 'bg-red-500';
    if (percent > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-700 hover:bg-slate-700 text-xs font-mono"
          title="Storage Debug"
        >
          💾 {stats.percentUsed}%
        </button>
      ) : (
        <div className="bg-slate-800 text-white p-4 rounded-lg shadow-2xl border border-slate-700 w-72">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-sm">Storage Debug</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Usage:</span>
                <span className={`font-bold ${parseFloat(stats.percentUsed) > 80 ? 'text-red-400' : 'text-green-400'}`}>
                  {stats.percentUsed}%
                </span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getColorClass()}`}
                  style={{ width: `${Math.min(100, stats.percentUsed)}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Size:</span>
              <span>{stats.totalSizeMB} MB / {stats.maxSizeMB} MB</span>
            </div>

            <div className="flex justify-between">
              <span className="text-slate-400">Cache entries:</span>
              <span>{stats.cacheCount}</span>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700">
              <button
                onClick={handleClearExpired}
                className="flex-1 bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-xs"
              >
                Clear Expired
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs"
              >
                Clear All
              </button>
            </div>

            <button
              onClick={refreshStats}
              className="w-full bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-xs mt-2"
            >
              🔄 Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StorageDebug;
