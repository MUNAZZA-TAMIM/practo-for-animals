"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

export function NavLinks({
  className,
}: {
  className?: string;
  variant?: "dark" | "light";
}) {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className={cn("flex items-center gap-2 sm:gap-3", className)}>
      {navLinks.map((link) => {
        const linkPath = link.href.split("?")[0];
        const active =
          pathname === link.href || (linkPath !== "/" && pathname.startsWith(linkPath));
        return (
          <Link
            key={link.label}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center rounded-full px-3.5 py-1.5 text-[14.5px] font-bold tracking-[-0.01em] text-black transition-colors hover:text-[#103a2f] hover:bg-black/5",
              active && "underline underline-offset-4 decoration-2 decoration-[#103a2f]"
            )}
          >
            <span>{link.label}</span>
            {link.badge ? (
              <span className="ml-1.5 rounded-sm bg-[#fef3c7] px-2 py-0.5 text-[10px] font-extrabold tracking-tight text-black border border-[#fde68a]">
                {link.badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
