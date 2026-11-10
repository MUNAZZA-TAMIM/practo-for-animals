import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  breadcrumbs,
  className,
  align = "split",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  breadcrumbs?: { href: string; label: string }[];
  className?: string;
  align?: "split" | "center";
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-line bg-ivory-100",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -right-40 -top-48 h-[30rem] w-[30rem] rounded-full border border-forest-900/8"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border border-forest-900/8"
        aria-hidden="true"
      />
      <div className="container-page relative py-10 sm:py-14 lg:py-16">
        {breadcrumbs?.length ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-[11.5px] font-semibold text-ink-muted">
              <li>
                <Link href="/" className="rounded-sm transition-colors hover:text-forest-900">
                  Home
                </Link>
              </li>
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.href} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3 w-3 text-ink-muted/50" aria-hidden="true" />
                  {index === breadcrumbs.length - 1 ? (
                    <span className="text-forest-900" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      href={crumb.href}
                      className="rounded-sm transition-colors hover:text-forest-900"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div
          className={cn(
            "grid items-end gap-10",
            aside && align === "split" && "lg:grid-cols-[1.15fr_0.85fr]",
            align === "center" && "mx-auto max-w-3xl text-center",
          )}
        >
          <div>
            {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
            <h1
              className={cn(
                "mt-5 text-[42px] leading-[0.98] tracking-[-0.045em] text-forest-900 sm:text-[56px] lg:text-[66px]",
                align === "center" && "mx-auto max-w-3xl",
              )}
            >
              {title}
            </h1>
            {description ? (
              <p
                className={cn(
                  "mt-6 max-w-2xl text-[15.5px] leading-7 text-ink-muted sm:text-base sm:leading-8",
                  align === "center" && "mx-auto",
                )}
              >
                {description}
              </p>
            ) : null}
            {actions ? (
              <div
                className={cn(
                  "mt-8 flex flex-wrap items-center gap-3",
                  align === "center" && "justify-center",
                )}
              >
                {actions}
              </div>
            ) : null}
          </div>
          {aside ? <div>{aside}</div> : null}
        </div>
      </div>
    </section>
  );
}
