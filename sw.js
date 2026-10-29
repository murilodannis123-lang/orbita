// guarda o jogo no aparelho para abrir até sem internet; versão nova substitui a antiga
const CACHE='orbita-v16';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;
  // páginas: tenta a rede primeiro (pega atualização), cai no cache offline; o resto: cache primeiro
  if(e.request.mode==='navigate'){e.respondWith(fetch(e.request).then(r=>{const c=r.clone();caches.open(CACHE).then(k=>k.put('index.html',c));return r;}).catch(()=>caches.match('index.html')));return;}
  e.respondWith(caches.match(e.request).then(m=>m||fetch(e.request).then(r=>{if(r.ok&&(e.request.url.startsWith(self.location.origin)||e.request.url.includes('fonts.g'))){const c=r.clone();caches.open(CACHE).then(k=>k.put(e.request,c));}return r;})));});
