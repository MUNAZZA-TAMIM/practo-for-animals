import Link from "next/link";
import { ArrowUpRight, PawPrint } from "lucide-react";
import { footerLinks, siteConfig } from "@/lib/site";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-forest-950 text-ivory-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-ivory-50/10" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-52 w-52 rounded-full border border-ivory-50/10" />

      <div className="container-page relative">
        <div className="grid gap-12 border-b border-ivory-50/12 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="max-w-xl">
            <Logo variant="light" />
            <p className="mt-5 max-w-2xl text-[14px] leading-7 text-ivory-50/66">
              Helping people discover animal-care services for the animals they love.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterColumn
              title="Care"
              links={[
                { href: "/find", label: "Find Care" },
                { href: "/content-studio", label: "Explore Services" },
                { href: "/find?type=emergency", label: "Emergency Care" },
                { href: "/find?type=rescue", label: "Rescues & NGOs" },
                { href: "/submit-correction", label: "Report Incorrect Information" },
              ]}
            />
            <FooterColumn
              title="Platform"
              links={footerLinks.platform}
            />
          </div>
        </div>

        <div className="grid gap-8 py-9 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="mt-5 max-w-2xl text-[11.5px] leading-6 text-ivory-50/48">
              {siteConfig.disclaimer} Photography via Unsplash and Pexels, used
              illustratively under their licences. No provider verification,
              ratings, testimonials, course placements, or partnerships are
              claimed.
            </p>
          </div>
          <div className="flex items-center gap-5 text-[11.5px] text-ivory-50/48">
            <span>© {new Date().getFullYear()} Practo for Animals concept</span>
            <span className="hidden h-6 w-px bg-ivory-50/15 sm:block" />
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory-50/15 text-mint-300">
              <PawPrint className="h-4 w-4" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-mint-300/80">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-[12.5px] leading-5 text-ivory-50/70 transition-colors hover:text-ivory-50"
              target={link.href.startsWith("mailto:") ? undefined : "_self"}
              rel={link.href.startsWith("mailto:") ? undefined : undefined}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
