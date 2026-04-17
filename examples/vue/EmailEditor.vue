<template>
  <div class="email-editor-vue">
    <div class="editor-toolbar" v-if="showToolbar">
      <div class="toolbar-left">
        <slot name="toolbar-left">
          <h3>{{ title }}</h3>
        </slot>
      </div>
      <div class="toolbar-right">
        <button class="btn btn-secondary" @click="handlePreviewHTML">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
          Ver HTML
        </button>
        <button class="btn btn-secondary" @click="handleGetJSON">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
          JSON
        </button>
        <slot name="toolbar-actions" />
      </div>
    </div>

    <textarea ref="editorEl" style="display:none" />

    <!-- HTML Preview Modal -->
    <Teleport to="body">
      <div class="modal-overlay" v-if="showPreview" @click.self="showPreview = false">
        <div class="modal-panel">
          <div class="modal-header">
            <h3>{{ previewTitle }}</h3>
            <div class="modal-actions">
              <button class="btn btn-sm" @click="copyPreview">
                {{ copied ? 'Copiado!' : 'Copiar' }}
              </button>
              <button class="btn-close" @click="showPreview = false">&times;</button>
            </div>
          </div>
          <pre class="modal-code">{{ previewContent }}</pre>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { EmailEditor } from 'email-editor';
import type { EmailEditorOptions } from 'email-editor';

// ============================================
// Props
// ============================================
interface Props {
  modelValue?: string;
  height?: string;
  tags?: string[];
  templates?: EmailEditorOptions['templates'];
  title?: string;
  showToolbar?: boolean;
  onUpload?: EmailEditorOptions['onUpload'];
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  height: '600px',
  tags: () => [],
  title: 'Email Editor',
  showToolbar: true,
});

// ============================================
// Emits
// ============================================
const emit = defineEmits<{
  'update:modelValue': [html: string];
  'ready': [editor: EmailEditor];
  'change': [html: string];
}>();

// ============================================
// State
// ============================================
const editorEl = ref<HTMLTextAreaElement | null>(null);
let editor: EmailEditor | null = null;

const showPreview = ref(false);
const previewTitle = ref('');
const previewContent = ref('');
const copied = ref(false);

// ============================================
// Lifecycle
// ============================================
onMounted(() => {
  if (!editorEl.value) return;

  // Set initial value
  if (props.modelValue) {
    editorEl.value.value = props.modelValue;
  }

  editor = new EmailEditor({
    target: editorEl.value,
    height: props.height,
    tags: props.tags,
    templates: props.templates,
    onUpload: props.onUpload,
    onChange: (html: string) => {
      emit('update:modelValue', html);
      emit('change', html);
    },
    onReady: () => {
      emit('ready', editor!);
    },
  });
});

onBeforeUnmount(() => {
  editor?.destroy();
  editor = null;
});

// ============================================
// Watchers
// ============================================
// If parent changes modelValue externally, update editor
let lastEmitted = '';
watch(() => props.modelValue, (val) => {
  if (val && val !== lastEmitted && editor) {
    editor.setContent(val);
  }
});

// ============================================
// Methods
// ============================================
function handlePreviewHTML() {
  previewTitle.value = 'HTML Output';
  previewContent.value = editor?.getHTML() || '';
  showPreview.value = true;
}

function handleGetJSON() {
  previewTitle.value = 'JSON Output';
  previewContent.value = JSON.stringify(editor?.getJSON() || {}, null, 2);
  showPreview.value = true;
}

async function copyPreview() {
  await navigator.clipboard.writeText(previewContent.value);
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}

// ============================================
// Expose public API
// ============================================
defineExpose({
  getHTML: () => editor?.getHTML() ?? '',
  getMJML: () => editor?.getMJML() ?? '',
  getJSON: () => editor?.getJSON() ?? {},
  setContent: (content: string | object) => editor?.setContent(content),
  loadTemplate: (id: string) => editor?.loadTemplate(id),
  setDevice: (device: 'Desktop' | 'Mobile') => editor?.setDevice(device),
  getEditor: () => editor?.getEditor(),
});
</script>

<style scoped>
.email-editor-vue {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #e4e7ec;
  border-bottom: none;
  border-radius: 10px 10px 0 0;
}

.editor-toolbar h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1a1d23;
  margin: 0;
}

.toolbar-right {
  display: flex;
  gap: 6px;
  align-items: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  border: 1.5px solid #e4e7ec;
  border-radius: 6px;
  background: #fff;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.15s;
}

.btn:hover {
  border-color: #4f46e5;
  color: #4f46e5;
  background: #eef2ff;
}

.btn-sm {
  composes: btn;
  padding: 5px 12px;
  font-size: 12px;
}

.btn-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 20px;
  color: #9ca3af;
  cursor: pointer;
}

.btn-close:hover {
  background: #fee2e2;
  color: #ef4444;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
}

.modal-panel {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 80px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 1100px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #e4e7ec;
  background: #f8f9fb;
}

.modal-header h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.modal-code {
  flex: 1;
  overflow: auto;
  margin: 0;
  padding: 24px;
  font-size: 13px;
  line-height: 1.7;
  font-family: 'SF Mono', 'Fira Code', monospace;
  background: #0f172a;
  color: #e2e8f0;
}
</style>
