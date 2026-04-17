export const editorStyles = `
  /* ============================================
     Email Editor — Modern UI
     Clean, glassmorphism-inspired design
     ============================================ */

  :root {
    --ee-font: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --ee-bg: #f0f2f5;
    --ee-surface: #ffffff;
    --ee-surface-hover: #f8f9fb;
    --ee-surface-active: #f0f4ff;
    --ee-border: #e4e7ec;
    --ee-border-light: #eef0f4;
    --ee-text: #1a1d23;
    --ee-text-secondary: #6b7280;
    --ee-text-muted: #9ca3af;
    --ee-primary: #4f46e5;
    --ee-primary-light: #eef2ff;
    --ee-primary-hover: #4338ca;
    --ee-accent: #06b6d4;
    --ee-radius: 10px;
    --ee-radius-sm: 6px;
    --ee-radius-xs: 4px;
    --ee-shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
    --ee-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --ee-shadow-md: 0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04);
    --ee-shadow-lg: 0 10px 30px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);
    --ee-transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .email-editor-wrapper {
    position: relative;
    display: flex;
    height: 100%;
    width: 100%;
    font-family: var(--ee-font);
    background: var(--ee-bg);
    border: 1px solid var(--ee-border);
    border-radius: var(--ee-radius);
    overflow: hidden;
    box-shadow: var(--ee-shadow-lg);
  }

  /* ============================================
     Sidebar — Block Panel
     ============================================ */

  .email-editor-sidebar {
    width: 252px;
    min-width: 252px;
    background: var(--ee-surface);
    border-right: 1px solid var(--ee-border);
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .email-editor-sidebar::-webkit-scrollbar {
    width: 5px;
  }

  .email-editor-sidebar::-webkit-scrollbar-track {
    background: transparent;
  }

  .email-editor-sidebar::-webkit-scrollbar-thumb {
    background: var(--ee-border);
    border-radius: 10px;
  }

  .email-editor-sidebar-header {
    position: sticky;
    top: 0;
    z-index: 2;
    padding: 16px 20px;
    font-size: 11px;
    font-weight: 700;
    color: var(--ee-text-muted);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    border-bottom: 1px solid var(--ee-border-light);
    background: var(--ee-surface);
    backdrop-filter: blur(12px);
  }

  .email-editor-blocks {
    padding: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  /* ============================================
     Canvas — Main Editing Area
     ============================================ */

  .email-editor-canvas {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--ee-bg);
  }

  /* ============================================
     Toolbar
     ============================================ */

  .email-editor-toolbar {
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 8px 16px;
    background: var(--ee-surface);
    border-bottom: 1px solid var(--ee-border);
    flex-wrap: wrap;
    min-height: 48px;
  }

  .email-editor-toolbar button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border: none;
    border-radius: var(--ee-radius-sm);
    background: transparent;
    cursor: pointer;
    color: var(--ee-text-secondary);
    font-size: 14px;
    transition: all var(--ee-transition);
    position: relative;
  }

  .email-editor-toolbar button:hover {
    background: var(--ee-surface-hover);
    color: var(--ee-text);
  }

  .email-editor-toolbar button:active {
    transform: scale(0.95);
  }

  .email-editor-toolbar button.active {
    background: var(--ee-primary-light);
    color: var(--ee-primary);
  }

  .email-editor-toolbar button svg {
    width: 18px;
    height: 18px;
    stroke-width: 2;
    pointer-events: none;
  }

  .email-editor-toolbar .separator {
    width: 1px;
    height: 20px;
    background: var(--ee-border-light);
    margin: 0 6px;
    flex-shrink: 0;
  }

  .email-editor-canvas-frame {
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  /* ============================================
     Properties Panel
     ============================================ */

  .email-editor-properties {
    width: 272px;
    min-width: 272px;
    background: var(--ee-surface);
    border-left: 1px solid var(--ee-border);
    overflow-y: auto;
  }

  .email-editor-properties::-webkit-scrollbar {
    width: 5px;
  }

  .email-editor-properties::-webkit-scrollbar-track {
    background: transparent;
  }

  .email-editor-properties::-webkit-scrollbar-thumb {
    background: var(--ee-border);
    border-radius: 10px;
  }

  .email-editor-properties-header {
    position: sticky;
    top: 0;
    z-index: 2;
    padding: 16px 20px;
    font-size: 11px;
    font-weight: 700;
    color: var(--ee-text-muted);
    text-transform: uppercase;
    letter-spacing: 1.2px;
    border-bottom: 1px solid var(--ee-border-light);
    background: var(--ee-surface);
    backdrop-filter: blur(12px);
  }

  /* ============================================
     Device Toggle — Desktop / Mobile
     ============================================ */

  .email-editor-devices {
    display: flex;
    gap: 2px;
    margin-left: auto;
    background: var(--ee-bg);
    padding: 3px;
    border-radius: var(--ee-radius-sm);
  }

  .email-editor-devices button {
    padding: 5px 14px;
    width: auto;
    font-size: 12px;
    font-weight: 500;
    border-radius: var(--ee-radius-xs);
    color: var(--ee-text-muted);
  }

  .email-editor-devices button.active {
    background: var(--ee-surface);
    color: var(--ee-primary);
    box-shadow: var(--ee-shadow-sm);
  }

  .email-editor-devices button:hover:not(.active) {
    color: var(--ee-text-secondary);
    background: transparent;
  }

  /* ============================================
     GrapesJS Theme Overrides
     ============================================ */

  .email-editor-wrapper .gjs-one-bg {
    background-color: var(--ee-surface);
  }

  .email-editor-wrapper .gjs-two-color {
    color: var(--ee-text);
  }

  .email-editor-wrapper .gjs-three-bg {
    background-color: var(--ee-bg);
  }

  .email-editor-wrapper .gjs-four-color,
  .email-editor-wrapper .gjs-four-color-h:hover {
    color: var(--ee-primary);
  }

  /* Blocks */
  .email-editor-wrapper .gjs-block {
    width: calc(50% - 4px);
    min-height: 68px;
    margin: 0;
    padding: 10px 6px;
    border: 1.5px solid var(--ee-border-light);
    border-radius: var(--ee-radius);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: grab;
    transition: all var(--ee-transition);
    background: var(--ee-surface);
    font-size: 11px;
    font-weight: 500;
    color: var(--ee-text-secondary);
    gap: 6px;
    box-shadow: var(--ee-shadow-sm);
  }

  .email-editor-wrapper .gjs-block:hover {
    border-color: var(--ee-primary);
    background: var(--ee-primary-light);
    color: var(--ee-primary);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.08);
    transform: translateY(-1px);
  }

  .email-editor-wrapper .gjs-block:active {
    transform: translateY(0) scale(0.98);
  }

  .email-editor-wrapper .gjs-block svg {
    width: 22px;
    height: 22px;
    opacity: 0.7;
  }

  .email-editor-wrapper .gjs-block:hover svg {
    opacity: 1;
  }

  .email-editor-wrapper .gjs-block__media {
    margin-bottom: 0;
  }

  /* Block category */
  .email-editor-wrapper .gjs-block-category {
    border-bottom: none;
  }

  .email-editor-wrapper .gjs-block-category .gjs-title {
    padding: 10px 8px;
    font-size: 10px;
    font-weight: 700;
    color: var(--ee-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    background: transparent;
    border: none;
  }

  .email-editor-wrapper .gjs-block-category .gjs-caret-icon {
    color: var(--ee-text-muted);
  }

  .email-editor-wrapper .gjs-blocks-c {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 0 4px 8px;
  }

  /* Canvas */
  .email-editor-wrapper .gjs-cv-canvas {
    background: var(--ee-bg);
    top: 0;
    width: 100%;
    height: 100%;
  }

  .email-editor-wrapper .gjs-frame-wrapper {
    padding: 24px;
  }

  .email-editor-wrapper .gjs-frame {
    background: var(--ee-surface);
    box-shadow: var(--ee-shadow-md);
    border-radius: var(--ee-radius);
  }

  /* Panels */
  .email-editor-wrapper .gjs-pn-panel {
    position: relative;
    padding: 0;
  }

  .email-editor-wrapper .gjs-pn-views-container,
  .email-editor-wrapper .gjs-pn-views {
    display: none;
  }

  /* Style Manager Sectors */
  .email-editor-wrapper .gjs-sm-sector {
    border-bottom: 1px solid var(--ee-border-light);
  }

  .email-editor-wrapper .gjs-sm-sector .gjs-sm-sector-title {
    padding: 12px 16px;
    font-size: 11px;
    font-weight: 700;
    color: var(--ee-text);
    text-transform: uppercase;
    letter-spacing: 0.6px;
    background: var(--ee-surface-hover);
    border-bottom: 1px solid var(--ee-border-light);
    transition: all var(--ee-transition);
  }

  .email-editor-wrapper .gjs-sm-sector .gjs-sm-sector-title:hover {
    background: var(--ee-surface-active);
  }

  .email-editor-wrapper .gjs-sm-sector .gjs-sm-properties {
    padding: 12px 16px;
  }

  .email-editor-wrapper .gjs-sm-sector-title::before {
    display: none;
  }

  .email-editor-wrapper .gjs-sm-sector .gjs-sm-sector-caret {
    margin-right: 8px;
    transition: transform var(--ee-transition);
  }

  /* Traits */
  .email-editor-wrapper .gjs-trt-traits {
    padding: 12px 16px;
  }

  .email-editor-wrapper .gjs-trt-trait {
    margin-bottom: 10px;
  }

  .email-editor-wrapper .gjs-trt-trait .gjs-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--ee-text-secondary);
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }

  /* Form Fields */
  .email-editor-wrapper .gjs-field {
    background: var(--ee-bg);
    border: 1.5px solid var(--ee-border);
    border-radius: var(--ee-radius-sm);
    padding: 7px 10px;
    font-size: 13px;
    color: var(--ee-text);
    transition: all var(--ee-transition);
  }

  .email-editor-wrapper .gjs-field:focus-within {
    border-color: var(--ee-primary);
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    background: var(--ee-surface);
  }

  .email-editor-wrapper .gjs-field input,
  .email-editor-wrapper .gjs-field select,
  .email-editor-wrapper .gjs-field textarea {
    font-family: var(--ee-font);
    color: var(--ee-text);
  }

  .email-editor-wrapper .gjs-field-arrow-u,
  .email-editor-wrapper .gjs-field-arrow-d {
    border-top-color: var(--ee-text-muted);
    border-bottom-color: var(--ee-text-muted);
  }

  .email-editor-wrapper .gjs-clm-tags {
    padding: 12px 16px;
  }

  /* Selected component highlight */
  .email-editor-wrapper .gjs-selected {
    outline: 2px solid var(--ee-primary) !important;
    outline-offset: -2px;
  }

  .email-editor-wrapper .gjs-comp-selected {
    outline: 2px solid var(--ee-primary) !important;
  }

  /* Toolbar floating on selected component */
  .email-editor-wrapper .gjs-toolbar {
    background: var(--ee-text);
    border-radius: var(--ee-radius-sm);
    padding: 2px;
    box-shadow: var(--ee-shadow-md);
    border: none;
  }

  .email-editor-wrapper .gjs-toolbar-item {
    padding: 4px 6px;
    border-radius: var(--ee-radius-xs);
    color: #fff;
    font-size: 12px;
    transition: background var(--ee-transition);
  }

  .email-editor-wrapper .gjs-toolbar-item:hover {
    background: rgba(255,255,255,0.15);
  }

  /* Component badge */
  .email-editor-wrapper .gjs-badge {
    background: var(--ee-primary);
    border-radius: var(--ee-radius-xs);
    padding: 2px 8px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.3px;
    border: none;
    box-shadow: var(--ee-shadow-sm);
  }

  /* Highlighter on hover */
  .email-editor-wrapper .gjs-highlighter,
  .email-editor-wrapper .gjs-hovered {
    outline: 1.5px dashed var(--ee-accent) !important;
    outline-offset: -1px;
  }

  /* Placeholder on drag */
  .email-editor-wrapper .gjs-placeholder {
    border-color: var(--ee-primary) !important;
    border-style: dashed !important;
  }

  .email-editor-wrapper .gjs-placeholder-int {
    background: var(--ee-primary-light) !important;
    border: 2px dashed var(--ee-primary) !important;
    border-radius: var(--ee-radius-sm);
    opacity: 0.6;
  }

  /* Color picker */
  .email-editor-wrapper .gjs-field-color-picker {
    border-radius: var(--ee-radius-xs);
    overflow: hidden;
  }

  /* RTE toolbar */
  .email-editor-wrapper .gjs-rte-toolbar {
    background: var(--ee-text);
    border-radius: var(--ee-radius-sm);
    padding: 4px;
    box-shadow: var(--ee-shadow-lg);
    border: none;
  }

  .email-editor-wrapper .gjs-rte-actionbar {
    display: flex;
    gap: 2px;
  }

  .email-editor-wrapper .gjs-rte-action {
    color: #fff;
    border-radius: var(--ee-radius-xs);
    padding: 4px 8px;
    font-size: 13px;
    border: none;
    transition: background var(--ee-transition);
  }

  .email-editor-wrapper .gjs-rte-action:hover {
    background: rgba(255,255,255,0.15);
  }

  .email-editor-wrapper .gjs-rte-active {
    background: var(--ee-primary);
  }

  /* Resizer */
  .email-editor-wrapper .gjs-resizer-h {
    border: 2px solid var(--ee-primary);
    border-radius: 50%;
    background: var(--ee-surface);
    box-shadow: var(--ee-shadow-sm);
    width: 10px;
    height: 10px;
  }

  /* Hide default panels we don't need */
  .email-editor-wrapper .gjs-pn-commands,
  .email-editor-wrapper .gjs-pn-options,
  .email-editor-wrapper .gjs-pn-devices-c {
    display: none;
  }

  /* ============================================
     Loading Overlay
     ============================================ */

  .email-editor-loading {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    z-index: 999;
    font-size: 14px;
    font-weight: 500;
    color: var(--ee-text-secondary);
    gap: 14px;
  }

  .email-editor-loading-spinner {
    width: 28px;
    height: 28px;
    border: 2.5px solid var(--ee-border);
    border-top-color: var(--ee-primary);
    border-radius: 50%;
    animation: ee-spin 0.7s linear infinite;
  }

  @keyframes ee-spin {
    to { transform: rotate(360deg); }
  }

  /* ============================================
     Empty state hint
     ============================================ */

  .email-editor-wrapper .gjs-no-select {
    color: var(--ee-text-muted);
    font-size: 13px;
    padding: 20px 16px;
    text-align: center;
    line-height: 1.6;
  }

  /* ============================================
     Tag Autocomplete Dropdown
     ============================================ */

  .ee-tag-autocomplete {
    position: fixed;
    z-index: 10000;
    background: var(--ee-surface, #fff);
    border: 1px solid var(--ee-border, #e4e7ec);
    border-radius: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06);
    min-width: 180px;
    max-width: 260px;
    max-height: 220px;
    overflow-y: auto;
    padding: 4px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .ee-tag-autocomplete::-webkit-scrollbar {
    width: 4px;
  }

  .ee-tag-autocomplete::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 4px;
  }

  .ee-tag-autocomplete-header {
    padding: 6px 10px 4px;
    font-size: 10px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    user-select: none;
  }

  .ee-tag-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 10px;
    cursor: pointer;
    border-radius: 6px;
    transition: all 0.1s;
    font-size: 13px;
    color: #1a1d23;
  }

  .ee-tag-item:hover,
  .ee-tag-item.active {
    background: #eef2ff;
    color: #4f46e5;
  }

  .ee-tag-item-icon {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f0f4ff;
    border-radius: 4px;
    font-size: 11px;
    color: #4f46e5;
    font-weight: 700;
    flex-shrink: 0;
  }

  .ee-tag-item:hover .ee-tag-item-icon,
  .ee-tag-item.active .ee-tag-item-icon {
    background: #4f46e5;
    color: #fff;
  }

  .ee-tag-item-name {
    font-weight: 500;
  }

  .ee-tag-item-preview {
    margin-left: auto;
    font-size: 11px;
    color: #9ca3af;
    font-family: 'SF Mono', 'Fira Code', monospace;
  }

  .ee-tag-item:hover .ee-tag-item-preview,
  .ee-tag-item.active .ee-tag-item-preview {
    color: #818cf8;
  }
`;
