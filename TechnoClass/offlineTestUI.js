/**
 * TecnoClass-PWA - Interface de Teste Offline
 * 
 * Este arquivo implementa uma interface de usuário para executar
 * e visualizar os testes de funcionalidade offline.
 */

class OfflineTestUI {
  constructor() {
    this.tester = window.offlineTester;
    this.testRunning = false;
    
    // Inicializa quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }
  
  /**
   * Inicializa a interface de teste
   */
  init() {
    // Cria a interface de teste
    this.createTestUI();
    
    // Configura os event listeners
    this.setupEventListeners();
  }
  
  /**
   * Cria a interface de teste
   */
  createTestUI() {
    // Cria o container principal
    const container = document.createElement('div');
    container.id = 'offline-test-ui';
    container.className = 'offline-test-ui';
    
    // Adiciona o HTML da interface
    container.innerHTML = `
      <div class="test-panel">
        <div class="test-header">
          <h2>Teste de Funcionalidade Offline</h2>
          <p>Execute testes para verificar o funcionamento offline do aplicativo</p>
        </div>
        
        <div class="test-controls">
          <button id="run-all-tests" class="btn btn-primary">Executar Todos os Testes</button>
          <div class="test-options">
            <label>
              <input type="checkbox" id="test-navigation" checked>
              Navegação Offline
            </label>
            <label>
              <input type="checkbox" id="test-content" checked>
              Acesso a Conteúdo
            </label>
            <label>
              <input type="checkbox" id="test-sync" checked>
              Sincronização
            </label>
            <label>
              <input type="checkbox" id="test-quizzes" checked>
              Quizzes Offline
            </label>
            <label>
              <input type="checkbox" id="test-progress" checked>
              Persistência de Progresso
            </label>
          </div>
        </div>
        
        <div class="test-status">
          <div class="status-indicator">
            <span class="status-label">Status:</span>
            <span class="status-value" id="test-status-value">Pronto</span>
          </div>
          <div class="progress-container">
            <div class="progress-bar" id="test-progress-bar">
              <div class="progress-indicator" style="width: 0%"></div>
            </div>
          </div>
        </div>
        
        <div class="test-results" id="test-results">
          <div class="results-placeholder">
            <p>Execute os testes para ver os resultados</p>
          </div>
        </div>
        
        <div class="test-log">
          <h3>Log de Execução</h3>
          <div class="log-container" id="test-log-container">
            <div class="log-entry info">
              <span class="log-time">${new Date().toLocaleTimeString()}</span>
              <span class="log-message">Sistema de teste inicializado</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Adiciona ao DOM
    document.body.appendChild(container);
    
    // Adiciona estilos
    this.addStyles();
  }
  
  /**
   * Adiciona estilos CSS
   */
  addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .offline-test-ui {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      
      .test-panel {
        width: 90%;
        max-width: 800px;
        max-height: 90vh;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }
      
      .test-header {
        padding: 20px;
        background-color: #1abc9c;
        color: #fff;
      }
      
      .test-header h2 {
        margin: 0 0 10px 0;
        font-size: 24px;
      }
      
      .test-header p {
        margin: 0;
        opacity: 0.9;
      }
      
      .test-controls {
        padding: 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        align-items: center;
      }
      
      .test-options {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
      }
      
      .test-options label {
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
      }
      
      .test-status {
        padding: 15px 20px;
        background-color: #f8f9fa;
        border-bottom: 1px solid #eee;
      }
      
      .status-indicator {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
      }
      
      .status-label {
        font-weight: bold;
        margin-right: 10px;
      }
      
      .status-value {
        padding: 3px 10px;
        border-radius: 12px;
        background-color: #e9ecef;
      }
      
      .status-value.running {
        background-color: #007bff;
        color: #fff;
      }
      
      .status-value.success {
        background-color: #28a745;
        color: #fff;
      }
      
      .status-value.failure {
        background-color: #dc3545;
        color: #fff;
      }
      
      .progress-container {
        height: 8px;
        background-color: #e9ecef;
        border-radius: 4px;
        overflow: hidden;
      }
      
      .progress-indicator {
        height: 100%;
        background-color: #1abc9c;
        transition: width 0.3s ease;
      }
      
      .test-results {
        padding: 20px;
        overflow-y: auto;
        flex: 1;
      }
      
      .results-placeholder {
        text-align: center;
        color: #6c757d;
        padding: 30px 0;
      }
      
      .test-result-item {
        margin-bottom: 15px;
        border: 1px solid #eee;
        border-radius: 6px;
        overflow: hidden;
      }
      
      .result-header {
        padding: 10px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #f8f9fa;
        border-bottom: 1px solid #eee;
      }
      
      .result-title {
        font-weight: bold;
      }
      
      .result-score {
        padding: 2px 8px;
        border-radius: 10px;
        font-size: 14px;
      }
      
      .result-score.excellent {
        background-color: #28a745;
        color: #fff;
      }
      
      .result-score.good {
        background-color: #17a2b8;
        color: #fff;
      }
      
      .result-score.average {
        background-color: #ffc107;
        color: #212529;
      }
      
      .result-score.poor {
        background-color: #dc3545;
        color: #fff;
      }
      
      .result-details {
        padding: 15px;
      }
      
      .detail-item {
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
      }
      
      .detail-item:last-child {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }
      
      .detail-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }
      
      .detail-title {
        font-weight: 500;
      }
      
      .detail-status {
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 12px;
      }
      
      .detail-status.success {
        background-color: #d4edda;
        color: #155724;
      }
      
      .detail-status.failure {
        background-color: #f8d7da;
        color: #721c24;
      }
      
      .detail-message {
        font-size: 14px;
        color: #6c757d;
      }
      
      .test-log {
        padding: 15px 20px;
        background-color: #f8f9fa;
        border-top: 1px solid #eee;
        max-height: 200px;
        overflow-y: auto;
      }
      
      .test-log h3 {
        margin: 0 0 10px 0;
        font-size: 16px;
      }
      
      .log-container {
        font-family: monospace;
        font-size: 13px;
      }
      
      .log-entry {
        margin-bottom: 5px;
        padding: 5px;
        border-radius: 4px;
      }
      
      .log-entry.info {
        background-color: #e9ecef;
      }
      
      .log-entry.warning {
        background-color: #fff3cd;
      }
      
      .log-entry.error {
        background-color: #f8d7da;
      }
      
      .log-time {
        color: #6c757d;
        margin-right: 10px;
      }
      
      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
      }
      
      .btn-primary {
        background-color: #1abc9c;
        color: #fff;
      }
      
      .btn-primary:hover {
        background-color: #16a085;
      }
      
      .btn-primary:disabled {
        background-color: #a0d8cf;
        cursor: not-allowed;
      }
      
      .summary-container {
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 6px;
        text-align: center;
      }
      
      .summary-container.excellent {
        background-color: #d4edda;
      }
      
      .summary-container.good {
        background-color: #d1ecf1;
      }
      
      .summary-container.average {
        background-color: #fff3cd;
      }
      
      .summary-container.poor {
        background-color: #f8d7da;
      }
      
      .summary-score {
        font-size: 36px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      
      .summary-status {
        font-size: 18px;
        margin-bottom: 5px;
      }
      
      .summary-message {
        color: #6c757d;
      }
      
      @media (max-width: 768px) {
        .test-panel {
          width: 95%;
          max-height: 95vh;
        }
        
        .test-controls {
          flex-direction: column;
          align-items: stretch;
          gap: 15px;
        }
        
        .test-options {
          flex-direction: column;
          gap: 10px;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * Configura os event listeners
   */
  setupEventListeners() {
    // Botão para executar todos os testes
    document.getElementById('run-all-tests')?.addEventListener('click', () => {
      this.runTests();
    });
  }
  
  /**
   * Executa os testes selecionados
   */
  async runTests() {
    if (this.testRunning) return;
    
    this.testRunning = true;
    
    // Atualiza a interface
    this.updateStatus('Executando testes...', 'running');
    this.updateProgress(0);
    this.clearResults();
    this.clearLog();
    
    // Desabilita o botão de teste
    const runButton = document.getElementById('run-all-tests');
    if (runButton) {
      runButton.disabled = true;
    }
    
    // Obtém os testes selecionados
    const selectedTests = {
      navigation: document.getElementById('test-navigation')?.checked || false,
      content: document.getElementById('test-content')?.checked || false,
      sync: document.getElementById('test-sync')?.checked || false,
      quizzes: document.getElementById('test-quizzes')?.checked || false,
      progress: document.getElementById('test-progress')?.checked || false
    };
    
    try {
      // Configura o listener para logs
      this.setupLogListener();
      
      // Executa os testes
      await this.executeTests(selectedTests);
      
      // Exibe os resultados
      this.displayResults();
      
      // Atualiza o status
      const report = JSON.parse(localStorage.getItem('offlineTestReport') || '{}');
      const score = report.averageScore || 0;
      
      if (score >= 90) {
        this.updateStatus('Testes concluídos com sucesso!', 'success');
      } else if (score >= 50) {
        this.updateStatus('Testes concluídos com avisos', 'warning');
      } else {
        this.updateStatus('Testes concluídos com falhas', 'failure');
      }
    } catch (error) {
      console.error('Erro ao executar testes:', error);
      this.updateStatus('Erro ao executar testes', 'failure');
      this.addLogEntry(`Erro ao executar testes: ${error.message}`, 'error');
    } finally {
      // Habilita o botão de teste
      if (runButton) {
        runButton.disabled = false;
      }
      
      this.testRunning = false;
    }
  }
  
  /**
   * Executa os testes selecionados
   * @param {Object} selectedTests - Testes selecionados
   */
  async executeTests(selectedTests) {
    // Obtém o número total de testes
    const totalTests = Object.values(selectedTests).filter(Boolean).length;
    let completedTests = 0;
    
    // Testa a navegação offline
    if (selectedTests.navigation) {
      this.addLogEntry('Iniciando teste de navegação offline...', 'info');
      await this.tester.testOfflineNavigation();
      completedTests++;
      this.updateProgress((completedTests / totalTests) * 100);
    }
    
    // Testa o acesso a conteúdo salvo
    if (selectedTests.content) {
      this.addLogEntry('Iniciando teste de acesso a conteúdo salvo...', 'info');
      await this.tester.testContentAccess();
      completedTests++;
      this.updateProgress((completedTests / totalTests) * 100);
    }
    
    // Testa a sincronização ao reconectar
    if (selectedTests.sync) {
      this.addLogEntry('Iniciando teste de sincronização...', 'info');
      await this.tester.testSynchronization();
      completedTests++;
      this.updateProgress((completedTests / totalTests) * 100);
    }
    
    // Testa o funcionamento dos quizzes offline
    if (selectedTests.quizzes) {
      this.addLogEntry('Iniciando teste de quizzes offline...', 'info');
      await this.tester.testOfflineQuizzes();
      completedTests++;
      this.updateProgress((completedTests / totalTests) * 100);
    }
    
    // Testa a persistência de progresso
    if (selectedTests.progress) {
      this.addLogEntry('Iniciando teste de persistência de progresso...', 'info');
      await this.tester.testProgressPersistence();
      completedTests++;
      this.updateProgress((completedTests / totalTests) * 100);
    }
    
    // Gera o relatório final
    this.tester.generateTestReport();
  }
  
  /**
   * Configura o listener para logs
   */
  setupLogListener() {
    // Limpa o log existente
    this.clearLog();
    
    // Sobrescreve temporariamente o método de log do tester
    const originalLogMethod = this.tester.logMessage.bind(this.tester);
    
    this.tester.logMessage = (message, level = 'info') => {
      // Chama o método original
      originalLogMethod(message, level);
      
      // Adiciona a entrada ao log da UI
      this.addLogEntry(message, level);
    };
  }
  
  /**
   * Exibe os resultados dos testes
   */
  displayResults() {
    const resultsContainer = document.getElementById('test-results');
    if (!resultsContainer) return;
    
    // Obtém o relatório de testes
    const reportJson = localStorage.getItem('offlineTestReport');
    if (!reportJson) {
      resultsContainer.innerHTML = `
        <div class="results-placeholder">
          <p>Nenhum resultado de teste disponível</p>
        </div>
      `;
      return;
    }
    
    const report = JSON.parse(reportJson);
    
    // Cria o HTML para o resumo
    let summaryClass = 'poor';
    if (report.averageScore >= 90) {
      summaryClass = 'excellent';
    } else if (report.averageScore >= 70) {
      summaryClass = 'good';
    } else if (report.averageScore >= 50) {
      summaryClass = 'average';
    }
    
    let html = `
      <div class="summary-container ${summaryClass}">
        <div class="summary-score">${report.average
(Content truncated due to size limit. Use line ranges to read in chunks)