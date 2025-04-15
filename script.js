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

    // --- Dados dos Cursos (Estrutura JSON com Conteúdo Detalhado e Simplificado) ---
    const cursosData = {
        programacao: {
            id: "programacao",
            titulo: "Programação Essencial",
            descricao: "Aprenda a criar software e páginas web interativas.",
            modulos: [
                {
                    id: "prog-01",
                    titulo: "Fundamentos da Lógica",
                    descricao: "Como 'pensar' como um computador para resolver problemas.",
                    conteudo: `
                        <h3>Entendendo a Lógica de Programação 🤔</h3>
                        <p>Programar é, essencialmente, dar instruções a um computador. Mas como fazer isso de forma que ele entenda? Usamos a lógica! Pense nela como a gramática da comunicação com máquinas.</p>
                        <p>É a habilidade de organizar seus pensamentos e dividir um problema grande em passos menores e sequenciais que o computador possa executar. Sem lógica, as instruções ficam confusas e o programa não funciona.</p>

                        <h4>Analogia: Seguindo uma Receita 🎂</h4>
                        <p>Uma receita de bolo é um ótimo exemplo de lógica. Ela lista os ingredientes (dados) e os passos exatos (instruções) na ordem correta. Se você pular um passo ou errar a ordem, o resultado não será o esperado. Programar segue o mesmo princípio: ordem e clareza são cruciais.</p>

                        <h4>O que são Algoritmos? 📜</h4>
                        <p>Um algoritmo é simplesmente essa sequência de passos bem definida para realizar uma tarefa ou resolver um problema. Desde calcular a média de notas até sugerir vídeos em uma plataforma, tudo se baseia em algoritmos.</p>

                        <h5>Mini Atividade (Reflita):</h5>
                        <ul>
                            <li>Quais são os passos lógicos para atravessar uma rua com segurança?</li>
                            <li>Como você explicaria, passo a passo, a tarefa de fazer café para alguém que nunca fez?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Lógica:</strong> A estrutura do raciocínio; a forma de organizar instruções sequenciais.</li>
                            <li><strong>Algoritmo:</strong> Uma receita passo a passo para resolver um problema.</li>
                            <li><strong>Instrução:</strong> Um comando único que o computador executa.</li>
                            <li><strong>Sequência:</strong> A ordem correta de execução das instruções.</li>
                        </ul>

                        <h5>Dica Importante ✨</h5>
                        <p>O foco inicial não é decorar termos, mas sim entender como quebrar tarefas em passos lógicos. Essa habilidade é a base de toda a programação.</p>
                    `
                },
                {
                    id: "prog-02",
                    titulo: "HTML & CSS Moderno",
                    descricao: "Construindo a estrutura e a aparência de páginas web.",
                    conteudo: `
                        <h3>HTML e CSS: A Base Visual da Web 🏗️🎨</h3>
                        <p>Quase tudo que você vê na internet (textos, imagens, botões) é estruturado com <strong>HTML (HyperText Markup Language)</strong>. Ele funciona como o esqueleto de uma página, definindo o que cada elemento é: um título, um parágrafo, um link, etc.</p>
                        <p>Para deixar essa estrutura bonita e organizada visualmente, usamos o <strong>CSS (Cascading Style Sheets)</strong>. Ele é como a pintura, a decoração e o layout da página, controlando cores, fontes, espaçamentos e como os elementos se adaptam a diferentes telas.</p>

                        <h4>Analogia: Construindo uma Casa 🏠</h4>
                        <p>O HTML seria a planta baixa e a estrutura bruta da casa: paredes, portas, janelas. O CSS seria toda a parte de acabamento e decoração: a cor das paredes, o tipo de piso, a disposição dos móveis.</p>

                        <h4>Como Funcionam Juntos?</h4>
                        <p>O HTML cria os blocos de conteúdo (ex: <code>&lt;h1&gt;Título&lt;/h1&gt;</code>, <code>&lt;img src="foto.jpg"&gt;</code>). O CSS então "mira" nesses blocos para aplicar estilos (ex: "Todo <code>&lt;h1&gt;</code> deve ser azul", "Toda <code>&lt;img&gt;</code> deve ter uma borda suave").</p>

                        <h5>Mini Atividade (Observação):</h5>
                        <ul>
                            <li>Navegue em um site que você gosta. Tente identificar o que é estrutura (HTML) e o que é estilo visual (CSS).</li>
                            <li>Pense em uma página simples sobre você. Que elementos HTML você usaria (título, parágrafos, talvez uma foto)? Como o CSS poderia deixá-la mais agradável?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>HTML:</strong> Linguagem para marcar e organizar o conteúdo de uma página web.</li>
                            <li><strong>CSS:</strong> Linguagem para estilizar a aparência dos elementos HTML.</li>
                            <li><strong>Tag:</strong> Marcador do HTML (ex: <code>&lt;p&gt;</code> para parágrafo).</li>
                            <li><strong>Elemento:</strong> Um componente da página definido por uma tag (ex: um título, uma imagem).</li>
                            <li><strong>Estilo:</strong> Regra CSS que define a aparência (cor, tamanho, etc.).</li>
                            <li><strong>Responsivo:</strong> Design que se ajusta bem a diferentes tamanhos de tela (celular, tablet, desktop).</li>
                        </ul>

                        <h5>Curiosidade 🤓</h5>
                        <p>Embora essenciais para a web, HTML e CSS não são considerados linguagens de programação completas, pois não possuem a mesma capacidade lógica complexa que linguagens como JavaScript.</p>
                    `
                },
                {
                    id: "prog-03",
                    titulo: "JavaScript Interativo",
                    descricao: "Adicionando comportamento e interatividade às páginas.",
                    conteudo: `
                        <h3>JavaScript: Tornando a Web Dinâmica ✨</h3>
                        <p>Se HTML é a estrutura e CSS é a aparência, o <strong>JavaScript (JS)</strong> é o que dá vida e inteligência à página. Ele permite que a página reaja às ações do usuário (cliques, digitação), atualize conteúdos sem recarregar e crie interações complexas.</p>
                        <p>Exemplos: menus que aparecem, formulários que validam dados, galerias de fotos que deslizam, jogos no navegador – tudo isso geralmente usa JavaScript.</p>

                        <h4>Analogia: O Sistema Elétrico de uma Casa 💡</h4>
                        <p>HTML/CSS definem a lâmpada e o interruptor (estrutura e aparência). O JavaScript é a fiação e a lógica que fazem a luz acender *quando* você aperta o interruptor. Ele conecta a ação (apertar) ao resultado (luz acesa).</p>

                        <h4>O que é o DOM? 🌳</h4>
                        <p>O navegador cria uma representação da estrutura HTML chamada <strong>DOM (Document Object Model)</strong>. Pense nisso como uma árvore genealógica da página, onde cada elemento HTML é um galho ou folha. O JavaScript usa o DOM para encontrar, modificar, adicionar ou remover elementos e seus estilos.</p>
                        <p>Com o DOM, o JS pode:
                            <ul>
                                <li>Achar um botão específico.</li>
                                <li>Mudar o texto de um parágrafo.</li>
                                <li>Esconder ou mostrar uma seção.</li>
                                <li>Reagir a um clique ou ao movimento do mouse.</li>
                            </ul>
                        </p>

                        <h5>Mini Atividade (Interação):</h5>
                        <ul>
                            <li>Em sites que você usa, preste atenção: o que acontece quando você clica em um botão "Curtir", abre um menu ou preenche um formulário? Tente imaginar o JS trabalhando por trás.</li>
                            <li>Que tipo de interatividade você gostaria de adicionar a uma página simples? (Ex: um botão que muda a cor do fundo).</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>JavaScript (JS):</strong> Linguagem de programação que roda no navegador para criar interatividade.</li>
                            <li><strong>DOM:</strong> A representação da estrutura HTML que o JS manipula.</li>
                            <li><strong>Evento:</strong> Uma ação do usuário ou do navegador (clique, carregamento da página, etc.) que o JS pode detectar.</li>
                            <li><strong>Manipulação do DOM:</strong> Usar JS para alterar a página HTML/CSS dinamicamente.</li>
                            <li><strong>Front-end:</strong> A parte da aplicação web com a qual o usuário interage diretamente (HTML, CSS, JS no navegador).</li>
                        </ul>

                        <h5>Dica Poderosa 🚀</h5>
                        <p>JavaScript é uma linguagem versátil! Além do navegador, ela também é usada no back-end (com Node.js), em aplicativos móveis e muito mais.</p>
                    `
                },
                {
                    id: "prog-04",
                    titulo: "Introdução ao Back-end",
                    descricao: "Entendendo o que acontece 'por trás das câmeras' na web.",
                    conteudo: `
                        <h3>Back-end: Os Bastidores da Aplicação ⚙️</h3>
                        <p>Enquanto o Front-end (HTML, CSS, JS) é o que você vê e interage no navegador, o <strong>Back-end</strong> é a parte "invisível" que roda em servidores. Ele cuida da lógica de negócios, do acesso a bancos de dados, da segurança e de fornecer os dados que o front-end exibe.</p>
                        <p>Pense em salvar seu perfil em uma rede social, fazer uma compra online ou buscar um vídeo. Essas ações dependem do back-end para processar e armazenar as informações.</p>

                        <h4>Analogia: Um Restaurante 🍽️</h4>
                        <p>O salão, o cardápio e o garçom são o Front-end. A cozinha, o chef, o estoque de ingredientes e o sistema de caixa são o Back-end. Você faz o pedido (requisição no front-end), ele vai para a cozinha (back-end) ser preparado e depois volta para você.</p>

                        <h4>Componentes Comuns do Back-end:</h4>
                        <ul>
                            <li><strong>Servidor:</strong> Computador (ou conjunto deles) que hospeda a aplicação e responde às solicitações dos usuários.</li>
                            <li><strong>Linguagem de Back-end:</strong> Linguagens como Node.js (JavaScript!), Python, Java, PHP, Ruby, C# usadas para escrever a lógica do servidor.</li>
                            <li><strong>Banco de Dados:</strong> Onde os dados da aplicação (usuários, produtos, posts) são armazenados de forma organizada e persistente.</li>
                            <li><strong>API (Application Programming Interface):</strong> Um conjunto de regras e rotinas que define como o front-end (ou outros sistemas) pode se comunicar com o back-end para solicitar dados ou executar ações. Funciona como um "contrato" de comunicação.</li>
                        </ul>

                        <h5>Mini Atividade (Conceitual):</h5>
                        <ul>
                            <li>Ao usar um app de streaming de música, quais ações você acha que dependem do back-end? (Ex: buscar uma música, salvar uma playlist, seguir um artista).</li>
                            <li>Por que é importante ter uma camada de back-end separada do front-end? (Pense em segurança e organização).</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Back-end:</strong> A parte da aplicação que roda no servidor, gerenciando lógica e dados.</li>
                            <li><strong>Servidor:</strong> Máquina que executa o código back-end e responde a requisições.</li>
                            <li><strong>Banco de Dados:</strong> Sistema para armazenar e recuperar dados de forma estruturada.</li>
                            <li><strong>API:</strong> Interface que permite a comunicação entre diferentes partes de um software (ex: front-end e back-end).</li>
                            <li><strong>Requisição/Resposta (Request/Response):</strong> O ciclo básico de comunicação na web (o navegador pede algo, o servidor responde).</li>
                        </ul>

                        <h5>Perspectiva 🌐</h5>
                        <p>Entender o back-end é crucial para construir aplicações web completas e escaláveis, mesmo que você se especialize mais no front-end.</p>
                    `
                }
            ]
        },
        ciberseguranca: {
            id: "ciberseguranca",
            titulo: "Cibersegurança Defensiva",
            descricao: "Aprenda a proteger dados e sistemas contra ataques digitais.",
            modulos: [
                {
                    id: "ciber-01",
                    titulo: "Princípios de Segurança",
                    descricao: "A base para proteger informações: Confidencialidade, Integridade e Disponibilidade.",
                    conteudo: `
                        <h3>Os Pilares da Segurança da Informação: CIA 🛡️</h3>
                        <p>No mundo digital, proteger informações é fundamental. A base dessa proteção é conhecida como a Tríade CIA, que não tem nada a ver com agências de espionagem, mas sim com três princípios essenciais:</p>
                        <ul>
                            <li><strong>Confidencialidade:</strong> Garantir que apenas pessoas autorizadas tenham acesso à informação. É como trancar um diário ou usar uma senha no celular.</li>
                            <li><strong>Integridade:</strong> Assegurar que a informação não foi alterada indevidamente, seja por acidente ou por alguém mal-intencionado. É garantir que a mensagem que você enviou chegue exatamente como você a escreveu.</li>
                            <li><strong>Disponibilidade:</strong> Certificar que a informação e os sistemas estejam acessíveis para usuários autorizados sempre que precisarem. É como garantir que o site do banco esteja funcionando quando você precisa fazer uma transferência.</li>
                        </ul>

                        <h4>Analogia: Proteger um Documento Importante 📄</h4>
                        <p>Imagine um contrato valioso:</p>
                        <ul>
                            <li>Guardá-lo em um cofre garante a <strong>Confidencialidade</strong>.</li>
                            <li>Usar um lacre ou assinatura reconhecida garante a <strong>Integridade</strong> (ninguém alterou o conteúdo).</li>
                            <li>Saber onde o cofre está e ter a chave garante a <strong>Disponibilidade</strong> quando você precisar consultá-lo.</li>
                        </ul>
                        <p>Perder qualquer um desses pilares compromete a segurança do documento (ou da informação digital).</p>

                        <h5>Mini Atividade (Análise):</h5>
                        <ul>
                            <li>Pense em um aplicativo que você usa (e-mail, rede social). Como ele tenta garantir a Confidencialidade dos seus dados?</li>
                            <li>O que poderia acontecer se a Integridade das informações bancárias fosse comprometida?</li>
                            <li>Que problemas ocorrem quando um serviço online importante fica indisponível (falta de Disponibilidade)?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Confidencialidade:</strong> Restrição de acesso à informação.</li>
                            <li><strong>Integridade:</strong> Garantia de que a informação é precisa e não foi modificada.</li>
                            <li><strong>Disponibilidade:</strong> Garantia de que a informação e os serviços estão acessíveis.</li>
                            <li><strong>Tríade CIA:</strong> O conjunto dos três princípios fundamentais da segurança da informação.</li>
                            <li><strong>Dado Sensível:</strong> Informação que, se exposta, pode causar danos (ex: senhas, dados bancários, informações médicas).</li>
                        </ul>

                        <h5>Reflexão 🤔</h5>
                        <p>Entender a Tríade CIA ajuda a tomar decisões mais seguras no dia a dia digital, desde escolher senhas fortes até desconfiar de links suspeitos.</p>
                    `
                },
                {
                    id: "ciber-02",
                    titulo: "Análise de Vulnerabilidades",
                    descricao: "Identificando e corrigindo pontos fracos em sistemas.",
                    conteudo: `
                        <h3>Encontrando as Brechas: O que são Vulnerabilidades? 🔍</h3>
                        <p>Nenhum sistema é 100% perfeito. Uma <strong>vulnerabilidade</strong> é uma fraqueza em um sistema (software, hardware, rede ou até mesmo processos humanos) que pode ser explorada por um atacante para causar danos, roubar informações ou interromper serviços.</p>
                        <p>A análise de vulnerabilidades é o processo de identificar essas fraquezas antes que alguém mal-intencionado as encontre.</p>

                        <h4>Analogia: Inspecionando uma Casa 🏠</h4>
                        <p>Pense em um ladrão tentando entrar em uma casa. Ele vai procurar por pontos fracos: uma janela aberta, uma porta destrancada, uma fechadura frágil. Essas são as "vulnerabilidades" da casa. A análise de vulnerabilidades seria como o dono da casa inspecionando tudo (janelas, portas, fechaduras, muros) para encontrar e corrigir esses pontos fracos antes que o ladrão apareça.</p>

                        <h4>Tipos Comuns de Vulnerabilidades:</h4>
                        <ul>
                            <li><strong>Software desatualizado:</strong> Programas que não receberam as últimas correções de segurança.</li>
                            <li><strong>Senhas fracas ou padrão:</strong> Fáceis de adivinhar ou descobrir.</li>
                            <li><strong>Configurações inseguras:</strong> Permissões excessivas ou serviços desnecessários habilitados.</li>
                            <li><strong>Falhas de programação (Bugs):</strong> Erros no código que podem ser explorados.</li>
                            <li><strong>Engenharia Social:</strong> Manipular pessoas para obter informações ou acesso (ex: phishing).</li>
                        </ul>

                        <h5>Mini Atividade (Prevenção):</h5>
                        <ul>
                            <li>Verifique se o sistema operacional e os aplicativos do seu celular/computador estão atualizados. Por que isso é importante?</li>
                            <li>Como você cria suas senhas? Elas são fáceis de adivinhar? Você usa a mesma senha para vários sites? (Não compartilhe suas senhas, apenas reflita!).</li>
                            <li>Você já recebeu um e-mail ou mensagem suspeita pedindo informações pessoais (phishing)? Como identificou?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Vulnerabilidade:</strong> Uma fraqueza que pode ser explorada.</li>
                            <li><strong>Exploit:</strong> Uma técnica ou código que se aproveita de uma vulnerabilidade específica.</li>
                            <li><strong>Patch:</strong> Uma correção de software para corrigir uma vulnerabilidade.</li>
                            <li><strong>Scanner de Vulnerabilidades:</strong> Ferramenta automatizada para procurar fraquezas conhecidas.</li>
                            <li><strong>Engenharia Social:</strong> Tática de manipulação psicológica para enganar pessoas.</li>
                            <li><strong>Phishing:</strong> Tentativa de obter informações sensíveis (senhas, cartões) fingindo ser uma entidade confiável.</li>
                        </ul>

                        <h5>Atitude Proativa 💪</h5>
                        <p>Manter sistemas atualizados, usar senhas fortes e estar atento a golpes de engenharia social são passos essenciais para reduzir as vulnerabilidades no seu dia a dia.</p>
                    `
                },
                {
                    id: "ciber-03",
                    titulo: "Segurança de Redes",
                    descricao: "Protegendo a comunicação e os dados que trafegam na rede.",
                    conteudo: `
                        <h3>Protegendo as Estradas da Informação: Segurança de Redes 🌐</h3>
                        <p>Assim como precisamos de segurança nas estradas para viajar, precisamos de segurança nas redes de computadores (como a internet) para que nossos dados trafeguem sem serem interceptados, alterados ou bloqueados.</p>
                        <p>Segurança de Redes envolve um conjunto de tecnologias e práticas para proteger a infraestrutura da rede e controlar o acesso a ela.</p>

                        <h4>Analogia: O Controle de Fronteira 🛂</h4>
                        <p>Pense na rede da sua casa ou empresa como um pequeno país. O <strong>Firewall</strong> funciona como o controle de fronteira: ele inspeciona o tráfego que tenta entrar ou sair, bloqueando o que for suspeito ou não autorizado, baseado em regras definidas.</p>
                        <p>Uma <strong>VPN (Virtual Private Network)</strong> seria como um túnel seguro e criptografado que você usa para atravessar territórios potencialmente perigosos (como uma rede Wi-Fi pública). Mesmo que alguém olhe, não consegue ver o que está passando dentro do túnel.</p>

                        <h4>Tecnologias Chave:</h4>
                        <ul>
                            <li><strong>Firewall:</strong> Barreira que filtra o tráfego de rede baseado em regras.</li>
                            <li><strong>VPN:</strong> Cria uma conexão segura e criptografada sobre uma rede pública.</li>
                            <li><strong>Criptografia:</strong> Codifica os dados para que só possam ser lidos por quem tem a "chave" correta (ex: HTTPS em sites seguros).</li>
                            <li><strong>Sistemas de Detecção/Prevenção de Intrusão (IDS/IPS):</strong> Monitoram a rede em busca de atividades maliciosas e podem alertar ou bloquear automaticamente.</li>
                            <li><strong>Controle de Acesso:</strong> Garantir que apenas usuários e dispositivos autorizados possam se conectar à rede (ex: senhas de Wi-Fi fortes).</li>
                        </ul>

                        <h5>Mini Atividade (Verificação):</h5>
                        <ul>
                            <li>Ao acessar um site (como o do seu banco), você verifica se há um cadeado 🔒 na barra de endereço (indicando HTTPS)? Por que isso é importante?</li>
                            <li>Você usa a senha padrão que veio no seu roteador Wi-Fi ou criou uma senha forte e única?</li>
                            <li>Você já se conectou a redes Wi-Fi públicas abertas (sem senha)? Quais os riscos?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Rede:</strong> Conjunto de dispositivos interconectados que trocam informações.</li>
                            <li><strong>Firewall:</strong> Filtro de segurança para tráfego de rede.</li>
                            <li><strong>VPN:</strong> Rede privada virtual para conexões seguras.</li>
                            <li><strong>Criptografia:</strong> Processo de codificar dados para protegê-los.</li>
                            <li><strong>HTTPS:</strong> Versão segura do protocolo HTTP, usa criptografia.</li>
                            <li><strong>Wi-Fi Público:</strong> Rede sem fio aberta ao público, geralmente menos segura.</li>
                        </ul>

                        <h5>Cuidado Constante 🚦</h5>
                        <p>A segurança de redes não é algo que se configura uma vez e esquece. É um processo contínuo de monitoramento, atualização e adaptação às novas ameaças.</p>
                    `
                },
                {
                    id: "ciber-04",
                    titulo: "Resposta a Incidentes",
                    descricao: "O que fazer quando um problema de segurança acontece.",
                    conteudo: `
                        <h3>Quando o Pior Acontece: Lidando com Incidentes de Segurança 🚨</h3>
                        <p>Mesmo com as melhores defesas, incidentes de segurança (como um ataque de malware, vazamento de dados ou acesso não autorizado) podem ocorrer. Ter um plano de <strong>Resposta a Incidentes</strong> é crucial para minimizar os danos, recuperar-se rapidamente e aprender com o ocorrido.</p>
                        <p>Não se trata apenas de corrigir o problema técnico, mas também de gerenciar a situação de forma organizada.</p>

                        <h4>Analogia: Plano de Evacuação de Incêndio 🔥</h4>
                        <p>Um plano de resposta a incidentes é como um plano de evacuação de incêndio em um prédio. Ninguém quer que um incêndio ocorra, mas se ocorrer, todos sabem o que fazer: onde estão as saídas de emergência, quem contatar, onde é o ponto de encontro seguro. O objetivo é garantir a segurança e minimizar o caos e os danos.</p>

                        <h4>Fases Comuns de um Plano de Resposta a Incidentes:</h4>
                        <ol>
                            <li><strong>Preparação:</strong> Ter as ferramentas, processos e equipe treinada *antes* que algo aconteça.</li>
                            <li><strong>Identificação:</strong> Detectar que um incidente ocorreu e entender sua natureza inicial.</li>
                            <li><strong>Contenção:</strong> Isolar o problema para evitar que ele se espalhe (ex: desconectar uma máquina infectada da rede).</li>
                            <li><strong>Erradicação:</strong> Remover a causa raiz do incidente (ex: eliminar o malware).</li>
                            <li><strong>Recuperação:</strong> Restaurar os sistemas e dados afetados para a operação normal.</li>
                            <li><strong>Lições Aprendidas (Pós-Incidente):</strong> Analisar o que aconteceu, por que aconteceu e como melhorar as defesas para evitar recorrências.</li>
                        </ol>

                        <h5>Mini Atividade (Simulação Mental):</h5>
                        <ul>
                            <li>Imagine que seu computador começou a agir de forma estranha e você suspeita de um vírus (malware). Quais seriam seus primeiros passos (Identificação, Contenção)?</li>
                            <li>Se você percebesse que sua conta de e-mail foi invadida, o que você faria (Contenção, Erradicação, Recuperação)?</li>
                            <li>Por que a fase de "Lições Aprendidas" é tão importante?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Incidente de Segurança:</strong> Qualquer evento que viole as políticas de segurança ou ameace a confidencialidade, integridade ou disponibilidade.</li>
                            <li><strong>Malware:</strong> Software malicioso (vírus, ransomware, spyware, etc.).</li>
                            <li><strong>Ransomware:</strong> Malware que criptografa seus arquivos e exige pagamento para liberá-los.</li>
                            <li><strong>Vazamento de Dados:</strong> Exposição não autorizada de informações sensíveis.</li>
                            <li><strong>Plano de Resposta a Incidentes (PRI):</strong> Documento que detalha como lidar com incidentes de segurança.</li>
                            <li><strong>Backup:</strong> Cópia de segurança dos dados, essencial para a recuperação.</li>
                        </ul>

                        <h5>Prevenção é Chave, Preparação é Crucial 🔑</h5>
                        <p>Embora o foco seja sempre prevenir incidentes, estar preparado para responder a eles de forma eficaz é o que diferencia uma pequena interrupção de um desastre completo.</p>
                    `
                }
            ]
        },
        ia: {
            id: "ia",
            titulo: "IA Generativa na Prática",
            descricao: "Entenda e utilize modelos de IA que criam conteúdo.",
            modulos: [
                {
                    id: "ia-01",
                    titulo: "Fundamentos de IA/ML",
                    descricao: "O que são Inteligência Artificial e Aprendizado de Máquina?",
                    conteudo: `
                        <h3>Desvendando a IA e o Aprendizado de Máquina 🤖</h3>
                        <p><strong>Inteligência Artificial (IA)</strong> é um campo amplo da ciência da computação que busca criar sistemas capazes de realizar tarefas que normalmente exigiriam inteligência humana, como aprender, raciocinar, resolver problemas, perceber o ambiente e compreender a linguagem.</p>
                        <p><strong>Aprendizado de Máquina (Machine Learning - ML)</strong> é um subcampo da IA. Em vez de programar regras explícitas para cada tarefa, no ML nós "ensinamos" o computador usando dados. O sistema aprende padrões nesses dados e se torna capaz de fazer previsões ou tomar decisões sobre novos dados que nunca viu antes.</p>

                        <h4>Analogia: Aprendendo a Identificar Frutas 🍎🍌</h4>
                        <p>Imagine ensinar uma criança a diferenciar maçãs de bananas. Você não descreve cada detalhe (cor, formato, textura) com regras complexas. Você mostra várias fotos de maçãs (dados de treino) e diz "isso é uma maçã". Mostra várias fotos de bananas e diz "isso é uma banana". Com exemplos suficientes, a criança (o modelo de ML) aprende os padrões e consegue identificar corretamente uma nova foto de maçã ou banana.</p>

                        <h4>Tipos de Aprendizado de Máquina:</h4>
                        <ul>
                            <li><strong>Supervisionado:</strong> O mais comum. O sistema aprende com dados rotulados (como as fotos de frutas com seus nomes). Usado para classificação (maçã/banana) e regressão (prever o preço de uma casa).</li>
                            <li><strong>Não Supervisionado:</strong> O sistema recebe dados sem rótulos e tenta encontrar padrões ou estruturas ocultas por conta própria (ex: agrupar clientes com hábitos de compra similares).</li>
                            <li><strong>Por Reforço:</strong> O sistema aprende por tentativa e erro, recebendo recompensas por ações corretas e penalidades por ações erradas (ex: treinar um robô para andar ou um agente para jogar xadrez).</li>
                        </ul>

                        <h5>Mini Atividade (Identificação):</h5>
                        <ul>
                            <li>Pense no sistema de recomendação de filmes/séries da sua plataforma de streaming. Que tipo de aprendizado você acha que ele usa? Por quê?</li>
                            <li>Um sistema que detecta spam no seu e-mail é um exemplo de qual tipo de aprendizado?</li>
                            <li>Como um carro autônomo poderia usar aprendizado por reforço?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Inteligência Artificial (IA):</strong> Sistemas que simulam capacidades cognitivas humanas.</li>
                            <li><strong>Aprendizado de Máquina (ML):</strong> Subcampo da IA onde sistemas aprendem a partir de dados.</li>
                            <li><strong>Modelo:</strong> O resultado do treinamento de um algoritmo de ML; a "inteligência" aprendida.</li>
                            <li><strong>Dados de Treino:</strong> Os dados usados para ensinar o modelo.</li>
                            <li><strong>Classificação:</strong> Tarefa de ML para categorizar dados (ex: spam/não spam).</li>
                            <li><strong>Regressão:</strong> Tarefa de ML para prever um valor numérico (ex: preço, temperatura).</li>
                        </ul>

                        <h5>O Poder dos Dados 📊</h5>
                        <p>A qualidade e a quantidade dos dados de treino são cruciais para o desempenho de um modelo de Aprendizado de Máquina. Dados ruins ou enviesados levam a modelos ruins.</p>
                    `
                },
                {
                    id: "ia-02",
                    titulo: "Modelos Generativos (LLMs)",
                    descricao: "Como funcionam as IAs que criam textos, imagens e mais.",
                    conteudo: `
                        <h3>A Magia da Criação: Modelos Generativos e LLMs ✨</h3>
                        <p><strong>Modelos Generativos</strong> são um tipo fascinante de IA que aprende os padrões e a estrutura dos dados com os quais foram treinados e, a partir disso, conseguem gerar dados *novos* e *originais* que se assemelham aos dados de treino.</p>
                        <p>Eles podem gerar textos, imagens, músicas, códigos e muito mais. Os <strong>LLMs (Large Language Models - Grandes Modelos de Linguagem)</strong>, como o GPT (usado no ChatGPT) ou o Gemini, são um tipo específico de modelo generativo focado em entender e gerar linguagem humana (texto).</p>

                        <h4>Analogia: Um Músico Improvisador 🎷</h4>
                        <p>Imagine um músico de jazz que ouviu milhares de horas de músicas de diferentes artistas (dados de treino). Ele aprendeu as escalas, os ritmos, as harmonias e os estilos (padrões). Quando pedem para ele improvisar um solo (gerar conteúdo novo), ele não copia exatamente o que ouviu, mas cria algo original que soa como jazz, baseado em todo o conhecimento que absorveu.</p>

                        <h4>Como os LLMs Aprendem?</h4>
                        <p>LLMs são treinados com quantidades massivas de texto da internet, livros, artigos, etc. Eles aprendem a prever qual é a próxima palavra mais provável em uma sequência. Por exemplo, se você der a frase "O céu é...", o modelo aprendeu que "azul" é uma continuação muito provável.</p>
                        <p>Essa capacidade de prever a próxima palavra, feita em grande escala e com modelos muito complexos (como os "Transformers"), permite que eles gerem textos coerentes, respondam perguntas, traduzam idiomas, escrevam códigos e muito mais.</p>

                        <h5>Mini Atividade (Experimentação):</h5>
                        <ul>
                            <li>Se você já usou ferramentas como ChatGPT, Gemini ou Midjourney, pense: qual foi o comando (prompt) que você deu? Qual foi o resultado gerado?</li>
                            <li>Tente dar um comando simples a um LLM (se tiver acesso), como "Escreva um poema curto sobre a chuva". Observe a estrutura e o estilo do texto gerado.</li>
                            <li>Como você acha que um modelo generativo aprende a criar imagens (e não texto)?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Modelo Generativo:</strong> IA que cria novos dados semelhantes aos dados de treino.</li>
                            <li><strong>LLM (Large Language Model):</strong> Modelo generativo especializado em linguagem humana (texto).</li>
                            <li><strong>Transformer:</strong> Arquitetura de rede neural muito eficaz para processar sequências (como texto), base de muitos LLMs modernos.</li>
                            <li><strong>Prompt:</strong> O comando ou a instrução inicial que você dá a um modelo generativo.</li>
                            <li><strong>Geração de Texto/Imagem/Código:</strong> A capacidade do modelo de criar esses tipos de conteúdo.</li>
                        </ul>

                        <h5>Não é Mágica, é Matemática (Complexa)! 🤯</h5>
                        <p>Embora os resultados pareçam mágicos, os LLMs funcionam com base em probabilidade e estatística aplicadas a enormes volumes de dados. Eles não "entendem" o mundo como nós, mas são incrivelmente bons em identificar e reproduzir padrões linguísticos.</p>
                    `
                },
                {
                    id: "ia-03",
                    titulo: "Engenharia de Prompt",
                    descricao: "A arte de 'conversar' com a IA para obter os melhores resultados.",
                    conteudo: `
                        <h3>Conversando com a IA: A Engenharia de Prompt 🗣️</h3>
                        <p>Modelos Generativos, especialmente LLMs, são ferramentas poderosas, mas a qualidade do resultado que você obtém depende muito da qualidade da instrução que você fornece. A <strong>Engenharia de Prompt</strong> é a habilidade de criar comandos (prompts) claros, específicos e eficazes para guiar a IA a gerar a resposta desejada.</p>
                        <p>Não é programação no sentido tradicional, mas sim uma forma de comunicação estratégica com o modelo.</p>

                        <h4>Analogia: Pedindo um Desenho a um Artista 🎨</h4>
                        <p>Imagine pedir a um artista para desenhar "um cachorro". Você pode obter qualquer tipo de cachorro. Mas se você pedir "um desenho realista de um cachorro Golden Retriever filhote, brincando em um jardim florido, com iluminação suave do fim de tarde", você está dando um prompt muito mais específico e provavelmente obterá um resultado mais próximo do que imaginou. A engenharia de prompt funciona de forma similar.</p>

                        <h4>Dicas para Bons Prompts:</h4>
                        <ul>
                            <li><strong>Seja Específico:</strong> Evite comandos vagos. Diga exatamente o que você quer. (Ex: Em vez de "Fale sobre IA", tente "Explique o conceito de Aprendizado Supervisionado para um iniciante").</li>
                            <li><strong>Dê Contexto:</strong> Forneça informações relevantes que ajudem a IA a entender a situação. (Ex: "Estou escrevendo um e-mail para meu chefe sobre X. Preciso de um tom formal e conciso.").</li>
                            <li><strong>Defina o Formato da Saída:</strong> Peça o resultado em um formato específico, se necessário. (Ex: "Liste os pontos principais em bullet points", "Escreva a resposta em formato de tabela", "Gere um código Python").</li>
                            <li><strong>Indique o Papel ou Persona:</strong> Peça à IA para agir como um especialista em determinada área. (Ex: "Aja como um professor de história e explique a Revolução Francesa.").</li>
                            <li><strong>Itere e Refine:</strong> Raramente o primeiro prompt é perfeito. Se o resultado não for bom, ajuste o prompt e tente novamente.</li>
                        </ul>

                        <h5>Mini Atividade (Criação de Prompts):</h5>
                        <ul>
                            <li>Como você pediria a um LLM para gerar ideias de nomes para uma nova cafeteria? (Tente ser específico sobre o estilo da cafeteria).</li>
                            <li>Você precisa resumir um artigo longo para uma apresentação. Qual seria um bom prompt para pedir isso a um LLM?</li>
                            <li>Transforme o pedido vago "Escreva uma história" em um prompt mais específico e interessante.</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Prompt:</strong> A entrada de texto (instrução, pergunta) fornecida a um modelo generativo.</li>
                            <li><strong>Engenharia de Prompt:</strong> A prática de projetar e refinar prompts para obter melhores resultados da IA.</li>
                            <li><strong>Contexto:</strong> Informações adicionais fornecidas no prompt para guiar a IA.</li>
                            <li><strong>Formato de Saída:</strong> A estrutura desejada para a resposta da IA (lista, tabela, parágrafo, código, etc.).</li>
                            <li><strong>Persona/Papel:</strong> Definir um papel específico para a IA assumir ao responder.</li>
                            <li><strong>Iteração:</strong> O processo de tentar, avaliar o resultado e refinar o prompt.</li>
                        </ul>

                        <h5>A Chave da Colaboração 🗝️</h5>
                        <p>Engenharia de prompt é sobre aprender a colaborar com a IA. Quanto melhor você se comunica com ela, melhores serão os resultados que ela poderá oferecer.</p>
                    `
                },
                {
                    id: "ia-04",
                    titulo: "Ética em IA",
                    descricao: "Desafios e responsabilidades no desenvolvimento e uso de IA.",
                    conteudo: `
                        <h3>IA com Responsabilidade: As Questões Éticas 🧭</h3>
                        <p>À medida que a Inteligência Artificial se torna mais poderosa e integrada ao nosso dia a dia, surgem importantes questões éticas sobre seu desenvolvimento e uso. Não basta criar IAs que funcionem; precisamos garantir que elas sejam justas, seguras e benéficas para a sociedade.</p>
                        <p>A ética em IA envolve refletir sobre os impactos sociais, os riscos potenciais e como podemos construir e usar essa tecnologia de forma responsável.</p>

                        <h4>Analogia: Construindo Ferramentas Poderosas 🛠️</h4>
                        <p>Pense na invenção de ferramentas como martelos ou facas. Elas podem ser usadas para construir coisas maravilhosas ou para causar danos. A ferramenta em si não é boa nem má, mas seu uso tem consequências. Com a IA, que é uma ferramenta muito mais complexa e com potencial de impacto muito maior, a responsabilidade sobre como ela é construída e utilizada é ainda mais crítica.</p>

                        <h4>Principais Desafios Éticos:</h4>
                        <ul>
                            <li><strong>Vieses (Bias):</strong> Se a IA for treinada com dados que refletem preconceitos existentes na sociedade (racismo, sexismo, etc.), ela pode aprender e perpetuar esses vieses em suas decisões (ex: sistemas de reconhecimento facial que funcionam pior para certos grupos étnicos, algoritmos de contratação que discriminam).</li>
                            <li><strong>Transparência e Explicabilidade:</strong> Muitos modelos de IA complexos funcionam como "caixas-pretas", sendo difícil entender *por que* tomaram uma determinada decisão. Isso é problemático em áreas críticas como diagnósticos médicos ou concessão de crédito.</li>
                            <li><strong>Privacidade:</strong> IAs frequentemente precisam de grandes volumes de dados para treinar, levantando preocupações sobre como esses dados são coletados, usados e protegidos.</li>
                            <li><strong>Responsabilidade (Accountability):</strong> Quem é responsável se uma IA causar danos? O desenvolvedor, a empresa que a utiliza, o usuário? Definir responsabilidades é complexo.</li>
                            <li><strong>Impacto no Emprego:</strong> A automação impulsionada pela IA pode deslocar trabalhadores de certas funções, exigindo requalificação e adaptação da força de trabalho.</li>
                            <li><strong>Segurança e Mau Uso:</strong> IAs podem ser usadas para fins maliciosos, como criar deepfakes para desinformação, desenvolver armas autônomas ou realizar ataques cibernéticos mais sofisticados.</li>
                        </ul>

                        <h5>Mini Atividade (Reflexão Crítica):</h5>
                        <ul>
                            <li>Como o viés nos dados de treinamento de uma IA usada para análise de currículos poderia prejudicar candidatos?</li>
                            <li>Por que a falta de explicabilidade é um problema sério em um sistema de IA que recomenda sentenças criminais?</li>
                            <li>Que medidas você acha que podem ser tomadas para mitigar os riscos do mau uso da IA generativa (como deepfakes)?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Ética em IA:</strong> Campo que estuda as implicações morais e sociais da IA.</li>
                            <li><strong>Viés (Bias):</strong> Preconceito sistemático nos dados ou no algoritmo que leva a resultados injustos.</li>
                            <li><strong>Transparência:</strong> Clareza sobre como um sistema de IA funciona.</li>
                            <li><strong>Explicabilidade (XAI):</strong> Capacidade de explicar as decisões de um modelo de IA.</li>
                            <li><strong>Privacidade:</strong> Proteção de dados pessoais.</li>
                            <li><strong>Responsabilidade (Accountability):</strong> Definição de quem responde pelas ações da IA.</li>
                            <li><strong>Deepfake:</strong> Mídia sintética (vídeo, áudio) criada por IA para parecer real, frequentemente usada para enganar.</li>
                        </ul>

                        <h5>Construindo um Futuro Melhor 🤝</h5>
                        <p>A discussão sobre ética em IA não é apenas para especialistas. É fundamental que toda a sociedade participe para garantir que a IA seja desenvolvida e utilizada de forma a promover o bem-estar humano e a justiça.</p>
                    `
                }
            ]
        },
        po: {
            id: "po",
            titulo: "Product Owner Ágil",
            descricao: "Lidere o desenvolvimento de produtos digitais com foco no valor.",
            modulos: [
                {
                    id: "po-01",
                    titulo: "Fundamentos de Produto",
                    descricao: "O que é um produto digital e como definir sua visão.",
                    conteudo: `
                        <h3>O Coração do Negócio: Entendendo Produtos Digitais 💡</h3>
                        <p>No mundo digital, um <strong>produto</strong> é qualquer solução (site, aplicativo, plataforma, serviço online) criada para resolver um problema ou atender a uma necessidade de um grupo específico de usuários (clientes).</p>
                        <p>Gerenciar um produto não é apenas sobre construir funcionalidades, mas sim sobre entender o mercado, os usuários e entregar <strong>valor</strong> de forma contínua. A <strong>Visão do Produto</strong> é a estrela-guia: ela descreve o futuro desejado para o produto e o propósito que ele serve.</p>

                        <h4>Analogia: Construindo uma Ponte 🌉</h4>
                        <p>Imagine que há uma necessidade de conectar duas cidades separadas por um rio (o problema/necessidade). O produto seria a ponte. A <strong>Visão</strong> seria "Conectar as cidades de forma rápida e segura, impulsionando o comércio e facilitando a vida dos moradores". A <strong>Estratégia</strong> definiria *como* construir essa ponte (tipo de material, fases da construção, orçamento) para alcançar a visão.</p>

                        <h4>Ciclo de Vida do Produto:</h4>
                        <p>Produtos digitais geralmente passam por fases:</p>
                        <ol>
                            <li><strong>Introdução:</strong> Lançamento no mercado, foco em atrair os primeiros usuários.</li>
                            <li><strong>Crescimento:</strong> Rápida adoção, foco em escalar e adicionar funcionalidades chave.</li>
                            <li><strong>Maturidade:</strong> Mercado estabelecido, foco em otimizar, reter usuários e se diferenciar da concorrência.</li>
                            <li><strong>Declínio:</strong> Uso começa a cair, necessidade de pivotar (mudar a direção) ou descontinuar o produto.</li>
                        </ol>
                        <p>Entender em que fase o produto está ajuda a definir as prioridades corretas.</p>

                        <h5>Mini Atividade (Análise de Produto):</h5>
                        <ul>
                            <li>Escolha um aplicativo ou site que você usa frequentemente. Qual problema ele resolve para você? Quem você acha que são os principais usuários?</li>
                            <li>Qual poderia ser a "Visão" de longo prazo para esse produto?</li>
                            <li>Em que fase do ciclo de vida você acha que ele está? Por quê?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Produto Digital:</strong> Solução baseada em tecnologia para atender a uma necessidade do usuário.</li>
                            <li><strong>Valor:</strong> O benefício percebido pelo usuário ou pelo negócio ao usar o produto.</li>
                            <li><strong>Visão do Produto:</strong> O objetivo de longo prazo e o propósito do produto.</li>
                            <li><strong>Estratégia de Produto:</strong> O plano de alto nível para alcançar a visão do produto.</li>
                            <li><strong>Ciclo de Vida do Produto:</strong> As fases pelas quais um produto passa desde a concepção até a retirada do mercado.</li>
                            <li><strong>Usuário/Cliente:</strong> A pessoa ou grupo para quem o produto é destinado.</li>
                        </ul>

                        <h5>Foco no Problema, Não Apenas na Solução 🎯</h5>
                        <p>Bons produtos nascem de um profundo entendimento do problema que estão tentando resolver, não apenas de uma ideia de funcionalidade legal.</p>
                    `
                },
                {
                    id: "po-02",
                    titulo: "Metodologias Ágeis (Scrum)",
                    descricao: "Trabalhando de forma colaborativa e adaptativa com Scrum.",
                    conteudo: `
                        <h3>Entregando Valor Mais Rápido: O Mundo Ágil e o Scrum 🏃💨</h3>
                        <p>No desenvolvimento de software tradicional (modelo "cascata"), planejava-se tudo no início e só se via o resultado final meses ou anos depois. As <strong>Metodologias Ágeis</strong> surgiram como uma alternativa para lidar com a incerteza e a necessidade de adaptação rápida no mundo da tecnologia.</p>
                        <p>O <strong>Scrum</strong> é o framework ágil mais popular. Ele não diz *exatamente* como fazer tudo, mas fornece uma estrutura com papéis, eventos e artefatos definidos para ajudar equipes a entregar valor em ciclos curtos (chamados Sprints), inspecionar o resultado e se adaptar continuamente.</p>

                        <h4>Analogia: Planejando uma Viagem Longa 🗺️</h4>
                        <p>No modelo cascata, você planejaria cada detalhe da viagem (hotéis, passeios, restaurantes) para os próximos 6 meses antes de sair de casa. No modelo ágil/Scrum, você define o destino final (Visão do Produto), planeja detalhadamente apenas a primeira semana (Sprint), viaja essa semana, vê o que funcionou e o que não funcionou (Revisão/Retrospectiva) e então planeja a próxima semana, ajustando a rota se necessário.</p>

                        <h4>Pilares e Valores Ágeis:</h4>
                        <p>O Manifesto Ágil (documento base) valoriza:</p>
                        <ul>
                            <li><strong>Indivíduos e interações</strong> mais que processos e ferramentas.</li>
                            <li><strong>Software em funcionamento</strong> mais que documentação abrangente.</li>
                            <li><strong>Colaboração com o cliente</strong> mais que negociação de contratos.</li>
                            <li><strong>Responder a mudanças</strong> mais que seguir um plano rígido.</li>
                        </ul>

                        <h4>Componentes do Scrum:</h4>
                        <ul>
                            <li><strong>Papéis:</strong> Product Owner (PO - define o quê), Scrum Master (SM - facilita o processo), Time de Desenvolvimento (Dev Team - constrói o produto).</li>
                            <li><strong>Eventos (Cerimônias):</strong> Sprint (ciclo de 1-4 semanas), Sprint Planning (planeja o trabalho da Sprint), Daily Scrum (reunião diária rápida), Sprint Review (mostra o resultado da Sprint), Sprint Retrospective (avalia como melhorar o processo).</li>
                            <li><strong>Artefatos:</strong> Product Backlog (lista de tudo que o produto pode ter), Sprint Backlog (itens selecionados para a Sprint atual), Incremento (a parte do produto funcional entregue ao final da Sprint).</li>
                        </ul>

                        <h5>Mini Atividade (Reflexão sobre Colaboração):</h5>
                        <ul>
                            <li>Pense em um projeto em grupo (escolar ou profissional) que deu certo. Quais fatores contribuíram para o sucesso da colaboração?</li>
                            <li>Como a ideia de "responder a mudanças" pode ser aplicada em projetos fora do desenvolvimento de software?</li>
                            <li>Por que é importante ter ciclos curtos (Sprints) para inspecionar o trabalho e se adaptar?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Ágil:</strong> Abordagem iterativa e incremental para gerenciamento de projetos e desenvolvimento de software.</li>
                            <li><strong>Scrum:</strong> Framework ágil popular com papéis, eventos e artefatos definidos.</li>
                            <li><strong>Sprint:</strong> Ciclo de trabalho curto (1-4 semanas) com um objetivo definido.</li>
                            <li><strong>Product Owner (PO):</strong> Responsável por maximizar o valor do produto, gerenciando o Product Backlog.</li>
                            <li><strong>Scrum Master (SM):</strong> Líder servidor que ajuda a equipe a seguir o Scrum e remover impedimentos.</li>
                            <li><strong>Time de Desenvolvimento:</strong> Grupo auto-organizável que constrói o Incremento do produto.</li>
                            <li><strong>Product Backlog:</strong> Lista ordenada de funcionalidades, requisitos, melhorias e correções para o produto.</li>
                        </ul>

                        <h5>Não é Anarquia, é Disciplina!  disciplined</h5>
                        <p>Embora flexível, o Scrum exige disciplina da equipe para seguir seus eventos e manter seus artefatos atualizados para funcionar bem.</p>
                    `
                },
                {
                    id: "po-03",
                    titulo: "Gestão de Backlog",
                    descricao: "Priorizando o que construir e como descrever o trabalho.",
                    conteudo: `
                        <h3>Construindo a Coisa Certa: Gerenciando o Product Backlog  backlog</h3>
                        <p>O <strong>Product Backlog</strong> é o coração do produto no Scrum. É uma lista única, ordenada e dinâmica de tudo que é conhecido e necessário para o produto: novas funcionalidades, mudanças em funcionalidades existentes, correções de bugs, trabalho técnico, etc. O <strong>Product Owner (PO)</strong> é o único responsável por gerenciar essa lista.</p>
                        <p>Gerenciar o backlog não é só adicionar itens, mas principalmente <strong>priorizá-los</strong> (o que é mais importante fazer agora?) e <strong>refiná-los</strong> (garantir que os itens do topo estejam claros e prontos para serem trabalhados pela equipe).</p>

                        <h4>Analogia: Lista de Compras do Supermercado 🛒</h4>
                        <p>Imagine sua lista de compras como um backlog. Você não compra tudo de uma vez. Você prioriza: o que é essencial para o jantar de hoje? O que pode esperar para a próxima semana? Você também refina: em vez de só "frutas", você especifica "3 bananas nanicas maduras" para o item que vai comprar logo. O PO faz algo similar com as funcionalidades do produto.</p>

                        <h4>Priorização: Decidindo o que Vem Primeiro</h4>
                        <p>Não há uma fórmula única, mas a priorização deve focar em maximizar o <strong>valor</strong> entregue. Fatores comuns incluem:</p>
                        <ul>
                            <li>Valor para o negócio/cliente</li>
                            <li>Urgência / Dependências</li>
                            <li>Custo/Esforço de implementação</li>
                            <li>Risco / Oportunidade</li>
                        </ul>
                        <p>Técnicas como MoSCoW (Must have, Should have, Could have, Won't have) ou matrizes de valor vs. esforço podem ajudar.</p>

                        <h4>User Stories (Histórias de Usuário): Descrevendo o Trabalho</h4>
                        <p>Uma forma comum de escrever itens do backlog é usando <strong>User Stories</strong>. Elas descrevem uma funcionalidade do ponto de vista do usuário, focando no *quem*, *o quê* e *por quê*.</p>
                        <p>Formato comum: "Como um(a) <strong>[tipo de usuário]</strong>, eu quero <strong>[realizar alguma ação]</strong> para que <strong>[obtenha algum benefício/valor]</strong>."</p>
                        <p>Exemplo: "Como um(a) <strong>cliente da loja online</strong>, eu quero <strong>adicionar produtos ao carrinho de compras</strong> para que <strong>possa comprá-los mais tarde</strong>."</p>
                        <p>Boas User Stories são frequentemente lembradas pelo acrônimo INVEST: Independent, Negotiable, Valuable, Estimable, Small, Testable.</p>

                        <h5>Mini Atividade (Escrevendo Histórias):</h5>
                        <ul>
                            <li>Pense em uma funcionalidade simples de um app que você usa (ex: dar 'like' em uma foto). Tente escrevê-la no formato de User Story.</li>
                            <li>Se você tivesse que priorizar 3 novas funcionalidades para um app de mensagens (ex: reações com emojis, chamadas de vídeo em grupo, status temporário), que critérios você usaria?</li>
                            <li>Por que é importante que os itens do topo do backlog estejam bem refinados e detalhados?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Product Backlog:</strong> Lista priorizada de tudo que pode ser feito no produto.</li>
                            <li><strong>Item do Backlog (PBI):</strong> Uma entrada única no Product Backlog (pode ser uma User Story, bug, etc.).</li>
                            <li><strong>Priorização:</strong> Ato de ordenar os itens do backlog por importância/valor.</li>
                            <li><strong>Refinamento (Grooming):</strong> Atividade contínua de detalhar, estimar e ordenar os itens do backlog.</li>
                            <li><strong>User Story (História de Usuário):</strong> Descrição curta de uma funcionalidade sob a perspectiva do usuário.</li>
                            <li><strong>Critérios de Aceite:</strong> Condições que a User Story deve atender para ser considerada concluída.</li>
                        </ul>

                        <h5>É uma Lista Viva! 🌱</h5>
                        <p>O Product Backlog nunca está "completo". Ele evolui constantemente à medida que se aprende mais sobre o produto, os usuários e o mercado.</p>
                    `
                },
                {
                    id: "po-04",
                    titulo: "Métricas e KPIs",
                    descricao: "Medindo o sucesso e o impacto do produto.",
                    conteudo: `
                        <h3>Medindo o que Importa: Métricas e KPIs de Produto 📈</h3>
                        <p>Como saber se o produto está realmente entregando valor e alcançando seus objetivos? Através de <strong>Métricas</strong>! Métricas são medidas quantificáveis que ajudam a acompanhar o desempenho, o uso e o impacto do produto.</p>
                        <p><strong>KPIs (Key Performance Indicators - Indicadores Chave de Performance)</strong> são as métricas mais importantes, aquelas que estão diretamente ligadas aos objetivos estratégicos do produto e do negócio. Nem toda métrica é um KPI.</p>

                        <h4>Analogia: O Painel do Carro 🚗</h4>
                        <p>O painel do carro mostra várias métricas: velocidade, nível de combustível, temperatura do motor, rotações por minuto, quilometragem. Todas são úteis. Mas, dependendo do seu objetivo no momento, algumas se tornam KPIs. Se você está preocupado em não levar uma multa, a velocidade é um KPI. Se está com medo de ficar sem gasolina, o nível de combustível é o KPI principal.</p>

                        <h4>Por que Medir?</h4>
                        <ul>
                            <li><strong>Tomar Decisões Informadas:</strong> Dados ajudam a priorizar funcionalidades, identificar problemas e entender o comportamento do usuário, em vez de depender apenas de "achismos".</li>
                            <li><strong>Validar Hipóteses:</strong> Lançou uma nova funcionalidade? As métricas podem dizer se ela está sendo usada e se está gerando o resultado esperado.</li>
                            <li><strong>Comunicar Progresso:</strong> Métricas e KPIs ajudam a mostrar o valor do produto para stakeholders (diretoria, investidores, etc.).</li>
                            <li><strong>Identificar Oportunidades:</strong> Analisar métricas pode revelar áreas onde o produto pode ser melhorado ou novas oportunidades de crescimento.</li>
                        </ul>

                        <h4>Exemplos de Métricas Comuns (Variam por Produto):</h4>
                        <ul>
                            <li><strong>Métricas de Aquisição:</strong> Nº de novos usuários, Custo por Aquisição (CPA).</li>
                            <li><strong>Métricas de Ativação:</strong> % de usuários que completam uma ação chave inicial (ex: cadastrar perfil).</li>
                            <li><strong>Métricas de Retenção:</strong> Taxa de usuários que continuam usando o produto ao longo do tempo (Churn Rate - taxa de abandono).</li>
                            <li><strong>Métricas de Engajamento:</strong> Usuários ativos diários/mensais (DAU/MAU), tempo gasto no app, nº de ações chave realizadas.</li>
                            <li><strong>Métricas de Receita:</strong> Receita Média Por Usuário (ARPU), Valor do Tempo de Vida do Cliente (LTV).</li>
                            <li><strong>Métricas de Satisfação:</strong> Net Promoter Score (NPS), avaliações na loja de apps, feedback direto.</li>
                        </ul>

                        <h5>Mini Atividade (Definindo Métricas):</h5>
                        <ul>
                            <li>Para um aplicativo de lista de tarefas, quais 2 ou 3 métricas você acha que seriam KPIs importantes para medir o sucesso? Por quê?</li>
                            <li>Se a taxa de retenção de um app está caindo, que tipo de problema isso pode indicar?</li>
                            <li>Por que é perigoso focar apenas em "métricas de vaidade" (ex: número total de downloads) sem olhar para engajamento ou retenção?</li>
                        </ul>

                        <h5>Glossário Essencial:</h5>
                        <ul>
                            <li><strong>Métrica:</strong> Uma medida quantificável de um aspecto do produto ou do seu uso.</li>
                            <li><strong>KPI (Key Performance Indicator):</strong> Uma métrica crucial que reflete o progresso em direção a um objetivo estratégico.</li>
                            <li><strong>Aquisição:</strong> Trazer novos usuários para o produto.</li>
                            <li><strong>Ativação:</strong> Fazer com que o novo usuário experimente o valor principal do produto.</li>
                            <li><strong>Retenção:</strong> Manter os usuários voltando ao produto.</li>
                            <li><strong>Engajamento:</strong> Medir quão ativamente os usuários estão interagindo com o produto.</li>
                            <li><strong>Stakeholder:</strong> Qualquer pessoa ou grupo com interesse no produto (clientes, equipe, diretoria, investidores).</li>
                        </ul>

                        <h5>Comece Simples, Mas Comece! 🏁</h5>
                        <p>Não tente medir tudo de uma vez. Escolha algumas métricas chave que realmente importam para os objetivos atuais do seu produto e comece a acompanhá-las consistentemente.</p>
                    `
                }
            ]
        }
    };

    // --- Funções Auxiliares ---
    // ... (Funções debounce, storage, etc. permanecem as mesmas) ...
    const storage = {
        get: (key, defaultValue = null) => {
            try {
                const value = localStorage.getItem(key);
                return value !== null ? JSON.parse(value) : defaultValue;
            } catch (e) {
                console.error(`Erro ao ler do localStorage (chave: ${key}):`, e);
                return defaultValue;
            }
        },
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error(`Erro ao salvar no localStorage (chave: ${key}):`, e);
            }
        },
        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error(`Erro ao remover do localStorage (chave: ${key}):`, e);
            }
        },
        clearAllAppData: () => {
            try {
                // Limpa apenas as chaves usadas pela aplicação
                Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
                console.log("Dados do TecnoClass removidos do localStorage.");
                // Recarrega a página ou atualiza a interface para refletir a limpeza
                location.reload(); // Simples, mas eficaz para resetar a UI
            } catch (e) {
                console.error("Erro ao limpar dados do localStorage:", e);
                alert("Erro ao tentar limpar os dados salvos.");
            }
        }
    };

    // Debounce para salvar notas
    let noteSaveTimeout;
    const debounceSaveNote = (moduleId, content) => {
        clearTimeout(noteSaveTimeout);
        noteSaveTimeout = setTimeout(() => {
            state.notes[moduleId] = content;
            storage.set(STORAGE_KEYS.NOTES, state.notes);
            // console.log(`Nota salva para ${moduleId}`);
        }, NOTE_SAVE_DEBOUNCE_MS);
    };


    // --- Estado da Aplicação ---
    let state = {
        notes: {},
        completion: {}
    };

    /** Carrega o estado inicial do localStorage */
    function loadInitialState() {
        state.notes = storage.get(STORAGE_KEYS.NOTES, {});
        state.completion = storage.get(STORAGE_KEYS.COMPLETION, {});
    }


    // --- Funções de Renderização ---

    /** Gera o HTML para um único módulo */
    function renderModule(module, cursoId) {
        const moduleId = module.id;
        const noteTextareaId = `notes-${moduleId}`;
        const completionCheckboxId = `completion-${moduleId}`;
        const currentNote = state.notes[moduleId] || '';
        const isCompleted = state.completion[moduleId] || false;
        // Garante que o conteúdo detalhado seja uma string vazia se não existir
        const detailedContent = module.conteudo || '<p><em>Conteúdo detalhado em breve.</em></p>';

        return `
            <details class="module-details ${isCompleted ? 'completed' : ''}" data-module-id="${moduleId}">
                <summary class="module-summary">
                    ${module.titulo}
                    <span class="completion-indicator" aria-hidden="true">${isCompleted ? '✔' : ''}</span>
                    <span class="module-description">${module.descricao}</span>
                </summary>
                <div class="module-content">
                    ${detailedContent} {/* CORREÇÃO: Removido o comentário extra daqui */}
                    <hr>
                    <div class="module-notes">
                        <label for="${noteTextareaId}">Minhas Anotações:</label>
                        <textarea
                            id="${noteTextareaId}"
                            data-module-id="${moduleId}"
                            aria-label="Anotações para o módulo ${module.titulo}"
                            rows="5"
                            placeholder="Digite suas anotações aqui..."
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

        // Salvar Anotações (no input)
        if (target.matches('.module-notes textarea') && moduleId) {
            debounceSaveNote(moduleId, target.value);
        }
        // Marcar Conclusão (na mudança do checkbox)
        else if (target.matches('.module-actions input[type="checkbox"]') && moduleId) {
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
                    // Atualiza ARIA label implicitamente pela mudança visual, mas pode adicionar explicitamente se necessário
                }
            }
        }
        // Limpar Storage (no clique do botão)
        else if (target.matches('#clear-storage-btn')) {
            if (confirm("Tem certeza que deseja apagar TODAS as suas anotações e progresso? Esta ação não pode ser desfeita.")) {
                storage.clearAllAppData();
            }
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
