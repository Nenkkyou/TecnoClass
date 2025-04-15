"use strict";

// Dados persistentes (LocalStorage)
let users = JSON.parse(localStorage.getItem('users') || '{}');        // { email: {salt:..., hash:...}, ... }
let userData = JSON.parse(localStorage.getItem('userData') || '{}');  // { email: { completedTopics:[], reminders:[], favorites:[], achievements:[], highScore:0, notes:{} }, ... }
let currentUser = localStorage.getItem('loggedInUser') || null;
let contentData = JSON.parse(localStorage.getItem('contentData') || 'null');
const CONTENT_VERSION = 2;  // Versão do conteúdo para controle de atualização

// Conteúdo educacional em PT e EN (títulos, textos e recursos)
const defaultContentData = {
  "pt": {
    "programacao": {
      "title": "Programação",
      "body": `
        <p>Programação é o processo de escrever, testar e manter programas de computador — conjuntos de instruções que dizem à máquina o que fazer. Ela está por trás de quase tudo que usamos no nosso dia a dia digital: desde aplicativos de celular até sistemas bancários e controle de tráfego.</p>
        <p>Ela tem papel fundamental em áreas como medicina (monitoramento remoto de pacientes), engenharia, indústria automotiva e arquitetura. Programadores desenvolvem softwares que tornam esses avanços possíveis e ajudam a conectar objetos à internet, formando a chamada Internet das Coisas.</p>
        <p>Com programação, podemos desde criar scripts simples para automatizar tarefas rotineiras até desenvolver aplicativos usados por milhões de pessoas. Por exemplo: um programador pode criar um script para organizar arquivos ou desenvolver um app de mensagens. Tudo isso é resultado da aplicação de códigos para facilitar tarefas ou resolver problemas do cotidiano.</p>
        <p><em>Exemplo visual:</em></p>
        <video src="coding.mp4" controls width="100%">Seu navegador não suporta vídeo.</video>
        <p><em>Para saber mais:</em> <a href="https://pt.wikipedia.org/wiki/Programa%C3%A7%C3%A3o_de_computadores" target="_blank">Introdução à Programação (Wikipédia)</a></p>
      `
    },
    "ciberseguranca": {
      "title": "Cibersegurança",
      "body": `
        <p>Cibersegurança é a prática de proteger redes, sistemas, dados, aplicações e dispositivos contra ataques digitais. Profissionais da área identificam vulnerabilidades e implementam medidas como firewalls, antivírus e sistemas de detecção de intrusos para manter os ambientes seguros.</p>
        <p>Veja algumas ameaças comuns e como se proteger:</p>
        <ul>
          <li><strong>Ataque DDoS:</strong> sobrecarga de servidores para tirá-los do ar. Proteja-se monitorando o tráfego da rede e utilizando firewalls que limitem acessos suspeitos.</li>
          <li><strong>Ransomware:</strong> malware que criptografa arquivos e exige resgate. Previna-se com backups atualizados, antivírus e evitando abrir anexos ou links desconhecidos.</li>
          <li><strong>Phishing:</strong> tentativa de enganar o usuário para roubar dados. Desconfie de mensagens estranhas, não clique em links de remetentes desconhecidos e confira se o site é seguro (com HTTPS).</li>
        </ul>
        <p><em>Exemplo visual:</em></p>
        <video src="security.mp4" controls width="100%">Seu navegador não suporta vídeo.</video>
        <p><em>Para saber mais:</em> <a href="https://pt.wikipedia.org/wiki/Seguran%C3%A7a_de_computadores" target="_blank">Segurança de Computadores (Wikipédia)</a></p>
      `
    },
    "ia": {
      "title": "Inteligência Artificial Generativa",
      "body": `
        <p>A Inteligência Artificial Generativa é um tipo de IA capaz de criar conteúdos originais — como textos, imagens, áudios e vídeos — a partir de padrões aprendidos com grandes volumes de dados.</p>
        <p>Ela vai além da análise de dados: é usada para compor músicas, gerar textos, criar imagens e muito mais, tudo a partir de comandos simples dos usuários.</p>
        <p>Um exemplo famoso é o ChatGPT, lançado em 2022, que mostrou como essa tecnologia pode ser aplicada para gerar respostas, ideias e até códigos. A IA generativa está transformando áreas como design, marketing, atendimento ao cliente e produção de conteúdo.</p>
        <p><em>Exemplo visual:</em></p>
        <video src="ai.mp4" controls width="100%">Seu navegador não suporta vídeo.</video>
        <p><em>Para saber mais:</em> <a href="https://pt.wikipedia.org/wiki/Intelig%C3%AAncia_artificial_generativa" target="_blank">IA Generativa (Wikipédia)</a></p>
      `
    },
    "productOwner": {
      "title": "Product Owner (PO)",
      "body": `
        <p>O Product Owner é a pessoa responsável por representar os interesses do cliente ou usuário em projetos que usam metodologias ágeis, como o Scrum. Ele atua como o "dono" do produto dentro do time.</p>
        <p>Seu papel inclui gerenciar e priorizar o <em>backlog</em> — a lista de funcionalidades e tarefas — garantindo que a equipe trabalhe nas entregas de maior valor para o projeto.</p>
        <p>O PO é um elo entre os objetivos do negócio, as necessidades dos usuários e o trabalho do time técnico. Ele toma decisões sobre o que deve ser feito primeiro, ajusta o planejamento com base em feedbacks e assegura que o produto final tenha qualidade e gere impacto positivo.</p>
        <p><em>Exemplo visual:</em></p>
        <video src="po.mp4" controls width="100%">Seu navegador não suporta vídeo.</video>
        <p><em>Para saber mais:</em> <a href="https://pt.wikipedia.org/wiki/Scrum#Product_Owner_(dono_do_produto)" target="_blank">Papel do Product Owner (Scrum - Wikipédia)</a></p>
      `
    }
  },
  "en": {
    "programacao": {
      "title": "Programming",
      "body": `
        <p>Programming is the process of writing, testing, and maintaining computer programs — sets of instructions that tell the machine what to do. It is behind almost everything we use in our digital daily lives: from mobile apps to banking systems and traffic control.</p>
        <p>It plays a fundamental role in fields such as medicine (remote patient monitoring), engineering, the automotive industry, and architecture. Programmers develop software that makes these advances possible and help connect objects to the internet, forming the so-called Internet of Things.</p>
        <p>With programming, we can do anything from creating simple scripts to automate routine tasks to developing applications used by millions of people. For example, a programmer might write a script to organize files or develop a messaging app. All of this results from applying code to facilitate tasks or solve everyday problems.</p>
        <p><em>Visual example:</em></p>
        <video src="coding.mp4" controls width="100%">Your browser does not support video.</video>
        <p><em>Learn more:</em> <a href="https://en.wikipedia.org/wiki/Computer_programming" target="_blank">Introduction to Programming (Wikipedia)</a></p>
      `
    },
    "ciberseguranca": {
      "title": "Cybersecurity",
      "body": `
        <p>Cybersecurity is the practice of protecting networks, systems, data, applications, and devices from digital attacks. Professionals in this field identify vulnerabilities and implement measures like firewalls, antivirus, and intrusion detection systems to keep environments secure.</p>
        <p>Here are some common threats and how to protect against them:</p>
        <ul>
          <li><strong>DDoS Attack:</strong> overloading servers to knock them offline. Protect yourself by monitoring network traffic and using firewalls to limit suspicious access.</li>
          <li><strong>Ransomware:</strong> malware that encrypts files and demands ransom. Prevent it by keeping backups up to date, using antivirus software, and avoiding opening unknown attachments or links.</li>
          <li><strong>Phishing:</strong> attempts to trick users into giving up data. Be wary of strange messages, avoid clicking links from unknown senders, and check if a site is secure (look for HTTPS).</li>
        </ul>
        <p><em>Visual example:</em></p>
        <video src="security.mp4" controls width="100%">Your browser does not support video.</video>
        <p><em>Learn more:</em> <a href="https://en.wikipedia.org/wiki/Computer_security" target="_blank">Computer Security (Wikipedia)</a></p>
      `
    },
    "ia": {
      "title": "Generative Artificial Intelligence",
      "body": `
        <p>Generative Artificial Intelligence is a type of AI capable of creating original content — such as text, images, audio, and videos — from patterns learned from large volumes of data.</p>
        <p>It goes beyond data analysis: it's used to compose music, generate text, create images, and much more, all from simple commands given by users.</p>
        <p>A famous example is ChatGPT, released in 2022, which demonstrated how this technology can generate responses, ideas, and even code. Generative AI is transforming fields like design, marketing, customer service, and content production.</p>
        <p><em>Visual example:</em></p>
        <video src="ai.mp4" controls width="100%">Your browser does not support video.</video>
        <p><em>Learn more:</em> <a href="https://en.wikipedia.org/wiki/Generative_artificial_intelligence" target="_blank">Generative AI (Wikipedia)</a></p>
      `
    },
    "productOwner": {
      "title": "Product Owner (PO)",
      "body": `
        <p>The Product Owner is the person responsible for representing the interests of the client or user in projects that use agile methodologies like Scrum. They act as the "owner" of the product within the team.</p>
        <p>Their role includes managing and prioritizing the <em>backlog</em> — the list of features and tasks — ensuring the team works on the highest-value deliveries for the project.</p>
        <p>The PO is a link between business objectives, user needs, and the technical team's work. They make decisions on what should be done first, adjust planning based on feedback, and ensure the final product is of high quality and creates a positive impact.</p>
        <p><em>Visual example:</em></p>
        <video src="po.mp4" controls width="100%">Your browser does not support video.</video>
        <p><em>Learn more:</em> <a href="https://en.wikipedia.org/wiki/Scrum_(software_development)#Product_owner" target="_blank">Product Owner role (Scrum - Wikipedia)</a></p>
      `
    }
  }
};

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
let quizStartTime = null;
let lastActivity = Date.now(); // Adicionar rastreamento de atividade do usuário
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos em milissegundos

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
    // Não incluir seções especiais (quiz, etc) aqui - mas nossas keys são apenas tópicos de conteúdo
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = "#";
    a.textContent = topics[key].title;
    a.dataset.target = key + "Section";
    a.className = "navLink";
    // Ícone ilustrativo por tópico:
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
  // Itens extras (Quiz, Lembretes, Favoritos) mantidos no HTML original ou podemos adicionar aqui também se quisermos.
  // Dado que eles já estão no HTML original, não duplicaremos aqui.
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
    const titleEl = sectionEl.querySelector('.sectionTitle');
    const contentEl = sectionEl.querySelector('.sectionContent');
    const reviewEl = sectionEl.querySelector('.reviewQuestions');
    if (titleEl) titleEl.innerText = topics[key].title;
    if (contentEl) contentEl.innerHTML = topics[key].body;
    // Inserir perguntas de revisão (caso ainda não inseridas)
    if (reviewEl && reviewEl.children.length === 0) {
      insertReviewQuestions(key, reviewEl);
    }
  }
  // Após carregar conteúdo, configurar interações (IDs de parágrafos, favoritos)
  setupContentInteractions();
}
loadContent(currentLang);

