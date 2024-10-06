const CACHE_NAME = 'v1';
const urlsToCache = [
  'index.html',
  'about.html',
  'offline.html',
  './style.css',           
  './contact.css',         
  './pic-removebg-preview.png', 
  './background web.jpg',
  './offline.jpg',
  './picture2.jpeg'        
];


self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opening cache and caching assets');
      return cache.addAll(urlsToCache);
    })
  );
});

// Aktivasi service worker dan hapus cache lama jika ada
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch: Menangani request dan menyediakan fallback untuk offline
self.addEventListener('fetch', (event) => {
  console.log('Service Wokrer: Fetching');
  event.respondWith(
    caches.match(event.request).then(
      (response) => {
      // Jika request ada di cache, kembalikan dari cache
      if (response) {
        return response;
      }
      // Jika tidak ada di cache, ambil dari jaringan
      return fetch(event.request).catch(
        () =>caches.match('offline.html')
      )
      })
    )
});