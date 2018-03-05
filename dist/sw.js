self.addEventListener('install', event => {
  event.waitUntil(async function(){
    const cache = await caches.open('recipes');
    await cache.addAll([
      '/',
      '/main.css',
      '/main.js'
    ]);
  }());
});

self.addEventListener('fetch', event => {
  event.respondWith(async function(){
    const response = await caches.match(event.request);
    return response || fetch(event.request).then(response => {
      return caches.open('recipes').then(function(cache) {
        cache.put(event.request, response.clone());
        return response;
      })
    });
  }());
});
