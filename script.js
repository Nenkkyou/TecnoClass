"use strict";

// Adicionar esta função no início do script, após as declarações de variáveis
function checkBrowserCompatibility() {
  const features = {
    localStorage: typeof localStorage !== 'undefined',
    speechSynthesis: 'speechSynthesis' in window,
    serviceWorker: 'serviceWorker' in navigator
  };
  
  let incompatibleFeatures = [];
  
  for (const [feature, supported] of Object.entries(features)) {
    if (!supported) {
      incompatibleFeatures.push(feature);
    }
  }
  
  if (incompatibleFeatures.length > 0) {
    console.warn('Recursos incompatíveis detectados:', incompatibleFeatures);
    showNotification('Alguns recursos podem não funcionar corretamente neste navegador.', 'warning');
  }
}

// Chamar esta função no início da execução do script
checkBrowserCompatibility();

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

// Adicionar esta função após a função loadContent
function handleMissingResources() {
  // Tratar vídeos que não carregam
  document.querySelectorAll('video').forEach(video => {
    video.addEventListener('error', function() {
      const placeholder = document.createElement('div');
      placeholder.className = 'video-placeholder';
      placeholder.innerHTML = '<p>Vídeo não disponível no momento</p>';
      this.parentNode.replaceChild(placeholder, this);
    });
  });
  
  // Tratar imagens que não carregam
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', function() {
      this.src = 'placeholder.png'; // Imagem de fallback
      this.alt = 'Imagem não disponível';
    });
  });
}

// Chamar esta função após carregar o conteúdo
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
    if (contentEl) {
      // Remover vídeos e links da Wikipedia
      let content = topics[key].body;
      content = content.replace(/<video.*?<\/video>/gs, '');
      content = content.replace(/<p><em>Para saber mais:.*?<\/p>/gs, '');
      content = content.replace(/<p><em>Learn more:.*?<\/p>/gs, '');
      content = content.replace(/<p><em>Exemplo visual:.*?<\/p>/gs, '');
      content = content.replace(/<p><em>Visual example:.*?<\/p>/gs, '');
      contentEl.innerHTML = content;
    }
    // Inserir perguntas de revisão (caso ainda não inseridas)
    if (reviewEl && reviewEl.children.length === 0) {
      insertReviewQuestions(key, reviewEl);
    }
  }
  // Após carregar conteúdo, configurar interações (IDs de parágrafos, favoritos)
  setupContentInteractions();
  
  // Inicializar sistema de notas adesivas
  initStickyNotes();
  
  // Adicionar tratamento para recursos ausentes
  handleMissingResources();
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
  
  // Caso especial para o quiz
  if (sectionId === 'quizSection') {
    showQuizModal();
    return;
  }
  
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
  if (sectionId === 'profileSection') {
    updateProfileView();
  } else if (sectionId === 'adminSection') {
    updateAdminView();
  } else if (sectionId === 'favoritesSection') {
    renderFavorites();
  } else if (sectionId === 'remindersSection') {
    renderReminders();
  }
  
  // Atualizar URL com hash para navegação
  if (sectionId !== 'loginSection') {
    window.location.hash = sectionId;
  }
  
  // Rolar para o topo da seção
  window.scrollTo(0, 0);
  
  // Atualizar barra de progresso se for uma seção de conteúdo
  if (sectionId.endsWith('Section') && 
      !['homeSection', 'loginSection', 'quizSection', 'remindersSection', 
        'favoritesSection', 'profileSection', 'adminSection'].includes(sectionId)) {
    const topicKey = sectionId.replace('Section', '');
    updateProgressBar(topicKey);
  }
}

// Função auxiliar para formatar o tempo do quiz
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Variável para controlar o tempo restante do quiz
let quizTimeRemaining = 0;

