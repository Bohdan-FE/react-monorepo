/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Для ESM-модулей Tailwind
// Используем require + .default
// Это работает с TypeScript и Nx
const tailwindcss = require('@tailwindcss/vite').default;

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/portfolio',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4200,
    host: 'localhost',
  },
  plugins: [react(), tailwindcss()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
