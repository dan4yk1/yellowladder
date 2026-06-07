// ─── Navigation Data ────────────────────────────────────────────────────────
// Centralized navigation data used by Navbar, Footer, and other components.
// TODO: Update links and labels for your project.

export interface NavLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: NavLink[];
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  youtube?: string;
}

// ─── Navbar Links ───────────────────────────────────────────────────────────

export const navBarLinks: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// ─── Footer Links ───────────────────────────────────────────────────────────

export const footerLinks: FooterSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

// ─── Social Links ───────────────────────────────────────────────────────────

export const socialLinks: SocialLinks = {
  twitter: "https://twitter.com/yourhandle", // TODO: Replace
  github: "https://github.com/yourhandle", // TODO: Replace
  linkedin: "https://linkedin.com/company/yourcompany", // TODO: Replace
};
