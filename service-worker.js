const CACHE_NAME = "personal-crm-v05-pwa-v1";
const CORE = ["./", "./index.html", "./manifest.json", "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== self.location.origin) return;
  if (r.mode === "navigate") {
    e.respondWith(fetch(r).then(response => {
      const copy = response.clone(); caches.open(CACHE_NAME).then(c => c.put("./index.html", copy)); return response;
    }).catch(() => caches.match("./index.html")));
  } else {
    e.respondWith(caches.match(r).then(cached => cached || fetch(r).then(response => {
      if (response && response.ok) { const copy = response.clone(); caches.open(CACHE_NAME).then(c => c.put(r, copy)); }
      return response;
    })));
  }
});
