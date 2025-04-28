/**
 * TecnoClass-PWA - Componentes de Acessibilidade
 * 
 * Este arquivo contém componentes e utilitários específicos para melhorar
 * a acessibilidade da aplicação, seguindo as diretrizes WCAG.
 */

class AccessibilityManager {
  constructor() {
    this.initialized = false;
    
    // Inicializa quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }
  
  /**
   * Inicializa o gerenciador de acessibilidade
   */
  init() {
    if (this.initialized) return;
    
    this.addSkipLinks();
    this.enhanceKeyboardNavigation();
    this.setupFocusIndicators();
    this.setupARIALandmarks();
    this.setupAccessibilityMenu();
    
    this.initialized = true;
  }
  
  /**
   * Adiciona links de salto para melhorar navegação por teclado
   */
  addSkipLinks() {
    // Cria o link para pular para o conteúdo principal
    const skipToContent = document.createElement('a');
    skipToContent.id = 'skip-to-content';
    skipToContent.className = 'skip-link';
    skipToContent.href = '#app-content';
    skipToContent.textContent = 'Pular para o conteúdo principal';
    
    // Cria o link para pular para a navegação
    const skipToNav = document.createElement('a');
    skipToNav.id = 'skip-to-nav';
    skipToNav.className = 'skip-link';
    skipToNav.href = '#main-nav';
    skipToNav.textContent = 'Pular para a navegação';
    
    // Adiciona os links ao início do documento
    document.body.insertBefore(skipToNav, document.body.firstChild);
    document.body.insertBefore(skipToContent, document.body.firstChild);
    
    // Adiciona ID aos elementos alvo se não existirem
    const mainContent = document.querySelector('.app-content');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'app-content';
    }
    
    const mainNav = document.querySelector('.main-nav');
    if (mainNav && !mainNav.id) {
      mainNav.id = 'main-nav';
    }
  }
  
  /**
   * Melhora a navegação por teclado
   */
  enhanceKeyboardNavigation() {
    // Adiciona suporte a atalhos de teclado
    document.addEventListener('keydown', (e) => {
      // Alt + 1: Ir para o conteúdo principal
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        const mainContent = document.getElementById('app-content');
        if (mainContent) {
          mainContent.tabIndex = -1;
          mainContent.focus();
          mainContent.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Alt + 2: Ir para a navegação
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        const mainNav = document.getElementById('main-nav');
        if (mainNav) {
          mainNav.tabIndex = -1;
          mainNav.focus();
          mainNav.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Alt + 3: Ir para o rodapé
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        const footer = document.querySelector('.app-footer');
        if (footer) {
          footer.tabIndex = -1;
          footer.focus();
          footer.scrollIntoView({ behavior: 'smooth' });
        }
      }
      
      // Alt + 0: Abrir menu de acessibilidade
      if (e.altKey && e.key === '0') {
        e.preventDefault();
        this.toggleAccessibilityMenu();
      }
    });
    
    // Melhora a navegação por Tab em elementos interativos
    const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    interactiveElements.forEach(element => {
      // Garante que elementos desabilitados não sejam focáveis
      if (element.hasAttribute('disabled')) {
        element.setAttribute('tabindex', '-1');
      }
      
      // Adiciona feedback visual ao focar
      element.addEventListener('focus', () => {
        element.classList.add('keyboard-focus');
      });
      
      element.addEventListener('blur', () => {
        element.classList.remove('keyboard-focus');
      });
    });
  }
  
  /**
   * Configura indicadores de foco visíveis
   */
  setupFocusIndicators() {
    // Adiciona estilos para indicadores de foco
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-focus {
        outline: 3px solid var(--accent-color) !important;
        outline-offset: 2px !important;
      }
      
      /* Esconde os skip links até que sejam focados */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--accent-color);
        color: white;
        padding: 8px 16px;
        z-index: 1000;
        transition: top 0.3s;
        text-decoration: none;
      }
      
