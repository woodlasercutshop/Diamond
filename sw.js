const C='diamond-v9',A=['./','index.html','config.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-192.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('diamond-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// Страница и config.js: сначала сеть, чтобы обновления и ключ защиты не застревали в кэше.
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
 const fresh=/(\/|index\.html|config\.js|manifest\.webmanifest)$/.test(u.pathname);
 if(fresh){e.respondWith(fetch(r).then(x=>{if(x.ok){const k=x.clone();caches.open(C).then(c=>c.put(r,k))}return x}).catch(()=>caches.match(r,{ignoreSearch:true})));return}
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r).then(x=>{if(x.ok){const k=x.clone();caches.open(C).then(c=>c.put(r,k))}return x})))});
