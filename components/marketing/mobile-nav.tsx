"use client";

import * as React from "react";
import Link from "next/link";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { footerLinks, navLinks } from "@/lib/site";

export function MobileNav({
  signedIn,
  userName,
}: {
  signedIn: boolean;
  userName?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="grid h-12 w-12 place-items-center rounded-full border border-black/20 bg-white/90 text-black shadow-xs transition-colors hover:bg-black/5 lg:hidden"
        >
          <Menu className="h-6 w-6 text-black stroke-[2.2]" aria-hidden="true" />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-forest-950/40 backdrop-blur-sm lg:hidden" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-y-auto bg-ivory-50 p-5 lg:hidden"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between">
            <Logo />
            <DialogPrimitive.Close asChild>
              <button
                type="button"
                aria-label="Close menu"
                className="grid h-11 w-11 place-items-center rounded-full border border-forest-900/15 bg-white-warm text-forest-900"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </DialogPrimitive.Close>
          </div>

          <DialogPrimitive.Title className="sr-only">
            Practo for Animals menu
          </DialogPrimitive.Title>

          <nav aria-label="Mobile primary" className="mt-10 flex flex-col">
            {navLinks.map((link, index) => (
              <DialogPrimitive.Close asChild key={link.href}>
                <Link
                  href={link.href}
                  className="group flex items-baseline justify-between border-b border-line py-5"
                >
                  <span className="flex items-baseline gap-4">
                    <span className="text-[10px] font-bold tracking-[0.16em] text-coral-ink">
                      0{index + 1}
                    </span>
                    <span className="font-display text-[34px] leading-none tracking-[-0.03em] text-forest-900 transition-colors group-hover:text-forest-700">
                      {link.label}
                    </span>
                    {link.badge ? (
                      <span className="ml-2 rounded-sm bg-[#fef3c7] px-2 py-0.5 text-[11px] font-bold text-[#92400e]">
                        {link.badge}
                      </span>
                    ) : null}
                  </span>
                  <ArrowUpRight
                    className="h-5 w-5 text-forest-600 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </DialogPrimitive.Close>
            ))}
          </nav>

          <div className="mt-auto space-y-6 pt-10">
            <div className="grid gap-2">
              <Button asChild size="lg" className="w-full justify-between px-5 bg-[#103a2f] hover:bg-[#0b2820] text-white">
                <DialogPrimitive.Close asChild>
                  <Link href="/book-appointment">
                    Book Appointment
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </DialogPrimitive.Close>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="w-full justify-between px-5"
              >
                <DialogPrimitive.Close asChild>
                  <Link href={signedIn ? "/dashboard" : "/login"}>
                    {signedIn ? `Dashboard${userName ? ` · ${userName.split(" ")[0]}` : ""}` : "Sign in to the workspace"}
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </DialogPrimitive.Close>
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] font-semibold text-ink-muted">
              {footerLinks.platform.slice(0, 4).map((link) => (
                <DialogPrimitive.Close asChild key={link.href}>
                  <Link href={link.href} className="hover:text-forest-900">
                    {link.label}
                  </Link>
                </DialogPrimitive.Close>
              ))}
            </div>
            <p className="border-t border-line pt-4 text-[11px] leading-5 text-ink-muted/80">
              Independent concept · Sample directory data · Not an official Practo product.
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
