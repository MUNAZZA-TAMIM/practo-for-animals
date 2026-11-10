import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10.5px] font-bold uppercase leading-none tracking-[0.12em]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-mint-200 text-forest-900",
        forest: "border-transparent bg-forest-900 text-ivory-50",
        outline: "border-line bg-white-warm text-ink-muted",
        coral: "border-transparent bg-coral-500 text-forest-950",
        sample: "border-amber-ink/15 bg-amber-bg text-amber-ink",
        success: "border-forest-700/15 bg-mint-200 text-forest-800",
        warning: "border-amber-ink/15 bg-amber-bg text-amber-ink",
        danger: "border-danger-ink/15 bg-danger-bg text-danger-ink",
        muted: "border-transparent bg-ivory-200 text-ink-muted",
        ghostInverse: "border-ivory-50/25 bg-ivory-50/10 text-ivory-50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
