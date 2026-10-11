import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        test: resolve(__dirname, 'test.html'),
        authPreview: resolve(__dirname, 'auth-preview.html'),
        photoshopLab: resolve(__dirname, 'photoshop-lab.html'),
        bgRemover: resolve(__dirname, 'bg-remover.html'),
        caminata: resolve(__dirname, 'caminata.html'),
        dtfLab: resolve(__dirname, 'dtf-lab.html')
      }
    }
  }
});
