# YellowLadder Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build YellowLadder's landing page by replicating the `permitclerkmarketing` design system 1:1, swapping the accent to yellow + dark buttons, and filling permitclerk's section molds with YellowLadder (contractor website agency) content.

**Architecture:** Astro 6 + Tailwind v4 (theme tokens in `global.css`, no config file) + Cloudflare adapter. Components copied from permitclerk where unchanged (`Icon`, `PrimaryButton`, `Logo`, Phosphor SVGs, fonts) and re-content'd where needed (sections, `Navbar`, `constants`, `navigation`). New components: `BrowserMockup` (hero centerpiece), `Footer`, `CtaSection`, `TradesMarquee`. The page is wired incrementally into `index.astro` so every task ends in a real `bun run build` that renders the new work.

**Tech Stack:** Astro 6.4.3, Tailwind CSS v4, bun, Open Runde (local woff2) + Caveat (Astro Fonts API / Bunny), `@astrojs/cloudflare`.

**Source of truth for copies:** `/Users/danielkicherman/Desktop/dev/permitclerkmarketing` (referred to below as `$PC`).

**Conventions:**
- Package manager is **bun** only.
- Brand yellow `#f5b50a` (`--color-brand`); yellow eyebrow/link text uses a darker `--color-brand-ink: #b8860b` for legibility on white (tune to taste).
- Section anchors: `#how-it-works`, `#audience`, `#contact`.
- After each task, run `bun run build` and expect: build completes with no errors and `dist/` is generated. Visual checks via `bun run dev` → http://localhost:4321.

---

## File Structure

**Created:**
- `src/assets/fonts/open-runde-{regular,medium,semibold}.woff2` (copied)
- `src/assets/icons/ph/*.svg` (copied, 16 Phosphor icons)
- `src/components/ui/Logo.astro` (from permitclerk `YellowladderLogo.astro`)
- `src/components/ui/Icon.astro` (copied)
- `src/components/ui/PrimaryButton.astro` (copied)
- `src/components/ui/BrowserMockup.astro` (new)
- `src/components/global/Navbar.astro` (adapted)
- `src/components/global/Footer.astro` (new)
- `src/components/sections/landing/Hero.astro` (adapted)
- `src/components/sections/landing/TradesMarquee.astro` (adapted from LogoLoop)
- `src/components/sections/landing/ReviewSection.astro` (adapted)
- `src/components/sections/landing/AudienceSection.astro` (adapted)
- `src/components/sections/landing/ProblemSection.astro` (adapted)
- `src/components/sections/landing/HowItWorksSection.astro` (adapted)
- `src/components/sections/landing/CtaSection.astro` (new)

**Modified:**
- `src/styles/global.css` (was just `@import "tailwindcss";`)
- `astro.config.mjs` (add Fonts API)
- `src/data/constants.ts` (YellowLadder values)
- `src/utils/navigation.ts` (flat nav, YellowLadder CTAs)
- `src/layouts/MainLayout.astro` (enable Font + Navbar + Footer)
- `src/pages/index.astro` (compose sections, grows each task)

---

## Task 1: Design-system foundation (fonts, theme tokens, Fonts API)

**Files:**
- Create: `src/assets/fonts/open-runde-regular.woff2`, `...-medium.woff2`, `...-semibold.woff2`
- Modify: `src/styles/global.css`
- Modify: `astro.config.mjs`

- [ ] **Step 1: Copy the Open Runde font files**

```bash
mkdir -p src/assets/fonts
cp /Users/danielkicherman/Desktop/dev/permitclerkmarketing/src/assets/fonts/open-runde-regular.woff2 src/assets/fonts/
cp /Users/danielkicherman/Desktop/dev/permitclerkmarketing/src/assets/fonts/open-runde-medium.woff2 src/assets/fonts/
cp /Users/danielkicherman/Desktop/dev/permitclerkmarketing/src/assets/fonts/open-runde-semibold.woff2 src/assets/fonts/
```

- [ ] **Step 2: Replace `src/styles/global.css` with the full theme**

```css
@import "tailwindcss";

/* ─── Brand Font: Open Runde ──────────────────────────────────────────────── */
/* Weights available: 400 (regular), 500 (medium), 600 (semibold). Avoid       */
/* `font-bold` (700) — it would synthesize a faux-bold from 600.               */

@font-face {
  font-family: "Open Runde";
  src: url("../assets/fonts/open-runde-regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Open Runde";
  src: url("../assets/fonts/open-runde-medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Open Runde";
  src: url("../assets/fonts/open-runde-semibold.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

/* ─── Brand Theme Tokens ──────────────────────────────────────────────────── */
/* Tailwind v4 config. Tokens become utilities, e.g. `bg-page`, `text-ink`,    */
/* `text-brand`. `--font-sans` overrides the default sans family site-wide.    */

@theme {
  --color-page: #fafafa; /* page background */
  --color-ink: #14151a; /* near-black for primary text + dark buttons */
  --color-brand: #f5b50a; /* YellowLadder yellow — logo + accent fills/icons */
  --color-brand-ink: #b8860b; /* darker yellow for eyebrow/link TEXT on white */
  --font-sans:
    "Open Runde", ui-sans-serif, system-ui, -apple-system, sans-serif;
  /* Maps to the Astro Fonts API variable for Caveat (see astro.config.mjs). */
  --font-script: var(--font-caveat), ui-sans-serif, cursive;

  /* Marquee for the trades loop. The track holds two identical copies of the
     list, so translating -50% scrolls exactly one copy for a seamless loop. */
  --animate-marquee: marquee 30s linear infinite;

  /* Hero browser-mockup intro animation (see @keyframes card-in below). */
  --animate-card-in: card-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

/* Hero browser-mockup intro: rise + fade as the page loads. `both` keeps the
   start state before the (delayed) animation begins, avoiding a flash. */
@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(32px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
```

- [ ] **Step 3: Replace `astro.config.mjs` to add the Fonts API + real site URL**

```js
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
```

- [ ] **Step 4: Build to verify config + fonts compile**

Run: `bun run build`
Expected: build completes with no errors (it builds the current Hello-World `index.astro`). Caveat is fetched from Bunny at build time — network required.

- [ ] **Step 5: Commit**

```bash
git add src/assets/fonts src/styles/global.css astro.config.mjs
git commit -m "feat: add Open Runde + Caveat fonts and brand theme tokens"
```

---

