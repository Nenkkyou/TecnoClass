/**
 * TecnoClass - Interações e Microanimações
 * Este arquivo contém exemplos de interações e microanimações para tornar
 * a interface do TecnoClass mais dinâmica e agradável.
 */

// ===== CONFIGURAÇÕES GLOBAIS =====
// Duração padrão das animações
const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 400
};

// ===== UTILITÁRIOS DE ANIMAÇÃO =====
/**
 * Adiciona uma animação a um elemento e remove após a conclusão
 * @param {HTMLElement} element - Elemento a ser animado
 * @param {string} animationClass - Classe CSS da animação
 * @param {number} duration - Duração da animação em ms
 */
function animateElement(element, animationClass, duration = ANIMATION_DURATION.normal) {
  element.classList.add(animationClass);
  
  setTimeout(() => {
    element.classList.remove(animationClass);
  }, duration);
}

/**
 * Cria um efeito de ondulação (ripple) em elementos clicáveis
 * @param {HTMLElement} element - Elemento que receberá o efeito
 */
function addRippleEffect(element) {
  element.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.classList.add('ripple');
    
    // Remover ripples antigos
    const existingRipple = element.querySelector('.ripple');
    if (existingRipple) {
      existingRipple.remove();
    }
    
    element.appendChild(ripple);
    
    // Remover após a animação
    setTimeout(() => {
      ripple.remove();
    }, 600);
  });
}

// ===== INTERAÇÕES DE NAVEGAÇÃO =====
/**
 * Inicializa as interações do menu de navegação
 */
function initNavInteractions() {
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    // Adicionar efeito de hover
    link.addEventListener('mouseenter', () => {
      animateElement(link, 'nav-link-hover');
    });
    
    // Adicionar efeito de clique
    link.addEventListener('click', (e) => {
      // Remover classe active de todos os links
      navLinks.forEach(l => l.classList.remove('active'));
      
      // Adicionar classe active ao link clicado
      link.classList.add('active');
      
      // Animar o link
      animateElement(link, 'nav-link-click');
      
      // Se estiver em mobile, fechar o menu
      if (window.innerWidth < 768) {
        document.getElementById('navList').classList.remove('active');
        document.getElementById('menuToggle').classList.remove('active');
      }
    });
  });
  
  // Menu hamburguer animado
  const menuToggle = document.getElementById('menuToggle');
  
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    
    // Animar as barras do menu
    const spans = menuToggle.querySelectorAll('span');
    spans.forEach(span => {
      animateElement(span, 'menu-toggle-animation');
    });
  });
}

// ===== INTERAÇÕES DE CARDS =====
/**
 * Inicializa as interações dos cards de curso
 */
function initCardInteractions() {
  const courseCards = document.querySelectorAll('.course-card');
  
  courseCards.forEach(card => {
    // Efeito de elevação ao passar o mouse
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      card.style.boxShadow = 'var(--shadow-lg)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--shadow-md)';
    });
    
    // Efeito de clique
    card.addEventListener('mousedown', () => {
      card.style.transform = 'translateY(-2px)';
    });
    
    card.addEventListener('mouseup', () => {
      card.style.transform = 'translateY(-5px)';
    });
    
    // Adicionar efeito de ripple aos botões dentro dos cards
    const buttons = card.querySelectorAll('.btn');
    buttons.forEach(button => {
      addRippleEffect(button);
    });
  });
}

// ===== INTERAÇÕES DE BOTÕES =====
/**
 * Inicializa as interações dos botões
 */
function initButtonInteractions() {
  const buttons = document.querySelectorAll('.btn');
  
  buttons.forEach(button => {
    // Adicionar efeito de ripple
    addRippleEffect(button);
    
    // Efeito de hover
    button.addEventListener('mouseenter', () => {
      if (button.classList.contains('btn-primary') || button.classList.contains('btn-secondary')) {
        button.style.transform = 'translateY(-2px)';
        button.style.boxShadow = 'var(--shadow-md)';
      }
    });
    
    button.addEventListener('mouseleave', () => {
      if (button.classList.contains('btn-primary') || button.classList.contains('btn-secondary')) {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = 'none';
      }
    });
    
    // Efeito de clique
    button.addEventListener('mousedown', () => {
      button.style.transform = 'translateY(0)';
      animateElement(button, 'btn-click');
    });
    
    button.addEventListener('mouseup', () => {
      if (button.classList.contains('btn-primary') || button.classList.contains('btn-secondary')) {
        button.style.transform = 'translateY(-2px)';
      }
    });
  });
}

// ===== INTERAÇÕES DE FORMULÁRIOS =====
/**
 * Inicializa as interações dos campos de formulário
 */
