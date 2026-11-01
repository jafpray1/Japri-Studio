import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// JANGAN masukkan API key apa pun ke `define`: semua yang di-define ikut ke bundle JS publik.
// Gemini dipanggil lewat backend Japri Konten (VITE_JAPRI_API_URL), key ada di server.
export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
