// Estrutura modular para o TecnoClass PWA
(function() {
    'use strict';

    // --- Seletores DOM ---
    const contentElement = document.getElementById('content');
    const mainNav = document.getElementById('main-nav');
    const currentYearElement = document.getElementById('current-year');

    // --- Constantes e Configurações ---
    const STORAGE_KEYS = {
        NOTES: 'tecnoClass_moduleNotes',
        COMPLETION: 'tecnoClass_moduleCompletion',
        CURRENT_SECTION: 'tecnoClass_currentSection'
    };
    const NOTE_SAVE_DEBOUNCE_MS = 500; // Milissegundos para esperar antes de salvar nota

    // --- Dados dos Cursos (Estrutura JSON Simplificada) ---
    const cursosData = {
        programacao: {
            id: "programacao",
            titulo: "Programação Essencial",
            descricao: "Aprenda a criar software e páginas web interativas.",
            modulos: [
                { id: "prog-01", titulo: "Fundamentos da Lógica", descricao: "Como 'pensar' como um computador para resolver problemas." }, // Conteúdo removido
                { id: "prog-02", titulo: "HTML & CSS Moderno", descricao: "Construindo a estrutura e a aparência de páginas web." }, // Conteúdo removido
                { id: "prog-03", titulo: "JavaScript Interativo", descricao: "Adicionando comportamento e interatividade às páginas." }, // Conteúdo removido
                { id: "prog-04", titulo: "Introdução ao Back-end", descricao: "Entendendo como funcionam os 'bastidores' da web." } // Conteúdo removido
            ]
        },
        ciberseguranca: {
            id: "ciberseguranca",
            titulo: "Cibersegurança Defensiva",
            descricao: "Proteja sistemas e redes contra ameaças digitais.",
            modulos: [
                { id: "ciber-01", titulo: "Princípios de Segurança", descricao: "Os pilares da proteção de dados: Confidencialidade, Integridade, Disponibilidade." }, // Conteúdo removido
                { id: "ciber-02", titulo: "Análise de Vulnerabilidades", descricao: "Identificando pontos fracos em sistemas antes dos invasores." }, // Conteúdo removido
                { id: "ciber-03", titulo: "Segurança de Redes", descricao: "Protegendo a comunicação e o acesso à rede." }, // Conteúdo removido
                { id: "ciber-04", titulo: "Resposta a Incidentes", descricao: "O que fazer quando um problema de segurança acontece." } // Conteúdo removido
            ]
        },
        ia: {
            id: "ia",
            titulo: "IA Generativa na Prática",
            descricao: "Explore modelos de IA capazes de criar conteúdo.",
            modulos: [
                { id: "ia-01", titulo: "Fundamentos de IA/ML", descricao: "Como as máquinas aprendem a partir de dados." }, // Conteúdo removido
                { id: "ia-02", titulo: "Modelos Generativos (LLMs)", descricao: "Entendendo como funcionam IAs como ChatGPT." }, // Conteúdo removido
                { id: "ia-03", titulo: "Engenharia de Prompt", descricao: "A arte de 'conversar' com a IA para obter os melhores resultados." }, // Conteúdo removido
                { id: "ia-04", titulo: "Ética em IA", descricao: "Considerações importantes sobre o uso responsável da IA." } // Conteúdo removido
            ]
        },
        product_owner: {
            id: "product_owner",
            titulo: "Product Owner Ágil",
            descricao: "Lidere o desenvolvimento de produtos com agilidade.",
            modulos: [
                { id: "po-01", titulo: "Fundamentos de Produto", descricao: "O que é um produto digital e qual o papel do PO." }, // Conteúdo removido
                { id: "po-02", titulo: "Metodologias Ágeis (Scrum)", descricao: "Trabalhando em ciclos curtos para entregar valor rapidamente." }, // Conteúdo removido
                { id: "po-03", titulo: "Gestão de Backlog", descricao: "Priorizando o que precisa ser feito no produto." }, // Conteúdo removido
                { id: "po-04", titulo: "Métricas e KPIs", descricao: "Medindo o sucesso e o progresso do produto." } // Conteúdo removido
            ]
        }
    };

    // --- Funções Auxiliares ---
    // ... existing code ...

    // --- Estado da Aplicação ---
    // ... existing code ...

    /** Carrega o estado inicial do localStorage */
    // ... existing code ...


    // --- Funções de Renderização ---

    /** Gera o HTML para um único módulo dentro de um <details> (Simplificado) */
    function renderModule(module, cursoId) {
        const moduleId = module.id;
        // const currentNote = state.notes[moduleId] || ''; // Removido - Não precisamos mais das notas
        const isCompleted = state.completion[moduleId] || false;
        const completionCheckboxId = `completion-${moduleId}`;

        // Não precisamos mais de detailedContent, a descrição já está no summary
        // const detailedContent = module.conteudo ? ... : ...; // Removido

        return `
            <details class="module-details ${isCompleted ? 'completed' : ''}" data-module-id="${moduleId}">
                <summary class="module-summary">
                    <span class="module-title">${module.titulo}</span>
                    <span class="completion-indicator">${isCompleted ? '✔' : ''}</span>
                    <span class="module-short-desc">${module.descricao}</span> {/* Descrição agora é a explicação principal */}
                </summary>
                <div class="module-content">
                    {/* Área de conteúdo detalhado e notas removida */}
                    <div class="module-actions">
                        <input
                            type="checkbox"
                            id="${completionCheckboxId}"
                            data-module-id="${moduleId}"
                            aria-labelledby="completion-label-${moduleId}"
                            ${isCompleted ? 'checked' : ''}
                        >
                        <label for="${completionCheckboxId}" id="completion-label-${moduleId}">Marcar como entendido</label> {/* Texto do label atualizado */}
                    </div>
                </div>
            </details>
        `;
    }

    /** Gera o HTML para a seção de Cursos */
    function renderCursosSection() {
        let html = '<h2>Nossos Cursos</h2>';
        html += '<div class="cursos-grid">'; // Grid para os cards de curso

        for (const cursoId in cursosData) {
            const curso = cursosData[cursoId];
            html += `
                <div class="card curso-card">
                    <h3>${curso.titulo}</h3>
                    <p>${curso.descricao}</p>
                    <h4>Módulos:</h4>
            `;
            if (curso.modulos && curso.modulos.length > 0) {
                curso.modulos.forEach(module => {
                    html += renderModule(module, cursoId); // Passa o ID do curso se necessário
                });
            } else {
                html += '<p><em>Módulos em breve.</em></p>';
            }
            html += `</div>`; // Fecha card curso-card
        }
        html += '</div>'; // Fecha cursos-grid
        return html;
    }

    /** Gera o HTML para a seção de Início */
    function renderInicioSection() {
        return `
            <h2>Bem-vindo(a) ao TecnoClass!</h2>
            <p>Sua plataforma PWA para aprender sobre tecnologia de forma prática e acessível, onde quer que você esteja.</p>
            <p>Explore nossos cursos de <strong>Programação</strong>, <strong>Cibersegurança</strong>, <strong>Inteligência Artificial</strong> e <strong>Gestão de Produtos</strong>.</p>
            <p>Navegue pelas seções usando o menu acima. Suas anotações e progresso ficam salvos diretamente no seu navegador!</p>
            <div class="card">
                <h3>Recursos Principais:</h3>
                <ul>
                    <li>Conteúdo didático e direto ao ponto.</li>
                    <li>Anotações por módulo salvas localmente.</li>
                    <li>Acompanhamento de módulos concluídos.</li>
                    <li>Funciona offline após o primeiro acesso (PWA).</li>
                    <li>Interface limpa e responsiva.</li>
                </ul>
            </div>
        `;
    }

    /** Gera o HTML para a seção de Perfil (simples) */
    function renderPerfilSection() {
        const totalModules = Object.values(cursosData).reduce((sum, curso) => sum + curso.modulos.length, 0);
        const completedModules = Object.values(state.completion).filter(Boolean).length;
        const progress = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;

        return `
            <h2>Meu Perfil</h2>
            <div class="card">
                <h3>Progresso Geral</h3>
                <p>Você completou <strong>${completedModules}</strong> de <strong>${totalModules}</strong> módulos (${progress}%).</p>
                <progress max="100" value="${progress}" aria-label="Progresso geral nos cursos"></progress>
            </div>
             <div class="card">
                <h3>Gerenciamento de Dados</h3>
                <p>Suas anotações e progresso são salvos apenas neste navegador.</p>
                <button id="clear-storage-btn" class="btn btn-danger">Limpar Todos os Dados Salvos</button>
                <p><small><strong>Atenção:</strong> Esta ação é irreversível e apagará todas as suas anotações e progresso de conclusão.</small></p>
            </div>
        `;
    }


    /** Carrega o conteúdo da seção solicitada no elemento #content */
    function loadContent(sectionId) {
        console.log(`Carregando seção: ${sectionId}`);
        let htmlContent = '';

        switch (sectionId) {
            case 'cursos':
                htmlContent = renderCursosSection();
                break;
            case 'perfil':
                htmlContent = renderPerfilSection();
                break;
            case 'inicio':
            default:
                sectionId = 'inicio'; // Garante que 'inicio' seja o padrão
                htmlContent = renderInicioSection();
                break;
        }

        contentElement.innerHTML = htmlContent;
        updateActiveNav(sectionId);
        storage.set(STORAGE_KEYS.CURRENT_SECTION, sectionId); // Salva a seção atual
        addDynamicListeners(sectionId); // Adiciona listeners para elementos dinâmicos
    }

    /** Atualiza a classe 'active' na navegação */
    function updateActiveNav(activeSectionId) {
        if (!mainNav) return;
        const links = mainNav.querySelectorAll('.nav-link');
        links.forEach(link => {
            if (link.dataset.section === activeSectionId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page'); // Indica a página atual para acessibilidade
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    // --- Manipuladores de Eventos ---

    /** Lida com cliques na navegação principal */
    function handleNavClick(event) {
        event.preventDefault(); // Previne a navegação padrão do link '#'
        const link = event.target.closest('a.nav-link'); // Garante que pegamos o link mesmo clicando em algo dentro dele
        if (link && link.dataset.section) {
            const sectionId = link.dataset.section;
            loadContent(sectionId);
        }
    }

    /** Lida com eventos de input/change/click em elementos dinâmicos (delegação no #content) */
    function handleContentInteraction(event) {
        const target = event.target;
        const moduleId = target.dataset.moduleId;

        // Marcar Conclusão (na mudança do checkbox)
        if (target.matches('.module-actions input[type="checkbox"]') && moduleId) { // Condição simplificada
            const isCompleted = target.checked;
            state.completion[moduleId] = isCompleted;
            storage.set(STORAGE_KEYS.COMPLETION, state.completion);

            // Atualiza visual do <details> pai e do indicador no <summary>
            const detailsElement = target.closest('.module-details');
            if (detailsElement) {
                detailsElement.classList.toggle('completed', isCompleted);
                const indicator = detailsElement.querySelector('.module-summary .completion-indicator');
                if (indicator) {
                    indicator.textContent = isCompleted ? '✔' : '';
                }
            }
        }
        // Limpar Storage (no clique do botão)
        else if (target.matches('#clear-storage-btn')) {
            if (confirm("Tem certeza que deseja apagar TODO o seu progresso? Esta ação não pode ser desfeita.")) { // Texto do confirm atualizado
                storage.clearAllAppData();
            }
        }
    }


    /** Adiciona listeners aos elementos dinâmicos (usando delegação no #content) */
    function addDynamicListeners(sectionId) {
        // Remove listener anterior para evitar duplicação
        contentElement.removeEventListener('input', handleContentInteraction); // Listener de input não é mais necessário
        contentElement.removeEventListener('change', handleContentInteraction);
        contentElement.removeEventListener('click', handleContentInteraction);

        // Adiciona listeners delegados ao container #content
        // contentElement.addEventListener('input', handleContentInteraction); // Removido
        contentElement.addEventListener('change', handleContentInteraction); // Para checkboxes
        contentElement.addEventListener('click', handleContentInteraction); // Para botões (como o de limpar)
    }

    // --- Inicialização ---
    function init() {
        // Define o ano atual no rodapé
        if (currentYearElement) {
            currentYearElement.textContent = new Date().getFullYear();
        }

        // Carrega o estado inicial do localStorage
        loadInitialState();

        // Adiciona listener de clique à navegação principal (delegação)
        if (mainNav) {
            mainNav.addEventListener('click', handleNavClick);
        } else {
            console.error("Elemento de navegação #main-nav não encontrado.");
        }

        // Carrega a seção inicial (salva ou padrão 'inicio')
        const savedSection = storage.get(STORAGE_KEYS.CURRENT_SECTION, 'inicio');
        loadContent(savedSection);

        // Registra o Service Worker após o carregamento da página
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/service-worker.js') // Assume que está na raiz
                    .then(registration => {
                        console.log('Service Worker registrado com sucesso. Escopo:', registration.scope);
                    })
                    .catch(error => {
                        console.error('Falha ao registrar Service Worker:', error);
                    });
            });
        }
    }

    // Garante que o DOM está pronto antes de iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init(); // Chama init diretamente se o DOM já estiver pronto
    }

})(); // Fim da IIFE
