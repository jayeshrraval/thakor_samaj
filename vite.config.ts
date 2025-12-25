import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { youwareVitePlugin } from "@youware/vite-plugin-react";

export default defineConfig({
  plugins: [youwareVitePlugin(), react()],
  base: '/', 
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      // આ લાઈન Vite ને કહેશે કે આ ફાઈલ બંડલમાં નથી લેવાની
      external: ['capacitor-cli.d.ts'], 
    },
  },
  // આ સૌથી મહત્વનું છે: આ બ્રાઉઝરની "Failed to resolve module" એરરને રોકશે
  optimizeDeps: {
    exclude: ['capacitor-cli.d.ts']
  }
});