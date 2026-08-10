var CACHE_NAME = 'kuromi-tv-v1';
var RUNTIME_CACHE = 'kuromi-runtime-v1';

var PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './codes.json'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return Promise.all(PRECACHE_URLS.map(function (url) {
        return cache.add(url).catch(function (e) {
          console.warn('[SW] ignorado:', url, e);
        });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE_NAME && k !== RUNTIME_CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  if (url.origin !== self.location.origin) {
    event.respondWith(networkFirst(req, RUNTIME_CACHE));
    return;
  }
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').indexOf('text/html') !== -1) {
    event.respondWith(networkFirst(req, CACHE_NAME));
    return;
  }
  event.respondWith(cacheFirst(req, RUNTIME_CACHE));
});

function cacheFirst(req, name) {
  return caches.match(req).then(function (c) {
    if (c) return c;
    return fetch(req).then(function (res) { return save(name, req, res); })
      .catch(function () { return fallback(req); });
  });
}
function networkFirst(req, name) {
  return fetch(req).then(function (res) { return save(name, req, res); })
    .catch(function () {
      return caches.match(req).then(function (c) { return c || fallback(req); });
    });
}
function save(name, req, res) {
  if (res && res.status === 200 && res.type === 'basic') {
    var copy = res.clone();
    caches.open(name).then(function (c) { c.put(req, copy).catch(function () {}); });
  }
  return res;
}
function fallback(req) {
  if ((req.headers.get('accept') || '').indexOf('text/html') !== -1) return caches.match('./index.html');
  return new Response('', { status: 503, statusText: 'Offline' });
            }
