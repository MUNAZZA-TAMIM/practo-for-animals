"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calendar,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  PawPrint,
  Settings,
  ShieldAlert,
  User,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { logoutAction } from "@/app/login/actions";
import type { SessionUser } from "@/lib/auth/token";

export function UserProfileDropdown({ user }: { user: SessionUser }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button: User Avatar + Name/Dashboard + Chevron */}
      <button
        type="button"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={cn(
          "hidden sm:flex items-center gap-2 rounded-full border border-black/15 bg-white/95 py-1.5 pl-1.5 pr-3 text-[13px] font-bold text-black shadow-xs transition-all duration-200 hover:bg-white hover:border-black/30 active:scale-[0.98]",
          isOpen && "ring-2 ring-[#103a2f]/20 border-[#103a2f]"
        )}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#103a2f] text-[11px] font-bold text-white shadow-xs">
          {initials(user.name)}
        </span>
        <span className="max-w-[110px] truncate">{user.name.split(" ")[0]}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-black transition-transform duration-200",
            isOpen && "rotate-180 text-[#103a2f]"
          )}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-2 w-72 origin-top-right rounded-2xl border border-stone-200/90 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150 focus:outline-hidden"
          role="menu"
          aria-orientation="vertical"
        >
          {/* User Profile Header Details */}
          <div className="flex items-center gap-3 p-3 bg-stone-50/80 rounded-xl border border-stone-100">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#103a2f] text-[13px] font-black text-white shadow-xs">
              {initials(user.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-extrabold text-stone-900 leading-tight">
                {user.name}
              </p>
              <p className="truncate text-[11px] font-medium text-stone-500 mt-0.5">
                {user.email}
              </p>
              <span className="inline-block mt-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[9.5px] font-bold text-emerald-800 border border-emerald-200/70 capitalize">
                {user.role} Account
              </span>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="mt-2 space-y-0.5">
            <Link
              href="/dashboard"
              onClick={closeDropdown}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900"
              role="menuitem"
            >
              <LayoutDashboard className="h-4 w-4 text-[#103a2f]" />
              <span>Founder Dashboard</span>
            </Link>

            <Link
              href="/account"
              onClick={closeDropdown}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900"
              role="menuitem"
            >
              <User className="h-4 w-4 text-[#103a2f]" />
              <span>Account Profile</span>
            </Link>

            <Link
              href="/account/appointments"
              onClick={closeDropdown}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900"
              role="menuitem"
            >
              <Calendar className="h-4 w-4 text-[#103a2f]" />
              <span>My Appointments</span>
            </Link>

            <Link
              href="/account/animals"
              onClick={closeDropdown}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-stone-700 transition-colors hover:bg-stone-100 hover:text-stone-900"
              role="menuitem"
            >
              <PawPrint className="h-4 w-4 text-[#103a2f]" />
              <span>My Animals</span>
            </Link>

            {user.role === "admin" && (
              <Link
                href="/admin"
                onClick={closeDropdown}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-amber-900 transition-colors hover:bg-amber-50"
                role="menuitem"
              >
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <span>Admin Console</span>
              </Link>
            )}

            {user.role === "provider" && (
              <Link
                href="/provider-dashboard"
                onClick={closeDropdown}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-semibold text-emerald-900 transition-colors hover:bg-emerald-50"
                role="menuitem"
              >
                <Settings className="h-4 w-4 text-emerald-700" />
                <span>Provider Portal</span>
              </Link>
            )}
          </div>

          {/* Divider */}
          <div className="my-1.5 border-t border-stone-100" />

          {/* Logout Action */}
          <form action={logoutAction} className="w-full">
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[13px] font-bold text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 cursor-pointer"
              role="menuitem"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              <span>Sign out / Log out</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
