/**
 * TecnoClass-PWA - Utilitários de Segurança
 * 
 * Este arquivo implementa utilitários de segurança para proteger
 * a aplicação contra vulnerabilidades comuns.
 */

class SecurityUtils {
  /**
   * Sanitiza uma string para prevenir XSS
   * @param {string} input - String a ser sanitizada
   * @returns {string} String sanitizada
   */
  static sanitizeString(input) {
    if (!input) return '';
    
    // Converte para string caso não seja
    const str = String(input);
    
    // Escapa caracteres especiais HTML
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
  
  /**
   * Sanitiza HTML permitindo apenas tags e atributos seguros
   * @param {string} html - HTML a ser sanitizado
   * @returns {string} HTML sanitizado
   */
  static sanitizeHTML(html) {
    if (!html) return '';
    
    // Lista de tags permitidas
    const allowedTags = [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr',
      'ul', 'ol', 'li',
      'b', 'i', 'strong', 'em', 'mark', 'small', 'del', 'ins', 'sub', 'sup',
      'blockquote', 'pre', 'code',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a', 'img'
    ];
    
    // Lista de atributos permitidos por tag
    const allowedAttributes = {
      'a': ['href', 'title', 'target', 'rel'],
      'img': ['src', 'alt', 'title', 'width', 'height', 'loading'],
      'th': ['scope', 'colspan', 'rowspan'],
      'td': ['colspan', 'rowspan']
    };
    
    // Cria um elemento temporário
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    
    // Função recursiva para limpar elementos
    const cleanNode = (node) => {
      // Se for um elemento
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Verifica se a tag é permitida
        if (!allowedTags.includes(node.tagName.toLowerCase())) {
          // Substitui o elemento por seu conteúdo
          const fragment = document.createDocumentFragment();
          while (node.firstChild) {
            const child = node.removeChild(node.firstChild);
            fragment.appendChild(child);
          }
          node.parentNode.replaceChild(fragment, node);
          return;
        }
        
        // Remove atributos não permitidos
        const tagName = node.tagName.toLowerCase();
        const allowedAttrs = allowedAttributes[tagName] || [];
        
        Array.from(node.attributes).forEach(attr => {
          const attrName = attr.name.toLowerCase();
          
          // Remove o atributo se não estiver na lista de permitidos
          if (!allowedAttrs.includes(attrName)) {
            node.removeAttribute(attrName);
          }
          
          // Sanitiza URLs em atributos
          if ((attrName === 'href' || attrName === 'src') && attr.value) {
            // Verifica se é uma URL segura
            if (!this.isSafeUrl(attr.value)) {
              node.removeAttribute(attrName);
            }
          }
          
          // Sanitiza manipuladores de eventos
          if (attrName.startsWith('on')) {
            node.removeAttribute(attrName);
          }
        });
        
        // Processa filhos recursivamente
        Array.from(node.childNodes).forEach(cleanNode);
      }
    };
    
    // Limpa o conteúdo
    Array.from(tempElement.childNodes).forEach(cleanNode);
    
    return tempElement.innerHTML;
  }
  
  /**
   * Verifica se uma URL é segura
   * @param {string} url - URL a ser verificada
   * @returns {boolean} Se a URL é segura
   */
  static isSafeUrl(url) {
    if (!url) return false;
    
    try {
      // Verifica se é uma URL relativa
      if (url.startsWith('/') || url.startsWith('./') || url.startsWith('../')) {
        return true;
      }
      
      // Analisa a URL
      const parsedUrl = new URL(url);
      
      // Verifica o protocolo
      return ['http:', 'https:'].includes(parsedUrl.protocol);
    } catch (e) {
      // Se não for uma URL válida, retorna falso
      return false;
    }
  }
  
