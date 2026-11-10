import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-[background-color,color,border-color,box-shadow,transform] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500 disabled:pointer-events-none disabled:opacity-45 active:translate-y-px [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-forest-900 text-ivory-50 shadow-[0_1px_0_rgba(252,248,239,0.1)_inset] hover:bg-forest-800",
        secondary:
          "border border-forest-900/20 bg-white-warm text-forest-900 hover:border-forest-900/35 hover:bg-mint-100",
        coral:
          "bg-coral-500 text-forest-950 shadow-[0_1px_0_rgba(255,255,255,0.16)_inset] hover:bg-coral-400",
        ghost:
          "text-forest-900 hover:bg-mint-100",
        weakness:
          "bg-transparent text-ink-muted hover:bg-ivory-100 hover:text-forest-900",
        inverse:
          "bg-ivory-50 text-forest-950 hover:bg-mint-200",
        outlineInverse:
          "border border-ivory-50/30 text-ivory-50 hover:border-ivory-50/60 hover:bg-ivory-50/10",
        danger:
          "border border-danger-ink/20 bg-danger-bg text-danger-ink hover:bg-danger-bg/80",
        link: "text-forest-800 underline-offset-4 hover:text-forest-900 hover:underline",
      },
      size: {
        sm: "h-9 rounded-full px-4 text-[13px] [&_svg]:size-4",
        md: "h-11 rounded-full px-5 text-sm [&_svg]:size-4",
        lg: "h-13 rounded-full px-6 text-[15px] [&_svg]:size-[18px]",
        icon: "h-10 w-10 rounded-full [&_svg]:size-[18px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
