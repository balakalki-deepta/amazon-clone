import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite dev server config. The app talks to the API via the axios client
// (src/api/client.ts), whose base URL comes from VITE_API_URL.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
