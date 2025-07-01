import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  build: {
    outDir: path.resolve(__dirname, '../backend/dist'),
    emptyOutDir: true
  }
});