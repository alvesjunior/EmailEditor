# Email Editor - Guia de Uso

Editor de email visual (WYSIWYG) baseado em GrapesJS + MJML. Gera HTML compativel com todos os clientes de email (Gmail, Outlook, etc).

---

## Instalacao

### Via NPM

```bash
npm install email-editor
```

### Via CDN / Build local

```bash
git clone <repo>
cd EmailEditor
npm install
npm run build
```

Os arquivos de distribuicao estarao em `dist/`:
- `email-editor.umd.js` - Bundle UMD (para `<script>`)
- `email-editor.es.js` - Bundle ES Module
- `email-editor.css` - Estilos

---

## Uso Basico

### HTML Puro

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="dist/email-editor.css" />
  <script src="dist/email-editor.umd.js"></script>
</head>
<body>
  <textarea id="email-content" name="content"></textarea>

  <script>
    const editor = new EmailEditor({
      target: '#email-content',
      height: '700px',
      onChange: function(html) {
        console.log('HTML atualizado');
      }
    });
  </script>
</body>
</html>
```

---

### Laravel Blade

```blade
{{-- resources/views/emails/create.blade.php --}}
@extends('layouts.app')

@section('styles')
  <link rel="stylesheet" href="{{ asset('vendor/email-editor/email-editor.css') }}" />
@endsection

@section('content')
  <form action="{{ route('emails.store') }}" method="POST">
    @csrf
    <textarea id="email-content" name="email_content">{{ old('email_content', $email->content ?? '') }}</textarea>
    <button type="submit">Salvar</button>
  </form>
@endsection

@section('scripts')
  <script src="{{ asset('vendor/email-editor/email-editor.umd.js') }}"></script>
  <script>
    const editor = new EmailEditor({
      target: '#email-content',
      height: '700px',
      onUpload: async function(files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('images[]', files[i]);
        }
        const res = await fetch('/api/upload-images', {
          method: 'POST',
          headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
          body: formData
        });
        const data = await res.json();
        return data.urls;
      }
    });

    // Ao submeter, garante que HTML esta na textarea
    document.querySelector('form').addEventListener('submit', function() {
      document.getElementById('email-content').value = editor.getHTML();
    });
  </script>
@endsection
```

**No Laravel**, copie os arquivos de `dist/` para `public/vendor/email-editor/`:

```bash
# Apos build
cp dist/email-editor.umd.js public/vendor/email-editor/
cp dist/email-editor.css public/vendor/email-editor/
```

---

### Vue.js

```vue
<template>
  <div>
    <textarea ref="emailContent" v-show="false"></textarea>
    <button @click="getContent">Ver HTML</button>
  </div>
</template>

<script>
import EmailEditor from 'email-editor';

export default {
  data() {
    return { editor: null };
  },
  mounted() {
    this.editor = new EmailEditor({
      target: this.$refs.emailContent,
      height: '600px',
      onChange: (html) => {
        this.$emit('update:content', html);
      }
    });
  },
  methods: {
    getContent() {
      return this.editor.getHTML();
    },
    setContent(html) {
      this.editor.setContent(html);
    }
  },
  beforeDestroy() {
    if (this.editor) this.editor.destroy();
  }
};
</script>
```

---

### Vue 3 (Composition API)

```vue
<template>
  <div>
    <textarea ref="emailContent" style="display:none"></textarea>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import EmailEditor from 'email-editor';

const emailContent = ref(null);
let editor = null;

const emit = defineEmits(['update:content']);

onMounted(() => {
  editor = new EmailEditor({
    target: emailContent.value,
    height: '600px',
    onChange: (html) => emit('update:content', html)
  });
});

onBeforeUnmount(() => {
  if (editor) editor.destroy();
});

defineExpose({
  getHTML: () => editor?.getHTML(),
  getMJML: () => editor?.getMJML(),
  getJSON: () => editor?.getJSON(),
  setContent: (content) => editor?.setContent(content),
});
</script>
```

---

### React

```jsx
import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import EmailEditorLib from 'email-editor';

