import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import path from 'path';

export default defineConfig({
  plugins: [
    nodePolyfills({
      // Ensure correct resolution of the buffer shim
      buffer: true,
    }),
  ],
  resolve: {
    alias: {
      // Use the absolute path for the buffer shim
      'buffer/': path.resolve(__dirname, 'node_modules/vite-plugin-node-polyfills/shims/buffer'),
    },
  },
  server: {
    port: 4401, // Replace 3001 with your desired port number
  },
});