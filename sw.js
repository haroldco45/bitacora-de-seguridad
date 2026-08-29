/* Bitácora de Seguridad — Colinas del Portal
   Service Worker · Vibras Positivas HM
   Estrategia: cache-first para el shell, red con respaldo en caché para el resto. */

const CACHE = 'bitacora-colinas-v1';

const SHELL = [
  './',
  './index.html',
  './og-image.png'
];

/* Instalación: guarda el shell y activa de inmediato */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

/* Activación: limpia versiones anteriores */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(claves => Promise.all(
        claves.filter(c => c !== CACHE).map(c => caches.delete(c))
      ))
      .then(() => self.clients.claim())
  );
});

/* Fetch */
self.addEventListener('fetch', event => {
  const req = event.request;

  if (req.method !== 'GET') return;
  if (!req.url.startsWith('http')) return;

  /* Navegación: red primero para traer la versión nueva,
     y si no hay datos, se sirve la app desde caché. */
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(res => {
          const copia = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copia));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  /* Resto de recursos (incluidas las tipografías de Google):
     caché primero, y lo que llegue de la red se guarda. */
  event.respondWith(
    caches.match(req).then(hit => {
      if (hit) return hit;
      return fetch(req).then(res => {
        if (res && (res.status === 200 || res.type === 'opaque')) {
          const copia = res.clone();
          caches.open(CACHE).then(c => c.put(req, copia));
        }
        return res;
      }).catch(() => hit);
    })
  );
});

/* Permite forzar actualización desde la app si algún día se necesita */
self.addEventListener('message', e => {
  if (e.data === 'actualizar') self.skipWaiting();
});
