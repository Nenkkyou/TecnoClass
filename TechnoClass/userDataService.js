/**
 * TecnoClass-PWA - Serviço de Gerenciamento de Dados do Usuário
 * 
 * Este serviço fornece uma interface para gerenciar dados específicos do usuário,
 * como progresso, favoritos e anotações, utilizando o IndexedDB.
 */

class UserDataService {
  constructor() {
    this.dbService = window.dbService;
    this.currentUser = null;
  }
  
  /**
   * Define o usuário atual
   * @param {Object} user - Objeto do usuário
   */
  setCurrentUser(user) {
    this.currentUser = user;
    // Salva o ID do usuário atual no localStorage para persistência entre sessões
    if (user && user.id) {
      localStorage.setItem('currentUserId', user.id);
    } else {
      localStorage.removeItem('currentUserId');
    }
  }
  
  /**
   * Obtém o usuário atual
   * @returns {Promise} Promessa que resolve com o objeto do usuário atual
   */
  getCurrentUser() {
    if (this.currentUser) {
      return Promise.resolve(this.currentUser);
    }
    
    // Tenta recuperar o ID do usuário do localStorage
    const userId = localStorage.getItem('currentUserId');
    if (!userId) {
      return Promise.resolve(null);
    }
    
    // Busca o usuário no banco de dados
    return this.dbService.getById('users', parseInt(userId))
      .then(user => {
        if (user) {
          this.currentUser = user;
        }
        return user;
      });
  }
  
  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise} Promessa que resolve com o ID do usuário criado
   */
  registerUser(userData) {
    const user = {
      username: userData.username,
      email: userData.email,
      name: userData.name || userData.username,
      createdAt: new Date().toISOString()
    };
    
    return this.dbService.add('users', user)
      .then(userId => {
        user.id = userId;
        this.setCurrentUser(user);
        
        // Cria configurações padrão para o usuário
        const defaultSettings = {
          id: `user-${userId}`,
          theme: 'auto',
          language: 'pt-BR',
          notifications: true,
          fontSize: 'medium'
        };
        
        return this.dbService.update('settings', defaultSettings)
          .then(() => userId);
      });
  }
  
  /**
   * Faz login de um usuário
   * @param {string} username - Nome de usuário
   * @returns {Promise} Promessa que resolve com o objeto do usuário
   */
  login(username) {
    return this.dbService.getByIndex('users', 'username', username)
      .then(users => {
        if (users && users.length > 0) {
          const user = users[0];
          this.setCurrentUser(user);
          return user;
        }
        
        // Se não encontrar o usuário, cria um novo
        return this.registerUser({ username, email: `${username}@example.com` });
      });
  }
  
  /**
   * Faz logout do usuário atual
   */
  logout() {
    this.currentUser = null;
    localStorage.removeItem('currentUserId');
  }
  
  /**
   * Atualiza o progresso do usuário em um curso
   * @param {string} courseId - ID do curso
   * @param {number} progress - Porcentagem de progresso (0-100)
   * @param {string} status - Status do curso (não iniciado, em andamento, concluído)
   * @returns {Promise} Promessa que resolve quando o progresso é atualizado
   */
  updateCourseProgress(courseId, progress, status) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        // Busca progresso existente
        return this.dbService.getByIndex('progress', 'courseId', courseId)
          .then(progressItems => {
            const userProgress = progressItems.find(item => item.userId === user.id);
            
            if (userProgress) {
              // Atualiza progresso existente
              userProgress.progress = progress;
              userProgress.status = status;
              userProgress.updatedAt = new Date().toISOString();
              return this.dbService.update('progress', userProgress);
            } else {
              // Cria novo registro de progresso
              const newProgress = {
                userId: user.id,
                courseId: courseId,
                progress: progress,
                status: status,
                startedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              };
              return this.dbService.add('progress', newProgress);
            }
          });
      });
  }
  
  /**
   * Obtém o progresso do usuário em um curso
   * @param {string} courseId - ID do curso
   * @returns {Promise} Promessa que resolve com o objeto de progresso
   */
  getCourseProgress(courseId) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          return null;
        }
        
        return this.dbService.getByIndex('progress', 'courseId', courseId)
          .then(progressItems => {
            return progressItems.find(item => item.userId === user.id) || null;
          });
      });
  }
  
  /**
   * Obtém todo o progresso do usuário
   * @returns {Promise} Promessa que resolve com um array de objetos de progresso
   */
  getAllProgress() {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          return [];
        }
        
        return this.dbService.getByIndex('progress', 'userId', user.id);
      });
  }
  
  /**
   * Adiciona um item aos favoritos
   * @param {string} itemId - ID do item
   * @param {string} type - Tipo do item (curso, quiz, lição)
   * @returns {Promise} Promessa que resolve com o ID do favorito criado
   */
  addFavorite(itemId, type) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        // Verifica se já existe
        return this.dbService.getByIndex('favorites', 'itemId', itemId)
          .then(favorites => {
            const existingFavorite = favorites.find(fav => fav.userId === user.id && fav.type === type);
            
            if (existingFavorite) {
              return existingFavorite.id;
            }
            
            // Cria novo favorito
            const favorite = {
              userId: user.id,
              itemId: itemId,
              type: type,
              addedAt: new Date().toISOString()
            };
            
            return this.dbService.add('favorites', favorite);
          });
      });
  }
  
  /**
   * Remove um item dos favoritos
   * @param {string} itemId - ID do item
   * @param {string} type - Tipo do item (curso, quiz, lição)
   * @returns {Promise} Promessa que resolve quando o favorito é removido
   */
  removeFavorite(itemId, type) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        return this.dbService.getByIndex('favorites', 'itemId', itemId)
          .then(favorites => {
            const favorite = favorites.find(fav => fav.userId === user.id && fav.type === type);
            
            if (favorite) {
              return this.dbService.delete('favorites', favorite.id);
            }
            
            return Promise.resolve(false);
          });
      });
  }
  
  /**
   * Verifica se um item está nos favoritos
   * @param {string} itemId - ID do item
   * @param {string} type - Tipo do item (curso, quiz, lição)
   * @returns {Promise} Promessa que resolve com true se o item estiver nos favoritos
   */
  isFavorite(itemId, type) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          return false;
        }
        
        return this.dbService.getByIndex('favorites', 'itemId', itemId)
          .then(favorites => {
            return favorites.some(fav => fav.userId === user.id && fav.type === type);
          });
      });
  }
  
  /**
   * Obtém todos os favoritos do usuário
   * @param {string} type - Tipo opcional para filtrar (curso, quiz, lição)
   * @returns {Promise} Promessa que resolve com um array de favoritos
   */
  getAllFavorites(type = null) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          return [];
        }
        
        return this.dbService.getByIndex('favorites', 'userId', user.id)
          .then(favorites => {
            if (type) {
              return favorites.filter(fav => fav.type === type);
            }
            return favorites;
          });
      });
  }
  
  /**
   * Adiciona uma anotação
   * @param {string} itemId - ID do item relacionado
   * @param {string} content - Conteúdo da anotação
   * @returns {Promise} Promessa que resolve com o ID da anotação criada
   */
  addNote(itemId, content) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        const note = {
          userId: user.id,
          itemId: itemId,
          content: content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        return this.dbService.add('notes', note);
      });
  }
  
  /**
   * Atualiza uma anotação
   * @param {number} noteId - ID da anotação
   * @param {string} content - Novo conteúdo da anotação
   * @returns {Promise} Promessa que resolve quando a anotação é atualizada
   */
  updateNote(noteId, content) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        return this.dbService.getById('notes', noteId)
          .then(note => {
            if (!note || note.userId !== user.id) {
              throw new Error('Anotação não encontrada ou não pertence ao usuário');
            }
            
            note.content = content;
            note.updatedAt = new Date().toISOString();
            
            return this.dbService.update('notes', note);
          });
      });
  }
  
  /**
   * Remove uma anotação
   * @param {number} noteId - ID da anotação
   * @returns {Promise} Promessa que resolve quando a anotação é removida
   */
  deleteNote(noteId) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        return this.dbService.getById('notes', noteId)
          .then(note => {
            if (!note || note.userId !== user.id) {
              throw new Error('Anotação não encontrada ou não pertence ao usuário');
            }
            
            return this.dbService.delete('notes', noteId);
          });
      });
  }
  
  /**
   * Obtém todas as anotações do usuário para um item específico
   * @param {string} itemId - ID do item
   * @returns {Promise} Promessa que resolve com um array de anotações
   */
  getNotesByItem(itemId) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          return [];
        }
        
        return this.dbService.getByIndex('notes', 'itemId', itemId)
          .then(notes => {
            return notes.filter(note => note.userId === user.id);
          });
      });
  }
  
  /**
   * Obtém todas as anotações do usuário
   * @returns {Promise} Promessa que resolve com um array de anotações
   */
  getAllNotes() {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          return [];
        }
        
        return this.dbService.getByIndex('notes', 'userId', user.id);
      });
  }
  
  /**
   * Obtém as configurações do usuário
   * @returns {Promise} Promessa que resolve com as configurações do usuário
   */
  getUserSettings() {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          return null;
        }
        
        return this.dbService.getById('settings', `user-${user.id}`);
      });
  }
  
  /**
   * Atualiza as configurações do usuário
   * @param {Object} settings - Novas configurações
   * @returns {Promise} Promessa que resolve quando as configurações são atualizadas
   */
  updateUserSettings(settings) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        return this.dbService.getById('settings', `user-${user.id}`)
          .then(existingSettings => {
            const updatedSettings = {
              ...existingSettings,
              ...settings,
              id: `user-${user.id}`,
              updatedAt: new Date().toISOString()
            };
            
            return this.dbService.update('settings', updatedSettings);
          });
      });
  }
  
  /**
   * Exporta todos os dados do usuário
   * @returns {Promise} Promessa que resolve com um objeto contendo os dados do usuário
   */
  exportUserData() {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        return this.dbService.exportUserData(user.id);
      });
  }
  
  /**
   * Importa dados do usuário
   * @param {Object} data - Dados a serem importados
   * @returns {Promise} Promessa que resolve quando os dados são importados
   */
  importUserData(data) {
    return this.getCurrentUser()
      .then(user => {
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        // Verifica se os dados pertencem ao usuário atual
        if (data.user && data.user.id !== user.id) {
          data.user.id = user.id; // Força o ID do usuário atual
        }
        
        return this.dbService.importUserData(data);
      });
  }
}

// Exporta o serviço de dados do usuário
window.userDataService = new UserDataService();
