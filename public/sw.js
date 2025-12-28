/* Handwerk+ service worker (simple cache-first for static assets) */
const CACHE = 'handwerkplus-v1';
const ASSETS = [
  './',
  './index.html',
  './app.js',
  './config.js',
  './assets/styles.css',
  './i18n/strings.json',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './cabinet/index.html',
  './admin/index.html',
  './legal/impressum.html',
  './legal/datenschutz.html',
  './legal/agb.html'
];

self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', (e)=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener('fetch', (e)=>{
  const req = e.request;
  const url = new URL(req.url);
  // Don't cache Apps Script calls
  if(url.origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then((cached)=>{
      if(cached) return cached;
      return fetch(req).then((res)=>{
        // cache GET html/js/css/json/png
        if(req.method === 'GET' && res.ok && ['basic','cors'].includes(res.type)){
          const clone = res.clone();
          caches.open(CACHE).then(c=>c.put(req, clone)).catch(()=>{});
        }
        return res;
      }).catch(()=>cached || new Response('Offline', {status:503, statusText:'Offline'}));
    })
  );
});
