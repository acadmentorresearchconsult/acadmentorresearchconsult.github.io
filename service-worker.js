const CACHE_NAME = "acadmentor-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/faq.html",
  "/events.html",
  "/styles.css",
  "/script.js",
  "/logo.png"
];

// Install: cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// Fetch: serve from cache if offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});