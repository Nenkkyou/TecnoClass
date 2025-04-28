# Guia de Contribuição - TecnoClass PWA

Obrigado pelo interesse em contribuir com o TecnoClass PWA! Este guia fornece informações sobre como você pode participar do desenvolvimento deste projeto.

## Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Começar](#como-começar)
3. [Fluxo de Trabalho](#fluxo-de-trabalho)
4. [Padrões de Código](#padrões-de-código)
5. [Testes](#testes)
6. [Documentação](#documentação)
7. [Submissão de Pull Requests](#submissão-de-pull-requests)
8. [Relatando Bugs](#relatando-bugs)
9. [Sugerindo Melhorias](#sugerindo-melhorias)

## Código de Conduta

Este projeto adota um Código de Conduta que esperamos que todos os participantes sigam. Por favor, leia o [Código de Conduta](CODE_OF_CONDUCT.md) para entender quais ações são e não são toleradas.

## Como Começar

### Ambiente de Desenvolvimento

1. Faça um fork do repositório
2. Clone seu fork localmente:
   ```bash
   git clone https://github.com/seu-usuario/TecnoClass-PWA.git
   cd TecnoClass-PWA
   ```

3. Configure um servidor web local para servir os arquivos. Você pode usar:
   - Python: `python -m http.server 8000`
   - Node.js: `npx serve`
   - Extensão Live Server do VS Code

4. Acesse o aplicativo em seu navegador: `http://localhost:8000`

### Estrutura do Projeto

Familiarize-se com a estrutura do projeto conforme descrito no [README.md](README.md).

## Fluxo de Trabalho

1. Crie uma branch a partir da `main` para suas alterações:
   ```bash
   git checkout -b feature/nome-da-feature
   ```

2. Faça suas alterações seguindo os [padrões de código](#padrões-de-código)

3. Teste suas alterações conforme descrito na seção [Testes](#testes)

4. Commit suas alterações com mensagens claras:
   ```bash
   git commit -m "Descrição clara e concisa da alteração"
   ```

5. Envie sua branch para seu fork:
   ```bash
   git push origin feature/nome-da-feature
   ```

6. Abra um Pull Request para a branch `main` do repositório original

## Padrões de Código

### HTML

- Use HTML5 semântico
- Mantenha a acessibilidade em mente (use atributos ARIA quando necessário)
- Indente com 2 espaços
- Use aspas duplas para atributos

Exemplo:
```html
<section class="course-section">
  <h2>Título do Curso</h2>
  <p>Descrição do curso com <strong>destaque</strong> para pontos importantes.</p>
  <button class="btn btn-primary" aria-label="Iniciar curso">Iniciar</button>
</section>
```

### CSS

- Use variáveis CSS para cores, fontes e outros valores reutilizáveis
- Organize o CSS por componente
- Use nomes de classes descritivos seguindo a metodologia BEM
- Evite seletores muito específicos para melhor performance

Exemplo:
```css
.course-card {
  background-color: var(--card-bg-color);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.course-card__title {
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-sm);
}
```

### JavaScript

- Use JavaScript moderno (ES6+)
- Organize o código em módulos
- Use classes para encapsular funcionalidades
- Documente funções e métodos com comentários JSDoc
- Evite variáveis globais

Exemplo:
```javascript
/**
 * Gerencia o progresso do usuário em um curso
 * @class
 */
class CourseProgress {
  /**
   * Cria uma instância do gerenciador de progresso
   * @param {string} courseId - ID do curso
   */
  constructor(courseId) {
    this.courseId = courseId;
    this.progress = 0;
  }
  
  /**
   * Atualiza o progresso do curso
   * @param {number} newProgress - Novo valor de progresso (0-100)
   * @returns {Promise<boolean>} - Se a atualização foi bem-sucedida
   */
  async updateProgress(newProgress) {
    try {
      this.progress = newProgress;
      await this.saveProgress();
      return true;
    } catch (error) {
      console.error('Erro ao atualizar progresso:', error);
      return false;
    }
  }
}
```

## Testes

### Testes Manuais

Antes de submeter um Pull Request, teste manualmente suas alterações:

1. Verifique se a funcionalidade funciona como esperado
2. Teste em diferentes navegadores (Chrome, Firefox, Safari)
3. Teste em diferentes tamanhos de tela (desktop, tablet, mobile)
4. Teste no modo offline
5. Verifique a acessibilidade usando ferramentas como Lighthouse ou axe

### Testes Automatizados

Para testar a funcionalidade offline:

1. Acesse o aplicativo em seu navegador
2. Abra o console do desenvolvedor (F12)
3. Execute o comando: `window.offlineTestUI.show()`
4. Clique em "Executar Todos os Testes" na interface que aparece

## Documentação

Ao adicionar novas funcionalidades ou modificar existentes, atualize a documentação:

1. Atualize o README.md se necessário
2. Adicione ou atualize a documentação técnica em `/docs`
3. Documente seu código com comentários JSDoc

## Submissão de Pull Requests

Ao submeter um Pull Request:

1. Preencha o template de PR com todas as informações necessárias
2. Vincule o PR a issues relacionadas
3. Descreva claramente as alterações feitas
4. Inclua screenshots ou GIFs se aplicável
5. Certifique-se de que todos os testes passam

## Relatando Bugs

Ao relatar bugs:

1. Use o template de issue para bugs
2. Forneça passos detalhados para reproduzir o bug
3. Descreva o comportamento esperado vs. comportamento atual
4. Inclua screenshots ou vídeos se possível
5. Forneça informações sobre seu ambiente (navegador, sistema operacional)

## Sugerindo Melhorias

Ao sugerir melhorias:

1. Use o template de issue para sugestões
2. Descreva claramente a melhoria proposta
3. Explique por que essa melhoria seria útil
4. Forneça exemplos de como a melhoria funcionaria
5. Inclua mockups ou diagramas se aplicável

---

Agradecemos suas contribuições para tornar o TecnoClass PWA melhor para todos os usuários!
