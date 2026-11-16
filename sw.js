/* Pages come from the network when there is one, so a new version shows at once;
   everything falls back to the cache, so the app still runs with no signal. */
const CACHE='line-check-v3';
const ASSETS=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable.png',
  'vendor/xlsx.min.js','vendor/jspdf.min.js','vendor/jspdf-autotable.min.js','vendor/zxing.min.js'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==self.location.origin) return;
  const isPage=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('index.html');
  if(isPage){
    /* weak factory Wi-Fi can hang rather than fail, so give the network 3 seconds */
    const slow=new Promise((_,rej)=>setTimeout(()=>rej(new Error('timeout')),3000));
    e.respondWith(Promise.race([fetch(r),slow]).then(res=>{
      if(res&&res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put('index.html',copy))}
      return res;
    }).catch(()=>caches.match('index.html').then(hit=>hit||caches.match('./'))));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{
    if(res&&res.ok&&res.type==='basic'){const copy=res.clone();caches.open(CACHE).then(c=>c.put(r,copy))}
    return res;
  })));
});
