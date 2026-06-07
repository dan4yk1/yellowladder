// ─── Site Configuration ─────────────────────────────────────────────────────
// Single source of truth for all site-wide metadata and SEO defaults.
// TODO: Replace all placeholder values before launch.

export const SITE = {
  title: "My Website",
  tagline: "A modern web experience",
  description:
    "TODO: Write a compelling site description for SEO (150-160 characters).",
  url: "https://example.com", // TODO: Replace with production URL (no trailing slash)
  author: "Your Name", // TODO: Replace with author name
  titleTemplate: "%s | My Website", // %s is replaced with the page title
  twitterHandle: "@yourhandle", // TODO: Replace with Twitter/X handle
  themeColor: "#ffffff", // TODO: Set brand theme color
  organization: {
    name: "Your Organization", // TODO: Replace with organization name
    url: "https://example.com",
    logo: "/logo.svg", // TODO: Add logo to public/
  },
} as const;

// ─── Open Graph Defaults ────────────────────────────────────────────────────

export const OG = {
  locale: "en_US",
  type: "website",
  image: "/og-default.jpg", // TODO: Add default OG image to public/ (1200x630)
  imageAlt: "TODO: Describe your default OG image",
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
