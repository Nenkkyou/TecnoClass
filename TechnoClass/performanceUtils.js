/**
 * TecnoClass-PWA - Utilitários de Otimização de Performance
 * 
 * Este arquivo implementa utilitários para otimizar a performance da aplicação.
 */

class PerformanceUtils {
  constructor() {
    this.resourceHints = {
      preloaded: new Set(),
      prefetched: new Set(),
      preconnected: new Set()
    };
    
    // Inicializa quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', () => {
      this.init();
    });
  }
  
  /**
   * Inicializa os utilitários de performance
   */
  init() {
    this.setupPerformanceMonitoring();
    this.optimizeImages();
    this.setupLazyLoading();
  }
  
  /**
   * Configura o monitoramento de performance
   */
  setupPerformanceMonitoring() {
    // Monitora métricas de performance
    if ('performance' in window && 'PerformanceObserver' in window) {
      // Observa métricas de carregamento
      const loadObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          // Registra métricas importantes
          if (entry.entryType === 'navigation') {
            console.log('Tempo de carregamento da página:', entry.loadEventEnd - entry.startTime, 'ms');
            console.log('Tempo de resposta do servidor:', entry.responseEnd - entry.requestStart, 'ms');
            console.log('Tempo de renderização:', entry.domComplete - entry.domInteractive, 'ms');
          }
        }
      });
      
      loadObserver.observe({ entryTypes: ['navigation'] });
      
      // Observa métricas de layout
      const layoutObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.value > 0.1) {
            console.warn('Layout shift detectado:', entry.value);
          }
        }
      });
      
      layoutObserver.observe({ entryTypes: ['layout-shift'] });
      
      // Observa métricas de pintura
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`${entry.name}:`, entry.startTime, 'ms');
        }
      });
      
      paintObserver.observe({ entryTypes: ['paint'] });
    }
  }
  
  /**
   * Otimiza imagens na página
   */
  optimizeImages() {
    // Adiciona atributos de tamanho a todas as imagens
    document.querySelectorAll('img:not([width]):not([height])').forEach(img => {
      // Quando a imagem carregar, define seus atributos de tamanho
      img.addEventListener('load', () => {
        if (!img.hasAttribute('width')) {
          img.setAttribute('width', img.naturalWidth);
        }
        if (!img.hasAttribute('height')) {
          img.setAttribute('height', img.naturalHeight);
        }
      });
    });
    
    // Adiciona loading="lazy" a imagens abaixo da dobra
    document.querySelectorAll('img:not([loading])').forEach(img => {
      // Verifica se a imagem está abaixo da dobra
      const rect = img.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }
  
  /**
   * Configura o carregamento lazy de recursos
   */
  setupLazyLoading() {
    // Implementa lazy loading para iframes
    document.querySelectorAll('iframe:not([loading])').forEach(iframe => {
      iframe.setAttribute('loading', 'lazy');
    });
    
    // Implementa lazy loading para scripts não críticos
    document.querySelectorAll('script[data-lazy]').forEach(script => {
      script.setAttribute('defer', '');
    });
    
    // Implementa lazy loading para conteúdo via Intersection Observer
    if ('IntersectionObserver' in window) {
      const lazyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const element = entry.target;
            
            // Carrega o conteúdo com base no tipo de elemento
            if (element.tagName === 'IMG' && element.dataset.src) {
              element.src = element.dataset.src;
              if (element.dataset.srcset) {
                element.srcset = element.dataset.srcset;
              }
            } else if (element.tagName === 'IFRAME' && element.dataset.src) {
              element.src = element.dataset.src;
            } else if (element.classList.contains('lazy-background') && element.dataset.background) {
              element.style.backgroundImage = `url('${element.dataset.background}')`;
            } else if (element.classList.contains('lazy-content') && element.dataset.content) {
              this.loadLazyContent(element, element.dataset.content);
            }
            
            // Remove o elemento da observação
            observer.unobserve(element);
          }
        });
      }, {
        rootMargin: '200px 0px' // Carrega quando estiver a 200px da viewport
      });
      
      // Observa elementos com atributos de lazy loading
      document.querySelectorAll('[data-src], [data-srcset], [data-background], [data-content], .lazy-background, .lazy-content').forEach(element => {
        lazyObserver.observe(element);
      });
    }
  }
  
  /**
   * Carrega conteúdo lazy via AJAX
   * @param {HTMLElement} element - Elemento a receber o conteúdo
   * @param {string} url - URL do conteúdo a ser carregado
   */
  loadLazyContent(element, url) {
    fetch(url)
      .then(response => response.text())
      .then(html => {
        element.innerHTML = html;
        
        // Executa scripts no conteúdo carregado
        element.querySelectorAll('script').forEach(oldScript => {
          const newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(attr => {
            newScript.setAttribute(attr.name, attr.value);
          });
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode.replaceChild(newScript, oldScript);
        });
      })
      .catch(error => {
        console.error('Erro ao carregar conteúdo lazy:', error);
        element.innerHTML = '<p>Erro ao carregar conteúdo. Por favor, tente novamente mais tarde.</p>';
      });
  }
  
  /**
   * Precarrega recursos importantes
   * @param {string} url - URL do recurso a ser precarregado
   * @param {string} type - Tipo de recurso (style, script, image, font)
   */
  preloadResource(url, type) {
    // Evita precarregar o mesmo recurso múltiplas vezes
    if (this.resourceHints.preloaded.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    
    if (type === 'font') {
      link.setAttribute('crossorigin', 'anonymous');
    }
    
    document.head.appendChild(link);
    this.resourceHints.preloaded.add(url);
  }
  
  /**
   * Pré-busca recursos que serão necessários em breve
   * @param {string} url - URL do recurso a ser pré-buscado
   */
  prefetchResource(url) {
    // Evita pré-buscar o mesmo recurso múltiplas vezes
    if (this.resourceHints.prefetched.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    
    document.head.appendChild(link);
    this.resourceHints.prefetched.add(url);
  }
  
  /**
   * Estabelece conexão antecipada com um domínio
   * @param {string} url - URL do domínio a ser conectado
   */
  preconnect(url) {
    // Evita conectar ao mesmo domínio múltiplas vezes
    if (this.resourceHints.preconnected.has(url)) return;
    
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    
    document.head.appendChild(link);
    this.resourceHints.preconnected.add(url);
  }
  
  /**
   * Minifica uma string CSS
   * @param {string} css - CSS a ser minificado
   * @returns {string} CSS minificado
   */
  minifyCSS(css) {
    if (!css) return '';
    
    return css
      // Remove comentários
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove espaços em branco
      .replace(/\s+/g, ' ')
      // Remove espaços antes e depois de chaves, dois pontos, ponto e vírgula
      .replace(/\s*([{}:;,])\s*/g, '$1')
      // Remove ponto e vírgula final antes de chaves
      .replace(/;}/g, '}')
      // Remove espaços em branco no início e fim
      .trim();
  }
  
  /**
   * Minifica uma string JavaScript
   * @param {string} js - JavaScript a ser minificado
   * @returns {string} JavaScript minificado
   * 
   * Nota: Esta é uma minificação básica. Para produção,
   * use ferramentas como Terser ou UglifyJS.
   */
  minifyJS(js) {
    if (!js) return '';
    
    return js
      // Remove comentários de linha única
      .replace(/\/\/.*$/gm, '')
      // Remove comentários de múltiplas linhas
      .replace(/\/\*[\s\S]*?\*\//g, '')
      // Remove espaços em branco no início e fim de linhas
      .replace(/^\s+|\s+$/gm, '')
      // Substitui múltiplos espaços por um único
      .replace(/\s+/g, ' ')
      // Remove espaços antes e depois de operadores
      .replace(/\s*([=+\-*/%<>!&|:?;,(){}[\]])\s*/g, '$1')
      // Adiciona quebras de linha após ponto e vírgula para legibilidade mínima
      .replace(/;/g, ';\n');
  }
  
  /**
   * Comprime uma string usando codificação Base64
   * @param {string} str - String a ser comprimida
   * @returns {string} String comprimida
   */
  compressString(str) {
    // Usa TextEncoder para converter a string em bytes
    const encoder = new TextEncoder();
    const bytes = encoder.encode(str);
    
    // Converte para Base64
    return btoa(String.fromCharCode.apply(null, bytes));
  }
  
  /**
   * Descomprime uma string codificada em Base64
   * @param {string} compressed - String comprimida
   * @returns {string} String original
   */
  decompressString(compressed) {
    // Decodifica de Base64
    const binary = atob(compressed);
    
    // Converte de volta para string
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    
    // Usa TextDecoder para converter bytes em string
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }
  
  /**
   * Otimiza o carregamento de fontes
   */
  optimizeFonts() {
    // Adiciona font-display: swap para melhorar a experiência de carregamento
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    
    // Precarrega fontes críticas
    document.querySelectorAll('link[rel="stylesheet"][href*="fonts"]').forEach(link => {
      // Extrai URLs de fontes do CSS
      fetch(link.href)
        .then(response => response.text())
        .then(css => {
          const fontUrls = this.extractFontUrls(css);
          fontUrls.forEach(url => {
            this.preloadResource(url, 'font');
          });
        })
        .catch(error => {
          console.error('Erro ao carregar CSS de fontes:', error);
        });
    });
  }
  
  /**
   * Extrai URLs de fontes de um CSS
   * @param {string} css - CSS contendo definições de fontes
   * @returns {Array} Lista de URLs de fontes
   */
  extractFontUrls(css) {
    const urls = [];
    const fontFaceRegex = /@font-face\s*{[^}]*}/g;
    const urlRegex = /url\(['"]?([^'")]+)['"]?\)/g;
    
    let fontFaceMatch;
    while ((fontFaceMatch = fontFaceRegex.exec(css)) !== null) {
      const fontFace = fontFaceMatch[0];
      let urlMatch;
      
      while ((urlMatch = urlRegex.exec(fontFace)) !== null) {
        urls.push(urlMatch[1]);
      }
    }
    
    return urls;
  }
  
  /**
   * Adiciona cabeçalhos de cache para recursos estáticos
   * @param {string} url - URL do recurso
   * @param {number} maxAge - Tempo máximo de cache em segundos
   */
  setCacheHeaders(url, maxAge) {
    // Esta função é apenas para referência, pois os cabeçalhos
    // devem ser configurados no servidor
    console.log(`Recurso ${url} deve ser cacheado por ${maxAge} segundos`);
    
    // Em um ambiente de produção, você configuraria:
    // Cache-Control: public, max-age=<maxAge>
    // Expires: <data futura>
    // ETag: <hash do conteúdo>
  }
  
  /**
   * Gera um hash para controle de cache
   * @param {string} content - Conteúdo a ser hasheado
   * @returns {string} Hash do conteúdo
   */
  generateContentHash(content) {
    // Implementação simples de hash
    let hash = 0;
    
    if (content.length === 0) return hash.toString(16);
    
    for (let i = 0; i < content.length; i++) {
      const char = content.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Converte para inteiro de 32 bits
    }
    
    return Math.abs(hash).toString(16);
  }
}

// Exporta os utilitários de performance
window.performanceUtils = new PerformanceUtils();
