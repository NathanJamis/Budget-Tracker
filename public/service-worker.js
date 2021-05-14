const cacheName = "cache-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/manifest.json",
  "/style.css",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        cache.addAll(FILES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
      caches
        .keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== cacheName) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request)
            .then(res => {
                const resClone = res.clone();
                caches
                    .open(cacheName)
                    .then(cache => {
                        cache.put(event.request, resClone);
                    });
                return res;
            }).catch(err => caches.match(event.request).then(res => res))
    )
});
