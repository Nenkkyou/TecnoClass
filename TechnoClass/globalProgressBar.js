/**
 * TecnoClass-PWA - Barra de Progresso Global
 * 
 * Este arquivo implementa a barra de progresso global que mostra
 * o progresso do usuário em todos os cursos.
 */

class GlobalProgressBar {
  constructor() {
    this.dbService = window.dbService;
    this.userDataService = window.userDataService;
    this.progressData = null;
    
    // Inicializa quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }
  
  /**
   * Inicializa a barra de progresso global
   */
  async init() {
    // Carrega os dados de progresso
    await this.loadProgressData();
    
    // Renderiza a barra de progresso no header
    this.renderProgressBar();
    
    // Configura atualização automática quando o progresso mudar
    this.setupProgressUpdateListener();
  }
  
  /**
   * Carrega os dados de progresso do usuário
   */
  async loadProgressData() {
    try {
      // Obtém todos os cursos
      const courses = await this.dbService.getAll('courses');
      
      // Obtém o progresso do usuário para cada curso
      const progressPromises = courses.map(async (course) => {
        try {
          const progress = await this.userDataService.getCourseProgress(course.id);
          return {
            courseId: course.id,
            courseTitle: course.title,
            category: course.category,
            progress: progress ? progress.progress : 0,
            status: progress ? progress.status : 'não iniciado'
          };
        } catch (e) {
          console.warn(`Não foi possível obter o progresso para o curso ${course.id}:`, e);
          return {
            courseId: course.id,
            courseTitle: course.title,
            category: course.category,
            progress: 0,
            status: 'não iniciado'
          };
        }
      });
      
      // Aguarda todas as promessas
      const progressItems = await Promise.all(progressPromises);
      
      // Calcula o progresso global
      const totalProgress = this.calculateGlobalProgress(progressItems);
      
      // Organiza os dados por categoria
      const progressByCategory = this.organizeProgressByCategory(progressItems);
      
      // Salva os dados de progresso
      this.progressData = {
        totalProgress,
        progressByCategory,
        progressItems
      };
      
    } catch (error) {
      console.error('Erro ao carregar dados de progresso:', error);
      this.progressData = {
        totalProgress: 0,
        progressByCategory: {},
        progressItems: []
      };
    }
  }
  
  /**
   * Calcula o progresso global com base nos itens de progresso
   * @param {Array} progressItems - Itens de progresso
   * @returns {number} Progresso global (0-100)
   */
  calculateGlobalProgress(progressItems) {
    if (!progressItems || progressItems.length === 0) return 0;
    
    // Soma o progresso de todos os cursos
    const totalProgress = progressItems.reduce((sum, item) => sum + item.progress, 0);
    
    // Calcula a média
    return Math.round(totalProgress / progressItems.length);
  }
  
  /**
   * Organiza os itens de progresso por categoria
   * @param {Array} progressItems - Itens de progresso
   * @returns {Object} Progresso organizado por categoria
   */
  organizeProgressByCategory(progressItems) {
    const byCategory = {};
    
    progressItems.forEach(item => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = {
          items: [],
          averageProgress: 0
        };
      }
      
      byCategory[item.category].items.push(item);
    });
    
    // Calcula a média de progresso para cada categoria
    Object.keys(byCategory).forEach(category => {
      const items = byCategory[category].items;
      const totalProgress = items.reduce((sum, item) => sum + item.progress, 0);
      byCategory[category].averageProgress = Math.round(totalProgress / items.length);
    });
    
