/**
 * Storage utility with quota management and automatic cleanup
 */

const STORAGE_PREFIX = 'brokerx_';
const MAX_STORAGE_SIZE = 4 * 1024 * 1024; // 4MB limit (leaving buffer from 5MB quota)
const MAX_ITEM_SIZE = 500 * 1024; // 500KB max per item
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes default expiry

/**
 * Calculate approximate size of data in bytes
 */
const getDataSize = (data) => {
  return new Blob([JSON.stringify(data)]).size;
};

/**
 * Get total localStorage usage
 */
const getTotalStorageSize = () => {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
};

/**
 * Clear expired cache entries
 */
export const clearExpiredCache = () => {
  const now = Date.now();
  const keysToRemove = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX + 'cache_')) {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        if (item.expiry && item.expiry < now) {
          keysToRemove.push(key);
        }
      } catch (e) {
        // Invalid JSON, remove it
        keysToRemove.push(key);
      }
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
  return keysToRemove.length;
};

/**
 * Clear old cache entries (LRU - Least Recently Used)
 */
const clearOldCache = (keepCount = 5) => {
  const cacheEntries = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX + 'cache_')) {
      try {
        const item = JSON.parse(localStorage.getItem(key));
        cacheEntries.push({
          key,
          timestamp: item.timestamp || 0,
          size: localStorage.getItem(key).length
        });
      } catch (e) {
        // Invalid entry, mark for removal
        cacheEntries.push({ key, timestamp: 0, size: 0 });
      }
    }
  }

  // Sort by timestamp (oldest first)
  cacheEntries.sort((a, b) => a.timestamp - b.timestamp);

  // Remove oldest entries, keeping only the specified count
  const toRemove = cacheEntries.slice(0, Math.max(0, cacheEntries.length - keepCount));
  toRemove.forEach(entry => localStorage.removeItem(entry.key));

  return toRemove.length;
};

/**
 * Safe localStorage setItem with quota management
 */
export const setItem = (key, value, options = {}) => {
  const { 
    cache = false, 
    expiryMs = CACHE_EXPIRY,
    compress = true 
  } = options;

  const prefixedKey = cache ? `${STORAGE_PREFIX}cache_${key}` : `${STORAGE_PREFIX}${key}`;
  
  let dataToStore = value;
  
  if (cache) {
    dataToStore = {
      data: value,
      timestamp: Date.now(),
      expiry: Date.now() + expiryMs
    };
  }

  const dataString = JSON.stringify(dataToStore);
  const dataSize = getDataSize(dataToStore);

  // Check if single item is too large (more restrictive)
  if (dataSize > MAX_ITEM_SIZE) {
    console.warn(`Item too large to cache (${(dataSize / 1024).toFixed(2)}KB). Max: 500KB. Skipping cache.`);
    return false; // Don't cache, but don't throw error
  }

  // Check if would exceed total storage
  const totalSize = getTotalStorageSize();
  if (totalSize + dataSize > MAX_STORAGE_SIZE) {
    console.warn('Storage approaching limit. Clearing old cache...');
    clearExpiredCache();
  }

  try {
    // First, try to set the item
    localStorage.setItem(prefixedKey, dataString);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded. Attempting cleanup...');
      
      // Step 1: Clear expired cache
      const expiredCleared = clearExpiredCache();
      console.log(`Cleared ${expiredCleared} expired cache entries`);

      try {
        localStorage.setItem(prefixedKey, dataString);
        return true;
      } catch (retryError) {
        // Step 2: Clear old cache entries
        const oldCleared = clearOldCache(3);
        console.log(`Cleared ${oldCleared} old cache entries`);

        try {
          localStorage.setItem(prefixedKey, dataString);
          return true;
        } catch (finalError) {
          // Step 3: If still failing, clear all cache
          console.warn('Clearing all cache to free space...');
          clearAllCache();
          
          try {
            localStorage.setItem(prefixedKey, dataString);
            return true;
          } catch (lastError) {
            console.error('Unable to store data even after cleanup:', lastError);
            return false;
          }
        }
      }
    } else {
      console.error('Error storing data:', error);
      return false;
    }
  }
};

/**
 * Safe localStorage getItem
 */
export const getItem = (key, options = {}) => {
  const { cache = false } = options;
  const prefixedKey = cache ? `${STORAGE_PREFIX}cache_${key}` : `${STORAGE_PREFIX}${key}`;

  try {
    const item = localStorage.getItem(prefixedKey);
    if (!item) return null;

    const parsed = JSON.parse(item);

    if (cache) {
      // Check if cache is expired
      if (parsed.expiry && parsed.expiry < Date.now()) {
        localStorage.removeItem(prefixedKey);
        return null;
      }
      return parsed.data;
    }

    return parsed;
  } catch (error) {
    console.error('Error reading from storage:', error);
    return null;
  }
};

/**
 * Remove item from storage
 */
export const removeItem = (key, options = {}) => {
  const { cache = false } = options;
  const prefixedKey = cache ? `${STORAGE_PREFIX}cache_${key}` : `${STORAGE_PREFIX}${key}`;
  
  try {
    localStorage.removeItem(prefixedKey);
    return true;
  } catch (error) {
    console.error('Error removing from storage:', error);
    return false;
  }
};

/**
 * Clear all cache entries
 */
export const clearAllCache = () => {
  const keysToRemove = [];
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(STORAGE_PREFIX + 'cache_')) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach(key => localStorage.removeItem(key));
  console.log(`Cleared ${keysToRemove.length} cache entries`);
  return keysToRemove.length;
};

/**
 * Get storage statistics
 */
export const getStorageStats = () => {
  const totalSize = getTotalStorageSize();
  const cacheCount = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i))
    .filter(key => key && key.startsWith(STORAGE_PREFIX + 'cache_')).length;

  return {
    totalSize,
    totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    maxSize: MAX_STORAGE_SIZE,
    maxSizeMB: (MAX_STORAGE_SIZE / 1024 / 1024).toFixed(2),
    percentUsed: ((totalSize / MAX_STORAGE_SIZE) * 100).toFixed(2),
    cacheCount
  };
};

/**
 * Initialize storage (run cleanup on app start)
 */
export const initStorage = () => {
  const expired = clearExpiredCache();
  const stats = getStorageStats();
  
  console.log('Storage initialized:', stats);
  console.log(`Cleared ${expired} expired entries`);

  // If storage is over 80% full, clear old cache
  if (stats.percentUsed > 80) {
    console.warn('Storage usage high, clearing old cache...');
    clearOldCache(5);
  }
};

export default {
  setItem,
  getItem,
  removeItem,
  clearAllCache,
  clearExpiredCache,
  getStorageStats,
  initStorage
};
