import * as React from "react";
import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "block text-[13px] font-semibold leading-5 text-forest-900",
        className,
      )}
      {...props}
    />
  );
}

function FieldHint({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-hint"
      className={cn("text-[12.5px] leading-5 text-ink-muted", className)}
      {...props}
    />
  );
}

function FieldError({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  if (!children) return null;
  return (
    <p
      data-slot="field-error"
      role="alert"
      className={cn("flex items-start gap-1.5 text-[12.5px] leading-5 text-danger-ink", className)}
      {...props}
    >
      {children}
    </p>
  );
}

function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
  optional,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
  optional?: boolean;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={htmlFor}>{label}</Label>
        {optional ? (
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted/70">
            Optional
          </span>
        ) : null}
      </div>
      {children}
      {hint ? <FieldHint>{hint}</FieldHint> : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}

export { Label, Field, FieldHint, FieldError };
