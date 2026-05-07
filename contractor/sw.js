self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("kaiser-v1").then(cache => {
      return cache.addAll([
        "./contractor-mobile.html"
      ]);
    })
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
