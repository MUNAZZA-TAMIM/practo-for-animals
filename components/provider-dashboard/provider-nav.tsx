"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePenLine,
  Palette,
  Calendar,
  Settings,
  ShieldAlert,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Provider } from "@/lib/data/providers";

const primaryLinks = [
  {
    href: "/provider-dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    href: "/provider-dashboard/listing",
    label: "Listing",
    icon: FilePenLine,
  },
  {
    href: "/provider-dashboard/services",
    label: "Services",
    icon: Palette,
  },
  {
    href: "/provider-dashboard/appointments",
    label: "Appointment requests",
    icon: Calendar,
  },
  {
    href: "/provider-dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
] as const;

export function ProviderNav({
  provider,
  variant = "sidebar",
}: {
  provider: Provider;
  variant?: "sidebar" | "mobile";
}) {
  const pathname = usePathname();

  const links = [...primaryLinks];

  if (variant === "mobile") {
    return (
      <nav aria-label="Provider workspace" className="hide-scrollbar flex gap-1.5 overflow-x-auto">
        {links.map((link) => {
          const active =
            link.href === "/provider-dashboard"
              ? pathname === "/provider-dashboard"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={`${link.href}?provider=${provider.slug}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10.5px] font-semibold transition-colors",
                active
                  ? "border-forest-900 bg-forest-900 text-ivory-50"
                  : "border-line bg-white-warm text-forest-800",
              )}
            >
              <Icon className="h-3 w-3" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Provider workspace" className="space-y-5 px-3">
      <div>
        <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ivory-50/35">
          Practice desk
        </p>
        <ul className="space-y-0.5">
          {links.map((link) => {
            const active =
              link.href === "/provider-dashboard"
                ? pathname === "/provider-dashboard"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={`${link.href}?provider=${provider.slug}`}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold transition-colors",
                    active
                      ? "bg-ivory-50/10 text-ivory-50"
                      : "text-ivory-50/55 hover:bg-ivory-50/6 hover:text-ivory-50",
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      active ? "text-coral-300" : "text-ivory-50/40 group-hover:text-ivory-50/70",
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-ivory-50/10 pt-4 pb-4 px-3">
        <div className="flex items-center gap-2.5 rounded-xl border border-line bg-white-warm p-2.5">
          <ShieldAlert className="h-4 w-4 text-coral-500" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-forest-900">
              Demo workspace
            </p>
            <p className="text-[9px] text-ink-muted/60">
              Provider authorization not yet connected
            </p>
          </div>
        </div>
      </div>
    </nav>
  );
}
