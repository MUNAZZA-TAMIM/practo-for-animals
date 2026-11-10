"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { NavLinks } from "./nav-links";
import { MobileNav } from "./mobile-nav";
import { UserProfileDropdown } from "./user-profile-dropdown";
import type { SessionUser } from "@/lib/auth/token";

export function SiteHeaderClient({
  session,
}: {
  session: SessionUser | null;
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const isHome = pathname === "/";

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "inset-x-0 z-40 transition-all duration-300",
        isHome
          ? cn(
              "absolute top-0 bg-transparent border-b border-transparent",
              scrolled && "bg-white/95 backdrop-blur-md shadow-sm border-stone-200/80"
            )
          : "sticky top-0 bg-ivory-50/92 backdrop-blur-md border-b border-line/80"
      )}
    >
      <div className="container-page flex h-[82px] items-center justify-between gap-4">
        <Logo />

        <NavLinks className="hidden lg:flex" />

        <div className="flex items-center gap-3 sm:gap-4">
          {/* 1. Book Appointment button comes FIRST */}
          <Link
            href="/book-appointment"
            className="hidden items-center gap-2.5 rounded-full bg-[#103a2f] hover:bg-[#0b2820] px-5.5 py-3 text-[13.5px] font-bold text-white shadow-sm transition-transform active:scale-[0.98] sm:inline-flex"
          >
            <CalendarCheck className="h-5 w-5 text-white stroke-[2.2]" aria-hidden="true" />
            <span>Book Appointment</span>
          </Link>

          {/* 2. User Profile / Sign In comes LAST (after Book Appointment) */}
          {session ? (
            <UserProfileDropdown user={session} />
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-full px-3.5 py-2 text-[14.5px] font-extrabold text-black transition-colors hover:text-[#103a2f] hover:bg-black/5 sm:flex"
            >
              <User
                className="h-5 w-5 text-black stroke-[2.4]"
                aria-hidden="true"
              />
              <span>Sign In</span>
            </Link>
          )}

          {/* 3. Mobile Navigation Menu Toggle */}
          <MobileNav signedIn={Boolean(session)} userName={session?.name} />
        </div>
      </div>
    </header>
  );
}
