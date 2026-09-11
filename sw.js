const CACHE = 'fcs-v2';
const ASSETS = ['./', './index.html', './404.html', './manifest.json', './css/main.css', './js/main.js', './js/data-loader.js', './data/site-data.json', './images/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const { request } = e; if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== location.origin) { e.respondWith(fetch(request).catch(() => new Response('Offline', { status: 503 }))); return; }
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    try { const res = await fetch(request); if (res.ok && (request.destination === 'document' || request.destination === 'style' || request.destination === 'script' || request.url.endsWith('.json'))) cache.put(request, res.clone()); return res; }
    catch { const hit = await cache.match(request, { ignoreSearch: true }); return hit || cache.match('./index.html'); }
  })());
});
