import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { youwareVitePlugin } from "@youware/vite-plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [youwareVitePlugin(), react()],
  base: '/', // આ લાઈન Netlify પર ફાઈલો શોધવામાં મદદ કરશે
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      // આ લાઈન બિલ્ડ વખતની એરર રોકશે
      external: ['capacitor-cli.d.ts'], 
    },
  },
  // આ લાઈન બ્રાઉઝરમાં આવતી "Failed to resolve module" એરરને કાયમી સોલ્વ કરશે
  optimizeDeps: {
    exclude: ['capacitor-cli.d.ts']
  }
});