  /**
   * Gera um token CSRF
   * @returns {string} Token CSRF
   */
  static generateCSRFToken() {
    // Gera um token aleatório
    const array = new Uint8Array(16);
    window.crypto.getRandomValues(array);
    const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    
    // Salva o token no localStorage
    localStorage.setItem('csrf_token', token);
    
    return token;
  }
  
  /**
   * Verifica um token CSRF
   * @param {string} token - Token a ser verificado
   * @returns {boolean} Se o token é válido
   */
  static verifyCSRFToken(token) {
    const storedToken = localStorage.getItem('csrf_token');
    return storedToken && token === storedToken;
  }
  
  /**
   * Adiciona um token CSRF a um formulário
   * @param {HTMLFormElement} form - Formulário a receber o token
   */
  static addCSRFTokenToForm(form) {
    if (!form) return;
    
    // Gera um novo token
    const token = this.generateCSRFToken();
    
    // Cria um campo oculto
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'csrf_token';
    input.value = token;
    
    // Adiciona ao formulário
    form.appendChild(input);
  }
  
  /**
   * Sanitiza um objeto JSON
   * @param {Object} obj - Objeto a ser sanitizado
   * @returns {Object} Objeto sanitizado
   */
  static sanitizeObject(obj) {
    if (!obj || typeof obj !== 'object') return obj;
    
    // Cria um novo objeto para armazenar os valores sanitizados
    const sanitized = Array.isArray(obj) ? [] : {};
    
    // Processa cada propriedade
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        
        if (typeof value === 'string') {
          // Sanitiza strings
          sanitized[key] = this.sanitizeString(value);
        } else if (typeof value === 'object' && value !== null) {
          // Processa objetos recursivamente
          sanitized[key] = this.sanitizeObject(value);
        } else {
          // Mantém outros tipos inalterados
          sanitized[key] = value;
        }
      }
    }
    
    return sanitized;
  }
  
  /**
   * Valida um endereço de e-mail
   * @param {string} email - E-mail a ser validado
   * @returns {boolean} Se o e-mail é válido
   */
  static isValidEmail(email) {
    if (!email) return false;
    
    // Expressão regular para validação básica de e-mail
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Valida uma senha quanto à força
   * @param {string} password - Senha a ser validada
   * @returns {Object} Resultado da validação
   */
  static validatePassword(password) {
    if (!password) {
      return {
        isValid: false,
        message: 'A senha não pode estar vazia'
      };
    }
    
    // Verifica o comprimento
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'A senha deve ter pelo menos 8 caracteres'
      };
    }
    
    // Verifica a presença de letras maiúsculas
    if (!/[A-Z]/.test(password)) {
      return {
        isValid: false,
        message: 'A senha deve conter pelo menos uma letra maiúscula'
      };
    }
    
    // Verifica a presença de letras minúsculas
    if (!/[a-z]/.test(password)) {
      return {
        isValid: false,
        message: 'A senha deve conter pelo menos uma letra minúscula'
      };
    }
    
    // Verifica a presença de números
    if (!/[0-9]/.test(password)) {
      return {
        isValid: false,
        message: 'A senha deve conter pelo menos um número'
      };
    }
    
    // Verifica a presença de caracteres especiais
    if (!/[^A-Za-z0-9]/.test(password)) {
      return {
        isValid: false,
        message: 'A senha deve conter pelo menos um caractere especial'
      };
    }
    
    return {
      isValid: true,
      message: 'Senha válida'
    };
  }
  
  /**
   * Protege contra ataques de timing em comparações de strings
   * @param {string} a - Primeira string
   * @param {string} b - Segunda string
   * @returns {boolean} Se as strings são iguais
   */
  static secureCompare(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string') {
      return false;
    }
    
    // Se os comprimentos são diferentes, as strings são diferentes
    if (a.length !== b.length) {
      return false;
    }
    
    // Compara cada caractere com tempo constante
    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    
    return result === 0;
  }
}

// Exporta os utilitários de segurança
window.securityUtils = SecurityUtils;
