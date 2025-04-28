# Arquitetura do TecnoClass-PWA

## Visão Geral

O TecnoClass-PWA é uma aplicação educacional offline-first projetada para oferecer conteúdo educacional e quizzes sobre tecnologia, com foco em programação, cybersegurança, IA e product ownership. A aplicação é construída como uma Progressive Web App (PWA) para garantir funcionamento offline, instalação em dispositivos e experiência de usuário de alta qualidade.

## Princípios de Design

1. **Offline-First**: A aplicação funciona primariamente offline, sincronizando dados quando há conexão
2. **Responsividade**: Interface adaptável a qualquer tamanho de tela e dispositivo
3. **Acessibilidade**: Conformidade com diretrizes WCAG para garantir acesso universal
4. **Performance**: Carregamento rápido e resposta imediata às interações do usuário
5. **Segurança**: Proteção de dados do usuário e validação de entradas

## Estrutura de Diretórios

```
TecnoClass-PWA/
├── assets/             # Recursos estáticos
│   ├── icons/          # Ícones da aplicação
│   └── images/         # Imagens de conteúdo
├── components/         # Componentes reutilizáveis
│   ├── header/         # Componentes de cabeçalho
│   ├── footer/         # Componentes de rodapé
│   ├── navigation/     # Componentes de navegação
│   ├── quiz/           # Componentes de quiz
│   ├── course/         # Componentes de curso
│   └── ui/             # Componentes de interface
├── pages/              # Páginas da aplicação
│   ├── home/           # Página inicial
│   ├── cursos/         # Páginas de cursos
│   ├── quizzes/        # Páginas de quizzes
│   └── perfil/         # Página de perfil
├── scripts/            # Scripts JavaScript
│   ├── core/           # Funcionalidades principais
│   └── utils/          # Utilitários
├── services/           # Serviços da aplicação
│   ├── db/             # Serviços de banco de dados
│   ├── cache/          # Serviços de cache
│   └── auth/           # Serviços de autenticação
├── styles/             # Estilos CSS
├── utils/              # Utilitários gerais
│   ├── helpers/        # Funções auxiliares
│   ├── validators/     # Validadores de entrada
│   └── i18n/           # Internacionalização
├── docs/               # Documentação
├── index.html          # Página principal
├── manifest.json       # Manifesto da PWA
└── service-worker.js   # Service Worker
```

## Componentes Principais

### 1. Service Worker

O Service Worker é responsável por:
- Implementar estratégia Cache First + Network Update
- Fornecer fallback para páginas offline
- Gerenciar cache de recursos estáticos e dinâmicos
- Atualizar conteúdo em segundo plano quando há conexão

```javascript
// Estratégia de cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Retorna do cache se disponível
        const fetchPromise = fetch(event.request)
          .then((networkResponse) => {
            // Atualiza o cache com a resposta da rede
            caches.open('dynamic-cache').then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
            return networkResponse;
          })
          .catch(() => {
            // Fallback para conteúdo offline
            return caches.match('/offline.html');
          });
          
        return cachedResponse || fetchPromise;
      })
  );
});
```

### 2. IndexedDB

O IndexedDB é utilizado para:
- Armazenar progresso do aluno
- Salvar favoritos e anotações
- Persistir configurações do usuário
- Armazenar conteúdo dos cursos e quizzes

```javascript
// Estrutura do banco de dados
const dbStructure = {
  name: 'tecnoclass-db',
  version: 1,
  stores: [
    {
      name: 'user',
      keyPath: 'id',
      indexes: [
        { name: 'email', unique: true }
      ]
    },
    {
      name: 'progress',
      keyPath: 'id',
      indexes: [
        { name: 'userId', unique: false },
        { name: 'courseId', unique: false },
        { name: 'timestamp', unique: false }
      ]
    },
    {
      name: 'favorites',
      keyPath: 'id',
      indexes: [
        { name: 'userId', unique: false },
        { name: 'itemId', unique: false },
        { name: 'type', unique: false }
      ]
    },
    {
      name: 'notes',
      keyPath: 'id',
      indexes: [
        { name: 'userId', unique: false },
        { name: 'itemId', unique: false },
        { name: 'timestamp', unique: false }
      ]
    },
    {
      name: 'courses',
      keyPath: 'id',
      indexes: [
        { name: 'category', unique: false }
      ]
    },
    {
      name: 'quizzes',
      keyPath: 'id',
      indexes: [
        { name: 'courseId', unique: false },
        { name: 'difficulty', unique: false }
      ]
    },
    {
      name: 'settings',
      keyPath: 'id'
    }
  ]
};
```

### 3. Sistema de Navegação

A navegação é baseada em:
- Rotas definidas via JavaScript
- Histórico do navegador para navegação entre páginas
- Componentes dinâmicos carregados conforme necessário

