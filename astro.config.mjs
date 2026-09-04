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

// GitHub Pages serves static files only — it cannot run a Cloudflare Worker —
// so the Pages build drops the adapter. Both pages are `prerender = true`, so
// nothing is lost. BASE_PATH is the subpath the site is served under
// ("/my_portfolio" for a project repo); leave it unset for a user site, a
// custom domain, or Cloudflare.
const pagesBuild = process.env.GITHUB_PAGES === 'true';
const staticBuild = localDev || pagesBuild;

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || undefined,

  output: staticBuild ? 'static' : 'server',

  adapter: staticBuild ? undefined : cloudflare(),

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});
