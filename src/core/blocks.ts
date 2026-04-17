import type { Editor } from 'grapesjs';

const blockIcons = {
  text: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3M9 20h6M12 4v16"/></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
  button: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="10" rx="4"/><path d="M8 12h8"/></svg>`,
  divider: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/></svg>`,
  column1: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>`,
  column2: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/></svg>`,
  column3: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>`,
  social: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
  spacer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="3" x2="12" y2="9"/><polyline points="8 7 12 3 16 7"/><line x1="12" y1="21" x2="12" y2="15"/><polyline points="8 17 12 21 16 17"/></svg>`,
  hero: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="9" x2="17" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/></svg>`,
};

export function registerBlocks(editor: Editor): void {
  const bm = editor.BlockManager;

  bm.add('mj-1-column', {
    label: '1 Coluna',
    media: blockIcons.column1,
    category: 'Layout',
    content: `<mj-section><mj-column><mj-text>Insira seu texto aqui</mj-text></mj-column></mj-section>`,
  });

  bm.add('mj-2-columns', {
    label: '2 Colunas',
    media: blockIcons.column2,
    category: 'Layout',
    content: `<mj-section><mj-column><mj-text>Coluna 1</mj-text></mj-column><mj-column><mj-text>Coluna 2</mj-text></mj-column></mj-section>`,
  });

  bm.add('mj-3-columns', {
    label: '3 Colunas',
    media: blockIcons.column3,
    category: 'Layout',
    content: `<mj-section><mj-column><mj-text>Col 1</mj-text></mj-column><mj-column><mj-text>Col 2</mj-text></mj-column><mj-column><mj-text>Col 3</mj-text></mj-column></mj-section>`,
  });

  bm.add('mj-text', {
    label: 'Texto',
    media: blockIcons.text,
    category: 'Conteúdo',
    content: `<mj-section><mj-column><mj-text><p>Digite seu texto aqui. Você pode <b>formatar</b> e <i>estilizar</i> como quiser.</p></mj-text></mj-column></mj-section>`,
  });

  bm.add('mj-image', {
    label: 'Imagem',
    media: blockIcons.image,
    category: 'Conteúdo',
    content: `<mj-section><mj-column><mj-image src="https://via.placeholder.com/600x300/e3f2fd/1976d2?text=Sua+Imagem" alt="imagem" padding="10px"></mj-image></mj-column></mj-section>`,
  });

  bm.add('mj-button', {
    label: 'Botao',
    media: blockIcons.button,
    category: 'Conteúdo',
    content: `<mj-section><mj-column><mj-button font-family="Helvetica" background-color="#1976d2" color="white" border-radius="4px" href="#">Clique Aqui</mj-button></mj-column></mj-section>`,
  });

  bm.add('mj-divider', {
    label: 'Divisor',
    media: blockIcons.divider,
    category: 'Conteúdo',
    content: `<mj-section><mj-column><mj-divider border-color="#e0e0e0" border-width="1px"></mj-divider></mj-column></mj-section>`,
  });

  bm.add('mj-social', {
    label: 'Social',
    media: blockIcons.social,
    category: 'Conteúdo',
    content: `<mj-section><mj-column><mj-social font-size="12px" icon-size="24px" mode="horizontal"><mj-social-element name="facebook" href="https://facebook.com">Facebook</mj-social-element><mj-social-element name="twitter" href="https://twitter.com">Twitter</mj-social-element><mj-social-element name="instagram" href="https://instagram.com">Instagram</mj-social-element></mj-social></mj-column></mj-section>`,
  });

  bm.add('mj-spacer', {
    label: 'Espacador',
    media: blockIcons.spacer,
    category: 'Conteúdo',
    content: `<mj-section><mj-column><mj-spacer height="30px"></mj-spacer></mj-column></mj-section>`,
  });

  bm.add('mj-hero', {
    label: 'Hero',
    media: blockIcons.hero,
    category: 'Layout',
    content: `<mj-section background-color="#1976d2" padding="40px 20px"><mj-column><mj-text color="#ffffff" font-size="28px" font-weight="bold" align="center">Titulo Principal</mj-text><mj-text color="#ffffff" font-size="16px" align="center">Subtitulo ou descricao do seu email</mj-text><mj-button background-color="#ffffff" color="#1976d2" border-radius="4px" href="#">Saiba Mais</mj-button></mj-column></mj-section>`,
  });
}
