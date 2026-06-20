import { resolve } from "node:path";
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      include: ['src/**/*.ts']
    })
  ],
  resolve: {
    alias: {
      "@": resolve("src")
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'NoiaUI',
      fileName: (format) => `index.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      output: {
        assetFileNames(assetInfo) {
          if (assetInfo.name === 'index.css') return 'index.css';
          return assetInfo.name || '';
        },
      }
    }
  },
});