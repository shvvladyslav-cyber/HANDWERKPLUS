/* Minimal SW for offline cache (GitHub Pages friendly) */
const CACHE = "handwerkplus-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/manifest.webmanifest",
  "/impressum.html",
  "/datenschutz.html",
  "/agb.html",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match("/index.html"));
    })
  );
});

// Register SW when loaded as script in index.html
if (typeof window !== "undefined") {
  window.addEventListener("load", async () => {
    try {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      }
    } catch (e) {}
  });
}
