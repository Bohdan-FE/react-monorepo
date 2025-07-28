/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(async () => {
  const tailwindcss = (await import('@tailwindcss/vite')).default;
  return {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/dashboard',
    server: {
      port: 4200,
      host: 'localhost',
    },
    preview: {
      port: 4200,
      host: 'localhost',
    },
    plugins: [react(), tailwindcss()],
    // Uncomment this if you are using workers.
    // worker: {
    //  plugins: [ nxViteTsPaths() ],
    // },
    build: {
      outDir: './dist',
      emptyOutDir: true,
      reportCompressedSize: true,
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
    define: {
      'import.meta.vitest': undefined,
    },
  };
});
