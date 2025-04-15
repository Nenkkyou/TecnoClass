const CACHE_NAME = 'tecno-class-cache-v1.1'; // Incremente a versão ao mudar assets
const urlsToCache = [
  '/', // Cache da raiz
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/favicon.ico',
  // Adicione aqui os caminhos para seus ícones e outras imagens estáticas
  '/images/icon-72x72.png',
  '/images/icon-96x96.png',
  '/images/icon-128x128.png',
  '/images/icon-144x144.png',
  '/images/icon-152x152.png',
  '/images/icon-192x192.png',
  '/images/icon-384x384.png',
  '/images/icon-512x512.png'
  // '/fonts/nome-da-fonte.woff2' // Exemplo para fontes
];

// Evento de Instalação: Cacheia os assets principais
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Cache aberto. Cacheando arquivos principais...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Arquivos principais cacheados com sucesso.');
        // Força a ativação do novo SW imediatamente (útil durante desenvolvimento)
        // Em produção, pode ser melhor deixar o SW esperar para assumir o controle
         return self.skipWaiting();
      })
      .catch(err => {
        console.error('[Service Worker] Falha ao cachear arquivos durante a instalação:', err);
      })
  );
});

// Evento de Ativação: Limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Cache antigo limpo.');
      // Assume o controle da página imediatamente
      return self.clients.claim();
    })
  );
});

// Evento Fetch: Estratégia Cache First (Tenta o cache, depois a rede)
self.addEventListener('fetch', event => {
  // Ignora requisições que não são GET (ex: POST)
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignora requisições para extensões do Chrome (comuns em dev)
  if (event.request.url.startsWith('chrome-extension://')) {
      return;
  }


  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Se encontrar no cache, retorna a resposta do cache
        if (cachedResponse) {
          // console.log('[Service Worker] Servindo do cache:', event.request.url);
          return cachedResponse;
        }

        // Se não encontrar no cache, busca na rede
        // console.log('[Service Worker] Buscando na rede:', event.request.url);
        return fetch(event.request).then(
          networkResponse => {
            // Verifica se a resposta da rede é válida
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse; // Retorna respostas não-OK ou opacas sem cachear
            }

            // Importante: Clona a resposta antes de usá-la.
            // Uma resposta só pode ser consumida uma vez.
            const responseToCache = networkResponse.clone();

            // Abre o cache e armazena a nova resposta
            caches.open(CACHE_NAME)
              .then(cache => {
                // console.log('[Service Worker] Cacheando nova resposta:', event.request.url);
                cache.put(event.request, responseToCache);
              });

            // Retorna a resposta original da rede para o navegador
            return networkResponse;
          }
        ).catch(error => {
          console.error('[Service Worker] Fetch falhou; rede ou cache indisponível.', error);
          // Opcional: Retornar uma página offline padrão se a requisição falhar
          // return caches.match('/offline.html'); // Você precisaria criar e cachear offline.html
          // Retorna uma resposta de erro genérica
           return new Response("Network error occurred", {
             status: 408, // Request Timeout
             headers: { "Content-Type": "text/plain" },
           });
        });
      })
  );
});
