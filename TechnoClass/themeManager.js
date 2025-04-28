/**
 * TecnoClass-PWA - Gerenciador de Tema
 * 
 * Este arquivo implementa o gerenciador de tema para a aplicação,
 * permitindo alternar entre os modos claro e escuro.
 */

class ThemeManager {
  constructor() {
    this.themes = {
      light: 'light',
      dark: 'dark',
      auto: 'auto'
    };
    
    this.currentTheme = this.getInitialTheme();
    
    // Inicializa quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }
  
  /**
   * Inicializa o gerenciador de tema
   */
  init() {
    this.applyTheme(this.currentTheme);
    this.setupThemeToggle();
    this.setupMediaQueryListener();
    this.setupThemeTransitions();
  }
  
  /**
   * Obtém o tema inicial com base na preferência salva ou do sistema
   * @returns {string} Tema inicial (light, dark, auto)
   */
  getInitialTheme() {
    // Verifica se há uma preferência salva
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme && Object.values(this.themes).includes(savedTheme)) {
      return savedTheme;
    }
    
    // Se não houver preferência salva, usa 'auto' (baseado na preferência do sistema)
    return this.themes.auto;
  }
  
  /**
   * Aplica o tema especificado
   * @param {string} theme - Tema a ser aplicado (light, dark, auto)
   */
  applyTheme(theme) {
    // Salva o tema atual
    this.currentTheme = theme;
    localStorage.setItem('theme', theme);
    
    // Remove atributos de tema existentes
    document.documentElement.removeAttribute('data-theme');
    
    if (theme === this.themes.auto) {
      // No modo auto, verifica a preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? this.themes.dark : this.themes.light);
    } else {
      // Aplica o tema especificado
      document.documentElement.setAttribute('data-theme', theme);
    }
    
    // Atualiza a meta tag theme-color para corresponder ao tema
    this.updateThemeColor();
    
    // Dispara evento de mudança de tema
    this.dispatchThemeChangeEvent();
  }
  
  /**
   * Configura o botão de alternância de tema
   */
  setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Atualiza o ícone do botão para refletir o tema atual
    this.updateThemeToggleIcon(themeToggle);
    
    // Adiciona evento de clique
    themeToggle.addEventListener('click', () => {
      // Alterna entre os temas
      let newTheme;
      
      if (this.currentTheme === this.themes.light) {
        newTheme = this.themes.dark;
      } else if (this.currentTheme === this.themes.dark) {
        newTheme = this.themes.auto;
      } else {
        newTheme = this.themes.light;
      }
      
      // Aplica o novo tema
      this.applyTheme(newTheme);
      
      // Atualiza o ícone do botão
      this.updateThemeToggleIcon(themeToggle);
    });
  }
  
  /**
   * Atualiza o ícone do botão de alternância de tema
   * @param {HTMLElement} button - Botão de alternância de tema
   */
  updateThemeToggleIcon(button) {
    const themeIcon = button.querySelector('.theme-icon');
    if (!themeIcon) return;
    
    // Remove classes existentes
    themeIcon.classList.remove('icon-light', 'icon-dark', 'icon-auto');
    
    // Adiciona a classe correspondente ao tema atual
    themeIcon.classList.add(`icon-${this.currentTheme}`);
    
    // Atualiza o texto para leitores de tela
    let ariaLabel;
    
    switch (this.currentTheme) {
      case this.themes.light:
        ariaLabel = 'Mudar para tema escuro';
        break;
      case this.themes.dark:
        ariaLabel = 'Mudar para tema automático';
        break;
      case this.themes.auto:
        ariaLabel = 'Mudar para tema claro';
        break;
    }
    
    button.setAttribute('aria-label', ariaLabel);
  }
  
  /**
   * Configura o listener para mudanças na preferência de tema do sistema
   */
  setupMediaQueryListener() {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Listener para mudanças na preferência do sistema
    const handleMediaQueryChange = (e) => {
      // Só atualiza se o tema atual for 'auto'
      if (this.currentTheme === this.themes.auto) {
        document.documentElement.setAttribute('data-theme', e.matches ? this.themes.dark : this.themes.light);
        this.updateThemeColor();
        this.dispatchThemeChangeEvent();
      }
    };
    
    // Adiciona o listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaQueryChange);
    } else {
      // Fallback para navegadores antigos
      mediaQuery.addListener(handleMediaQueryChange);
    }
  }
  
  /**
   * Configura transições suaves ao mudar de tema
   */
  setupThemeTransitions() {
    // Adiciona classe para transições após o carregamento inicial
    // Isso evita transições indesejadas durante o carregamento da página
    window.addEventListener('load', () => {
      document.body.classList.add('theme-transitions-enabled');
    });
  }
  
  /**
   * Atualiza a meta tag theme-color para corresponder ao tema atual
   */
  updateThemeColor() {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === this.themes.dark;
    
    // Define a cor do tema com base no tema atual
    metaThemeColor.setAttribute('content', isDark ? '#1e272e' : '#1abc9c');
  }
  
  /**
   * Dispara um evento personalizado quando o tema muda
   */
  dispatchThemeChangeEvent() {
    const event = new CustomEvent('themeChange', {
      detail: {
        theme: this.currentTheme,
        effectiveTheme: document.documentElement.getAttribute('data-theme')
      }
    });
    
    document.dispatchEvent(event);
  }
  
  /**
   * Obtém o tema atual
   * @returns {string} Tema atual (light, dark, auto)
   */
  getCurrentTheme() {
    return this.currentTheme;
  }
  
  /**
   * Obtém o tema efetivo (o que está realmente sendo aplicado)
   * @returns {string} Tema efetivo (light ou dark)
   */
  getEffectiveTheme() {
    return document.documentElement.getAttribute('data-theme');
  }
  
  /**
   * Verifica se o tema escuro está ativo
   * @returns {boolean} Verdadeiro se o tema escuro estiver ativo
   */
  isDarkThemeActive() {
    return this.getEffectiveTheme() === this.themes.dark;
  }
}

// Exporta o gerenciador de tema
window.themeManager = new ThemeManager();