// Inicializar modal do quiz
function initQuizModal() {
  // Criar modal do quiz se não existir
  if (!document.getElementById('quizModal')) {
    const modal = document.createElement('div');
    modal.id = 'quizModal';
    modal.className = 'quiz-modal';
    
    const container = document.createElement('div');
    container.className = 'quiz-container';
    
    const header = document.createElement('div');
    header.className = 'quiz-header';
    
    const title = document.createElement('h2');
    title.textContent = 'Quiz Final';
    header.appendChild(title);
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'quiz-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Fechar quiz');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      // Parar timer se estiver ativo
      if (quizTimer) {
        clearInterval(quizTimer);
        quizTimer = null;
      }
    });
    header.appendChild(closeBtn);
    
    container.appendChild(header);
    
    // Clonar conteúdo do quiz para o modal
    const quizContent = document.getElementById('quizSection').cloneNode(true);
    // Remover título e botão de voltar
    quizContent.querySelector('h2').remove();
    const backBtn = quizContent.querySelector('.backButton');
    if (backBtn) backBtn.remove();
    
    container.appendChild(quizContent);
    modal.appendChild(container);
    document.body.appendChild(modal);
    
    // Adicionar evento para botão de refazer quiz no modal
    const restartBtn = modal.querySelector('#restartQuizBtn');
    if (restartBtn) {
      restartBtn.addEventListener('click', function() {
        // Limpa seleções e feedback
        ['q1','q2','q3','q4'].forEach(q => {
          modal.querySelectorAll(`input[name="${q}"]`).forEach(opt => opt.checked = false);
          const feedbackEl = modal.querySelector(`#${q}Feedback`);
          if (feedbackEl) { feedbackEl.textContent = ''; }
        });
        modal.querySelector('#quizResult').style.display = 'none';
        
        // Reiniciar timer
        quizTimeRemaining = quizTimePerQuestion * 4; // 4 perguntas
        modal.querySelector('#timerDisplay').innerText = formatTime(quizTimeRemaining);
        
        if (quizTimer) clearInterval(quizTimer);
        quizTimer = setInterval(() => {
          quizTimeRemaining--;
          modal.querySelector('#timerDisplay').innerText = formatTime(quizTimeRemaining);
          
          if (quizTimeRemaining <= 0) {
            clearInterval(quizTimer);
            quizTimer = null;
            finishQuizModal();
            showNotification("Tempo do quiz encerrado.");
          }
        }, 1000);
      });
    }
    
    // Substituir botões de verificar no modal
    modal.querySelectorAll('button[onclick^="checkQuiz"]').forEach(btn => {
      const onclick = btn.getAttribute('onclick');
      const match = onclick.match(/checkQuiz\('([^']+)','([^']+)'\)/);
      if (match) {
        const qName = match[1];
        const correctValue = match[2];
        btn.removeAttribute('onclick');
        btn.addEventListener('click', () => {
          checkQuizModal(qName, correctValue);
        });
      }
    });
  }
}

// Mostrar modal do quiz
function showQuizModal() {
  const modal = document.getElementById('quizModal');
  if (!modal) return;
  
  // Limpar resultados anteriores
  modal.querySelector('#quizResult').style.display = 'none';
  
  // Reiniciar timer
  quizTimeRemaining = quizTimePerQuestion * 4; // 4 perguntas
  modal.querySelector('#timerDisplay').innerText = formatTime(quizTimeRemaining);
  
  if (quizTimer) clearInterval(quizTimer);
  quizTimer = setInterval(() => {
    quizTimeRemaining--;
    modal.querySelector('#timerDisplay').innerText = formatTime(quizTimeRemaining);
    
    if (quizTimeRemaining <= 0) {
      clearInterval(quizTimer);
      quizTimer = null;
      finishQuizModal();
      showNotification("Tempo do quiz encerrado.");
    }
  }, 1000);
  
  modal.classList.add('show');
}

