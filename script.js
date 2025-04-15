"use strict";

// Dados persistentes (LocalStorage) – com tratamento de erros
let users;
try {
  users = JSON.parse(localStorage.getItem('users')) || {};
} catch (e) {
  users = {};
}
let userData;
try {
  userData = JSON.parse(localStorage.getItem('userData')) || {};
} catch (e) {
  userData = {};
}
let currentUser;
try {
  currentUser = localStorage.getItem('loggedInUser');
} catch (e) {
  currentUser = null;
}
let contentData;
try {
  contentData = JSON.parse(localStorage.getItem('contentData')) || null;
} catch (e) {
  contentData = null;
}
const CONTENT_VERSION = 2;  // Versão do conteúdo para controle de atualização

// ... (conteúdo de cursos defaultContentData omitido para brevidade) ...

// Se não houver conteúdo ou versão desatualizada, salva o conteúdo padrão atualizado
if (!contentData || !contentData.pt || !contentData.en || parseInt(localStorage.getItem('contentVersion') || "0") < CONTENT_VERSION) {
  contentData = defaultContentData;
  localStorage.setItem('contentData', JSON.stringify(contentData));
  localStorage.setItem('contentVersion', CONTENT_VERSION.toString());
}

// Variáveis de estado da interface
let registerMode = false;
let currentLang = 'pt';  // idioma atual (pt padrão)
let loginAttempts = 0;
let quizTimer = null;
let quizTimePerQuestion = 15;  // segundos por pergunta no quiz final
let currentQuestionIndex = 0;
let lastActivity = Date.now();
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos em ms

// Lista dinâmica de seções (para showSection)
let sectionIds = ['homeSection','programacaoSection','cibersegurancaSection','iaSection','productOwnerSection','quizSection','remindersSection','favoritesSection','profileSection','adminSection'];

// Configura tema salvo
let savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// Gera lista de tópicos no menu inicial
function renderTopicsList() {
  const topicsListEl = document.getElementById('topicsList');
  topicsListEl.innerHTML = '';
  const topics = contentData[currentLang];
  for (let key in topics) {
    // Adiciona cada tópico como link de navegação (com ícone e título)
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = "#";
    a.textContent = topics[key].title;
    a.dataset.target = key + "Section";
    a.className = "navLink";
    // Ícone ilustrativo por tópico
    let icon = "📘";
    if (key.startsWith("programa")) icon = "💻";
    else if (key.startsWith("ciber")) icon = "🔒";
    else if (key === "ia") icon = "🤖";
    else if (key.startsWith("productOwner")) icon = "📊";
    a.textContent = icon + " " + topics[key].title;
    li.appendChild(a);
    // Se tópico já concluído pelo usuário, indicar (✓)
    if (currentUser && userData[currentUser] && userData[currentUser].completedTopics.includes(key)) {
      a.textContent += " ✓";
    }
    topicsListEl.appendChild(li);
  }
  // Itens extras (Quiz, Lembretes, Favoritos) já estão no HTML fixo, não duplicar aqui
}
renderTopicsList();

// Carrega o conteúdo nos elementos de seção de acordo com o idioma atual
function loadContent(lang = 'pt') {
  currentLang = lang;
  const topics = contentData[currentLang];
  for (let key in topics) {
    const sectionId = key + "Section";
    const sectionEl = document.getElementById(sectionId);
    if (!sectionEl) continue;
    // Preencher título e conteúdo
    const titleEl = sectionEl.querySelector('h2');
    const contentEl = sectionEl.querySelector('.sectionContent');
    const reviewEl = sectionEl.querySelector('.reviewQuestions');
    if (titleEl) titleEl.innerText = topics[key].title;
    if (contentEl) {
      // Remover vídeos e links "Saiba mais" se houver (para foco no conteúdo básico offline)
      let content = topics[key].body;
      content = content.replace(/<video.*?<\/video>/gs, '');
      content = content.replace(/<p><em>Para saber mais:.*?<\/p>/gs, '');
      content = content.replace(/<p><em>Learn more:.*?<\/p>/gs, '');
      content = content.replace(/<p><em>Exemplo visual:.*?<\/p>/gs, '');
      content = content.replace(/<p><em>Visual example:.*?<\/p>/gs, '');
      contentEl.innerHTML = content;
    }
    // Inserir perguntas de revisão (se ainda não inseridas)
    if (reviewEl && reviewEl.children.length === 0) {
      insertReviewQuestions(key, reviewEl);
    }
  }
  // Após carregar conteúdo, configurar interações (IDs de parágrafos, favoritos)
  setupContentInteractions();
  // Inicializar sistema de notas adesivas
  initStickyNotes();
}
loadContent(currentLang);

// (Função insertReviewQuestions e outras funções de conteúdo permanecem iguais...)

