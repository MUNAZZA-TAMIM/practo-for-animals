"use client";

import * as React from "react";
import { Clock3, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { AppointmentRequest } from "@/lib/db";

type CancelFormState = {
  status: "idle" | "error";
  message?: string;
};

interface CancelConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string | undefined;
  appointments: AppointmentRequest[];
  onSubmit: (formData: FormData) => void | Promise<void>;
  pending: boolean;
  error: string | undefined;
}

export function CancelConfirmDialog({
  open,
  onOpenChange,
  appointmentId,
  appointments,
  onSubmit,
  pending,
  error,
}: CancelConfirmDialogProps) {
  const appointment = appointments.find((a) => a.id === appointmentId);

  if (!appointment) return null;

  const isCancellable =
    appointment.status === "pending" || appointment.status === "approved";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden">
          Cancel appointment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Cancel appointment request?</DialogTitle>
        <DialogDescription>
          Cancelling this request will notify the provider that you no longer
          need the appointment. This cannot be undone.
        </DialogDescription>
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-line bg-white-warm p-5">
            <div className="flex items-start gap-3">
              <PawPrintIcon className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
                  Appointment
                </p>
                <p className="text-[12.5px] font-semibold text-forest-900">
                  {appointment.providerName} · {appointment.service}
                </p>
                <p className="mt-0.5 text-[10.5px] text-ink-muted">
                  {formatDateTime(`${appointment.preferredDate} ${appointment.preferredTime}`)}
                </p>
                <p className="mt-0.5 text-[10px] text-ink-muted">
                  Reference: {appointment.reference}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-danger-ink/20 bg-danger-bg p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 h-4 w-4 text-danger-ink" aria-hidden="true" />
              <div>
                <p className="text-[10.5px] font-bold text-danger-ink">
                  Cancelled appointments cannot be restored.
                </p>
                <p className="mt-1 text-[10px] text-danger-ink/85">
                  To book again, you can request a new appointment from the
                  provider&rsquo;s profile page.
                </p>
              </div>
            </div>
          </div>

          <form action={onSubmit} className="space-y-3">
            <input type="hidden" name="id" value={appointment.id} />
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted/70 mb-2">
                Reason for cancellation (optional)
              </label>
              <textarea
                name="reason"
                rows={3}
                className="w-full rounded-[10px] border border-line bg-white-warm px-3.5 py-3 text-[14px] text-charcoal focus:border-forest-700 focus:ring-4 focus:ring-forest-900/8"
                placeholder="e.g. Found another provider, no longer needed…"
              />
            </div>
            <div className="mt-4 flex flex-col sm:flex-row sm:justify-end gap-3">
              <Button
                type="button"
                variant="outlineInverse"
                size="sm"
                onClick={() => onOpenChange(false)}
              >
                Keep appointment
              </Button>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                disabled={pending || !isCancellable}
              >
                {pending ? "Cancelling…" : "Cancel appointment"}
              </Button>
            </div>
          </form>
        </div>
        {error ? (
          <p className="mt-3 text-[11px] text-danger-ink">{error}</p>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function PawPrintIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-lucide="paw-print"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      className={className}
      {...props}
    >
      <path d="M2 12s4-4 8-4 8 4 8 4" />
      <path d="M10 16c2.5 0 4 2 4 4s-1.5 4-4 4-4-2-4-4" />
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="12" cy="16" r="2" />
    </svg>
  );
}
