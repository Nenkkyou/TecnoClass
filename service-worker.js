const CACHE_NAME = 'tecno-class-cache-v1.1';
const OFFLINE_URL = 'index.html';  // Página padrão para fallback de navegação

// Arquivos a serem cacheados para funcionamento offline
const assetsToCache = [
  './',           // equivamente a index.html
  'index.html',
  'style.css',
  'script.js',
  'manifest.json',
  'images/icon-72x72.png',
  'images/icon-96x96.png',
  'images/icon-128x128.png',
  'images/icon-144x144.png',
  'images/icon-152x152.png',
  'images/icon-192x192.png',
  'images/icon-384x384.png',
  'images/icon-512x512.png'
];

// Instalação: cacheia os arquivos essenciais
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assetsToCache);
    })
    .then(() => self.skipWaiting())
  );
});

// Ativação: limpa caches antigos se o nome for diferente
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Intercepta requisições para fornecer respostas do cache/offline
self.addEventListener('fetch', event => {
  const request = event.request;
  // Ignora requisições que não sejam GET ou de extensões do navegador
  if (request.method !== 'GET' || request.url.startsWith('chrome-extension://')) {
    return;
  }
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        // Retorna do cache se disponível (Cache First)
        return cachedResponse;
      }
      // Não está no cache, tenta buscar na rede
      return fetch(request).then(networkResponse => {
        // Sucesso na rede: opcionalmente armazena no cache para futuras requisições
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Falha na rede (offline): retorna erro 408 (Request Timeout)
        return new Response('Offline - recurso indisponível', { status: 408, statusText: 'Offline or Timeout' });
      });
    })
  );
});
