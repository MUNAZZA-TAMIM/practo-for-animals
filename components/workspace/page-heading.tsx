import type { ReactNode } from "react";

export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-line pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="kicker">{eyebrow}</p> : null}
        <h1 className="mt-4 text-[34px] leading-[1.02] tracking-[-0.04em] text-forest-900 sm:text-[42px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-xl text-[12.5px] leading-6 text-ink-muted">
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
