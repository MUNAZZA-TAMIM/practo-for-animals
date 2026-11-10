"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error.digest ?? "no-digest");
  }, [error]);

  return (
    <div className="relative flex min-h-dvh flex-col bg-ivory-50">
      <div className="pointer-events-none absolute inset-0 dot-grid opacity-20" aria-hidden="true" />
      <header className="relative container-page flex h-20 items-center justify-between">
        <Link href="/" className="text-[20px] font-extrabold tracking-[-0.05em] text-forest-900">
          practo<span className="text-coral-500">.</span>{" "}
          <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-forest-700">
            for animals
          </span>
        </Link>
        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-ink-muted/50">
          Something went wrong
        </span>
      </header>

      <main className="relative flex flex-1 items-center">
        <div className="container-page max-w-2xl pb-16">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-danger-bg text-danger-ink">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="kicker mt-6">A small interruption</p>
          <h1 className="mt-4 text-[46px] leading-[0.98] tracking-[-0.045em] text-forest-900 sm:text-[60px]">
            The page could not finish{" "}
            <span className="display-italic text-coral-500">its thought.</span>
          </h1>
          <p className="mt-4 max-w-lg text-[13.5px] leading-7 text-ink-muted">
            This may be a temporary local data or rendering error. No stack
            trace is shown here. You can retry, or return to a stable page.
          </p>
          {error.digest ? (
            <p className="mt-3 font-mono text-[10px] text-ink-muted/50">
              Reference: {error.digest}
            </p>
          ) : null}
          <div className="mt-7 flex flex-wrap gap-2.5">
            <Button onClick={reset}>
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to home
              </Link>
            </Button>
            <Button asChild variant="weakness">
              <Link href="/find">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Browse the directory
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <footer className="relative border-t border-line py-5">
        <div className="container-page text-[9px] text-ink-muted/50">
          If this keeps happening, restart the local demo and check the server
          log. The local store may be locked or malformed.
        </div>
      </footer>
    </div>
  );
}
