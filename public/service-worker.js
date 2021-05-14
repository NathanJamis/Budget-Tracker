const CACHE_NAME = "cache-v1";
const DATA_CACHE_NAME = "data-cache-v2";

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
      .open(CACHE_NAME)
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
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            )
        })
    )
});

// self.addEventListener("fetch", (event) => {
//     event.respondWith(
//         fetch(event.request)
//             .then(res => {
//                 caches
//                     .open(CACHE_NAME)
//                     .then(cache => {
//                         cache.put(event.request, response.clone());
//                     });
//                 return response;
//             }).catch(err => caches.match(event.request).then(res => res))
//     )
// });

self.addEventListener('fetch', (event) => {
    if (event.request.url.startsWith(self.location.origin)) {
      event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
  
          return caches.open(RUNTIME).then((cache) => {
            return fetch(event.request).then((response) => {
              return cache.put(event.request, response.clone()).then(() => {
                return response;
              });
            });
          });
        })
      );
    }
  });
