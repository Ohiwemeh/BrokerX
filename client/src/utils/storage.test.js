/**
 * Quick test file to verify storage exports
 * Run this in browser console to test: import('./utils/storage.test.js')
 */

import { 
  setItem, 
  getItem, 
  removeItem, 
  clearAllCache, 
  clearExpiredCache,
  getStorageStats,
  initStorage 
} from './storage.js';

console.log('✅ All storage exports loaded successfully!');

// Test basic functionality
export const runTests = () => {
  console.log('🧪 Running storage tests...\n');

  // Test 1: Set and Get
  console.log('Test 1: Set and Get Item');
  setItem('test_key', { message: 'Hello World' });
  const retrieved = getItem('test_key');
  console.log('✅ Set/Get:', retrieved?.message === 'Hello World' ? 'PASS' : 'FAIL');

  // Test 2: Cache with expiry
  console.log('\nTest 2: Cache with Expiry');
  setItem('test_cache', { data: 'cached' }, { cache: true, expiryMs: 1000 });
  const cached = getItem('test_cache', { cache: true });
  console.log('✅ Cache:', cached?.data === 'cached' ? 'PASS' : 'FAIL');

  // Test 3: Storage Stats
  console.log('\nTest 3: Storage Stats');
  const stats = getStorageStats();
  console.log('✅ Stats:', stats);
  console.log(`   - Size: ${stats.totalSizeMB} MB`);
  console.log(`   - Usage: ${stats.percentUsed}%`);
  console.log(`   - Cache Count: ${stats.cacheCount}`);

  // Test 4: Clear expired
  console.log('\nTest 4: Clear Expired Cache');
  const cleared = clearExpiredCache();
  console.log(`✅ Cleared ${cleared} expired entries`);

  // Cleanup
  removeItem('test_key');
  removeItem('test_cache', { cache: true });

  console.log('\n✅ All tests completed!');
};

// Auto-run tests
runTests();

export default {
  setItem,
  getItem,
  removeItem,
  clearAllCache,
  clearExpiredCache,
  getStorageStats,
  initStorage,
  runTests
};
