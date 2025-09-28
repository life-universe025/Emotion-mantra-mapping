// Debug script for PWA issues
console.log('🔍 PWA Debug Information');

// Check service worker support
console.log('Service Worker Support:', 'serviceWorker' in navigator);

// Check current service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log('Active Service Workers:', registrations.length);
    registrations.forEach((registration, index) => {
      console.log(`SW ${index + 1}:`, {
        scope: registration.scope,
        state: registration.active?.state,
        scriptURL: registration.active?.scriptURL
      });
    });
  });
}

// Check manifest
fetch('/manifest.json')
  .then(response => {
    console.log('Manifest Status:', response.status);
    if (response.ok) {
      return response.json();
    }
    throw new Error(`Manifest fetch failed: ${response.status}`);
  })
  .then(manifest => {
    console.log('Manifest loaded:', manifest.name);
  })
  .catch(error => {
    console.error('Manifest error:', error);
  });

// Check service worker file
fetch('/sw.js')
  .then(response => {
    console.log('Service Worker Status:', response.status);
  })
  .catch(error => {
    console.error('Service Worker error:', error);
  });

// Check online status
console.log('Online Status:', navigator.onLine);

// Check PWA features
const features = {
  serviceWorker: 'serviceWorker' in navigator,
  push: 'PushManager' in window,
  cache: 'caches' in window,
  backgroundSync: 'serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype
};
console.log('PWA Features:', features);

// Check if running in standalone mode
const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                    (window.navigator).standalone ||
                    document.referrer.includes('android-app://');
console.log('Standalone Mode:', isStandalone);

// Check storage
if ('storage' in navigator && 'estimate' in navigator.storage) {
  navigator.storage.estimate().then(estimate => {
    console.log('Storage Usage:', {
      used: Math.round((estimate.usage || 0) / 1024 / 1024) + ' MB',
      quota: Math.round((estimate.quota || 0) / 1024 / 1024) + ' MB'
    });
  });
}

// Check caches
if ('caches' in window) {
  caches.keys().then(cacheNames => {
    console.log('Active Caches:', cacheNames);
  });
}

console.log('🔍 Debug complete. Check console for details.');
