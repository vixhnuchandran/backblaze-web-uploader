import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html', // Entry point for the build
      },
    },
    outDir: 'dist', // Default output directory for production builds
    assetsDir: 'assets', // Directory to place static assets
  },
  server: {
    port: 3000, // Development server port
    open: true, // Automatically open the app in the browser on server start
  },
});
