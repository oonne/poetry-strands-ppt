import { defineConfig } from 'vite';
import { CodeInspectorPlugin } from 'code-inspector-plugin';
import svgLoader from 'vite-svg-loader';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';

// https://cn.vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    svgLoader(),
    CodeInspectorPlugin({
      bundler: 'vite',
      editor: 'cursor',
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 11011,
  },
  build: {
    assetsInlineLimit: 0,
  },
});
