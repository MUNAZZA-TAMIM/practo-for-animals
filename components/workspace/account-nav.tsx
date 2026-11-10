"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar,
  LayoutDashboard,
  PawPrint,
} from "lucide-react";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/account/appointments", label: "My appointments", icon: Calendar },
  { href: "/account/animals", label: "My animals", icon: PawPrint },
] as const;

export function AccountNav({
  variant = "sidebar",
  counts,
}: {
  variant?: "sidebar" | "mobile";
  counts?: { appointments?: number };
}) {
  const pathname = usePathname();

  const links = [...primaryLinks];

  if (variant === "mobile") {
    return (
      <nav aria-label="Account" className="hide-scrollbar flex gap-1.5 overflow-x-auto">
        {links.map((link) => {
          const active =
            link.href === "/account"
              ? pathname === "/account"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
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
    <nav aria-label="Account" className="space-y-5 px-3">
      <div>
        <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ivory-50/35">
          Your care
        </p>
        <ul className="space-y-0.5">
          {links.map((link) => {
            const active =
              link.href === "/account"
                ? pathname === "/account"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            const count =
              link.href === "/account/appointments" ? counts?.appointments : undefined;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
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
                  {typeof count === "number" && count > 0 ? (
                    <span
                      className={cn(
                        "grid h-5 min-w-5 place-items-center rounded-full px-1 text-[9px] font-bold",
                        active
                          ? "bg-coral-500 text-forest-950"
                          : "bg-ivory-50/10 text-ivory-50/70",
                      )}
                    >
                      {count}
                    </span>
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
