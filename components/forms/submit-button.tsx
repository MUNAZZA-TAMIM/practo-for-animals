"use client";

import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/feedback";

export function SubmitButton({
  children,
  pendingLabel = "Sending…",
  className,
  ...props
}: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={className} {...props}>
      {pending ? (
        <>
          <Spinner className="h-4 w-4" />
          {pendingLabel}
        </>
      ) : (
        <>
          {children}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </>
      )}
    </Button>
  );
}
