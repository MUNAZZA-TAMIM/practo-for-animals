export const siteConfig = {
  name: "Practo for Animals",
  shortName: "PFA",
  tagline: "Better care starts with a clearer path.",
  description:
    "Find animal-care providers, learn practical AI skills for animal health, and create reviewed carousel content — in one connected platform.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  demoEmail: "hello@practoforanimals.demo",
  location: "Bengaluru, India",
  disclaimer:
    "Independent internship concept. Not an official Practo product. Directory listings are sample data and do not represent real businesses, verification, ratings, or partnerships.",
} as const;

export type NavLink = {
  href: string;
  label: string;
  badge?: string;
};

export const navLinks: readonly NavLink[] = [
  { href: "/find?type=specialties", label: "Specialties" },
  { href: "/find", label: "Directory" },
  { href: "/education", label: "Care Protocol" },
  { href: "/list-business", label: "For Providers", badge: "Partner" },
] as const;

export const footerLinks = {
  care: [
    { href: "/find", label: "Find a provider" },
    { href: "/find?type=emergency", label: "Emergency care" },
    { href: "/find?feature=home-visits", label: "Home visits" },
    { href: "/find?type=rescue", label: "Rescues & NGOs" },
    { href: "/submit-correction", label: "Correct a listing" },
  ],
  learn: [
    { href: "/education", label: "AI Academy" },
    { href: "/programs/ai-for-animal-health-teams", label: "For veterinary teams" },
    { href: "/programs/ai-content-for-pet-care-brands", label: "For pet-care brands" },
    { href: "/content-studio", label: "Content Studio" },
  ],
  platform: [
    { href: "/list-business", label: "List Your Business" },
    { href: "/dashboard", label: "Founder dashboard" },
    { href: "/login", label: "Sign in" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/find", label: "About" },
    { href: `mailto:${siteConfig.demoEmail}`, label: "Contact" },
  ],
} as const;

export const partnerNote =
  "An independent concept exploring a calmer, more useful animal-care platform.";

export const DEMO_BANNER =
  "Demo environment · Sample directory data · Simulated AI research";

export function absoluteUrl(path = "/") {
  return `${siteConfig.url.replace(/\/$/, "")}${path}`;
}
