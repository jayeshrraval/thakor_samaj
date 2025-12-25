import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { youwareVitePlugin } from "@youware/vite-plugin-react";

export default defineConfig({
  plugins: [youwareVitePlugin(), react()],
  base: './', // Netlify માટે આ પાથ સૌથી સેફ છે
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    sourcemap: false, 
    rollupOptions: {
      // આ લાઈન Vite ને કહેશે કે આ ફાઈલને ઈગ્નોર કર
      external: ['capacitor-cli.d.ts'],
      output: {
        // આ લાઈન ખાતરી કરશે કે કોઈ પણ 'undefined' મોડ્યુલ લોડ ન થાય
        globals: {
          'capacitor-cli.d.ts': 'undefined'
        }
      }
    },
  }
});