/**
 * TecnoClass-PWA - Sistema de Quizzes Interativos
 * 
 * Este arquivo implementa o sistema de quizzes interativos para a aplicação,
 * permitindo aos usuários testarem seus conhecimentos.
 */

class QuizSystem {
  constructor() {
    this.dbService = window.dbService;
    this.userDataService = window.userDataService;
    this.currentQuiz = null;
    this.currentQuestion = 0;
    this.userAnswers = [];
    this.quizResults = null;
    
    // Inicializa quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }
  
  /**
   * Inicializa o sistema de quizzes
   */
  init() {
    this.setupEventListeners();
    this.setupRouteHandlers();
  }
  
  /**
   * Configura os listeners de eventos
   */
  setupEventListeners() {
    // Listener para cliques em cards de quizzes
    document.addEventListener('click', (e) => {
      const quizCard = e.target.closest('.quiz-card');
      if (quizCard) {
        const quizId = quizCard.getAttribute('data-quiz-id');
        if (quizId) {
          this.navigateToQuiz(quizId);
        }
      }
    });
  }
  
  /**
   * Configura os manipuladores de rotas
   */
  setupRouteHandlers() {
    // Define as rotas relacionadas a quizzes
    const quizRoutes = {
      '/quizzes': this.showQuizzesList.bind(this),
      '/quizzes/:quizId': this.showQuizDetails.bind(this),
      '/quizzes/:quizId/iniciar': this.startQuiz.bind(this),
      '/quizzes/:quizId/resultados': this.showQuizResults.bind(this)
    };
    
    // Registra as rotas no sistema de navegação
    if (window.router) {
      Object.entries(quizRoutes).forEach(([path, handler]) => {
        window.router.registerRoute(path, handler);
      });
    }
  }
  
  /**
   * Navega para a página de quizzes
   */
  navigateToQuizzes() {
    this.navigateTo('/quizzes');
  }
  
  /**
   * Navega para um quiz específico
   * @param {string} quizId - ID do quiz
   */
  navigateToQuiz(quizId) {
    this.navigateTo(`/quizzes/${quizId}`);
  }
  
  /**
   * Navega para iniciar um quiz
   * @param {string} quizId - ID do quiz
   */
  navigateToStartQuiz(quizId) {
    this.navigateTo(`/quizzes/${quizId}/iniciar`);
  }
  
  /**
   * Navega para os resultados de um quiz
   * @param {string} quizId - ID do quiz
   */
  navigateToQuizResults(quizId) {
    this.navigateTo(`/quizzes/${quizId}/resultados`);
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
   * Manipula mudanças de rota
   * @param {string} path - Caminho da URL
   */
  handleRouteChange(path) {
    if (path === '/quizzes') {
      this.showQuizzesList();
    } else if (path.match(/^\/quizzes\/[^\/]+$/)) {
      const quizId = path.split('/').pop();
      this.showQuizDetails(quizId);
    } else if (path.match(/^\/quizzes\/[^\/]+\/iniciar$/)) {
      const quizId = path.split('/')[2];
      this.startQuiz(quizId);
    } else if (path.match(/^\/quizzes\/[^\/]+\/resultados$/)) {
      const quizId = path.split('/')[2];
      this.showQuizResults(quizId);
    }
  }
  
  /**
   * Exibe a lista de todos os quizzes
   */
  async showQuizzesList() {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;
    
    try {
      // Obtém todos os quizzes do banco de dados
      const quizzes = await this.dbService.getAll('quizzes');
      
      // Agrupa quizzes por categoria
      const quizzesByCategory = this.groupQuizzesByCategory(quizzes);
      
      // Cria o HTML para a página de quizzes
      const html = `
        <section id="quizzes-page" class="screen">
          <div class="container">
            <div class="page-header">
              <h2>Quizzes Disponíveis</h2>
              <p>Teste seus conhecimentos com nossos quizzes interativos</p>
            </div>
            
            ${Object.entries(quizzesByCategory).map(([category, categoryQuizzes]) => `
              <div class="category-section">
                <h3 class="category-title">${this.getCategoryName(category)}</h3>
                <div class="quizzes-grid">
                  ${categoryQuizzes.map(quiz => this.createQuizCard(quiz)).join('')}
                </div>
              </div>
            `).join('')}
          </div>
        </section>
      `;
      
      // Atualiza o conteúdo
      appContent.innerHTML = html;
      
    } catch (error) {
      console.error('Erro ao carregar quizzes:', error);
      appContent.innerHTML = `
        <section class="screen">
          <div class="container">
            <div class="error-message">
              <h2>Erro ao carregar quizzes</h2>
              <p>Não foi possível carregar a lista de quizzes. Por favor, tente novamente mais tarde.</p>
              <button class="btn btn-primary" id="retry-quizzes">Tentar novamente</button>
            </div>
          </div>
        </section>
      `;
      
      document.getElementById('retry-quizzes')?.addEventListener('click', () => {
        this.showQuizzesList();
      });
    }
  }
  
  /**
   * Exibe os detalhes de um quiz específico
   * @param {string} quizId - ID do quiz
   */
  async showQuizDetails(quizId) {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;
    
    try {
      // Obtém os dados do quiz
      const quiz = await this.dbService.getById('quizzes', quizId);
      if (!quiz) {
        throw new Error('Quiz não encontrado');
      }
      
      // Salva o quiz atual
      this.currentQuiz = quiz;
      
      // Obtém o histórico de tentativas do usuário para este quiz
      let attempts = [];
      try {
        attempts = await this.userDataService.getQuizAttempts(quizId);
      } catch (e) {
        console.warn('Não foi possível obter o histórico de tentativas:', e);
      }
      
      // Obtém a melhor pontuação
      const bestScore = attempts.length > 0 
        ? Math.max(...attempts.map(a => a.score)) 
        : 0;
      
      // Cria o HTML para a página de detalhes do quiz
      const html = `
        <section id="quiz-details" class="screen">
          <div class="container">
            <div class="quiz-header">
              <h2>${quiz.title}</h2>
              <div class="quiz-meta">
                <span class="quiz-category">${this.getCategoryName(quiz.category)}</span>
                <span class="quiz-difficulty">${this.getDifficultyLabel(quiz.difficulty)}</span>
                <span class="quiz-questions">${quiz.questions.length} questões</span>
              </div>
            </div>
            
            <div class="quiz-description">
              <p>${quiz.description}</p>
            </div>
            
            <div class="quiz-stats">
              <div class="stat-item">
                <span class="stat-label">Tentativas</span>
                <span class="stat-value">${attempts.length}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Melhor Pontuação</span>
                <span class="stat-value">${bestScore}%</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Tempo Estimado</span>
                <span class="stat-value">${quiz.estimatedTime}</span>
              </div>
            </div>
            
            <div class="quiz-actions">
              <button class="btn btn-primary" id="start-quiz">Iniciar Quiz</button>
              ${attempts.length > 0 ? `
                <button class="btn btn-secondary" id="view-last-results">Ver Últimos Resultados</button>
              ` : ''}
            </div>
            
            ${attempts.length > 0 ? `
              <div class="quiz-history">
                <h3>Histórico de Tentativas</h3>
                <div class="history-list">
                  ${attempts.slice(0, 5).map(attempt => `
                    <div class="history-item">
                      <span class="history-date">${new Date(attempt.date).toLocaleDateString()}</span>
                      <span class="history-score">${attempt.score}%</span>
                      <span class="history-time">${attempt.timeSpent}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            
            <div class="navigation-buttons">
              <button class="btn btn-secondary" id="back-to-quizzes">Voltar para Quizzes</button>
            </div>
          </div>
        </section>
      `;
      
      // Atualiza o conteúdo
      appContent.innerHTML = html;
      
      // Adiciona event listeners
      document.getElementById('start-quiz')?.addEventListener('click', () => {
        this.navigateToStartQuiz(quizId);
      });
      
      document.getElementById('view-last-results')?.addEventListener('click', () => {
        if (attempts.length > 0) {
          // Carrega os resultados da última tentativa
          this.quizResults = attempts[0];
          this.navigateToQuizResults(quizId);
        }
      });
      
      document.getElementById('back-to-quizzes')?.addEventListener('click', () => {
        this.navigateToQuizzes();
      });
      
    } catch (error) {
      console.error(`Erro ao carregar quiz ${quizId}:`, error);
      appContent.innerHTML = `
        <section class="screen">
          <div class="container">
            <div class="error-message">
              <h2>Erro ao carregar quiz</h2>
              <p>Não foi possível carregar os detalhes deste quiz. Por favor, tente novamente mais tarde.</p>
              <button class="btn btn-primary" id="retry-quiz">Tentar novamente</button>
              <button class="btn btn-secondary" id="back-to-quizzes">Voltar para Quizzes</button>
            </div>
          </div>
        </section>
      `;
      
      document.getElementById('retry-quiz')?.addEventListener('click', () => {
        this.showQuizDetails(quizId);
      });
      
      document.getElementById('back-to-quizzes')?.addEventListener('click', () => {
        this.navigateToQuizzes();
      });
    }
  }
  
  /**
   * Inicia um quiz
   * @param {string} quizId - ID do quiz
   */
  async startQuiz(quizId) {
    const appContent = document.getElementById('app-content');
    if (!appContent) return;
    
    try {
      // Obtém os dados do quiz se ainda não estiverem carregados
      if (!this.currentQuiz || this.currentQuiz.id !== quizId) {
        this.currentQuiz = await this.dbService.getById('quizzes', quizId);
        if (!this.currentQuiz) {
          throw new Error('Quiz não encontrado');
        }
      }
      
      // Reinicia o estado do quiz
      this.currentQuestion = 0;
      this.userAnswers = Array(this.currentQuiz.questions.length).fill(null);
      this.quizStartTime = Date.now();
      
      // Renderiza a primeira questão
      this.renderCurrentQuestion(appContent);
      
    } catch (error) {
      console.error(`Erro ao iniciar quiz ${quizId}:`, error);
      appContent.innerHTML = `
        <section class="screen">
          <div class="container">
            <div class="error-message">
              <h2>Erro ao iniciar quiz</h2>
              <p>Não foi possível iniciar este quiz. Por favor, tente novamente mais tarde.</p>
              <button class="btn btn-primary" id="retry-start">Tentar novamente</button>
              <button class="btn btn-secondary" id="back-to-quiz">Voltar para Detalhes</button>
            </div>
          </div>
        </section>
      `;
      
      document.getElementById('retry-start')?.addEventListener('click', () => {
        this.startQuiz(quizId);
      });
      
      document.getElementById('back-to-quiz')?.addEventListener('click', () => {
        this.navigateToQuiz(quizId);
      });
    }
  }
  
  /**
   * Renderiza a questão atual
   * @param {HTMLElement} container - Elemento container
   */
  renderCurrentQuestion(container) {
    if (!this.currentQuiz || !container) return;
    
    const question = this.currentQuiz.questions[this.currentQuestion];
    if (!question) return;
    
    // Cria o HTML para a questão
    const html = `
      <section id="quiz-question" class="screen">
        <div class="container">
          <div class="quiz-progress">
            <div class="progress-text">Questão ${this.currentQuestion + 1} de ${this.currentQuiz.questions.length}</div>
            <div class="progress-bar">
              <div class="progress-indicator" style="width: ${(this.currentQuestion + 1) / this.currentQuiz.questions.length * 100}%"></div>
            </div>
          </div>
          
          <div class="question-container">
            <h2 class="question-text">${question.text}</h2>
            
            <div class="options-list">
              ${question.options.map((option, index) => `
                <div class="option-item ${this.userAnswers[this.currentQuestion] === index ? 'selected' : ''}" data-option-index="${index}">
                  <span class="option-marker">${String.fromCharCode(65 + index)}</span>
                  <span class="option-text">${option}</span>
                </div>
              `).join('')}
            </div>
          </div>
          
          <div class="quiz-navigation">
            ${this.currentQuestion > 0 ? `
              <button class="btn btn-secondary" id="prev-question">Anterior</button>
            ` : `
              <div></div>
            `}
            
            <button class="btn btn-primary" id="next-question" ${this.userAnswers[this.currentQuestion] === null ? 'disabled' : ''}>
              ${this.currentQuestion < this.currentQuiz.questions.length - 1 ? 'Próxima' : 'Finalizar Quiz'}
            </button>
          </div>
        </div>
      </section>
    `;
    
    // Atualiza o conteúdo
    container.innerHTML = html;
    
    // Adiciona event listeners
    document.querySelectorAll('.option-item').forEach(option => {
      option.addEventListener('click', (e) => {
        const optionIndex = parseInt(option.getAttribute('data-option-index'), 10);
        
        // Remove a seleção anterior
        document.querySelectorAll('.option-item').forEach(opt => {
          opt.classList.remove('selected');
        });
        
        // Seleciona a opção clicada
        option.classList.add('selected');
        
        // Salva a resposta do usuário
        this.userAnswers[this.currentQuestion] = optionIndex;
        
        // Habilita o botão de próxima
        const nextButton = document.getElementById('next-question');
        if (nextButton) {
          nextButton.removeAttribute('disabled');
        }
      });
    });
    
    document.getElementById('prev-question')?.addEventListener('click', () => {
      if (this.currentQuestion > 0) {
        this.currentQuestion--;
        this.renderCurrentQuestion(container);
      }
    });
    
    document.getElementById('next-question')?.addEventListener('click', () => {
      if (this.currentQuestion < this.currentQuiz.questions.length - 1) {
        // Avança para a próxima questão
        this.currentQuestion++;
        this.renderCurrentQuestion(container);
      } else {
        // Finaliza o quiz
        this.finishQuiz();
      }
    });
  }
  
  /**
   * Finaliza o quiz e calcula os resultados
   */
  async finishQuiz() {
    if (!this.currentQuiz) return;
    
    // Calcula o tempo gasto
    const quizEndTime = Date.now();
    const timeSpentMs = quizEndTime - this.quizStartTime;
    const timeSpentMinutes = Math.floor(timeSpentMs / 60000);
    const timeSpentSeconds = Math.floor((timeSpentMs % 60000) / 1000);
    const timeSpent = `${timeSpentMinutes}m ${timeSpentSeconds}s`;
    
    // Calcula a pontuação
    let correctAnswers = 0;
    const detailedResults = this.currentQuiz.que
(Content truncated due to size limit. Use line ranges to read in chunks)