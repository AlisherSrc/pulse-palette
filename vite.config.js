import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import copy from 'vite-plugin-copy';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        { src: 'pwa.js', dest: 'dist' } // Adjust if your pwa.js is in a subdirectory
      ],
      hook: 'writeBundle' // use the 'writeBundle' hook to copy after Vite build
    })
  ],
})
