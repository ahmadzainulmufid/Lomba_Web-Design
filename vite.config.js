import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: '/index.html',
        history: '/history.html',
        implementation: '/implementation.html',
        source: '/source.html',
        team: '/team.html'
      }
    }
  }
});
