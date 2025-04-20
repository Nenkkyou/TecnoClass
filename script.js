const quizzes = {
  // Seu conteúdo de quizzes permanece inalterado
  programacao: [...],
  cyber: [...],
  ia: [...],
  po: [...]
};

const estudoConteudos = {
  programacao: `Programação é o processo de criar instruções formais que um computador pode interpretar e executar. Em vez de falar com ele em português ou gritar “FUNCIONA, MALDITO!”, usamos linguagens específicas, cada uma com sua função e estrutura...`,
  cyber: `Cibersegurança envolve proteger dispositivos, redes e dados contra ataques. É essencial usar senhas fortes, backups e entender ameaças como phishing e ransomware. Cibersegurança é o conjunto de práticas, tecnologias...`,
  ia: `Inteligência Artificial (IA) é o ato de fazer uma máquina agir como se tivesse cérebro — o que é ao mesmo tempo fascinante e, dependendo do contexto, aterrorizante. Ao invés de apenas seguir ordens, sistemas com IA são capazes de aprender...`,
  po: `O Product Owner (ou PO para os íntimos) é a pessoa responsável por garantir que um produto digital — como um app, um site ou até aquele sistema tosco da empresa — seja desenvolvido com foco em valor. E o que é valor?...`
};

// Gera os cards com botão de expandir
const campoDeEstudo = `
  <h2>Campo de Estudo</h2>
  ${Object.entries(estudoConteudos).map(([key, texto]) => {
    const resumo = texto.split('.').slice(0, 2).join('.') + '...';
    return `
      <div class="card expandable">
        <h3>${formatarTitulo(key)}</h3>
        <p id="${key}-texto">${resumo}</p>
        <button class="ver-mais-btn" onclick="toggleExpand('${key}', \`${texto}\`)">Ver mais</button>
      </div>
    `;
  }).join('')}
`;

function formatarTitulo(categoria) {
  switch (categoria) {
    case 'programacao': return 'Programação';
    case 'cyber': return 'Cibersegurança';
    case 'ia': return 'Inteligência Artificial';
    case 'po': return 'Product Owner';
    default: return categoria;
  }
}

function toggleExpand(id, textoCompleto) {
  const p = document.getElementById(id + '-texto');
  const btn = p.nextElementSibling;
  const expanded = p.classList.toggle('expanded');
  p.innerHTML = expanded ? textoCompleto : textoCompleto.split('.').slice(0, 2).join('.') + '...';
  btn.textContent = expanded ? 'Ver menos' : 'Ver mais';
}

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
