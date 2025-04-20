const quizzes = {
  programacao: [
    ["Qual linguagem é usada para estilizar páginas web?", ["HTML", "CSS", "Java", "PHP"], 1],
    ["O que significa DOM?", ["Data Object Model", "Document Object Model", "Desktop Online Mode", "Download Open Manager"], 1],
    ["Qual linguagem roda no navegador?", ["PHP", "Java", "C++", "JavaScript"], 3],
    ["Back-end é associado a:", ["Estilo", "Interação", "Servidor", "Layout"], 2],
    ["HTML serve para:", ["Programar lógica", "Adicionar estilos", "Estruturar páginas", "Armazenar dados"], 2],
    ["CSS é:", ["Linguagem de programação", "Ferramenta de banco de dados", "Linguagem de estilo", "Framework"], 2],
    ["Node.js é:", ["Linguagem", "Framework", "Runtime JavaScript", "Editor"], 2],
    ["Função do banco de dados:", ["Processar CSS", "Renderizar HTML", "Salvar dados", "Interagir com usuário"], 2],
    ["console.log serve para:", ["Salvar dados", "Mostrar alertas", "Depurar código", "Criar elementos"], 2],
    ["Qual é uma linguagem tipada:", ["Python", "JavaScript", "Java", "HTML"], 2]
  ],
  cyber: [
    ["Firewall serve para:", ["Bloquear propagandas", "Proteger contra acessos não autorizados", "Armazenar dados", "Instalar antivírus"], 1],
    ["Senha forte deve conter:", ["Somente letras", "Números repetidos", "Mistura de caracteres", "Data de nascimento"], 2],
    ["Phishing é:", ["Vírus", "Roubo de identidade", "Acesso remoto", "Ataque físico"], 1],
    ["Cibersegurança visa proteger:", ["Aplicativos", "Sistemas e dados", "Hardware", "Usuários"], 1],
    ["VPN é usada para:", ["Assistir vídeos", "Melhorar desempenho", "Conexão segura", "Download"], 2],
    ["Ataque DDoS é:", ["Erro de sistema", "Queda de internet", "Ataque de sobrecarga", "Bug de app"], 2],
    ["Backup serve para:", ["Acelerar sistema", "Atualizar apps", "Recuperar dados", "Impedir vírus"], 2],
    ["Autenticação de dois fatores:", ["Exige 2 logins", "Exige SMS ou app extra", "É obrigatória", "É automática"], 1],
    ["Importância da segurança digital:", ["Evita crimes cibernéticos", "Evita compras", "Evita atualizações", "Evita senhas"], 0],
    ["Ransomware faz:", ["Melhora o sistema", "Vaza dados", "Criptografa dados e cobra resgate", "Corrige erros"], 2]
  ],
  ia: [
    ["IA significa:", ["Inteligência Avançada", "Inteligência Artificial", "Interface Autônoma", "Item Ativo"], 1],
    ["Rede neural simula:", ["Serviços", "Cérebro humano", "Banco de dados", "Nuvem"], 1],
    ["LLM significa:", ["Large Language Model", "Light Logic Map", "Linear Language Mode", "Language List Module"], 0],
    ["IA pode:", ["Criar conteúdo", "Gerar música", "Traduzir texto", "Todas acima"], 3],
    ["Aprendizado de máquina requer:", ["Regras fixas", "Intuição", "Dados", "Emoção"], 2],
    ["Prompt é:", ["Comando de entrada", "Resposta", "Erro", "App"], 0],
    ["IA pode melhorar:", ["Autonomia", "Criatividade", "Produtividade", "Todas"], 3],
    ["Vieses em IA são:", ["Defeitos físicos", "Preconceitos nos dados", "Erros do usuário", "Falhas da câmera"], 1],
    ["IA generativa cria:", ["Planilhas", "Dados aleatórios", "Conteúdo novo", "Backups"], 2],
    ["Impacto da IA no trabalho:", ["Remove empregos", "Aumenta eficiência", "Reduz salários", "Cria dependência"], 1]
  ],
  po: [
    ["PO significa:", ["Project Officer", "Product Owner", "Process Operator", "Principal Operator"], 1],
    ["PO lida com:", ["Infraestrutura", "Marketing", "Valor do Produto", "Design Gráfico"], 2],
    ["Scrum é:", ["Idioma", "Metodologia Ágil", "Software", "Relatório"], 1],
    ["User Story é:", ["História do usuário", "Requisito em linguagem simples", "Biografia", "Bug"], 1],
    ["PO define:", ["Layout", "Missão da empresa", "Backlog", "Cores do app"], 2],
    ["Sprint é:", ["Aplicativo", "Período de entrega", "Corrida", "Erro"], 1],
    ["Scrum Master é:", ["Supervisor", "Dono do Produto", "Facilitador", "Programador"], 2],
    ["PO trabalha com:", ["Designers", "Time de desenvolvimento", "CEO", "Todos"], 3],
    ["KPI mede:", ["Código", "Desempenho", "Animação", "Tamanho do app"], 1],
    ["Objetivo do PO:", ["Falar com clientes", "Gerar valor", "Testar códigos", "Criar layout"], 1]
  ]
};