    return byCategory;
  }
  
  /**
   * Renderiza a barra de progresso no header
   */
  renderProgressBar() {
    // Verifica se o elemento de progresso existe
    const progressContainer = document.getElementById('global-progress-container');
    if (!progressContainer) {
      // Cria o container de progresso no header
      this.createProgressContainer();
      return;
    }
    
    // Atualiza o conteúdo do container de progresso
    this.updateProgressContainer(progressContainer);
  }
  
  /**
   * Cria o container de progresso no header
   */
  createProgressContainer() {
    // Encontra o header
    const header = document.querySelector('.app-header');
    if (!header) return;
    
    // Cria o elemento de progresso
    const progressContainer = document.createElement('div');
    progressContainer.id = 'global-progress-container';
    progressContainer.className = 'global-progress-container';
    
    // Adiciona o container ao header
    header.appendChild(progressContainer);
    
    // Atualiza o conteúdo do container
    this.updateProgressContainer(progressContainer);
  }
  
  /**
   * Atualiza o conteúdo do container de progresso
   * @param {HTMLElement} container - Container de progresso
   */
  updateProgressContainer(container) {
    if (!this.progressData) return;
    
    // Cria o HTML para o container de progresso
    container.innerHTML = `
      <div class="global-progress">
        <div class="progress-label">Progresso Global</div>
        <div class="progress-bar" role="progressbar" aria-valuenow="${this.progressData.totalProgress}" aria-valuemin="0" aria-valuemax="100">
          <div class="progress-indicator" style="width: ${this.progressData.totalProgress}%"></div>
        </div>
        <div class="progress-value">${this.progressData.totalProgress}%</div>
      </div>
    `;
    
    // Adiciona evento de clique para mostrar detalhes
    container.addEventListener('click', () => {
      this.showProgressDetails();
    });
  }
  
  /**
   * Mostra os detalhes de progresso em um modal
   */
  showProgressDetails() {
    if (!this.progressData || !window.uiComponents) return;
    
    // Obtém os nomes das categorias
    const categoryNames = {
      'programacao': 'Programação',
      'cyber': 'Cybersegurança',
      'ia': 'Inteligência Artificial',
      'po': 'Product Owner'
    };
    
    // Cria o conteúdo do modal
    const modalContent = `
      <div class="progress-details">
        <div class="global-progress-details">
          <h3>Seu Progresso Global</h3>
          <div class="progress-circle large ${this.getProgressClass(this.progressData.totalProgress)}">
            <span class="progress-circle-value">${this.progressData.totalProgress}%</span>
          </div>
        </div>
        
        <div class="category-progress-list">
          <h3>Progresso por Categoria</h3>
          ${Object.entries(this.progressData.progressByCategory).map(([category, data]) => `
            <div class="category-progress-item">
              <div class="category-header">
                <span class="category-name">${categoryNames[category] || category}</span>
                <span class="category-progress-value">${data.averageProgress}%</span>
              </div>
              <div class="progress-bar" role="progressbar" aria-valuenow="${data.averageProgress}" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-indicator ${this.getProgressClass(data.averageProgress)}" style="width: ${data.averageProgress}%"></div>
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="course-progress-list">
          <h3>Progresso por Curso</h3>
          ${this.progressData.progressItems
            .sort((a, b) => b.progress - a.progress) // Ordena por progresso (decrescente)
            .map(item => `
              <div class="course-progress-item">
                <div class="course-header">
                  <span class="course-title">${item.courseTitle}</span>
                  <span class="course-progress-value">${item.progress}%</span>
                </div>
                <div class="progress-bar" role="progressbar" aria-valuenow="${item.progress}" aria-valuemin="0" aria-valuemax="100">
                  <div class="progress-indicator ${this.getProgressClass(item.progress)}" style="width: ${item.progress}%"></div>
                </div>
                <div class="course-status">
                  <span class="status-label">Status:</span>
                  <span class="status-value ${item.status.replace(' ', '-')}">${this.getStatusLabel(item.status)}</span>
                </div>
              </div>
            `).join('')}
        </div>
      </div>
    `;
    
    // Cria o modal
    window.uiComponents.createModal({
      title: 'Detalhes de Progresso',
      content: modalContent,
      size: 'large'
    });
  }
  
  /**
   * Configura o listener para atualização de progresso
   */
  setupProgressUpdateListener() {
    // Escuta eventos de atualização de progresso
    document.addEventListener('courseProgressUpdated', async (e) => {
      // Recarrega os dados de progresso
      await this.loadProgressData();
      
      // Atualiza a barra de progresso
      this.renderProgressBar();
    });
  }
  
  /**
   * Obtém a classe CSS com base no valor de progresso
   * @param {number} progress - Valor de progresso
   * @returns {string} Classe CSS
   */
  getProgressClass(progress) {
    if (progress >= 75) return 'excellent';
    if (progress >= 50) return 'good';
    if (progress >= 25) return 'average';
    return 'needs-improvement';
  }
  
  /**
   * Obtém o rótulo de status
   * @param {string} status - Status do curso
   * @returns {string} Rótulo de status
   */
  getStatusLabel(status) {
    const labels = {
      'não iniciado': 'Não Iniciado',
      'em andamento': 'Em Andamento',
      'concluído': 'Concluído',
      'pausado': 'Pausado'
    };
    
    return labels[status] || status;
  }
  
  /**
   * Atualiza manualmente a barra de progresso
   */
  async updateProgress() {
    // Recarrega os dados de progresso
    await this.loadProgressData();
    
    // Atualiza a barra de progresso
    this.renderProgressBar();
  }
}

// Exporta a barra de progresso global
window.globalProgressBar = new GlobalProgressBar();
