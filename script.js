// Registro do Service Worker para suporte offline
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .catch(err => console.error('ServiceWorker registration failed:', err));
  });
}

// Dados dos módulos (títulos, progresso e notas)
const dataKey = 'tecnoClassData';
const defaultModules = [
  { titulo: 'Módulo 1: Introdução ao TecnoClass', concluido: false, notas: '' },
  { titulo: 'Módulo 2: Aprendendo Offline',      concluido: false, notas: '' },
  { titulo: 'Módulo 3: Progresso e Notas',       concluido: false, notas: '' }
];
// Carrega dados do localStorage ou usa padrão
let modulesData;
try {
  modulesData = JSON.parse(localStorage.getItem(dataKey)) || JSON.parse(JSON.stringify(defaultModules));
} catch (e) {
  modulesData = JSON.parse(JSON.stringify(defaultModules));
}

// Função de salvar dados com debounce de 500ms
let saveTimeout;
function saveData() {
  localStorage.setItem(dataKey, JSON.stringify(modulesData));
}
function scheduleSave() {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(saveData, 500);
}

// Elementos globais
const main = document.querySelector('main');
const navLinks = document.querySelectorAll('nav a');
const yearSpan = document.getElementById('year');

// Insere o ano atual no rodapé
yearSpan.textContent = new Date().getFullYear();

// Funções de renderização de cada seção
function renderInicio() {
  return `
    <section id="inicio">
      <h2 tabindex="-1">Início</h2>
      <p>Bem-vindo ao <strong>TecnoClass</strong>, sua plataforma de cursos offline. Utilize a seção "Cursos" para acessar módulos educacionais e faça anotações livremente. Todo o seu progresso será salvo no dispositivo, permitindo acesso mesmo sem internet.</p>
    </section>
  `;
}

function renderCursos() {
  // Monta a lista de módulos com checkboxes e campos de notas
  let cursosContent = `
    <section id="cursos">
      <h2 tabindex="-1">Cursos</h2>
      <p>Abaixo estão os módulos disponíveis. Marque como concluído quando terminar um módulo e utilize o campo de notas para registrar observações de estudo. Seu progresso será armazenado.</p>
  `;
  modulesData.forEach((mod, index) => {
    const modNumber = index + 1;
    // Escapa o texto da nota para evitar possíveis quebras de HTML
    const notaEscapada = mod.notas.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    cursosContent += `
      <div class="module${mod.concluido ? ' completed' : ''}">
        <h3>${mod.titulo}</h3>
        <p>${modNumber === 1 ? 'Este módulo apresenta a aplicação TecnoClass e suas funcionalidades básicas.' : 
             modNumber === 2 ? 'Este módulo explica como usar o TecnoClass completamente offline após o primeiro acesso.' : 
             'Este módulo mostra como acompanhar seu progresso e usar notas em cada módulo.'}</p>
        <label>
          <input type="checkbox" id="module${modNumber}-check" ${mod.concluido ? 'checked' : ''}>
          Concluído
        </label>
        <label for="module${modNumber}-notes">Notas:</label>
        <textarea id="module${modNumber}-notes">${notaEscapada}</textarea>
      </div>
    `;
  });
  cursosContent += `</section>`;
  return cursosContent;
}

function renderPerfil() {
  // Calcula progresso atual
  const total = modulesData.length;
  const concluidos = modulesData.filter(mod => mod.concluido).length;
  const porcentagem = total > 0 ? Math.round((concluidos / total) * 100) : 0;
  // Texto de progresso e mensagem opcional de conclusão total
  let progressoTexto = \`Você concluiu \${concluidos} de \${total} módulos (\${porcentagem}%).\`;
  if (concluidos === total && total > 0) {
    progressoTexto += ' Parabéns, você concluiu todos os módulos!';
  }
  return `
    <section id="perfil">
      <h2 tabindex="-1">Perfil</h2>
      <p id="progress-status">${progressoTexto}</p>
      <button id="reset-btn">Redefinir Progresso</button>
    </section>
  `;
}

// Função para exibir uma seção específica
function showSection(section) {
  let contentHTML = '';
  switch (section) {
    case 'inicio':
      contentHTML = renderInicio();
      break;
    case 'cursos':
      contentHTML = renderCursos();
      break;
    case 'perfil':
      contentHTML = renderPerfil();
      break;
    default:
      contentHTML = '<section><h2 tabindex="-1">Seção não encontrada</h2><p>A seção solicitada não existe.</p></section>';
  }
  // Insere conteúdo no main e adiciona animação de transição
  main.innerHTML = contentHTML;
  const newSection = main.querySelector('section');
  if (newSection) {
    // Aplica classe para animação de fade-in
    newSection.classList.add('fade-in');
  }
  // Ajusta foco para o título da nova seção (acessibilidade)
  const newHeading = main.querySelector('h2');
  if (newHeading) {
    newHeading.focus();
  }
  // Atualiza links ativos na navegação
  navLinks.forEach(link => {
    const target = link.getAttribute('href').substring(1); // nome após '#'
    if (target === section) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
  // Seção específica: adicionar event handlers após render
  if (section === 'cursos') {
    attachCourseEvents();
  } else if (section === 'perfil') {
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', handleReset);
    }
  }
  // Rola para o topo ao mudar de seção
  window.scrollTo(0, 0);
}

// Associa eventos nos elementos da seção "Cursos"
function attachCourseEvents() {
  modulesData.forEach((mod, index) => {
    const modNumber = index + 1;
    const checkEl = document.getElementById(\`module\${modNumber}-check\`);
    const notesEl = document.getElementById(\`module\${modNumber}-notes\`);
    if (checkEl) {
      checkEl.addEventListener('change', (e) => {
        // Atualiza estado do módulo e aparência
        modulesData[index].concluido = e.target.checked;
        const moduleDiv = checkEl.closest('.module');
        if (moduleDiv) {
          if (e.target.checked) {
            moduleDiv.classList.add('completed');
          } else {
            moduleDiv.classList.remove('completed');
          }
        }
        scheduleSave();
      });
    }
    if (notesEl) {
      notesEl.addEventListener('input', (e) => {
        modulesData[index].notas = e.target.value;
        scheduleSave();
      });
    }
  });
}

// Função para lidar com o reset de progresso
function handleReset() {
  const confirmar = confirm('Tem certeza que deseja resetar o progresso? Todas as anotações serão removidas.');
  if (confirmar) {
    // Limpa dados armazenados e reseta estado
    localStorage.removeItem(dataKey);
    modulesData = JSON.parse(JSON.stringify(defaultModules));
    // Atualiza a seção perfil para refletir o progresso zerado
    showSection('perfil');
  }
}

// Controle de rotas via hash da URL
window.addEventListener('hashchange', () => {
  const section = window.location.hash.replace('#', '') || 'inicio';
  showSection(section);
});

// Carrega seção inicial baseada no hash ou padrão "inicio"
const initialSection = window.location.hash.replace('#', '') || 'inicio';
showSection(initialSection);
// Se não havia hash (acesso direto), define hash padrão para permitir navegação correta
if (!window.location.hash) {
  window.location.hash = '#' + initialSection;
}
