import type { APIRoute } from "astro";
import { SITE } from "@data/constants";

export const GET: APIRoute = () => {
  const sitemapUrl = new URL("/sitemap-index.xml", SITE.url).href;

  const body = [
    // Allow major search engines
    "User-agent: Googlebot",
    "Allow: /",
    "",
    "User-agent: Bingbot",
    "Allow: /",
    "",
    "User-agent: DuckDuckBot",
    "Allow: /",
    "",
    "User-agent: Yandex",
    "Allow: /",
    "",
    // Block AI crawlers
    "User-agent: GPTBot",
    "Disallow: /",
    "",
    "User-agent: ChatGPT-User",
    "Disallow: /",
    "",
    "User-agent: Google-Extended",
    "Disallow: /",
    "",
    "User-agent: CCBot",
    "Disallow: /",
    "",
    "User-agent: anthropic-ai",
    "Disallow: /",
    "",
    "User-agent: ClaudeBot",
    "Disallow: /",
    "",
    // Default: allow all other crawlers
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${sitemapUrl}`,
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
