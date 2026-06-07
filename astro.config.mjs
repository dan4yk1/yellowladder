// @ts-check
import { defineConfig } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import icon from 'astro-icon';

import playformCompress from '@playform/compress';

// https://astro.build/config
export default defineConfig({
  // TODO: Replace with your production URL
  site: "https://example.com",

  prefetch: true,

  image: {
    domains: ["images.unsplash.com"],
  },

  integrations: [sitemap(), mdx(), icon(), playformCompress()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});