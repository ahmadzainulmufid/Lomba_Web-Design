import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        history: resolve(__dirname, 'history.html'),
        implementation: resolve(__dirname, 'Implementation.html'),
        source: resolve(__dirname, 'source.html'),
        team: resolve(__dirname, 'team.html'),
      },
    },
  },
});
