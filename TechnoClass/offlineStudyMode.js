/**
 * TecnoClass-PWA - Modo de Estudo Offline
 * 
 * Este arquivo implementa o modo de estudo offline, permitindo aos usuários
 * baixar conteúdo para acesso sem conexão com a internet.
 */

class OfflineStudyMode {
  constructor() {
    this.dbService = window.dbService;
    this.userDataService = window.userDataService;
    this.cacheManager = window.cacheManager;
    this.downloadQueue = [];
    this.isDownloading = false;
    
    // Inicializa quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }
  
  /**
   * Inicializa o modo de estudo offline
   */
  init() {
    this.setupEventListeners();
    this.setupNetworkStatusMonitor();
    this.renderOfflineIndicator();
  }
  
  /**
   * Configura os listeners de eventos
   */
  setupEventListeners() {
    // Adiciona listener para botões de download de curso
    document.addEventListener('click', (e) => {
      const downloadButton = e.target.closest('.download-course-button');
      if (downloadButton) {
        const courseId = downloadButton.getAttribute('data-course-id');
        if (courseId) {
          this.downloadCourse(courseId);
        }
      }
    });
    
    // Adiciona listener para botões de download de quiz
    document.addEventListener('click', (e) => {
      const downloadButton = e.target.closest('.download-quiz-button');
      if (downloadButton) {
        const quizId = downloadButton.getAttribute('data-quiz-id');
        if (quizId) {
          this.downloadQuiz(quizId);
        }
      }
    });
    
    // Adiciona listener para botão de gerenciar conteúdo offline
    document.addEventListener('click', (e) => {
      if (e.target.id === 'manage-offline-content') {
        this.showOfflineContentManager();
      }
    });
  }
  
  /**
   * Configura o monitor de status de rede
   */
  setupNetworkStatusMonitor() {
    // Atualiza o indicador quando o status da rede muda
    window.addEventListener('online', () => {
      this.updateOfflineIndicator(true);
      this.syncOfflineData();
    });
    
    window.addEventListener('offline', () => {
      this.updateOfflineIndicator(false);
    });
    
    // Configura o estado inicial
    this.updateOfflineIndicator(navigator.onLine);
  }
  
  /**
   * Renderiza o indicador de status offline
   */
  renderOfflineIndicator() {
    // Verifica se o indicador já existe
    if (document.getElementById('offline-indicator')) return;
    
    // Cria o indicador
    const indicator = document.createElement('div');
    indicator.id = 'offline-indicator';
    indicator.className = 'offline-indicator';
    
    // Adiciona o botão de gerenciar conteúdo offline
    indicator.innerHTML = `
      <button id="manage-offline-content" class="offline-button" aria-label="Gerenciar conteúdo offline">
        <span class="offline-icon"></span>
      </button>
    `;
    
    // Adiciona o indicador ao DOM
    document.body.appendChild(indicator);
    
    // Atualiza o estado inicial
    this.updateOfflineIndicator(navigator.onLine);
  }
  
  /**
   * Atualiza o indicador de status offline
   * @param {boolean} isOnline - Se o dispositivo está online
   */
  updateOfflineIndicator(isOnline) {
    const indicator = document.getElementById('offline-indicator');
    if (!indicator) return;
    
    if (isOnline) {
      indicator.classList.remove('offline');
      indicator.classList.add('online');
      indicator.setAttribute('title', 'Online - Clique para gerenciar conteúdo offline');
    } else {
      indicator.classList.remove('online');
      indicator.classList.add('offline');
      indicator.setAttribute('title', 'Offline - Usando conteúdo salvo localmente');
    }
  }
  
  /**
   * Baixa um curso para uso offline
   * @param {string} courseId - ID do curso
   */
  async downloadCourse(courseId) {
    try {
      // Verifica se já está na fila de download
      if (this.downloadQueue.some(item => item.id === courseId && item.type === 'course')) {
        this.showNotification('Este curso já está na fila de download', 'info');
        return;
      }
      
      // Verifica se o curso já está disponível offline
      const isAvailable = await this.isContentAvailableOffline(courseId, 'course');
      if (isAvailable) {
        this.showNotification('Este curso já está disponível offline', 'info');
        return;
      }
      
      // Obtém os dados do curso
      const course = await this.dbService.getById('courses', courseId);
      if (!course) {
        throw new Error('Curso não encontrado');
      }
      
      // Adiciona à fila de download
      this.downloadQueue.push({
        id: courseId,
        type: 'course',
        title: course.title,
        size: this.estimateContentSize(course),
        resources: this.collectCourseResources(course)
      });
      
      // Mostra notificação
      this.showNotification(`"${course.title}" adicionado à fila de download`, 'success');
      
      // Inicia o processo de download se não estiver em andamento
      if (!this.isDownloading) {
        this.processDownloadQueue();
      }
      
    } catch (error) {
      console.error(`Erro ao baixar curso ${courseId}:`, error);
      this.showNotification('Erro ao baixar curso. Tente novamente mais tarde.', 'error');
    }
  }
  
  /**
   * Baixa um quiz para uso offline
   * @param {string} quizId - ID do quiz
   */
  async downloadQuiz(quizId) {
    try {
      // Verifica se já está na fila de download
      if (this.downloadQueue.some(item => item.id === quizId && item.type === 'quiz')) {
        this.showNotification('Este quiz já está na fila de download', 'info');
        return;
      }
      
      // Verifica se o quiz já está disponível offline
      const isAvailable = await this.isContentAvailableOffline(quizId, 'quiz');
      if (isAvailable) {
        this.showNotification('Este quiz já está disponível offline', 'info');
        return;
      }
      
      // Obtém os dados do quiz
      const quiz = await this.dbService.getById('quizzes', quizId);
      if (!quiz) {
        throw new Error('Quiz não encontrado');
      }
      
      // Adiciona à fila de download
      this.downloadQueue.push({
        id: quizId,
        type: 'quiz',
        title: quiz.title,
        size: this.estimateContentSize(quiz),
        resources: this.collectQuizResources(quiz)
      });
      
      // Mostra notificação
      this.showNotification(`"${quiz.title}" adicionado à fila de download`, 'success');
      
      // Inicia o processo de download se não estiver em andamento
      if (!this.isDownloading) {
        this.processDownloadQueue();
      }
      
    } catch (error) {
      console.error(`Erro ao baixar quiz ${quizId}:`, error);
      this.showNotification('Erro ao baixar quiz. Tente novamente mais tarde.', 'error');
    }
  }
  
  /**
   * Processa a fila de download
   */
  async processDownloadQueue() {
    if (this.downloadQueue.length === 0 || this.isDownloading) return;
    
    this.isDownloading = true;
    
    try {
      // Obtém o próximo item da fila
      const item = this.downloadQueue[0];
      
      // Mostra notificação de início
      this.showNotification(`Baixando "${item.title}"...`, 'info');
      
      // Baixa os recursos
      await this.downloadResources(item.resources);
      
      // Marca o conteúdo como disponível offline
      await this.markContentAsOfflineAvailable(item.id, item.type, true);
      
      // Remove o item da fila
      this.downloadQueue.shift();
      
      // Mostra notificação de conclusão
      this.showNotification(`"${item.title}" baixado com sucesso!`, 'success');
      
      // Continua processando a fila
      this.isDownloading = false;
      this.processDownloadQueue();
      
    } catch (error) {
      console.error('Erro ao processar fila de download:', error);
      
      // Remove o item da fila em caso de erro
      this.downloadQueue.shift();
      
      // Mostra notificação de erro
      this.showNotification('Erro ao baixar conteúdo. Tente novamente mais tarde.', 'error');
      
      // Continua processando a fila
      this.isDownloading = false;
      this.processDownloadQueue();
    }
  }
  
  /**
   * Baixa recursos para uso offline
   * @param {Array} resources - Lista de recursos a serem baixados
   */
  async downloadResources(resources) {
    if (!resources || resources.length === 0) return;
    
    // Verifica se o cache manager está disponível
    if (!this.cacheManager) {
      throw new Error('Cache Manager não disponível');
    }
    
    // Baixa cada recurso
    const downloadPromises = resources.map(async (resource) => {
      try {
        await this.cacheManager.cacheResource(resource);
      } catch (e) {
        console.warn(`Não foi possível baixar o recurso ${resource}:`, e);
      }
    });
    
    // Aguarda o download de todos os recursos
    await Promise.all(downloadPromises);
  }
  
  /**
   * Coleta recursos de um curso para download
   * @param {Object} course - Dados do curso
   * @returns {Array} Lista de URLs de recursos
   */
  collectCourseResources(course) {
    const resources = [];
    
    // Adiciona a URL do curso
    resources.push(`/cursos/${course.id}`);
    
    // Adiciona URLs das lições
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        resources.push(`/cursos/${course.id}/licao/${lesson.id}`);
        
        // Extrai URLs de imagens do conteúdo da lição
        const imageUrls = this.extractImageUrls(lesson.content);
        resources.push(...imageUrls);
      });
    });
    
    return resources;
  }
  
  /**
   * Coleta recursos de um quiz para download
   * @param {Object} quiz - Dados do quiz
   * @returns {Array} Lista de URLs de recursos
   */
  collectQuizResources(quiz) {
    const resources = [];
    
    // Adiciona a URL do quiz
    resources.push(`/quizzes/${quiz.id}`);
    resources.push(`/quizzes/${quiz.id}/iniciar`);
    
    // Extrai URLs de imagens das questões
    quiz.questions.forEach(question => {
      const imageUrls = this.extractImageUrls(question.text);
      resources.push(...imageUrls);
      
      // Extrai URLs de imagens das explicações
      if (question.explanation) {
        const explanationImageUrls = this.extractImageUrls(question.explanation);
        resources.push(...explanationImageUrls);
      }
    });
    
    return resources;
  }
  
  /**
   * Extrai URLs de imagens de um texto HTML
   * @param {string} html - Texto HTML
   * @returns {Array} Lista de URLs de imagens
   */
  extractImageUrls(html) {
    if (!html) return [];
    
    const urls = [];
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    let match;
    
    while ((match = imgRegex.exec(html)) !== null) {
      urls.push(match[1]);
    }
    
    return urls;
  }
  
  /**
   * Estima o tamanho do conteúdo em KB
   * @param {Object} content - Conteúdo a ser estimado
   * @returns {number} Tamanho estimado em KB
   */
  estimateContentSize(content) {
    // Converte o objeto para string e calcula o tamanho aproximado
    const jsonString = JSON.stringify(content);
    return Math.round(jsonString.length / 1024);
  }
  
  /**
   * Verifica se um conteúdo está disponível offline
   * @param {string} id - ID do conteúdo
   * @param {string} type - Tipo do conteúdo (course, quiz)
   * @returns {Promise<boolean>} Se o conteúdo está disponível offline
   */
  async isContentAvailableOffline(id, type) {
    try {
      const offlineContent = await this.userDataService.getOfflineContent();
      return offlineContent.some(item => item.id === id && item.type === type);
    } catch (error) {
      console.error('Erro ao verificar disponibilidade offline:', error);
      return false;
    }
  }
  
  /**
   * Marca um conteúdo como disponível offline
   * @param {string} id - ID do conteúdo
   * @param {string} type - Tipo do conteúdo (course, quiz)
   * @param {boolean} isAvailable - Se está disponível offline
   */
  async markContentAsOfflineAvailable(id, type, isAvailable) {
    try {
      if (isAvailable) {
        // Obtém os dados do conteúdo
        let title = '';
        let size = 0;
        
        if (type === 'course') {
          const course = await this.dbService.getById('courses', id);
          title = course.title;
          size = this.estimateContentSize(course);
        } else if (type === 'quiz') {
          const quiz = await this.dbService.getById('quizzes', id);
          title = quiz.title;
          size = this.estimateContentSize(quiz);
        }
        
        // Adiciona à lista de conteúdo offline
        await this.userDataService.addOfflineContent({
          id,
          type,
          title,
          size,
          downloadDate: new Date().toISOString()
        });
      } else {
        // Remove da lista de conteúdo offline
        await this.userDataService.removeOfflineContent(id, type);
      }
    } catch (error) {
      console.error('Erro ao marcar conteúdo como disponível offline:', error);
      throw error;
    }
  }
  
  /**
   * Sincroniza dados offline quando a conexão é restabelecida
   */
  async syncOfflineData() {
    try {
      // Sincroniza progresso de cursos
      await this.userDataService.syncCourseProgress();
      
      // Sincroniza tentativas de quizzes
      await this.userDataService.syncQuizAttempts();
      
      // Sincroniza anotações
      await this.userDataService.syncNotes();
      
      console.log('Dados offline sincronizados com sucesso');
    } catch (error) {
      console.error('Erro ao sincronizar dados offline:', error);
    }
  }
  
  /**
   * Mostra o gerenciador de conteúdo offline
   */
  async showOfflineContentManager() {
    if (!window.uiComponents) return;
    
    try {
      // Obtém a lista de conteúdo offline
      const offlineContent = await this.userDataService.getOfflineContent();
      
      // Calcula o espaço total utilizado
      const totalSize = offlineContent.reduce((sum, item) => sum + item.size, 0);
      
      // Agrupa por tipo
      const courseItems = offlineContent.filter(item => item.type === 'course');
      const quizItems = offlineContent.filter(item => item.type === 'quiz');
      
      // Cria o conteúdo do modal
      const modalContent = `
        <div class="offline-content-manager">
          <div class="offline-summary">
            <div class="summary-item">
              <span class="summary-label">Total de Itens</span>
              <span class="summary-value">${offlineContent.length}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Espaço Utilizado</span>
              <span class="summary-value">${this.formatSize(totalSize)}</span>
            </div>
            <div class="summary-item">
              <span class="summary-label">Status</span>
              <span class="summary-value ${navigator.onLine ? 'online' : 'offline'}">
                ${navigator.onLine ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
          
          ${courseItems.length > 0 ? `
            <div class="offline-section">
              <h3>Cursos Disponíveis Offline</h3>
              <div class="offline-items-list">
                ${courseItems.map(item => `
                  <div class="offline-item" data-id="${item.id}" data-type="${item.type}">
                    <div class="item-info">
                      <span class="item-title">${item.title}</span>
                      <span class="item-meta">
                        <span class="item-size">${this.formatSize(item.size)}</span>
                        <span class="item-date">Baixado em ${new Date(item.downloadDate).toLocaleDateString()}</span>
                      </span>
                    </div>
                    <button class="btn btn-danger remove-offline-item" data-id="${item.id}" data-type="${item.type}">
                      Remover
                    <
(Content truncated due to size limit. Use line ranges to read in chunks)