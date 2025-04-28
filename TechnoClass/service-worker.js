/**
 * TecnoClass-PWA - Service Worker
 * 
 * Este arquivo implementa o Service Worker para a aplicação TecnoClass-PWA,
 * fornecendo funcionalidades offline e estratégias de cache.
 */

// Nomes dos caches
const CACHE_STATIC_NAME = 'tecnoclass-static-v1';
const CACHE_DYNAMIC_NAME = 'tecnoclass-dynamic-v1';
const CACHE_CONTENT_NAME = 'tecnoclass-content-v1';

// Recursos estáticos para pré-cache (essenciais para o funcionamento da aplicação)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/styles/theme.css',
  '/styles/main.css',
  '/scripts/core/app.js',
  '/scripts/core/router.js',
  '/services/db/indexedDB.js',
  '/services/cache/cacheManager.js',
  '/services/auth/auth.js',
  '/utils/i18n/translations.js',
  '/assets/icons/favicon.ico',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/manifest.json'
];

// Limite de itens no cache dinâmico
const DYNAMIC_CACHE_LIMIT = 100;

/**
 * Limita o número de itens no cache
 * @param {string} cacheName - Nome do cache a ser limitado
 * @param {number} maxItems - Número máximo de itens permitidos
 */
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxItems) {
    // Remove os itens mais antigos (FIFO)
    await cache.delete(keys[0]);
    // Chama recursivamente até atingir o limite
    trimCache(cacheName, maxItems);
  }
}

/**
 * Evento de instalação do Service Worker
 * Pré-carrega recursos estáticos essenciais
 */
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(cache => {
        console.log('[Service Worker] Pré-cacheando recursos estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Pré-cache concluído');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[Service Worker] Erro no pré-cache:', error);
      })
  );
});

/**
 * Evento de ativação do Service Worker
 * Limpa caches antigos e toma controle de clientes
 */
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando...');
  
  event.waitUntil(
    // Limpa caches antigos
    caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => {
          if (
            key !== CACHE_STATIC_NAME && 
            key !== CACHE_DYNAMIC_NAME && 
            key !== CACHE_CONTENT_NAME
          ) {
            console.log('[Service Worker] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        console.log('[Service Worker] Reivindicando clientes');
        return self.clients.claim();
      })
  );
});

/**
 * Evento de fetch - intercepta requisições de rede
 * Implementa estratégia Cache First + Network Update para a maioria dos recursos
 */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Ignora requisições para o próprio service worker e requisições não GET
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Ignora requisições para APIs externas ou analytics
  if (url.origin !== self.origin) {
    return;
  }
  
  // Estratégia para recursos da aplicação (HTML, CSS, JS, imagens)
  if (event.request.headers.get('accept').includes('text/html')) {
    // Para páginas HTML: Network First com fallback para cache e offline
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Copia a resposta para o cache
          const clonedResponse = response.clone();
          caches.open(CACHE_DYNAMIC_NAME)
            .then(cache => {
              cache.put(event.request, clonedResponse);
            });
          return response;
        })
        .catch(async () => {
          // Tenta buscar do cache
          const cachedResponse = await caches.match(event.request);
          
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Se não estiver no cache, retorna página offline
          return caches.match('/offline.html');
        })
    );
  } else {
    // Para outros recursos: Cache First + Network Update
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            // Atualiza o cache em segundo plano
            fetch(event.request)
              .then(networkResponse => {
                caches.open(CACHE_DYNAMIC_NAME)
                  .then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    // Limita o tamanho do cache
                    trimCache(CACHE_DYNAMIC_NAME, DYNAMIC_CACHE_LIMIT);
                  });
              })
              .catch(error => {
                console.log('[Service Worker] Erro ao atualizar cache:', error);
              });
              
            // Retorna resposta do cache imediatamente
            return cachedResponse;
          }
          
          // Se não estiver no cache, busca da rede
          return fetch(event.request)
            .then(response => {
              // Armazena no cache dinâmico
              const clonedResponse = response.clone();
              caches.open(CACHE_DYNAMIC_NAME)
                .then(cache => {
                  cache.put(event.request, clonedResponse);
                  // Limita o tamanho do cache
                  trimCache(CACHE_DYNAMIC_NAME, DYNAMIC_CACHE_LIMIT);
                });
              return response;
            })
            .catch(error => {
              console.log('[Service Worker] Erro ao buscar recurso:', error);
              
              // Para imagens, retorna placeholder
              if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
                return caches.match('/assets/images/placeholder.png');
              }
              
              // Para outros recursos, retorna erro
              return new Response('Recurso não disponível offline', {
                status: 404,
                headers: { 'Content-Type': 'text/plain' }
              });
            });
        })
    );
  }
});

/**
 * Evento de sincronização em segundo plano
 * Processa operações pendentes quando a conexão é restabelecida
 */
self.addEventListener('sync', event => {
  console.log('[Service Worker] Sincronização em segundo plano', event.tag);
  
  if (event.tag === 'sync-user-data') {
    event.waitUntil(
      // Aqui seria implementada a lógica para sincronizar dados do usuário
      // quando a conexão for restabelecida
      console.log('[Service Worker] Sincronizando dados do usuário')
    );
  }
  
  if (event.tag === 'sync-content-updates') {
    event.waitUntil(
      // Aqui seria implementada a lógica para buscar atualizações de conteúdo
      console.log('[Service Worker] Buscando atualizações de conteúdo')
    );
  }
});

/**
 * Evento de notificação push
 * Exibe notificações para o usuário
 */
self.addEventListener('push', event => {
  console.log('[Service Worker] Notificação push recebida', event);
  
  let notification = {
    title: 'TecnoClass',
    body: 'Há novidades para você!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    data: {
      url: '/'
    }
  };
  
  if (event.data) {
    try {
      notification = JSON.parse(event.data.text());
    } catch (e) {
      console.error('[Service Worker] Erro ao processar dados da notificação:', e);
    }
  }
  
  event.waitUntil(
    self.registration.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon,
      badge: notification.badge,
      data: notification.data
    })
  );
});

/**
 * Evento de clique em notificação
 * Abre a URL associada à notificação
 */
self.addEventListener('notificationclick', event => {
  console.log('[Service Worker] Clique em notificação', event);
  
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(windowClients => {
          // Verifica se já há uma janela aberta e a foca
          for (let client of windowClients) {
            if (client.url === event.notification.data.url && 'focus' in client) {
              return client.focus();
            }
          }
          
          // Se não houver janela aberta, abre uma nova
          if (clients.openWindow) {
            return clients.openWindow(event.notification.data.url);
          }
        })
    );
  }
});

/**
 * Evento de mensagem
 * Processa mensagens enviadas da aplicação para o Service Worker
 */
self.addEventListener('message', event => {
  console.log('[Service Worker] Mensagem recebida:', event.data);
  
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.action === 'clearCache') {
    event.waitUntil(
      caches.keys()
        .then(keyList => {
          return Promise.all(keyList.map(key => {
            console.log('[Service Worker] Limpando cache:', key);
            return caches.delete(key);
          }));
        })
    );
  }
});
