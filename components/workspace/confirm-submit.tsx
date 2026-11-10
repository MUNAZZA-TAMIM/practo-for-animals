"use client";

import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/ui/feedback";

export function ConfirmSubmit({
  children,
  message,
  pendingLabel = "Working…",
  ...props
}: ButtonProps & { message: string; pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      {...props}
    >
      {pending ? (
        <>
          <Spinner className="h-4 w-4" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
