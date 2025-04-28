/**
 * TecnoClass-PWA - Sistema de Armazenamento IndexedDB
 * 
 * Este serviço gerencia o armazenamento local usando IndexedDB,
 * fornecendo uma interface para persistir dados do usuário.
 */

class IndexedDBService {
  constructor() {
    this.dbName = 'tecnoclass-db';
    this.dbVersion = 1;
    this.db = null;
    this.isReady = false;
    
    // Inicializa o banco de dados
    this.init();
  }
  
  /**
   * Inicializa o banco de dados IndexedDB
   * @returns {Promise} Promessa que resolve quando o banco de dados está pronto
   */
  init() {
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        console.error('Seu navegador não suporta IndexedDB');
        reject(new Error('IndexedDB não suportado'));
        return;
      }
      
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      // Manipulador de erro
      request.onerror = (event) => {
        console.error('Erro ao abrir o banco de dados:', event.target.error);
        reject(event.target.error);
      };
      
      // Manipulador de sucesso
      request.onsuccess = (event) => {
        this.db = event.target.result;
        this.isReady = true;
        console.log('Banco de dados aberto com sucesso');
        resolve(this.db);
      };
      
      // Manipulador de atualização (criação/migração)
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Cria os object stores (tabelas)
        
        // Store para dados do usuário
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('username', 'username', { unique: false });
        }
        
        // Store para progresso do usuário
        if (!db.objectStoreNames.contains('progress')) {
          const progressStore = db.createObjectStore('progress', { keyPath: 'id', autoIncrement: true });
          progressStore.createIndex('userId', 'userId', { unique: false });
          progressStore.createIndex('courseId', 'courseId', { unique: false });
          progressStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Store para favoritos
        if (!db.objectStoreNames.contains('favorites')) {
          const favoritesStore = db.createObjectStore('favorites', { keyPath: 'id', autoIncrement: true });
          favoritesStore.createIndex('userId', 'userId', { unique: false });
          favoritesStore.createIndex('itemId', 'itemId', { unique: false });
          favoritesStore.createIndex('type', 'type', { unique: false });
        }
        
        // Store para anotações
        if (!db.objectStoreNames.contains('notes')) {
          const notesStore = db.createObjectStore('notes', { keyPath: 'id', autoIncrement: true });
          notesStore.createIndex('userId', 'userId', { unique: false });
          notesStore.createIndex('itemId', 'itemId', { unique: false });
          notesStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        // Store para cursos
        if (!db.objectStoreNames.contains('courses')) {
          const coursesStore = db.createObjectStore('courses', { keyPath: 'id' });
          coursesStore.createIndex('category', 'category', { unique: false });
        }
        
        // Store para quizzes
        if (!db.objectStoreNames.contains('quizzes')) {
          const quizzesStore = db.createObjectStore('quizzes', { keyPath: 'id' });
          quizzesStore.createIndex('courseId', 'courseId', { unique: false });
          quizzesStore.createIndex('difficulty', 'difficulty', { unique: false });
        }
        
        // Store para configurações
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
        
        console.log('Estrutura do banco de dados criada/atualizada');
      };
    });
  }
  
  /**
   * Garante que o banco de dados está pronto antes de executar operações
   * @returns {Promise} Promessa que resolve quando o banco de dados está pronto
   */
  ensureDbReady() {
    if (this.isReady) {
      return Promise.resolve(this.db);
    }
    
    return this.init();
  }
  
  /**
   * Adiciona um item a um object store
   * @param {string} storeName - Nome do object store
   * @param {Object} item - Item a ser adicionado
   * @returns {Promise} Promessa que resolve com o ID do item adicionado
   */
  add(storeName, item) {
    return this.ensureDbReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          
          // Adiciona timestamp se não existir
          if (!item.timestamp) {
            item.timestamp = new Date().toISOString();
          }
          
          const request = store.add(item);
          
          request.onsuccess = (event) => {
            resolve(event.target.result);
          };
          
          request.onerror = (event) => {
            console.error(`Erro ao adicionar item em ${storeName}:`, event.target.error);
            reject(event.target.error);
          };
        });
      });
  }
  
  /**
   * Atualiza um item em um object store
   * @param {string} storeName - Nome do object store
   * @param {Object} item - Item a ser atualizado (deve incluir a chave primária)
   * @returns {Promise} Promessa que resolve quando o item é atualizado
   */
  update(storeName, item) {
    return this.ensureDbReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          
          // Atualiza timestamp
          item.updatedAt = new Date().toISOString();
          
          const request = store.put(item);
          
          request.onsuccess = () => {
            resolve(true);
          };
          
          request.onerror = (event) => {
            console.error(`Erro ao atualizar item em ${storeName}:`, event.target.error);
            reject(event.target.error);
          };
        });
      });
  }
  
  /**
   * Obtém um item de um object store pela chave primária
   * @param {string} storeName - Nome do object store
   * @param {string|number} id - Valor da chave primária
   * @returns {Promise} Promessa que resolve com o item encontrado ou null
   */
  getById(storeName, id) {
    return this.ensureDbReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([storeName], 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.get(id);
          
          request.onsuccess = (event) => {
            resolve(event.target.result || null);
          };
          
          request.onerror = (event) => {
            console.error(`Erro ao obter item de ${storeName}:`, event.target.error);
            reject(event.target.error);
          };
        });
      });
  }
  
  /**
   * Obtém todos os itens de um object store
   * @param {string} storeName - Nome do object store
   * @returns {Promise} Promessa que resolve com um array de itens
   */
  getAll(storeName) {
    return this.ensureDbReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([storeName], 'readonly');
          const store = transaction.objectStore(storeName);
          const request = store.getAll();
          
          request.onsuccess = (event) => {
            resolve(event.target.result || []);
          };
          
          request.onerror = (event) => {
            console.error(`Erro ao obter itens de ${storeName}:`, event.target.error);
            reject(event.target.error);
          };
        });
      });
  }
  
  /**
   * Obtém itens de um object store usando um índice
   * @param {string} storeName - Nome do object store
   * @param {string} indexName - Nome do índice
   * @param {any} value - Valor a ser buscado no índice
   * @returns {Promise} Promessa que resolve com um array de itens
   */
  getByIndex(storeName, indexName, value) {
    return this.ensureDbReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([storeName], 'readonly');
          const store = transaction.objectStore(storeName);
          const index = store.index(indexName);
          const request = index.getAll(value);
          
          request.onsuccess = (event) => {
            resolve(event.target.result || []);
          };
          
          request.onerror = (event) => {
            console.error(`Erro ao obter itens de ${storeName} por índice:`, event.target.error);
            reject(event.target.error);
          };
        });
      });
  }
  
  /**
   * Remove um item de um object store
   * @param {string} storeName - Nome do object store
   * @param {string|number} id - Valor da chave primária
   * @returns {Promise} Promessa que resolve quando o item é removido
   */
  delete(storeName, id) {
    return this.ensureDbReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.delete(id);
          
          request.onsuccess = () => {
            resolve(true);
          };
          
          request.onerror = (event) => {
            console.error(`Erro ao remover item de ${storeName}:`, event.target.error);
            reject(event.target.error);
          };
        });
      });
  }
  
  /**
   * Limpa todos os dados de um object store
   * @param {string} storeName - Nome do object store
   * @returns {Promise} Promessa que resolve quando o store é limpo
   */
  clear(storeName) {
    return this.ensureDbReady()
      .then(() => {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.clear();
          
          request.onsuccess = () => {
            resolve(true);
          };
          
          request.onerror = (event) => {
            console.error(`Erro ao limpar ${storeName}:`, event.target.error);
            reject(event.target.error);
          };
        });
      });
  }
  
  /**
   * Exporta todos os dados do usuário para um arquivo JSON
   * @param {string|number} userId - ID do usuário
   * @returns {Promise} Promessa que resolve com um objeto contendo os dados do usuário
   */
  exportUserData(userId) {
    if (!userId) {
      return Promise.reject(new Error('ID de usuário não fornecido'));
    }
    
    const userData = {
      user: null,
      progress: [],
      favorites: [],
      notes: [],
      settings: {},
      exportDate: new Date().toISOString()
    };
    
    return this.ensureDbReady()
      .then(() => {
        // Obtém dados do usuário
        return this.getById('users', userId)
          .then(user => {
            userData.user = user;
            
            // Obtém progresso do usuário
            return this.getByIndex('progress', 'userId', userId);
          })
          .then(progress => {
            userData.progress = progress;
            
            // Obtém favoritos do usuário
            return this.getByIndex('favorites', 'userId', userId);
          })
          .then(favorites => {
            userData.favorites = favorites;
            
            // Obtém anotações do usuário
            return this.getByIndex('notes', 'userId', userId);
          })
          .then(notes => {
            userData.notes = notes;
            
            // Obtém configurações do usuário
            return this.getById('settings', `user-${userId}`);
          })
          .then(settings => {
            userData.settings = settings || {};
            
            return userData;
          });
      });
  }
  
  /**
   * Importa dados do usuário de um objeto JSON
   * @param {Object} data - Dados a serem importados
   * @returns {Promise} Promessa que resolve quando os dados são importados
   */
  importUserData(data) {
    if (!data || !data.user || !data.user.id) {
      return Promise.reject(new Error('Dados inválidos para importação'));
    }
    
    return this.ensureDbReady()
      .then(() => {
        const userId = data.user.id;
        
        // Atualiza dados do usuário
        return this.update('users', data.user)
          .then(() => {
            // Importa progresso
            if (Array.isArray(data.progress)) {
              const progressPromises = data.progress.map(item => {
                return this.update('progress', item);
              });
              return Promise.all(progressPromises);
            }
            return Promise.resolve();
          })
          .then(() => {
            // Importa favoritos
            if (Array.isArray(data.favorites)) {
              const favoritesPromises = data.favorites.map(item => {
                return this.update('favorites', item);
              });
              return Promise.all(favoritesPromises);
            }
            return Promise.resolve();
          })
          .then(() => {
            // Importa anotações
            if (Array.isArray(data.notes)) {
              const notesPromises = data.notes.map(item => {
                return this.update('notes', item);
              });
              return Promise.all(notesPromises);
            }
            return Promise.resolve();
          })
          .then(() => {
            // Importa configurações
            if (data.settings) {
              data.settings.id = `user-${userId}`;
              return this.update('settings', data.settings);
            }
            return Promise.resolve();
          })
          .then(() => {
            return true;
          });
      });
  }
  
  /**
   * Inicializa o banco de dados com dados de exemplo
   * @returns {Promise} Promessa que resolve quando os dados são inicializados
   */
  initializeWithSampleData() {
    // Dados de exemplo para cursos
    const sampleCourses = [
      {
        id: 'prog-001',
        title: 'Introdução à Programação Web',
        description: 'Aprenda os fundamentos de HTML, CSS e JavaScript para desenvolvimento web.',
        category: 'programacao',
        level: 'iniciante',
        duration: '4 semanas',
        modules: [
          {
            id: 'prog-001-mod-1',
            title: 'HTML Básico',
            lessons: [
              { id: 'prog-001-mod-1-les-1', title: 'Estrutura HTML', content: 'Conteúdo sobre estrutura HTML...' },
              { id: 'prog-001-mod-1-les-2', title: 'Tags e Elementos', content: 'Conteúdo sobre tags e elementos...' }
            ]
          },
          {
            id: 'prog-001-mod-2',
            title: 'CSS Básico',
            lessons: [
              { id: 'prog-001-mod-2-les-1', title: 'Seletores CSS', content: 'Conteúdo sobre seletores CSS...' },
              { id: 'prog-001-mod-2-les-2', title: 'Box Model', content: 'Conteúdo sobre box model...' }
            ]
          }
        ]
      },
      {
        id: 'cyber-001',
        title: 'Fundamentos de Cybersegurança',
        description: 'Aprenda os princípios básicos de segurança digital e proteção de dados.',
        category: 'cyber',
        level: 'iniciante',
        duration: '3 semanas',
        modules: [
          {
            id: 'cyber-001-mod-1',
            title: 'Princípios de Segurança',
            lessons: [
              { id: 'cyber-001-mod-1-le
(Content truncated due to size limit. Use line ranges to read in chunks)