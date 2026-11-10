"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FilePenLine,
  Inbox,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/auth/demo-accounts";

const primaryLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/providers", label: "Providers", icon: Building2 },
  { href: "/dashboard/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/dashboard/corrections", label: "Corrections", icon: FilePenLine },
  { href: "/dashboard/content", label: "Content desk", icon: Sparkles },
  { href: "/dashboard/workflows", label: "Workflows", icon: Workflow },
] as const;

export function WorkspaceNav({
  role,
  variant = "sidebar",
  counts,
}: {
  role: UserRole;
  variant?: "sidebar" | "mobile";
  counts?: { enquiries?: number; corrections?: number; content?: number };
}) {
  const pathname = usePathname();

  const badgeFor = (href: string) => {
    if (href === "/dashboard/enquiries") return counts?.enquiries;
    if (href === "/dashboard/corrections") return counts?.corrections;
    if (href === "/dashboard/content") return counts?.content;
    return undefined;
  };

  const links =
    role === "admin"
      ? [...primaryLinks, { href: "/admin", label: "Admin console", icon: ShieldCheck }]
      : [...primaryLinks];

  if (variant === "mobile") {
    return (
      <nav aria-label="Workspace" className="hide-scrollbar flex gap-1.5 overflow-x-auto">
        {links.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
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
    <nav aria-label="Workspace" className="space-y-5 px-3">
      <div>
        <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ivory-50/35">
          Care desk
        </p>
        <ul className="space-y-0.5">
          {primaryLinks.map((link) => {
            const active =
              link.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;
            const count = badgeFor(link.href);
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

      {role === "admin" ? (
        <div className="border-t border-ivory-50/10 pt-4">
          <p className="px-3 pb-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ivory-50/35">
            Administration
          </p>
          <Link
            href="/admin"
            aria-current={pathname === "/admin" ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[12px] font-semibold transition-colors",
              pathname === "/admin"
                ? "bg-ivory-50/10 text-ivory-50"
                : "text-ivory-50/55 hover:bg-ivory-50/6 hover:text-ivory-50",
            )}
          >
            <ShieldCheck
              className={cn(
                "h-4 w-4 shrink-0",
                pathname === "/admin" ? "text-coral-300" : "text-ivory-50/40",
              )}
              aria-hidden="true"
            />
            Admin console
          </Link>
        </div>
      ) : null}
    </nav>
  );
}
