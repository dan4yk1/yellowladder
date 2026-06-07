# YellowLadder Landing Page — Design Spec

**Date:** 2026-06-07
**Status:** Approved design → ready for implementation plan

## 1. Overview

YellowLadder is a website agency for construction-industry contractors. It offers:
website creation with hosting, GEO-optimized (AI/generative-search) websites, and
custom implementations tailored to a client's needs. Positioning is a **website
agency / WaaS**, not a lead-generation tool.

This spec covers building the **landing page only** (home page + shared Navbar,
Footer, and design-system foundation). Other pages are linked but not built.

## 2. Design Direction

Replicate the design system of `~/Desktop/dev/permitclerkmarketing` **1:1** — fonts,
palette, spacing, card treatment, floating-pill navbar, and animations — then pour
YellowLadder's content into permitclerk's exact section molds.

**The one deliberate divergence:** accent color. permitclerk uses blue/purple
accents; YellowLadder uses **yellow as the primary accent with dark buttons**, while
**keeping multicolor icons** where sections use them (hybrid).

### Source design system (permitclerk, to copy)
- Astro 6 + Tailwind v4 + Cloudflare + bun (identical stack to yellowladder).
- **Fonts:** Open Runde (local `.woff2`, weights 400/500/600 only — no 700) +
  Caveat (script accent, via Astro Fonts API / Bunny provider).
- **Palette:** page `#fafafa`, ink `#14151a` / heading text `#1e1e1e`, body grey
  `#8d8d8d`, hairlines `black/[0.05–0.06]`.
- **Buttons:** dark fill `#0d111b`, white text, `rounded-full`, ring + soft shadow.
- **Cards:** white, `ring-1 ring-black/[0.05]`, soft drop shadow.
- **Navbar:** fixed floating white pill, `backdrop-blur`, (mega-menus optional).
- **Aesthetic:** light/airy, typography-forward, soft shadows, rounded, Acctual-like.

## 3. Decisions (resolved)

| Topic | Decision |
| --- | --- |
| Accent color | Yellow primary + dark buttons; keep multicolor section icons |
| Scope | Landing page only |
| Brand name / logo | "YellowLadder" (plain wordmark, no `.ai`) |
| Hero centerpiece | Single centered browser mockup of a contractor website |
| Hero eyebrow | Status pill (pulsing dot), no numbers — e.g. "Now onboarding new contractors" |
| LogoLoop section | Marquee of trades served (text pills) |
| Footer | New component (permitclerk has none); same aesthetic |

## 4. Theme Tokens & Fonts

Add to `src/styles/global.css`:
- `@font-face` for the three Open Runde weights (files copied into
  `src/assets/fonts/`).
- `@theme` block:
  - `--color-page: #fafafa`
  - `--color-ink: #14151a`
  - `--color-brand: #f5b50a` (logo yellow; used for fills/accents)
  - `--color-brand-ink: #b8860b` (darker yellow for eyebrow **text** so it stays
    legible on white — exact value tuned during build for contrast)
  - `--font-sans: "Open Runde", ui-sans-serif, system-ui, …`
  - `--font-script: var(--font-caveat), ui-sans-serif, cursive`
  - `--animate-marquee` + `@keyframes marquee` (for the trades loop)
  - `--animate-card-in` + `@keyframes card-in` (browser-mockup intro)

Add to `astro.config.mjs`: `fonts: [{ provider: fontProviders.bunny(), name: "Caveat",
cssVariable: "--font-caveat", weights: [400,500,600,700] }]`. Add `<Font
cssVariable="--font-caveat" preload />` to `MainLayout.astro`.

## 5. Components

### UI (`src/components/ui/`)
- **`Logo.astro`** — lifted from permitclerk's `YellowladderLogo.astro` (yellow "Y"
  + dark "ellowladder" wordmark, `.ai` suffix off). Used in navbar + footer.
