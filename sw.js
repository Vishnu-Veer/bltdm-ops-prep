// Offline support: serve saved files, refresh them in the background.
const CACHE = "bltdm-v7";
const FILES = ["./", "index.html", "style.css?v=7", "data.js?v=6", "guide.js?v=6", "practice.js?v=7", "scenarios.js?v=7", "app.js?v=7", "favicon.svg", "icon-192.png", "accessibility.html"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.origin !== location.origin) return; // never touch Gemini calls
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request);
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
