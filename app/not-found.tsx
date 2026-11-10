import Link from "next/link";
import { ArrowLeft, Compass, LifeBuoy, PawPrint } from "lucide-react";
import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-dvh flex-col bg-ivory-50">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-25" aria-hidden="true" />
      <header className="relative container-page flex h-20 items-center justify-between">
        <Logo />
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted/50">
          404 · Page not found
        </span>
      </header>

      <main className="relative flex flex-1 items-center">
        <div className="container-page grid gap-10 pb-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="kicker">A wrong turn</p>
            <h1 className="mt-5 text-[54px] leading-[0.94] tracking-[-0.05em] text-forest-900 sm:text-[76px]">
              This path does not{" "}
              <span className="display-italic text-coral-500">lead anywhere.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[14px] leading-7 text-ink-muted">
              The page may have moved, or the link may belong to another version
              of the concept. The directory, academy, and studio are still open.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Button asChild>
                <Link href="/">
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to home
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/find">
                  <Compass className="h-4 w-4" aria-hidden="true" />
                  Find care
                </Link>
              </Button>
              <Button asChild variant="weakness">
                <Link href="/content-studio">
                  <LifeBuoy className="h-4 w-4" aria-hidden="true" />
                  Content Studio
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="arch border border-line bg-white-warm p-8 text-center shadow-float">
              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-mint-100 text-forest-800">
                <PawPrint className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="mt-6 font-display text-[92px] leading-none tracking-[-0.06em] text-forest-900">
                404
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-coral-ink">
                No trail here
              </p>
              <p className="mt-4 text-[11.5px] leading-6 text-ink-muted">
                A useful next step is usually simpler than the page you were
                looking for.
              </p>
            </div>
            <div
              className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full border border-coral-500/30"
              aria-hidden="true"
            />
          </div>
        </div>
      </main>

      <footer className="relative border-t border-line py-5">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 text-[9px] text-ink-muted/50">
          <span>Practo for Animals · Independent demonstration concept</span>
          <span>Sample data · No veterinary advice</span>
        </div>
      </footer>
    </div>
  );
}
