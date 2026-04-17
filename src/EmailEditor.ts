import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjsMjml from 'grapesjs-mjml';

import { EmailEditorOptions, EmailTemplate, defaultMjmlContent, getGrapesJSConfig } from './core/config';
import { registerBlocks } from './core/blocks';
import { editorStyles } from './core/styles';
import { defaultTemplates } from './core/templates';

let styleInjected = false;

function injectStyles(): void {
  if (styleInjected) return;
  const style = document.createElement('style');
  style.id = 'email-editor-styles';
  style.textContent = editorStyles;
  document.head.appendChild(style);
  styleInjected = true;
}

class EmailEditor {
  private editor: Editor | null = null;
  private textarea: HTMLTextAreaElement | null = null;
  private wrapper: HTMLDivElement | null = null;
  private options: EmailEditorOptions;
  private instanceId: string;
  private destroyed = false;
  private tagDropdown: HTMLDivElement | null = null;
  private tagActiveIndex = 0;
  private tagFilterText = '';
  private tagRange: Range | null = null;

  constructor(options: EmailEditorOptions) {
    this.options = options;
    this.instanceId = 'ee-' + Math.random().toString(36).substring(2, 9);
    this.init();
  }

  private async init(): Promise<void> {
    injectStyles();
    this.resolveTextarea();
    this.buildDOM();
    this.initGrapesJS();
    this.loadInitialContent();
    this.bindEvents();
    this.setupTagAutocomplete();

    // Highlight existing tags in content after iframe renders
    if (this.options.tags && this.options.tags.length > 0) {
      setTimeout(() => this.highlightExistingTags(), 800);
    }

    if (this.options.onReady) {
      this.options.onReady(this);
    }
  }

  private resolveTextarea(): void {
    if (typeof this.options.target === 'string') {
      const el = document.querySelector(this.options.target);
      if (!el) throw new Error(`EmailEditor: element "${this.options.target}" not found`);
      if (el.tagName === 'TEXTAREA') {
        this.textarea = el as HTMLTextAreaElement;
      } else {
        // If it's not a textarea, create one hidden
        this.textarea = document.createElement('textarea');
        this.textarea.style.display = 'none';
        this.textarea.name = (el as HTMLElement).dataset.name || 'email_content';
        el.parentNode?.insertBefore(this.textarea, el);
        (el as HTMLElement).style.display = 'none';
      }
    } else {
      this.textarea = this.options.target;
    }
    this.textarea.style.display = 'none';
  }

  private buildDOM(): void {
    this.wrapper = document.createElement('div');
    this.wrapper.id = this.instanceId;
    this.wrapper.className = 'email-editor-wrapper';
    this.wrapper.style.height = this.options.height || '700px';
    if (this.options.width) {
      this.wrapper.style.width = this.options.width;
    }

    // Sidebar
    const sidebar = document.createElement('div');
    sidebar.className = 'email-editor-sidebar';
    sidebar.innerHTML = `
      <div class="email-editor-sidebar-header">Blocos</div>
      <div id="${this.instanceId}-blocks" class="email-editor-blocks"></div>
    `;

    // Canvas area
    const canvas = document.createElement('div');
    canvas.className = 'email-editor-canvas';

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'email-editor-toolbar';
    toolbar.id = `${this.instanceId}-toolbar`;
    toolbar.innerHTML = this.buildToolbarHTML();
    canvas.appendChild(toolbar);

    // GrapesJS container
    const frame = document.createElement('div');
    frame.className = 'email-editor-canvas-frame';
    frame.id = `${this.instanceId}-editor`;
    canvas.appendChild(frame);

    // Properties panel
    const properties = document.createElement('div');
    properties.className = 'email-editor-properties';
    properties.innerHTML = `
      <div class="email-editor-properties-header">Propriedades</div>
      <div id="${this.instanceId}-traits"></div>
      <div id="${this.instanceId}-styles"></div>
    `;

    this.wrapper.appendChild(sidebar);
    this.wrapper.appendChild(canvas);
    this.wrapper.appendChild(properties);

    // Loading overlay
    const loading = document.createElement('div');
    loading.className = 'email-editor-loading';
    loading.id = `${this.instanceId}-loading`;
    loading.innerHTML = '<div class="email-editor-loading-spinner"></div> Carregando editor...';
    this.wrapper.appendChild(loading);

    this.textarea!.parentNode!.insertBefore(this.wrapper, this.textarea!.nextSibling);
  }