```javascript
// Router simples
const routes = {
  '/': { component: 'home-page', title: 'Início' },
  '/cursos': { component: 'courses-page', title: 'Cursos' },
  '/cursos/:id': { component: 'course-detail', title: 'Detalhes do Curso' },
  '/quizzes': { component: 'quizzes-page', title: 'Quizzes' },
  '/quizzes/:id': { component: 'quiz-detail', title: 'Quiz' },
  '/perfil': { component: 'profile-page', title: 'Meu Perfil' },
  '/offline': { component: 'offline-page', title: 'Você está Offline' }
};

// Navegação
function navigate(path) {
  const route = matchRoute(path, routes);
  if (route) {
    history.pushState(null, route.title, path);
    renderComponent(route.component);
    document.title = `TecnoClass - ${route.title}`;
  }
}
```

### 4. Tema e Modo Escuro

O sistema de temas é implementado via:
- Variáveis CSS para cores e estilos
- Detecção automática de preferência do sistema
- Opção manual para alternar entre temas

```css
/* Tema claro (padrão) */
:root {
  --bg-primary: #f4f7f9;
  --bg-secondary: #ffffff;
  --text-primary: #2c3e50;
  --text-secondary: #7f8c8d;
  --accent-color: #1abc9c;
  --accent-hover: #16a085;
  --shadow: rgba(0, 0, 0, 0.1);
}

/* Tema escuro */
[data-theme="dark"] {
  --bg-primary: #1e272e;
  --bg-secondary: #2c3e50;
  --text-primary: #ecf0f1;
  --text-secondary: #bdc3c7;
  --accent-color: #1abc9c;
  --accent-hover: #16a085;
  --shadow: rgba(0, 0, 0, 0.3);
}

/* Detecção automática */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg-primary: #1e272e;
    --bg-secondary: #2c3e50;
    --text-primary: #ecf0f1;
    --text-secondary: #bdc3c7;
    --accent-color: #1abc9c;
    --accent-hover: #16a085;
    --shadow: rgba(0, 0, 0, 0.3);
  }
}
```

### 5. Internacionalização

O suporte multilíngue é implementado via:
- Sistema de traduções baseado em chaves
- Detecção automática do idioma do navegador
- Opção manual para alternar entre idiomas

```javascript
// Sistema de traduções
const translations = {
  'pt-BR': {
    'app.title': 'TecnoClass',
    'nav.home': 'Início',
    'nav.courses': 'Cursos',
    'nav.quizzes': 'Quizzes',
    'nav.profile': 'Perfil',
    // ...mais traduções
  },
  'en': {
    'app.title': 'TecnoClass',
    'nav.home': 'Home',
    'nav.courses': 'Courses',
    'nav.quizzes': 'Quizzes',
    'nav.profile': 'Profile',
    // ...mais traduções
  }
};

// Função de tradução
function t(key, lang = getCurrentLanguage()) {
  return translations[lang][key] || key;
}
```

## Fluxo de Dados

1. **Inicialização**:
   - Carregamento do Service Worker
   - Inicialização do IndexedDB
   - Carregamento de configurações do usuário
   - Verificação de autenticação

2. **Navegação**:
   - Carregamento de componentes da página
   - Busca de dados no IndexedDB
   - Renderização de conteúdo

3. **Interação do Usuário**:
   - Validação de entrada
   - Atualização do estado da aplicação
   - Persistência de dados no IndexedDB
   - Feedback visual ao usuário

4. **Sincronização**:
   - Verificação de conectividade
   - Atualização de cache quando online
   - Exportação de dados quando solicitado

## Segurança

1. **Validação de Entrada**:
   - Sanitização de dados do usuário
   - Validação de formato e conteúdo

2. **Proteção contra Vulnerabilidades**:
   - Prevenção de XSS via sanitização de HTML
   - Proteção contra CSRF em operações sensíveis

3. **Privacidade**:
   - Armazenamento local seguro
   - Não compartilhamento de dados sensíveis

## Considerações de Performance

1. **Carregamento Inicial**:
   - Pré-cache de recursos essenciais
   - Carregamento assíncrono de recursos não críticos

2. **Renderização**:
   - Minimização de reflows e repaints
   - Uso de CSS eficiente

3. **Interatividade**:
   - Resposta imediata às ações do usuário
   - Feedback visual para operações longas

## Estratégia de Testes

1. **Testes Unitários**:
   - Funções de utilidade
   - Componentes isolados

2. **Testes de Integração**:
   - Fluxos de navegação
   - Persistência de dados

3. **Testes de Compatibilidade**:
   - Diferentes navegadores
   - Diferentes tamanhos de tela

4. **Testes Offline**:
   - Funcionamento sem conexão
   - Sincronização ao reconectar