function startApp() {
  document.getElementById('appHeader').style.display = 'block';
  document.getElementById('loginSection').style.display = 'none';
  document.getElementById('homeSection').style.display = 'block';
  document.getElementById('welcomeName').innerText = currentUser;
  document.getElementById('topbar').style.display = 'flex';
  // Garante estrutura do usuário nos dados
  if (!userData[currentUser]) {
    userData[currentUser] = { completedTopics: [], reminders: [], favorites: [], achievements: [], highScore: 0, notes: {} };
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  renderTopicsList();
  renderReminders();
  initStickyNotes();
  setInterval(checkDueReminders, 60000);
  autoBackupUserData();
  setInterval(autoBackupUserData, 30 * 60 * 1000);
  const userProfile = initUserData(currentUser);
  // Conquista de login diário
  const lastLogin = userProfile.lastLogin ? new Date(userProfile.lastLogin) : null;
  const today = new Date();
  if (lastLogin &&
      lastLogin.getDate() !== today.getDate() &&
      (today - lastLogin) < 2 * 24 * 60 * 60 * 1000) {
    unlockAchievement("Estudante Dedicado: login em dias consecutivos");
  }
  initQuizModal();
  setTimeout(initQuizModal, 100);
  checkDueReminders();
}

// Auto-login se usuário já autenticado anteriormente
if (currentUser) {
  startApp();
}

// Event handlers para navegação principal
document.getElementById('homeBtn').addEventListener('click', () => showSection('homeSection'));
document.getElementById('profileBtn').addEventListener('click', () => showSection('profileSection'));
document.getElementById('quizBtn').addEventListener('click', () => showSection('quizSection'));
document.getElementById('remindersBtn').addEventListener('click', () => showSection('remindersSection'));
document.getElementById('favoritesBtn').addEventListener('click', () => showSection('favoritesSection'));
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  currentUser = null;
  location.reload();
});

document.getElementById('syncBtn').addEventListener('click', () => {
  showNotification('Sincronização concluída!', 'success');
  // (Sincronização real com servidor não implementada)
});

// Botões de voltar em todas seções
document.querySelectorAll('.backButton').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    if (target) {
      showSection(target);
    }
  });
});

// Links de navegação gerados na lista de tópicos (navLink anchors)
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('navLink')) {
    e.preventDefault();
    const target = e.target.getAttribute('data-target');
    if (target) {
      showSection(target);
    }
  }
});

// Evento para formulário de lembretes
document.getElementById('reminderForm').addEventListener('submit', (e) => {
  e.preventDefault();
  if (!currentUser) return;
  const text = document.getElementById('reminderText').value.trim();
  let date = document.getElementById('reminderDate').value;
  if (!text) {
    showNotification('Por favor, digite um texto para o lembrete.', 'error');
    return;
  }
  if (!date) {
    // Se não especificar data, usar data atual + 1 dia
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    date = tomorrow.toISOString();
  }
  if (!userData[currentUser].reminders) {
    userData[currentUser].reminders = [];
  }
  userData[currentUser].reminders.push({ text: text, date: date, notified: false });
  localStorage.setItem('userData', JSON.stringify(userData));
  document.getElementById('reminderText').value = '';
  document.getElementById('reminderDate').value = '';
  renderReminders();
  showNotification('Lembrete adicionado com sucesso!', 'success');
  // Conquista: primeiro lembrete
  if (userData[currentUser].reminders.length === 1) {
    unlockAchievement("Organizado: primeiro lembrete adicionado");
  }
});

// Evento para botão de exportar dados do perfil
document.getElementById('exportDataBtn').addEventListener('click', () => {
  if (!currentUser || !userData[currentUser]) return;
  const dataStr = JSON.stringify(userData[currentUser], null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  const exportFileDefaultName = `tecnoclass_${currentUser}_data.json`;
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  showNotification('Seus dados foram exportados com sucesso!', 'success');
});

// Iniciar o aplicativo diretamente, sem login
document.addEventListener('DOMContentLoaded', function() {
  // Definir um usuário padrão se não existir
  if (!currentUser) {
    currentUser = "usuario_padrao";
    localStorage.setItem('loggedInUser', currentUser);
    
    // Garantir estrutura do usuário nos dados
    if (!userData[currentUser]) {
      userData[currentUser] = { completedTopics: [], reminders: [], favorites: [], achievements: [], highScore: 0, notes: {} };
      localStorage.setItem('userData', JSON.stringify(userData));
    }
  }
  
  // Iniciar o app diretamente
  startApp();
  
  // Ocultar seção de login
  document.getElementById('loginSection').style.display = 'none';
});

// Remover eventos relacionados ao login/registro
document.getElementById('loginForm').removeEventListener('submit', function(){});
document.getElementById('switchLink').removeEventListener('click', toggleLoginRegister);
document.getElementById('togglePassword').removeEventListener('click', function(){});
document.getElementById('termsLink').removeEventListener('click', function(){});
document.getElementById('termsLink2').removeEventListener('click', function(){});

// Verificar lembretes periodicamente
setInterval(() => {
  if (currentUser && (Date.now() - lastActivity > SESSION_TIMEOUT)) {
    showNotification("Sessão expirada por inatividade");
    localStorage.removeItem('loggedInUser');
    currentUser = null;
    location.reload();
  }
}, 60000);

// Atualizar timestamp de última atividade 
document.addEventListener('click', () => lastActivity = Date.now());
document.addEventListener('keydown', () => lastActivity = Date.now());
document.addEventListener('mousemove', () => lastActivity = Date.now());