// Insere perguntas de revisão ao final de cada seção de tópico
function insertReviewQuestions(topicKey, containerEl) {
  containerEl.innerHTML = "";  // limpar caso algo
  let qHtml = "";
  if (topicKey === 'programacao') {
    qHtml = `
      <div class="quiz-question">
        <p><strong>Revisão:</strong> Programação serve principalmente para:</p>
        <label><input type="radio" name="progQ" value="a" /> Traduzir linguagens humanas literalmente para o computador.</label><br/>
        <label><input type="radio" name="progQ" value="b" /> Instruir o computador a realizar tarefas.</label><br/>
        <label><input type="radio" name="progQ" value="c" /> Construir equipamentos de hardware.</label><br/>
        <label><input type="radio" name="progQ" value="d" /> Proteger dados contra ataques.</label><br/>
        <button type="button" onclick="checkQuiz('progQ','b')">Verificar</button>
        <p class="feedback" id="progQFeedback"></p>
      </div>
    `;
  } else if (topicKey === 'ciberseguranca') {
    qHtml = `
      <div class="quiz-question">
        <p><strong>Revisão:</strong> Qual das alternativas <u>não</u> é um exemplo de ameaça cibernética?</p>
        <label><input type="radio" name="ciberQ" value="a" /> Phishing</label><br/>
        <label><input type="radio" name="ciberQ" value="b" /> Ransomware</label><br/>
        <label><input type="radio" name="ciberQ" value="c" /> DDoS</label><br/>
        <label><input type="radio" name="ciberQ" value="d" /> Backup de dados</label><br/>
        <button type="button" onclick="checkQuiz('ciberQ','d')">Verificar</button>
        <p class="feedback" id="ciberQFeedback"></p>
      </div>
    `;
  } else if (topicKey === 'ia') {
    qHtml = `
      <div class="quiz-question">
        <p><strong>Revisão:</strong> O ChatGPT é um exemplo de:</p>
        <label><input type="radio" name="iaQ" value="a" /> Malware de inteligência artificial.</label><br/>
        <label><input type="radio" name="iaQ" value="b" /> Chatbot baseado em IA generativa.</label><br/>
        <label><input type="radio" name="iaQ" value="c" /> Ataque de phishing em larga escala.</label><br/>
        <label><input type="radio" name="iaQ" value="d" /> Aplicativo de programação em bloco.</label><br/>
        <button type="button" onclick="checkQuiz('iaQ','b')">Verificar</button>
        <p class="feedback" id="iaQFeedback"></p>
      </div>
    `;
  } else if (topicKey === 'productOwner') {
    qHtml = `
      <div class="quiz-question">
        <p><strong>Revisão:</strong> No contexto do Scrum, o Product Owner é responsável por:</p>
        <label><input type="radio" name="poQ" value="a" /> Escrever todo o código do produto.</label><br/>
        <label><input type="radio" name="poQ" value="b" /> Representar os interesses do cliente e priorizar funcionalidades.</label><br/>
        <label><input type="radio" name="poQ" value="c" /> Gerenciar diretamente a equipe de desenvolvedores.</label><br/>
        <label><input type="radio" name="poQ" value="d" /> Garantir a segurança cibernética do projeto.</label><br/>
        <button type="button" onclick="checkQuiz('poQ','b')">Verificar</button>
        <p class="feedback" id="poQFeedback"></p>
      </div>
    `;
  }
  containerEl.insertAdjacentHTML('beforeend', qHtml);
}

