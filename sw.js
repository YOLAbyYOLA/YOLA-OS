// ── YOLA SW — network-first con fallback cache (solo producción) ──
// 2026-08-21 — el daemon local (127.0.0.1 / localhost) NUNCA se intercepta:
// el SW solo cachea recursos estáticos de la propia app (bundle, css, assets).
// En modo demo/pure tampoco hace falta cachear nada del motor.
// Si DESDE LOCALHOST se sirve este SW (dev), se auto-desregistra: el dev
// no debe tener SW activo (rompe HMR y mete ruido de red).
self.addEventListener('install', () => {
  self.skipWaiting();
  // Auto-limpieza en dev: si el SW se descargó desde localhost, se retira.
  if (self.location?.hostname === 'localhost' || self.location?.hostname === '127.0.0.1') {
    self.registration?.unregister?.().catch(() => {});
  }
});
self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

const isLoopback = (url) =>
  url.hostname === 'localhost' || url.hostname === '127.0.0.1' || url.hostname === '::1';

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  // Daemon local: pasar DIRECTO, nunca cachear, nunca re-fetchear desde aquí.
  if (isLoopback(url) || url.pathname.startsWith('/api/')) {
    return; // deja que el navegador haga su fetch normal (sin respondWith)
  }
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cachear recursos exitosos estáticos (solo misma-origin app).
        if (res.ok && url.origin === self.location.origin && e.request.method === 'GET') {
          const clone = res.clone();
          caches.open('yola-v1').then((c) => c.put(e.request, clone)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(e.request).then((hit) => hit || Response.error()))
  );
});
