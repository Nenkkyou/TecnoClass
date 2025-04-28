/**
 * TecnoClass-PWA - Gerenciador de Cache
 * 
 * Este serviço gerencia as operações de cache da aplicação,
 * fornecendo uma interface para interagir com o Service Worker.
 */

class CacheManager {
  constructor() {
    this.isOnline = navigator.onlineState;
    this.hasServiceWorker = 'serviceWorker' in navigator;
    this.connectionStatusElement = document.getElementById('connection-status');
    
    // Inicializa monitoramento de conexão
    this.initConnectionMonitoring();
  }
  
  /**
   * Inicializa o monitoramento de conexão
   */
  initConnectionMonitoring() {
    // Verifica estado inicial
    this.updateConnectionStatus();
    
    // Monitora mudanças de estado de conexão
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateConnectionStatus();
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateConnectionStatus();
    });
  }
  
  /**
   * Atualiza o indicador de status de conexão
   */
  updateConnectionStatus() {
    if (!this.connectionStatusElement) return;
    
    if (this.isOnline) {
      this.connectionStatusElement.textContent = 'Você está online';
      this.connectionStatusElement.className = 'connection-status online';
      
      // Esconde após 3 segundos
      setTimeout(() => {
        this.connectionStatusElement.className = 'connection-status';
      }, 3000);
    } else {
      this.connectionStatusElement.textContent = 'Você está offline. Conteúdo limitado disponível.';
      this.connectionStatusElement.className = 'connection-status offline';
    }
  }
  
  /**
   * Sincroniza dados quando a conexão é restabelecida
   */
  syncData() {
    if (!this.hasServiceWorker || !this.isOnline) return;
    
    // Registra tarefa de sincronização para o Service Worker
    navigator.serviceWorker.ready
      .then(registration => {
        return registration.sync.register('sync-user-data')
          .then(() => {
            console.log('Sincronização de dados agendada');
            return registration.sync.register('sync-content-updates');
          })
          .then(() => {
            console.log('Sincronização de conteúdo agendada');
          });
      })
      .catch(error => {
        console.error('Erro ao agendar sincronização:', error);
      });
  }
  
  /**
   * Verifica se há atualizações do Service Worker
   */
  checkForUpdates() {
    if (!this.hasServiceWorker) return Promise.resolve(false);
    
    return navigator.serviceWorker.ready
      .then(registration => {
        return registration.update()
          .then(() => {
            if (registration.waiting) {
              return true; // Há uma atualização disponível
            }
            return false;
          });
      })
      .catch(error => {
        console.error('Erro ao verificar atualizações:', error);
        return false;
      });
  }
  
  /**
   * Aplica atualização do Service Worker
   */
  applyUpdate() {
    if (!this.hasServiceWorker) return Promise.resolve(false);
    
    return navigator.serviceWorker.ready
      .then(registration => {
        if (registration.waiting) {
          // Envia mensagem para o Service Worker aplicar a atualização
          registration.waiting.postMessage({ action: 'skipWaiting' });
          return true;
        }
        return false;
      })
      .catch(error => {
        console.error('Erro ao aplicar atualização:', error);
        return false;
      });
  }
  
  /**
   * Limpa todos os caches
   */
  clearAllCaches() {
    if (!this.hasServiceWorker) return Promise.resolve(false);
    
    return navigator.serviceWorker.ready
      .then(registration => {
        // Envia mensagem para o Service Worker limpar os caches
        registration.active.postMessage({ action: 'clearCache' });
        return true;
      })
      .catch(error => {
        console.error('Erro ao limpar caches:', error);
        return false;
      });
  }
  
  /**
   * Pré-carrega recursos para uso offline
   * @param {Array} urls - URLs dos recursos a serem pré-carregados
   */
  preloadResources(urls) {
    if (!Array.isArray(urls) || urls.length === 0) {
      return Promise.resolve(false);
    }
    
    const preloadPromises = urls.map(url => {
      return fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Falha ao pré-carregar ${url}`);
          }
          return response;
        })
        .catch(error => {
          console.error(`Erro ao pré-carregar ${url}:`, error);
          return null;
        });
    });
    
    return Promise.all(preloadPromises)
      .then(results => {
        const successCount = results.filter(result => result !== null).length;
        console.log(`Pré-carregados ${successCount} de ${urls.length} recursos`);
        return successCount > 0;
      });
  }
  
  /**
   * Verifica se um recurso está disponível offline
   * @param {string} url - URL do recurso a ser verificado
   */
  isResourceAvailable(url) {
    if (!this.hasServiceWorker) return Promise.resolve(false);
    
    return caches.match(url)
      .then(response => {
        return response !== undefined;
      })
      .catch(error => {
        console.error(`Erro ao verificar disponibilidade de ${url}:`, error);
        return false;
      });
  }
}

// Exporta o gerenciador de cache
window.cacheManager = new CacheManager();
