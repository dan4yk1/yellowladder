# Project Rules

## Project
- **YellowLadder** — a website agency for construction-industry contractors
  (website creation + hosting, GEO/AI-search-optimized sites, custom builds).
  It is a website agency / WaaS, **not** a lead-gen tool — copy reflects that.
- The marketing site's design **replicates `~/Desktop/dev/permitclerkmarketing`**
  (light/airy, typography-forward, Acctual-like), re-skinned with a yellow accent.
- The landing page is built (Hero, TradesMarquee, Review, Audience, Problem,
  HowItWorks, CTA). Site is **light-only** (no dark mode by design).

## Repository
- Scaffolded from the `astro-web-template` (github.com/dan4yk1/astro-web-template)
- Branch: `main`

## Package Manager
- Always use **bun** (not npm/yarn/pnpm)
- Install: `bun install`, Run: `bun run dev`, Build: `bun run build`

## Styling
- Use **Tailwind CSS v4.3** for all styling
- No inline styles, no separate CSS files beyond `src/styles/global.css`
- Tailwind config is in `global.css` via `@import "tailwindcss"`

## Design System (defined in `src/styles/global.css` `@theme`)
- **Fonts:** Open Runde (local `@font-face`, weights 400/500/600 only — never
  `font-bold`/700, it faux-bolds) + Caveat (script accent, via Astro Fonts API /
  Bunny; loaded with `<Font cssVariable="--font-caveat">` in `MainLayout`).
- **Tokens:** `--color-page #fafafa`, `--color-ink #14151a`, `--color-brand #f5b50a`
  (yellow), `--color-brand-ink #b8860b` (darker yellow for eyebrow/link text on
  white); `--animate-marquee`, `--animate-card-in`.
- **Accent rule:** yellow is the brand accent (eyebrows, logo, small fills); CTAs
  are **dark** (`PrimaryButton`, `#0d111b`), not yellow. Section icons stay multicolor.
- **Parity note:** sections use permitclerk's literal hex (`#1e1e1e` headings,
  `#8d8d8d` body, `#fafafa` card bg) rather than tokens — intentional for 1:1 design match.
- Respect `prefers-reduced-motion` (use `motion-reduce:*`) on every animation.

## Component Organization
- `src/components/global/` — Always-visible components (`Navbar`, `Footer`, `Meta`)
- `src/components/ui/` — Reusable UI elements: `Logo` (steps mark + live "YellowLadder"
  text), `PrimaryButton` (dark pill CTA), `Icon` (inline Lucide paths), `BrowserMockup`
- `src/components/sections/landing/` — Landing-page sections (Hero, TradesMarquee,
  ReviewSection, AudienceSection, ProblemSection, HowItWorksSection, CtaSection)
- Trade/section icons are Phosphor SVGs in `src/assets/icons/ph/`, imported as native
  Astro components (`fill=currentColor`, colored via `text-*`) — not astro-icon at runtime
  (astro-icon's runtime component breaks on the Cloudflare `workerd` dev runtime)
- Keep components small and focused — one responsibility per component

## Layouts
- Use `MainLayout.astro` as the base layout for all pages
- All SEO is handled via the `Meta.astro` component — never add raw `<meta>` tags in pages

## Data & Config
- Centralize site config in `src/data/constants.ts` (`SITE`, `OG`, `SEO_CONFIG`, schema helpers)
- Centralize navigation data in `src/utils/navigation.ts` (`navItems`, `navCtas`) — the
  Navbar renders from it; flat in-page anchor links (`#how-it-works`, `#audience`, `#contact`)
- Logo SVGs in `public/` (`yellowladder*.svg`) + favicons are for favicon/OG/fallback only;
  the in-page logo is the `Logo.astro` component (not these files)

## Docs & Status
- Design spec: `docs/superpowers/specs/2026-06-07-yellowladder-landing-design.md`
- Implementation plan: `docs/superpowers/plans/2026-06-07-yellowladder-landing.md`
- **Pre-launch TODOs:** replace the placeholder testimonial in `ReviewSection`; add
  `public/og-default.jpg` (1200×630); confirm `twitterHandle`; set a descriptive home `<title>`

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
- **Tailwind CSS 4.3** via `@tailwindcss/vite` plugin
- **@astrojs/cloudflare 13** — uses unified entrypoint, no `assets` binding in wrangler
- **@astrojs/mdx 6** for MDX support
- **Node 22+** required (Astro 6 minimum)
