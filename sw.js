// Offline support: serve saved files, refresh them in the background.
const CACHE = "bltdm-v5";
const FILES = ["./", "index.html", "style.css?v=5", "data.js?v=5", "guide.js?v=5", "app.js?v=5", "favicon.svg", "icon-192.png", "accessibility.html"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request);
    const net = fetch(e.request).then(r => { if (r.ok && new URL(e.request.url).origin === location.origin) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
