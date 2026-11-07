const CACHE_NAME = 'hamam-radio-v4';
const ASSETS = [
  './',
  './index.html',
  './IMG_3320.JPG',
  './ssstik.io_@ISSDD_7689597148920352006.mp3',
  './ssstik.io_@gevenjilussko_7663545560258858262.mp3',
  './tts_1794059996527_2.wav',
  './tts_1794060362348_6.wav',
  './tts_1794060639757_8.wav',
  './tts_1794060925086_11%202.wav',
  './tts_1794061684960_13.wav'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((k) => { if (k !== CACHE_NAME) return caches.delete(k); })
    )).then(() => clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (event.request.url.match(/\.(mp3|wav|jpg|jpeg|png)$/i)) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);
    })
  );
});
