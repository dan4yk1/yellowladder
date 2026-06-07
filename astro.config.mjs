// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

import sitemap from '@astrojs/sitemap';

import mdx from '@astrojs/mdx';

import tailwindcss from '@tailwindcss/vite';

import cloudflare from '@astrojs/cloudflare';

import icon from 'astro-icon';

import playformCompress from '@playform/compress';

// https://astro.build/config
export default defineConfig({
  site: "https://yellowladder.ai",

  prefetch: true,

  // Self-hosted/optimized web fonts via Astro's Fonts API (Bunny provider).
  // Open Runde stays a local @font-face in global.css; Caveat is the
  // handwritten accent used for testimonial attributions.
  fonts: [
    {
      provider: fontProviders.bunny(),
      name: "Caveat",
      cssVariable: "--font-caveat",
      weights: [400, 500, 600, 700],
    },
  ],

  image: {
    domains: ["images.unsplash.com"],
  },

  integrations: [sitemap(), mdx(), icon(), playformCompress()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});
