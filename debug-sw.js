// Service Worker Debug Script
// Run this in the browser console to debug service worker issues

console.log('=== Service Worker Debug Script ===');

// Check if service worker is supported
if ('serviceWorker' in navigator) {
  console.log('✅ Service Worker is supported');
  
  // Check current registration
  navigator.serviceWorker.getRegistration().then(registration => {
    if (registration) {
      console.log('✅ Service Worker is registered');
      console.log('Scope:', registration.scope);
      console.log('State:', registration.active ? registration.active.state : 'No active worker');
      
      // Check caches
      caches.keys().then(cacheNames => {
        console.log('📦 Available caches:', cacheNames);
        
        // Check static cache
        if (cacheNames.includes('mantra-sadhana-static-v1.0.1')) {
          caches.open('mantra-sadhana-static-v1.0.1').then(cache => {
            cache.keys().then(requests => {
              console.log('📁 Static cache contents:', requests.map(req => req.url));
            });
          });
        }
      });
      
    } else {
      console.log('❌ No Service Worker registered');
    }
  });
  
  // Listen for service worker messages
  navigator.serviceWorker.addEventListener('message', event => {
    console.log('📨 Service Worker message:', event.data);
  });
  
} else {
  console.log('❌ Service Worker is not supported');
}

// Test cache functionality
async function testCache() {
  console.log('🧪 Testing cache functionality...');
  
  try {
    const cache = await caches.open('mantra-sadhana-static-v1.0.1');
    const response = await cache.match('/');
    
    if (response) {
      console.log('✅ Root page cached successfully');
    } else {
      console.log('❌ Root page not found in cache');
    }
    
    // Test JavaScript module caching
    const jsResponse = await cache.match('/assets/index-7c09c803.js');
    if (jsResponse) {
      console.log('✅ Main JS module cached successfully');
      console.log('Content-Type:', jsResponse.headers.get('Content-Type'));
    } else {
      console.log('❌ Main JS module not found in cache');
    }
    
  } catch (error) {
    console.error('❌ Cache test failed:', error);
  }
}

// Clear all caches
async function clearAllCaches() {
  console.log('🧹 Clearing all caches...');
  
  try {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('✅ All caches cleared');
  } catch (error) {
    console.error('❌ Failed to clear caches:', error);
  }
}

// Unregister service worker
async function unregisterSW() {
  console.log('🗑️ Unregistering service worker...');
  
  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.unregister();
      console.log('✅ Service worker unregistered');
    } else {
      console.log('❌ No service worker to unregister');
    }
  } catch (error) {
    console.error('❌ Failed to unregister service worker:', error);
  }
}

// Make functions available globally
window.testCache = testCache;
window.clearAllCaches = clearAllCaches;
window.unregisterSW = unregisterSW;

console.log('🔧 Available functions: testCache(), clearAllCaches(), unregisterSW()');
console.log('=== Debug Script Loaded ===');
