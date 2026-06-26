// @ts-check
// Astro Configuration
// Docs: https://docs.astro.build/en/reference/configuration-reference/
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Site URL — REQUIRED for sitemap, RSS, canonical URLs, and OG tags
  // Change this to your production domain
  site: 'https://your-site.pages.dev',

  // Static output — pre-renders all pages at build time
  // Best for blogs: fastest performance, CDN-cacheable, zero server costs
  output: 'static',

  // Vite configuration
  vite: {
    plugins: [
      // Tailwind CSS v4 — uses the new Vite plugin (not the deprecated @astrojs/tailwind)
      tailwindcss(),
    ],
  },

  // Integrations
  integrations: [
    // Automatic sitemap generation at /sitemap-index.xml
    sitemap(),
  ],

  // Markdown configuration
  markdown: {
    // Enable syntax highlighting with Shiki
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
