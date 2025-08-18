const CACHE_NAME = 'sparkle-kids-v2'; // updated version
const ASSETS = [
  '/',
  '/index.html',
  '/rezervare.html',
  '/images/logo.webp',
  '/images/eduard.webp',
  '/images/rares.webp',
  '/images/tudor.webp',
  '/images/monica.webp',
  '/images/teodora.webp',
  '/images/alexia.webp',
  '/images/gallery1.webp',
  '/images/gallery2.webp',
  '/images/gallery3.webp',
  '/images/gallery4.webp',
  '/images/gallery5.webp',
  '/images/gallery6.webp',
  '/images/gallery7.webp',
  '/images/gallery8.webp',
  '/images/gallery9.webp'
];

// Install service worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      })
    )).then(() => self.clients.claim())
  );
});

// Serve GET requests from cache, fallback to network; let POST requests pass through
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    // Don't intercept non-GET requests
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