- **`PrimaryButton.astro`** — copied verbatim (dark fill, pill, ring+shadow).
- **`Icon.astro`** — copied (inline SVG, inherits `currentColor`).
- **`BrowserMockup.astro`** — NEW. A browser-window chrome (dot controls + URL bar)
  framing a stylized contractor website (hero header, nav, a hero block with a CTA,
  a few skeleton content rows / service tiles). Soft shadow + ring like permitclerk's
  cards. This is the hero centerpiece.

### Global (`src/components/global/`)
- **`Navbar.astro`** — permitclerk's floating-pill navbar, re-content'd: Logo +
  links as on-page section anchors ("Services" → `#how-it-works`, "Who it's for" →
  `#audience`, "Contact" → `#contact`/footer) + primary CTA ("Get started" →
  `#contact`). Mobile drawer retained. (Pricing/About omitted — those pages are out
  of scope this pass.)
- **`Footer.astro`** — NEW. Logo + short blurb, link columns (Services, Company,
  Legal), contact/email, copyright. Light aesthetic, hairline top border.
- **`Meta.astro`** — already exists; unchanged.

### Sections (`src/components/sections/landing/`)
1. **`Hero.astro`** — status eyebrow pill (pulsing dot, no numbers); headline
   (working: "Websites that book contractors more jobs"); subhead (build · host ·
   get found on Google & AI search); `PrimaryButton` CTA + secondary text link;
   three trust badges ("Built & hosted for you" · "Found on Google & AI search" ·
   "No DIY headaches"); centered `BrowserMockup`; bottom gradient fade into next
   section. No decorative props (permit-specific).
2. **`TradesMarquee.astro`** (was LogoLoop) — heading line + infinite marquee of
   trade-type pills (Electricians, Plumbers, HVAC, Roofers, Remodelers, Concrete,
   Landscapers, Painters…), edge-fade mask, pause on hover.
3. **`ReviewSection.astro`** — 5 stars, large quote, Caveat attribution.
   **Testimonial copy is placeholder, clearly marked `TODO: replace`.**
4. **`AudienceSection.astro`** — "Who it's for" trade card grid with multicolor
   Phosphor/Lucide icons; final card "Don't see your trade? We work with all
   contractors."
5. **`ProblemSection.astro`** — "Why contractors lose work online", 3 columns:
   *Invisible* (not on Google/AI), *Outdated* (DIY sites lose trust), *No time*
   (can't build/maintain it). Colored eyebrow + two-tone paragraph + pastel icon card.
6. **`HowItWorksSection.astro`** — 3×2 grid. Steps: *Tell us about your business →
   We design & build → We host & manage.* Perks: *GEO / AI-search optimized · Fast,
   secure Cloudflare hosting · Custom features built to your needs.*
7. **`CtaSection.astro`** — short closing CTA band (headline + `PrimaryButton`)
   above the footer.

## 6. Wiring

- **`src/data/constants.ts`** — replace template placeholders with YellowLadder
  values: title "YellowLadder", tagline, SEO description, `url`
  (`https://yellowladder.ai` pending confirmation), author/org, `logo: "/yellowladder.svg"`,
  `themeColor`.
- **`src/layouts/MainLayout.astro`** — uncomment/enable Navbar + Footer; add Caveat
  `<Font>`.
- **`src/pages/index.astro`** — compose: Hero → TradesMarquee → ReviewSection →
  AudienceSection → ProblemSection → HowItWorksSection → CtaSection.
- **`public/`** — keep SVG logos + favicons here (correct use: favicon, OG, fallback).

## 7. Out of Scope (this pass)

- About / Contact / Pricing / Privacy / Terms pages (links may point to anchors or
  `#` for now).
- Real testimonials, real stats, real client logos.
- Backend / forms (contact form can be a `mailto:` or stub).

## 8. Success Criteria

- `bun run dev` renders a complete, polished landing page visually consistent with
  permitclerk's design language but yellow-accented and YellowLadder-branded.
- `bun run build` succeeds for the Cloudflare target.
- All copy is YellowLadder-specific; placeholders (testimonial) are clearly marked.
- Responsive (mobile drawer works; sections reflow) and respects
  `prefers-reduced-motion`.
