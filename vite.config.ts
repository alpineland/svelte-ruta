import pkg from './package.json';
import ts from '@rollup/plugin-typescript';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  build: {
    target: 'esnext',
    lib:
      mode === 'lib'
        ? {
            entry: './src/lib/mod.ts',
            formats: ['es'],
            fileName: () => 'mod.js',
          }
        : false,
    rollupOptions: {
      plugins: [
        ts({
          include: [
            './src/lib/**/*.js',
            './src/lib/**/*.ts',
            './src/lib/**/*.svelte',
          ],
        }),
      ],
      external: Object.keys(pkg.dependencies),
    },
  },
  plugins: [
    svelte(),
    {
      name: 'replace',
      transform: (code) =>
        code.replace(/__DEV__/g, `(process.env.NODE_ENV !== "production")`),
    },
  ],
}));
