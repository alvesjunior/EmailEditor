Quero que você desenvolva um editor de email visual (WYSIWYG) estilo Unlayer, porém open-source e totalmente embutível em projetos.

Objetivo principal:
Criar uma biblioteca JavaScript que eu consiga usar assim:

new EmailEditor({
  target: '#minha-textarea'
});

E automaticamente:
- substitui a textarea por um editor visual
- permite editar conteúdo
- salva o HTML de volta na textarea

---

### 🧱 Requisitos técnicos

- Linguagem: JavaScript (preferencialmente TypeScript)
- Sem dependência de backend
- Pode usar bibliotecas open source (ex: GrapesJS, MJML)
- Deve funcionar em qualquer projeto (Laravel Blade, HTML puro, React opcional)
- Bundle único (via Vite ou Rollup)
- Exportável como pacote npm

---

### 🎯 Funcionalidades obrigatórias

1. Editor visual drag-and-drop
- blocos: texto, imagem, botão, divisor, coluna
- arrastar e soltar
- edição inline

2. Compatibilidade com email
- usar MJML ou HTML compatível com email
- evitar CSS moderno (flex, grid)
- gerar HTML inline (table-based)

3. Integração com textarea
- recebe um seletor (ex: #email)
- esconde textarea original
- mantém sincronização:
    - ao editar → atualiza textarea
    - ao carregar → carrega conteúdo da textarea

4. Exportação
- getHTML()
- getJSON()
- setContent(html ou json)

5. Toolbar básica
- negrito, itálico
- alinhamento
- links
- cores
- tamanho de fonte

6. Imagens
- upload fake (callback configurável)
- suporte a URL

7. Responsividade
- preview desktop/mobile

---

### 🧩 API esperada

Quero usar assim:

const editor = new EmailEditor({
  target: '#content',
  height: '600px',
  onChange: (html) => {
    console.log(html);
  }
});

editor.getHTML();
editor.setContent('<h1>Teste</h1>');

---

### 🎨 UI/UX

- layout simples e limpo
- sidebar com blocos
- área central de edição
- painel lateral de propriedades
- parecido com construtores tipo Unlayer / Elementor

---

### 📦 Estrutura do projeto

- src/
  - EmailEditor.ts
  - core/
  - components/
  - plugins/
- dist/
- exemplo de uso em HTML puro
- exemplo de uso em Laravel Blade

---

### 🔌 Integração com Laravel

Preciso de um exemplo:

<textarea id="email"></textarea>

<script>
  new EmailEditor({ target: '#email' });
</script>

E ao submeter o form, o HTML precisa estar dentro da textarea.

---

### ⚙️ Extras importantes

- suporte a múltiplos editores na mesma página
- destroy() para remover editor
- sem memory leaks
- leve (evitar bundle gigante)
- código bem organizado e documentado

---

### 🧪 Entregáveis

- código completo
- instruções de build
- exemplo funcional
- documentação básica de uso

---

### 💡 Diferencial (se possível)

- suporte a templates prontos
- salvar layout em JSON
- carregar layout salvo
- sistema de blocos customizáveis

---

Importante:
Quero algo pronto para uso em produção, não apenas um protótipo.
O foco é ser simples de integrar e reutilizável em vários projetos.

---

### 🔧 Diretriz técnica obrigatória

Use GrapesJS como base para o editor visual.

Integre com MJML para garantir compatibilidade com clientes de email (Gmail, Outlook, etc).

Crie uma camada wrapper chamada EmailEditor para simplificar o uso e abstrair a complexidade do GrapesJS.

Não reinventar editor do zero.

Além disso quero que gero no final um md como faço para usar nos projetos sendo html, laravel, vue, react...