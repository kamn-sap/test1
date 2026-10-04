import { defineConfig } from 'vite';

export default defineConfig({
  base: '/test1/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    minify: 'esbuild'
  },
  optimizeDeps: {
    include: ['three']
  }
});