  private buildToolbarHTML(): string {
    const icon = (d: string) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
    return `
      <button data-cmd="bold" title="Negrito">${icon('<path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>')}</button>
      <button data-cmd="italic" title="Italico">${icon('<line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>')}</button>
      <button data-cmd="underline" title="Sublinhado">${icon('<path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3"/><line x1="4" y1="21" x2="20" y2="21"/>')}</button>
      <div class="separator"></div>
      <button data-cmd="justifyLeft" title="Alinhar esquerda">${icon('<line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>')}</button>
      <button data-cmd="justifyCenter" title="Centralizar">${icon('<line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/>')}</button>
      <button data-cmd="justifyRight" title="Alinhar direita">${icon('<line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/>')}</button>
      <div class="separator"></div>
      <button data-cmd="createLink" title="Inserir link">${icon('<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>')}</button>
      <div class="separator"></div>
      <button data-cmd="undo" title="Desfazer">${icon('<polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>')}</button>
      <button data-cmd="redo" title="Refazer">${icon('<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.13-9.36L23 10"/>')}</button>
      <div class="separator"></div>
      <button data-cmd="code" title="Ver codigo MJML">${icon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>')}</button>
      <button data-cmd="import" title="Importar MJML">${icon('<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>')}</button>
      <div class="email-editor-devices">
        <button data-device="Desktop" class="active" title="Desktop">${icon('<rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>')}</button>
        <button data-device="Mobile" title="Mobile">${icon('<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>')}</button>
      </div>
    `;
  }

  private initGrapesJS(): void {
    const config = getGrapesJSConfig(`${this.instanceId}-editor`, this.options);

    this.editor = grapesjs.init({
      ...config,
      plugins: [grapesjsMjml],
      pluginsOpts: {
        [grapesjsMjml as any]: {
          // resetStyleManager: false,
        },
      },
      blockManager: {
        appendTo: `#${this.instanceId}-blocks`,
      },
      traitManager: {
        appendTo: `#${this.instanceId}-traits`,
      },
      styleManager: {
        appendTo: `#${this.instanceId}-styles`,
        sectors: [
          {
            name: 'Dimensao',
            open: true,
            buildProps: ['width', 'height', 'min-height', 'padding'],
          },
          {
            name: 'Tipografia',
            open: true,
            buildProps: ['font-family', 'font-size', 'font-weight', 'letter-spacing', 'color', 'line-height', 'text-align'],
          },
          {
            name: 'Fundo',
            open: true,
            buildProps: ['background-color', 'background'],
          },
          {
            name: 'Bordas',
            open: false,
            buildProps: ['border-radius', 'border'],
          },
        ],
      },
    });

    registerBlocks(this.editor);
    this.setupToolbar();

    // Remove loading overlay
    setTimeout(() => {
      const loading = document.getElementById(`${this.instanceId}-loading`);
      if (loading) loading.remove();
    }, 500);
  }

  private setupToolbar(): void {
    if (!this.editor) return;
    const toolbar = document.getElementById(`${this.instanceId}-toolbar`);
    if (!toolbar) return;

    toolbar.addEventListener('click', (e) => {
      const button = (e.target as HTMLElement).closest('button');
      if (!button) return;

      const cmd = button.dataset.cmd;
      const device = button.dataset.device;

      if (device && this.editor) {
        this.editor.setDevice(device);
        toolbar.querySelectorAll('.email-editor-devices button').forEach((b) =>
          b.classList.remove('active'),
        );
        button.classList.add('active');
        return;
      }

      if (!cmd || !this.editor) return;

      switch (cmd) {
        case 'undo':
          this.editor.UndoManager.undo();
          break;
        case 'redo':
          this.editor.UndoManager.redo();
          break;
        case 'code':
          this.toggleCodeView();
          break;
        case 'import':
          this.showImportDialog();
          break;
        default:
          // Rich text commands - execute on iframe document
          const iframe = this.wrapper?.querySelector('iframe');
          if (iframe?.contentDocument) {
            if (cmd === 'createLink') {
              const url = prompt('Insira a URL:');
              if (url) iframe.contentDocument.execCommand(cmd, false, url);
            } else {
              iframe.contentDocument.execCommand(cmd, false);
            }
          }
          break;
      }
    });
  }