// Mapeamento de explicações para respostas (quiz e revisão)
const explanations = {
  "progQ": "Programação serve para instruir o computador a realizar tarefas, através de código.",
  "ciberQ": "Phishing, Ransomware e DDoS são tipos de ataques; já backup de dados é uma medida de proteção, não uma ameaça.",
  "iaQ": "O ChatGPT é um chatbot de IA generativa, capaz de produzir texto similar ao humano.",
  "poQ": "O Product Owner representa os clientes e prioriza funcionalidades no backlog para gerar mais valor ao negócio.",
  "q1": "HTML é uma linguagem de marcação, não é usada para programar lógica como Python, Java ou C++.",
  "q2": "Usar senhas fortes é boa prática. Clicar em links suspeitos, compartilhar senhas e ignorar atualizações são comportamentos inseguros.",
  "q3": "IA generativa pode criar conteúdo novo (como imagens a partir de texto). Organizar arquivos ou criptografar dados não são exemplos de geração de conteúdo.",
  "q4": "O Product Owner gerencia o backlog do produto. Arquitetura e segurança são funções de outros papéis, e o time de desenvolvimento se auto-organiza nas tarefas diárias."
};

// Configura IDs para parágrafos e adiciona botão de favoritos e outros eventos nas seções de conteúdo
function setupContentInteractions() {
  // Para cada seção de conteúdo, atribuir IDs únicos aos parágrafos e itens de lista, e configurar botão de favorito
  const contentSections = ['programacaoSection','cibersegurancaSection','iaSection','productOwnerSection'];
  contentSections.forEach(secId => {
    const sec = document.getElementById(secId);
    if (!sec) return;
    const contentDiv = sec.querySelector('.sectionContent');
    if (!contentDiv) return;
    // Atribuir IDs e inserir botão de favorito em cada parágrafo e <li>
    let index = 0;
    const elements = contentDiv.querySelectorAll('p, li');
    elements.forEach(elem => {
      const paraId = secId.replace('Section','') + "-para-" + index;
      elem.id = paraId;
      // Se o elemento já tiver um fav-btn, removê-lo (para não duplicar ao trocar idioma)
      const oldFav = elem.querySelector('.fav-btn');
      if (oldFav) oldFav.remove();
      // Criar botão de favorito
      const favBtn = document.createElement('button');
      favBtn.className = 'fav-btn';
      favBtn.innerText = isFavorite(paraId) ? "★" : "☆";
      favBtn.title = isFavorite(paraId) ? "Remover dos favoritos" : "Adicionar aos favoritos";
      favBtn.onclick = () => toggleFavorite(secId.replace('Section',''), paraId, elem.innerText);
      elem.appendChild(favBtn);
      index++;
    });
  });
}

// Verifica se um determinado parágrafo (id) já está nos favoritos do usuário atual
function isFavorite(paraId) {
  if (!currentUser || !userData[currentUser]) return false;
  return userData[currentUser].favorites.some(fav => fav.id === paraId && fav.lang === currentLang);
}

// Adiciona/remove favorito
function toggleFavorite(topicKey, paraId, text) {
  if (!currentUser) return;
  const favList = userData[currentUser].favorites;
  const existingIndex = favList.findIndex(f => f.id === paraId && f.lang === currentLang);
  if (existingIndex >= 0) {
    // Remover favorito
    favList.splice(existingIndex, 1);
    showNotification("Favorito removido.");
    // Atualiza ícone do botão no conteúdo
    const elem = document.getElementById(paraId);
    if (elem) {
      const btn = elem.querySelector('.fav-btn');
      if (btn) {
        btn.innerText = "☆";
        btn.title = "Adicionar aos favoritos";
      }
    }
  } else {
    // Adicionar favorito
    favList.push({ topic: topicKey, id: paraId, text: text, lang: currentLang });
    showNotification("Adicionado aos favoritos!");
    // Atualiza ícone no conteúdo
    const elem = document.getElementById(paraId);
    if (elem) {
      const btn = elem.querySelector('.fav-btn');
      if (btn) {
        btn.innerText = "★";
        btn.title = "Remover dos favoritos";
      }
    }
  }
  localStorage.setItem('userData', JSON.stringify(userData));
}

