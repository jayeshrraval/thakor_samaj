import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { youwareVitePlugin } from "@youware/vite-plugin-react";

export default defineConfig({
  // ક્રમ બદલ્યો: React પહેલા, પછી Youware
  plugins: [react(), youwareVitePlugin()],
  base: './', 
  resolve: {
    alias: {
      // આ લાઈન જાદુ કરશે: જો ક્યાંય પણ capacitor-cli.d.ts દેખાશે, 
      // તો એને એક ખાલી મોડ્યુલ સાથે બદલી નાખશે.
      'capacitor-cli.d.ts': 'id' 
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      // બિલ્ડમાંથી સદંતર બહાર
      external: ['capacitor-cli.d.ts'],
    },
  },
});