var CACHE='de-v3';
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){
    return c.addAll(['.','index.html']);
  }));
  self.skipWaiting();
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  // Network-first for navigation (HTML), cache-first for everything else
  if(e.request.mode==='navigate'){
    e.respondWith(
      fetch(e.request).then(function(resp){
        var clone=resp.clone();
        caches.open(CACHE).then(function(c){c.put(e.request,clone);});
        return resp;
      }).catch(function(){
        return caches.match(e.request);
      })
    );
  }else{
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
  }
});
