import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { defineConfig } from 'vite';

// One middleware shared by dev and preview servers: JFIF files are JPEGs.
const jfifMime = (req: { url?: string }, res: { setHeader: (name: string, value: string) => void }, next: () => void) => {
  if (req.url?.split('?')[0]?.toLowerCase().endsWith('.jfif')) {
    res.setHeader('Content-Type', 'image/jpeg');
  }
  next();
};

const jfifMimePlugin = () => ({
  name: 'jfif-mime-type',
  configureServer(server: { middlewares: { use: (...args: unknown[]) => void } }) {
    server.middlewares.use(jfifMime as (...args: unknown[]) => void);
  },
  configurePreviewServer(server: { middlewares: { use: (...args: unknown[]) => void } }) {
    server.middlewares.use(jfifMime as (...args: unknown[]) => void);
  },
});

export default defineConfig(() => ({
  // Vite injects this into built JS/CSS URLs. GitHub Pages serves the site from
  // /revivalchurchinternational/, so the workflow sets VITE_BASE_PATH accordingly.
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [react(), tailwindcss(), jfifMimePlugin()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: true as const,
    hmr: process.env.DISABLE_HMR !== 'true',
    watch: process.env.DISABLE_HMR === 'true' ? null : {},
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    allowedHosts: true as const,
    proxy: {
      '/api': {
        target: process.env.API_PROXY_TARGET ?? 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
}));