  private toggleCodeView(): void {
    if (!this.editor) return;

    const mjml = this.getMJML();
    const code = prompt('Editar codigo MJML:\n(Cole o MJML e clique OK)', mjml);
    if (code && code !== mjml) {
      this.setContent(code);
    }
  }

  private showImportDialog(): void {
    if (!this.editor) return;

    const mjml = prompt('Cole o codigo MJML para importar:');
    if (mjml) {
      this.setContent(mjml);
    }
  }

  private loadInitialContent(): void {
    if (!this.editor || !this.textarea) return;

    const existingContent = this.textarea.value.trim();

    if (existingContent) {
      // Try to detect if it's MJML or HTML
      if (existingContent.includes('<mjml') || existingContent.includes('<mj-')) {
        this.setMJMLContent(existingContent);
      } else if (existingContent.includes('<')) {
        // It's HTML - wrap in basic MJML structure
        const mjml = `<mjml><mj-body><mj-section><mj-column><mj-text>${existingContent}</mj-text></mj-column></mj-section></mj-body></mjml>`;
        this.setMJMLContent(mjml);
      } else {
        this.setMJMLContent(defaultMjmlContent);
      }
    } else {
      this.setMJMLContent(defaultMjmlContent);
    }
  }

  private setMJMLContent(mjml: string): void {
    if (!this.editor) return;

    // Clean up MJML to ensure proper structure
    let content = mjml.trim();
    if (!content.startsWith('<mjml')) {
      content = `<mjml><mj-body>${content}</mj-body></mjml>`;
    }

    // Use the editor's component system to load MJML
    const components = this.editor.getComponents();
    components.reset();

    try {
      this.editor.setComponents(content);
    } catch (e) {
      console.warn('EmailEditor: Failed to parse content, loading default', e);
      this.editor.setComponents(defaultMjmlContent);
    }
  }

  private bindEvents(): void {
    if (!this.editor) return;

    // Sync to textarea on changes
    this.editor.on('update', () => this.syncToTextarea());
    this.editor.on('component:update', () => this.syncToTextarea());
    this.editor.on('component:add', () => this.syncToTextarea());
    this.editor.on('component:remove', () => this.syncToTextarea());

    // Handle form submission
    if (this.textarea?.form) {
      this.textarea.form.addEventListener('submit', () => {
        this.syncToTextarea();
      });
    }
  }

  private syncToTextarea(): void {
    if (this.destroyed || !this.textarea || !this.editor) return;

    try {
      const html = this.getHTML();
      this.textarea.value = html;

      if (this.options.onChange) {
        this.options.onChange(html);
      }
    } catch (e) {
      // Silently fail during component updates
    }
  }

  // ===== Tag Autocomplete =====

  private setupTagAutocomplete(): void {
    const tags = this.options.tags;
    if (!tags || tags.length === 0) return;

    // Wait for iframe to be ready, then attach listeners
    const checkIframe = () => {
      const iframe = this.wrapper?.querySelector('iframe');
      if (!iframe?.contentDocument) {
        setTimeout(checkIframe, 300);
        return;
      }

      const iframeDoc = iframe.contentDocument;

      // Inject tag badge styles into iframe
      this.injectTagStyles(iframeDoc);

      iframeDoc.addEventListener('keydown', (e: KeyboardEvent) => this.handleTagKeydown(e));
      iframeDoc.addEventListener('input', () => this.handleTagInput(iframeDoc));
      iframeDoc.addEventListener('click', () => this.hideTagDropdown());

      // Also close dropdown when clicking outside
      document.addEventListener('click', () => this.hideTagDropdown());
    };

    setTimeout(checkIframe, 500);
  }

