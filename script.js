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

    // --- Dados dos Cursos (Estrutura JSON com Conteúdo Detalhado) ---
    const cursosData = {
        programacao: {
            id: "programacao",
            titulo: "Programação Essencial",
            descricao: "Desenvolva software e aplicações web com as linguagens mais populares.",
            modulos: [
                {
                    id: "prog-01",
                    titulo: "Fundamentos da Lógica",
                    descricao: "Conceitos básicos de algoritmos e pensamento computacional.",
                    conteudo: `
                        <h3>O que é Lógica de Programação? 🤔</h3>
                        <p>Imagine que você quer fazer um bolo. Você precisa seguir uma receita, certo? A receita tem passos claros: misture os ingredientes A e B, depois adicione C, leve ao forno por X minutos. A lógica de programação é como essa receita, mas para computadores!</p>
                        <p>É a arte de dar instruções passo a passo, de forma organizada e sem ambiguidades, para que um computador possa realizar uma tarefa. Sem uma lógica clara, o computador fica perdido, assim como você ficaria sem uma receita.</p>

                        <h4>Analogia do Dia a Dia: Montando um Móvel 🛋️</h4>
                        <p>Pense em montar um móvel que você comprou desmontado. O manual de instruções é a sua "lógica". Ele diz: "Pegue o parafuso A e encaixe na peça 1", "Fixe a prateleira B usando a chave C". Se você pular um passo ou usar a peça errada, o móvel não ficará correto. Com a programação é a mesma coisa: a ordem e a precisão das instruções são fundamentais.</p>

                        <h4>Algoritmos: A Receita do Computador 📜</h4>
                        <p>Um "algoritmo" é o nome chique para essa sequência de passos. É a receita detalhada que o computador seguirá. Pode ser algo simples como "somar dois números" ou complexo como "encontrar o melhor caminho no GPS".</p>

                        <h5>Mini Atividade (Pense e Responda):</h5>
                        <ul>
                            <li>Descreva os passos (o algoritmo) para escovar os dentes.</li>
                            <li>Quais passos você seguiria para ir da sua casa até a padaria mais próxima?</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Lógica:</strong> A maneira de organizar o pensamento e as instruções de forma clara e sequencial.</li>
                            <li><strong>Algoritmo:</strong> Uma sequência finita de passos bem definidos para resolver um problema ou realizar uma tarefa.</li>
                            <li><strong>Instrução:</strong> Um comando único que o computador entende e executa.</li>
                            <li><strong>Sequência:</strong> A ordem em que as instruções devem ser executadas.</li>
                        </ul>

                        <h5>Dica de Ouro ✨</h5>
                        <p>Não se preocupe em decorar nomes técnicos agora. O mais importante é entender a ideia de dar instruções claras e em ordem. A prática leva à perfeição!</p>
                    `
                },
                {
                    id: "prog-02",
                    titulo: "HTML & CSS Moderno",
                    descricao: "Estruturação e estilização de páginas web responsivas.",
                    conteudo: `
                        <h3>HTML e CSS: A Dupla Dinâmica da Web 뼈 e 🎨</h3>
                        <p>Pense em uma página da web como uma casa. O <strong>HTML (HyperText Markup Language)</strong> é a estrutura: as paredes, o telhado, as portas, as janelas. Ele define onde cada coisa fica e o que ela é (um título, um parágrafo, uma imagem).</p>
                        <p>Já o <strong>CSS (Cascading Style Sheets)</strong> é a decoração: a cor das paredes, o tipo de piso, os móveis, os quadros. Ele cuida da aparência, do estilo e de como tudo se apresenta visualmente.</p>

                        <h4>Analogia do Dia a Dia: Um Documento de Texto 📄</h4>
                        <p>Imagine escrever um trabalho escolar. O texto puro, com títulos, parágrafos e listas, é como o HTML. Quando você começa a formatar, mudando a fonte, o tamanho, a cor, adicionando negrito ou itálico, você está aplicando o "CSS" ao seu documento.</p>

                        <h4>Como eles trabalham juntos?</h4>
                        <p>O HTML cria os elementos (ex: <code>&lt;h1&gt;Título Principal&lt;/h1&gt;</code>, <code>&lt;p&gt;Este é um parágrafo.&lt;/p&gt;</code>) e o CSS seleciona esses elementos para aplicar estilos (ex: "todos os <code>&lt;h1&gt;</code> devem ser azuis e ter fonte grande", "todos os <code>&lt;p&gt;</code> devem ter margem").</p>

                        <h5>Mini Atividade (Observe e Descreva):</h5>
                        <ul>
                            <li>Abra seu site favorito. Tente identificar visualmente: O que você acha que é a "estrutura" (HTML)? O que é a "decoração" (CSS)?</li>
                            <li>Imagine uma página simples sobre seu hobby. Quais elementos (título, texto, imagem) você usaria (HTML)? Como você a deixaria bonita (CSS)?</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>HTML:</strong> Linguagem de marcação para estruturar o conteúdo de páginas web. Usa "tags" (como <code>&lt;p&gt;</code>).</li>
                            <li><strong>CSS:</strong> Linguagem de estilo para definir a aparência e o layout dos elementos HTML.</li>
                            <li><strong>Tag:</strong> Um comando HTML cercado por <code>&lt; &gt;</code>, como <code>&lt;img&gt;</code> (imagem) ou <code>&lt;a&gt;</code> (link).</li>
                            <li><strong>Elemento:</strong> Uma parte da página definida por uma tag HTML (ex: um parágrafo, um título).</li>
                            <li><strong>Estilo:</strong> Uma regra CSS que define como um elemento deve parecer (cor, tamanho, espaçamento, etc.).</li>
                            <li><strong>Responsivo:</strong> Um design que se adapta automaticamente a diferentes tamanhos de tela (celular, tablet, computador).</li>
                        </ul>

                        <h5>Curiosidade 🤓</h5>
                        <p>O HTML e o CSS não são linguagens de programação (não têm lógica complexa como o JavaScript), mas são essenciais para *qualquer* desenvolvimento web front-end!</p>
                    `
                },
                {
                    id: "prog-03",
                    titulo: "JavaScript Interativo",
                    descricao: "Manipulação do DOM e interatividade no front-end.",
                    conteudo: `
                        <h3>JavaScript: Dando Vida à Página Web ✨</h3>
                        <p>Se o HTML é a estrutura (ossos) e o CSS é a aparência (pele e roupas), o <strong>JavaScript (JS)</strong> é o cérebro e os músculos! É ele que permite que a página reaja às ações do usuário, mude dinamicamente e faça coisas acontecerem sem precisar recarregar tudo.</p>
                        <p>Pense em um botão que, ao ser clicado, mostra uma mensagem, ou um formulário que verifica se você preencheu tudo antes de enviar. Isso é JavaScript em ação!</p>

                        <h4>Analogia do Dia a Dia: Um Interruptor de Luz 💡</h4>
                        <p>A lâmpada e o interruptor na parede são a estrutura (HTML). A cor e o design do interruptor são o estilo (CSS). A ação de *acender* ou *apagar* a luz quando você aperta o interruptor é a funcionalidade, a "inteligência" dada pelo JavaScript.</p>

                        <h4>O que é o DOM? 🤔</h4>
                        <p>O <strong>DOM (Document Object Model)</strong> é como o JavaScript "vê" a página HTML. Ele representa a estrutura da página como uma árvore de objetos, onde cada elemento (título, parágrafo, botão) é um galho ou folha que o JS pode acessar e modificar.</p>
                        <p>Com o DOM, o JavaScript pode:
                            <ul>
                                <li>Encontrar um elemento específico (ex: o botão "Enviar").</li>
                                <li>Mudar o conteúdo de um elemento (ex: atualizar um placar).</li>
                                <li>Alterar o estilo de um elemento (ex: esconder/mostrar um menu).</li>
                                <li>Reagir a eventos (ex: clique do mouse, digitação no teclado).</li>
                            </ul>
                        </p>

                        <h5>Mini Atividade (Interaja e Pense):</h5>
                        <ul>
                            <li>Em um site que você usa, clique em botões, menus ou campos. O que acontece na página? Tente imaginar como o JavaScript pode estar controlando essas ações.</li>
                            <li>Pense em um site de rede social. Que interações (curtir, comentar, carregar mais posts) você acha que usam JavaScript?</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>JavaScript (JS):</strong> Linguagem de programação que roda no navegador para adicionar interatividade e dinamismo às páginas web.</li>
                            <li><strong>DOM (Document Object Model):</strong> A representação da estrutura HTML que o JavaScript usa para interagir com a página.</li>
                            <li><strong>Evento:</strong> Uma ação que acontece na página (clique, passagem do mouse, envio de formulário) à qual o JavaScript pode reagir.</li>
                            <li><strong>Manipulação do DOM:</strong> A ação de usar JavaScript para alterar a estrutura, conteúdo ou estilo da página HTML.</li>
                            <li><strong>Front-end:</strong> A parte do site ou aplicativo com a qual o usuário interage diretamente (o que você vê no navegador).</li>
                        </ul>

                        <h5>Dica Importante 🚀</h5>
                        <p>JavaScript é uma linguagem de programação completa! Com ela, você pode criar desde pequenas animações até aplicações web complexas. É a base da interatividade na web moderna.</p>
                    `
                },
                {
                    id: "prog-04",
                    titulo: "Introdução ao Back-end",
                    descricao: "Conceitos de servidores, APIs e bancos de dados.",
                    conteudo: `
                        <h3>Back-end: Os Bastidores da Web ⚙️</h3>
                        <p>Se o Front-end (HTML, CSS, JS) é o palco e os atores que você vê, o <strong>Back-end</strong> é tudo o que acontece nos bastidores: os técnicos de luz e som, o diretor, os cenários guardados. É a parte do sistema que o usuário não vê diretamente, mas que faz tudo funcionar.</p>
                        <p>O Back-end cuida de coisas como: salvar informações dos usuários, processar pagamentos, buscar dados para exibir na página, garantir a segurança, etc.</p>

                        <h4>Analogia do Dia a Dia: Um Restaurante 🍽️</h4>
                        <p>O salão do restaurante, o menu e o garçom são o Front-end (o que você vê e interage). A cozinha, o chef, os ingredientes guardados na despensa e o sistema de caixa são o Back-end. Você pede um prato (faz uma requisição no Front-end), o pedido vai para a cozinha (Back-end), é preparado e depois entregue a você.</p>

                        <h4>Componentes Chave do Back-end:</h4>
                        <ul>
                            <li><strong>Servidor:</strong> Um computador potente que "hospeda" o site ou aplicação e responde às solicitações dos usuários (navegadores). Pense nele como o prédio do restaurante.</li>
                            <li><strong>Linguagem de Back-end:</strong> Linguagens como Node.js (JavaScript!), Python, Java, PHP, Ruby, etc., usadas para escrever a lógica que roda no servidor (as receitas do chef).</li>
                            <li><strong>Banco de Dados:</strong> Onde as informações são armazenadas de forma organizada (a despensa). Exemplos: PostgreSQL, MySQL, MongoDB.</li>
                            <li><strong>API (Application Programming Interface):</strong> É como um "cardápio" ou um "garçom" para sistemas. Define como o Front-end pode pedir informações ou solicitar ações ao Back-end de forma padronizada.</li>
                        </ul>

                        <h5>Mini Atividade (Reflita):</h5>
                        <ul>
                            <li>Ao fazer login em um site, onde você acha que seu nome de usuário e senha são verificados? (Dica: não é no seu navegador!)</li>
                            <li>Quando você compra algo online, onde as informações do seu pedido (produtos, endereço) ficam salvas?</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Back-end:</strong> A parte "invisível" de um sistema web que roda no servidor e lida com lógica, dados e segurança.</li>
                            <li><strong>Servidor:</strong> Computador que armazena os arquivos do site e processa requisições.</li>
                            <li><strong>Banco de Dados:</strong> Sistema para armazenar e recuperar dados de forma eficiente.</li>
                            <li><strong>API:</strong> Conjunto de regras e definições que permite a comunicação entre diferentes sistemas de software.</li>
                            <li><strong>Requisição:</strong> Um pedido feito pelo navegador (Front-end) ao servidor (Back-end).</li>
                            <li><strong>Resposta:</strong> O que o servidor envia de volta ao navegador após processar uma requisição.</li>
                        </ul>

                        <h5>Curiosidade 🤔</h5>
                        <p>Muitas vezes, o JavaScript que você aprendeu para o Front-end (com Node.js) também pode ser usado no Back-end! Isso é chamado de desenvolvimento "Full-stack" JavaScript.</p>
                    `
                }
            ]
        },
        ciberseguranca: {
            id: "ciberseguranca",
            titulo: "Cibersegurança Defensiva",
            descricao: "Proteja sistemas e redes contra ameaças digitais.",
            modulos: [
                {
                    id: "ciber-01",
                    titulo: "Princípios de Segurança",
                    descricao: "Confidencialidade, Integridade e Disponibilidade.",
                    conteudo: `
                        <h3>Os 3 Pilares da Segurança da Informação: CIA 🛡️</h3>
                        <p>Quando falamos em proteger informações, seja a senha do seu e-mail ou os dados de clientes de uma empresa, pensamos em três objetivos principais, conhecidos pela sigla CIA (não, não é a agência de espionagem!).</p>
                        <ul>
                            <li><strong>Confidencialidade:</strong> Garantir que a informação só seja acessível por pessoas autorizadas. É como um segredo que só pode ser contado a quem confiamos.</li>
                            <li><strong>Integridade:</strong> Garantir que a informação esteja correta, completa e não tenha sido alterada indevidamente. É ter certeza de que o segredo não foi modificado no caminho.</li>
                            <li><strong>Disponibilidade:</strong> Garantir que a informação e os sistemas estejam acessíveis e funcionando quando precisarmos deles. É poder acessar o segredo sempre que necessário.</li>
                        </ul>

                        <h4>Analogia do Dia a Dia: Seu Diário Pessoal 📓</h4>
                        <ul>
                            <li><strong>Confidencialidade:</strong> Você guarda seu diário em um local seguro (gaveta trancada) para que só você possa ler.</li>
                            <li><strong>Integridade:</strong> Você confia que ninguém apagou ou reescreveu partes do seu diário sem sua permissão.</li>
                            <li><strong>Disponibilidade:</strong> Você consegue encontrar e abrir seu diário sempre que quiser escrever nele.</li>
                        </ul>
                        <p>Perder qualquer um desses pilares significa uma falha de segurança.</p>

                        <h4>Por que isso é importante?</h4>
                        <p>Imagine um banco online. A <strong>confidencialidade</strong> impede que outros vejam seu saldo. A <strong>integridade</strong> garante que seu saldo não seja alterado por um hacker. A <strong>disponibilidade</strong> garante que você consiga acessar sua conta para fazer um pagamento.</p>

                        <h5>Mini Atividade (Pense em Riscos):</h5>
                        <ul>
                            <li>Que tipo de problema ocorreria se a confidencialidade das suas mensagens de WhatsApp fosse quebrada?</li>
                            <li>E se a integridade das notas no sistema da sua escola fosse comprometida?</li>
                            <li>O que aconteceria se o site de notícias que você lê ficasse indisponível por um dia?</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Confidencialidade:</strong> Proteção contra acesso não autorizado.</li>
                            <li><strong>Integridade:</strong> Proteção contra alteração não autorizada.</li>
                            <li><strong>Disponibilidade:</strong> Garantia de acesso quando necessário.</li>
                            <li><strong>Segurança da Informação:</strong> Conjunto de práticas para proteger informações contra ameaças.</li>
                            <li><strong>Ameaça:</strong> Qualquer evento ou ação que possa comprometer a CIA de um ativo de informação.</li>
                            <li><strong>Ativo de Informação:</strong> Qualquer dado ou sistema que tenha valor (ex: senhas, dados de clientes, sistemas online).</li>
                        </ul>

                        <h5>Dica Essencial 🔒</h5>
                        <p>Entender a CIA ajuda a pensar sobre segurança de forma estruturada. Ao proteger algo, pergunte-se: como garantir que só as pessoas certas acessem (Confidencialidade)? Como garantir que não seja alterado (Integridade)? Como garantir que funcione quando preciso (Disponibilidade)?</p>
                    `
                },
                {
                    id: "ciber-02",
                    titulo: "Análise de Vulnerabilidades",
                    descricao: "Identificação e mitigação de riscos em sistemas.",
                    conteudo: `
                        <h3>Encontrando as Brechas: O que são Vulnerabilidades? 🔍</h3>
                        <p>Imagine sua casa. Uma janela aberta, uma porta destrancada ou uma fechadura frágil são pontos fracos que um ladrão poderia explorar. Em sistemas de computador e redes, esses pontos fracos são chamados de <strong>vulnerabilidades</strong>.</p>
                        <p>Uma vulnerabilidade é uma falha ou fraqueza em um sistema, software, hardware ou processo que pode ser explorada por uma ameaça para causar danos (como roubar dados, interromper serviços, etc.).</p>

                        <h4>Analogia do Dia a Dia: A Corrente da Bicicleta 🚲</h4>
                        <p>Você usa uma corrente para prender sua bicicleta. Se a corrente for fina e fácil de cortar, isso é uma vulnerabilidade. O ladrão com um alicate é a ameaça. A possibilidade de ter a bicicleta roubada é o risco.</p>

                        <h4>Como as Vulnerabilidades Surgem?</h4>
                        <ul>
                            <li><strong>Erros de Programação:</strong> Falhas no código do software.</li>
                            <li><strong>Configurações Incorretas:</strong> Deixar senhas padrão, não ativar firewalls.</li>
                            <li><strong>Falta de Atualizações:</strong> Não aplicar correções de segurança (patches) que os fabricantes liberam.</li>
                            <li><strong>Fator Humano:</strong> Pessoas clicando em links maliciosos (phishing), usando senhas fracas.</li>
                        </ul>

                        <h4>Análise de Vulnerabilidades: Procurando os Pontos Fracos</h4>
                        <p>A análise de vulnerabilidades é o processo de identificar, classificar e priorizar essas fraquezas nos sistemas. É como um "check-up" de segurança. Ferramentas automatizadas (scanners) e testes manuais são usados para encontrar essas brechas antes que os "vilões" as encontrem.</p>

                        <h5>Mini Atividade (Pense na sua Segurança Digital):</h5>
                        <ul>
                            <li>Você usa a mesma senha para vários sites? (Isso é uma vulnerabilidade!)</li>
                            <li>Seu celular ou computador está com as últimas atualizações do sistema operacional instaladas? (Não atualizar é uma vulnerabilidade!)</li>
                            <li>Você clica em links ou baixa anexos de e-mails desconhecidos? (Pode explorar vulnerabilidades!)</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Vulnerabilidade:</strong> Uma fraqueza em um sistema que pode ser explorada.</li>
                            <li><strong>Ameaça:</strong> Agente ou evento que pode explorar uma vulnerabilidade (ex: hacker, malware).</li>
                            <li><strong>Risco:</strong> A probabilidade de uma ameaça explorar uma vulnerabilidade e causar um impacto negativo.</li>
                            <li><strong>Exploit:</strong> O método ou código usado por uma ameaça para tirar vantagem de uma vulnerabilidade.</li>
                            <li><strong>Patch:</strong> Uma correção de software liberada para consertar uma vulnerabilidade.</li>
                            <li><strong>Scanner de Vulnerabilidades:</strong> Ferramenta que busca automaticamente por fraquezas conhecidas em sistemas.</li>
                        </ul>

                        <h5>Dica Prática 💡</h5>
                        <p>Manter seus softwares e sistemas operacionais sempre atualizados é uma das formas mais eficazes de se proteger contra vulnerabilidades conhecidas!</p>
                    `
                },
                {
                    id: "ciber-03",
                    titulo: "Segurança de Redes",
                    descricao: "Firewalls, VPNs e protocolos seguros.",
                    conteudo: `
                        <h3>Protegendo as Estradas da Informação: Segurança de Redes 🌐</h3>
                        <p>Pense na internet e nas redes de computadores (como a da sua casa ou empresa) como um sistema de estradas por onde as informações viajam. A segurança de redes trata de proteger essas estradas e os veículos (dados) que trafegam nelas.</p>
                        <p>O objetivo é controlar quem pode entrar e sair da rede, o que pode trafegar e garantir que a comunicação seja segura e confiável, aplicando os princípios de Confidencialidade, Integridade e Disponibilidade.</p>

                        <h4>Analogia do Dia a Dia: O Condomínio Fechado 🏘️</h4>
                        <p>Um condomínio fechado tem muros, portaria com segurança e regras de acesso. Isso é parecido com a segurança de redes:</p>
                        <ul>
                            <li><strong>Firewall (Muro e Portaria):</strong> É como o segurança na portaria. Ele controla o tráfego que entra e sai da rede, bloqueando acessos não autorizados com base em regras definidas. Ele decide quem pode entrar e sair do "condomínio".</li>
                            <li><strong>VPN (Túnel Secreto):</strong> Uma Rede Privada Virtual (VPN - Virtual Private Network) cria um "túnel" criptografado e seguro pela internet pública. É como se você tivesse uma passagem secreta e protegida para acessar a rede do condomínio de fora, sem que ninguém na estrada pública veja o que você está fazendo. Ótimo para usar em redes Wi-Fi públicas!</li>
                            <li><strong>Protocolos Seguros (Linguagem Codificada):</strong> Protocolos como HTTPS (o cadeado que você vê no navegador), SSH e TLS/SSL garantem que a comunicação entre dois pontos seja criptografada e autêntica. É como se os moradores combinassem uma linguagem secreta que só eles entendem para conversar pelo telefone do condomínio.</li>
                        </ul>

                        <h4>Outras Medidas Importantes:</h4>
                        <ul>
                            <li><strong>Segmentação de Rede:</strong> Dividir a rede em partes menores e isoladas (como separar a área residencial da área de lazer no condomínio) para limitar o dano caso uma parte seja comprometida.</li>
                            <li><strong>Sistemas de Detecção de Intrusão (IDS/IPS):</strong> Como câmeras e alarmes que monitoram a rede em busca de atividades suspeitas e podem alertar ou até bloquear o intruso.</li>
                        </ul>

                        <h5>Mini Atividade (Observe sua Conexão):</h5>
                        <ul>
                            <li>Ao acessar o site do seu banco, você vê um cadeado (HTTPS) ao lado do endereço? Por que isso é importante?</li>
                            <li>Você já usou Wi-Fi público em cafés ou aeroportos? Pensou nos riscos? Como uma VPN poderia ajudar?</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Rede de Computadores:</strong> Dois ou more computadores conectados para compartilhar informações.</li>
                            <li><strong>Firewall:</strong> Barreira de segurança que controla o tráfego de rede.</li>
                            <li><strong>VPN:</strong> Cria uma conexão segura e criptografada sobre uma rede pública.</li>
                            <li><strong>Protocolo:</strong> Um conjunto de regras que define como a comunicação deve ocorrer.</li>
                            <li><strong>HTTPS (HyperText Transfer Protocol Secure):</strong> Versão segura do HTTP, usa criptografia para proteger a comunicação web.</li>
                            <li><strong>Criptografia:</strong> Processo de codificar informações para que só possam ser lidas por quem tem a chave correta.</li>
                        </ul>

                        <h5>Dica de Segurança Pessoal 🔑</h5>
                        <p>Sempre desconfie de redes Wi-Fi abertas e gratuitas. Se precisar usá-las, evite acessar informações sensíveis (como bancos) ou use uma VPN confiável.</p>
                    `
                },
                {
                    id: "ciber-04",
                    titulo: "Resposta a Incidentes",
                    descricao: "Estratégias para lidar com violações de segurança.",
                    conteudo: `
                        <h3>Alerta Vermelho! O que Fazer Quando Algo Dá Errado? 🚨</h3>
                        <p>Mesmo com as melhores defesas, incidentes de segurança podem acontecer: um ataque de malware, um vazamento de dados, um acesso não autorizado. A <strong>Resposta a Incidentes</strong> é o plano de ação organizado para lidar com essas situações.</p>
                        <p>O objetivo não é só "apagar o incêndio", mas também entender como ele começou, limitar os danos, recuperar os sistemas e aprender para evitar que aconteça de novo.</p>

                        <h4>Analogia do Dia a Dia: O Plano de Evacuação de Incêndio 🔥</h4>
                        <p>Um prédio tem um plano de evacuação: alarmes soam, as pessoas seguem rotas de fuga sinalizadas, encontram-se em um ponto seguro, os bombeiros são chamados. A resposta a incidentes de segurança segue uma lógica parecida:</p>
                        <ol>
                            <li><strong>Preparação:</strong> Ter o plano pronto *antes* do incidente. Saber quem faz o quê, ter as ferramentas certas, treinar a equipe. (Ter o plano de evacuação e fazer simulações).</li>
                            <li><strong>Identificação:</strong> Detectar que um incidente ocorreu. Monitorar alertas, receber notificações. (O alarme de incêndio tocar).</li>
                            <li><strong>Contenção:</strong> Isolar o problema para evitar que se espalhe. Desconectar máquinas infectadas, bloquear contas comprometidas. (Fechar as portas corta-fogo, isolar a área do incêndio).</li>
                            <li><strong>Erradicação:</strong> Remover a causa raiz do incidente. Limpar malware, corrigir a vulnerabilidade explorada. (Apagar o fogo completamente).</li>
                            <li><strong>Recuperação:</strong> Restaurar os sistemas e dados ao estado normal de operação. (Verificar a estrutura do prédio, limpar a sujeira, liberar o acesso).</li>
                            <li><strong>Lições Aprendidas (Pós-Incidente):</strong> Analisar o que aconteceu, por que aconteceu e como melhorar as defesas e o próprio plano de resposta. (Investigar a causa do incêndio e melhorar as medidas de prevenção).</li>
                        </ol>

                        <h4>Por que um Plano é Crucial?</h4>
                        <p>Sem um plano, o caos se instala. Decisões erradas podem ser tomadas sob pressão, evidências podem ser perdidas e o impacto do incidente pode ser muito maior. Um plano bem definido agiliza a resposta, reduz danos e custos, e ajuda a restaurar a confiança.</p>

                        <h5>Mini Atividade (Simulação Mental):</h5>
                        <ul>
                            <li>Imagine que você recebeu um e-mail muito suspeito pedindo sua senha (phishing) e clicou no link. Quais seriam os próximos passos lógicos para conter o dano? (Ex: trocar a senha imediatamente, avisar o serviço, verificar atividades estranhas).</li>
                            <li>Se seu computador começasse a agir de forma estranha (lento, pop-ups), qual seria a primeira ação para tentar conter um possível malware? (Ex: desconectar da internet).</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Incidente de Segurança:</strong> Qualquer evento que viole as políticas de segurança ou ameace a CIA.</li>
                            <li><strong>Plano de Resposta a Incidentes (PRI):</strong> Documento que detalha os procedimentos para lidar com incidentes.</li>
                            <li><strong>Malware:</strong> Software malicioso (vírus, ransomware, spyware).</li>
                            <li><strong>Phishing:</strong> Tentativa de enganar usuários para obter informações confidenciais.</li>
                            <li><strong>Contenção:</strong> Ações para limitar o alcance e o impacto de um incidente.</li>
                            <li><strong>Erradicação:</strong> Remoção da causa do incidente do ambiente.</li>
                            <li><strong>Forensica Digital:</strong> Análise técnica para coletar e preservar evidências digitais após um incidente.</li>
                        </ul>

                        <h5>Lembre-se 💡</h5>
                        <p>A resposta a incidentes não é só para grandes empresas. Ter um plano básico, mesmo que seja mental, para lidar com problemas como phishing ou malware no seu próprio computador, já é um grande passo!</p>
                    `
                }
            ]
        },
        ia: {
            id: "ia",
            titulo: "IA Generativa na Prática",
            descricao: "Explore modelos de IA capazes de criar conteúdo e resolver problemas.",
            modulos: [
                {
                    id: "ia-01",
                    titulo: "Fundamentos de IA/ML",
                    descricao: "Conceitos básicos de aprendizado de máquina.",
                    conteudo: `
                        <h3>Inteligência Artificial e Aprendizado de Máquina: Ensinando Computadores a Aprender 🤖🎓</h3>
                        <p><strong>Inteligência Artificial (IA)</strong> é a grande área da ciência da computação que busca criar sistemas capazes de realizar tarefas que normalmente exigiriam inteligência humana, como entender linguagem, reconhecer imagens, tomar decisões e resolver problemas.</p>
                        <p><strong>Aprendizado de Máquina (Machine Learning - ML)</strong> é um *subcampo* da IA. Em vez de programar regras explícitas para cada situação, no ML nós "ensinamos" o computador a aprender a partir de dados. Damos muitos exemplos e o computador encontra padrões para poder fazer previsões ou tomar decisões sobre novos dados que nunca viu antes.</p>

                        <h4>Analogia do Dia a Dia: Aprendendo a Reconhecer Gatos 🐈</h4>
                        <p>Como uma criança aprende o que é um gato? Vendo vários gatos diferentes (grandes, pequenos, peludos, de várias cores). Ela começa a identificar padrões: têm orelhas pontudas, bigodes, rabo, fazem "miau". Depois de ver exemplos suficientes, ela consegue reconhecer um gato que nunca viu antes.</p>
                        <p>O Aprendizado de Máquina funciona de forma parecida:
                            <ol>
                                <li><strong>Dados de Treinamento:</strong> Mostramos ao computador milhares de fotos, algumas rotuladas como "gato" e outras como "não gato".</li>
                                <li><strong>Treinamento do Modelo:</strong> O algoritmo de ML analisa essas fotos e "aprende" os padrões visuais que definem um gato.</li>
                                <li><strong>Modelo Treinado:</strong> Temos um sistema (o "modelo") que agora pode receber uma nova foto e dizer com certa probabilidade se é um gato ou não.</li>
                            </ol>
                        </p>

                        <h4>Tipos Comuns de Aprendizado de Máquina:</h4>
                        <ul>
                            <li><strong>Supervisionado:</strong> Aprende com dados rotulados (como as fotos de gato/não gato). Usado para classificação (gato ou não gato?) e regressão (prever o preço de uma casa).</li>
                            <li><strong>Não Supervisionado:</strong> Aprende com dados não rotulados, buscando padrões e agrupamentos ocultos. Usado para agrupar clientes com comportamentos semelhantes, por exemplo.</li>
                            <li><strong>Por Reforço:</strong> Aprende por tentativa e erro, recebendo recompensas por ações corretas e penalidades por erradas. Usado em jogos e robótica.</li>
                        </ul>

                        <h5>Mini Atividade (Identifique a IA no seu dia):</h5>
                        <ul>
                            <li>Quando o YouTube ou Netflix recomenda vídeos/filmes, como você acha que eles "aprenderam" seus gostos?</li>
                            <li>O corretor ortográfico do seu celular que sugere a próxima palavra: como ele aprendeu a fazer isso?</li>
                            <li>Filtros de spam no seu e-mail: como eles sabem o que é lixo eletrônico?</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Inteligência Artificial (IA):</strong> Campo amplo focado em criar máquinas "inteligentes".</li>
                            <li><strong>Aprendizado de Máquina (ML):</strong> Subcampo da IA onde máquinas aprendem com dados sem programação explícita.</li>
                            <li><strong>Dados de Treinamento:</strong> Conjunto de exemplos usado para ensinar o modelo de ML.</li>
                            <li><strong>Modelo:</strong> O resultado do treinamento; o sistema treinado que pode fazer previsões ou tomar decisões.</li>
                            <li><strong>Algoritmo de ML:</strong> O método matemático/estatístico usado para aprender a partir dos dados.</li>
                            <li><strong>Padrão:</strong> Uma regularidade ou estrutura repetitiva encontrada nos dados.</li>
                        </ul>

                        <h5>Fato Interessante 🤯</h5>
                        <p>O Aprendizado de Máquina é a tecnologia por trás de muitas coisas que usamos hoje: reconhecimento de voz (Siri, Alexa), carros autônomos, diagnósticos médicos assistidos por computador e, claro, a IA Generativa!</p>
                    `
                },
                {
                    id: "ia-02",
                    titulo: "Modelos Generativos (LLMs)",
                    descricao: "Compreensão de transformers e suas aplicações.",
                    conteudo: `
                        <h3>Criando Conteúdo com IA: O Poder dos Modelos Generativos ✍️🎨🎵</h3>
                        <p>Enquanto o ML tradicional foca em *prever* ou *classificar* dados existentes (é um gato? qual o preço?), os <strong>Modelos Generativos</strong> são um tipo especial de IA projetado para *criar* novos dados que se parecem com os dados com os quais foram treinados.</p>
                        <p>Eles podem gerar texto (como este!), imagens, música, código e muito mais. Os <strong>LLMs (Large Language Models - Grandes Modelos de Linguagem)</strong>, como o GPT (usado no ChatGPT), são um tipo famoso de modelo generativo focado em texto.</p>

                        <h4>Analogia do Dia a Dia: O Músico Improvisador 🎷</h4>
                        <p>Imagine um músico de jazz que ouviu milhares de horas de música. Ele aprendeu os estilos, as escalas, as harmonias. Quando pedem para ele improvisar, ele não copia exatamente uma música que ouviu, mas cria algo novo *no estilo* do que aprendeu. LLMs fazem algo parecido: eles "leram" bilhões de textos da internet e aprenderam a estrutura, gramática, fatos e estilos da linguagem humana, podendo então gerar textos novos e coerentes.</p>

                        <h4>Como os LLMs Funcionam (Simplificado)? A Mágica dos Transformers ✨</h4>
                        <p>Muitos LLMs modernos usam uma arquitetura chamada <strong>Transformer</strong>. A grande sacada dos Transformers é o mecanismo de <strong>atenção</strong>. Ele permite que o modelo, ao gerar a próxima palavra de uma frase, preste mais "atenção" às palavras anteriores que são mais relevantes para o contexto, mesmo que estejam distantes na frase.</p>
                        <p>Exemplo: Na frase "O gato sentou no sofá porque estava cansado", ao gerar "cansado", o mecanismo de atenção ajuda o modelo a focar em "gato" (quem estava cansado) e não tanto em "sofá". Isso permite gerar textos mais longos e coerentes.</p>

                        <h4>Aplicações Incríveis:</h4>
                        <ul>
                            <li><strong>Chatbots e Assistentes Virtuais:</strong> Conversar de forma natural (ChatGPT, Bard).</li>
                            <li><strong>Criação de Conteúdo:</strong> Escrever artigos, e-mails, roteiros, posts de blog.</li>
                            <li><strong>Tradução Automática:</strong> Com qualidade cada vez maior.</li>
                            <li><strong>Geração de Código:</strong> Ajudar programadores a escrever e depurar código.</li>
                            <li><strong>Análise de Sentimentos:</strong> Entender a opinião em textos (reviews, redes sociais).</li>
                            <li><strong>Geração de Imagens:</strong> Criar imagens a partir de descrições textuais (Midjourney, DALL-E).</li>
                        </ul>

                        <h5>Mini Atividade (Experimente!):</h5>
                        <ul>
                            <li>Use uma ferramenta de IA generativa (como ChatGPT, Bing Chat, Bard) e peça para ela:
                                <ul>
                                    <li>Escrever um poema curto sobre o espaço.</li>
                                    <li>Explicar um conceito complexo (como buracos negros) de forma simples.</li>
                                    <li>Criar uma lista de ideias para um presente de aniversário.</li>
                                </ul>
                            </li>
                            <li>Observe a coerência, o estilo e a criatividade da resposta.</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Modelo Generativo:</strong> IA que cria novos dados (texto, imagem, etc.).</li>
                            <li><strong>LLM (Large Language Model):</strong> Modelo generativo treinado com grandes volumes de texto para entender e gerar linguagem humana.</li>
                            <li><strong>Transformer:</strong> Arquitetura de rede neural comum em LLMs, conhecida pelo mecanismo de atenção.</li>
                            <li><strong>Atenção (Mecanismo de):</strong> Permite ao modelo focar nas partes mais relevantes da entrada ao gerar a saída.</li>
                            <li><strong>Token:</strong> Uma unidade de texto (pode ser uma palavra, parte de palavra ou caractere) que o LLM processa.</li>
                            <li><strong>Prompt:</strong> A instrução ou pergunta que você dá ao modelo generativo.</li>
                        </ul>

                        <h5>Ponto de Atenção ⚠️</h5>
                        <p>LLMs são incríveis, mas não são perfeitos! Eles podem "inventar" informações (alucinações), ter vieses presentes nos dados de treinamento e nem sempre entendem o contexto profundamente. Use-os como ferramentas, mas sempre revise e verifique informações críticas.</p>
                    `
                },
                {
                    id: "ia-03",
                    titulo: "Engenharia de Prompt",
                    descricao: "Como interagir efetivamente com IAs generativas.",
                    conteudo: `
                        <h3>A Arte de Conversar com a IA: Engenharia de Prompt 🗣️✍️</h3>
                        <p>Você já tem um modelo de IA generativa poderoso (como um LLM), mas como tirar o máximo proveito dele? A resposta está na <strong>Engenharia de Prompt</strong>. É a habilidade de criar as instruções (os "prompts") certas para guiar a IA a gerar a resposta que você realmente deseja.</p>
                        <p>Um bom prompt é claro, específico e fornece contexto suficiente para a IA entender a tarefa. Um prompt ruim pode levar a respostas vagas, irrelevantes ou até erradas.</p>

                        <h4>Analogia do Dia a Dia: Pedindo um Desenho a um Artista 🎨</h4>
                        <p>Imagine pedir a um artista para desenhar "um cachorro". Você pode receber qualquer tipo de cachorro! Mas se você pedir "desenhe um cachorro da raça golden retriever, filhote, feliz, brincando com uma bola vermelha em um parque ensolarado", a chance de obter o desenho que você imaginou é muito maior.</p>
                        <p>Engenharia de Prompt é como dar essa descrição detalhada ao "artista" IA.</p>

                        <h4>Técnicas para Bons Prompts:</h4>
                        <ul>
                            <li><strong>Seja Específico:</strong> Em vez de "escreva sobre carros", tente "escreva um parágrafo comparando o consumo de combustível de carros elétricos e a gasolina".</li>
                            <li><strong>Dê Contexto:</strong> Informe o propósito. "Estou escrevendo um post para blog para iniciantes. Explique o que é HTML..."</li>
                            <li><strong>Defina o Formato da Saída:</strong> Peça listas, tabelas, código, tom de voz. "Liste 5 benefícios da meditação em formato de bullet points.", "Escreva um e-mail formal para...", "Explique como se fosse para uma criança de 10 anos."</li>
                            <li><strong>Atribua um Papel (Persona):</strong> "Aja como um especialista em marketing digital e sugira 3 títulos para um artigo sobre SEO."</li>
                            <li><strong>Use Exemplos (Few-shot Prompting):</strong> Dê um ou dois exemplos do que você quer. "Traduza para o francês: 'Olá' -> 'Bonjour'. 'Obrigado' -> 'Merci'. Agora traduza 'Por favor' -> ?"</li>
                            <li><strong>Divida Tarefas Complexas:</strong> Em vez de um prompt gigante, quebre em passos menores. "Primeiro, liste os ingredientes. Depois, escreva o modo de preparo."</li>
                            <li><strong>Itere e Refine:</strong> Seu primeiro prompt pode não ser perfeito. Analise a resposta, ajuste o prompt e tente novamente.</li>
                        </ul>

                        <h5>Mini Atividade (Refinando Prompts):</h5>
                        <p>Pegue um prompt vago e tente melhorá-lo usando as técnicas acima:</p>
                        <ul>
                            <li><strong>Prompt Vago:</strong> "Fale sobre o Brasil."</li>
                            <li><strong>Possível Refinamento:</strong> "Aja como um guia turístico e escreva 3 parágrafos curtos destacando as principais atrações naturais do Nordeste do Brasil para um viajante estrangeiro."</li>
                            <li><strong>Tente você:</strong> Melhore o prompt "Me dê dicas de estudo".</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Prompt:</strong> A instrução de entrada dada a um modelo de IA generativa.</li>
                            <li><strong>Engenharia de Prompt:</strong> A prática de projetar e refinar prompts para obter melhores resultados da IA.</li>
                            <li><strong>Contexto:</strong> Informações adicionais fornecidas no prompt para ajudar a IA a entender a tarefa.</li>
                            <li><strong>Persona:</strong> Atribuir um papel ou identidade à IA no prompt.</li>
                            <li><strong>Few-shot Prompting:</strong> Fornecer alguns exemplos no prompt para guiar a IA.</li>
                            <li><strong>Zero-shot Prompting:</strong> Pedir à IA para realizar uma tarefa sem fornecer exemplos prévios.</li>
                            <li><strong>Iteração:</strong> O processo de tentar, avaliar e refinar o prompt.</li>
                        </ul>

                        <h5>Chave para o Sucesso 🔑</h5>
                        <p>A Engenharia de Prompt é mais uma arte do que uma ciência exata. Experimentar, testar diferentes abordagens e aprender como cada modelo responde é fundamental para se tornar eficaz na comunicação com IAs generativas.</p>
                    `
                },
                {
                    id: "ia-04",
                    titulo: "Ética em IA",
                    descricao: "Discussões sobre vieses, responsabilidade e impacto social.",
                    conteudo: `
                        <h3>O Grande Poder Traz Grandes Responsabilidades: Ética em IA 🤔🌍</h3>
                        <p>A Inteligência Artificial tem um potencial incrível para o bem, mas também levanta questões éticas complexas. Conforme a IA se torna mais presente em nossas vidas – tomando decisões sobre crédito, diagnósticos médicos, moderação de conteúdo, etc. – é crucial pensar sobre seu impacto e garantir que seja usada de forma justa, transparente e responsável.</p>

                        <h4>Principais Preocupações Éticas:</h4>
                        <ul>
                            <li><strong>Vieses (Bias):</strong> Se a IA é treinada com dados que refletem preconceitos existentes na sociedade (racismo, sexismo, etc.), ela pode aprender e perpetuar esses vieses em suas decisões. Ex: um sistema de reconhecimento facial que funciona pior para certos tons de pele, ou uma IA de contratação que discrimina certos grupos.</li>
                            <li><strong>Transparência e Explicabilidade:</strong> Muitos modelos de IA, especialmente os complexos como redes neurais profundas, funcionam como "caixas-pretas". É difícil entender *por que* tomaram uma decisão específica. Isso é problemático em áreas críticas (médica, jurídica), onde precisamos justificar as decisões.</li>
                            <li><strong>Privacidade:</strong> IAs muitas vezes precisam de grandes volumes de dados para treinamento, levantando preocupações sobre como esses dados são coletados, usados e protegidos, especialmente dados pessoais.</li>
                            <li><strong>Responsabilidade (Accountability):</strong> Quem é responsável quando uma IA comete um erro com consequências graves? O programador? A empresa? O usuário? Definir responsabilidade é um desafio.</li>
                            <li><strong>Impacto no Emprego:</strong> A automação impulsionada pela IA pode deslocar trabalhadores em diversas áreas, exigindo requalificação e políticas de transição.</li>
                            <li><strong>Segurança e Mau Uso:</strong> O potencial de uso da IA para fins maliciosos, como criação de deepfakes para desinformação, armas autônomas ou ciberataques mais sofisticados.</li>
                            <li><strong>Justiça e Equidade:</strong> Garantir que os benefícios da IA sejam distribuídos de forma justa e que ela não aumente as desigualdades sociais existentes.</li>
                        </ul>

                        <h4>Analogia do Dia a Dia: O Juiz Robô 🤖⚖️</h4>
                        <p>Imagine um robô juiz treinado com decisões judiciais passadas. Se essas decisões históricas continham vieses contra certos grupos, o robô pode aprender esses vieses e tomar decisões injustas. Além disso, se ele não consegue explicar *por que* deu uma sentença, como podemos confiar no sistema ou apelar da decisão?</p>

                        <h4>Buscando Soluções:</h4>
                        <p>Pesquisadores, empresas e governos estão trabalhando em abordagens para mitigar esses riscos:</p>
                        <ul>
                            <li>Desenvolvimento de técnicas para detectar e reduzir vieses nos dados e modelos.</li>
                            <li>Pesquisa em IA Explicável (XAI - Explainable AI).</li>
                            <li>Criação de leis e regulamentações (como a Lei de IA da União Europeia).</li>
                            <li>Promoção de auditorias independentes de sistemas de IA.</li>
                            <li>Foco em princípios éticos desde o design (Ethics by Design).</li>
                        </ul>

                        <h5>Mini Atividade (Reflexão Ética):</h5>
                        <ul>
                            <li>Pense em um aplicativo que você usa que utiliza IA (recomendação, reconhecimento facial, etc.). Quais possíveis questões éticas ele poderia levantar?</li>
                            <li>Se um carro autônomo se envolver em um acidente, quem você acha que deveria ser responsabilizado? Por quê?</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Ética em IA:</strong> Campo que estuda as implicações morais e sociais da inteligência artificial.</li>
                            <li><strong>Viés (Bias):</strong> Preconceito sistemático nos dados ou no algoritmo que leva a resultados injustos.</li>
                            <li><strong>Transparência:</strong> Clareza sobre como um sistema de IA funciona.</li>
                            <li><strong>Explicabilidade (XAI):</strong> Capacidade de um sistema de IA justificar suas decisões de forma compreensível para humanos.</li>
                            <li><strong>Responsabilidade (Accountability):</strong> Definição de quem responde pelas ações e consequências de um sistema de IA.</li>
                            <li><strong>Deepfake:</strong> Mídia sintética (vídeo, áudio) criada por IA para parecer real, usada frequentemente para desinformação.</li>
                            <li><strong>Regulamentação:</strong> Leis e normas criadas para governar o desenvolvimento e uso da IA.</li>
                        </ul>

                        <h5>Pensamento Final 🤔</h5>
                        <p>A ética não é um "extra" na IA, mas uma parte fundamental do seu desenvolvimento e implementação. É uma discussão contínua e necessária para garantir que a tecnologia sirva à humanidade de forma benéfica e justa.</p>
                    `
                }
            ]
        },
        po: {
            id: "po",
            titulo: "Product Owner Ágil",
            descricao: "Gerencie produtos digitais e lidere equipes com foco em resultados.",
            modulos: [
                {
                    id: "po-01",
                    titulo: "Fundamentos de Produto",
                    descricao: "Ciclo de vida, visão e estratégia de produto.",
                    conteudo: `
                        <h3>O Que é um Produto e Por Que Ele Importa? 🚀</h3>
                        <p>No mundo digital (e fora dele!), um <strong>produto</strong> é qualquer coisa criada para atender a uma necessidade ou desejo de um grupo de pessoas (os usuários ou clientes) e que traz valor para eles e para a organização que o criou. Pode ser um aplicativo, um site, um software, um serviço online, ou até mesmo um produto físico com componentes digitais.</p>
                        <p>Gerenciar um produto não é só sobre construir funcionalidades; é sobre entender o problema que ele resolve, para quem ele resolve e como ele se encaixa nos objetivos do negócio.</p>

                        <h4>Analogia do Dia a Dia: Abrindo uma Cafeteria ☕</h4>
                        <p>Imagine abrir uma cafeteria. O "produto" não é só o café, mas a experiência toda: o ambiente, o atendimento, os outros itens do cardápio, o programa de fidelidade. Você precisa entender quem são seus clientes (trabalhadores locais? estudantes?), o que eles valorizam (café rápido? lugar para relaxar?) e como sua cafeteria vai se destacar e ser lucrativa.</p>

                        <h4>Ciclo de Vida do Produto: Do Nascimento à Aposentadoria 📈</h4>
                        <p>Assim como nós, produtos têm um ciclo de vida:</p>
                        <ol>
                            <li><strong>Introdução:</strong> O produto é lançado no mercado. O foco é atrair os primeiros usuários (early adopters) e validar a ideia. (A inauguração da cafeteria).</li>
                            <li><strong>Crescimento:</strong> O produto ganha popularidade, as vendas aumentam, novos recursos são adicionados. (A cafeteria fica conhecida, mais clientes aparecem).</li>
                            <li><strong>Maturidade:</strong> O crescimento desacelera, a concorrência aumenta. O foco é manter os clientes e otimizar o produto. (Outras cafeterias abrem por perto, você cria promoções).</li>
                            <li><strong>Declínio:</strong> As vendas caem, a tecnologia pode ficar obsoleta. A decisão é se vale a pena continuar investindo ou descontinuar o produto. (Menos gente frequenta, talvez seja hora de renovar ou fechar).</li>
                        </ol>
                        <p>Entender em que fase o produto está ajuda a tomar as decisões certas.</p>

                        <h4>Visão e Estratégia: O Norte e o Mapa 🧭🗺️</h4>
                        <ul>
                            <li><strong>Visão do Produto:</strong> É o objetivo de longo prazo, a "estrela guia". Onde queremos que o produto chegue no futuro? Qual impacto ele deve causar? (Ex: "Ser a cafeteria preferida da vizinhança pela qualidade e ambiente acolhedor").</li>
                            <li><strong>Estratégia do Produto:</strong> É o plano, o "mapa" de como alcançar a visão. Define o público-alvo, os diferenciais, as metas principais e como o produto vai evoluir ao longo do tempo. (Ex: Focar em café especial, criar um espaço de coworking, fazer parcerias locais).</li>
                        </ul>

                        <h5>Mini Atividade (Pense em Produtos que Você Usa):</h5>
                        <ul>
                            <li>Escolha um aplicativo ou site que você usa muito. Qual necessidade ele atende para você?</li>
                            <li>Em que fase do ciclo de vida você acha que ele está (Introdução, Crescimento, Maturidade, Declínio)? Por quê?</li>
                            <li>Qual você imagina que seja a "visão" por trás desse produto?</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Produto:</strong> Algo criado para entregar valor a usuários e à organização.</li>
                            <li><strong>Usuário/Cliente:</strong> Quem utiliza ou compra o produto.</li>
                            <li><strong>Valor:</strong> O benefício que o produto traz para o usuário e/ou para o negócio.</li>
                            <li><strong>Ciclo de Vida do Produto:</strong> As fases pelas quais um produto passa desde o lançamento até a retirada do mercado.</li>
                            <li><strong>Visão do Produto:</strong> O objetivo de longo prazo e o propósito do produto.</li>
                            <li><strong>Estratégia do Produto:</strong> O plano de alto nível para alcançar a visão do produto.</li>
                            <li><strong>Roadmap do Produto:</strong> Um plano visual que mostra como a estratégia será implementada ao longo do tempo (quais grandes funcionalidades virão).</li>
                        </ul>

                        <h5>Dica Fundamental 🎯</h5>
                        <p>Um bom gerenciamento de produto começa com uma compreensão profunda do problema a ser resolvido e das pessoas para quem você está resolvendo. A tecnologia é um meio, não o fim!</p>
                    `
                },
                {
                    id: "po-02",
                    titulo: "Metodologias Ágeis (Scrum)",
                    descricao: "Papéis, cerimônias e artefatos do Scrum.",
                    conteudo: `
                        <h3>Construindo em Ciclos: O Mundo Ágil e o Scrum 🏃‍♀️🔄</h3>
                        <p>Antigamente, muitos projetos de software eram como construir uma casa inteira de uma vez: um longo planejamento inicial, depois a construção completa, e só no final o cliente via o resultado (e às vezes não gostava!). Isso era chamado de modelo "Cascata".</p>
                        <p>As <strong>Metodologias Ágeis</strong> surgiram como uma alternativa. A ideia é construir o produto em ciclos curtos e iterativos, entregando pequenas partes funcionais com frequência. Isso permite obter feedback rápido do cliente, adaptar-se a mudanças e garantir que estamos construindo a coisa certa.</p>
                        <p><strong>Scrum</strong> é o framework ágil mais popular. Ele não diz *exatamente* como fazer tudo, mas define uma estrutura com papéis, eventos (cerimônias) e artefatos para ajudar as equipes a trabalhar de forma colaborativa e eficiente.</p>

                        <h4>Analogia do Dia a Dia: Organizando uma Festa Surpresa 🎉</h4>
                        <p>Imagine organizar uma festa surpresa em equipe usando Scrum:</p>
                        <ul>
                            <li><strong>Product Owner (O Dono da Festa):</strong> É quem define o objetivo ("festa incrível para o aniversariante X"), decide o que é mais importante (lista de convidados, bolo, música) e representa os interesses do "cliente" (o aniversariante).</li>
                            <li><strong>Scrum Master (O Facilitador):</strong> Ajuda a equipe a seguir as "regras" do Scrum, remove impedimentos (ex: falta de um item de decoração) e garante que todos colaborem bem. Não é o chefe, mas um líder servidor.</li>
                            <li><strong>Development Team (A Equipe da Festa):</strong> O grupo que realiza o trabalho (fazer os convites, comprar a comida, decorar, etc.). São auto-organizáveis e multidisciplinares.</li>
                        </ul>
                        <p><strong>Eventos (Cerimônias):</strong></p>
                        <ul>
                            <li><strong>Sprint:</strong> O ciclo de trabalho curto (ex: 1 semana para organizar a festa).</li>
                            <li><strong>Sprint Planning (Planejamento):</strong> No início da semana, a equipe decide o que vai fazer (definir tarefas: "ligar para convidados", "encomendar bolo").</li>
                            <li><strong>Daily Scrum (Reunião Diária):</strong> Todo dia, uma reunião rápida (15 min) para sincronizar: "O que fiz ontem? O que farei hoje? Tenho algum impedimento?".</li>
                            <li><strong>Sprint Review (Apresentação):</strong> No final da semana, a equipe mostra o que conseguiu fazer (ex: "convites enviados, decoração parcial pronta"). O Dono da Festa dá feedback.</li>
                            <li><strong>Sprint Retrospective (Reflexão):</strong> A equipe conversa sobre o que funcionou bem, o que não funcionou e como melhorar na próxima "Sprint" (próxima semana de preparativos).</li>
                        </ul>
                        <p><strong>Artefatos:</strong></p>
                        <ul>
                            <li><strong>Product Backlog (Lista de Desejos):</strong> A lista completa de tudo que poderia ser feito para a festa, priorizada pelo Dono da Festa.</li>
                            <li><strong>Sprint Backlog (Lista da Semana):</strong> O subconjunto de itens da Lista de Desejos que a Equipe se comprometeu a fazer na Sprint atual.</li>
                            <li><strong>Incremento (Parte da Festa Pronta):</strong> O resultado funcional ao final da Sprint (ex: convites enviados e confirmados).</li>
                        </ul>

                        <h5>Mini Atividade (Scrum na Vida Real):</h5>
                        <ul>
                            <li>Pense em um projeto pessoal ou em grupo (organizar uma viagem, fazer um trabalho escolar). Como você poderia aplicar alguns conceitos do Scrum (ciclos curtos, reuniões rápidas, lista de tarefas priorizada)?</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Ágil:</strong> Abordagem iterativa e incremental para gerenciamento de projetos, focada em colaboração, feedback e adaptação.</li>
                            <li><strong>Scrum:</strong> Um framework ágil popular com papéis, eventos e artefatos definidos.</li>
                            <li><strong>Product Owner (PO):</strong> Responsável por maximizar o valor do produto, gerenciando o Product Backlog.</li>
                            <li><strong>Scrum Master (SM):</strong> Responsável por garantir que o Scrum seja entendido e aplicado, removendo impedimentos.</li>
                            <li><strong>Development Team (Dev Team):</strong> Equipe multifuncional que constrói o produto.</li>
                            <li><strong>Sprint:</strong> Ciclo de trabalho curto (geralmente 1-4 semanas) com um objetivo definido.</li>
                            <li><strong>Product Backlog:</strong> Lista ordenada de tudo que é necessário para o produto.</li>
                            <li><strong>Sprint Backlog:</strong> Itens do Product Backlog selecionados para uma Sprint específica, mais o plano para entregá-los.</li>
                            <li><strong>Incremento:</strong> A soma de todos os itens do Product Backlog completados durante uma Sprint e Sprints anteriores; deve ser utilizável.</li>
                        </ul>

                        <h5>Benefício Chave 🌟</h5>
                        <p>O Scrum ajuda as equipes a lidar com a complexidade e a incerteza, entregando valor mais cedo e com mais frequência, além de promover a melhoria contínua.</p>
                    `
                },
                {
                    id: "po-03",
                    titulo: "Gestão de Backlog",
                    descricao: "Priorização, escrita de User Stories e refinamento.",
                    conteudo: `
                        <h3>A Lista Mestra: Gerenciando o Product Backlog 📝👑</h3>
                        <p>O <strong>Product Backlog</strong> é o coração do produto no Scrum. É uma lista única, ordenada e dinâmica de tudo que é conhecido e necessário para o produto: novas funcionalidades, melhorias, correções de bugs, mudanças técnicas, etc. O Product Owner (PO) é o responsável por essa lista.</p>
                        <p>Gerenciar o backlog não é só adicionar itens, mas principalmente <strong>priorizar</strong> (o que fazer primeiro?), <strong>detalhar</strong> (o que precisa ser feito?) e <strong>manter organizado</strong>.</p>

                        <h4>Analogia do Dia a Dia: A Lista de Compras do Supermercado 🛒</h4>
                        <p>Sua lista de compras é como um backlog:</p>
                        <ul>
                            <li><strong>Itens:</strong> Leite, pão, ovos, café, chocolate (funcionalidades, bugs, etc.).</li>
                            <li><strong>Priorização:</strong> O que é mais urgente? Leite e pão para o café da manhã vêm antes do chocolate. O PO ordena o backlog com base no valor para o negócio.</li>
                            <li><strong>Detalhamento:</strong> "Leite" é vago. Melhor: "Leite integral, 1 litro, marca X". Itens no topo do backlog precisam ser mais detalhados para a equipe poder trabalhar neles.</li>
                            <li><strong>Dinâmica:</strong> Você pode lembrar de algo novo e adicionar à lista (shampoo), ou perceber que não precisa mais de um item. O backlog está sempre evoluindo.</li>
                        </ul>

                        <h4>User Stories (Histórias de Usuário): Descrevendo a Necessidade 🗣️</h4>
                        <p>Uma forma comum de escrever itens do backlog, especialmente funcionalidades, são as <strong>Histórias de Usuário</strong>. Elas focam no *usuário* e no *valor* que ele recebe:</p>
                        <p><strong>Como um(a)</strong> [tipo de usuário],<br>
                           <strong>Eu quero</strong> [realizar alguma ação],<br>
                           <strong>Para que</strong> [eu obtenha algum benefício/valor].</p>
                        <p><em>Exemplo:</em> Como um(a) cliente da cafeteria, eu quero salvar meus cafés favoritos no aplicativo, para que eu possa pedi-los novamente de forma rápida.</p>
                        <p>Histórias de usuário são um ponto de partida para conversas entre o PO, a equipe e os stakeholders.</p>

                        <h4>Refinamento do Backlog (Grooming): Preparando os Próximos Itens 💎</h4>
                        <p>O <strong>Refinamento</strong> (ou Grooming) é uma atividade contínua onde o PO e a Equipe de Desenvolvimento colaboram para revisar os itens do backlog. O objetivo é:</p>
                        <ul>
                            <li>Esclarecer dúvidas sobre os itens.</li>
                            <li>Quebrar itens grandes em itens menores.</li>
                            <li>Adicionar detalhes e critérios de aceitação (como saber que o item está pronto?).</li>
                            <li>Estimar o esforço necessário (a equipe avalia o tamanho/complexidade).</li>
                        </ul>
                        <p>Isso garante que os itens no topo do backlog estejam prontos ("Ready") para serem puxados para a próxima Sprint.</p>

                        <h5>Mini Atividade (Escreva uma User Story):</h5>
                        <ul>
                            <li>Pense em uma funcionalidade que você gostaria de ver em um aplicativo que você usa. Tente escrevê-la no formato de História de Usuário.</li>
                            <li>Exemplo (App de Música): Como um usuário premium, eu quero baixar músicas, para que eu possa ouvi-las offline.</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Product Backlog:</strong> Lista ordenada de requisitos do produto.</li>
                            <li><strong>Item do Product Backlog (PBI):</strong> Um item na lista (funcionalidade, bug, etc.).</li>
                            <li><strong>Priorização:</strong> Ato de ordenar os PBIs com base no valor e urgência.</li>
                            <li><strong>História de Usuário (User Story):</strong> Descrição curta de uma funcionalidade sob a perspectiva do usuário.</li>
                            <li><strong>Critérios de Aceitação:</strong> Condições que devem ser atendidas para que um PBI seja considerado concluído.</li>
                            <li><strong>Refinamento do Backlog (Grooming):</strong> Atividade contínua de detalhar, estimar e ordenar os PBIs.</li>
                            <li><strong>Estimativa:</strong> Avaliação do tamanho ou esforço relativo de um PBI (comum usar Story Points).</li>
                            <li><strong>Definition of Ready (DoR):</strong> Critérios que um PBI deve atender para ser considerado pronto para a Sprint.</li>
                            <li><strong>Definition of Done (DoD):</strong> Critérios que um Incremento deve atender para ser considerado concluído.</li>
                        </ul>

                        <h5>O Papel Chave do PO 🔑</h5>
                        <p>A gestão eficaz do backlog é uma das responsabilidades mais críticas do Product Owner. É através do backlog que a visão do produto se traduz em trabalho concreto para a equipe, garantindo que o tempo e o esforço sejam investidos no que realmente importa.</p>
                    `
                },
                {
                    id: "po-04",
                    titulo: "Métricas e KPIs",
                    descricao: "Medindo o sucesso e o valor do produto.",
                    conteudo: `
                        <h3>Medindo o Sucesso: Métricas e KPIs para Produtos 📊🎯</h3>
                        <p>Como saber se o produto está indo bem? Estamos alcançando nossos objetivos? Estamos entregando valor real para os usuários e para o negócio? Para responder a essas perguntas, precisamos medir!</p>
                        <p><strong>Métricas</strong> são quaisquer dados quantificáveis que podemos rastrear sobre o produto ou seus usuários (ex: número de downloads, tempo gasto no app, vendas). <strong>KPIs (Key Performance Indicators - Indicadores Chave de Performance)</strong> são as métricas *mais importantes*, aquelas diretamente ligadas aos objetivos estratégicos do produto e do negócio. Nem toda métrica é um KPI!</p>

                        <h4>Analogia do Dia a Dia: Monitorando sua Saúde e Fitness 💪</h4>
                        <p>Você decide melhorar sua saúde:</p>
                        <ul>
                            <li><strong>Objetivo:</strong> Perder peso e ter mais energia.</li>
                            <li><strong>Métricas Possíveis:</strong> Peso na balança, número de passos por dia, horas de sono, pressão arterial, calorias consumidas, distância corrida, frequência cardíaca.</li>
                            <li><strong>KPIs (Indicadores Chave):</strong> Talvez você defina como KPIs principais o <strong>Peso Semanal</strong> (para o objetivo de perder peso) e o <strong>Número Médio de Passos Diários</strong> (para o objetivo de energia/atividade). As outras métricas são úteis, mas essas duas são as que melhor indicam se você está no caminho certo para *seus* objetivos específicos.</li>
                        </ul>

                        <h4>Por Que Medir?</h4>
                        <ul>
                            <li><strong>Tomar Decisões Informadas:</strong> Dados ajudam a decidir o que construir, o que melhorar e o que cortar, em vez de confiar apenas em "achismos".</li>
                            <li><strong>Entender o Comportamento do Usuário:</strong> Como as pessoas usam o produto? Onde elas travam? O que elas mais gostam?</li>
                            <li><strong>Validar Hipóteses:</strong> Lançamos uma nova funcionalidade. Ela está sendo usada? Está trazendo o resultado esperado?</li>
                            <li><strong>Comunicar Progresso:</strong> Mostrar para stakeholders (diretoria, investidores) como o produto está performando em relação às metas.</li>
                            <li><strong>Identificar Problemas:</strong> Uma queda súbita em uma métrica importante pode indicar um bug ou um problema de usabilidade.</li>
                        </ul>

                        <h4>Tipos Comuns de Métricas de Produto:</h4>
                        <ul>
                            <li><strong>Métricas de Aquisição:</strong> Como os usuários descobrem e começam a usar o produto (Downloads, Cadastros, Custo por Aquisição - CPA).</li>
                            <li><strong>Métricas de Ativação:</strong> Usuários realizando ações chave que indicam que entenderam o valor inicial (Primeira compra, Criação do primeiro post, Conclusão do tutorial).</li>
                            <li><strong>Métricas de Retenção:</strong> Usuários voltando a usar o produto ao longo do tempo (Taxa de Retenção, Usuários Ativos Diários/Mensais - DAU/MAU, Churn Rate - taxa de abandono).</li>
                            <li><strong>Métricas de Receita:</strong> Como o produto gera dinheiro (Receita Média por Usuário - ARPU, Valor do Tempo de Vida do Cliente - LTV, Receita Mensal Recorrente - MRR).</li>
                            <li><strong>Métricas de Engajamento:</strong> Quão ativamente os usuários interagem com o produto (Tempo gasto no app, Funcionalidades mais usadas, Número de sessões por usuário).</li>
                            <li><strong>Métricas de Satisfação:</strong> O quão felizes os usuários estão (Net Promoter Score - NPS, Avaliações na loja de app, Pesquisas de satisfação).</li>
                        </ul>
                        <p><em>(Framework famoso: Métricas Pirata AARRR - Aquisição, Ativação, Retenção, Receita, Referência)</em></p>

                        <h5>Mini Atividade (Definindo KPIs):</h5>
                        <ul>
                            <li>Imagine que você lançou um aplicativo simples de lista de tarefas. Quais seriam 2 ou 3 KPIs importantes para acompanhar nas primeiras semanas após o lançamento para saber se ele está sendo útil?</li>
                            <li>(Possíveis respostas: Número de tarefas criadas por usuário, Taxa de retenção no Dia 7, Número de usuários que criaram mais de uma lista).</li>
                        </ul>

                        <h5>Glossário Rápido:</h5>
                        <ul>
                            <li><strong>Métrica:</strong> Um dado quantificável sobre o produto ou usuário.</li>
                            <li><strong>KPI (Key Performance Indicator):</strong> Uma métrica crucial diretamente ligada aos objetivos estratégicos.</li>
                            <li><strong>Framework AARRR:</strong> Modelo para pensar em métricas ao longo da jornada do usuário (Aquisição, Ativação, Retenção, Receita, Referência).</li>
                            <li><strong>DAU/MAU:</strong> Usuários Ativos Diários / Mensais.</li>
                            <li><strong>Churn Rate:</strong> Taxa de usuários que deixam de usar o produto em um período.</li>
                            <li><strong>LTV (Lifetime Value):</strong> Receita total esperada de um cliente durante todo o tempo que ele usar o produto.</li>
                            <li><strong>NPS (Net Promoter Score):</strong> Métrica de lealdade e satisfação do cliente ("De 0 a 10, o quanto você recomendaria...").</li>
                        </ul>

                        <h5>Cuidado com as Métricas de Vaidade!  vanity metrics  Vanity Metrics </h5>
                        <p>Algumas métricas parecem boas no papel, mas não refletem o valor real ou não ajudam a tomar decisões (ex: número total de page views sem contexto, número total de downloads sem olhar a retenção). Foque nas métricas que realmente importam para seus objetivos!</p>
                    `
                }
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
                <p>Navegue pela seção 'Cursos' para encontrar trilhas de aprendizado em programação, cibersegurança, IA e gestão de produtos (Product Owner).</p>
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
        const noteTextareaId = `notes-${moduleId}`;
        const completionCheckboxId = `completion-${moduleId}`;
        // Adiciona o conteúdo detalhado se existir
        const detailedContent = module.conteudo ? `<div class="module-detailed-content">${module.conteudo}</div>` : '<p><em>Conteúdo detalhado em breve.</em></p>';

        return `
            <details class="module-details ${isCompleted ? 'completed' : ''}" data-module-id="${moduleId}">
                <summary class="module-summary" aria-expanded="false" aria-controls="module-content-${moduleId}">
                    ${module.titulo}
                    <span class="completion-indicator" aria-hidden="true">${isCompleted ? '✔' : ''}</span>
                </summary>
                <div class="module-content" id="module-content-${moduleId}" role="region">
                    <h4>${module.titulo}</h4>
                    <p><em>${module.descricao}</em></p>
                    <hr>
                    ${detailedContent} {/* Conteúdo detalhado inserido aqui */}
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
