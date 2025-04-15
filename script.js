// Estrutura modular para o TecnoClass
(function() {
    'use strict';
    
    // Armazenar referências aos elementos DOM
    const contentElement = document.getElementById('content');
    const navLinks = document.querySelectorAll('nav a');
    
    // Dados dos cursos em formato JSON
    const cursosData = {
        programacao: {
            titulo: "Programação",
            descricao: "Aprenda a desenvolver software e aplicações web com as linguagens mais utilizadas no mercado.",
            modulos: [
                {
                    titulo: "Fundamentos da Programação",
                    descricao: "Conceitos básicos de lógica e algoritmos."
                },
                {
                    titulo: "JavaScript Moderno",
                    descricao: "Desenvolvimento front-end com JavaScript ES6+."
                },
                {
                    titulo: "Desenvolvimento Back-end",
                    descricao: "Criação de APIs e servidores com Node.js."
                }
            ]
        },
        ciberseguranca: {
            titulo: "Cibersegurança",
            descricao: "Proteja sistemas e redes contra ameaças digitais e aprenda técnicas de segurança da informação.",
            modulos: [
                {
                    titulo: "Fundamentos de Segurança",
                    descricao: "Princípios básicos de proteção de dados."
                },
                {
                    titulo: "Análise de Vulnerabilidades",
                    descricao: "Identificação e mitigação de riscos em sistemas."
                },
                {
                    titulo: "Resposta a Incidentes",
                    descricao: "Estratégias para lidar com violações de segurança."
                }
            ]
        },
        ia: {
            titulo: "Inteligência Artificial Generativa",
            descricao: "Explore o mundo dos modelos de IA capazes de criar conteúdo e resolver problemas complexos.",
            modulos: [
                {
                    titulo: "Fundamentos de IA",
                    descricao: "Conceitos básicos de aprendizado de máquina."
                },
                {
                    titulo: "Modelos Generativos",
                    descricao: "Compreensão de GANs, transformers e difusão."
                },
                {
                    titulo: "Aplicações Práticas",
                    descricao: "Implementação de soluções com IA generativa."
                }
            ]
        },
        po: {
            titulo: "Product Owner",
            descricao: "Aprenda a gerenciar produtos digitais e liderar equipes ágeis com foco em resultados.",
            modulos: [
                {
                    titulo: "Fundamentos de Produto",
                    descricao: "Conceitos básicos de gestão de produtos digitais."
                },
                {
                    titulo: "Metodologias Ágeis",
                    descricao: "Scrum, Kanban e frameworks para gestão de produtos."
                },
                {
                    titulo: "Métricas e Resultados",
                    descricao: "KPIs e análise de dados para tomada de decisão."
                }
            ]
        }
    };
    
    // Conteúdo simulado para cada seção
    const sectionContent = {
        inicio: `
            <h2>Bem-vindo ao TecnoClass</h2>
            <p>Sua plataforma de aprendizado em tecnologia.</p>
            <div class="card">
                <h3>Destaques da semana</h3>
                <p>Confira nossos cursos mais populares e comece sua jornada de aprendizado.</p>
            </div>
            <div class="card">
                <h3>Novidades</h3>
                <p>Acabamos de lançar novos cursos de programação e design.</p>
            </div>
        `,
        perfil: `
            <h2>Seu Perfil</h2>
            <p>Gerencie suas informações e acompanhe seu progresso.</p>
            <div class="card">
                <h3>Informações Pessoais</h3>
                <p>Atualize seus dados cadastrais e preferências.</p>
            </div>
            <div class="card">
                <h3>Progresso</h3>
                <p>Acompanhe seu desempenho nos cursos matriculados.</p>
            </div>
        `
    };
    
    /**
     * Gera o HTML para a seção de cursos
     * @returns {string} HTML formatado com os cursos
     */
    function gerarConteudoCursos() {
        let html = `
            <h2>Nossos Cursos</h2>
            <p>Explore nossa biblioteca de cursos de tecnologia.</p>
        `;
        
        // Percorrer todos os cursos e gerar cards
        for (const key in cursosData) {
            const curso = cursosData[key];
            
            html += `
                <div class="card">
                    <h3>${curso.titulo}</h3>
                    <p>${curso.descricao}</p>
                    <details>
                        <summary>Ver módulos do curso</summary>
                        <div class="modulos">
                            <ul>
            `;
            
            // Adicionar cada módulo do curso
            curso.modulos.forEach(modulo => {
                html += `
                    <li>
                        <strong>${modulo.titulo}</strong>: ${modulo.descricao}
                    </li>
                `;
            });
            
            html += `
                            </ul>
                        </div>
                    </details>
                </div>
            `;
        }
        
        return html;
    }
    
    /**
     * Carrega o conteúdo da seção selecionada
     * @param {string} section - Nome da seção a ser carregada
     */
    function loadContent(section) {
        let content = '';
        
        // Verificar qual seção carregar
        if (section === 'cursos') {
            // Gerar conteúdo dinâmico para a seção de cursos
            content = gerarConteudoCursos();
        } else if (sectionContent[section]) {
            // Usar conteúdo estático para outras seções
            content = sectionContent[section];
        } else {
            console.error('Seção não encontrada:', section);
            return;
        }
        
        // Atualizar o conteúdo na página
        contentElement.innerHTML = content;
        
        // Salvar a seção atual no localStorage
        localStorage.setItem('currentSection', section);
        
        // Atualizar classe ativa na navegação
        updateActiveNav(section);
    }
    
    /**
     * Atualiza a classe ativa no item de navegação
     * @param {string} section - Nome da seção ativa
     */
    function updateActiveNav(section) {
        navLinks.forEach(link => {
            if (link.dataset.section === section) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    /**
     * Inicializa a aplicação
     */
    function init() {
        // Adicionar event listeners aos links de navegação
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const section = this.dataset.section;
                loadContent(section);
            });
        });
        
        // Carregar a seção salva ou a seção inicial
        const savedSection = localStorage.getItem('currentSection');
        loadContent(savedSection || 'inicio');
    }
    
    // Iniciar a aplicação quando o DOM estiver pronto
    document.addEventListener('DOMContentLoaded', init);
})();
