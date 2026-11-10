import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "@/components/shared/page-hero";

export type LegalSection = {
  title: string;
  body: ReactNode;
};

export function LegalPage({
  eyebrow,
  title,
  description,
  updated,
  sections,
  aside,
  breadcrumb = "Legal",
}: {
  eyebrow: string;
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
  aside?: ReactNode;
  breadcrumb?: string;
}) {
  return (
    <>
      <PageHero
        eyebrow={eyebrow}
        title={title}
        description={description}
        breadcrumbs={[
          { href: "/", label: "Home" },
          { href: "#", label: breadcrumb },
        ]}
        className="bg-ivory-100"
        aside={aside}
      />

      <section className="section-pad">
        <div className="container-page grid gap-10 lg:grid-cols-[0.34fr_0.66fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="kicker">Contents</p>
            <ol className="mt-4 space-y-2.5">
              {sections.map((section, index) => (
                <li key={section.title}>
                  <a
                    href={`#section-${index + 1}`}
                    className="flex items-baseline gap-3 text-[11.5px] text-ink-muted transition-colors hover:text-forest-900"
                  >
                    <span className="font-mono text-[9px] text-coral-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-6 border-t border-line pt-4 text-[10px] leading-5 text-ink-muted/60">
              Last updated {updated}. This is a demonstration policy, not legal
              advice.
            </p>
          </aside>

          <div className="min-w-0">
            <div className="rounded-[22px] border border-amber-ink/15 bg-amber-bg/60 p-4 text-[11px] leading-6 text-amber-ink">
              <strong className="font-bold">Demo notice.</strong> This is an
              independent internship concept, not an official Practo product.
              The directory, accounts, workflows, and content are sample data.
              Do not submit real personal or medical information.
            </div>

            <div className="mt-8 space-y-10">
              {sections.map((section, index) => (
                <section key={section.title} id={`section-${index + 1}`}>
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-[10px] font-bold text-coral-500">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="text-[26px] tracking-[-0.03em] sm:text-[30px]">
                      {section.title}
                    </h2>
                  </div>
                  <div className="mt-4 space-y-3 pl-8 text-[13px] leading-7 text-ink-muted [&_a]:font-semibold [&_a]:text-forest-800 [&_a]:underline [&_a]:underline-offset-4 [&_li]:relative [&_li]:pl-4 [&_li]:before:absolute [&_li]:before:left-0 [&_li]:before:top-[0.7em] [&_li]:before:h-1 [&_li]:before:w-1 [&_li]:before:rounded-full [&_li]:before:bg-coral-500 [&_ul]:space-y-1.5">
                    {section.body}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-6">
              <Link
                href="/"
                className="inline-flex h-10 items-center rounded-full bg-forest-900 px-5 text-[12px] font-semibold text-ivory-50 transition-colors hover:bg-forest-800"
              >
                Back to home
              </Link>
              <Link
                href="/privacy"
                className="text-[11px] font-semibold text-ink-muted link-underline"
              >
                Privacy policy
              </Link>
              <Link
                href="/terms"
                className="text-[11px] font-semibold text-ink-muted link-underline"
              >
                Terms of use
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
