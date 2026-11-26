import { defineConfig } from 'vite';

// Relative base so the built site works from any folder (Vercel root or a Bluehost subdirectory).
export default defineConfig({
  base: './',
  build: { target: 'es2020' },
});
