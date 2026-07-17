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

  // CSS: false — let Vite minify CSS. @playform/compress defaults to the csso
  // minifier, which silently drops Tailwind v4 range media queries
  // (`@media (width >= 48rem)`), stripping every breakpoint and forcing the
  // mobile layout on desktop in production builds only.
  integrations: [sitemap(), mdx(), icon(), playformCompress({ CSS: false })],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: cloudflare()
});
