'use strict';
const PREFIX='odebu-app-'+encodeURIComponent(self.registration.scope)+'-';
const CACHE=PREFIX+'84805858b386243d';
const ASSETS=["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS))));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname))return;
 // Only the application shell is cached. No user records are sent or cached here.
 if(event.request.mode==='navigate'){
  event.respondWith((async()=>{try{const r=await fetch(event.request);if(r.ok)return r;}catch(e){}
   const cached=await caches.match(new URL('./index.html',self.registration.scope).href);
   return cached||new Response('通信につないで、初回の準備を行ってください。',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
  })());return;
 }
 const allowed=ASSETS.map(p=>new URL(p,self.registration.scope).href);
 if(allowed.includes(u.href))event.respondWith(caches.match(event.request).then(r=>r||fetch(event.request)));
});