// Verificar resposta do quiz no modal
function checkQuizModal(qName, correctValue) {
  const modal = document.getElementById('quizModal');
  if (!modal) return;
  
  const options = modal.querySelectorAll(`input[name="${qName}"]`);
  let selected = null;
  for (let opt of options) {
    if (opt.checked) { selected = opt.value; break; }
  }
  const feedbackEl = modal.querySelector(`#${qName}Feedback`);
  if (!feedbackEl) return;
  
  if (selected === null) {
    feedbackEl.style.color = 'orange';
    feedbackEl.textContent = 'Por favor, selecione uma opção.';
    return false;
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

// Finalizar quiz no modal
function finishQuizModal() {
  const modal = document.getElementById('quizModal');
  if (!modal) return;
  
  // Calcula pontuação
  let total = Object.keys(explanations).length;
  let correctCount = 0;
  
  for (let q in explanations) {
    const selected = Array.from(modal.querySelectorAll(`input[name="${q}"]`))
      .find(opt => opt.checked);
    
    if (selected && selected.value === explanations[q]) {
      correctCount++;
    }
  }
  
  // Exibe resultado
  modal.querySelector('#scoreCount').innerText = correctCount.toString();
  modal.querySelector('#scoreTotal').innerText = total.toString();
  const scoreMsg = modal.querySelector('#scoreMessage');
  
  if (correctCount === total) {
    scoreMsg.innerText = "Parabéns! Você acertou todas as perguntas!";
    unlockAchievement("Sábio do Quiz: acertou todas as perguntas do quiz");
  } else if (correctCount >= total/2) {
    scoreMsg.innerText = "Bom trabalho! Mas você pode melhorar.";
  } else {
    scoreMsg.innerText = "Que tal revisar o conteúdo e tentar novamente?";
  }
  
  modal.querySelector('#quizResult').style.display = 'block';
  
  // Atualiza pontuação do usuário
  if (currentUser && userData[currentUser]) {
    userData[currentUser].highScore = Math.max(userData[currentUser].highScore || 0, correctCount);
    localStorage.setItem('userData', JSON.stringify(userData));
  }
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
  
  // Inicializar sistema de notas adesivas
  initStickyNotes();
  
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
  
  // Inicializar quiz modal
  initQuizModal();
  
  // Inicializar quiz modal imediatamente para evitar atraso
  setTimeout(initQuizModal, 100);
  
  // Verificar lembretes imediatamente após login
  checkDueReminders();
}

// Auto-login se usuário já autenticado anteriormente
if (currentUser) {
  startApp();
}

// Registro do Service Worker (PWA)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(err => console.error("SW registration failed:", err));
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

// Inicializar sistema de notas adesivas
function initStickyNotes() {
  document.querySelectorAll('.notesSection').forEach(section => {
    const topicKey = section.querySelector('textarea').id.replace('Notes', '');
    
    // Remover textarea existente
    const textarea = section.querySelector('textarea');
    if (textarea) {
      textarea.style.display = 'none';
    }
    
    // Verificar se já existe o container de notas
    let notesContainer = section.querySelector('.sticky-notes-container');
    if (!notesContainer) {
      // Criar container para notas adesivas
      notesContainer = document.createElement('div');
      notesContainer.className = 'sticky-notes-container';
      section.appendChild(notesContainer);
      
      // Adicionar botão para criar nova nota
      const addBtn = document.createElement('div');
      addBtn.className = 'add-note-btn';
      addBtn.innerHTML = '+';
      addBtn.setAttribute('data-topic', topicKey);
      addBtn.addEventListener('click', showAddNoteForm);
      notesContainer.appendChild(addBtn);
    }
    
    // Carregar notas existentes
    loadStickyNotes(topicKey, notesContainer);
  });
}

// Carregar notas adesivas do usuário
function loadStickyNotes(topicKey, container) {
  if (!currentUser || !userData[currentUser]) return;
  
  // Limpar notas existentes (exceto botão de adicionar)
  const addBtn = container.querySelector('.add-note-btn');
  container.innerHTML = '';
  if (addBtn) container.appendChild(addBtn);
  
  // Verificar se há notas para este tópico
  if (!userData[currentUser].notes) userData[currentUser].notes = {};
  if (!userData[currentUser].notes[topicKey]) userData[currentUser].notes[topicKey] = [];
  
  // Se as notas estiverem em formato antigo (string), converter para array
  if (typeof userData[currentUser].notes[topicKey] === 'string') {
    userData[currentUser].notes[topicKey] = [
      { 
        text: userData[currentUser].notes[topicKey],
        color: 'color-yellow',
        date: new Date().toISOString()
      }
    ];
    localStorage.setItem('userData', JSON.stringify(userData));
  }
  
  // Renderizar cada nota
  userData[currentUser].notes[topicKey].forEach((note, index) => {
    const noteEl = createStickyNote(note, topicKey, index);
    container.insertBefore(noteEl, addBtn);
  });
}

// Criar elemento de nota adesiva
function createStickyNote(note, topicKey, index) {
  const noteEl = document.createElement('div');
  noteEl.className = `sticky-note ${note.color || 'color-yellow'}`;
  
  const content = document.createElement('div');
  content.className = 'sticky-note-content';
  content.textContent = note.text;
  noteEl.appendChild(content);
  
  const dateEl = document.createElement('div');
  dateEl.className = 'sticky-note-date';
  const noteDate = new Date(note.date || new Date());
  dateEl.textContent = noteDate.toLocaleDateString();
  noteEl.appendChild(dateEl);
  
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'sticky-note-delete';
  deleteBtn.innerHTML = '×';
  deleteBtn.setAttribute('aria-label', 'Excluir nota');
  deleteBtn.addEventListener('click', () => {
    deleteNote(topicKey, index);
  });
  noteEl.appendChild(deleteBtn);
  
  return noteEl;
}

// Mostrar formulário para adicionar nota
function showAddNoteForm(e) {
  const topicKey = e.currentTarget.getAttribute('data-topic');
  
  // Criar popup se não existir
  let popup = document.getElementById('noteFormPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'noteFormPopup';
    popup.className = 'note-form-popup';
    
    const form = document.createElement('div');
    form.className = 'note-form';
    
    const colorPicker = document.createElement('div');
    colorPicker.className = 'note-color-picker';
    colorPicker.innerHTML = `
      <div class="color-option color-yellow selected" data-color="color-yellow"></div>
      <div class="color-option color-orange" data-color="color-orange"></div>
      <div class="color-option color-blue" data-color="color-blue"></div>
      <div class="color-option color-green" data-color="color-green"></div>
      <div class="color-option color-pink" data-color="color-pink"></div>
    `;
    form.appendChild(colorPicker);
    
    const textarea = document.createElement('textarea');
    textarea.id = 'noteText';
    textarea.placeholder = 'Escreva sua nota aqui...';
    form.appendChild(textarea);
    
    const buttons = document.createElement('div');
    buttons.className = 'note-form-buttons';
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancelar';
    cancelBtn.className = 'backButton';
    cancelBtn.addEventListener('click', () => {
      popup.classList.remove('show');
    });
    buttons.appendChild(cancelBtn);
    
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Salvar';
    saveBtn.className = 'backButton';
    saveBtn.style.background = 'var(--primary)';
    saveBtn.style.color = 'white';
    saveBtn.addEventListener('click', () => {
      const text = document.getElementById('noteText').value.trim();
      if (text) {
        const selectedColor = document.querySelector('.color-option.selected').getAttribute('data-color');
        addNote(topicKey, text, selectedColor);
        popup.classList.remove('show');
      }
    });
    buttons.appendChild(saveBtn);
    
    form.appendChild(buttons);
    popup.appendChild(form);
    document.body.appendChild(popup);
    
    // Adicionar evento para seleção de cores
    colorPicker.addEventListener('click', (e) => {
      if (e.target.classList.contains('color-option')) {
        document.querySelectorAll('.color-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        e.target.classList.add('selected');
      }
    });
  }
  
  // Limpar e mostrar popup
  document.getElementById('noteText').value = '';
  popup.classList.add('show');
}

// Adicionar nova nota
function addNote(topicKey, text, color) {
  if (!currentUser || !userData[currentUser]) return;
  
  if (!userData[currentUser].notes) userData[currentUser].notes = {};
  if (!userData[currentUser].notes[topicKey]) userData[currentUser].notes[topicKey] = [];
  
  userData[currentUser].notes[topicKey].push({
    text: text,
    color: color || 'color-yellow',
    date: new Date().toISOString()
  });
  
  localStorage.setItem('userData', JSON.stringify(userData));
  
  // Recarregar notas
  const container = document.querySelector(`#${topicKey}Section .sticky-notes-container`);
  if (container) {
    loadStickyNotes(topicKey, container);
  }
  
  // Conquista: primeira anotação
  if (userData[currentUser].notes[topicKey].length === 1) {
    unlockAchievement("Autor: primeira anotação adicionada");
  }
}

// Excluir nota
function deleteNote(topicKey, index) {
  if (!currentUser || !userData[currentUser] || !userData[currentUser].notes) return;
  
  userData[currentUser].notes[topicKey].splice(index, 1);
  localStorage.setItem('userData', JSON.stringify(userData));
  
  // Recarregar notas
  const container = document.querySelector(`#${topicKey}Section .sticky-notes-container`);
  if (container) {
    loadStickyNotes(topicKey, container);
  }
}

// Função para atualizar a visualização do perfil
function updateProfileView() {
  renderProfile();
}

// Função para atualizar a visualização do painel administrativo
function updateAdminView() {
  renderAdminPanel();
}

// Função para verificar respostas do quiz
function checkQuiz(questionName, correctAnswer) {
  const options = document.querySelectorAll(`input[name="${questionName}"]`);
  let selected = null;
  for (let opt of options) {
    if (opt.checked) { selected = opt.value; break; }
  }
  const feedbackEl = document.getElementById(`${questionName}Feedback`);
  
  if (!feedbackEl) return false;
  
  if (selected === null) {
    feedbackEl.className = 'feedback';
    feedbackEl.textContent = 'Por favor, selecione uma opção.';
    return false;
  } 
  
  const isCorrect = selected === correctAnswer;
  feedbackEl.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
  feedbackEl.textContent = isCorrect ? 
    'Correto! ' + (explanations[questionName] || '') : 
    'Incorreto. ' + (explanations[questionName] || '');
  
  // Marcar tópico como concluído se for uma pergunta de revisão
  if (isCorrect && currentUser && userData[currentUser]) {
    const topicKey = questionName.replace('Q', '');
    if (['prog', 'ciber', 'ia', 'po'].includes(topicKey)) {
      const topicMapping = {
        'prog': 'programacao',
        'ciber': 'ciberseguranca',
        'ia': 'ia',
        'po': 'productOwner'
      };
      const fullTopicKey = topicMapping[topicKey];
      if (fullTopicKey && !userData[currentUser].completedTopics.includes(fullTopicKey)) {
        userData[currentUser].completedTopics.push(fullTopicKey);
        localStorage.setItem('userData', JSON.stringify(userData));
        showNotification(`Parabéns! Você concluiu o tópico de ${contentData[currentLang][fullTopicKey].title}!`);
        renderTopicsList(); // Atualizar lista com marcação de concluído
      }
    }
  }
  
  return isCorrect;
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
  // Remover notificação existente
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  // Criar nova notificação
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  // Ícone baseado no tipo
  let icon = '💬';
  if (type === 'success') icon = '✅';
  else if (type === 'error') icon = '❌';
  else if (type === 'warning') icon = '⚠️';
  
  notification.innerHTML = `
    <div class="notification-icon">${icon}</div>
    <div class="notification-content">
      <div class="notification-message">${message}</div>
    </div>
    <button class="notification-close" aria-label="Fechar notificação">×</button>
  `;
  
  document.body.appendChild(notification);
  
  // Mostrar com animação
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Configurar botão de fechar
  notification.querySelector('.notification-close').addEventListener('click', () => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Auto-fechar após 5 segundos
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Função para renderizar lembretes
function renderReminders() {
  if (!currentUser || !userData[currentUser]) return;
  
  const reminderList = document.getElementById('reminderList');
  const noRemindersMsg = document.getElementById('noRemindersMsg');
  
  reminderList.innerHTML = '';
  
  if (!userData[currentUser].reminders || userData[currentUser].reminders.length === 0) {
    noRemindersMsg.style.display = 'block';
    return;
  }
  
  noRemindersMsg.style.display = 'none';
  
  userData[currentUser].reminders.forEach((reminder, index) => {
    const li = document.createElement('li');
    const now = new Date();
    const reminderDate = new Date(reminder.date);
    const isDue = reminderDate <= now;
    
    if (isDue) {
      li.classList.add('due');
    }
    
    const reminderContent = document.createElement('div');
    reminderContent.className = 'reminder-content';
    
    const title = document.createElement('div');
    title.className = 'reminder-title';
    title.textContent = reminder.text;
    
    const time = document.createElement('div');
    time.className = 'reminder-time';
    time.textContent = reminderDate.toLocaleString();
    
    reminderContent.appendChild(title);
    reminderContent.appendChild(time);
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '×';
    deleteBtn.setAttribute('aria-label', 'Excluir lembrete');
    deleteBtn.addEventListener('click', () => {
      deleteReminder(index);
    });
    
    li.appendChild(reminderContent);
    li.appendChild(deleteBtn);
    reminderList.appendChild(li);
  });
}

// Função para excluir um lembrete
function deleteReminder(index) {
  if (!currentUser || !userData[currentUser]) return;
  
  userData[currentUser].reminders.splice(index, 1);
  localStorage.setItem('userData', JSON.stringify(userData));
  renderReminders();
  showNotification('Lembrete excluído com sucesso!', 'success');
}

// Função para verificar lembretes vencidos
function checkDueReminders() {
  if (!currentUser || !userData[currentUser] || !userData[currentUser].reminders) return;
  
  const now = new Date();
  let dueCount = 0;
  
  userData[currentUser].reminders.forEach(reminder => {
    const reminderDate = new Date(reminder.date);
    if (reminderDate <= now && !reminder.notified) {
      dueCount++;
      reminder.notified = true;
    }
  });
  
  if (dueCount > 0) {
    showNotification(`Você tem ${dueCount} lembrete${dueCount > 1 ? 's' : ''} vencido${dueCount > 1 ? 's' : ''}!`, 'warning');
    localStorage.setItem('userData', JSON.stringify(userData));
  }
}

// Função para desbloquear conquistas
function unlockAchievement(achievementName) {
  if (!currentUser || !userData[currentUser]) return;
  
  if (!userData[currentUser].achievements.includes(achievementName)) {
    userData[currentUser].achievements.push(achievementName);
    localStorage.setItem('userData', JSON.stringify(userData));
    showNotification(`🏆 Nova conquista: ${achievementName}`, 'success');
  }
}

// Adicionar eventos para os botões da barra superior
document.getElementById('homeBtn').addEventListener('click', () => showSection('homeSection'));
document.getElementById('profileBtn').addEventListener('click', () => showSection('profileSection'));
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('loggedInUser');
  currentUser = null;
  location.reload();
});

// Adicionar evento para o botão de sincronização
document.getElementById('syncBtn').addEventListener('click', () => {
  showNotification('Sincronização concluída!', 'success');
  // Aqui seria implementada a sincronização real com um servidor
});

// Adicionar eventos para os botões de voltar
document.querySelectorAll('.backButton').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    if (target) {
      showSection(target);
    }
  });
});

