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
