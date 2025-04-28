/* TecnoClass - Service Worker
   Implementação básica de Service Worker para funcionalidades PWA
*/

const CACHE_NAME = 'tecnoclass-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/tecnoclass-styles.css',
  '/tecnoclass-interactions.js',
  '/manifest.json',
  '/images/tecnoclass-logo.svg',
  '/images/icons/icon-192x192.png',
  '/images/icons/icon-512x512.png',
  '/images/courses/programming.jpg',
  '/images/courses/cybersecurity.jpg',
  '/images/courses/ai.jpg',
  '/images/courses/product-owner.jpg'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Interceptação de requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna o recurso do cache se encontrado
        if (response) {
          return response;
        }
        
        // Caso contrário, busca na rede
        return fetch(event.request)
          .then(response => {
            // Verifica se a resposta é válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clona a resposta para armazenar no cache
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Se falhar, retorna a página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/offline.html');
            }
          });
      })
  );
});

// Evento de sincronização em segundo plano
self.addEventListener('sync', event => {
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

// Função para sincronizar dados do usuário
function syncUserData() {
  // Implementação da sincronização de dados
  return new Promise((resolve, reject) => {
    // Lógica de sincronização aqui
    resolve();
  });
}