// Renderiza lista de favoritos na seção de Favoritos
function renderFavorites() {
  if (!currentUser || !userData[currentUser]) return;
  const favListEl = document.getElementById('favoritesList');
  const noFavMsg = document.getElementById('noFavoritesMsg');
  favListEl.innerHTML = '';
  const favs = userData[currentUser].favorites.filter(f => f.lang === currentLang);
  if (favs.length === 0) {
    noFavMsg.style.display = 'block';
  } else {
    noFavMsg.style.display = 'none';
    favs.forEach((fav, idx) => {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = "#";
      link.textContent = `"${fav.text.substring(0, 60)}..." (${contentData[currentLang][fav.topic].title})`;
      link.onclick = (e) => {
        e.preventDefault();
        // Navega para a seção correspondente e destaca o trecho
        showSection(fav.topic + 'Section');
        const targetElem = document.getElementById(fav.id);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: 'smooth' });
          targetElem.style.backgroundColor = 'yellow';
          setTimeout(() => { targetElem.style.backgroundColor = ''; }, 2000);
        }
      };
      li.appendChild(link);
      // Botão para remover dos favoritos diretamente da lista
      const removeBtn = document.createElement('button');
      removeBtn.textContent = "✖";
      removeBtn.title = "Remover";
      removeBtn.onclick = () => {
        userData[currentUser].favorites.splice(idx, 1);
        localStorage.setItem('userData', JSON.stringify(userData));
        renderFavorites();
        // Também atualizar possível estrela no conteúdo (se a seção estiver carregada)
        const contentElem = document.getElementById(fav.id);
        if (contentElem) {
          const star = contentElem.querySelector('.fav-btn');
          if (star) {
            star.innerText = "☆";
            star.title = "Adicionar aos favoritos";
          }
        }
      };
      li.appendChild(removeBtn);
      favListEl.appendChild(li);
    });
  }
}

// Renderiza dados do perfil do aluno (progresso e conquistas)
function renderProfile() {
  if (!currentUser || !userData[currentUser]) return;
  document.getElementById('profileName').innerText = currentUser;
  // Progresso: quantos tópicos concluídos de quantos
  const completedTopics = userData[currentUser].completedTopics;
  const totalTopics = Object.keys(contentData[currentLang]).length;
  const progressPercent = Math.round((completedTopics.length / totalTopics) * 100);
  document.getElementById('profileProgress').innerText = `${completedTopics.length} de ${totalTopics} lições (${progressPercent}%)`;
  // Lista de lições concluídas
  const completedListEl = document.getElementById('completedList');
  completedListEl.innerHTML = '';
  completedTopics.forEach(topicKey => {
    const li = document.createElement('li');
    li.textContent = contentData[currentLang][topicKey].title;
    completedListEl.appendChild(li);
  });
  // Lista de conquistas
  const achievementsEl = document.getElementById('achievementsList');
  achievementsEl.innerHTML = '';
  userData[currentUser].achievements.forEach(achv => {
    const li = document.createElement('li');
    li.textContent = achv;
    achievementsEl.appendChild(li);
  });
}

// Renderiza o painel administrativo (lista de usuários e estatísticas)
function renderAdminPanel() {
  const userListEl = document.getElementById('userListStats');
  userListEl.innerHTML = '';
  for (let email in users) {
    const stats = userData[email] || {};
    const completedCount = stats.completedTopics ? stats.completedTopics.length : 0;
    const totalTopics = Object.keys(contentData[currentLang]).length;
    const score = stats.highScore !== undefined ? stats.highScore + "/" + Object.keys(explanations).filter(k=>k.startsWith('q') && k.length===2).length : "N/A";
    const remCount = stats.reminders ? stats.reminders.length : 0;
    const achCount = stats.achievements ? stats.achievements.length : 0;
    const li = document.createElement('li');
    li.innerText = `${email} – Lições concluídas: ${completedCount}/${totalTopics}, Melhor pontuação Quiz: ${score}, Lembretes: ${remCount}, Conquistas: ${achCount}`;
    userListEl.appendChild(li);
  }
}

// Aplica um tema visual de acordo com modo (light, dark, high-contrast, night-mode, fun-theme)
function applyTheme(theme) {
  document.body.classList.remove('dark','high-contrast','night-mode','fun-theme');
  switch(theme) {
    case 'dark':
      document.body.classList.add('dark');
      document.getElementById('themeToggle').textContent = '☀';
      document.getElementById('themeToggle').setAttribute('aria-label', 'Alternar para modo claro');
      break;
    case 'high-contrast':
      document.body.classList.add('high-contrast');
      document.getElementById('themeToggle').textContent = '⬛';
      document.getElementById('themeToggle').setAttribute('aria-label', 'Alternar para alto contraste');
      break;
    case 'night':
      document.body.classList.add('dark','night-mode');
      document.getElementById('themeToggle').textContent = '🌙';
      document.getElementById('themeToggle').setAttribute('aria-label', 'Alternar para modo de estudo noturno');
      break;
    case 'fun':
      document.body.classList.add('fun-theme');
      document.getElementById('themeToggle').textContent = '🎨';
      document.getElementById('themeToggle').setAttribute('aria-label', 'Alternar para tema divertido');
      break;
    default:
      // Light mode
      document.getElementById('themeToggle').textContent = '☾';
      document.getElementById('themeToggle').setAttribute('aria-label', 'Alternar para modo escuro');
      break;
  }
}

// Alterna temas em sequência (light -> dark -> high-contrast -> night -> fun -> light)
const themeSequence = ['light','dark','high-contrast','night','fun'];
let themeIndex = themeSequence.indexOf(savedTheme);
document.getElementById('themeToggle').addEventListener('click', function() {
  themeIndex = (themeIndex + 1) % themeSequence.length;
  const newTheme = themeSequence[themeIndex];
  applyTheme(newTheme);
  localStorage.setItem('theme', newTheme === 'light' ? 'light' : newTheme);
});

// Alternância de idioma
document.getElementById('languageSelect').addEventListener('change', function() {
  const newLang = this.value;
  loadContent(newLang);
  renderTopicsList();
  // Se perfil ou admin ou favoritos estiverem abertos, re-renderizar para refletir idioma (se aplicável)
  if (document.getElementById('profileSection').style.display !== 'none') renderProfile();
  if (document.getElementById('adminSection').style.display !== 'none') renderAdminPanel();
  if (document.getElementById('favoritesSection').style.display !== 'none') renderFavorites();
});

// Função para limpar recursos ao mudar de seção
function cleanupResources() {
  // Parar leitura de texto
  window.speechSynthesis.cancel();
  
  // Limpar timer do quiz se ativo
  if (quizTimer) {
    clearInterval(quizTimer);
    quizTimer = null;
  }
  
  // Parar reprodução de vídeos
  document.querySelectorAll('video').forEach(video => {
    if (!video.paused) video.pause();
  });
}

