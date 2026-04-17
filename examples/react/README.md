# React Example

## Setup

```bash
# Criar projeto React (se nao tiver um)
npx create-react-app my-app --template typescript
cd my-app

# Instalar o Email Editor
npm install email-editor

# Copiar os arquivos deste exemplo
cp EmailEditor.tsx src/components/
```

## Uso basico

```tsx
import EmailEditor from './components/EmailEditor';
import type { EmailEditorHandle } from './components/EmailEditor';

function App() {
  const editorRef = useRef<EmailEditorHandle>(null);

  return (
    <EmailEditor
      ref={editorRef}
      height="700px"
      tags={['nome', 'email', 'produto']}
      onChange={(html) => console.log(html)}
    />
  );
}
```

## Com preview e save

Veja `EmailEditor.tsx` — ele inclui o componente `EmailEditorDemo` que demonstra:

- Toolbar com botoes de HTML/JSON/Template/Salvar
- Modal de preview com botao copiar
- Tags de variaveis configuradas
- Callbacks de onChange e onReady

```tsx
import { EmailEditorDemo } from './components/EmailEditor';

function App() {
  return <EmailEditorDemo />;
}
```

## Next.js

Para Next.js, use dynamic import sem SSR:

```tsx
import dynamic from 'next/dynamic';

const EmailEditor = dynamic(
  () => import('./components/EmailEditor'),
  { ssr: false }
);
```
