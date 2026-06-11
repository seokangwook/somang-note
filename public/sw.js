// 소망노트 PWA service worker — minimal offline shell.
const CACHE = 'somang-v1';
const ESSENTIALS = ['/', '/favicon.svg', '/manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ESSENTIALS)).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // never cache API or POST
  if (req.method !== 'GET' || new URL(req.url).pathname.startsWith('/api/')) return;
  e.respondWith(
    fetch(req)
      .then((r) => {
        const copy = r.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return r;
      })
      .catch(() => caches.match(req).then((m) => m || new Response('', { status: 503 }))),
  );
});
