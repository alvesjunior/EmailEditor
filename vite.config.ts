import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/EmailEditor.ts'),
      name: 'EmailEditor',
      fileName: (format) => `email-editor.${format}.js`,
    },
    rollupOptions: {
      output: {
        assetFileNames: 'email-editor.[ext]',
        exports: 'named',
      },
    },
    cssCodeSplit: false,
  },
  server: {
    open: '/examples/index.html',
  },
});
