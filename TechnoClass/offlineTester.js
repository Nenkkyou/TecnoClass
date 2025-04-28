/**
 * TecnoClass-PWA - Teste de Funcionalidade Offline
 * 
 * Este script implementa testes automatizados para verificar
 * o funcionamento offline do aplicativo.
 */

class OfflineTester {
  constructor() {
    this.testResults = {
      navigation: null,
      contentAccess: null,
      synchronization: null,
      quizzes: null,
      progressPersistence: null
    };
    
    this.testStatus = {
      running: false,
      currentTest: null,
      log: []
    };
  }
  
  /**
   * Inicia os testes de funcionalidade offline
   */
  async runTests() {
    if (this.testStatus.running) {
      console.warn('Testes já estão em execução');
      return;
    }
    
    this.testStatus.running = true;
    this.testStatus.log = [];
    this.logMessage('Iniciando testes de funcionalidade offline...');
    
    try {
      // Testa a navegação offline
      await this.testOfflineNavigation();
      
      // Testa o acesso a conteúdo salvo
      await this.testContentAccess();
      
      // Testa a sincronização ao reconectar
      await this.testSynchronization();
      
      // Testa o funcionamento dos quizzes offline
      await this.testOfflineQuizzes();
      
      // Testa a persistência de progresso
      await this.testProgressPersistence();
      
      // Gera o relatório final
      this.generateTestReport();
    } catch (error) {
      this.logMessage(`Erro durante os testes: ${error.message}`, 'error');
      console.error('Erro durante os testes:', error);
    } finally {
      this.testStatus.running = false;
    }
  }
  
  /**
   * Testa a navegação offline
   */
  async testOfflineNavigation() {
    this.testStatus.currentTest = 'navigation';
    this.logMessage('Testando navegação offline...');
    
    try {
      // Simula desconexão
      await this.simulateOffline(true);
      
      // Testa navegação para diferentes páginas
      const pages = [
        '/',
        '/cursos',
        '/quizzes',
        '/perfil'
      ];
      
      const results = [];
      
      for (const page of pages) {
        try {
          // Tenta navegar para a página
          const result = await this.navigateToPage(page);
          results.push({
            page,
            success: result.success,
            message: result.message
          });
          
          this.logMessage(`Navegação para ${page}: ${result.success ? 'Sucesso' : 'Falha'}`);
        } catch (e) {
          results.push({
            page,
            success: false,
            message: e.message
          });
          
          this.logMessage(`Erro ao navegar para ${page}: ${e.message}`, 'error');
        }
      }
      
      // Verifica os resultados
      const successCount = results.filter(r => r.success).length;
      const totalPages = pages.length;
      
      this.testResults.navigation = {
        success: successCount === totalPages,
        score: (successCount / totalPages) * 100,
        details: results
      };
      
      this.logMessage(`Teste de navegação offline concluído: ${successCount}/${totalPages} páginas acessíveis offline`);
      
      // Restaura conexão
      await this.simulateOffline(false);
    } catch (error) {
      this.testResults.navigation = {
        success: false,
        score: 0,
        details: [{
          page: 'geral',
          success: false,
          message: error.message
        }]
      };
      
      this.logMessage(`Erro no teste de navegação offline: ${error.message}`, 'error');
      
      // Restaura conexão
      await this.simulateOffline(false);
      throw error;
    }
  }
  
  /**
   * Testa o acesso a conteúdo salvo
   */
  async testContentAccess() {
    this.testStatus.currentTest = 'contentAccess';
    this.logMessage('Testando acesso a conteúdo salvo...');
    
    try {
      // Primeiro, salva algum conteúdo para acesso offline
      await this.simulateOffline(false);
      
      // Obtém lista de cursos
      const courses = await this.fetchCourses();
      if (!courses || courses.length === 0) {
        throw new Error('Nenhum curso disponível para teste');
      }
      
      // Salva o primeiro curso para acesso offline
      const testCourse = courses[0];
      await this.saveCourseOffline(testCourse.id);
      
      this.logMessage(`Curso "${testCourse.title}" salvo para acesso offline`);
      
      // Simula desconexão
      await this.simulateOffline(true);
      
      // Tenta acessar o curso salvo
      const accessResult = await this.accessCourseContent(testCourse.id);
      
      // Verifica se o conteúdo está acessível
      this.testResults.contentAccess = {
        success: accessResult.success,
        score: accessResult.success ? 100 : 0,
        details: accessResult
      };
      
      this.logMessage(`Teste de acesso a conteúdo salvo concluído: ${accessResult.success ? 'Sucesso' : 'Falha'}`);
      
      // Restaura conexão
      await this.simulateOffline(false);
    } catch (error) {
      this.testResults.contentAccess = {
        success: false,
        score: 0,
        details: {
          success: false,
          message: error.message
        }
      };
      
      this.logMessage(`Erro no teste de acesso a conteúdo salvo: ${error.message}`, 'error');
      
      // Restaura conexão
      await this.simulateOffline(false);
      throw error;
    }
  }
  
