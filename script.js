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

// Conteúdo com botão "ver mais" e função de exibição

const estudoConteudos = {
  programacao: `Programação é o processo de criar instruções formais que um computador pode interpretar e executar. Em vez de falar com ele em português ou gritar “FUNCIONA, MALDITO!”, usamos linguagens específicas... Já CSS cuida do visual e JavaScript dá vida ao site. Além disso, um bom programador precisa pensar como um computador, com lógica, paciência e organização.`,
  cyber: `Cibersegurança é o conjunto de práticas que protege nossos dados e dispositivos contra ataques digitais. Isso inclui entender ameaças como phishing, usar senhas seguras e manter backups. Os profissionais da área são os ninjas invisíveis da era digital, que garantem que nossos sistemas estejam protegidos.`,
  ia: `Inteligência Artificial (IA) é quando máquinas simulam a capacidade humana de pensar. Ela aprende com dados e é usada em carros autônomos, chatbots e recomendadores de vídeo. Não é mágica — é pura matemática, estatística e algoritmos em ação.`,
  po: `O Product Owner (PO) é o responsável por definir o que deve ser feito em um produto digital. Ele organiza tarefas, prioriza funcionalidades e representa a voz do cliente. Trabalha com metodologias ágeis, como Scrum, e precisa manter tudo sob controle mesmo quando tudo pega fogo.`
};

// Gera os cards do campo de estudo
const campoDeEstudo = `
  <h2>Campo de Estudo</h2>
  ${Object.entries(estudoConteudos).map(([key, texto]) => {
    const resumo = texto.split('.').slice(0, 2).join('.') + '.';
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
  p.innerHTML = expanded ? textoCompleto : textoCompleto.split('.').slice(0, 2).join('.') + '.';
  btn.textContent = expanded ? 'Ver menos' : 'Ver mais';
}
