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

// **Evento para formulário de login/registro** – inclui lógica de registro e login
document.getElementById('loginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const botCheck = document.getElementById('botCheck').value;
  const loginMessage = document.getElementById('loginMessage');
  // Verificação anti-bot (honeypot)
  if (botCheck) {
    loginMessage.className = 'error';
    loginMessage.textContent = 'Erro de validação.';
    return;
  }
  if (!email || !password) {
    loginMessage.className = 'error';
    loginMessage.textContent = 'Por favor, preencha todos os campos.';
    return;
  }
  if (registerMode) {
    // Modo de registro
    if (users[email]) {
      loginMessage.className = 'error';
      loginMessage.textContent = 'Este e-mail já está registrado.';
      return;
    }
    // Simular hash+salt (em produção usar bcrypt ou similar)
    const salt = Math.random().toString(36).substring(2);
    const hash = password + salt;  // Simulação simplificada
    users[email] = { salt, hash };
    userData[email] = {
      completedTopics: [],
      reminders: [],
      favorites: [],
      achievements: [],
      highScore: 0,
      notes: {}
    };
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('userData', JSON.stringify(userData));
    loginMessage.className = 'success';
    loginMessage.textContent = 'Registro concluído! Você pode fazer login agora.';
    // Alternar para modo Login automaticamente após registro
    showLoginForm();
    document.getElementById('password').value = '';  // limpar campo senha pós-registro
  } else {
    // Modo de login
    if (!users[email]) {
      loginAttempts++;
      loginMessage.className = 'error';
      loginMessage.textContent = 'E-mail não encontrado.';
      return;
    }
    const { salt, hash } = users[email];
    if (password + salt !== hash) {  // Simulação simplificada de verificação
      loginAttempts++;
      loginMessage.className = 'error';
      loginMessage.textContent = 'Senha incorreta.';
      // Bloquear temporariamente após 3 tentativas
      if (loginAttempts >= 3) {
        document.getElementById('loginBtn').disabled = true;
        loginMessage.textContent = 'Muitas tentativas. Tente novamente em 30 segundos.';
        setTimeout(() => {
          document.getElementById('loginBtn').disabled = false;
          loginAttempts = 0;
        }, 30000);
      }
      return;
    }
    // Login bem-sucedido
    currentUser = email;
    localStorage.setItem('loggedInUser', email);
    loginMessage.className = 'success';
    loginMessage.textContent = 'Login bem-sucedido!';
    startApp();
  }
});

// **Funções de alternância entre Login e Registro (simplificadas)** 
function showRegisterForm() {
  registerMode = true;
  document.getElementById('loginTitle').textContent = 'Registro';
  document.getElementById('loginBtn').textContent = 'Registrar';
  document.getElementById('switchPrefix').textContent = 'Já tem uma conta? ';
  document.getElementById('switchLink').textContent = 'Faça login';
  document.getElementById('loginMessage').textContent = '';
  document.getElementById('loginMessage').className = '';
}
function showLoginForm() {
  registerMode = false;
  document.getElementById('loginTitle').textContent = 'Login';
  document.getElementById('loginBtn').textContent = 'Entrar';
  document.getElementById('switchPrefix').textContent = 'Não tem uma conta? ';
  document.getElementById('switchLink').textContent = 'Registre-se';
  document.getElementById('loginMessage').textContent = '';
  document.getElementById('loginMessage').className = '';
}
function toggleLoginRegister(e) {
  e.preventDefault();
  if (registerMode) {
    showLoginForm();
  } else {
    showRegisterForm();
  }
}
// Adicionar evento para o link de alternância Login/Registro
document.getElementById('switchLink').addEventListener('click', toggleLoginRegister);

// Evento para botão de mostrar/ocultar senha
document.getElementById('togglePassword').addEventListener('click', () => {
  const passwordInput = document.getElementById('password');
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  document.getElementById('togglePassword').textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

// Eventos para os links de Termos/Política (abre modal)
document.getElementById('termsLink').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('modal').style.display = 'flex';
});
document.getElementById('termsLink2').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('modal').style.display = 'flex';
});
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Botões de Text-to-Speech (leitura de texto das seções)
document.querySelectorAll('.tts-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const section = this.closest('section');
    const content = section.querySelector('.sectionContent').textContent;
    window.speechSynthesis.cancel();  // cancelar leitura em andamento
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = currentLang === 'pt' ? 'pt-BR' : 'en-US';
    window.speechSynthesis.speak(utterance);
    showNotification('Iniciando leitura do texto...', 'info');
  });
});

// ... (demais funções de quiz, backup e verificação de lembretes seguem inalteradas) ...

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
