# Astro Web Template

A reusable starter template for new web projects built with **Astro 5**, **Tailwind CSS v4**, and deployed to **Cloudflare**.

## Stack

- [Astro 5](https://astro.build) — Static site framework
- [Tailwind CSS v4](https://tailwindcss.com) — Utility-first CSS
- [Cloudflare](https://developers.cloudflare.com/pages) — Edge deployment
- [astro-seo](https://github.com/jonasmerlin/astro-seo) — SEO meta tags
- [astro-icon](https://github.com/natemoo-re/astro-icon) — Icon components
- [MDX](https://mdxjs.com) — Markdown with components

## Project Structure

```
src/
├── components/
│   ├── global/        # Navbar, Footer, Meta
│   ├── ui/            # Buttons, links, cards
│   └── sections/      # Hero, features, CTA
├── data/
│   └── constants.ts   # Site config & SEO defaults
├── utils/
│   └── navigation.ts  # Nav & footer link data
├── layouts/
│   └── MainLayout.astro
├── pages/
│   ├── index.astro
│   └── robots.txt.ts
├── assets/
│   └── images/
└── styles/
    └── global.css
```

## Getting Started

```sh
bun install
bun run dev
```

## Commands

| Command            | Action                                 |
| :----------------- | :------------------------------------- |
| `bun install`      | Install dependencies                   |
| `bun run dev`      | Start dev server at `localhost:4321`   |
| `bun run build`    | Build production site to `./dist/`     |
| `bun run preview`  | Preview build locally before deploying |

## Features

- Full SEO setup via `Meta.astro` — OG tags, JSON-LD structured data, Twitter cards
- Dynamic `robots.txt` blocking AI crawlers
- Auto-generated sitemap
- Path aliases (`@components/`, `@data/`, `@utils/`, etc.)
- TypeScript strict mode
- Prettier with Astro & Tailwind plugins
