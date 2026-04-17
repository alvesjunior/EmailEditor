<p align="center">
  <img src="https://img.shields.io/badge/grapesjs-powered-4f46e5?style=flat-square" alt="GrapesJS powered" />
  <img src="https://img.shields.io/badge/mjml-compatible-e84a27?style=flat-square" alt="MJML compatible" />
  <img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="MIT License" />
  <img src="https://img.shields.io/badge/bundle-~640KB%20gzip-blue?style=flat-square" alt="Bundle size" />
</p>

# Email Editor

A visual, drag-and-drop email editor that generates email-compatible HTML. Built on top of [GrapesJS](https://grapesjs.com/) and [MJML](https://mjml.io/), wrapped in a dead-simple API.

Drop it into **any** project — plain HTML, Laravel, Vue, React, Next.js — with a single line:

```js
new EmailEditor({ target: '#my-textarea' });
```

It replaces your `<textarea>` with a full visual editor and keeps the HTML synced back to the textarea automatically. When the form submits, the email HTML is already there.

---

## Features

- **Drag & drop blocks** — text, image, button, divider, columns (1/2/3), social links, spacer, hero section
- **MJML under the hood** — generates table-based HTML that renders correctly in Gmail, Outlook, Yahoo, Apple Mail, and all major clients
- **Textarea integration** — hides the original textarea, syncs content on every change, works with forms out of the box
- **Rich text editing** — bold, italic, underline, alignment, links, inline editing directly on the canvas
- **Style manager** — visual controls for fonts, colors, spacing, backgrounds, borders
- **Responsive preview** — toggle between desktop and mobile views
- **Templates** — 4 built-in templates (blank, newsletter, promotional, welcome) + support for custom templates
- **Full API** — `getHTML()`, `getMJML()`, `getJSON()`, `setContent()`, `loadTemplate()`, `destroy()`
- **Image upload** — configurable callback for custom upload endpoints
- **Tag autocomplete** — type `{` inside the editor and get a dropdown with available variables (e.g. `{nome}`, `{email}`) — fully configurable via the `tags` option
- **Multiple instances** — run multiple editors on the same page without conflicts
- **No backend required** — 100% client-side
- **Clean, modern UI** — inspired by Unlayer and Elementor, with an Indigo/violet-based design

---

## Requirements

| Dependency | Minimum Version | Notes |
|---|---|---|
| **Node.js** | `>= 18.0` | LTS recommended (tested with 22.x) |
| **npm** | `>= 9.0` | Comes with Node 18+ |
| **Browser** | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ | Any modern browser with ES2020 support |

### Framework-specific

| Framework | Minimum Version | Notes |
|---|---|---|
| **HTML puro** | — | Any modern browser, no build step needed (use UMD bundle) |
| **Laravel** | `>= 8.x` | Blade templates, just include CSS + JS in `public/` |
| **Vue** | `>= 3.2` | Composition API (`<script setup>`) |
| **React** | `>= 18.0` | Hooks (`useRef`, `useEffect`, `forwardRef`) |
| **Next.js** | `>= 13.0` | Requires `dynamic()` with `{ ssr: false }` |
| **Vite** | `>= 4.0` | For building from source |
| **TypeScript** | `>= 5.0` | Optional — works with plain JS too |

### Core dependencies (bundled automatically)

| Package | Version | Purpose |
|---|---|---|
| [GrapesJS](https://grapesjs.com/) | `0.22.x` | Visual drag-and-drop editor engine |
| [grapesjs-mjml](https://github.com/GrapesJS/mjml) | `1.0.x` | MJML components for GrapesJS |
| [mjml-browser](https://mjml.io/) | `5.0.x` | MJML to HTML compilation (client-side) |

> These are **included in the bundle** — you don't need to install them separately.

---

## Quick Start

### Install

```bash
npm install email-editor
```

Or build from source:

```bash
git clone https://github.com/alvesjunior/EmailEditor.git
cd EmailEditor
npm install
npm run build
```

### Use

```html
<!-- Include the built files -->
<link rel="stylesheet" href="dist/email-editor.css" />
<script src="dist/email-editor.umd.js"></script>

<!-- Your textarea -->
<textarea id="email-content" name="content"></textarea>

<script>
  const editor = new EmailEditor({
    target: '#email-content',
    tags: ['nome', 'email', 'produto'],
    height: '700px',
    onChange: (html) => {
      console.log('Content updated');
    },
  });
</script>
```

That's it. The textarea is replaced by the visual editor, and its value stays in sync.

---

## API

### Constructor

```js
const editor = new EmailEditor(options);
```

| Option | Type | Default | Description |
|---|---|---|---|
| `target` | `string \| HTMLTextAreaElement` | *required* | CSS selector or textarea element |
| `height` | `string` | `'700px'` | Editor height |
| `width` | `string` | — | Editor width |
| `onChange` | `(html: string) => void` | — | Called on every content change |
| `onReady` | `(editor: EmailEditor) => void` | — | Called when the editor is ready |
| `onUpload` | `(files: FileList) => Promise<string[]>` | — | Custom image upload handler |
| `templates` | `EmailTemplate[]` | built-in templates | Available templates |
| `tags` | `string[]` | — | Variable names for autocomplete (type `{` to trigger) |

### Methods

| Method | Returns | Description |
|---|---|---|
| `getHTML()` | `string` | Email-compatible HTML (table-based, inline styles) |
| `getMJML()` | `string` | MJML source code |
| `getJSON()` | `object` | Full editor state as JSON (for save/restore) |
| `setContent(content)` | `void` | Load content from HTML string, MJML string, or JSON |
| `loadTemplate(id)` | `void` | Load a template by ID |
| `getTemplates()` | `EmailTemplate[]` | List available templates |
| `setDevice(device)` | `void` | Switch between `'Desktop'` and `'Mobile'` preview |
| `getEditor()` | `Editor` | Access the underlying GrapesJS instance |
| `destroy()` | `void` | Remove the editor and restore the original textarea |

---

## Framework Integration

### Laravel Blade

```blade
<form action="{{ route('emails.store') }}" method="POST">
    @csrf
    <textarea id="email-content" name="email_content">
      {{ old('email_content', $email->content ?? '') }}
    </textarea>
    <button type="submit">Save</button>
</form>

<link rel="stylesheet" href="{{ asset('vendor/email-editor/email-editor.css') }}" />
<script src="{{ asset('vendor/email-editor/email-editor.umd.js') }}"></script>
<script>
  new EmailEditor({
    target: '#email-content',
    height: '700px',
    onUpload: async (files) => {
      const form = new FormData();
      for (const file of files) form.append('images[]', file);
      const res = await fetch('/api/upload-images', {
        method: 'POST',
        headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}' },
        body: form,
      });
      return (await res.json()).urls;
    },
  });
</script>
```

Copy the dist files to `public/vendor/email-editor/` after building.

### Vue 3

```vue
<template>
  <textarea ref="editorEl" style="display:none" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { EmailEditor } from 'email-editor';

const editorEl = ref(null);
let editor = null;

onMounted(() => {
  editor = new EmailEditor({
    target: editorEl.value,
    height: '600px',
    onChange: (html) => emit('update:modelValue', html),
  });
});

onBeforeUnmount(() => editor?.destroy());

const emit = defineEmits(['update:modelValue']);

defineExpose({
  getHTML: () => editor?.getHTML(),
  setContent: (c) => editor?.setContent(c),
});
</script>
```

### React

```jsx
import { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import { EmailEditor as EmailEditorLib } from 'email-editor';

const EmailEditor = forwardRef(({ height = '600px', onChange }, ref) => {
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    editorRef.current = new EmailEditorLib({
      target: textareaRef.current,
      height,
      onChange,
    });
    return () => editorRef.current?.destroy();
  }, []);

  useImperativeHandle(ref, () => ({
    getHTML: () => editorRef.current?.getHTML(),
    getMJML: () => editorRef.current?.getMJML(),
    getJSON: () => editorRef.current?.getJSON(),
    setContent: (c) => editorRef.current?.setContent(c),
  }));

  return <textarea ref={textareaRef} style={{ display: 'none' }} />;
});
```

### Next.js

```jsx
import dynamic from 'next/dynamic';

// Must disable SSR — the editor needs the DOM
const EmailEditor = dynamic(() => import('./EmailEditor'), { ssr: false });
```

---

## Tags / Variable Autocomplete

Pass a `tags` array and the editor will show an autocomplete dropdown when the user types `{` inside any text block. Navigate with arrow keys, confirm with Enter/Tab.

```js
const editor = new EmailEditor({
  target: '#email-content',
  tags: ['nome', 'email', 'empresa', 'produto', 'preco', 'link_cancelar'],
});
```

The tag is inserted as `{nome}`, `{email}`, etc. — you replace them server-side before sending:

```php
// Laravel example
$html = str_replace(
    ['{nome}', '{email}', '{produto}'],
    [$user->name, $user->email, $product->name],
    $editor_html
);

Mail::send([], [], function ($message) use ($html) {
    $message->to($recipient)->subject('Assunto')->html($html);
});
```

Works in all integrations (HTML, Vue, React):

```vue
<!-- Vue -->
<script setup>
new EmailEditor({
  target: editorEl.value,
  tags: ['nome', 'email', 'produto'],
});
</script>
```

```jsx
// React
new EmailEditorLib({
  target: textareaRef.current,
  tags: ['nome', 'email', 'produto'],
});
```

---

## Templates

### Built-in

| ID | Name | Description |
|---|---|---|
| `blank` | Em Branco | Empty starting point |
| `newsletter` | Newsletter | Header, featured article, 2-column articles, footer |
| `promotional` | Promocional | Hero banner, 3-column product grid, CTA |
| `welcome` | Boas-vindas | Welcome message with onboarding steps |

### Custom templates

```js
new EmailEditor({
  target: '#email',
  templates: [
    {
      id: 'my-template',
      name: 'My Template',
      mjml: '<mjml><mj-body>...</mj-body></mjml>',
    },
  ],
});

// Load at runtime
editor.loadTemplate('my-template');
```

### Save & restore

```js
// Save
const state = editor.getJSON();
localStorage.setItem('draft', JSON.stringify(state));

// Restore
const saved = JSON.parse(localStorage.getItem('draft'));
editor.setContent(saved);
```

---

## Development

```bash
# Dev server with hot reload
npm run dev
# Open http://localhost:5173/examples/index.html

# Production build
npm run build

# Preview production build
npm run preview
```

### Project structure

```
src/
  EmailEditor.ts          → Main wrapper class
  core/
    config.ts             → GrapesJS configuration & types
    blocks.ts             → Email block definitions (9 blocks)
    styles.ts             → Editor CSS (modern, var-based)
    templates.ts          → Built-in email templates
examples/
  index.html              → Full interactive demo (HTML puro)
  laravel.blade.php       → Laravel Blade integration
  vue/
    EmailEditor.vue       → Vue 3 component (v-model, slots, expose)
    App.vue               → Complete Vue app example
  react/
    EmailEditor.tsx       → React component (forwardRef + demo app)
dist/                     → Generated by `npm run build`
  email-editor.umd.js    → UMD bundle (for <script> tags)
  email-editor.es.js     → ES module bundle
  email-editor.css       → Styles
```

---

## How It Works

```
┌─────────────────────────────────────────────────┐
│                  EmailEditor                     │
│  (simple API wrapper)                            │
│                                                  │
│   ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│   │  GrapesJS │  │   MJML   │  │   Textarea   │  │
│   │  (visual  │→ │  (email  │→ │   (sync &    │  │
│   │  editor)  │  │   HTML)  │  │   form POST) │  │
│   └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────┘
```

1. **GrapesJS** handles the visual drag-and-drop editing experience
2. **grapesjs-mjml** provides MJML components that work inside GrapesJS
3. **MJML** compiles to table-based HTML with inline styles — compatible with all email clients
4. **EmailEditor** wraps everything in a clean API and keeps the textarea in sync

---

## Email Client Compatibility

The generated HTML uses MJML's battle-tested output, which is compatible with:

| Client | Support |
|---|---|
| Gmail (Web, iOS, Android) | Full |
| Outlook (2016+, 365, Web) | Full |
| Apple Mail (macOS, iOS) | Full |
| Yahoo Mail | Full |
| Thunderbird | Full |
| Samsung Mail | Full |

---

## License

MIT