  private injectTagStyles(doc: Document): void {
    if (doc.getElementById('ee-tag-badge-styles')) return;
    const style = doc.createElement('style');
    style.id = 'ee-tag-badge-styles';
    style.textContent = `
      .ee-tag-badge {
        display: inline-flex;
        align-items: center;
        gap: 3px;
        background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
        border: 1.5px solid #c7d2fe;
        color: #4338ca;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 0.9em;
        font-weight: 600;
        padding: 1px 8px;
        border-radius: 4px;
        cursor: default;
        user-select: all;
        white-space: nowrap;
        line-height: 1.6;
        letter-spacing: 0.01em;
        vertical-align: baseline;
        transition: border-color 0.15s, box-shadow 0.15s;
      }
      .ee-tag-badge:hover {
        border-color: #818cf8;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.12);
      }
      .ee-tag-badge::before {
        content: '';
        display: inline-block;
        width: 6px;
        height: 6px;
        background: #6366f1;
        border-radius: 50%;
        flex-shrink: 0;
      }
    `;
    doc.head.appendChild(style);
  }

  private handleTagInput(doc: Document): void {
    const tags = this.options.tags;
    if (!tags || tags.length === 0) return;

    const sel = doc.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    const range = sel.getRangeAt(0);
    const node = range.startContainer;
    if (node.nodeType !== Node.TEXT_NODE) {
      this.hideTagDropdown();
      return;
    }

    const text = node.textContent || '';
    const cursorPos = range.startOffset;

    // Find the last '{' before cursor
    const beforeCursor = text.substring(0, cursorPos);
    const braceIdx = beforeCursor.lastIndexOf('{');

    if (braceIdx === -1) {
      this.hideTagDropdown();
      return;
    }

    // Check there's no '}' between '{' and cursor
    const afterBrace = beforeCursor.substring(braceIdx + 1);
    if (afterBrace.includes('}')) {
      this.hideTagDropdown();
      return;
    }

    this.tagFilterText = afterBrace.toLowerCase();
    this.tagRange = range.cloneRange();
    this.tagRange.setStart(node, braceIdx);

    const filtered = tags.filter((t) =>
      t.toLowerCase().includes(this.tagFilterText),
    );

    if (filtered.length === 0) {
      this.hideTagDropdown();
      return;
    }

    this.tagActiveIndex = 0;
    this.showTagDropdown(filtered, range);
  }

