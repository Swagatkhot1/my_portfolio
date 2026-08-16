// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import react from '@astrojs/react';

// Local `astro dev` skips the Cloudflare Workerd runner. That runner crashes
// with `module is not defined` (CommonJS `module` in an ESM Worker). Pages are
// already prerendered, so Vite on Node is enough for local preview. Build and
// preview still use the Cloudflare adapter.
const localDev = process.argv.includes('dev');

// https://astro.build/config
export default defineConfig({
  output: localDev ? 'static' : 'server',

  adapter: localDev ? undefined : cloudflare(),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});
