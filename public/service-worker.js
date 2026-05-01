/* PaTra — Service Worker (offline + cache)
   Stratégie :
   - API de cours (Yahoo, CoinGecko, /api/*) → network only, jamais caché
   - Navigation HTML → NetworkFirst (updates rapides)
   - Assets statiques (JS/CSS/fonts/images) → CacheFirst
*/

const CACHE_VERSION = 'patra-v1-' + (self.__BUILD_ID || Date.now());
const STATIC_CACHE = 'patra-static-' + CACHE_VERSION;

const PRECACHE_URLS = ['/', '/manifest.json', '/favicon.ico'];

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE)
      .then(c => c.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ─── Activate : purge vieux caches ────────────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(k => k.startsWith('patra-') && !k.endsWith(CACHE_VERSION))
        .map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // Données live : jamais caché
  const isLiveData =
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('coingecko') ||
    url.hostname.includes('yahoo') ||
    url.hostname.includes('corsproxy.io');

  if (isLiveData) return; // network only

  // Navigation HTML : NetworkFirst
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then(c => c.put(e.request, copy));
          return res;
        })
        .catch(() =>
          caches.match(e.request).then(r => r || caches.match('/'))
        )
    );
    return;
  }

  // Assets statiques : CacheFirst
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res.ok && res.status === 200) {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