// Conteúdo didático do Campo de Estudo
const campoDeEstudo = `
  <h2>Campo de Estudo</h2>
  <div class="card"><h3>Programação</h3><p>Programação é o processo de escrever instruções para o computador executar. Usamos linguagens como HTML, CSS e JavaScript para criar sites, aplicativos e sistemas. Um bom programador aprende lógica, resolve problemas e estrutura código de forma organizada. Programação é o processo de criar instruções formais que um computador pode interpretar e executar. Em vez de falar com ele em português ou gritar “FUNCIONA, MALDITO!”, usamos linguagens específicas, cada uma com sua função e estrutura. Linguagens como HTML (HyperText Markup Language) definem a estrutura de páginas na web, como se fossem o esqueleto de um site. Já CSS (Cascading Style Sheets) cuida do visual: cores, espaçamentos, fontes — basicamente, é o estilista do código. Por fim, JavaScript é a linguagem que dá vida e interatividade às páginas, permitindo animações, validações de formulários, botões que reagem e, claro, bugs em tempo real.

Além das linguagens, um bom programador precisa desenvolver lógica de programação, que é a habilidade de pensar como um computador: com passos bem definidos, condições claras e muita paciência. Também é fundamental saber resolver problemas, testar soluções diferentes e manter o código organizado, legível e funcional — porque um dia, alguém (possivelmente o próprio programador) vai precisar entender aquele código de novo… e ele provavelmente vai estar com sono.

Em resumo, programar é menos sobre saber decorar comandos e mais sobre entender como pensar de forma estruturada, analítica e criativa ao mesmo tempo. É tipo montar um quebra-cabeça onde as peças mudam de forma toda hora e o manual está em binário. </p></div>
  <div class="card"><h3>Cibersegurança</h3><p>Cibersegurança envolve proteger dispositivos, redes e dados contra ataques. É essencial usar senhas fortes, backups e entender ameaças como phishing e ransomware. Especialistas garantem que sistemas estejam seguros e que dados não sejam acessados por criminosos.</p></div>
  <div class="card"><h3>Inteligência Artificial</h3><p>IA é a simulação da inteligência humana por máquinas. Com ela, sistemas aprendem com dados, criam textos, imagens e tomam decisões. Modelos como redes neurais e LLMs são usados em chatbots, carros autônomos e muito mais.</p></div>
  <div class="card"><h3>Product Owner</h3><p>O Product Owner (PO) é responsável por guiar o desenvolvimento de um produto. Ele define o que deve ser feito, prioriza tarefas e garante que a equipe entenda as metas. Trabalha com métodos ágeis como Scrum e usa métricas para medir sucesso.</p></div>
`;

function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.classList.remove("visible"));
  document.getElementById(id).classList.add("visible");
  document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
  document.getElementById("btn-" + id).classList.add("active");

  if (id === "estudo") {
    document.getElementById("estudo").innerHTML = campoDeEstudo;
  }
}

function startQuiz(topic) {
  const container = document.getElementById(topic);
  const data = quizzes[topic];
  let html = `<h2>${topic.toUpperCase()}</h2><p>Leia o conteúdo acima e clique para iniciar o quiz:</p>`;
  html += `<button onclick="renderQuiz('${topic}')">Iniciar o Quiz</button><div id="quiz-${topic}"></div>`;
  container.innerHTML = html;
}

function renderQuiz(topic) {
  const container = document.getElementById("quiz-" + topic);
  const data = quizzes[topic];
  let html = "<form id='form-" + topic + "'>";
  data.forEach((q, i) => {
    html += `<div class='quiz-question'><p><strong>${i + 1}.</strong> ${q[0]}</p>`;
    q[1].forEach((opt, j) => {
      html += `<label><input type="radio" name="q${i}" value="${j}" /> ${opt}</label><br>`;
    });
    html += "</div>";
  });
  html += `<button type="button" onclick="checkQuiz('${topic}')">CONFERIR RESULTADO</button></form>`;
  container.innerHTML = html;
}

function checkQuiz(topic) {
  const form = document.getElementById("form-" + topic);
  const data = quizzes[topic];
  let progresso = 0;
  data.forEach((q, i) => {
    const chosen = form["q" + i].value;
    const correct = q[2];
    const block = form.querySelectorAll(".quiz-question")[i];
    if (chosen == correct) {
      block.className = "quiz-question correct";
      progresso++;
    } else {
      block.className = "quiz-question wrong";
      const correcao = document.createElement("p");
      correcao.innerText = "Resposta correta: " + q[1][correct];
      block.appendChild(correcao);
    }
  });
  localStorage.setItem("progresso-" + topic, progresso);
  atualizarProgresso();
}

function login() {
  const name = document.getElementById("username").value;
  if (!name) return alert("Digite seu nome!");
  localStorage.setItem("usuario", name);
  document.getElementById("login").style.display = "none";
  document.getElementById("app").style.display = "block";
  document.getElementById("nomePerfil").value = name;
  carregarFoto();
  atualizarProgresso();
  ["programacao", "cyber", "ia", "po"].forEach(startQuiz);
  showTab('programacao');
}

function salvarPerfil() {
  const nome = document.getElementById("nomePerfil").value;
  localStorage.setItem("usuario", nome);
  alert("Perfil salvo!");
}

function uploadFoto(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    localStorage.setItem("fotoPerfil", reader.result);
    carregarFoto();
  };
  reader.readAsDataURL(file);
}

function carregarFoto() {
  const foto = localStorage.getItem("fotoPerfil");
  if (foto) document.getElementById("fotoPerfil").src = foto;
}

function atualizarProgresso() {
  const list = document.getElementById("progressoList");
  list.innerHTML = "";
  Object.keys(quizzes).forEach(k => {
    const score = localStorage.getItem("progresso-" + k) || 0;
    list.innerHTML += `<li>${k.toUpperCase()}: ${score}/10</li>`;
  });
}

window.onload = () => {
  const user = localStorage.getItem("usuario");
  if (user) {
    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";
    document.getElementById("nomePerfil").value = user;
    carregarFoto();
    atualizarProgresso();
    ["programacao", "cyber", "ia", "po"].forEach(startQuiz);
    showTab('programacao');
  } else {
    document.getElementById("login").style.display = "flex";
  }
};