// Versão melhorada de showSection com limpeza de recursos
function showSection(sectionId) {
  // Limpar recursos da seção anterior
  cleanupResources();
  
  sectionIds.forEach(id => {
    const secEl = document.getElementById(id);
    if (!secEl) return;
    if (id === sectionId) {
      secEl.style.display = 'block';
      secEl.classList.add('fade-in');
      secEl.addEventListener('animationend', () => {
        secEl.classList.remove('fade-in');
      }, { once: true });
    } else {
      secEl.style.display = 'none';
    }
  });
  
  currentSectionId = sectionId.endsWith('Section') && 
                    sectionId !== 'homeSection' && 
                    sectionId !== 'loginSection' ? sectionId : null;
  
  // Ações especiais ao mostrar certas seções
  if (sectionId === 'adminSection') renderAdminPanel();
  if (sectionId === 'profileSection') renderProfile();
  if (sectionId === 'favoritesSection') renderFavorites();
  if (sectionId === 'homeSection') {
    renderTopicsList();
  }
  
  // Configurar temporizador do quiz
  if (sectionId === 'quizSection') {
    // Limpar resultados anteriores
    document.getElementById('quizResult').style.display = 'none';
    
    // Reiniciar timer
    quizTimeRemaining = quizTimePerQuestion * 4; // 4 perguntas
    document.getElementById('timerDisplay').innerText = formatTime(quizTimeRemaining);
    
    quizTimer = setInterval(() => {
      quizTimeRemaining--;
      document.getElementById('timerDisplay').innerText = formatTime(quizTimeRemaining);
      
      if (quizTimeRemaining <= 0) {
        clearInterval(quizTimer);
        quizTimer = null;
        finishQuiz();
        showNotification("Tempo do quiz encerrado.");
      }
    }, 1000);
  }
  
  // Verificar lembretes ao entrar na seção de lembretes
  if (sectionId === 'remindersSection') {
    renderReminders();
    checkDueReminders();
  }
}

// Função auxiliar para formatar tempo em MM:SS
function formatTime(seconds) {
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  return mm + ":" + ss;
}

// Função de verificação do Quiz (tanto revisão quanto quiz final)
function checkQuiz(qName, correctValue) {
  const options = document.getElementsByName(qName);
  let selected = null;
  for (let opt of options) {
    if (opt.checked) { selected = opt.value; break; }
  }
  const feedbackEl = document.getElementById(qName + 'Feedback');
  if (!feedbackEl) return;
  
  if (selected === null) {
    feedbackEl.style.color = 'orange';
    feedbackEl.textContent = 'Por favor, selecione uma opção.';
    return false; // Adicionado retorno para verificar se resposta foi selecionada
  } 
  
  const isCorrect = selected === correctValue;
  feedbackEl.style.color = isCorrect ? 'green' : 'red';
  feedbackEl.textContent = isCorrect ? 
    'Correto! ' + (explanations[qName] || '') : 
    'Incorreto. ' + (explanations[qName] || '');
    
  // Atualizar estatísticas para quiz final
  if (qName.startsWith('q') && currentUser && userData[currentUser]) {
    if (!userData[currentUser].quizStats) {
      userData[currentUser].quizStats = { attempts: 0, correct: 0 };
    }
    userData[currentUser].quizStats.attempts++;
    if (isCorrect) userData[currentUser].quizStats.correct++;
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  
  return isCorrect;
}

// Dados de lembretes específicos do usuário atual
function renderReminders() {
  const listEl = document.getElementById('reminderList');
  const noMsg = document.getElementById('noRemindersMsg');
  listEl.innerHTML = '';
  let remindersArr = [];
  if (currentUser && userData[currentUser]) {
    remindersArr = userData[currentUser].reminders || [];
  }
  if (remindersArr.length === 0) {
    noMsg.style.display = 'block';
  } else {
    noMsg.style.display = 'none';
    remindersArr.forEach((rem, index) => {
      const li = document.createElement('li');
      let text = rem.text;
      if (rem.due) {
        const dueDate = new Date(rem.due);
        text += ' – ' + dueDate.toLocaleString();
        if (dueDate.getTime() <= Date.now()) {
          li.classList.add('due');
        }
      }
      li.textContent = text;
      // botão de exclusão
      const delBtn = document.createElement('button');
      delBtn.textContent = '✖';
      delBtn.className = 'delete-btn';
      delBtn.onclick = () => {
        userData[currentUser].reminders.splice(index, 1);
        localStorage.setItem('userData', JSON.stringify(userData));
        renderReminders();
      };
      li.appendChild(delBtn);
      listEl.appendChild(li);
    });
  }
}

// Verificação melhorada de lembretes com alerta sonoro configurável
function checkDueReminders(suppressNotification = false) {
  if (!currentUser || !userData[currentUser]) return;
  
  let notifiedThisCycle = false;
  let dueCounted = 0;
  
  userData[currentUser].reminders.forEach((rem, idx) => {
    // Verificar se o lembrete está vencido
    const isDue = rem.due && new Date(rem.due).getTime() <= Date.now();
    
    if (isDue) {
      dueCounted++;
      
      if (!rem.notified && !suppressNotification) {
        showNotification('Lembrete: ' + rem.text + ' - estava agendado para agora.');
        
        // Alerta sonoro apenas para o primeiro lembrete vencido
        if (!notifiedThisCycle && !userData[currentUser].settings?.muteSounds) {
          beep();
          notifiedThisCycle = true;
        }
        
        // Marcar como notificado
        userData[currentUser].reminders[idx].notified = true;
      }
    }
  });
  
  // Atualizar contador na interface (se houver)
  const reminderCounter = document.getElementById('reminderCounter');
  if (reminderCounter && dueCounted > 0) {
    reminderCounter.textContent = dueCounted.toString();
    reminderCounter.style.display = 'inline-block';
  } else if (reminderCounter) {
    reminderCounter.style.display = 'none';
  }
  
  localStorage.setItem('userData', JSON.stringify(userData));
  return dueCounted;
}

// Melhorar a função de beep com configurações de volume
function beep(frequency = 440, duration = 500, volume = 0.5) {
  try {
    if (!window.audioCtx) {
      window.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    const oscillator = window.audioCtx.createOscillator();
    const gainNode = window.audioCtx.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, window.audioCtx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, window.audioCtx.currentTime);
    
    oscillator.connect(gainNode);
    gainNode.connect(window.audioCtx.destination);
    
    oscillator.start();
    oscillator.stop(window.audioCtx.currentTime + duration/1000);
  } catch (e) {
    console.error('Erro ao reproduzir som', e);
  }
}

// Notificação visual (canto inferior)
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  // Evita sobreposição de múltiplas notificações
  const existingNotifs = document.querySelectorAll('.notification');
  notification.style.bottom = (20 + existingNotifs.length * 60) + 'px';
  document.body.appendChild(notification);
  // Exibe com animação
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  // Oculta após 5 segundos
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 500);
  }, 5000);
}

