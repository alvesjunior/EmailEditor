# Vue 3 Example

## Setup

```bash
# Criar projeto Vue (se nao tiver um)
npm create vue@latest my-app
cd my-app

# Instalar o Email Editor
npm install @tag/email-editor

# Copiar os arquivos deste exemplo
cp EmailEditor.vue src/components/
```

## Uso basico

```vue
<template>
  <EmailEditor
    ref="editorRef"
    v-model="emailContent"
    height="700px"
    :tags="['nome', 'email', 'produto']"
    @change="onContentChange"
  />
</template>

<script setup>
import { ref } from 'vue';
import EmailEditor from './components/EmailEditor.vue';

const editorRef = ref(null);
const emailContent = ref('');

function onContentChange(html) {
  console.log('HTML atualizado:', html);
}

// Acessar metodos via ref
function save() {
  const html = editorRef.value.getHTML();
  const json = editorRef.value.getJSON();
  // enviar para API...
}
</script>
```

## Funcionalidades do componente

- **v-model** — two-way binding com o HTML do email
- **tags** — variaveis disponiveis para autocomplete (ex: `{nome}`)
- **templates** — templates customizados (ou usa os built-in)
- **Slots** — `toolbar-left` e `toolbar-actions` para customizar a toolbar
- **Expose** — `getHTML()`, `getMJML()`, `getJSON()`, `setContent()`, `loadTemplate()`, `setDevice()`
- **Modal de preview** embutida (HTML e JSON)

## App completa de exemplo

Veja `App.vue` para um exemplo completo com:

- Header com gradiente
- Select de templates
- Botao de salvar
- Editor com tags configuradas

```vue
<script setup>
import App from './examples/vue/App.vue';
</script>

<template>
  <App />
</template>
```