function initFormInteractions() {
  const formControls = document.querySelectorAll('.form-control');
  
  formControls.forEach(control => {
    // Efeito de foco
    control.addEventListener('focus', () => {
      control.parentElement.classList.add('form-group-focus');
      
      // Animar o label
      const label = control.parentElement.querySelector('.form-label');
      if (label) {
        label.style.color = 'var(--primary-color)';
        label.style.transform = 'translateY(-3px)';
        label.style.fontSize = '0.85rem';
      }
    });
    
    control.addEventListener('blur', () => {
      control.parentElement.classList.remove('form-group-focus');
      
      // Restaurar o label se o campo estiver vazio
      const label = control.parentElement.querySelector('.form-label');
      if (label && !control.value) {
        label.style.color = 'var(--text-primary)';
        label.style.transform = 'translateY(0)';
        label.style.fontSize = '1rem';
      }
    });
  });
}

// ===== ANIMAÇÕES DE PROGRESSO =====
/**
 * Anima as barras de progresso
 */
function animateProgressBars() {
  const progressBars = document.querySelectorAll('.progress-fill');
  
  progressBars.forEach(bar => {
    // Guardar o valor original
    const targetWidth = bar.style.width;
    
    // Resetar para 0
    bar.style.width = '0';
    
    // Animar até o valor original
    setTimeout(() => {
      bar.style.transition = `width ${ANIMATION_DURATION.slow}ms ease-out`;
      bar.style.width = targetWidth;
    }, 300);
  });
}

// ===== INTERAÇÕES DE TEMA =====
/**
 * Inicializa as interações do toggle de tema
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = themeToggle.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    // Animar a transição
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    
    // Aplicar o novo tema
    themeToggle.setAttribute('data-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Animar o toggle
    const thumb = themeToggle.querySelector('.theme-toggle-thumb');
    animateElement(thumb, 'theme-toggle-animation');
    
    // Salvar preferência
    localStorage.setItem('theme', newTheme);
  });
}

// ===== ANIMAÇÕES DE ENTRADA =====
/**
 * Anima os elementos ao carregar a página
 */
function animatePageLoad() {
  // Animar o cabeçalho
  const header = document.querySelector('.header');
  header.style.opacity = '0';
  header.style.transform = 'translateY(-10px)';
  
  setTimeout(() => {
    header.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    header.style.opacity = '1';
    header.style.transform = 'translateY(0)';
  }, 100);
  
  // Animar as seções
  const sections = document.querySelectorAll('section');
  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      section.style.opacity = '1';
      section.style.transform = 'translateY(0)';
    }, 200 + index * 100);
  });
  
  // Animar a barra lateral
  const sidebar = document.querySelector('.sidebar');
  if (window.innerWidth >= 768) {
    sidebar.style.transform = 'translateX(-100%)';
    
    setTimeout(() => {
      sidebar.style.transition = 'transform 0.5s ease';
      sidebar.style.transform = 'translateX(0)';
    }, 300);
  }
  
  // Animar as barras de progresso após tudo carregar
  setTimeout(animateProgressBars, 800);
}

// ===== INICIALIZAÇÃO =====
/**
 * Inicializa todas as interações
 */
function initAllInteractions() {
  // Adicionar estilos CSS para as animações
  addAnimationStyles();
  
  // Inicializar interações
  initNavInteractions();
  initCardInteractions();
  initButtonInteractions();
  initFormInteractions();
  initThemeToggle();
  
  // Animar carregamento da página
  document.addEventListener('DOMContentLoaded', animatePageLoad);
}

/**
 * Adiciona estilos CSS para as animações
 */
function addAnimationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    /* Efeito Ripple */
    .ripple {
      position: absolute;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    }
    
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
    
    /* Animação de clique em botões */
    .btn-click {
      animation: btn-click 0.15s ease;
    }
    
    @keyframes btn-click {
      0% { transform: scale(1); }
      50% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
    
    /* Animação do menu toggle */
    .menu-toggle.active span:nth-child(1) {
      transform: translateY(9px) rotate(45deg);
    }
    
    .menu-toggle.active span:nth-child(2) {
      opacity: 0;
    }
    
    .menu-toggle.active span:nth-child(3) {
      transform: translateY(-9px) rotate(-45deg);
    }
    
    .menu-toggle-animation {
      animation: menu-toggle-animation 0.25s ease;
    }
    
    @keyframes menu-toggle-animation {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    
    /* Animação de hover em links de navegação */
    .nav-link-hover {
      animation: nav-link-hover 0.25s ease;
    }
    
    @keyframes nav-link-hover {
      0% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
      100% { transform: translateY(0); }
    }
    
    /* Animação de clique em links de navegação */
    .nav-link-click {
      animation: nav-link-click 0.25s ease;
    }
    
    @keyframes nav-link-click {
      0% { transform: scale(1); }
      50% { transform: scale(0.95); }
      100% { transform: scale(1); }
    }
    
    /* Animação do toggle de tema */
    .theme-toggle-animation {
      animation: theme-toggle-animation 0.4s ease;
    }
    
    @keyframes theme-toggle-animation {
      0% { transform: scale(1); }
      50% { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    
    /* Animação de foco em campos de formulário */
    .form-group-focus {
      animation: form-group-focus 0.3s ease;
    }
    
    @keyframes form-group-focus {
      0% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
      100% { transform: translateY(0); }
    }
  `;
  
  document.head.appendChild(style);
}

// Inicializar todas as interações quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', initAllInteractions);
