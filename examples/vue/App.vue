<template>
  <div id="app">
    <header class="app-header">
      <h1>Email Editor <span>Vue 3 Example</span></h1>
      <div class="header-actions">
        <button @click="save">Salvar Email</button>
        <select @change="loadTemplate($event)">
          <option value="">Selecione um template...</option>
          <option value="blank">Em Branco</option>
          <option value="newsletter">Newsletter</option>
          <option value="promotional">Promocional</option>
          <option value="welcome">Boas-vindas</option>
        </select>
      </div>
    </header>

    <main>
      <EmailEditorComponent
        ref="editorRef"
        v-model="emailContent"
        height="calc(100vh - 72px)"
        :tags="['nome', 'email', 'empresa', 'produto', 'preco']"
        title="Novo Email"
        :show-toolbar="false"
        @ready="onReady"
        @change="onChange"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EmailEditorComponent from './EmailEditor.vue';

const editorRef = ref<InstanceType<typeof EmailEditorComponent> | null>(null);
const emailContent = ref('');

function onReady(editor: any) {
  console.log('Editor pronto!', editor);
}

function onChange(html: string) {
  // Atualiza automaticamente via v-model,
  // mas voce pode fazer algo extra aqui
}

function loadTemplate(event: Event) {
  const id = (event.target as HTMLSelectElement).value;
  if (id) editorRef.value?.loadTemplate(id);
}

async function save() {
  const html = editorRef.value?.getHTML();
  const json = editorRef.value?.getJSON();

  console.log('HTML para enviar por email:', html);
  console.log('JSON para salvar no banco (rascunho):', json);

  // Exemplo: enviar para API
  // await fetch('/api/emails', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({
  //     html: html,
  //     json: json, // para editar depois
  //   }),
  // });

  alert('Email salvo! Veja o console para o output.');
}
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f0f2f5;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
}

.app-header h1 {
  font-size: 16px;
  font-weight: 600;
}

.app-header h1 span {
  font-weight: 400;
  opacity: 0.7;
  margin-left: 8px;
  font-size: 13px;
}

.header-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.header-actions button,
.header-actions select {
  padding: 7px 16px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 6px;
  background: rgba(255,255,255,0.1);
  color: white;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.header-actions button:hover,
.header-actions select:hover {
  background: rgba(255,255,255,0.2);
}

.header-actions select option {
  background: #1a1d23;
  color: white;
}
</style>
