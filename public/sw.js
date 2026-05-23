const CACHE_NAME = "sportshop-pwa-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/src/main.jsx",
  "/src/App.jsx",
  "/src/index.css"
];

// Install Service Worker
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("PWA Service Worker: Caching critical shell assets");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Service Worker
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("PWA Service Worker: Clearing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch event listener - Network first fallback to Cache
self.addEventListener("fetch", (e) => {
  // Only cache GET requests
  if (e.request.method !== "GET") return;

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cache successful requests dynamically (especially map tiles, fonts, and stylesheets)
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          // Cache leaflet tiles, google fonts, and system files
          if (
            e.request.url.includes("tile.openstreetmap.org") || 
            e.request.url.includes("fonts.googleapis") ||
            e.request.url.includes("fonts.gstatic") ||
            e.request.url.includes("unpkg.com")
          ) {
            cache.put(e.request, resClone);
          }
        });
        return res;
      })
      .catch(() => {
        // Fallback to cache on network failure
        return caches.match(e.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // If a navigation request fails, return main index.html
          if (e.request.mode === "navigate") {
            return caches.match("/index.html");
          }
        });
      })
  );
});
