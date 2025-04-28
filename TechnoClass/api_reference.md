# Documentação de APIs e Componentes - TecnoClass PWA

Este documento fornece uma referência detalhada das APIs e componentes principais do TecnoClass PWA, destinado a desenvolvedores que desejam entender, manter ou estender o aplicativo.

## Índice

1. [Service Worker](#service-worker)
2. [IndexedDB](#indexeddb)
3. [Cache Manager](#cache-manager)
4. [Sistema de Navegação de Cursos](#sistema-de-navegação-de-cursos)
5. [Sistema de Quizzes](#sistema-de-quizzes)
6. [Modo de Estudo Offline](#modo-de-estudo-offline)
7. [Barra de Progresso Global](#barra-de-progresso-global)
8. [Gerenciador de Tema](#gerenciador-de-tema)
9. [Componentes UI](#componentes-ui)
10. [Utilitários](#utilitários)

## Service Worker

O Service Worker é responsável por interceptar requisições de rede e implementar estratégias de cache para permitir o funcionamento offline.

### API

```javascript
// Registro do Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}

// Eventos principais
self.addEventListener('install', event => {...});
self.addEventListener('activate', event => {...});
self.addEventListener('fetch', event => {...});
```

### Estratégias de Cache

- **cacheFirst(request)**: Tenta servir do cache primeiro, com fallback para rede
- **networkFirst(request)**: Tenta servir da rede primeiro, com fallback para cache
- **staleWhileRevalidate(request)**: Serve do cache enquanto atualiza em segundo plano

### Uso

```javascript
// No service-worker.js
self.addEventListener('fetch', event => {
  const strategy = determineStrategy(event.request);
  
  if (strategy === 'cache-first') {
    event.respondWith(cacheFirst(event.request));
  } else if (strategy === 'network-first') {
    event.respondWith(networkFirst(event.request));
  } else {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});
```

## IndexedDB

O sistema IndexedDB gerencia o armazenamento estruturado de dados do aplicativo.

### API

```javascript
class IndexedDBService {
  // Inicializa o banco de dados
  async init();
  
  // Operações CRUD
  async getById(storeName, id);
  async getAll(storeName);
  async add(storeName, item);
  async update(storeName, item);
  async delete(storeName, id);
  
  // Operações avançadas
  async getAllByIndex(storeName, indexName, value);
  async getByQuery(storeName, query);
}
```

### Stores

- **courses**: Armazena dados dos cursos
- **quizzes**: Armazena dados dos quizzes
- **userProgress**: Armazena progresso do usuário
- **userNotes**: Armazena anotações do usuário
- **userFavorites**: Armazena favoritos do usuário
- **offlineContent**: Registra conteúdo disponível offline

### Uso

```javascript
// Obter todos os cursos
const courses = await window.dbService.getAll('courses');

// Obter um curso específico
const course = await window.dbService.getById('courses', courseId);

// Atualizar progresso do usuário
await window.dbService.update('userProgress', {
  id: progressId,
  courseId: courseId,
  progress: 75,
  lastUpdated: new Date().toISOString()
});
```

## Cache Manager

O Cache Manager fornece uma interface para interagir com a Cache API e gerenciar recursos em cache.

### API

```javascript
class CacheManager {
  // Inicializa os caches
  async init();
  
  // Operações de cache
  async cacheResource(url);
  async getCachedResource(url);
  async updateCache(url);
  async clearCache(cacheName);
  
  // Operações específicas
  async cacheStaticResources(resources);
  async cacheDynamicResource(url);
  async clearDynamicCache();
}
```

### Caches

- **tecnoclass-static**: Recursos estáticos (HTML, CSS, JS, imagens)
- **tecnoclass-dynamic**: Conteúdo dinâmico (JSON, dados de API)
- **tecnoclass-pages**: Páginas HTML para navegação offline

### Uso

```javascript
// Cachear um recurso
await window.cacheManager.cacheResource('/assets/images/logo.png');

// Limpar cache dinâmico
await window.cacheManager.clearDynamicCache();

// Cachear recursos estáticos
await window.cacheManager.cacheStaticResources([
  '/index.html',
  '/styles/main.css',
  '/scripts/core/app.js'
]);
```

## Sistema de Navegação de Cursos

O Sistema de Navegação de Cursos gerencia a exibição e interação com cursos e lições.

### API

```javascript
class CourseNavigationSystem {
  // Inicialização
  init();
  
  // Navegação
  navigateToCoursesList();
  navigateToCourse(courseId);
  navigateToLesson(courseId, lessonId);
  
  // Renderização
  renderCoursesList(container);
  renderCourseDetails(container, courseId);
  renderLesson(container, courseId, lessonId);
  
  // Progresso
  markLessonComplete(courseId, lessonId);
  updateCourseProgress(courseId);
  getCourseProgress(courseId);
}
```

### Eventos

- **courseSelected**: Disparado quando um curso é selecionado
- **lessonSelected**: Disparado quando uma lição é selecionada
- **lessonCompleted**: Disparado quando uma lição é concluída
- **courseProgressUpdated**: Disparado quando o progresso do curso é atualizado

### Uso

```javascript
// Navegar para um curso
window.courseNavigation.navigateToCourse('course-123');

// Marcar lição como concluída
await window.courseNavigation.markLessonComplete('course-123', 'lesson-456');

// Obter progresso do curso
const progress = await window.courseNavigation.getCourseProgress('course-123');
```

## Sistema de Quizzes

O Sistema de Quizzes gerencia a exibição e interação com quizzes interativos.

### API

```javascript
class QuizSystem {
  // Inicialização
  init();
  
  // Navegação
  navigateToQuizzes();
  navigateToQuiz(quizId);
  navigateToStartQuiz(quizId);
  navigateToQuizResults(quizId);
  
  // Renderização
  showQuizzesList();
  showQuizDetails(quizId);
  startQuiz(quizId);
  showQuizResults(quizId);
  
  // Interação
  submitAnswer(questionIndex, answerIndex);
  finishQuiz();
}
```

### Eventos

- **quizSelected**: Disparado quando um quiz é selecionado
- **quizStarted**: Disparado quando um quiz é iniciado
- **quizCompleted**: Disparado quando um quiz é concluído
- **questionAnswered**: Disparado quando uma questão é respondida

### Uso

```javascript
// Navegar para um quiz
window.quizSystem.navigateToQuiz('quiz-123');

// Iniciar um quiz
window.quizSystem.startQuiz('quiz-123');

// Submeter resposta
window.quizSystem.submitAnswer(0, 2); // Questão 0, resposta 2
```

## Modo de Estudo Offline

O Modo de Estudo Offline gerencia o download e acesso a conteúdo para uso sem internet.

### API

```javascript
class OfflineStudyMode {
  // Inicialização
  init();
  
  // Gerenciamento de conteúdo offline
  async downloadCourse(courseId);
  async downloadQuiz(quizId);
  async isContentAvailableOffline(id, type);
  async removeOfflineContent(id, type);
  async clearAllOfflineContent();
  
  // UI
  renderOfflineIndicator();
  showOfflineContentManager();
  
  // Sincronização
  syncOfflineData();
}
```

### Eventos

- **offlineContentAdded**: Disparado quando conteúdo é adicionado para uso offline
- **offlineContentRemoved**: Disparado quando conteúdo offline é removido
- **syncStarted**: Disparado quando a sincronização é iniciada
- **syncCompleted**: Disparado quando a sincronização é concluída

### Uso

```javascript
// Baixar um curso para uso offline
await window.offlineStudyMode.downloadCourse('course-123');

// Verificar se conteúdo está disponível offline
const isAvailable = await window.offlineStudyMode.isContentAvailableOffline('quiz-456', 'quiz');

// Mostrar gerenciador de conteúdo offline
window.offlineStudyMode.showOfflineContentManager();
```

## Barra de Progresso Global

A Barra de Progresso Global exibe e gerencia o progresso do usuário em todos os cursos.

### API

```javascript
class GlobalProgressBar {
  // Inicialização
  async init();
  
  // Carregamento de dados
  async loadProgressData();
  
  // Renderização
  renderProgressBar();
  showProgressDetails();
  
  // Cálculos
  calculateGlobalProgress(progressItems);
  organizeProgressByCategory(progressItems);
  
  // Atualização
  async updateProgress();
}
```

### Eventos

- **progressDataLoaded**: Disparado quando os dados de progresso são carregados
- **progressUpdated**: Disparado quando o progresso é atualizado

### Uso

```javascript
// Atualizar a barra de progresso
await window.globalProgressBar.updateProgress();

// Mostrar detalhes de progresso
window.globalProgressBar.showProgressDetails();
```

## Gerenciador de Tema

O Gerenciador de Tema controla o tema visual do aplicativo (claro/escuro).

### API

```javascript
class ThemeManager {
  // Inicialização
  init();
  
  // Gerenciamento de tema
  setTheme(theme); // 'light', 'dark', 'auto'
  getTheme();
  toggleTheme();
  
  // Detecção
  detectPreferredTheme();
  
  // Persistência
  saveThemePreference(theme);
  loadThemePreference();
}
```

### Eventos

- **themeChanged**: Disparado quando o tema é alterado

### Uso

```javascript
// Alternar entre temas
window.themeManager.toggleTheme();

// Definir tema específico
window.themeManager.setTheme('dark');

// Obter tema atual
const currentTheme = window.themeManager.getTheme();
```

## Componentes UI

Os Componentes UI fornecem elementos de interface reutilizáveis.

### API

```javascript
class UIComponents {
  // Componentes
  createModal(options);
  createToast(options);
  createTabs(container, options);
  createAccordion(container, options);
  createDropdown(container, options);
  
  // Utilitários
  showLoading(container);
  hideLoading(container);
  showToast(options);
}
```

### Opções Comuns

- **Modal**: `title`, `content`, `size`, `onClose`
- **Toast**: `message`, `type`, `duration`
- **Tabs**: `items`, `activeIndex`, `onChange`
- **Accordion**: `items`, `expandedIndex`, `onChange`
- **Dropdown**: `items`, `selectedIndex`, `onChange`

### Uso

```javascript
// Criar um modal
const modal = window.uiComponents.createModal({
  title: 'Detalhes do Curso',
  content: '<p>Conteúdo do modal</p>',
  size: 'large'
});

// Mostrar um toast
window.uiComponents.showToast({
  message: 'Curso adicionado aos favoritos',
  type: 'success',
  duration: 3000
});
```

## Utilitários

Os Utilitários fornecem funções auxiliares para diversas operações.

### SecurityUtils

```javascript
class SecurityUtils {
  // Sanitização
  static sanitizeString(input);
  static sanitizeHTML(html);
  static sanitizeObject(obj);
  
  // Validação
  static isValidEmail(email);
  static validatePassword(password);
  static isSafeUrl(url);
  
  // CSRF
  static generateCSRFToken();
  static verifyCSRFToken(token);
  static addCSRFTokenToForm(form);
}
```

### PerformanceUtils

```javascript
class PerformanceUtils {
  // Monitoramento
  setupPerformanceMonitoring();
  
  // Otimização
  optimizeImages();
  setupLazyLoading();
  
  // Precarregamento
  preloadResource(url, type);
  prefetchResource(url);
  preconnect(url);
  
  // Minificação
  minifyCSS(css);
  minifyJS(js);
}
```

### Uso

```javascript
// Sanitizar HTML
const safeHTML = window.securityUtils.sanitizeHTML(userGeneratedContent);

// Precarregar um recurso importante
window.performanceUtils.preloadResource('/assets/fonts/main-font.woff2', 'font');
```

## Considerações de Uso

1. **Inicialização**: A maioria dos componentes é inicializada automaticamente quando o DOM está pronto
2. **Acesso Global**: Todos os componentes são expostos como propriedades do objeto `window`
3. **Assincronicidade**: Muitas operações são assíncronas e retornam Promises
4. **Eventos**: Use eventos personalizados para comunicação entre componentes
5. **Erros**: Trate erros adequadamente com blocos try/catch

## Exemplos de Integração

### Fluxo de Curso Completo

```javascript
// Navegar para um curso
window.courseNavigation.navigateToCourse('course-123');

// Baixar para uso offline
await window.offlineStudyMode.downloadCourse('course-123');

// Marcar lição como concluída
await window.courseNavigation.markLessonComplete('course-123', 'lesson-456');

// Atualizar barra de progresso
await window.globalProgressBar.updateProgress();
```

### Fluxo de Quiz Completo

```javascript
// Navegar para um quiz
window.quizSystem.navigateToQuiz('quiz-123');

// Iniciar o quiz
window.quizSystem.startQuiz('quiz-123');

// Submeter respostas
window.quizSystem.submitAnswer(0, 2);
window.quizSystem.submitAnswer(1, 0);
window.quizSystem.submitAnswer(2, 3);

// Finalizar o quiz
window.quizSystem.finishQuiz();
```

## Depuração

Para depurar componentes, você pode usar:

```javascript
// Visualizar estado do IndexedDB
await window.dbService.getAll('courses').then(console.table);

// Testar funcionalidade offline
window.offlineTestUI.show();

// Verificar cache
caches.open('tecnoclass-static').then(cache => cache.keys().then(console.log));
```

---

Esta documentação serve como referência para as APIs e componentes principais do TecnoClass PWA. Para informações mais detalhadas sobre a implementação, consulte os comentários no código-fonte.