  private handleTagKeydown(e: KeyboardEvent): void {
    if (!this.tagDropdown) return;

    const items = this.tagDropdown.querySelectorAll('.ee-tag-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.tagActiveIndex = (this.tagActiveIndex + 1) % items.length;
      this.updateTagActiveItem(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.tagActiveIndex = (this.tagActiveIndex - 1 + items.length) % items.length;
      this.updateTagActiveItem(items);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      if (this.tagDropdown) {
        e.preventDefault();
        const activeItem = items[this.tagActiveIndex] as HTMLElement;
        if (activeItem) {
          const tagName = activeItem.dataset.tag;
          if (tagName) this.insertTag(tagName);
        }
      }
    } else if (e.key === 'Escape') {
      this.hideTagDropdown();
    }
  }

  private showTagDropdown(filteredTags: string[], range: Range): void {
    if (!this.tagDropdown) {
      this.tagDropdown = document.createElement('div');
      this.tagDropdown.className = 'ee-tag-autocomplete';
      document.body.appendChild(this.tagDropdown);
    }

    // Position near the cursor
    const iframe = this.wrapper?.querySelector('iframe');
    if (!iframe) return;

    const iframeRect = iframe.getBoundingClientRect();
    const rangeRect = range.getBoundingClientRect();

    const top = iframeRect.top + rangeRect.bottom + 4;
    const left = iframeRect.left + rangeRect.left;

    this.tagDropdown.style.top = `${top}px`;
    this.tagDropdown.style.left = `${left}px`;

    this.tagDropdown.innerHTML = `
      <div class="ee-tag-autocomplete-header">Variaveis</div>
      ${filteredTags
        .map(
          (tag, i) => `
        <div class="ee-tag-item${i === this.tagActiveIndex ? ' active' : ''}" data-tag="${tag}" data-index="${i}">
          <span class="ee-tag-item-icon">{}</span>
          <span class="ee-tag-item-name">${tag}</span>
          <span class="ee-tag-item-preview">{${tag}}</span>
        </div>`,
        )
        .join('')}
    `;

    // Click handler for items
    this.tagDropdown.querySelectorAll('.ee-tag-item').forEach((item) => {
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const tagName = (item as HTMLElement).dataset.tag;
        if (tagName) this.insertTag(tagName);
      });
      item.addEventListener('mouseenter', () => {
        const idx = parseInt((item as HTMLElement).dataset.index || '0', 10);
        this.tagActiveIndex = idx;
        this.updateTagActiveItem(this.tagDropdown!.querySelectorAll('.ee-tag-item'));
      });
    });
  }

  private updateTagActiveItem(items: NodeListOf<Element>): void {
    items.forEach((item, i) => {
      item.classList.toggle('active', i === this.tagActiveIndex);
    });
  }

  private insertTag(tagName: string): void {
    if (!this.tagRange) return;

    const iframe = this.wrapper?.querySelector('iframe');
    if (!iframe?.contentDocument) return;

    const doc = iframe.contentDocument;
    const sel = doc.getSelection();
    if (!sel) return;

    // Delete the "{filterText" part
    this.tagRange.deleteContents();

    // Create the badge span
    const badge = doc.createElement('span');
    badge.className = 'ee-tag-badge';
    badge.contentEditable = 'false';
    badge.dataset.eeTag = tagName;
    badge.textContent = `{${tagName}}`;

    // Create a clean span after the badge to break style inheritance
    const after = doc.createElement('span');
    after.style.cssText = 'font-weight:normal;font-style:normal;color:inherit;background:none;border:none;padding:0;margin:0;display:inline;';
    after.textContent = '\u00A0';

    // Insert badge then the clean span
    this.tagRange.insertNode(badge);
    badge.parentNode?.insertBefore(after, badge.nextSibling);

    // Move cursor inside the clean span (after the space)
    const newRange = doc.createRange();
    newRange.setStart(after.firstChild!, 1);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);

    this.hideTagDropdown();
  }

  private hideTagDropdown(): void {
    if (this.tagDropdown) {
      this.tagDropdown.remove();
      this.tagDropdown = null;
    }
    this.tagRange = null;
    this.tagFilterText = '';
  }

  // ===== Public API =====

  /**
   * Returns the email-compatible HTML output
   */
  getHTML(): string {
    if (!this.editor) return '';

    let result = '';
    try {
      // grapesjs-mjml registers 'mjml-code-to-html' to compile MJML → HTML
      const output = this.editor.runCommand('mjml-code-to-html');
      if (typeof output === 'string') {
        result = output;
      } else if (output && output.html) {
        result = output.html;
      }
    } catch (e) {
      // fallback
    }

    if (!result) result = this.editor.getHtml();

    return this.cleanTagBadges(result);
  }

  private highlightExistingTags(): void {
    const tags = this.options.tags;
    if (!tags || tags.length === 0) return;

    const iframe = this.wrapper?.querySelector('iframe');
    if (!iframe?.contentDocument) return;

    const doc = iframe.contentDocument;
    this.injectTagStyles(doc);

    // Build regex to match {tagName} for known tags
    const tagPattern = new RegExp(
      `\\{(${tags.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\}`,
      'g',
    );

    const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
    const textNodes: Text[] = [];
    let node: Text | null;
    while ((node = walker.nextNode() as Text | null)) {
      if (node.textContent && tagPattern.test(node.textContent)) {
        textNodes.push(node);
      }
      tagPattern.lastIndex = 0;
    }

    for (const textNode of textNodes) {
      const text = textNode.textContent || '';
      const frag = doc.createDocumentFragment();
      let lastIdx = 0;
      let match: RegExpExecArray | null;

      tagPattern.lastIndex = 0;
      while ((match = tagPattern.exec(text)) !== null) {
        // Text before the match
        if (match.index > lastIdx) {
          frag.appendChild(doc.createTextNode(text.substring(lastIdx, match.index)));
        }
        // Create badge
        const badge = doc.createElement('span');
        badge.className = 'ee-tag-badge';
        badge.contentEditable = 'false';
        badge.dataset.eeTag = match[1];
        badge.textContent = match[0];
        frag.appendChild(badge);
        lastIdx = match.index + match[0].length;
      }
      // Remaining text
      if (lastIdx < text.length) {
        frag.appendChild(doc.createTextNode(text.substring(lastIdx)));
      }
      textNode.parentNode?.replaceChild(frag, textNode);
    }
  }

  private cleanTagBadges(html: string): string {
    // Replace <span class="ee-tag-badge" ...>{tagName}</span> with {tagName}
    return html.replace(
      /<span[^>]*class="ee-tag-badge"[^>]*data-ee-tag="([^"]*)"[^>]*>[^<]*<\/span>/gi,
      (_match, tagName) => `{${tagName}}`,
    ).replace(
      // Fallback: catch any remaining ee-tag-badge spans by content
      /<span[^>]*class="ee-tag-badge"[^>]*>\{([^}]+)\}<\/span>/gi,
      (_match, tagName) => `{${tagName}}`,
    );
  }

  /**
   * Returns the MJML source
   */
  getMJML(): string {
    if (!this.editor) return '';

    let result = '';
    try {
      // grapesjs-mjml registers 'mjml-code' to get the MJML source
      const output = this.editor.runCommand('mjml-code');
      if (typeof output === 'string') result = output;
    } catch (e) {
      // fallback
    }

    if (!result) result = this.editor.getHtml();

    return this.cleanTagBadges(result);
  }

  /**
   * Returns the editor state as JSON
   */
  getJSON(): object {
    if (!this.editor) return {};
    return {
      mjml: this.getMJML(),
      components: JSON.parse(JSON.stringify(this.editor.getComponents())),
      styles: JSON.parse(JSON.stringify(this.editor.getStyle())),
    };
  }

  /**
   * Set editor content from HTML, MJML string, or JSON
   */
  setContent(content: string | object): void {
    if (!this.editor) return;

    if (typeof content === 'object') {
      const json = content as any;
      if (json.mjml) {
        this.setMJMLContent(json.mjml);
      } else if (json.components) {
        this.editor.setComponents(json.components);
        if (json.styles) this.editor.setStyle(json.styles);
      }
    } else {
      this.setMJMLContent(content);
    }

    this.syncToTextarea();

    // Re-highlight tags in new content
    if (this.options.tags && this.options.tags.length > 0) {
      setTimeout(() => this.highlightExistingTags(), 500);
    }
  }

  /**
   * Load a template
   */
  loadTemplate(templateId: string): void {
    const templates = this.options.templates || defaultTemplates;
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      this.setContent(template.mjml);
    } else {
      console.warn(`EmailEditor: template "${templateId}" not found`);
    }
  }

  /**
   * Get available templates
   */
  getTemplates(): EmailTemplate[] {
    return this.options.templates || defaultTemplates;
  }

  /**
   * Get the underlying GrapesJS editor instance
   */
  getEditor(): Editor | null {
    return this.editor;
  }

  /**
   * Set device preview (Desktop/Mobile)
   */
  setDevice(device: 'Desktop' | 'Mobile'): void {
    if (!this.editor) return;
    this.editor.setDevice(device);

    const toolbar = document.getElementById(`${this.instanceId}-toolbar`);
    if (toolbar) {
      toolbar.querySelectorAll('.email-editor-devices button').forEach((b) => {
        b.classList.toggle('active', b.getAttribute('data-device') === device);
      });
    }
  }

  /**
   * Destroy the editor and restore the textarea
   */
  destroy(): void {
    this.destroyed = true;
    this.hideTagDropdown();

    if (this.editor) {
      this.editor.destroy();
      this.editor = null;
    }

    if (this.wrapper) {
      this.wrapper.remove();
      this.wrapper = null;
    }

    if (this.textarea) {
      this.textarea.style.display = '';
    }
  }
}

// Named exports only (avoids UMD mixed export warning)
export { EmailEditor, defaultTemplates };
export type { EmailEditorOptions, EmailTemplate };

// UMD global
if (typeof window !== 'undefined') {
  (window as any).EmailEditor = EmailEditor;
}
