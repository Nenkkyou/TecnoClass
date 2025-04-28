/**
 * TecnoClass-PWA - Componentes de Interface
 * 
 * Este arquivo contém componentes reutilizáveis para a interface do usuário,
 * garantindo consistência visual e comportamental em toda a aplicação.
 */

class UIComponents {
  constructor() {
    // Inicializa componentes quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
      this.initComponents();
    });
  }
  
  /**
   * Inicializa todos os componentes de interface
   */
  initComponents() {
    this.initMenuToggle();
    this.initThemeToggle();
    this.initLanguageSelector();
    this.initTabNavigation();
    this.initAccordions();
    this.initTooltips();
    this.initProgressBars();
    this.initTouchGestures();
    this.initAccessibilityFeatures();
  }
  
  /**
   * Inicializa o botão de alternância do menu móvel
   */
  initMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (!menuToggle || !navList) return;
    
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navList.classList.toggle('active');
      
      // Atualiza atributos ARIA
      const isExpanded = navList.classList.contains('active');
      menuToggle.setAttribute('aria-expanded', isExpanded);
      
      // Bloqueia rolagem do body quando menu está aberto em dispositivos móveis
      document.body.style.overflow = isExpanded ? 'hidden' : '';
    });
    
    // Fecha o menu ao clicar em um link
    navList.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navList.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', false);
        document.body.style.overflow = '';
      });
    });
  }
  
  /**
   * Inicializa o botão de alternância de tema (claro/escuro)
   */
  initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;
    
    // Verifica tema atual
    const currentTheme = localStorage.getItem('theme') || 'auto';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'auto';
      let newTheme;
      
      // Alterna entre os temas
      if (currentTheme === 'auto' || currentTheme === 'light') {
        newTheme = 'dark';
      } else {
        newTheme = 'light';
      }
      
      // Aplica o novo tema
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      
      // Atualiza o texto do botão para leitores de tela
      themeToggle.setAttribute('aria-label', 
        newTheme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro');
    });
  }
  
  /**
   * Inicializa o seletor de idioma
   */
  initLanguageSelector() {
    const languageSelect = document.getElementById('language-select');
    if (!languageSelect) return;
    
    // Define o idioma atual
    const currentLang = localStorage.getItem('language') || 'pt-BR';
    languageSelect.value = currentLang;
    
    languageSelect.addEventListener('change', () => {
      const newLang = languageSelect.value;
      localStorage.setItem('language', newLang);
      
      // Se houver um serviço de tradução, atualiza os textos
      if (window.i18n) {
        window.i18n.setLanguage(newLang);
      }
    });
  }
  
  /**
   * Inicializa a navegação por abas
   */
  initTabNavigation() {
    const tabButtons = document.querySelectorAll('[data-tab-target]');
    if (tabButtons.length === 0) return;
    
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-tab-target');
        const targetTab = document.getElementById(targetId);
        
        if (!targetTab) return;
        
        // Remove classe ativa de todas as abas e botões
        document.querySelectorAll('.tab').forEach(tab => {
          tab.classList.remove('visible');
        });
        
        tabButtons.forEach(btn => {
          btn.classList.remove('active');
          btn.setAttribute('aria-selected', 'false');
        });
        
        // Ativa a aba selecionada
        targetTab.classList.add('visible');
        button.classList.add('active');
        button.setAttribute('aria-selected', 'true');
        
        // Atualiza o histórico do navegador se necessário
        if (button.hasAttribute('data-update-history')) {
          const historyPath = button.getAttribute('data-history-path') || targetId;
          history.pushState(null, document.title, historyPath);
        }
      });
    });
    
    // Ativa a primeira aba por padrão se nenhuma estiver ativa
    if (!document.querySelector('.tab.visible')) {
      const firstButton = tabButtons[0];
      if (firstButton) {
        firstButton.click();
      }
    }
  }
  
  /**
   * Inicializa acordeões (elementos expansíveis)
   */
  initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders.length === 0) return;
    
    accordionHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const accordion = header.parentElement;
        const content = header.nextElementSibling;
        
        if (!accordion || !content) return;
        
        // Alterna o estado do acordeão
        const isExpanded = accordion.classList.toggle('expanded');
        
        // Atualiza atributos ARIA
        header.setAttribute('aria-expanded', isExpanded);
        
        // Anima a altura do conteúdo
        if (isExpanded) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0';
        }
      });
    });
  }
  
  /**
   * Inicializa tooltips (dicas de ferramentas)
   */
  initTooltips() {
    const tooltipTriggers = document.querySelectorAll('[data-tooltip]');
    if (tooltipTriggers.length === 0) return;
    
    tooltipTriggers.forEach(trigger => {
      const tooltipText = trigger.getAttribute('data-tooltip');
      if (!tooltipText) return;
      
      // Cria o elemento tooltip
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = tooltipText;
      tooltip.setAttribute('role', 'tooltip');
      tooltip.setAttribute('id', `tooltip-${Math.random().toString(36).substr(2, 9)}`);
      
      // Adiciona o tooltip ao DOM
      document.body.appendChild(tooltip);
      
      // Conecta o tooltip ao elemento trigger via ARIA
      trigger.setAttribute('aria-describedby', tooltip.id);
      
      // Mostra o tooltip ao passar o mouse
      trigger.addEventListener('mouseenter', () => {
        const rect = trigger.getBoundingClientRect();
        tooltip.classList.add('visible');
        
        // Posiciona o tooltip acima do elemento
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
      });
      
      // Esconde o tooltip ao remover o mouse
      trigger.addEventListener('mouseleave', () => {
        tooltip.classList.remove('visible');
      });
      
      // Suporte a foco para acessibilidade
      trigger.addEventListener('focus', () => {
        const rect = trigger.getBoundingClientRect();
        tooltip.classList.add('visible');
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
      });
      
      trigger.addEventListener('blur', () => {
        tooltip.classList.remove('visible');
      });
    });
  }
  
  /**
   * Inicializa barras de progresso
   */
  initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    if (progressBars.length === 0) return;
    
    progressBars.forEach(bar => {
      const indicator = bar.querySelector('.progress-indicator');
      const valueAttr = bar.getAttribute('data-progress');
      
      if (indicator && valueAttr) {
        const value = parseInt(valueAttr, 10);
        indicator.style.width = `${value}%`;
        
        // Adiciona atributos ARIA para acessibilidade
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-valuenow', value);
        bar.setAttribute('aria-valuemin', 0);
        bar.setAttribute('aria-valuemax', 100);
      }
    });
  }
  
  /**
   * Inicializa suporte a gestos touch
   */
  initTouchGestures() {
    // Implementa suporte a swipe para navegação
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    document.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
    
    const handleSwipe = () => {
      const swipeThreshold = 100; // Mínimo de pixels para considerar um swipe
      
      // Swipe da esquerda para direita (voltar)
      if (touchEndX - touchStartX > swipeThreshold) {
        // Se estiver em uma página interna, volta para a anterior
        if (window.location.pathname !== '/' && window.history.length > 1) {
          window.history.back();
        }
      }
      
      // Swipe da direita para esquerda (avançar)
      if (touchStartX - touchEndX > swipeThreshold) {
        // Implementação específica para avançar, se necessário
        // Por exemplo, ir para a próxima lição em um curso
        const nextButton = document.querySelector('.next-button');
        if (nextButton) {
          nextButton.click();
        }
      }
    };
  }
  
  /**
   * Inicializa recursos de acessibilidade
   */
  initAccessibilityFeatures() {
    // Adiciona atributos ARIA aos elementos de navegação
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      if (link.getAttribute('href') === window.location.pathname) {
        link.setAttribute('aria-current', 'page');
      }
    });
    
    // Adiciona suporte a navegação por teclado
    document.addEventListener('keydown', e => {
      // Atalho Alt+1 para ir para o conteúdo principal
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        const mainContent = document.getElementById('app-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView();
        }
      }
      
      // Atalho Alt+2 para ir para o menu de navegação
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        const nav = document.querySelector('.main-nav');
        if (nav) {
          nav.focus();
          nav.scrollIntoView();
        }
      }
      
      // Atalho Esc para fechar modais e menus
      if (e.key === 'Escape') {
        const activeMenu = document.querySelector('.nav-list.active');
        if (activeMenu) {
          const menuToggle = document.getElementById('menu-toggle');
          if (menuToggle) {
            menuToggle.click();
          }
        }
        
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
          const closeButton = modal.querySelector('.close-button');
          if (closeButton) {
            closeButton.click();
          }
        });
      }
    });
    
    // Adiciona skip links para acessibilidade
    const addSkipLink = () => {
      if (document.getElementById('skip-link')) return;
      
      const skipLink = document.createElement('a');
      skipLink.id = 'skip-link';
      skipLink.className = 'skip-link';
      skipLink.href = '#app-content';
      skipLink.textContent = 'Pular para o conteúdo principal';
      
      skipLink.addEventListener('focus', () => {
        skipLink.classList.add('visible');
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.classList.remove('visible');
      });
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    };
    
    addSkipLink();
  }
  
  /**
   * Cria um modal dinamicamente
   * @param {Object} options - Opções do modal
   * @returns {HTMLElement} Elemento do modal
   */
  createModal(options = {}) {
    const {
      title = 'Modal',
      content = '',
      closable = true,
      onClose = null,
      size = 'medium' // small, medium, large
    } = options;
    
    // Cria o elemento do modal
    const modal = document.createElement('div');
    modal.className = `modal ${size}`;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', `modal-title-${Date.now()}`);
    
    // Cria o conteúdo do modal
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-container">
        <div class="modal-header">
          <h3 id="modal-title-${Date.now()}" class="modal-title">${title}</h3>
          ${closable ? '<button class="close-button" aria-label="Fechar">&times;</button>' : ''}
        </div>
        <div class="modal-content">
          ${content}
        </div>
      </div>
    `;
    
    // Adiciona o modal ao DOM
    document.body.appendChild(modal);
    
    // Adiciona eventos
    if (closable) {
      const closeButton = modal.querySelector('.close-button');
      const overlay = modal.querySelector('.modal-overlay');
      
      const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Remove o modal do DOM após a animação
        setTimeout(() => {
          modal.remove();
          if (typeof onClose === 'function') {
            onClose();
          }
        }, 300);
      };
      
      closeButton.addEventListener('click', closeModal);
      overlay.addEventListener('click', closeModal);
      
      // Fecha o modal com a tecla Esc
      modal.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          closeModal();
        }
      });
    }
    
    // Ativa o modal
    setTimeout(() => {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      
      // Foca no primeiro elemento focável
      const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }, 10);
    
    return modal;
  }
  
  /**
   * Cria um toast (notificação temporária)
   * @param {Object} options - Opções do toast
   */
  showToast(options = {}) {
    const {
      message = '',
      type = 'info', // info, success, warning, error
      duration = 3000
    } = options;
    
    // Cria o elemento toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.setAttribute('role', 'alert');
    toast.textContent = message;
    
    // Adiciona o toast ao DOM
    const toastContainer = document.querySelector('.toast-container') || (() => {
      const container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
      return container;
    })();
    
    toastContainer.appendChild(toast);
    
    // Anima o toast
    setTimeout(() => {
      toast.classList.add('visible');
    }, 10);
    
    // Remove o toast após a duração especificada
    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => {
        toast.remove();
        
        // Remove o container se não houver mais toasts
        if (toastContainer.children.length === 0) {
          toastContainer.remove();
        }
      }, 300);
    }, duration);
  }
}

// Exporta os componentes de UI
(Content truncated due to size limit. Use line ranges to read in chunks)