const EmailEditor = forwardRef(({ height = '600px', onChange, initialContent }, ref) => {
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = new EmailEditorLib({
      target: textareaRef.current,
      height,
      onChange,
    });

    if (initialContent) {
      editorRef.current.setContent(initialContent);
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
      }
    };
  }, []);

  useImperativeHandle(ref, () => ({
    getHTML: () => editorRef.current?.getHTML(),
    getMJML: () => editorRef.current?.getMJML(),
    getJSON: () => editorRef.current?.getJSON(),
    setContent: (content) => editorRef.current?.setContent(content),
    loadTemplate: (id) => editorRef.current?.loadTemplate(id),
  }));

  return <textarea ref={textareaRef} style={{ display: 'none' }} />;
});

export default EmailEditor;

// Uso:
// const editorRef = useRef();
// <EmailEditor ref={editorRef} height="700px" onChange={(html) => console.log(html)} />
// editorRef.current.getHTML();
```

---

### Next.js

```jsx
import dynamic from 'next/dynamic';

// Importar sem SSR (o editor precisa do DOM)
const EmailEditor = dynamic(() => import('./EmailEditor'), { ssr: false });

export default function EmailPage() {
  const editorRef = useRef();

  const handleSave = () => {
    const html = editorRef.current?.getHTML();
    // Enviar para API
    fetch('/api/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: html })
    });
  };

  return (
    <div>
      <EmailEditor ref={editorRef} height="700px" />
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}
```

---

## API

### Construtor

```js
const editor = new EmailEditor(options);
```

| Opcao | Tipo | Padrao | Descricao |
|-------|------|--------|-----------|
| `target` | `string \| HTMLTextAreaElement` | **obrigatorio** | Seletor CSS ou elemento textarea |
| `height` | `string` | `'700px'` | Altura do editor |
| `width` | `string` | `undefined` | Largura do editor |
| `onChange` | `(html: string) => void` | `undefined` | Callback chamado a cada alteracao |
| `onReady` | `(editor) => void` | `undefined` | Callback quando o editor esta pronto |
| `onUpload` | `(files: FileList) => Promise<string[]>` | `undefined` | Callback para upload de imagens |
| `templates` | `EmailTemplate[]` | templates padrao | Templates disponiveis |

### Metodos

| Metodo | Retorno | Descricao |
|--------|---------|-----------|
| `getHTML()` | `string` | Retorna HTML compativel com email |
| `getMJML()` | `string` | Retorna o codigo MJML |
| `getJSON()` | `object` | Retorna o estado completo em JSON |
| `setContent(content)` | `void` | Define o conteudo (HTML, MJML ou JSON) |
| `loadTemplate(id)` | `void` | Carrega um template pelo ID |
| `getTemplates()` | `EmailTemplate[]` | Retorna templates disponiveis |
| `setDevice(device)` | `void` | Alterna entre 'Desktop' e 'Mobile' |
| `getEditor()` | `Editor` | Retorna instancia do GrapesJS |
| `destroy()` | `void` | Destroi o editor e restaura a textarea |

### Templates

```js
const editor = new EmailEditor({
  target: '#email',
  templates: [
    {
      id: 'custom',
      name: 'Meu Template',
      mjml: '<mjml><mj-body>...</mj-body></mjml>'
    }
  ]
});

// Carregar template
editor.loadTemplate('custom');

// Listar templates
editor.getTemplates();
```

### Multiplos editores

```js
const editor1 = new EmailEditor({ target: '#email1' });
const editor2 = new EmailEditor({ target: '#email2' });

// Cada editor e independente
editor1.getHTML();
editor2.getHTML();

// Destruir individualmente
editor1.destroy();
```

### Salvar e restaurar estado

```js
// Salvar
const json = editor.getJSON();
localStorage.setItem('email-draft', JSON.stringify(json));

// Restaurar
const saved = JSON.parse(localStorage.getItem('email-draft'));
editor.setContent(saved);
```

---

## Build

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para producao
npm run build

# Preview do build
npm run preview
```

---

## Estrutura do Projeto

```
EmailEditor/
├── src/
│   ├── EmailEditor.ts      # Classe principal (wrapper)
│   ├── core/
│   │   ├── config.ts        # Configuracao do GrapesJS
│   │   ├── blocks.ts        # Blocos de email (texto, imagem, botao, etc)
│   │   ├── styles.ts        # CSS do editor
│   │   └── templates.ts     # Templates prontos
│   └── plugins/             # Plugins extras (extensivel)
├── examples/
│   ├── index.html           # Demo em HTML puro
│   └── laravel.blade.php    # Exemplo Laravel
├── dist/                    # Build (gerado)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── USAGE.md                 # Este arquivo
```
