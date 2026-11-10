import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  tone = "light",
  className,
  titleClassName,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  tone?: "light" | "dark";
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className={cn("kicker", tone === "dark" && "text-mint-300")}>{eyebrow}</p>
        ) : null}
        <h2
          className={cn(
            "mt-4 max-w-2xl text-[38px] leading-[1.02] tracking-[-0.04em] sm:text-[48px] lg:text-[56px]",
            tone === "dark" ? "text-ivory-50" : "text-forest-900",
            titleClassName,
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-5 max-w-xl text-[15px] leading-7",
              tone === "dark" ? "text-ivory-50/65" : "text-ink-muted",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
