export const SITE_CONFIG = {
  name: "CropIQ",
  title: "CropIQ | AI Crop & Fruit Detection",
  description:
    "Premium AI-powered agriculture platform for crop disease detection and fruit detection on Android.",
  url: "https://cropiq.vercel.app",
  ogImage: "/og-image.png",
  version: "1.0.0",
  links: {
    github: "https://github.com/",
    supportEmail: "support@cropiq.app",
  },
} as const;

export const FOOTER_LINKS = {
  quick: [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/download", label: "Download" },
    { href: "/about", label: "About" },
    { href: "/support", label: "Support" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
  ],
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/download", label: "Download" },
  { href: "/about", label: "About" },
  { href: "/support", label: "Support" },
] as const;

export const ADMIN_WHITELIST = [
  "shreyaspawar1011@gmail.com",
] as const;