## Task 2: UI primitives + Phosphor icons (copied)

**Files:**
- Create: `src/components/ui/Icon.astro`, `src/components/ui/PrimaryButton.astro`, `src/components/ui/Logo.astro`
- Create: `src/assets/icons/ph/*.svg` (16 files)

- [ ] **Step 1: Copy the three UI primitives verbatim**

```bash
mkdir -p src/components/ui
cp /Users/danielkicherman/Desktop/dev/permitclerkmarketing/src/components/ui/Icon.astro src/components/ui/Icon.astro
cp /Users/danielkicherman/Desktop/dev/permitclerkmarketing/src/components/ui/PrimaryButton.astro src/components/ui/PrimaryButton.astro
cp /Users/danielkicherman/Desktop/dev/permitclerkmarketing/src/components/ui/YellowladderLogo.astro src/components/ui/Logo.astro
```

(`Icon.astro` ships `menu/x/check/chevron-down` + trade glyphs; `PrimaryButton.astro` is the dark pill CTA; `Logo.astro` is the yellow-"Y" wordmark with `accent="#f5b50a"` default and an optional `.ai` suffix that we leave off.)

- [ ] **Step 2: Set the Logo's default accessible title to the brand**

In `src/components/ui/Logo.astro`, change the default title prop value:

Find:
```ts
  title = "Yellowladder",
```
Replace:
```ts
  title = "YellowLadder",
```

- [ ] **Step 3: Copy all 16 Phosphor icon SVGs**

```bash
mkdir -p src/assets/icons/ph
cp /Users/danielkicherman/Desktop/dev/permitclerkmarketing/src/assets/icons/ph/*.svg src/assets/icons/ph/
ls src/assets/icons/ph/
```
Expected: 16 files (clipboard-text, drop, handshake, hard-hat, hash-straight, house-line, lightning, map-pin, paper-plane-tilt, question, shield-check, snowflake, solar-panel, speedometer, stack, wallet).

- [ ] **Step 4: Build to verify the components type-check**

Run: `bun run build`
Expected: build completes with no errors. (Components aren't imported yet; this confirms they at least parse once referenced in later tasks. If you want eager validation, it happens in Task 4 when MainLayout imports them.)

- [ ] **Step 5: Commit**

```bash
git add src/components/ui src/assets/icons/ph
git commit -m "feat: add Icon, PrimaryButton, Logo, and Phosphor icons"
```

---

## Task 3: Site constants + navigation data

**Files:**
- Modify: `src/data/constants.ts`
- Modify: `src/utils/navigation.ts`

- [ ] **Step 1: Replace `src/data/constants.ts`**

```ts
// ─── Site Configuration ─────────────────────────────────────────────────────
// Single source of truth for all site-wide metadata and SEO defaults.

export const SITE = {
  title: "YellowLadder",
  tagline: "Websites that book contractors more jobs.",
  description:
    "YellowLadder designs, builds, and hosts fast, modern websites for construction contractors — optimized to get you found on Google and AI search.",
  url: "https://yellowladder.ai", // production URL (no trailing slash)
  author: "YellowLadder",
  email: "hello@yellowladder.ai",
  titleTemplate: "%s | YellowLadder", // %s is replaced with the page title
  twitterHandle: "@yellowladder", // TODO: confirm handle
  themeColor: "#fafafa", // brand page background
  organization: {
    name: "YellowLadder",
    url: "https://yellowladder.ai",
    logo: "/yellowladder.svg",
  },
} as const;

// ─── Open Graph Defaults ────────────────────────────────────────────────────

export const OG = {
  locale: "en_US",
  type: "website",
  image: "/og-default.jpg", // TODO: add default OG image to public/ (1200x630)
  imageAlt: "YellowLadder — websites for contractors",
} as const;

// ─── Default SEO Structured Data ────────────────────────────────────────────

export const SEO_CONFIG = {
  defaultSchema: {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.title,
    url: SITE.url,
    description: SITE.description,
    author: {
      "@type": "Person",
      name: SITE.author,
    },
  },
} as const;

// ─── Schema Helpers ─────────────────────────────────────────────────────────

export interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}

export function getArticleSchema({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = SITE.author,
}: ArticleSchemaProps) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: image ? `${SITE.url}${image}` : undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.organization.name,
      url: SITE.organization.url,
      logo: {
        "@type": "ImageObject",
        url: `${SITE.url}${SITE.organization.logo}`,
      },
    },
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function getFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE.url}${item.url}`,
    })),
  };
}
```

- [ ] **Step 2: Replace `src/utils/navigation.ts` with flat nav + CTA**

```ts
// ─── Navigation Data ────────────────────────────────────────────────────────
// Centralized navigation data used by the Navbar. Flat links only (the landing
// page scrolls to in-page section anchors); no mega-menus this pass.

export interface NavLink {
  label: string;
  href: string;
}

export const navItems: NavLink[] = [
  { label: "How it works", href: "/#how-it-works" },
  { label: "Who it's for", href: "/#audience" },
  { label: "Contact", href: "/#contact" },
];

// Single primary CTA on the right side of the navbar.
export const navCtas = {
  signup: { label: "Get started", href: "/#contact" },
} as const;
```

- [ ] **Step 3: Build to verify**

Run: `bun run build`
Expected: build completes with no errors (Meta.astro consumes `SITE`/`OG`/`SEO_CONFIG`; this confirms the shape still satisfies it).

- [ ] **Step 4: Commit**

```bash
git add src/data/constants.ts src/utils/navigation.ts
git commit -m "feat: set YellowLadder site constants and navigation data"
```

---

## Task 4: Navbar, Footer, MainLayout, and base page

**Files:**
- Create: `src/components/global/Navbar.astro`
- Create: `src/components/global/Footer.astro`
- Modify: `src/layouts/MainLayout.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/global/Navbar.astro`** (flat-nav adaptation of permitclerk's floating pill)

```astro
---
import Logo from "@components/ui/Logo.astro";
import Icon from "@components/ui/Icon.astro";
import PrimaryButton from "@components/ui/PrimaryButton.astro";
import { navItems, navCtas } from "@utils/navigation";

// Floating-pill navbar. Fixed, transparent band; the white pill floats over any
// section colour. Desktop shows inline flat links; mobile collapses to a
// hamburger drawer (small vanilla script at the bottom).
export interface Props {
  class?: string;
}

const { class: className = "" } = Astro.props;
---