// Adicionar eventos para os links de navegação
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('navLink')) {
    e.preventDefault();
    const target = e.target.getAttribute('data-target');
    if (target) {
      showSection(target);
    }
  }
});

// Adicionar evento para o formulário de lembretes
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
    // Se não for especificada uma data, usar data atual + 1 dia
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    date = tomorrow.toISOString();
  }
  
  if (!userData[currentUser].reminders) {
    userData[currentUser].reminders = [];
  }
  
  userData[currentUser].reminders.push({
    text: text,
    date: date,
    notified: false
  });
  
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

// Adicionar evento para o botão de exportar dados
document.getElementById('exportDataBtn').addEventListener('click', () => {
  if (!currentUser || !userData[currentUser]) return;
  
  const dataStr = JSON.stringify(userData[currentUser], null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `tecnoclass_${currentUser}_data.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
  
  showNotification('Seus dados foram exportados com sucesso!', 'success');
});

// Adicionar evento para o formulário de login/registro
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
    
    // Simular hash+salt (em produção, usar bcrypt ou similar)
    const salt = Math.random().toString(36).substring(2);
    const hash = password + salt; // Simulação simplificada
    
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
    
    // Voltar para modo de login
    registerMode = false;
    document.getElementById('loginTitle').textContent = 'Login';
    document.getElementById('loginBtn').textContent = 'Entrar';
    document.getElementById('toggleLoginRegister').innerHTML = 'Não tem uma conta? <a href="#" id="registerLink">Registre-se</a>';
    document.getElementById('registerLink').addEventListener('click', toggleLoginRegister);
    
  } else {
    // Modo de login
    if (!users[email]) {
      loginAttempts++;
      loginMessage.className = 'error';
      loginMessage.textContent = 'E-mail não encontrado.';
      return;
    }
    
    const { salt, hash } = users[email];
    if (password + salt !== hash) { // Simulação simplificada
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
    
    // Iniciar aplicação
    startApp();
  }
});

// Função para alternar entre login e registro
function toggleLoginRegister(e) {
  e.preventDefault();
  registerMode = !registerMode;
  
  if (registerMode) {
    document.getElementById('loginTitle').textContent = 'Registro';
    document.getElementById('loginBtn').textContent = 'Registrar';
    document.getElementById('toggleLoginRegister').innerHTML = 'Já tem uma conta? <a href="#" id="loginLink">Faça login</a>';
    document.getElementById('loginLink').addEventListener('click', toggleLoginRegister);
  } else {
    document.getElementById('loginTitle').textContent = 'Login';
    document.getElementById('loginBtn').textContent = 'Entrar';
    document.getElementById('toggleLoginRegister').innerHTML = 'Não tem uma conta? <a href="#" id="registerLink">Registre-se</a>';
    document.getElementById('registerLink').addEventListener('click', toggleLoginRegister);
  }
  
  document.getElementById('loginMessage').textContent = '';
  document.getElementById('loginMessage').className = '';
}

// Adicionar evento para o link de registro
document.getElementById('registerLink').addEventListener('click', toggleLoginRegister);

// Adicionar evento para o botão de mostrar/ocultar senha
document.getElementById('togglePassword').addEventListener('click', () => {
  const passwordInput = document.getElementById('password');
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  document.getElementById('togglePassword').textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
});

// Adicionar evento para os links de termos
document.getElementById('termsLink').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('modal').style.display = 'flex';
});

document.getElementById('termsLink2').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('modal').style.display = 'flex';
});

// Adicionar evento para fechar o modal
document.getElementById('closeModal').addEventListener('click', () => {
  document.getElementById('modal').style.display = 'none';
});

// Adicionar eventos para os botões de leitura de texto
document.querySelectorAll('.tts-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const section = this.closest('section');
    const content = section.querySelector('.sectionContent').textContent;
    
    // Cancelar qualquer leitura em andamento
    window.speechSynthesis.cancel();
    
    // Criar nova leitura
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.lang = currentLang === 'pt' ? 'pt-BR' : 'en-US';
    window.speechSynthesis.speak(utterance);
    
    showNotification('Iniciando leitura do texto...', 'info');
  });
});

// Inicializar a aplicação com base na URL (para navegação direta)
function initFromUrl() {
  const hash = window.location.hash.substring(1);
  if (hash && sectionIds.includes(hash)) {
    showSection(hash);
  }
}

// Executar inicialização baseada na URL após carregamento completo
window.addEventListener('load', initFromUrl);

// Adicionar evento para navegação por hash
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.substring(1);
  if (hash && sectionIds.includes(hash)) {
    showSection(hash);
  }
});

// Adicionar evento para o formulário de adicionar tópico (admin)
const addTopicForm = document.getElementById('addTopicForm');
if (addTopicForm) {
  addTopicForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    const title = document.getElementById('newTopicTitle').value.trim();
    const content = document.getElementById('newTopicContent').value.trim();
    
    if (!title || !content) {
      showNotification('Por favor, preencha todos os campos.', 'error');
      return;
    }
    
    // Gerar chave para o tópico (slug do título)
    const topicKey = title.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remover acentos
      .replace(/[^a-z0-9]/g, '');
    
    // Adicionar tópico ao conteúdo
    contentData[currentLang][topicKey] = {
      title: title,
      body: content
    };
    
    localStorage.setItem('contentData', JSON.stringify(contentData));
    
    document.getElementById('newTopicTitle').value = '';
    document.getElementById('newTopicContent').value = '';
    
    document.getElementById('addTopicMsg').textContent = 'Tópico adicionado com sucesso!';
    setTimeout(() => {
      document.getElementById('addTopicMsg').textContent = '';
    }, 3000);
    
    // Atualizar lista de tópicos
    renderTopicsList();
  });
}

// Adicionar esta função após a função checkQuiz
function updateProgressBar(topicKey) {
  if (!currentUser || !userData[currentUser]) return;
  
  const progressBar = document.querySelector(`#${topicKey}Section .progress-bar`);
  if (!progressBar) return;
  
  // Calcular progresso baseado em tópicos concluídos
  if (userData[currentUser].completedTopics.includes(topicKey)) {
    progressBar.style.width = '100%';
  } else {
    // Progresso parcial baseado em interações (favoritos, notas, etc.)
    const hasNotes = userData[currentUser].notes && 
                    userData[currentUser].notes[topicKey] && 
                    userData[currentUser].notes[topicKey].length > 0;
    
    const hasFavorites = userData[currentUser].favorites.some(f => f.topic === topicKey);
    
    if (hasNotes && hasFavorites) {
      progressBar.style.width = '66%';
    } else if (hasNotes || hasFavorites) {
      progressBar.style.width = '33%';
    } else {
      progressBar.style.width = '10%'; // Progresso mínimo por visualizar
    }
  }
}

// Modificar a função showSection para atualizar a barra de progresso
function showSection(sectionId) {
  // ... código existente ...
  
  // Atualizar barra de progresso se for uma seção de conteúdo
  if (sectionId.endsWith('Section') && 
      !['homeSection', 'loginSection', 'quizSection', 'remindersSection', 
        'favoritesSection', 'profileSection', 'adminSection'].includes(sectionId)) {
    const topicKey = sectionId.replace('Section', '');
    updateProgressBar(topicKey);
  }
  
  // ... resto do código existente ...
}



