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

    // --- Dados dos Cursos (Estrutura JSON) ---
    const cursosData = {
        programacao: {
            id: "programacao",
            titulo: "Programação Essencial",
            descricao: "Desenvolva software e aplicações web com as linguagens mais populares.",
            modulos: [
                { id: "prog-01", titulo: "Fundamentos da Lógica", descricao: "Conceitos básicos de algoritmos e pensamento computacional." },
                { id: "prog-02", titulo: "HTML & CSS Moderno", descricao: "Estruturação e estilização de páginas web responsivas." },
                { id: "prog-03", titulo: "JavaScript Interativo", descricao: "Manipulação do DOM e interatividade no front-end." },
                { id: "prog-04", titulo: "Introdução ao Back-end", descricao: "Conceitos de servidores, APIs e bancos de dados." }
            ]
        },
        ciberseguranca: {
            id: "ciberseguranca",
            titulo: "Cibersegurança Defensiva",
            descricao: "Proteja sistemas e redes contra ameaças digitais.",
            modulos: [
                { id: "ciber-01", titulo: "Princípios de Segurança", descricao: "Confidencialidade, Integridade e Disponibilidade." },
                { id: "ciber-02", titulo: "Análise de Vulnerabilidades", descricao: "Identificação e mitigação de riscos em sistemas." },
                { id: "ciber-03", titulo: "Segurança de Redes", descricao: "Firewalls, VPNs e protocolos seguros." },
                { id: "ciber-04", titulo: "Resposta a Incidentes", descricao: "Estratégias para lidar com violações de segurança." }
            ]
        },
        ia: {
            id: "ia",
            titulo: "IA Generativa na Prática",
            descricao: "Explore modelos de IA capazes de criar conteúdo e resolver problemas.",
            modulos: [
                { id: "ia-01", titulo: "Fundamentos de IA/ML", descricao: "Conceitos básicos de aprendizado de máquina." },
                { id: "ia-02", titulo: "Modelos Generativos (LLMs)", descricao: "Compreensão de transformers e suas aplicações." },
                { id: "ia-03", titulo: "Engenharia de Prompt", descricao: "Como interagir efetivamente com IAs generativas." },
                { id: "ia-04", titulo: "Ética em IA", descricao: "Discussões sobre vieses e responsabilidade." }
            ]
        },
        po: {
            id: "po",
            titulo: "Product Owner Ágil",
            descricao: "Gerencie produtos digitais e lidere equipes com foco em resultados.",
            modulos: [
                { id: "po-01", titulo: "Fundamentos de Produto", descricao: "Ciclo de vida, visão e estratégia de produto." },
                { id: "po-02", titulo: "Metodologias Ágeis (Scrum)", descricao: "Papéis, cerimônias e artefatos do Scrum." },
                { id: "po-03", titulo: "Gestão de Backlog", descricao: "Priorização, escrita de User Stories e refinamento." },
                { id: "po-04", titulo: "Métricas e KPIs", descricao: "Medindo o sucesso e o valor do produto." }
            ]
        }
    };

    // --- Conteúdo Estático das Seções ---
    const staticSectionContent = {
        inicio: `
            <h2>Bem-vindo ao TecnoClass!</h2>
            <p>Sua plataforma PWA para aprender tecnologia de forma prática e acessível.</p>
            <div class="card">
                <h3>Explore Nossos Cursos</h3>
                <p>Navegue pela seção 'Cursos' para encontrar trilhas de aprendizado em programação, cibersegurança, IA e gestão de produtos.</p>
            </div>
            <div class="card">
                <h3>Acompanhe seu Progresso</h3>
                <p>Marque módulos como concluídos e faça anotações diretamente no aplicativo. Seus dados ficam salvos no seu navegador.</p>
            </div>
             <div class="card">
                <h3>Acesso Offline</h3>
                <p>Como um Progressive Web App (PWA), o TecnoClass pode ser instalado e acessado mesmo sem conexão com a internet (após o primeiro carregamento e registro do Service Worker).</p>
            </div>
        `,
        perfil: `
            <h2>Perfil do Aluno</h2>
            <p>Gerencie seus dados salvos localmente.</p>
            <div class="card">
                <h3>Progresso e Anotações</h3>
                <p>Todo o seu progresso nos módulos e suas anotações são salvos automaticamente no armazenamento local do seu navegador.</p>
            </div>
             <div class="card">
                <h3>Limpar Dados Locais</h3>
                <p><strong>Atenção:</strong> Esta ação removerá permanentemente todas as suas anotações e o status de conclusão dos módulos salvos neste navegador.</p>
                <button id="clear-storage-btn" class="button-danger" aria-label="Limpar todos os dados salvos do TecnoClass">Limpar Dados Salvos</button>
            </div>
        `
    };

    // --- Funções Utilitárias (LocalStorage) ---
    const storage = {
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                // Verifica se o item existe e não é 'undefined' (string)
                return item !== null && item !== 'undefined' ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error(`Erro ao ler do localStorage (chave: ${key}):`, e);
                return defaultValue;
            }
        },
        set: (key, value) => {
            try {
                if (value === undefined) {
                    console.warn(`Tentativa de salvar valor 'undefined' para a chave ${key}. Removendo a chave.`);
                    localStorage.removeItem(key);
                } else {
                    localStorage.setItem(key, JSON.stringify(value));
                }
            } catch (e) {
                console.error(`Erro ao salvar no localStorage (chave: ${key}):`, e);
                // Considerar notificar o usuário se o armazenamento estiver cheio
                if (e.name === 'QuotaExceededError') {
                    alert('Erro: Não foi possível salvar os dados. O armazenamento local está cheio.');
                }
            }
        },
        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error(`Erro ao remover do localStorage (chave: ${key}):`, e);
            }
        },
        // Limpa apenas os dados específicos desta aplicação
        clearAllAppData: () => {
            if (confirm("Tem certeza que deseja apagar TODO o seu progresso e anotações salvos neste navegador? Esta ação não pode ser desfeita.")) {
                Object.values(STORAGE_KEYS).forEach(key => storage.remove(key));
                console.log("Dados do TecnoClass removidos do localStorage.");
                alert("Todos os dados de progresso e anotações foram removidos!");
                // Recarrega o estado local e a visualização
                loadInitialState();
                loadContent('perfil'); // Recarrega a seção de perfil
            }
        }
    };

    // --- Estado da Aplicação (Carregado do Storage) ---
    let state = {
        notes: {},
        completion: {}
    };

    function loadInitialState() {
        state.notes = storage.get(STORAGE_KEYS.NOTES, {});
        state.completion = storage.get(STORAGE_KEYS.COMPLETION, {});
    }

    // --- Funções de Renderização ---

    /** Gera o HTML para um único módulo dentro de <details> */
    function renderModule(module) {
        const moduleId = module.id;
        const isCompleted = state.completion[moduleId] || false;
        const currentNote = state.notes[moduleId] || '';
        // Sanitizar IDs para uso em atributos HTML se necessário (aqui parece seguro)
        const noteTextareaId = `notes-${moduleId}`;
        const completionCheckboxId = `completion-${moduleId}`;

        return `
            <details class="module-details ${isCompleted ? 'completed' : ''}" data-module-id="${moduleId}">
                <summary class="module-summary" aria-expanded="false" aria-controls="module-content-${moduleId}">
                    ${module.titulo}
                </summary>
                <div class="module-content" id="module-content-${moduleId}" role="region">
                    <h4>${module.titulo}</h4>
                    <p>${module.descricao}</p>
                    <div class="module-notes">
                        <label for="${noteTextareaId}">Minhas Anotações:</label>
                        <textarea
                            id="${noteTextareaId}"
                            data-module-id="${moduleId}"
                            aria-label="Anotações para o módulo ${module.titulo}"
                            rows="4"
                        >${currentNote}</textarea>
                    </div>
                    <div class="module-actions">
                        <input
                            type="checkbox"
                            id="${completionCheckboxId}"
                            data-module-id="${moduleId}"
                            aria-labelledby="completion-label-${moduleId}"
                            ${isCompleted ? 'checked' : ''}
                        >
                        <label for="${completionCheckboxId}" id="completion-label-${moduleId}">Marcar como concluído</label>
                    </div>
                </div>
            </details>
        `;
    }

    /** Gera o HTML para a seção de Cursos */
    function renderCursos() {
        let coursesHTML = '<h2>Nossos Cursos</h2>';
        for (const courseKey in cursosData) {
            const course = cursosData[courseKey];
            coursesHTML += `
                <div class="card course-card" data-course-id="${course.id}">
                    <h3>${course.titulo}</h3>
                    <p>${course.descricao}</p>
                    <h4>Módulos:</h4>
                    ${course.modulos.map(renderModule).join('')}
                </div>
            `;
        }
        return coursesHTML;
    }

    /** Carrega o conteúdo da seção solicitada no elemento #content */
    function loadContent(sectionId) {
        let contentToLoad = '';

        switch (sectionId) {
            case 'inicio':
            case 'perfil':
                contentToLoad = staticSectionContent[sectionId];
                break;
            case 'cursos':
                contentToLoad = renderCursos();
                break;
            default:
                console.warn(`Seção desconhecida: ${sectionId}. Carregando Início.`);
                sectionId = 'inicio'; // Volta para o início se a seção for inválida
                contentToLoad = staticSectionContent.inicio;
        }

        if (!contentElement) {
            console.error("Elemento #content não encontrado no DOM.");
            return;
        }

        contentElement.innerHTML = contentToLoad;
        updateActiveNav(sectionId);
        storage.set(STORAGE_KEYS.CURRENT_SECTION, sectionId);

        // Adiciona listeners aos elementos dinâmicos APÓS serem inseridos no DOM
        addDynamicListeners(sectionId);
    }

    /** Atualiza a classe 'active' e aria-current na navegação */
    function updateActiveNav(activeSectionId) {
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.dataset.section === activeSectionId) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    // --- Handlers de Eventos ---

    /** Lida com cliques na navegação principal (usando delegação) */
    function handleNavClick(event) {
        const link = event.target.closest('.nav-link'); // Encontra o link clicado
        if (link && link.dataset.section) {
            event.preventDefault();
            const sectionId = link.dataset.section;
            loadContent(sectionId);
            // Foca no início do conteúdo principal para acessibilidade
            contentElement.focus(); // Pode precisar de tabindex="-1" no #content se não for naturalmente focável
        }
    }

    /** Debounce para salvar notas */
    let noteSaveTimeout;
    function debounceSaveNote(moduleId, value) {
        clearTimeout(noteSaveTimeout);
        noteSaveTimeout = setTimeout(() => {
            state.notes[moduleId] = value;
            storage.set(STORAGE_KEYS.NOTES, state.notes);
            // console.log(`Nota salva para ${moduleId}`); // Para debug
        }, NOTE_SAVE_DEBOUNCE_MS);
    }

    /** Lida com eventos de input/change em elementos dinâmicos (delegação no #content) */
    function handleContentInteraction(event) {
        const target = event.target;

        // Salvar Anotações (no input)
        if (target.matches('.module-notes textarea')) {
            const moduleId = target.dataset.moduleId;
            if (moduleId) {
                debounceSaveNote(moduleId, target.value);
            }
        }
        // Marcar Conclusão (na mudança do checkbox)
        else if (target.matches('.module-actions input[type="checkbox"]')) {
            const moduleId = target.dataset.moduleId;
            if (moduleId) {
                const isCompleted = target.checked;
                state.completion[moduleId] = isCompleted;
                storage.set(STORAGE_KEYS.COMPLETION, state.completion);
                // Atualiza visual do <details> pai
                const detailsElement = target.closest('.module-details');
                if (detailsElement) {
                    detailsElement.classList.toggle('completed', isCompleted);
                }
            }
        }
        // Limpar Storage (no clique do botão)
        else if (target.matches('#clear-storage-btn')) {
            storage.clearAllAppData();
        }
    }

    /** Adiciona listeners aos elementos dinâmicos (usando delegação no #content) */
    function addDynamicListeners(sectionId) {
        // Remove listener anterior para evitar duplicação (embora a delegação minimize isso)
        contentElement.removeEventListener('input', handleContentInteraction);
        contentElement.removeEventListener('change', handleContentInteraction);
        contentElement.removeEventListener('click', handleContentInteraction);

        // Adiciona listeners delegados ao container #content
        contentElement.addEventListener('input', handleContentInteraction); // Para textareas
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
