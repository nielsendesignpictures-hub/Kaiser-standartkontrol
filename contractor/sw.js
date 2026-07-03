/* Kaiser Håndværker – Service Worker
   Strategi:
   - App-shell (HTML, manifest, ikoner) caches ved install → appen åbner øjeblikkeligt, også offline.
   - Same-origin GET: stale-while-revalidate (server fra cache, opdater i baggrunden).
   - API-kald til script.google.com røres IKKE af service workeren
     (appen håndterer selv data-cache via localStorage).
   Bump CACHE_VERSION når du deployer en ny version → gammel cache ryddes automatisk.
*/

const CACHE_VERSION = "kaiser-hv-v1";

const SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => cache.addAll(SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_VERSION)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Kun GET og kun vores eget domæne. API og OneSignal går udenom.
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // Navigation: prøv cache først, fald tilbage til netværk, og omvendt-fallback offline
  if (req.mode === "navigate") {
    event.respondWith(
      caches.match("./index.html").then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE_VERSION).then((c) => c.put("./index.html", copy));
            }
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  // Øvrige assets: stale-while-revalidate
  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
