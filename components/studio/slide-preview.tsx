import type { CSSProperties } from "react";
import {
  getDesignDirection,
  type DesignDirectionId,
  type StudioSlide,
} from "@/lib/studio/data";
import { cn } from "@/lib/utils";

export function SlidePreview({
  slide,
  directionId,
  index,
  total,
  className,
  compact = false,
}: {
  slide: StudioSlide;
  directionId: DesignDirectionId;
  index: number;
  total: number;
  className?: string;
  compact?: boolean;
}) {
  const direction = getDesignDirection(directionId);
  const isCover = index === 0;
  const isClosing = index === total - 1 && total > 1;
  const style = {
    "--slide-bg": direction.colors.background,
    "--slide-surface": direction.colors.surface,
    "--slide-ink": direction.colors.ink,
    "--slide-muted": direction.colors.muted,
    "--slide-accent": direction.colors.accent,
    "--slide-line": direction.colors.line,
    backgroundColor: direction.colors.background,
    color: direction.colors.ink,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "relative flex aspect-[4/5] w-full flex-col overflow-hidden border",
        compact ? "rounded-lg p-4" : "rounded-[18px] p-5 sm:p-6",
        className,
      )}
      style={{ ...style, borderColor: direction.colors.line }}
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full border"
        style={{ borderColor: direction.colors.line }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full border"
        style={{ borderColor: direction.colors.line }}
        aria-hidden="true"
      />

      <div className="relative flex items-center justify-between gap-3">
        <span
          className={cn(
            "font-bold uppercase",
            compact ? "text-[7px] tracking-[0.18em]" : "text-[8.5px] tracking-[0.2em]",
          )}
          style={{ color: direction.colors.accent }}
        >
          {direction.coverWordmark}
        </span>
        <span
          className={cn("font-semibold", compact ? "text-[7px]" : "text-[9px]")}
          style={{ color: direction.colors.muted }}
        >
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <div
        className={cn(
          "relative mt-4 flex flex-1 flex-col",
          isCover ? "justify-center" : "justify-start",
        )}
      >
        {slide.kicker ? (
          <p
            className={cn(
              "font-bold uppercase",
              compact ? "text-[6.5px] tracking-[0.16em]" : "text-[8px] tracking-[0.17em]",
            )}
            style={{ color: direction.colors.accent }}
          >
            {slide.kicker}
          </p>
        ) : null}
        <h3
          className={cn(
            direction.titleFont === "display" ? "font-display" : "font-sans font-bold",
            "mt-2 leading-[1.02] tracking-[-0.03em]",
            compact
              ? "text-[17px]"
              : isCover
                ? "text-[32px] sm:text-[36px]"
                : "text-[26px] sm:text-[30px]",
          )}
        >
          {slide.title || "Untitled slide"}
        </h3>
        <p
          className={cn(
            "mt-3 whitespace-pre-line",
            compact
              ? "line-clamp-4 text-[7.5px] leading-[1.5]"
              : "line-clamp-6 text-[10.5px] leading-[1.65] sm:text-[11px]",
          )}
          style={{ color: direction.colors.muted }}
        >
          {slide.body || "Add a short, useful paragraph for this slide."}
        </p>

        {slide.cta ? (
          <span
            className={cn(
              "mt-4 inline-flex w-fit items-center rounded-full px-3 py-1.5 font-bold",
              compact ? "text-[6.5px]" : "text-[8px]",
            )}
            style={{
              backgroundColor: direction.colors.accent,
              color: direction.colors.background,
            }}
          >
            {slide.cta}
          </span>
        ) : null}
      </div>

      <div
        className={cn(
          "relative mt-4 flex items-end justify-between gap-3 border-t pt-3",
        )}
        style={{ borderColor: direction.colors.line }}
      >
        <span
          className={cn(
            "font-semibold uppercase",
            compact ? "text-[6px] tracking-[0.16em]" : "text-[7.5px] tracking-[0.18em]",
          )}
          style={{ color: direction.colors.muted }}
        >
          {isClosing ? "Human reviewed · Not veterinary advice" : "A considered care note"}
        </span>
        <span
          className={cn("h-1.5 w-1.5 rounded-full", compact ? "mb-0.5" : "mb-1")}
          style={{ backgroundColor: direction.colors.accent }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