// Eventos de interface:

// Formulário de Login/Registro
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const emailInput = document.getElementById('email');
  const passInput = document.getElementById('password');
  const emailVal = emailInput.value.trim();
  const passVal = passInput.value;
  const messageEl = document.getElementById('loginMessage');
  
  // Validações iniciais (já existentes)
  if (emailVal === '' || passVal === '') {
    messageEl.style.color = 'red';
    messageEl.textContent = 'Por favor, preencha e-mail e senha.';
    return;
  }
  
  // Simples validação de e-mail para registro
  if (registerMode && !emailVal.includes('@')) {
    messageEl.style.color = 'red';
    messageEl.textContent = 'E-mail inválido.';
    return;
  }
  
  // Proteção contra bots: checar campo oculto
  const botField = document.getElementById('botCheck');
  if (registerMode && botField.value) {
    messageEl.style.color = 'red';
    messageEl.textContent = 'Falha no registro.';
    return;
  }
  
  if (registerMode) {
    // Fluxo de registro
    if (users[emailVal]) {
      messageEl.style.color = 'red';
      messageEl.textContent = 'E-mail já registrado. Escolha outro ou faça login.';
    } else {
      // Gera salt e hash da senha antes de salvar
      const salt = generateSalt();
      
      try {
        crypto.subtle.digest('SHA-256', new TextEncoder().encode(passVal + salt))
          .then(hashBuffer => {
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            
            // Criar usuário
            users[emailVal] = { salt: salt, hash: hashHex };
            localStorage.setItem('users', JSON.stringify(users));
            
            // Criar perfil inicial
            userData[emailVal] = {
              completedTopics: [],
              reminders: [],
              favorites: [],
              achievements: [],
              highScore: 0,
              notes: {},
              progress: {},
              quizStats: { attempts: 0, correct: 0 },
              lastLogin: new Date().toISOString()
            };
            
            localStorage.setItem('userData', JSON.stringify(userData));
            localStorage.setItem('loggedInUser', emailVal);
            currentUser = emailVal;
            messageEl.textContent = '';
            startApp();
          })
          .catch(error => {
            console.error("Erro ao criar hash:", error);
            messageEl.style.color = 'red';
            messageEl.textContent = 'Erro ao processar o registro. Tente novamente.';
          });
      } catch (error) {
        console.error("Erro no crypto API:", error);
        // Fallback para método básico se crypto API falhar
        const simpleHash = btoa(passVal + salt); // Não é seguro, apenas fallback
        users[emailVal] = { salt: salt, hash: simpleHash, method: 'basic' };
        localStorage.setItem('users', JSON.stringify(users));
        
        // Criar perfil inicial (mesmo código de acima)
        userData[emailVal] = {
          completedTopics: [],
          reminders: [],
          favorites: [],
          achievements: [],
          highScore: 0,
          notes: {},
          progress: {},
          quizStats: { attempts: 0, correct: 0 },
          lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('loggedInUser', emailVal);
        currentUser = emailVal;
        messageEl.textContent = '';
        startApp();
      }
    }
  } else {
    // Fluxo de login
    if (!users[emailVal]) {
      messageEl.style.color = 'red';
      messageEl.textContent = 'Usuário não encontrado. Verifique o e-mail ou registre-se.';
      loginAttempts++;
    } else {
      // Verifica hash da senha com salt
      const { salt, hash } = users[emailVal];
      crypto.subtle.digest('SHA-256', new TextEncoder().encode(passVal + salt)).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        if (hash === hashHex) {
          localStorage.setItem('loggedInUser', emailVal);
          currentUser = emailVal;
          messageEl.textContent = '';
          loginAttempts = 0;
          startApp();
        } else {
          messageEl.style.color = 'red';
          messageEl.textContent = 'Senha incorreta. Tente novamente.';
          loginAttempts++;
        }
      });
    }
  }
  
  // Bloqueio após tentativas excessivas de login
  if (loginAttempts >= 3) {
    loginAttempts = 0;
    emailInput.disabled = true;
    passInput.disabled = true;
    document.getElementById('loginBtn').disabled = true;
    messageEl.style.color = 'red';
    messageEl.textContent = 'Muitas tentativas. Tente novamente em 30 segundos.';
    setTimeout(() => {
      emailInput.disabled = false;
      passInput.disabled = false;
      document.getElementById('loginBtn').disabled = false;
      messageEl.textContent = '';
    }, 30000);
  }
});

// Alterna entre modo Login e Registro
document.getElementById('registerLink').addEventListener('click', function(e) {
  e.preventDefault();
  const title = document.getElementById('loginTitle');
  const loginBtn = document.getElementById('loginBtn');
  const toggleText = document.getElementById('toggleLoginRegister');
  if (!registerMode) {
    registerMode = true;
    title.textContent = 'Registrar';
    loginBtn.textContent = 'Registrar';
    toggleText.firstChild.textContent = 'Já tem conta? ';
    this.textContent = 'Entrar';
  } else {
    registerMode = false;
    title.textContent = 'Login';
    loginBtn.textContent = 'Entrar';
    toggleText.firstChild.textContent = 'Não tem uma conta? ';
    this.textContent = 'Registre-se';
  }
});

// Navegação por clique nos links de seção
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('navLink')) {
    e.preventDefault();
    showSection(e.target.dataset.target);
  }
});

// Adicione o evento para os botões de "Voltar"
document.querySelectorAll('.backButton').forEach(button => {
  button.addEventListener('click', function() {
    showSection(button.dataset.target);
  });
});

document.getElementById('homeBtn').addEventListener('click', function() {
  showSection('homeSection');
});

document.getElementById('logoutBtn').addEventListener('click', function() {
  localStorage.removeItem('loggedInUser');
  currentUser = null;
  location.reload();
});

document.getElementById('profileBtn').addEventListener('click', function() {
  showSection('profileSection');
});

// Sincronização (placeholder para integração com backend)
document.getElementById('syncBtn').addEventListener('click', function() {
  if (!navigator.onLine) {
    showNotification('Você está offline no momento. Conecte-se à internet para sincronizar.');
    return;
  }
  const icon = this.querySelector('.sync-icon');
  this.disabled = true;
  if (icon) icon.classList.add('rotating');
  setTimeout(() => {
    // Aqui poderíamos enviar/receber dados para Firebase/Supabase, etc.
    localStorage.setItem('contentData', JSON.stringify(contentData));
    if (icon) icon.classList.remove('rotating');
    this.disabled = false;
    showNotification('Conteúdo atualizado com sucesso!');
  }, 1500);
});

