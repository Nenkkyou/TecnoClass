/**
 * TecnoClass-PWA - Sistema de Navegação de Cursos
 * 
 * Este arquivo implementa o sistema de navegação e exibição de cursos
 * para a aplicação TecnoClass-PWA.
 */

class CourseNavigationSystem {
  constructor() {
    this.dbService = window.dbService;
    this.userDataService = window.userDataService;
    this.currentCourse = null;
    this.currentLesson = null;
    
    // Inicializa quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }
  
  /**
   * Inicializa o sistema de navegação de cursos
   */
  init() {
    this.setupEventListeners();
    this.setupRouteHandlers();
  }
  
  /**
   * Configura os listeners de eventos
   */
  setupEventListeners() {
    // Listener para cliques em cards de categorias
    document.querySelectorAll('.category-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const category = card.getAttribute('data-category');
        if (category) {
          this.navigateToCategory(category);
        }
      });
    });
    
    // Listener para eventos de navegação
    window.addEventListener('popstate', (e) => {
      this.handleRouteChange(window.location.pathname);
    });
  }
  
  /**
   * Configura os manipuladores de rotas
   */
  setupRouteHandlers() {
    // Define as rotas relacionadas a cursos
    const courseRoutes = {
      '/cursos': this.showCoursesList.bind(this),
      '/cursos/categoria/:category': this.showCategoryPage.bind(this),
      '/cursos/:courseId': this.showCourseDetails.bind(this),
      '/cursos/:courseId/licao/:lessonId': this.showLesson.bind(this)
    };
    
    // Registra as rotas no sistema de navegação
    if (window.router) {
      Object.entries(courseRoutes).forEach(([path, handler]) => {
        window.router.registerRoute(path, handler);
      });
    }
    
    // Verifica a rota atual
    this.handleRouteChange(window.location.pathname);
  }
  
  /**
   * Manipula mudanças de rota
   * @param {string} path - Caminho da URL
   */
  handleRouteChange(path) {
    if (window.router) {
      window.router.navigateTo(path, false);
    } else {
      // Fallback simples se o router não estiver disponível
      if (path === '/cursos') {
        this.showCoursesList();
      } else if (path.startsWith('/cursos/categoria/')) {
        const category = path.split('/').pop();
        this.showCategoryPage(category);
      } else if (path.match(/^\/cursos\/[^\/]+$/)) {
        const courseId = path.split('/').pop();
        this.showCourseDetails(courseId);
      } else if (path.match(/^\/cursos\/[^\/]+\/licao\/[^\/]+$/)) {
        const parts = path.split('/');
        const courseId = parts[2];
        const lessonId = parts[4];
        this.showLesson(courseId, lessonId);
      }
    }
  }
  
  /**
   * Navega para a página de cursos
   */
  navigateToCourses() {
    this.navigateTo('/cursos');
  }
  
  /**
   * Navega para uma categoria específica
   * @param {string} category - ID da categoria
   */
  navigateToCategory(category) {
    this.navigateTo(`/cursos/categoria/${category}`);
  }
  
  /**
   * Navega para um curso específico
   * @param {string} courseId - ID do curso
   */
  navigateToCourse(courseId) {
    this.navigateTo(`/cursos/${courseId}`);
  }
  
  /**
   * Navega para uma lição específica
   * @param {string} courseId - ID do curso
   * @param {string} lessonId - ID da lição
   */
  navigateToLesson(courseId, lessonId) {
    this.navigateTo(`/cursos/${courseId}/licao/${lessonId}`);
  }
  
  /**
   * Função auxiliar para navegação
   * @param {string} path - Caminho da URL
   */
  navigateTo(path) {
    if (window.router) {
      window.router.navigateTo(path);
    } else {
      // Fallback simples
      window.history.pushState(null, '', path);
      this.handleRouteChange(path);
    }
  }
  
  /**
   * Exibe a lista de todos os cursos
   */
  async showCoursesList() {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;
    
    try {
      // Obtém todos os cursos do banco de dados
      const courses = await this.dbService.getAll('courses');
      
      // Agrupa cursos por categoria
      const coursesByCategory = this.groupCoursesByCategory(courses);
      
      // Cria o HTML para a página de cursos
      const html = `
        <section id="courses-page" class="screen">
          <div class="container">
            <div class="page-header">
              <h2>Cursos Disponíveis</h2>
              <p>Explore nossos cursos por categoria</p>
            </div>
            
            ${Object.entries(coursesByCategory).map(([category, categoryCourses]) => `
              <div class="category-section">
                <h3 class="category-title">${this.getCategoryName(category)}</h3>
                <div class="courses-grid">
                  ${categoryCourses.map(course => this.createCourseCard(course)).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
      
      // Atualiza o conteúdo
      appContent.innerHTML = html;
      
      // Adiciona event listeners aos cards de cursos
      document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const courseId = card.getAttribute('data-course-id');
          if (courseId) {
            this.navigateToCourse(courseId);
          }
        });
      });
      
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      appContent.innerHTML = `
        <section class="screen">
          <div class="container">
            <div class="error-message">
              <h2>Erro ao carregar cursos</h2>
              <p>Não foi possível carregar a lista de cursos. Por favor, tente novamente mais tarde.</p>
              <button class="btn btn-primary" id="retry-courses">Tentar novamente</button>
            </div>
          </div>
        </section>
      `;
      
      document.getElementById('retry-courses')?.addEventListener('click', () => {
        this.showCoursesList();
      });
    }
  }
  
  /**
   * Exibe a página de uma categoria específica
   * @param {string} category - ID da categoria
   */
  async showCategoryPage(category) {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;
    
    try {
      // Obtém cursos da categoria especificada
      const courses = await this.dbService.getByIndex('courses', 'category', category);
      
      // Cria o HTML para a página da categoria
      const html = `
        <section id="category-page" class="screen">
          <div class="container">
            <div class="page-header">
              <h2>${this.getCategoryName(category)}</h2>
              <p>Explore os cursos desta categoria</p>
            </div>
            
            <div class="courses-grid">
              ${courses.map(course => this.createCourseCard(course)).join('')}
            </div>
            
            <div class="navigation-buttons">
              <button class="btn btn-secondary" id="back-to-courses">Voltar para Cursos</button>
            </div>
          </div>
        </section>
      `;
      
      // Atualiza o conteúdo
      appContent.innerHTML = html;
      
      // Adiciona event listeners
      document.querySelectorAll('.course-card').forEach(card => {
        card.addEventListener('click', (e) => {
          const courseId = card.getAttribute('data-course-id');
          if (courseId) {
            this.navigateToCourse(courseId);
          }
        });
      });
      
      document.getElementById('back-to-courses')?.addEventListener('click', () => {
        this.navigateToCourses();
      });
      
    } catch (error) {
      console.error(`Erro ao carregar categoria ${category}:`, error);
      appContent.innerHTML = `
        <section class="screen">
          <div class="container">
            <div class="error-message">
              <h2>Erro ao carregar categoria</h2>
              <p>Não foi possível carregar os cursos desta categoria. Por favor, tente novamente mais tarde.</p>
              <button class="btn btn-primary" id="retry-category">Tentar novamente</button>
              <button class="btn btn-secondary" id="back-to-courses">Voltar para Cursos</button>
            </div>
          </div>
        </section>
      `;
      
      document.getElementById('retry-category')?.addEventListener('click', () => {
        this.showCategoryPage(category);
      });
      
      document.getElementById('back-to-courses')?.addEventListener('click', () => {
        this.navigateToCourses();
      });
    }
  }
  
  /**
   * Exibe os detalhes de um curso específico
   * @param {string} courseId - ID do curso
   */
  async showCourseDetails(courseId) {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;
    
    try {
      // Obtém os dados do curso
      const course = await this.dbService.getById('courses', courseId);
      if (!course) {
        throw new Error('Curso não encontrado');
      }
      
      // Salva o curso atual
      this.currentCourse = course;
      
      // Obtém o progresso do usuário para este curso
      let progress = null;
      try {
        progress = await this.userDataService.getCourseProgress(courseId);
      } catch (e) {
        console.warn('Não foi possível obter o progresso do usuário:', e);
      }
      
      // Calcula o progresso geral
      const progressPercentage = progress ? progress.progress : 0;
      
      // Verifica se o curso é favorito
      let isFavorite = false;
      try {
        isFavorite = await this.userDataService.isFavorite(courseId, 'course');
      } catch (e) {
        console.warn('Não foi possível verificar se o curso é favorito:', e);
      }
      
      // Cria o HTML para a página de detalhes do curso
      const html = `
        <section id="course-details" class="screen">
          <div class="container">
            <div class="course-header">
              <h2>${course.title}</h2>
              <div class="course-meta">
                <span class="course-category">${this.getCategoryName(course.category)}</span>
                <span class="course-level">${course.level}</span>
                <span class="course-duration">${course.duration}</span>
              </div>
            </div>
            
            <div class="course-actions">
              <button class="btn btn-primary" id="start-course">
                ${progressPercentage > 0 ? 'Continuar Curso' : 'Iniciar Curso'}
              </button>
              <button class="btn btn-icon favorite-button ${isFavorite ? 'active' : ''}" id="toggle-favorite" aria-label="${isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
                <span class="favorite-icon"></span>
              </button>
            </div>
            
            <div class="course-progress">
              <h3>Seu Progresso</h3>
              <div class="progress-bar" data-progress="${progressPercentage}">
                <div class="progress-indicator" style="width: ${progressPercentage}%"></div>
              </div>
              <span class="progress-text">${progressPercentage}% concluído</span>
            </div>
            
            <div class="course-description">
              <h3>Sobre este curso</h3>
              <p>${course.description}</p>
            </div>
            
            <div class="course-modules">
              <h3>Conteúdo do Curso</h3>
              <div class="modules-list">
                ${course.modules.map((module, moduleIndex) => `
                  <div class="module-item">
                    <div class="module-header" data-module-id="${module.id}">
                      <h4>${module.title}</h4>
                      <span class="module-toggle"></span>
                    </div>
                    <div class="module-lessons">
                      ${module.lessons.map((lesson, lessonIndex) => `
                        <div class="lesson-item" data-lesson-id="${lesson.id}">
                          <span class="lesson-number">${moduleIndex + 1}.${lessonIndex + 1}</span>
                          <span class="lesson-title">${lesson.title}</span>
                          <span class="lesson-status"></span>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="navigation-buttons">
              <button class="btn btn-secondary" id="back-to-courses">Voltar para Cursos</button>
            </div>
          </div>
        </section>
      `;
      
      // Atualiza o conteúdo
      appContent.innerHTML = html;
      
      // Inicializa componentes de UI
      if (window.uiComponents) {
        window.uiComponents.initAccordions();
      }
      
      // Adiciona event listeners
      document.getElementById('start-course')?.addEventListener('click', () => {
        // Navega para a primeira lição ou para a última acessada
        if (course.modules && course.modules.length > 0 && course.modules[0].lessons && course.modules[0].lessons.length > 0) {
          // Se houver progresso, tenta continuar de onde parou
          if (progress && progress.lastLessonId) {
            this.navigateToLesson(courseId, progress.lastLessonId);
          } else {
            // Caso contrário, inicia pela primeira lição
            this.navigateToLesson(courseId, course.modules[0].lessons[0].id);
          }
        }
      });
      
      document.getElementById('toggle-favorite')?.addEventListener('click', async (e) => {
        const button = e.currentTarget;
        
        try {
          if (isFavorite) {
            await this.userDataService.removeFavorite(courseId, 'course');
            isFavorite = false;
            button.classList.remove('active');
            button.setAttribute('aria-label', 'Adicionar aos favoritos');
          } else {
            await this.userDataService.addFavorite(courseId, 'course');
            isFavorite = true;
            button.classList.add('active');
            button.setAttribute('aria-label', 'Remover dos favoritos');
          }
        } catch (error) {
          console.error('Erro ao alterar favorito:', error);
          // Mostra mensagem de erro
          if (window.uiComponents) {
            window.uiComponents.showToast({
              message: 'Erro ao alterar favorito. Tente novamente mais tarde.',
              type: 'error'
            });
          }
        }
      });
      
      document.querySelectorAll('.lesson-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const lessonId = item.getAttribute('data-lesson-id');
          if (lessonId) {
            this.navigateToLesson(courseId, lessonId);
          }
        });
      });
      
      document.getElementById('back-to-courses')?.addEventListener('click', () => {
        this.navigateToCourses();
      });
      
    } catch (error) {
      console.error(`Erro ao carregar curso ${courseId}:`, error);
      appContent.innerHTML = `
        <section class="screen">
          <div class="container">
            <div class="error-message">
              <h2>Erro ao carregar curso</h2>
              <p>Não foi possível carregar os detalhes deste curso. Por favor, tente novamente mais tarde.</p>
              <button class="btn btn-primary" id="retry-course">Tentar novamente</button>
              <button class="btn btn-secondary" id="back-to-courses">Voltar para Cursos</button>
            </div>
          </div>
        </section>
      `;
      
      document.getElementById('retry-course')?.addEventListener('click', () => {
        this.showCourseDetails(courseId);
      });
      
      document.getElementById('back-to-courses')?.addEventListener('click', () => {
        this
(Content truncated due to size limit. Use line ranges to read in chunks)