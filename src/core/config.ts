export interface EmailEditorOptions {
  target: string | HTMLTextAreaElement;
  height?: string;
  width?: string;
  locale?: string;
  onChange?: (html: string) => void;
  onReady?: (editor: any) => void;
  onUpload?: (files: FileList) => Promise<string[]>;
  templates?: EmailTemplate[];
  tags?: string[];
}

export interface EmailTemplate {
  id: string;
  name: string;
  thumbnail?: string;
  mjml: string;
}

export const defaultMjmlContent = `<mjml>
  <mj-head>
    <mj-attributes>
      <mj-all font-family="Helvetica, Arial, sans-serif" />
      <mj-text font-size="14px" color="#333333" line-height="1.6" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="#f5f5f5">
    <mj-section background-color="#ffffff" padding="20px">
      <mj-column>
        <mj-text font-size="24px" font-weight="bold" align="center">Bem-vindo ao Email Editor</mj-text>
        <mj-text align="center">Arraste blocos da barra lateral para comecar a criar seu email.</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;

export function getGrapesJSConfig(containerId: string, opts: EmailEditorOptions) {
  return {
    container: `#${containerId}`,
    fromElement: false,
    height: '100%',
    width: '100%',
    storageManager: false as const,
    panels: { defaults: [] },
    deviceManager: {
      devices: [
        { name: 'Desktop', width: '' },
        { name: 'Mobile', width: '375px', widthMedia: '480px' },
      ],
    },
    canvas: {
      styles: [
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      ],
    },
    assetManager: {
      upload: false as const,
      ...(opts.onUpload
        ? {
            uploadFile: async (e: any) => {
              const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
              if (!files || !opts.onUpload) return;
              const urls = await opts.onUpload(files);
              const am = (e as any).editor?.AssetManager;
              if (am) urls.forEach((url: string) => am.add({ src: url }));
            },
          }
        : {}),
    },
  };
}
