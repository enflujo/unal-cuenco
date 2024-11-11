import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  base: '/unal-cuenco/',
  plugins: [vue()],
  build: {
    outDir: 'publico',
    assetsDir: 'estaticos',
    sourcemap: true,
    rollupOptions: {
      input: {
        principal: resolve(__dirname, 'index.html'),
        otras: resolve(__dirname, '404.html'),
      },
    },
  },
  publicDir: 'estaticos',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
