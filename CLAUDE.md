# Project Rules

## Repository
- GitHub: https://github.com/dan4yk1/astro-web-template
- Branch: `main`

## Package Manager
- Always use **bun** (not npm/yarn/pnpm)
- Install: `bun install`, Run: `bun run dev`, Build: `bun run build`

## Styling
- Use **Tailwind CSS v4.2** for all styling
- No inline styles, no separate CSS files beyond `src/styles/global.css`
- Tailwind config is in `global.css` via `@import "tailwindcss"`

## Component Organization
- `src/components/global/` — Always-visible components (Navbar, Footer, Meta)
- `src/components/ui/` — Reusable UI elements (buttons, links, cards)
- `src/components/sections/` — Page section components (hero, features, CTA)
- Keep components small and focused — one responsibility per component

## Layouts
- Use `MainLayout.astro` as the base layout for all pages
- All SEO is handled via the `Meta.astro` component — never add raw `<meta>` tags in pages

## Data & Config
- Centralize site config in `src/data/constants.ts`
- Centralize navigation data in `src/utils/navigation.ts`

## Imports
- Use path aliases for all imports:
  - `@components/` → `src/components/`
  - `@data/` → `src/data/`
  - `@utils/` → `src/utils/`
  - `@layouts/` → `src/layouts/`
  - `@images/` → `src/assets/images/`
  - `@styles/` → `src/styles/`
  - `@/*` → `src/*`

## TypeScript
- Strict mode enabled (extends `astro/tsconfigs/strict`)
- Add `Props` interface to all `.astro` components

## Content
- Prefer `.astro` components for pages and layouts
- Use MDX (`.mdx`) for content-heavy pages

## Git
- **Never** add `Co-Authored-By` lines to commit messages

## Deployment
- Deploy target: **Cloudflare** (uses `@astrojs/cloudflare` v13 adapter)
- Wrangler config in `wrangler.jsonc` — entrypoint is `@astrojs/cloudflare/entrypoints/server`
- Dev server uses `workerd` runtime (mirrors production)
- Cloudflare handles gzip/brotli — `@playform/compress` handles HTML/CSS/JS minification

## Stack Versions
- **Astro 6** (`astro@6.x`) with Vite 7
- **Tailwind CSS 4.2** via `@tailwindcss/vite` plugin
- **@astrojs/cloudflare 13** — uses unified entrypoint, no `assets` binding in wrangler
- **@astrojs/mdx 5** for MDX support
- **Node 22+** required (Astro 6 minimum)