<header class={`fixed inset-x-0 top-0 z-50 ${className}`}>
  <div class="mx-auto max-w-[1104px] px-4 pt-4">
    <div
      class="flex items-center justify-between gap-4 rounded-full bg-white/90 py-2 pr-2 pl-5 shadow-[0px_0px_0.34px_0.34px_rgba(30,45,82,0.06),0.34px_0.34px_0.34px_0px_rgba(30,45,82,0.2)] backdrop-blur-md"
    >
      {/* Left: logo + desktop links */}
      <div class="flex items-center">
        <a
          href="/"
          aria-label="YellowLadder home"
          class="flex shrink-0 items-center"
        >
          <Logo class="h-7 w-auto" />
        </a>

        <ul class="ml-6 hidden items-center gap-0.5 lg:flex">
          {
            navItems.map((item) => (
              <li>
                <a
                  href={item.href}
                  class="rounded-full px-3 py-2 text-base font-medium tracking-[-0.02em] text-[#1e1e1e] transition-colors hover:bg-black/[0.04] hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))
          }
        </ul>
      </div>

      {/* Right: desktop CTA + mobile toggle */}
      <div class="flex items-center gap-2">
        <PrimaryButton href={navCtas.signup.href} class="max-lg:hidden">
          {navCtas.signup.label}
        </PrimaryButton>

        <button
          type="button"
          data-mobile-toggle
          aria-expanded="false"
          aria-controls="mobile-menu"
          aria-label="Toggle menu"
          class="flex size-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/[0.04] lg:hidden"
        >
          <span data-menu-open><Icon name="menu" class="size-6" /></span>
          <span data-menu-close hidden><Icon name="x" class="size-6" /></span>
        </button>
      </div>
    </div>
  </div>

  {/* Mobile drawer */}
  <div id="mobile-menu" data-mobile-menu hidden class="lg:hidden">
    <div class="mx-auto max-w-6xl px-4 pt-2">
      <div
        class="rounded-2xl bg-white p-3 shadow-[0_12px_40px_rgba(0,0,0,0.10)] ring-1 ring-black/[0.06]"
      >
        <nav class="flex flex-col">
          {
            navItems.map((item) => (
              <a
                href={item.href}
                class="rounded-xl px-3 py-3 text-base font-medium tracking-[-0.02em] text-gray-800 transition-colors hover:bg-black/[0.04]"
              >
                {item.label}
              </a>
            ))
          }
        </nav>

        <div class="my-3 h-px bg-black/[0.06]"></div>

        <PrimaryButton href={navCtas.signup.href} size="lg" class="w-full">
          {navCtas.signup.label}
        </PrimaryButton>
      </div>
    </div>
  </div>
</header>

<script>
  const toggle = document.querySelector<HTMLButtonElement>(
    "[data-mobile-toggle]",
  );
  const menu = document.querySelector<HTMLElement>("[data-mobile-menu]");
  const openIcon = toggle?.querySelector<HTMLElement>("[data-menu-open]");
  const closeIcon = toggle?.querySelector<HTMLElement>("[data-menu-close]");

  function setMenu(open: boolean) {
    if (!menu || !toggle) return;
    menu.toggleAttribute("hidden", !open);
    toggle.setAttribute("aria-expanded", String(open));
    openIcon?.toggleAttribute("hidden", open);
    closeIcon?.toggleAttribute("hidden", !open);
  }

  toggle?.addEventListener("click", () => {
    setMenu(menu?.hasAttribute("hidden") ?? false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  window
    .matchMedia("(min-width: 1024px)")
    .addEventListener("change", (e) => {
      if (e.matches) setMenu(false);
    });
</script>
```

- [ ] **Step 2: Create `src/components/global/Footer.astro`**

```astro
---
import Logo from "@components/ui/Logo.astro";
import { SITE } from "@data/constants";

// Light footer matching the permitclerk aesthetic (hairline top border, grey
// body text). Link columns use in-page anchors; contact is a mailto.
const year = 2026;

const columns = [
  {
    title: "Services",
    links: [
      { label: "Website design", href: "/#how-it-works" },
      { label: "Hosting & care", href: "/#how-it-works" },
      { label: "GEO optimization", href: "/#how-it-works" },
      { label: "Custom builds", href: "/#contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Who it's for", href: "/#audience" },
      { label: "How it works", href: "/#how-it-works" },
      { label: "Contact", href: "/#contact" },
    ],
  },
];
---

<footer class="border-t border-black/[0.06] bg-white px-4 py-16">
  <div class="mx-auto grid max-w-[1024px] gap-10 sm:grid-cols-2 lg:grid-cols-4">
    {/* Brand blurb */}
    <div class="lg:col-span-2">
      <Logo class="h-7 w-auto" />
      <p
        class="mt-4 max-w-xs text-base leading-6 font-medium tracking-[-0.02em] text-[#8d8d8d]"
      >
        Websites, hosting, and AI-search optimization for construction
        contractors. You run the business; we handle the website.
      </p>
      <a
        href={`mailto:${SITE.email}`}
        class="mt-4 inline-block text-base font-medium tracking-[-0.02em] text-[#1e1e1e] transition-colors hover:text-brand-ink"
      >
        {SITE.email}
      </a>
    </div>

    {/* Link columns */}
    {
      columns.map((col) => (
        <div>
          <p class="text-sm font-semibold tracking-[-0.01em] text-[#1e1e1e]">
            {col.title}
          </p>
          <ul class="mt-4 flex flex-col gap-2.5">
            {col.links.map((link) => (
              <li>
                <a
                  href={link.href}
                  class="text-base font-medium tracking-[-0.02em] text-[#8d8d8d] transition-colors hover:text-[#1e1e1e]"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))
    }
  </div>

  <div
    class="mx-auto mt-12 flex max-w-[1024px] items-center justify-between border-t border-black/[0.06] pt-6 text-sm font-medium text-gray-400"
  >
    <span>&copy; {year} {SITE.title}</span>
    <span>Built for contractors.</span>
  </div>
</footer>
```

- [ ] **Step 3: Replace `src/layouts/MainLayout.astro`** (enable Font + Navbar + Footer)

```astro
---
import { Font } from "astro:assets";
import Meta from "@components/global/Meta.astro";
import Navbar from "@components/global/Navbar.astro";
import Footer from "@components/global/Footer.astro";
import "@styles/global.css";

export interface Props {
  title?: string;
  description?: string;
  noindex?: boolean;
  nofollow?: boolean;
  ogType?: "website" | "article";
  ogImage?: string;
  ogImageAlt?: string;
  articleDatePublished?: string;
  articleDateModified?: string;
  articleAuthor?: string;
  languageAlternates?: { href: string; hrefLang: string }[];
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
}

const { ...metaProps } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <Meta {...metaProps} />
    <Font cssVariable="--font-caveat" preload />
  </head>
  <body class="min-h-screen bg-white text-ink antialiased">
    <Navbar />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 4: Replace `src/pages/index.astro`** (temporary body; sections added next tasks)

```astro
---
import MainLayout from "@layouts/MainLayout.astro";
---

<MainLayout>
  <div class="pt-40 pb-40 text-center text-gray-400">Sections coming…</div>
</MainLayout>
```

- [ ] **Step 5: Build + visual check**

Run: `bun run build`
Expected: build completes with no errors.
Then: `bun run dev`, open http://localhost:4321 — confirm the floating yellow-logo navbar (with working mobile hamburger at narrow widths) and the footer render.

- [ ] **Step 6: Commit**

```bash
git add src/components/global/Navbar.astro src/components/global/Footer.astro src/layouts/MainLayout.astro src/pages/index.astro
git commit -m "feat: add Navbar, Footer, and enable them in MainLayout"
```

---

## Task 5: BrowserMockup + Hero

**Files:**
- Create: `src/components/ui/BrowserMockup.astro`
- Create: `src/components/sections/landing/Hero.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/ui/BrowserMockup.astro`** (hero centerpiece — a stylized contractor website inside a browser frame)

```astro
---
// A browser-window mockup: chrome (traffic-light dots + URL bar) wrapping a
// stylized contractor website (header, hero block with CTA, service tiles).
// Pure markup/skeleton — no real content. Soft shadow + ring like the
// permitclerk cards. Sized by the parent; fills width.
export interface Props {
  class?: string;
}

const { class: className = "" } = Astro.props;

const services = ["Roofing", "Repairs", "Estimates"];
---

<div
  class={`w-full overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.05] ${className}`}
>
  {/* Browser chrome */}
  <div
    class="flex items-center gap-2 border-b border-black/[0.06] bg-[#fafafa] px-4 py-3"
  >
    <span class="flex gap-1.5">
      <span class="size-3 rounded-full bg-[#ff5f57]"></span>
      <span class="size-3 rounded-full bg-[#febc2e]"></span>
      <span class="size-3 rounded-full bg-[#28c840]"></span>
    </span>
    <div
      class="ml-2 flex h-6 flex-1 items-center rounded-md bg-black/[0.04] px-3 text-xs font-medium tracking-[-0.01em] text-gray-400"
    >
      yourcompany.com
    </div>
  </div>

  {/* Site body */}
  <div class="p-6 sm:p-8">
    {/* Site nav */}
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span class="size-6 rounded-md bg-brand"></span>
        <span class="h-2.5 w-20 rounded-full bg-black/[0.12]"></span>
      </div>
      <div class="hidden items-center gap-3 sm:flex">
        <span class="h-2 w-10 rounded-full bg-black/[0.08]"></span>
        <span class="h-2 w-10 rounded-full bg-black/[0.08]"></span>
        <span
          class="h-6 w-20 rounded-full bg-ink"
          aria-hidden="true"
        ></span>
      </div>
    </div>

    {/* Site hero */}
    <div class="mt-8 flex flex-col items-start gap-3">
      <span class="h-4 w-3/4 rounded-full bg-black/[0.14]"></span>
      <span class="h-4 w-2/3 rounded-full bg-black/[0.14]"></span>
      <span class="mt-1 h-2.5 w-5/6 rounded-full bg-black/[0.07]"></span>
      <span class="h-2.5 w-1/2 rounded-full bg-black/[0.07]"></span>
      <span
        class="mt-3 inline-flex h-9 w-36 items-center justify-center rounded-full bg-brand text-xs font-semibold text-ink"
      >
        Get a quote
      </span>
    </div>

    {/* Service tiles */}
    <div class="mt-8 grid grid-cols-3 gap-3">
      {
        services.map((s) => (
          <div class="flex flex-col gap-2 rounded-xl bg-[#fafafa] p-3 ring-1 ring-black/[0.04]">
            <span class="size-7 rounded-lg bg-brand/20"></span>
            <span class="h-2 w-full rounded-full bg-black/[0.10]" />
            <span class="sr-only">{s}</span>
          </div>
        ))
      }
    </div>
  </div>
</div>
```

- [ ] **Step 2: Create `src/components/sections/landing/Hero.astro`**

```astro
---
import PrimaryButton from "@components/ui/PrimaryButton.astro";
import Icon from "@components/ui/Icon.astro";
import BrowserMockup from "@components/ui/BrowserMockup.astro";
import { navCtas } from "@utils/navigation";

// Hero — centered column, max-width 1024px, large top padding, 64px gap between
// the text block and the visual. Typography mirrors permitclerk (Open Runde):
//   headline 64/72 (40/48 mobile, 56/64 tablet), weight 600, -0.03em, #1e1e1e
//   subtext  16/24, weight 500, -0.02em, #8d8d8d
export interface Props {
  class?: string;
}

const { class: className = "" } = Astro.props;

const badges = ["Built & hosted for you", "Found on Google & AI", "No DIY headaches"];
---

<section class={`relative overflow-hidden bg-[#fafafa] ${className}`}>
  <div
    class="relative mx-auto flex max-w-[1024px] flex-col items-center gap-16 px-4 pt-[136px] lg:pt-[168px]"
  >
    {/* Text + CTA */}
    <div class="flex flex-col items-center">
      {/* Status eyebrow pill — single segment, pulsing "live" dot, no numbers */}
      <span
        class="mb-6 inline-flex items-center gap-2 rounded-full bg-brand/10 px-3.5 py-1.5 text-sm font-medium tracking-[-0.02em] text-brand-ink"
      >
        <span class="relative flex size-2 shrink-0">
          <span
            class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75 motion-reduce:hidden"
          ></span>
          <span class="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
        </span>
        Now onboarding new contractors
      </span>

      <h1
        class="max-w-[15ch] text-center text-[40px] leading-[48px] font-semibold tracking-[-0.03em] text-[#1e1e1e] sm:text-[56px] sm:leading-[64px] lg:text-[64px] lg:leading-[72px]"
      >
        Websites that book contractors more jobs
      </h1>

      <p
        class="mt-5 max-w-xl text-center text-base leading-6 font-medium tracking-[-0.02em] text-[#8d8d8d]"
      >
        We design, build, and host a fast, modern website for your trade &mdash;
        optimized to get you found on Google and AI search. You run your
        business; we handle the website.
      </p>

      <PrimaryButton href={navCtas.signup.href} size="lg" class="mt-10">
        Get your website
      </PrimaryButton>

      <a
        href="/#how-it-works"
        class="mt-4 inline-flex items-center gap-1 text-sm font-medium tracking-[-0.02em] text-gray-500 transition-colors hover:text-ink"
      >
        see how it works
        <span aria-hidden="true">&rarr;</span>
      </a>

      {/* Trust badges — muted text, brand-yellow checks with dark glyph */}
      <ul
        class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-base font-medium tracking-[-0.02em] text-gray-600"
      >
        {
          badges.map((badge) => (
            <li class="inline-flex items-center gap-2">
              <span class="flex size-5 items-center justify-center rounded-full bg-brand text-ink">
                <Icon name="check" class="size-3" />
              </span>
              {badge}
            </li>
          ))
        }
      </ul>
    </div>

    {/* Hero visual — single centered browser mockup, rise+fade on load */}
    <div class="w-full max-w-[560px]">
      <div class="animate-card-in motion-reduce:animate-none">
        <BrowserMockup />
      </div>
    </div>
  </div>

  {/* Fade the bottom of the hero into the white section below */}
  <div
    class="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent to-white"
  >
  </div>
</section>
```

- [ ] **Step 3: Wire Hero into `src/pages/index.astro`**

```astro
---
import MainLayout from "@layouts/MainLayout.astro";
import Hero from "@components/sections/landing/Hero.astro";
---

<MainLayout>
  <Hero />
</MainLayout>
```

- [ ] **Step 4: Build + visual check**

Run: `bun run build`
Expected: build completes with no errors.
Then `bun run dev`: hero shows status pill (pulsing dot), headline, subhead, dark CTA, yellow-check trust badges, and a single browser mockup that rises/fades in. No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/BrowserMockup.astro src/components/sections/landing/Hero.astro src/pages/index.astro
git commit -m "feat: add hero section with browser mockup centerpiece"
```

---

## Task 6: TradesMarquee section

**Files:**
- Create: `src/components/sections/landing/TradesMarquee.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/sections/landing/TradesMarquee.astro`** (text-pill adaptation of permitclerk's marquee)

```astro
---
// Infinite marquee of the trades YellowLadder builds for, as pills. Reuses the
// `--animate-marquee` keyframe: the track holds two identical copies of the
// list, so translating -50% scrolls exactly one copy seamlessly. Pauses on
// hover; disabled under prefers-reduced-motion. Edge-fade mask on both sides.
const trades = [
  "Electricians",
  "Plumbers",
  "HVAC",
  "Roofers",
  "Remodelers",
  "Concrete",
  "Landscapers",
  "Painters",
  "General Contractors",
  "Pool & Spa",
  "Fencing",
  "Flooring",
];
---

<section class="relative overflow-hidden bg-white pt-24 pb-8">
  <p class="text-center text-base font-medium tracking-[-0.02em] text-[#8d8d8d]">
    Built for the trades that run on referrals and repeat work
  </p>

  <div
    class="group relative mt-8 py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
  >
    <div
      class="flex w-max items-center animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
    >
      {
        [...trades, ...trades].map((trade) => (
          <span class="mx-3 flex-shrink-0 rounded-full bg-[#fafafa] px-5 py-2.5 text-base font-medium tracking-[-0.02em] text-[#1e1e1e] ring-1 ring-black/[0.05]">
            {trade}
          </span>
        ))
      }
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to `src/pages/index.astro`**

Find:
```astro
import Hero from "@components/sections/landing/Hero.astro";
```
Add below it:
```astro
import TradesMarquee from "@components/sections/landing/TradesMarquee.astro";
```
Find:
```astro
  <Hero />
```
Add below it:
```astro
  <TradesMarquee />
```

- [ ] **Step 3: Build + visual check**

Run: `bun run build`
Expected: no errors. `bun run dev`: a row of trade pills scrolls right-to-left, pauses on hover, with faded edges.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/landing/TradesMarquee.astro src/pages/index.astro
git commit -m "feat: add trades marquee section"
```

---

## Task 7: ReviewSection

**Files:**
- Create: `src/components/sections/landing/ReviewSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/sections/landing/ReviewSection.astro`**

```astro
---
// Single testimonial card: five amber stars, a large Open Runde quote, and a
// handwritten Caveat attribution. Sits on the white page background.
//
// NOTE: placeholder testimonial — swap for a real, attributable quote before
// launch (fabricated reviews are a trust/legal risk). TODO: replace.
const stars = Array.from({ length: 5 });
---

<section class="bg-white px-4 py-20">
  <div
    class="mx-auto max-w-5xl rounded-[32px] bg-[#f6f6f7] px-6 py-16 text-center sm:py-20"
  >
    {/* Stars */}
    <div class="flex justify-center gap-1.5 text-[#e8740c]">
      {
        stars.map(() => (
          <svg viewBox="0 0 24 24" class="size-7" aria-hidden="true">
            <path
              d="M12 2 15.1 7.8 21.5 8.9 17 13.6 17.9 20.1 12 17.2 6.1 20.1 7 13.6 2.5 8.9 8.9 7.8Z"
              fill="currentColor"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linejoin="round"
            />
          </svg>
        ))
      }
      <span class="sr-only">Rated 5 out of 5 stars</span>
    </div>

    {/* Quote — TODO: replace with a real testimonial */}
    <blockquote
      class="mx-auto mt-7 max-w-[42rem] text-[26px] leading-[1.25] font-semibold tracking-[-0.02em] text-[#1e1e1e] sm:text-[32px]"
    >
      &ldquo;I run a roofing crew, not a marketing team. YellowLadder built our
      site, got us on Google, and the calls started coming.&rdquo;
    </blockquote>

    {/* Attribution — TODO: replace */}
    <p class="mt-8 font-script text-2xl font-semibold text-[#8d8d8d]">
      Marcus Rivera, owner of Rivera Roofing
    </p>
  </div>
</section>
```

- [ ] **Step 2: Add to `src/pages/index.astro`**

Add import below the `TradesMarquee` import:
```astro
import ReviewSection from "@components/sections/landing/ReviewSection.astro";
```
Add below `<TradesMarquee />`:
```astro
  <ReviewSection />
```

- [ ] **Step 3: Build + visual check**

Run: `bun run build`
Expected: no errors. `bun run dev`: grey rounded card with 5 orange stars, large quote, and the attribution rendered in the Caveat (handwritten) font — confirm the script font actually applies.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/landing/ReviewSection.astro src/pages/index.astro
git commit -m "feat: add testimonial review section"
```

---

## Task 8: AudienceSection

**Files:**
- Create: `src/components/sections/landing/AudienceSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/sections/landing/AudienceSection.astro`** (carries the `#audience` anchor)

```astro
---
// "Who it's for" — six trade cards (3×2) + a full-width catch-all card. Each
// icon takes a distinct brand colour (multicolour glyphs kept per design
// decision). Icons are Phosphor "fill" SVGs imported as native Astro
// components (fill=currentColor, coloured by the `text-*` class).
import Icon from "@components/ui/Icon.astro";
import LightningIcon from "@/assets/icons/ph/lightning.svg";
import DropIcon from "@/assets/icons/ph/drop.svg";
import SnowflakeIcon from "@/assets/icons/ph/snowflake.svg";
import HouseLineIcon from "@/assets/icons/ph/house-line.svg";
import SolarPanelIcon from "@/assets/icons/ph/solar-panel.svg";
import HardHatIcon from "@/assets/icons/ph/hard-hat.svg";
import HashStraightIcon from "@/assets/icons/ph/hash-straight.svg";

export interface Props {
  class?: string;
}

const { class: className = "" } = Astro.props;

// `color` is a literal Tailwind text-colour class (kept verbatim for the JIT
// scanner); the SVG fill is `currentColor`, so it colours the glyph.
const audiences = [
  {
    Icon: LightningIcon,
    color: "text-[#f59e0b]",
    title: "Electricians",
    features: [
      "Service-area pages",
      "Click-to-call",
      "Emergency call-out banners",
      "Review showcase",
    ],
  },
  {
    Icon: DropIcon,
    color: "text-[#0098f2]",
    title: "Plumbers",
    features: [
      "Booking & quote forms",
      "Service menus",
      "24/7 call-out CTA",
      "Local SEO pages",
    ],
  },
  {
    Icon: SnowflakeIcon,
    color: "text-[#06b6d4]",
    title: "HVAC",
    features: [
      "Seasonal promos",
      "Financing call-outs",
      "Maintenance plans",
      "Click-to-call",
    ],
  },
  {
    Icon: HouseLineIcon,
    color: "text-[#64748b]",
    title: "Roofers",
    features: [
      "Project galleries",
      "Free-inspection forms",
      "Storm-response pages",
      "Financing info",
    ],
  },
  {
    Icon: HardHatIcon,
    color: "text-[#00b86b]",
    title: "Remodelers & GCs",
    features: [
      "Portfolio galleries",
      "Before / after sliders",
      "Lead capture",
      "Trust badges",
    ],
  },
  {
    Icon: SolarPanelIcon,
    color: "text-[#f5b50a]",
    title: "Solar & specialty",
    features: [
      "Savings calculators",
      "Incentive info",
      "Quote requests",
      "Reviews",
    ],
  },
  {
    Icon: HashStraightIcon,
    color: "text-gray-400",
    title: "Don't see your trade?",
    body: "We build for every contractor — tell us about your business and we'll tailor the site to how you win work.",
    catchAll: true,
  },
];
---

<section id="audience" class={`scroll-mt-24 bg-white px-4 py-20 lg:py-28 ${className}`}>
  <div class="mx-auto max-w-[1024px]">
    <p class="text-center text-base font-semibold tracking-[-0.02em] text-brand-ink">
      Who it's for
    </p>

    <h2
      class="mx-auto mt-4 max-w-[18ch] text-center text-[32px] leading-[40px] font-semibold tracking-[-0.03em] text-[#1e1e1e] md:text-[40px] md:leading-[48px]"
    >
      Made for contractors who&rsquo;d rather be on the job than building a website
    </h2>

    <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {
        audiences.map((a) => {
          const TradeIcon = a.Icon;
          return (
            <article
              class={`flex flex-col gap-[18px] rounded-[20px] bg-[#fafafa] p-6 ${a.catchAll ? "sm:col-span-2 lg:col-span-3" : ""}`}
            >
              <div class="flex items-center gap-2.5">
                <TradeIcon class={`size-6 shrink-0 ${a.color}`} />
                <h3
                  class={`text-[20px] leading-7 font-semibold tracking-[-0.03em] ${a.catchAll ? "text-gray-500" : "text-[#1e1e1e]"}`}
                >
                  {a.title}
                </h3>
              </div>
              {a.features ? (
                <ul class="flex flex-col gap-2.5">
                  {a.features.map((feature) => (
                    <li class="flex items-center gap-2 text-base font-medium tracking-[-0.02em] text-[#1e1e1e]">
                      <Icon name="check" class={`size-4 shrink-0 ${a.color}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              ) : (
                <p class="text-base leading-6 font-medium tracking-[-0.02em] text-[#8d8d8d]">
                  {a.body}
                </p>
              )}
            </article>
          );
        })
      }
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to `src/pages/index.astro`**

Add import below the `ReviewSection` import:
```astro
import AudienceSection from "@components/sections/landing/AudienceSection.astro";
```
Add below `<ReviewSection />`:
```astro
  <AudienceSection />
```

- [ ] **Step 3: Build + visual check**

Run: `bun run build`
Expected: no errors. `bun run dev`: a 3×2 grid of trade cards with multicolour icons and check-listed features, plus a full-width catch-all card. Each icon shows its own colour.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/landing/AudienceSection.astro src/pages/index.astro
git commit -m "feat: add 'who it's for' audience section"
```

---

## Task 9: ProblemSection

**Files:**
- Create: `src/components/sections/landing/ProblemSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/sections/landing/ProblemSection.astro`**

```astro
---
// Problem section — left-aligned heading, then three columns, each with a
// coloured eyebrow, a two-tone paragraph (dark lead — em-dash — grey rest), and
// a pastel card holding a centred 40px accent-coloured icon. Multicolour kept
// per design decision. Phosphor "fill" SVGs imported as native Astro components
// (fill=currentColor, coloured by the `text-*` class).
import MapPinIcon from "@/assets/icons/ph/map-pin.svg";
import QuestionIcon from "@/assets/icons/ph/question.svg";
import SpeedometerIcon from "@/assets/icons/ph/speedometer.svg";

export interface Props {
  class?: string;
}

const { class: className = "" } = Astro.props;

// `card` is the accent colour at ~16% alpha (#RRGGBB29). Literal classes kept
// verbatim for the JIT scanner.
const problems = [
  {
    eyebrow: "Invisible",
    Icon: MapPinIcon,
    color: "text-[#0098f2]",
    card: "bg-[#0098f229]",
    lead: "Customers search Google and AI for a pro",
    rest: "— if you're not there, they call the contractor who is.",
  },
  {
    eyebrow: "Outdated",
    Icon: QuestionIcon,
    color: "text-[#f200ca]",
    card: "bg-[#f200ca29]",
    lead: "A DIY or dated site makes you look risky",
    rest: "— and homeowners scroll right past it.",
  },
  {
    eyebrow: "No time",
    Icon: SpeedometerIcon,
    color: "text-[#6c56fc]",
    card: "bg-[#6c56fc29]",
    lead: "Building and maintaining a site eats hours",
    rest: "— hours you'd rather spend billing real work.",
  },
];
---

<section class={`bg-white px-4 py-20 lg:py-28 ${className}`}>
  <div class="mx-auto max-w-[1024px]">
    <h2
      class="max-w-[20ch] text-[32px] leading-[40px] font-semibold tracking-[-0.03em] text-[#1e1e1e] md:text-[40px] md:leading-[48px]"
    >
      Most contractors are losing jobs before the phone even rings
    </h2>

    <div class="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:mt-20">
      {
        problems.map((p) => {
          const ProblemIcon = p.Icon;
          return (
            <div class="flex flex-col">
              <p class={`text-base font-semibold tracking-[-0.02em] ${p.color}`}>
                {p.eyebrow}
              </p>
              <p class="mt-3 text-base leading-6 font-medium tracking-[-0.02em] text-[#1e1e1e]">
                {p.lead}{" "}
                <span class="text-[#8d8d8d]">{p.rest}</span>
              </p>
              <div
                class={`mt-6 flex h-[156px] items-center justify-center rounded-[20px] ${p.card}`}
              >
                <ProblemIcon class={`size-10 ${p.color}`} />
              </div>
            </div>
          );
        })
      }
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to `src/pages/index.astro`**

Add import below the `AudienceSection` import:
```astro
import ProblemSection from "@components/sections/landing/ProblemSection.astro";
```
Add below `<AudienceSection />`:
```astro
  <ProblemSection />
```

- [ ] **Step 3: Build + visual check**

Run: `bun run build`
Expected: no errors. `bun run dev`: three columns (Invisible / Outdated / No time), each with coloured eyebrow, two-tone sentence, and a pastel card with a large centred coloured icon.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/landing/ProblemSection.astro src/pages/index.astro
git commit -m "feat: add problem section"
```

---

## Task 10: HowItWorksSection

**Files:**
- Create: `src/components/sections/landing/HowItWorksSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/sections/landing/HowItWorksSection.astro`** (carries the `#how-it-works` anchor)

```astro
---
// "How it works" — left-aligned two-line heading, a two-tone subhead, then a
// 3×2 card grid. Top row = the three steps; bottom row = supporting perks. Each
// card is a grey tile with a small accent glyph in a white pill + a short label.
// Phosphor "fill" SVGs imported as native Astro components (fill=currentColor).
import ClipboardTextIcon from "@/assets/icons/ph/clipboard-text.svg";
import StackIcon from "@/assets/icons/ph/stack.svg";
import PaperPlaneTiltIcon from "@/assets/icons/ph/paper-plane-tilt.svg";
import MapPinIcon from "@/assets/icons/ph/map-pin.svg";
import ShieldCheckIcon from "@/assets/icons/ph/shield-check.svg";
import HandshakeIcon from "@/assets/icons/ph/handshake.svg";

export interface Props {
  class?: string;
}

const { class: className = "" } = Astro.props;

// `color` is a literal Tailwind text-colour class (kept verbatim for the JIT
// scanner); the SVG fill is `currentColor`. Top row = steps; bottom row = perks.
const cards = [
  {
    Icon: ClipboardTextIcon,
    color: "text-[#0098f2]",
    label: "Tell us about your business",
  },
  {
    Icon: StackIcon,
    color: "text-[#6c56fc]",
    label: "We design & build your site",
  },
  {
    Icon: PaperPlaneTiltIcon,
    color: "text-[#00b86b]",
    label: "We launch it for you",
  },
  {
    Icon: MapPinIcon,
    color: "text-[#f200ca]",
    label: "Optimized for Google & AI search",
  },
  {
    Icon: ShieldCheckIcon,
    color: "text-[#f59e0b]",
    label: "Fast, secure Cloudflare hosting",
  },
  {
    Icon: HandshakeIcon,
    color: "text-[#06b6d4]",
    label: "Custom features built to your needs",
  },
];
---

<section
  id="how-it-works"
  class={`scroll-mt-24 bg-white px-4 py-20 lg:py-28 ${className}`}
>
  <div class="mx-auto max-w-[1024px]">
    <h2
      class="max-w-[20ch] text-[32px] leading-[40px] font-semibold tracking-[-0.03em] text-[#1e1e1e] md:text-[40px] md:leading-[48px]"
    >
      A website handled for you.<br class="hidden sm:inline" /> From build to bookings.
    </h2>

    <p
      class="mt-5 max-w-[52ch] text-base leading-6 font-medium tracking-[-0.02em] text-[#1e1e1e]"
    >
      Tell us about your business and we take it from there.{" "}
      <span class="text-[#8d8d8d]">
        We design, build, optimize, and host the whole thing &mdash; then keep
        it running so you never have to touch it.
      </span>
    </p>

    <div class="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
      {
        cards.map((c) => {
          const CardIcon = c.Icon;
          return (
            <article class="flex flex-col items-start gap-[18px] rounded-[20px] bg-[#fafafa] p-6">
              <span class="flex size-10 items-center justify-center rounded-full bg-white shadow-[0_2.5px_2.5px_#0000000f]">
                <CardIcon class={`size-[21px] ${c.color}`} />
              </span>
              <p class="max-w-[16ch] text-base leading-6 font-medium tracking-[-0.02em] text-[#1e1e1e]">
                {c.label}
              </p>
            </article>
          );
        })
      }
    </div>
  </div>
</section>
```

- [ ] **Step 2: Add to `src/pages/index.astro`**

Add import below the `ProblemSection` import:
```astro
import HowItWorksSection from "@components/sections/landing/HowItWorksSection.astro";
```
Add below `<ProblemSection />`:
```astro
  <HowItWorksSection />
```

- [ ] **Step 3: Build + visual check**

Run: `bun run build`
Expected: no errors. `bun run dev`: 3×2 grid of steps/perks with white-pill coloured icons. The navbar "How it works" link scrolls here with header offset (`scroll-mt-24`).

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/landing/HowItWorksSection.astro src/pages/index.astro
git commit -m "feat: add how-it-works section"
```

---

## Task 11: CtaSection (closing) + final wiring

**Files:**
- Create: `src/components/sections/landing/CtaSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Create `src/components/sections/landing/CtaSection.astro`** (carries the `#contact` anchor)

```astro
---
import PrimaryButton from "@components/ui/PrimaryButton.astro";
import { SITE } from "@data/constants";

// Closing CTA band above the footer. Anchor target for "Get started" / nav
// "Contact". The button is a mailto so the static site needs no backend yet.
export interface Props {
  class?: string;
}

const { class: className = "" } = Astro.props;
---

<section id="contact" class={`scroll-mt-24 bg-white px-4 pt-10 pb-24 ${className}`}>
  <div
    class="mx-auto max-w-[1024px] overflow-hidden rounded-[32px] bg-ink px-6 py-16 text-center sm:py-20"
  >
    <h2
      class="mx-auto max-w-[20ch] text-[32px] leading-[40px] font-semibold tracking-[-0.03em] text-white md:text-[40px] md:leading-[48px]"
    >
      Ready for a website that brings in work?
    </h2>
    <p
      class="mx-auto mt-4 max-w-[48ch] text-base leading-6 font-medium tracking-[-0.02em] text-white/60"
    >
      Tell us about your business and we&rsquo;ll get your site live &mdash;
      designed, optimized, and hosted, with nothing for you to manage.
    </p>

    {/* Brand-yellow CTA for contrast against the dark band */}
    <PrimaryButton
      href={`mailto:${SITE.email}`}
      size="lg"
      class="mt-8 !bg-brand !text-ink !shadow-none hover:!bg-brand/90"
    >
      Get your website
    </PrimaryButton>
  </div>
</section>
```

- [ ] **Step 2: Add to `src/pages/index.astro`** — final composition should read:

```astro
---
import MainLayout from "@layouts/MainLayout.astro";
import Hero from "@components/sections/landing/Hero.astro";
import TradesMarquee from "@components/sections/landing/TradesMarquee.astro";
import ReviewSection from "@components/sections/landing/ReviewSection.astro";
import AudienceSection from "@components/sections/landing/AudienceSection.astro";
import ProblemSection from "@components/sections/landing/ProblemSection.astro";
import HowItWorksSection from "@components/sections/landing/HowItWorksSection.astro";
import CtaSection from "@components/sections/landing/CtaSection.astro";
---

<MainLayout>
  <Hero />
  <TradesMarquee />
  <ReviewSection />
  <AudienceSection />
  <ProblemSection />
  <HowItWorksSection />
  <CtaSection />
</MainLayout>
```

- [ ] **Step 3: Build + visual check**

Run: `bun run build`
Expected: no errors. `bun run dev`: dark CTA band with yellow button (mailto) sits above the footer; "Get started" / "Contact" nav links scroll to it.

- [ ] **Step 4: Commit**

```bash
git add src/components/sections/landing/CtaSection.astro src/pages/index.astro
git commit -m "feat: add closing CTA section and finalize landing composition"
```

---

## Task 12: Full-page QA pass

**Files:** none (verification + any small fixes uncovered)

- [ ] **Step 1: Production build**

Run: `bun run build`
Expected: completes with no errors/warnings about missing modules; `dist/` generated.

- [ ] **Step 2: Visual + responsive QA**

Run `bun run dev` and verify at desktop (≥1280px), tablet (~768px), and mobile (~375px):
- Navbar floats; mobile hamburger opens/closes the drawer; Escape closes it; CTA visible.
- Hero: status pill pulses, headline scales down cleanly, browser mockup animates in once.
- Trades marquee scrolls and pauses on hover.
- Review uses Caveat for the attribution.
- Audience grid reflows 3→2→1; icons are multicolour.
- Problem columns stack on mobile; pastel cards correct.
- How-it-works grid reflows; anchor scroll lands below the fixed navbar.
- CTA band + footer render; footer email is a working `mailto:`.
- All section anchors (`#how-it-works`, `#audience`, `#contact`) scroll correctly from nav + footer.

- [ ] **Step 3: Reduced-motion check**

In browser devtools, emulate `prefers-reduced-motion: reduce` and reload: the hero mockup appears with no entrance animation, the marquee is static, and the eyebrow ping dot is hidden. No layout shift.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: landing page QA adjustments"
```
(Skip if no changes were needed.)

---

## Self-Review Notes (author)

- **Spec coverage:** foundation/fonts (T1), UI primitives + logo reuse (T2), constants/nav (T3), Navbar+Footer+Layout (T4), hero + browser mockup (T5), trades marquee (T6), review (T7), audience (T8), problem (T9), how-it-works (T10), closing CTA (T11), QA incl. responsive + reduced-motion (T12). All seven spec sections + wiring covered.
- **Accent decision applied:** yellow eyebrow text via `--color-brand-ink`, brand-yellow fills (logo, hero badges, mockup CTA, closing CTA button), dark `PrimaryButton` retained, multicolour icons kept in Audience/Problem/HowItWorks.
- **Out of scope (per spec):** About/Contact/Pricing pages, real testimonial/stats/client logos, backend forms (contact is `mailto:`). Placeholder testimonial is marked `TODO: replace`.
- **Type consistency:** every section reads `{ class?: string }` Props; Phosphor SVGs imported and rendered via a capitalized local (`const X = item.Icon`) to satisfy JSX/Astro component rules; `navCtas` exposes only `signup` and the Navbar references only `navItems`/`navCtas.signup`.
