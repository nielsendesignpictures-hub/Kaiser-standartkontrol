/* Kaiser Kontrol — service worker.
   HTML hentes altid fra nettet først (undgår gammel cache på iOS),
   resten cachelagres så appen virker offline i køkkenet. */
const CACHE = 'kaiser-kontrol-v1';
const FILER = ['./', './kontrol.html', './manifest.json', './images/logo.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILER).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const erHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');
  if (erHTML) {
    e.respondWith(
      fetch(req).then(r => {
        const kopi = r.clone();
        caches.open(CACHE).then(c => c.put(req, kopi));
        return r;
      }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
  } else {
    e.respondWith(
      caches.match(req).then(r => r || fetch(req).then(res => {
        const kopi = res.clone();
        caches.open(CACHE).then(c => c.put(req, kopi));
        return res;
      }))
    );
  }
});
