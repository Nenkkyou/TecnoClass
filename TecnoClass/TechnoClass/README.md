# TecnoClass PWA

TecnoClass é uma Progressive Web App (PWA) educacional offline-first para aprendizado de tecnologia, permitindo acesso a cursos e quizzes mesmo sem conexão com a internet.

![TecnoClass Logo](assets/icons/icon-192x192.png)

## Características Principais

- **Offline-First**: Acesse todo o conteúdo mesmo sem conexão com a internet
- **Instalável**: Pode ser instalado como um aplicativo nativo em dispositivos móveis e desktop
- **Responsivo**: Interface adaptável a qualquer tamanho de tela
- **Acessível**: Segue as diretrizes WCAG para acessibilidade
- **Modo Escuro**: Suporte nativo para modo claro e escuro
- **Quizzes Interativos**: Teste seus conhecimentos com quizzes por categoria
- **Acompanhamento de Progresso**: Visualize seu progresso em cada curso

## Tecnologias Utilizadas

- HTML5, CSS3 e JavaScript puro (sem frameworks)
- Service Worker para funcionalidade offline
- IndexedDB para armazenamento local
- Web App Manifest para instalação como PWA

## Instalação e Execução

### Requisitos

- Navegador moderno com suporte a PWA (Chrome, Firefox, Edge, Safari)
- Servidor web para servir os arquivos (ou use a extensão Live Server do VS Code)

### Instalação Local

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/TecnoClass-PWA.git
   cd TecnoClass-PWA
   ```

2. Inicie um servidor web local. Se você tem Python instalado:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   Ou use a extensão Live Server do VS Code.

3. Acesse o aplicativo em seu navegador:
   ```
   http://localhost:8000
   ```

### Instalação como PWA

1. Acesse o aplicativo em um navegador compatível
2. O navegador mostrará um ícone de instalação na barra de endereço ou menu
3. Clique no ícone e siga as instruções para instalar o aplicativo
4. O TecnoClass será instalado como um aplicativo nativo em seu dispositivo

## Estrutura do Projeto

```
TecnoClass-PWA/
├── assets/                  # Recursos estáticos
│   ├── icons/               # Ícones do aplicativo
│   └── images/              # Imagens utilizadas no aplicativo
├── components/              # Componentes reutilizáveis
│   ├── header/              # Componente de cabeçalho
│   ├── footer/              # Componente de rodapé
│   ├── navigation/          # Componente de navegação
│   └── ui/                  # Componentes de interface
├── pages/                   # Páginas do aplicativo
│   ├── home/                # Página inicial
│   ├── cursos/              # Página de cursos
│   ├── quizzes/             # Página de quizzes
│   └── perfil/              # Página de perfil
├── scripts/                 # Scripts JavaScript
│   ├── core/                # Funcionalidades principais
│   ├── tests/               # Testes automatizados
│   └── utils/               # Utilitários
├── services/                # Serviços do aplicativo
│   ├── auth/                # Serviço de autenticação
│   ├── cache/               # Gerenciamento de cache
│   └── db/                  # Acesso ao banco de dados
├── styles/                  # Estilos CSS
│   ├── main.css             # Estilos principais
│   ├── theme.css            # Variáveis de tema
│   └── darkMode.css         # Estilos para modo escuro
├── utils/                   # Utilitários gerais
│   ├── helpers/             # Funções auxiliares
│   ├── validators/          # Validadores de entrada
│   └── i18n/                # Internacionalização
├── index.html               # Página principal
├── manifest.json            # Manifest para PWA
├── service-worker.js        # Service Worker
├── offline.html             # Página offline
└── README.md                # Este arquivo
```

## Arquitetura

O TecnoClass-PWA segue uma arquitetura modular com separação clara de responsabilidades:

### Camada de Apresentação
- **Componentes**: Elementos reutilizáveis da interface
- **Páginas**: Composição de componentes para formar telas completas
- **Estilos**: CSS organizado com variáveis para temas

### Camada de Lógica
- **Scripts Core**: Implementação das funcionalidades principais
- **Serviços**: Encapsulam operações complexas e acesso a dados
- **Utilitários**: Funções auxiliares reutilizáveis

### Camada de Dados
- **IndexedDB**: Armazenamento estruturado de dados do usuário
- **Cache API**: Armazenamento de recursos estáticos e conteúdo
- **Service Worker**: Interceptação de requisições para funcionamento offline

### Fluxo de Dados
1. **Offline-First**: Todas as requisições passam pelo Service Worker
2. **Cache Strategy**: Estratégia Cache First com Network Update
3. **Sincronização**: Dados modificados offline são sincronizados quando a conexão é restabelecida

## Funcionalidades Principais

### Sistema de Navegação de Cursos
- Listagem de cursos por categoria
- Visualização detalhada de cursos
- Navegação entre lições
- Sistema de anotações
- Acompanhamento de progresso

### Quizzes Interativos
- Quizzes organizados por categoria e dificuldade
- Feedback detalhado após conclusão
- Histórico de tentativas
- Funcionamento completo offline

### Modo de Estudo Offline
- Download de cursos e quizzes para acesso offline
- Gerenciamento de conteúdo salvo
- Indicador de status online/offline
- Sincronização automática

### Barra de Progresso Global
- Visualização do progresso em todos os cursos
- Estatísticas por categoria
- Atualização em tempo real

### Modo Escuro
- Detecção automática da preferência do sistema
- Alternância manual entre temas
- Persistência da preferência do usuário

## Testes

O TecnoClass-PWA inclui testes automatizados para verificar o funcionamento offline:

### Testes de Funcionalidade Offline
- Navegação offline
- Acesso a conteúdo salvo
- Sincronização ao reconectar
- Funcionamento dos quizzes offline
- Persistência de progresso

Para executar os testes:
1. Acesse o aplicativo em seu navegador
2. Abra o console do desenvolvedor (F12)
3. Execute o comando: `window.offlineTestUI.show()`
4. Clique em "Executar Todos os Testes" na interface que aparece

## Contribuição

Contribuições são bem-vindas! Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

### Diretrizes de Contribuição
- Mantenha o código limpo e bem documentado
- Siga o estilo de código existente
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Contato

Para dúvidas ou sugestões, entre em contato através das issues do GitHub.

---

Desenvolvido como parte do projeto de recriação do TecnoClass como uma PWA educacional offline-first.
