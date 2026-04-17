import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
} from 'react';
import { EmailEditor as EmailEditorLib } from 'email-editor';
import type { EmailEditorOptions, EmailTemplate } from 'email-editor';

// ============================================
// Types
// ============================================
export interface EmailEditorProps {
  height?: string;
  tags?: string[];
  templates?: EmailTemplate[];
  initialContent?: string;
  onChange?: (html: string) => void;
  onReady?: (editor: EmailEditorLib) => void;
  onUpload?: EmailEditorOptions['onUpload'];
}

export interface EmailEditorHandle {
  getHTML: () => string;
  getMJML: () => string;
  getJSON: () => object;
  setContent: (content: string | object) => void;
  loadTemplate: (id: string) => void;
  setDevice: (device: 'Desktop' | 'Mobile') => void;
}

// ============================================
// Component
// ============================================
const EmailEditor = forwardRef<EmailEditorHandle, EmailEditorProps>(
  (
    {
      height = '600px',
      tags = [],
      templates,
      initialContent,
      onChange,
      onReady,
      onUpload,
    },
    ref,
  ) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const editorRef = useRef<EmailEditorLib | null>(null);

    useEffect(() => {
      if (!textareaRef.current) return;

      if (initialContent) {
        textareaRef.current.value = initialContent;
      }

      editorRef.current = new EmailEditorLib({
        target: textareaRef.current,
        height,
        tags,
        templates,
        onUpload,
        onChange,
        onReady: () => {
          if (onReady && editorRef.current) {
            onReady(editorRef.current);
          }
        },
      });

      return () => {
        editorRef.current?.destroy();
        editorRef.current = null;
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(ref, () => ({
      getHTML: () => editorRef.current?.getHTML() ?? '',
      getMJML: () => editorRef.current?.getMJML() ?? '',
      getJSON: () => editorRef.current?.getJSON() ?? {},
      setContent: (content) => editorRef.current?.setContent(content),
      loadTemplate: (id) => editorRef.current?.loadTemplate(id),
      setDevice: (device) => editorRef.current?.setDevice(device),
    }));

    return <textarea ref={textareaRef} style={{ display: 'none' }} />;
  },
);

EmailEditor.displayName = 'EmailEditor';

// ============================================
// Preview Modal
// ============================================
interface PreviewModalProps {
  title: string;
  content: string;
  onClose: () => void;
}

function PreviewModal({ title, content, onClose }: PreviewModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [content]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{title}</h3>
          <div style={styles.modalActions}>
            <button
              style={{
                ...styles.btnCopy,
                ...(copied ? styles.btnCopied : {}),
              }}
              onClick={handleCopy}
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
            <button style={styles.btnClose} onClick={onClose}>
              &times;
            </button>
          </div>
        </div>
        <pre style={styles.code}>{content}</pre>
      </div>
    </div>
  );
}

// ============================================
// Demo App
// ============================================
export function EmailEditorDemo() {
  const editorRef = useRef<EmailEditorHandle>(null);
  const [preview, setPreview] = useState<{ title: string; content: string } | null>(null);

  function showHTML() {
    setPreview({
      title: 'HTML Output',
      content: editorRef.current?.getHTML() ?? '',
    });
  }

  function showJSON() {
    setPreview({
      title: 'JSON Output',
      content: JSON.stringify(editorRef.current?.getJSON() ?? {}, null, 2),
    });
  }

  function handleSave() {
    const html = editorRef.current?.getHTML();
    const json = editorRef.current?.getJSON();
    console.log('HTML para enviar por email:', html);
    console.log('JSON para salvar no banco:', json);
    alert('Email salvo! Veja o console para o output.');
  }

  function handleTemplate(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value;
    if (id) editorRef.current?.loadTemplate(id);
  }

  return (
    <div style={styles.app}>
      {/* Header */}
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>
          Email Editor <span style={styles.headerBadge}>React Example</span>
        </h1>
        <div style={styles.headerActions}>
          <button style={styles.headerBtn} onClick={showHTML}>
            Ver HTML
          </button>
          <button style={styles.headerBtn} onClick={showJSON}>
            JSON
          </button>
          <select style={styles.headerBtn} onChange={handleTemplate} defaultValue="">
            <option value="">Template...</option>
            <option value="blank">Em Branco</option>
            <option value="newsletter">Newsletter</option>
            <option value="promotional">Promocional</option>
            <option value="welcome">Boas-vindas</option>
          </select>
          <button style={{ ...styles.headerBtn, background: 'rgba(255,255,255,0.2)' }} onClick={handleSave}>
            Salvar
          </button>
        </div>
      </header>

      {/* Editor */}
      <EmailEditor
        ref={editorRef}
        height="calc(100vh - 56px)"
        tags={['nome', 'email', 'empresa', 'produto', 'preco']}
        onChange={(html) => {
          // html atualizado a cada mudanca
        }}
        onReady={(editor) => {
          console.log('Editor pronto!', editor);
        }}
      />

      {/* Preview Modal */}
      {preview && (
        <PreviewModal
          title={preview.title}
          content={preview.content}
          onClose={() => setPreview(null)}
        />
      )}
    </div>
  );
}

// ============================================
// Styles
// ============================================
const styles: Record<string, React.CSSProperties> = {
  app: {
    minHeight: '100vh',
    background: '#f0f2f5',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    height: 56,
    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
    color: 'white',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
  },
  headerBadge: {
    fontWeight: 400,
    opacity: 0.7,
    marginLeft: 8,
    fontSize: 13,
  },
  headerActions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  headerBtn: {
    padding: '7px 16px',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 6,
    background: 'rgba(255,255,255,0.1)',
    color: 'white',
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    backdropFilter: 'blur(6px)',
    zIndex: 10000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 24px 80px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: 1100,
    height: '80vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: '1px solid #e4e7ec',
    background: '#f8f9fb',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: 600,
    margin: 0,
  },
  modalActions: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
  },
  btnCopy: {
    padding: '5px 12px',
    border: '1.5px solid #e4e7ec',
    borderRadius: 6,
    background: '#fff',
    color: '#374151',
    fontSize: 12,
    fontWeight: 500,
    fontFamily: 'inherit',
    cursor: 'pointer',
  },
  btnCopied: {
    borderColor: '#10b981',
    color: '#10b981',
    background: '#ecfdf5',
  },
  btnClose: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    borderRadius: 8,
    background: 'transparent',
    fontSize: 22,
    color: '#9ca3af',
    cursor: 'pointer',
  },
  code: {
    flex: 1,
    overflow: 'auto',
    margin: 0,
    padding: 24,
    fontSize: 13,
    lineHeight: 1.7,
    fontFamily: "'SF Mono', 'Fira Code', monospace",
    background: '#0f172a',
    color: '#e2e8f0',
  },
};

export default EmailEditor;