// Formulário de Lembretes
document.getElementById('reminderForm').addEventListener('submit', function(e) {
  e.preventDefault();
  if (!currentUser) return;
  const textVal = document.getElementById('reminderText').value;
  const dateVal = document.getElementById('reminderDate').value;
  if (textVal.trim() === '') return;
  const newRem = { text: textVal.trim(), notified: false };
  if (dateVal) newRem.due = dateVal;
  userData[currentUser].reminders.push(newRem);
  localStorage.setItem('userData', JSON.stringify(userData));
  document.getElementById('reminderText').value = '';
  document.getElementById('reminderDate').value = '';
  renderReminders();
  // Conquista: primeiro lembrete
  if (userData[currentUser].reminders.length === 1) {
    unlockAchievement("Lembreteiro: primeiro lembrete adicionado");
  }
});

// Eventos de leitura em voz alta (Web Speech API)
document.querySelectorAll('.tts-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const section = btn.closest('section');
    if (!section) return;
    const contentText = section.querySelector('.sectionContent').innerText;
    speakText(contentText);
  });
});
function speakText(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = (currentLang === 'en') ? 'en-US' : 'pt-BR';
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

// Evento de exportação de dados (JSON)
document.getElementById('exportDataBtn').addEventListener('click', function() {
  if (!currentUser) return;
  const dataStr = JSON.stringify(userData[currentUser], null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `dados_${currentUser}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

// Salvar anotações em tempo real e conquista por anotar
document.querySelectorAll('.notesSection textarea').forEach(textarea => {
  textarea.addEventListener('input', () => {
    if (!currentUser) return;
    const topic = textarea.id.replace('Notes','');
    userData[currentUser].notes[topic] = textarea.value;
    localStorage.setItem('userData', JSON.stringify(userData));
    if (textarea.value.trim().length === 1) {
      unlockAchievement("Autor: primeira anotação adicionada");
    }
  });
});

// Função para conceder conquista ao usuário atual
function unlockAchievement(name) {
  if (!currentUser) return;
  const achList = userData[currentUser].achievements;
  if (!achList.includes(name)) {
    achList.push(name);
    localStorage.setItem('userData', JSON.stringify(userData));
    showNotification("🎉 Nova conquista: " + name);
  }
}

// Funções e variáveis para Quiz final
const correctAnswers = { q1:'c', q2:'a', q3:'b', q4:'a' };
let quizTimeRemaining = 0;
function finishQuiz() {
  // Calcula pontuação
  let total = Object.keys(correctAnswers).length;
  let correctCount = 0;
  
  for (let q in correctAnswers) {
    const selected = Array.from(document.getElementsByName(q))
      .find(opt => opt.checked);
    
    if (selected && selected.value === correctAnswers[q]) {
      correctCount++;
    }
  }
  
  // Exibe resultado
  document.getElementById('scoreCount').innerText = correctCount.toString();
  document.getElementById('scoreTotal').innerText = total.toString();
  const scoreMsg = document.getElementById('scoreMessage');
  
  if (correctCount === total) {
    scoreMsg.innerText = "Parabéns! Você acertou todas as perguntas!";
    unlockAchievement("Sábio do Quiz: acertou todas as perguntas do quiz");
  } else if (correctCount >= total/2) {
    scoreMsg.innerText = "Bom trabalho! Mas você pode melhorar.";
  } else {
    scoreMsg.innerText = "Que tal revisar o conteúdo e tentar novamente?";
  }
  
  document.getElementById('quizResult').style.display = 'block';
  
  // Atualiza pontuação do usuário
  if (currentUser && userData[currentUser]) {
    userData[currentUser].highScore = Math.max(userData[currentUser].highScore || 0, correctCount);
    localStorage.setItem('userData', JSON.stringify(userData));
  }
}

// "Refazer Quiz"
document.getElementById('restartQuizBtn').addEventListener('click', function() {
  // Limpa seleções e feedback
  ['q1','q2','q3','q4'].forEach(q => {
    document.getElementsByName(q).forEach(opt => opt.checked = false);
    const feedbackEl = document.getElementById(q + 'Feedback');
    if (feedbackEl) { feedbackEl.textContent = ''; }
  });
  document.getElementById('quizResult').style.display = 'none';
  showSection('quizSection');
});

// Versão otimizada do rastreamento de rolagem
window.addEventListener('scroll', debounce(() => {
  if (!currentSectionId || !currentUser) return;
  
  const secEl = document.getElementById(currentSectionId);
  if (!secEl) return;
  
  // Calcula progresso de leitura
  const scrollY = window.scrollY;
  const offsetTop = secEl.offsetTop;
  const sectionHeight = secEl.offsetHeight;
  const windowHeight = window.innerHeight;
  const scrollInSection = scrollY - offsetTop;
  const scrollable = sectionHeight - windowHeight;
  
  let progress = 0;
  if (scrollable > 0) {
    progress = Math.min(1, Math.max(0, scrollInSection / scrollable));
  } else {
    progress = 1;
  }
  
  const bar = secEl.querySelector('.progress-bar');
  if (bar) bar.style.width = (progress * 100) + "%";
  
  // Salva progresso temporário (mesmo antes de concluir)
  const topicKey = currentSectionId.replace('Section','');
  if (!userData[currentUser].progress) userData[currentUser].progress = {};
  userData[currentUser].progress[topicKey] = progress;
  localStorage.setItem('userData', JSON.stringify(userData));
  
  // Marcar lição como concluída se leu até ~95%
  if (progress >= 0.95) {
    if (!userData[currentUser].completedTopics.includes(topicKey)) {
      userData[currentUser].completedTopics.push(topicKey);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Atualizar visualização da lista de tópicos
      renderTopicsList();
      
      // Conquistas de conclusão de lição
      if (userData[currentUser].completedTopics.length === 1) {
        unlockAchievement("Primeiro Passo: primeira lição concluída");
      }
      if (userData[currentUser].completedTopics.length === Object.keys(contentData[currentLang]).length) {
        unlockAchievement("Conquistador: todas as lições concluídas");
      }
      
      showNotification(`Parabéns! Você concluiu a lição: ${contentData[currentLang][topicKey].title}`);
    }
  }
}, 200));

// Função auxiliar de debounce para melhorar performance
function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Inicia aplicação pós-login
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
  // Atualiza lista de tópicos (inclui link Admin se for admin)
  renderTopicsList();
  // Renderiza lembretes e anotações do usuário atual
  renderReminders();
  if (userData[currentUser].notes) {
    for (let topic in userData[currentUser].notes) {
      const noteArea = document.getElementById(topic + 'Notes');
      if (noteArea) noteArea.value = userData[currentUser].notes[topic];
    }
  } else {
    userData[currentUser].notes = {};
  }
  // Verificação periódica de lembretes vencidos
  setInterval(checkDueReminders, 60000);
  
  // Adicionar backup automático
  autoBackupUserData();
  setInterval(autoBackupUserData, 30 * 60 * 1000); // Backup a cada 30 minutos
  
  // Inicializar dados do usuário e garantir consistência
  const userProfile = initUserData(currentUser);
  
  // Conquista de login diário
  const lastLogin = userProfile.lastLogin ? new Date(userProfile.lastLogin) : null;
  const today = new Date();
  if (lastLogin && 
      lastLogin.getDate() !== today.getDate() && 
      (today - lastLogin) < 2 * 24 * 60 * 60 * 1000) { // menos de 2 dias
    unlockAchievement("Estudante Dedicado: login em dias consecutivos");
  }
}

// Auto-login se usuário já autenticado anteriormente
if (currentUser) {
  startApp();
}

// Registro do Service Worker (PWA)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(err => console.error("SW registration failed:", err));
}

// Função para gerar salt aleatório para senhas
function generateSalt() {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
  let salt = '';
  for (let i = 0; i < 16; i++) {
    salt += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return salt;
}

// Verificar inatividade periodicamente
setInterval(() => {
  if (currentUser && (Date.now() - lastActivity > SESSION_TIMEOUT)) {
    showNotification("Sessão expirada por inatividade");
    localStorage.removeItem('loggedInUser');
    currentUser = null;
    location.reload();
  }
}, 60000); // Verificar a cada minuto

// Atualizar timestamp de última atividade em interações do usuário
document.addEventListener('click', () => lastActivity = Date.now());
document.addEventListener('keydown', () => lastActivity = Date.now());
document.addEventListener('mousemove', () => lastActivity = Date.now());

// Função para backup automático
function autoBackupUserData() {
  if (!currentUser) return;
  
  try {
    // Criar cópia para backup
    const backupKey = `tecnoclass_backup_${currentUser}`;
    const backupTimestamp = new Date().toISOString();
    const backupData = {
      timestamp: backupTimestamp,
      userData: userData[currentUser]
    };
    
    localStorage.setItem(backupKey, JSON.stringify(backupData));
    console.log(`Backup automático realizado: ${backupTimestamp}`);
    
    // Limitar a 5 backups por usuário
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(`tecnoclass_backup_${currentUser}`)) {
        keys.push(key);
      }
    }
    
    if (keys.length > 5) {
      // Ordenar por data e remover os mais antigos
      keys.sort();
      while (keys.length > 5) {
        localStorage.removeItem(keys.shift());
      }
    }
  } catch (err) {
    console.error("Erro ao fazer backup:", err);
  }
}

// Função para inicializar dados do usuário de forma consistente
function initUserData(email) {
  if (!userData[email]) {
    userData[email] = {
      completedTopics: [],
      reminders: [],
      favorites: [],
      achievements: [],
      highScore: 0,
      notes: {},
      progress: {},
      quizStats: { attempts: 0, correct: 0 },
      lastLogin: new Date().toISOString()
    };
  } else {
    // Garantir que todos os campos existam no perfil
    const defaults = {
      completedTopics: [],
      reminders: [],
      favorites: [],
      achievements: [],
      highScore: 0,
      notes: {},
      progress: {},
      quizStats: { attempts: 0, correct: 0 }
    };
    
    for (const key in defaults) {
      if (!userData[email][key]) {
        userData[email][key] = defaults[key];
      }
    }
    
    // Atualizar data de último login
    userData[email].lastLogin = new Date().toISOString();
  }
  
  localStorage.setItem('userData', JSON.stringify(userData));
  return userData[email];
}

// Adicionar manipulador global de erros
window.addEventListener('error', function(event) {
  const errorDetails = {
    message: event.message,
    source: event.filename,
    lineNo: event.lineno,
    colNo: event.colno,
    error: event.error ? event.error.stack : null,
    date: new Date().toISOString(),
    userAgent: navigator.userAgent,
    currentUser: currentUser ? currentUser : 'not-logged-in',
    currentSection: currentSectionId
  };
  
  // Salvar no localStorage para diagnóstico
  try {
    const errors = JSON.parse(localStorage.getItem('tecnoclass_errors') || '[]');
    errors.push(errorDetails);
    // Manter até 10 erros mais recentes
    while (errors.length > 10) errors.shift();
    localStorage.setItem('tecnoclass_errors', JSON.stringify(errors));
  } catch (e) {
    console.error("Não foi possível salvar detalhes do erro:", e);
  }
  
  // Mostrar notificação de erro para o usuário
  showNotification("Ocorreu um erro. Recarregue a página se o problema persistir.");
  
  console.error("Erro capturado:", errorDetails);
  
  // Adicionar botão de relatar erro apenas se não existir já
  if (!document.getElementById('reportErrorBtn')) {
    const btn = document.createElement('button');
    btn.id = 'reportErrorBtn';
    btn.className = 'error-report-btn';
    btn.textContent = '⚠️ Relatar erro';
    btn.onclick = reportError;
    document.body.appendChild(btn);
  }
});

// Função para relatar erros
function reportError() {
  const errors = JSON.parse(localStorage.getItem('tecnoclass_errors') || '[]');
  
  // Criar corpo do e-mail (ou preparar dados para envio)
  let body = "Detalhes do erro:\n\n";
  if (errors.length > 0) {
    body += JSON.stringify(errors[errors.length - 1], null, 2);
  } else {
    body += "Nenhum erro registrado";
  }
  
  // Formatar para e-mail (ou poderia enviar para servidor)
  const mailtoLink = `mailto:suporte@example.com?subject=Relatório de Erro TecnoClass&body=${encodeURIComponent(body)}`;
  
  // Abrir janela de e-mail
  window.open(mailtoLink);
  
  // Remover botão após clicar
  const btn = document.getElementById('reportErrorBtn');
  if (btn) btn.remove();
  
  showNotification("Obrigado por relatar o problema!");
}



