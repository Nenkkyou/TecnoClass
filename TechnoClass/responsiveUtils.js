/**
 * TecnoClass-PWA - Utilitários de Responsividade
 * 
 * Este arquivo contém utilitários para garantir que a aplicação
 * seja responsiva em diferentes tamanhos de tela e dispositivos.
 */

class ResponsiveUtils {
  constructor() {
    this.breakpoints = {
      xs: 0,      // Extra small devices (phones)
      sm: 576,    // Small devices (landscape phones)
      md: 768,    // Medium devices (tablets)
      lg: 992,    // Large devices (desktops)
      xl: 1200,   // Extra large devices (large desktops)
      xxl: 1400   // Extra extra large devices
    };
    
    this.currentBreakpoint = this.getCurrentBreakpoint();
    
    // Inicializa quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }
  
  /**
   * Inicializa os utilitários responsivos
   */
  init() {
    this.setupResizeListener();
    this.setupTouchSupport();
    this.setupOrientationChange();
    this.setupViewportHeight();
    this.setupLazyLoading();
  }
  
  /**
   * Configura o listener de redimensionamento
   */
  setupResizeListener() {
    // Usa debounce para evitar muitas chamadas durante o redimensionamento
    let resizeTimer;
    
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const newBreakpoint = this.getCurrentBreakpoint();
        
        // Dispara evento apenas se o breakpoint mudou
        if (newBreakpoint !== this.currentBreakpoint) {
          this.currentBreakpoint = newBreakpoint;
          this.triggerBreakpointChange(newBreakpoint);
        }
        
        // Atualiza altura do viewport para dispositivos móveis
        this.updateViewportHeight();
      }, 250);
    });
  }
  
  /**
   * Configura suporte a touch
   */
  setupTouchSupport() {
    // Detecta se o dispositivo suporta touch
    const isTouchDevice = 'ontouchstart' in window || 
                          navigator.maxTouchPoints > 0 || 
                          navigator.msMaxTouchPoints > 0;
    
    // Adiciona classe ao HTML para estilização específica
    if (isTouchDevice) {
      document.documentElement.classList.add('touch-device');
    } else {
      document.documentElement.classList.add('no-touch');
    }
  }
  
  /**
   * Configura detecção de mudança de orientação
   */
  setupOrientationChange() {
    window.addEventListener('orientationchange', () => {
      // Atualiza classes no HTML
      this.updateOrientationClass();
      
      // Atualiza altura do viewport
      setTimeout(() => {
        this.updateViewportHeight();
      }, 200);
    });
    
    // Configura inicialmente
    this.updateOrientationClass();
  }
  
  /**
   * Atualiza a classe de orientação no HTML
   */
  updateOrientationClass() {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    
    if (isPortrait) {
      document.documentElement.classList.add('portrait');
      document.documentElement.classList.remove('landscape');
    } else {
      document.documentElement.classList.add('landscape');
      document.documentElement.classList.remove('portrait');
    }
  }
  
  /**
   * Configura a altura do viewport para dispositivos móveis
   */
  setupViewportHeight() {
    // Resolve o problema da altura do viewport em dispositivos móveis
    this.updateViewportHeight();
    
    // Atualiza em eventos que podem mudar a altura da UI do navegador
    window.addEventListener('load', () => this.updateViewportHeight());
    window.addEventListener('orientationchange', () => this.updateViewportHeight());
  }
  
  /**
   * Atualiza a variável CSS de altura do viewport
   */
  updateViewportHeight() {
    // Define uma variável CSS com a altura real da viewport
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  /**
   * Configura carregamento lazy de imagens
   */
  setupLazyLoading() {
    // Verifica se o navegador suporta lazy loading nativo
    if ('loading' in HTMLImageElement.prototype) {
      // Adiciona atributo loading="lazy" a todas as imagens
      document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
      });
    } else {
      // Implementa lazy loading via Intersection Observer para navegadores antigos
      this.setupIntersectionObserver();
    }
  }
  
  /**
   * Configura Intersection Observer para lazy loading
   */
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  }
  
  /**
   * Obtém o breakpoint atual com base na largura da janela
   * @returns {string} Nome do breakpoint atual (xs, sm, md, lg, xl, xxl)
   */
  getCurrentBreakpoint() {
    const width = window.innerWidth;
    
    if (width < this.breakpoints.sm) return 'xs';
    if (width < this.breakpoints.md) return 'sm';
    if (width < this.breakpoints.lg) return 'md';
    if (width < this.breakpoints.xl) return 'lg';
    if (width < this.breakpoints.xxl) return 'xl';
    return 'xxl';
  }
  
  /**
   * Dispara um evento personalizado quando o breakpoint muda
   * @param {string} breakpoint - Novo breakpoint
   */
  triggerBreakpointChange(breakpoint) {
    const event = new CustomEvent('breakpointChange', {
      detail: { breakpoint }
    });
    
    document.dispatchEvent(event);
  }
  
  /**
   * Verifica se a largura atual está em um breakpoint específico
   * @param {string} breakpoint - Breakpoint a verificar (xs, sm, md, lg, xl, xxl)
   * @returns {boolean} Verdadeiro se estiver no breakpoint especificado
   */
  isBreakpoint(breakpoint) {
    return this.currentBreakpoint === breakpoint;
  }
  
  /**
   * Verifica se a largura atual é menor que um breakpoint específico
   * @param {string} breakpoint - Breakpoint a verificar (sm, md, lg, xl, xxl)
   * @returns {boolean} Verdadeiro se for menor que o breakpoint
   */
  isLessThan(breakpoint) {
    const width = window.innerWidth;
    return width < this.breakpoints[breakpoint];
  }
  
  /**
   * Verifica se a largura atual é maior que um breakpoint específico
   * @param {string} breakpoint - Breakpoint a verificar (xs, sm, md, lg, xl)
   * @returns {boolean} Verdadeiro se for maior que o breakpoint
   */
  isGreaterThan(breakpoint) {
    const width = window.innerWidth;
    const breakpointValues = Object.values(this.breakpoints);
    const breakpointIndex = Object.keys(this.breakpoints).indexOf(breakpoint);
    
    if (breakpointIndex >= 0 && breakpointIndex < breakpointValues.length - 1) {
      return width >= breakpointValues[breakpointIndex + 1];
    }
    
    return false;
  }
  
  /**
   * Executa uma função quando a largura da janela atinge um breakpoint específico
   * @param {string} breakpoint - Breakpoint alvo (xs, sm, md, lg, xl, xxl)
   * @param {Function} callback - Função a ser executada
   */
  onBreakpoint(breakpoint, callback) {
    document.addEventListener('breakpointChange', (event) => {
      if (event.detail.breakpoint === breakpoint) {
        callback(event.detail);
      }
    });
  }
  
  /**
   * Adiciona classes responsivas a elementos com base no breakpoint atual
   * @param {string} selector - Seletor CSS para os elementos
   * @param {Object} classMap - Mapa de breakpoints para classes
   */
  addResponsiveClasses(selector, classMap) {
    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;
    
    const updateClasses = () => {
      const currentBreakpoint = this.getCurrentBreakpoint();
      
      elements.forEach(element => {
        // Remove todas as classes possíveis
        Object.values(classMap).forEach(className => {
          if (Array.isArray(className)) {
            className.forEach(cls => element.classList.remove(cls));
          } else {
            element.classList.remove(className);
          }
        });
        
        // Adiciona a classe para o breakpoint atual
        const classesToAdd = classMap[currentBreakpoint];
        if (classesToAdd) {
          if (Array.isArray(classesToAdd)) {
            classesToAdd.forEach(cls => element.classList.add(cls));
          } else {
            element.classList.add(classesToAdd);
          }
        }
      });
    };
    
    // Atualiza inicialmente
    updateClasses();
    
    // Atualiza quando o breakpoint mudar
    document.addEventListener('breakpointChange', updateClasses);
  }
}

// Exporta os utilitários responsivos
window.responsiveUtils = new ResponsiveUtils();
