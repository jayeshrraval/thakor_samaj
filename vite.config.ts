import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { youwareVitePlugin } from "@youware/vite-plugin-react";

export default defineConfig({
  plugins: [react(), youwareVitePlugin()],
  base: './', 
  build: {
    outDir: 'dist',
    target: 'es2015',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      external: [
        '@capacitor/cli',
        'path',
        'fs',
        'https',
        'crypto',
        'util',
        'os',
        'child_process',
        'fs/promises',
        'node:fs',
        'node:path',
        'node:events',
        'node:child_process',
        'node:process',
        'node:url'
      ],
      output: {
        format: 'umd', 
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        globals: {
          '@capacitor/cli': 'CapacitorCLI'
        }
      }
    }
  },
  resolve: {
    alias: {
      'capacitor-cli.d.ts': 'id' 
    }
  }
});