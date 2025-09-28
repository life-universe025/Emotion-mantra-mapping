// Service Worker for Sanatan Mantra Sadhana PWA
const CACHE_NAME = 'mantra-sadhana-v1.0.0';
const STATIC_CACHE = 'mantra-sadhana-static-v1.0.0';
const AUDIO_CACHE = 'mantra-sadhana-audio-v1.0.0';
const API_CACHE = 'mantra-sadhana-api-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/apple-touch-icon.png',
  '/favicon.svg',
  '/site.webmanifest',
  '/pwa-192.png',
  '/pwa-512.png',
  '/pwa-maskable-192.png',
  '/pwa-maskable-512.png'
];

// Audio files to cache (will be populated dynamically)
const AUDIO_FILES = [
  // These will be added dynamically when mantras are loaded
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/mantras',
  '/api/emotions',
  '/api/user-stats'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      caches.open(AUDIO_CACHE).then((cache) => {
        console.log('Service Worker: Audio cache ready');
        return cache;
      })
    ]).then(() => {
      console.log('Service Worker: Installation complete');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== STATIC_CACHE && 
              cacheName !== AUDIO_CACHE && 
              cacheName !== API_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static files (HTML, CSS, JS, images)
    if (isStaticFile(request)) {
      event.respondWith(handleStaticRequest(request));
    }
    // Audio files
    else if (isAudioFile(request)) {
      event.respondWith(handleAudioRequest(request));
    }
    // API requests
    else if (isAPIRequest(request)) {
      event.respondWith(handleAPIRequest(request));
    }
    // Other requests
    else {
      event.respondWith(handleOtherRequest(request));
    }
  }
});

// Helper functions
function isStaticFile(request) {
  const url = new URL(request.url);
  return url.origin === location.origin && 
         (url.pathname.endsWith('.html') || 
          url.pathname.endsWith('.css') || 
          url.pathname.endsWith('.js') || 
          url.pathname.endsWith('.png') || 
          url.pathname.endsWith('.svg') || 
          url.pathname.endsWith('.ico') ||
          url.pathname === '/');
}

function isAudioFile(request) {
  const url = new URL(request.url);
  return url.pathname.includes('/audio/') || 
         url.pathname.endsWith('.mp3') || 
         url.pathname.endsWith('.wav') || 
         url.pathname.endsWith('.ogg');
}

function isAPIRequest(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/api/') || 
         url.pathname.startsWith('/functions/') ||
         url.hostname.includes('supabase');
}

// Handle static file requests
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Static file fetch failed:', error);
    // Return offline page or fallback
    return new Response('Offline - Static file not available', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle audio file requests
async function handleAudioRequest(request) {
  try {
    const cache = await caches.open(AUDIO_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: Audio fetch failed:', error);
    // Return a fallback audio or error response
    return new Response('Audio not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle API requests
async function handleAPIRequest(request) {
  try {
    // Try network first for API requests
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful API responses
      const cache = await caches.open(API_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Service Worker: API fetch failed, trying cache:', error);
    
    // Fallback to cache for API requests
    const cache = await caches.open(API_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'This feature requires an internet connection'
    }), {
      status: 503,
      statusText: 'Service Unavailable',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Handle other requests
async function handleOtherRequest(request) {
  // Skip intercepting development requests
  if (request.url.includes('@vite') || 
      request.url.includes('@react-refresh') ||
      request.url.includes('localhost:3000/src/') ||
      request.url.includes('localhost:3000/node_modules/')) {
    return fetch(request);
  }

  try {
    // Try to fetch from network first
    const response = await fetch(request);
    if (response.ok) {
      return response;
    }
    throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.log('Service Worker: Request failed, trying cache:', error);
    
    // Try to serve from cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's a navigation request, serve the app shell
    if (request.mode === 'navigate') {
      const appShell = await caches.match('/');
      if (appShell) {
        return appShell;
      }
    }
    
    // For development, just pass through the request
    if (request.url.includes('localhost:3000')) {
      return fetch(request);
    }
    
    // Return a proper offline response instead of 503
    return new Response('Offline - Please check your connection', {
      status: 200,
      statusText: 'OK',
      headers: {
        'Content-Type': 'text/html'
      }
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered');
  
  if (event.tag === 'mantra-session-sync') {
    event.waitUntil(syncMantraSessions());
  }
});

// Sync mantra sessions when back online
async function syncMantraSessions() {
  try {
    // Get pending sessions from IndexedDB
    const pendingSessions = await getPendingSessions();
    
    for (const session of pendingSessions) {
      try {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(session)
        });
        
        // Remove from pending after successful sync
        await removePendingSession(session.id);
      } catch (error) {
        console.log('Service Worker: Failed to sync session:', error);
      }
    }
  } catch (error) {
    console.log('Service Worker: Background sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Time for your daily mantra practice',
    icon: '/pwa-192.png',
    badge: '/pwa-192.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/'
    },
    actions: [
      {
        action: 'practice',
        title: 'Start Practice',
        icon: '/shortcut-practice.png'
      },
      {
        action: 'later',
        title: 'Remind Later',
        icon: '/shortcut-profile.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Sanatan Mantra Sadhana', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'practice') {
    event.waitUntil(
      clients.openWindow('/')
    );
  } else if (event.action === 'later') {
    // Schedule reminder for later
    event.waitUntil(
      scheduleReminder()
    );
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Schedule reminder for later
async function scheduleReminder() {
  // This would integrate with your reminder system
  console.log('Service Worker: Scheduling reminder for later');
}

// Helper functions for IndexedDB (simplified)
async function getPendingSessions() {
  // Implementation would depend on your IndexedDB setup
  return [];
}

async function removePendingSession(sessionId) {
  // Implementation would depend on your IndexedDB setup
  console.log('Service Worker: Removing pending session:', sessionId);
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_AUDIO') {
    cacheAudioFile(event.data.url);
  }
});

// Cache audio file when requested
async function cacheAudioFile(url) {
  try {
    const cache = await caches.open(AUDIO_CACHE);
    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response);
      console.log('Service Worker: Audio cached:', url);
    }
  } catch (error) {
    console.log('Service Worker: Failed to cache audio:', error);
  }
}
