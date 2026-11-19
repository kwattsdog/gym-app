const V='gym-v5';
const ZX='https://cdn.jsdelivr.net/npm/@zxing/library@0.21.3/umd/index.min.js';
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(async c=>{
  await c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})));
  try{const r=await fetch(ZX,{mode:'cors'});if(r&&r.ok)await c.put(ZX,r);}catch(err){}
}).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.href.split('?')[0]===ZX){
    e.respondWith(caches.match(ZX).then(hit=>hit||fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(ZX,cp));}return res;})));
    return;
  }
  if(u.origin!==location.origin)return;
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>{
    const net=fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;}).catch(()=>hit||caches.match('index.html'));
    return hit||net;
  }));
});