  /**
   * Testa a sincronização ao reconectar
   */
  async testSynchronization() {
    this.testStatus.currentTest = 'synchronization';
    this.logMessage('Testando sincronização ao reconectar...');
    
    try {
      // Simula desconexão
      await this.simulateOffline(true);
      
      // Realiza algumas ações offline
      const offlineActions = await this.performOfflineActions();
      
      this.logMessage(`Realizadas ${offlineActions.length} ações offline`);
      
      // Restaura conexão
      await this.simulateOffline(false);
      
      // Verifica se as ações foram sincronizadas
      const syncResults = await this.checkSynchronization(offlineActions);
      
      // Calcula a pontuação
      const successCount = syncResults.filter(r => r.success).length;
      const totalActions = syncResults.length;
      
      this.testResults.synchronization = {
        success: successCount === totalActions,
        score: totalActions > 0 ? (successCount / totalActions) * 100 : 0,
        details: syncResults
      };
      
      this.logMessage(`Teste de sincronização concluído: ${successCount}/${totalActions} ações sincronizadas`);
    } catch (error) {
      this.testResults.synchronization = {
        success: false,
        score: 0,
        details: [{
          action: 'geral',
          success: false,
          message: error.message
        }]
      };
      
      this.logMessage(`Erro no teste de sincronização: ${error.message}`, 'error');
      
      // Restaura conexão
      await this.simulateOffline(false);
      throw error;
    }
  }
  
  /**
   * Testa o funcionamento dos quizzes offline
   */
  async testOfflineQuizzes() {
    this.testStatus.currentTest = 'quizzes';
    this.logMessage('Testando funcionamento dos quizzes offline...');
    
    try {
      // Primeiro, salva um quiz para acesso offline
      await this.simulateOffline(false);
      
      // Obtém lista de quizzes
      const quizzes = await this.fetchQuizzes();
      if (!quizzes || quizzes.length === 0) {
        throw new Error('Nenhum quiz disponível para teste');
      }
      
      // Salva o primeiro quiz para acesso offline
      const testQuiz = quizzes[0];
      await this.saveQuizOffline(testQuiz.id);
      
      this.logMessage(`Quiz "${testQuiz.title}" salvo para acesso offline`);
      
      // Simula desconexão
      await this.simulateOffline(true);
      
      // Tenta completar o quiz offline
      const quizResult = await this.completeQuizOffline(testQuiz.id);
      
      // Verifica se o quiz funcionou corretamente
      this.testResults.quizzes = {
        success: quizResult.success,
        score: quizResult.success ? 100 : 0,
        details: quizResult
      };
      
      this.logMessage(`Teste de quizzes offline concluído: ${quizResult.success ? 'Sucesso' : 'Falha'}`);
      
      // Restaura conexão
      await this.simulateOffline(false);
    } catch (error) {
      this.testResults.quizzes = {
        success: false,
        score: 0,
        details: {
          success: false,
          message: error.message
        }
      };
      
      this.logMessage(`Erro no teste de quizzes offline: ${error.message}`, 'error');
      
      // Restaura conexão
      await this.simulateOffline(false);
      throw error;
    }
  }
  
  /**
   * Testa a persistência de progresso
   */
  async testProgressPersistence() {
    this.testStatus.currentTest = 'progressPersistence';
    this.logMessage('Testando persistência de progresso...');
    
    try {
      // Simula desconexão
      await this.simulateOffline(true);
      
      // Realiza progresso em um curso offline
      const progressResult = await this.makeOfflineProgress();
      
      this.logMessage(`Progresso realizado offline: ${progressResult.success ? 'Sucesso' : 'Falha'}`);
      
      // Restaura conexão
      await this.simulateOffline(false);
      
      // Verifica se o progresso foi persistido
      const persistenceResult = await this.checkProgressPersistence(progressResult.courseId, progressResult.lessonId);
      
      // Verifica os resultados
      this.testResults.progressPersistence = {
        success: persistenceResult.success,
        score: persistenceResult.success ? 100 : 0,
        details: persistenceResult
      };
      
      this.logMessage(`Teste de persistência de progresso concluído: ${persistenceResult.success ? 'Sucesso' : 'Falha'}`);
    } catch (error) {
      this.testResults.progressPersistence = {
        success: false,
        score: 0,
        details: {
          success: false,
          message: error.message
        }
      };
      
      this.logMessage(`Erro no teste de persistência de progresso: ${error.message}`, 'error');
      
      // Restaura conexão
      await this.simulateOffline(false);
      throw error;
    }
  }
  
