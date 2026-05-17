var CACHE='de-v2';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return c.addAll(['.','index.html']);
  }));
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(clients.claim());
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  e.respondWith(
    caches.match(e.request).then(function(r){
      return r||fetch(e.request).then(function(resp){
        if(resp.ok){
          var clone=resp.clone();
          caches.open(CACHE).then(function(c){c.put(e.request,clone);});
        }
        return resp;
      });
    })
  );
});