      .skip-link:focus {
        top: 0;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * Configura landmarks ARIA para melhorar a navegação por leitores de tela
   */
  setupARIALandmarks() {
    // Adiciona roles ARIA aos elementos principais
    const header = document.querySelector('.app-header');
    if (header && !header.hasAttribute('role')) {
      header.setAttribute('role', 'banner');
    }
    
    const mainNav = document.querySelector('.main-nav');
    if (mainNav && !mainNav.hasAttribute('role')) {
      mainNav.setAttribute('role', 'navigation');
    }
    
    const mainContent = document.querySelector('.app-content');
    if (mainContent && !mainContent.hasAttribute('role')) {
      mainContent.setAttribute('role', 'main');
    }
    
    const footer = document.querySelector('.app-footer');
    if (footer && !footer.hasAttribute('role')) {
      footer.setAttribute('role', 'contentinfo');
    }
    
    // Adiciona labels para landmarks
    if (mainNav) {
      mainNav.setAttribute('aria-label', 'Navegação principal');
    }
    
    // Adiciona roles para seções específicas
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      if (!section.hasAttribute('role')) {
        section.setAttribute('role', 'region');
      }
      
      // Adiciona aria-labelledby se houver um cabeçalho
      const heading = section.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading && !section.hasAttribute('aria-labelledby')) {
        if (!heading.id) {
          heading.id = `heading-${Math.random().toString(36).substring(2, 9)}`;
        }
        section.setAttribute('aria-labelledby', heading.id);
      }
    });
  }
  
  /**
   * Configura o menu de acessibilidade
   */
  setupAccessibilityMenu() {
    // Cria o botão do menu de acessibilidade
    const accessibilityButton = document.createElement('button');
    accessibilityButton.id = 'accessibility-button';
    accessibilityButton.className = 'accessibility-button';
    accessibilityButton.setAttribute('aria-label', 'Opções de acessibilidade');
    accessibilityButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v4"></path>
        <path d="M12 16h.01"></path>
      </svg>
    `;
    
    // Cria o menu de acessibilidade
    const accessibilityMenu = document.createElement('div');
    accessibilityMenu.id = 'accessibility-menu';
    accessibilityMenu.className = 'accessibility-menu';
    accessibilityMenu.setAttribute('role', 'dialog');
    accessibilityMenu.setAttribute('aria-labelledby', 'accessibility-title');
    accessibilityMenu.innerHTML = `
      <div class="accessibility-menu-content">
        <h3 id="accessibility-title">Opções de Acessibilidade</h3>
        
        <div class="accessibility-option">
          <label for="font-size">Tamanho da fonte:</label>
          <select id="font-size">
            <option value="small">Pequeno</option>
            <option value="medium" selected>Médio</option>
            <option value="large">Grande</option>
            <option value="x-large">Extra grande</option>
          </select>
        </div>
        
        <div class="accessibility-option">
          <label for="contrast">Contraste:</label>
          <select id="contrast">
            <option value="normal" selected>Normal</option>
            <option value="high">Alto contraste</option>
          </select>
        </div>
        
        <div class="accessibility-option">
          <label for="reduce-motion">
            <input type="checkbox" id="reduce-motion">
            Reduzir animações
          </label>
        </div>
        
        <div class="accessibility-option">
          <label for="dyslexic-font">
            <input type="checkbox" id="dyslexic-font">
            Fonte para dislexia
          </label>
        </div>
        
        <button id="close-accessibility-menu" class="btn btn-secondary">Fechar</button>
      </div>
    `;
    
    // Adiciona os elementos ao DOM
    document.body.appendChild(accessibilityButton);
    document.body.appendChild(accessibilityMenu);
    
    // Adiciona eventos
    accessibilityButton.addEventListener('click', () => {
      this.toggleAccessibilityMenu();
    });
    
    const closeButton = document.getElementById('close-accessibility-menu');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        this.toggleAccessibilityMenu(false);
      });
    }
    
    // Configura as opções de acessibilidade
    this.setupAccessibilityOptions();
  }
  
  /**
   * Alterna a visibilidade do menu de acessibilidade
   * @param {boolean} [show] - Se deve mostrar ou esconder o menu
   */
  toggleAccessibilityMenu(show) {
    const menu = document.getElementById('accessibility-menu');
    if (!menu) return;
    
    const isVisible = menu.classList.contains('visible');
    
    if (show === undefined) {
      show = !isVisible;
    }
    
    if (show) {
      menu.classList.add('visible');
      
      // Foca no primeiro elemento interativo
      const firstInteractive = menu.querySelector('button, select, input');
      if (firstInteractive) {
        firstInteractive.focus();
      }
    } else {
      menu.classList.remove('visible');
      
      // Retorna o foco ao botão de acessibilidade
      const accessibilityButton = document.getElementById('accessibility-button');
      if (accessibilityButton) {
        accessibilityButton.focus();
      }
    }
  }
  
  /**
   * Configura as opções de acessibilidade
   */
  setupAccessibilityOptions() {
    // Carrega configurações salvas
    const savedSettings = JSON.parse(localStorage.getItem('accessibilitySettings') || '{}');
    
    // Tamanho da fonte
    const fontSizeSelect = document.getElementById('font-size');
    if (fontSizeSelect) {
      // Define o valor salvo
      if (savedSettings.fontSize) {
        fontSizeSelect.value = savedSettings.fontSize;
        this.setFontSize(savedSettings.fontSize);
      }
      
      // Adiciona evento de mudança
      fontSizeSelect.addEventListener('change', () => {
        const fontSize = fontSizeSelect.value;
        this.setFontSize(fontSize);
        
        // Salva a configuração
        savedSettings.fontSize = fontSize;
        localStorage.setItem('accessibilitySettings', JSON.stringify(savedSettings));
      });
    }
    
    // Contraste
    const contrastSelect = document.getElementById('contrast');
    if (contrastSelect) {
      // Define o valor salvo
      if (savedSettings.contrast) {
        contrastSelect.value = savedSettings.contrast;
        this.setContrast(savedSettings.contrast);
      }
      
      // Adiciona evento de mudança
      contrastSelect.addEventListener('change', () => {
        const contrast = contrastSelect.value;
        this.setContrast(contrast);
        
        // Salva a configuração
        savedSettings.contrast = contrast;
        localStorage.setItem('accessibilitySettings', JSON.stringify(savedSettings));
      });
    }
    
    // Reduzir animações
    const reduceMotionCheckbox = document.getElementById('reduce-motion');
    if (reduceMotionCheckbox) {
      // Define o valor salvo
      if (savedSettings.reduceMotion !== undefined) {
        reduceMotionCheckbox.checked = savedSettings.reduceMotion;
        this.setReduceMotion(savedSettings.reduceMotion);
      }
      
      // Adiciona evento de mudança
      reduceMotionCheckbox.addEventListener('change', () => {
        const reduceMotion = reduceMotionCheckbox.checked;
        this.setReduceMotion(reduceMotion);
        
        // Salva a configuração
        savedSettings.reduceMotion = reduceMotion;
        localStorage.setItem('accessibilitySettings', JSON.stringify(savedSettings));
      });
    }
    
    // Fonte para dislexia
    const dyslexicFontCheckbox = document.getElementById('dyslexic-font');
    if (dyslexicFontCheckbox) {
      // Define o valor salvo
      if (savedSettings.dyslexicFont !== undefined) {
        dyslexicFontCheckbox.checked = savedSettings.dyslexicFont;
        this.setDyslexicFont(savedSettings.dyslexicFont);
      }
      
      // Adiciona evento de mudança
      dyslexicFontCheckbox.addEventListener('change', () => {
        const dyslexicFont = dyslexicFontCheckbox.checked;
        this.setDyslexicFont(dyslexicFont);
        
        // Salva a configuração
        savedSettings.dyslexicFont = dyslexicFont;
        localStorage.setItem('accessibilitySettings', JSON.stringify(savedSettings));
      });
    }
  }
  
  /**
   * Define o tamanho da fonte
   * @param {string} size - Tamanho da fonte (small, medium, large, x-large)
   */
  setFontSize(size) {
    const htmlElement = document.documentElement;
    
    // Remove classes existentes
    htmlElement.classList.remove('font-small', 'font-medium', 'font-large', 'font-x-large');
    
    // Adiciona a classe correspondente
    htmlElement.classList.add(`font-${size}`);
  }
  
  /**
   * Define o contraste
   * @param {string} contrast - Tipo de contraste (normal, high)
   */
  setContrast(contrast) {
    const htmlElement = document.documentElement;
    
    if (contrast === 'high') {
      htmlElement.classList.add('high-contrast');
    } else {
      htmlElement.classList.remove('high-contrast');
    }
  }
  
  /**
   * Define a redução de animações
   * @param {boolean} reduce - Se deve reduzir animações
   */
  setReduceMotion(reduce) {
    const htmlElement = document.documentElement;
    
    if (reduce) {
      htmlElement.classList.add('reduce-motion');
    } else {
      htmlElement.classList.remove('reduce-motion');
    }
  }
  
  /**
   * Define a fonte para dislexia
   * @param {boolean} enable - Se deve habilitar a fonte para dislexia
   */
  setDyslexicFont(enable) {
    const htmlElement = document.documentElement;
    
    if (enable) {
      htmlElement.classList.add('dyslexic-font');
    } else {
      htmlElement.classList.remove('dyslexic-font');
    }
  }
}

// Exporta o gerenciador de acessibilidade
window.accessibilityManager = new AccessibilityManager();