  /**
   * Simula estado offline/online
   * @param {boolean} offline - Se deve simular estado offline
   */
  async simulateOffline(offline) {
    // Em um ambiente real, isso seria feito com Service Worker
    // ou com a API Network Information
    
    if (offline) {
      this.logMessage('Simulando desconexão...');
      
      // Armazena o estado original das funções de rede
      if (!window._originalFetch) {
        window._originalFetch = window.fetch;
      }
      
      // Sobrescreve fetch para simular offline
      window.fetch = async (url, options) => {
        // Permite requisições ao IndexedDB e cache
        if (url.includes('indexeddb') || url.includes('cache')) {
          return window._originalFetch(url, options);
        }
        
        // Simula erro de rede para outras requisições
        throw new Error('NetworkError: Failed to fetch');
      };
      
      // Dispara evento offline
      window.dispatchEvent(new Event('offline'));
    } else {
      this.logMessage('Simulando reconexão...');
      
      // Restaura a função fetch original
      if (window._originalFetch) {
        window.fetch = window._originalFetch;
      }
      
      // Dispara evento online
      window.dispatchEvent(new Event('online'));
    }
    
    // Aguarda um momento para que os handlers de eventos sejam executados
    return new Promise(resolve => setTimeout(resolve, 500));
  }
  
  /**
   * Navega para uma página
   * @param {string} page - URL da página
   * @returns {Promise<Object>} Resultado da navegação
   */
  async navigateToPage(page) {
    try {
      // Em um ambiente real, isso seria feito com o router
      // Aqui, simulamos a navegação verificando se a página está no cache
      
      // Verifica se a página está no cache
      const cache = await caches.open('tecnoclass-dynamic');
      const response = await cache.match(page);
      
      if (!response) {
        return {
          success: false,
          message: `Página ${page} não encontrada no cache`
        };
      }
      
      return {
        success: true,
        message: `Página ${page} acessível offline`
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
  
  /**
   * Busca a lista de cursos
   * @returns {Promise<Array>} Lista de cursos
   */
  async fetchCourses() {
    try {
      // Em um ambiente real, isso seria feito com uma API
      // Aqui, simulamos buscando do IndexedDB
      
      return await window.dbService.getAll('courses');
    } catch (error) {
      this.logMessage(`Erro ao buscar cursos: ${error.message}`, 'error');
      return [];
    }
  }
  
  /**
   * Salva um curso para acesso offline
   * @param {string} courseId - ID do curso
   */
  async saveCourseOffline(courseId) {
    try {
      // Em um ambiente real, isso seria feito com o sistema de download
      // Aqui, simulamos marcando o curso como disponível offline
      
      const course = await window.dbService.getById('courses', courseId);
      if (!course) {
        throw new Error(`Curso ${courseId} não encontrado`);
      }
      
      // Marca o curso como disponível offline
      await window.userDataService.addOfflineContent({
        id: courseId,
        type: 'course',
        title: course.title,
        size: JSON.stringify(course).length / 1024, // Tamanho aproximado em KB
        downloadDate: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      this.logMessage(`Erro ao salvar curso offline: ${error.message}`, 'error');
      return false;
    }
  }
  
  /**
   * Acessa o conteúdo de um curso
   * @param {string} courseId - ID do curso
   * @returns {Promise<Object>} Resultado do acesso
   */
  async accessCourseContent(courseId) {
    try {
      // Verifica se o curso está disponível offline
      const offlineContent = await window.userDataService.getOfflineContent();
      const isCourseOffline = offlineContent.some(item => item.id === courseId && item.type === 'course');
      
      if (!isCourseOffline) {
        return {
          success: false,
          message: `Curso ${courseId} não está disponível offline`
        };
      }
      
      // Tenta acessar o curso
      const course = await window.dbService.getById('courses', courseId);
      if (!course) {
        return {
          success: false,
          message: `Curso ${courseId} não encontrado no banco de dados local`
        };
      }
      
      // Verifica se consegue acessar as lições
      if (!course.modules || course.modules.length === 0) {
        return {
          success: false,
          message: `Curso ${courseId} não possui módulos`
        };
      }
      
      const firstModule = course.modules[0];
      if (!firstModule.lessons || firstModule.lessons.length === 0) {
        return {
          success: false,
          message: `Módulo ${firstModule.id} não possui lições`
        };
      }
      
      return {
        success: true,
        message: `Curso ${courseId} acessível offline`,
        courseTitle: course.title,
        moduleCount: course.modules.length,
        lessonCount: course.modules.reduce((count, module) => count + module.lessons.length, 0)
      };
    } catch (error) {
      return {
        success: false,
        message: error.message
      };
    }
  }
  
  /**
   * Realiza ações offline
   * @returns {Promise<Array>} Lista de ações realizadas
   */
  async performOfflineActions() {
    const actions = [];
    
    try {
      // 1. Adiciona uma anotação
      const noteResult = await this.addOfflineNote();
      if (noteResult.success) {
        actions.push({
          type: 'note',
          id: noteResult.noteId,
          success: true
        });
  
(Content truncated due to size limit. Use line ranges to read in chunks)