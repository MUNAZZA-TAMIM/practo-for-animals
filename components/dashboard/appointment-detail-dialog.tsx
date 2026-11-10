"use client";

import * as React from "react";
import { ChevronRight, Clock3, MapPin, Mail, Phone, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import type { AppointmentRequest } from "@/lib/db";

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Confirmed",
  completed: "Completed",
  rejected: "Declined",
  cancelled: "Cancelled",
};

const STATUS_VARIANTS: Record<string, string> = {
  pending: "warning",
  approved: "success",
  completed: "default",
  rejected: "danger",
  cancelled: "muted",
};

interface AppointmentDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string | undefined;
  appointments: AppointmentRequest[];
}

export function AppointmentDetailDialog({
  open,
  onOpenChange,
  appointmentId,
  appointments,
}: AppointmentDetailDialogProps) {
  const appointment = appointments.find((a) => a.id === appointmentId);

  if (!appointment) return null;

  const status = STATUS_LABELS[appointment.status] ?? appointment.status;
  const variant = STATUS_VARIANTS[appointment.status] ?? "outline";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hidden">
          View details
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Appointment details</DialogTitle>
        <DialogDescription>
          A summary of your appointment request with {appointment.providerName}.
        </DialogDescription>
        <div className="mt-6 space-y-5">
          <div className="rounded-xl border border-line bg-white-warm p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70 mb-2">
              Request summary
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <PawPrint className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
                    Animal
                  </p>
                  <p className="text-[12.5px] font-semibold text-forest-900">
                    {appointment.animalName}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-ink-muted">
                    {appointment.animalSpecies}{appointment.animalAge ? ` · ${appointment.animalAge}` : ""}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
                    Preferred date & time
                  </p>
                  <p className="text-[12.5px] font-semibold text-forest-900">
                    {formatDateTime(`${appointment.preferredDate} ${appointment.preferredTime}`)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
                    Location
                  </p>
                  <p className="text-[12.5px] font-semibold text-forest-900">
                    {appointment.area}, {appointment.city}
                  </p>
                </div>
              </div>
              {appointment.reasonForVisit && (
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true">✍</span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
                      Reason for visit
                    </p>
                    <p className="text-[12.5px] text-ink-muted">
                      {appointment.reasonForVisit}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white-warm p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70 mb-2">
              Provider & service
            </p>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <BuildingIcon className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
                    Provider
                  </p>
                  <p className="text-[12.5px] font-semibold text-forest-900">
                    {appointment.providerName}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-ink-muted">
                    {appointment.category}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
                    Service
                  </p>
                  <p className="text-[12.5px] font-semibold text-forest-900">
                    {appointment.service}
                  </p>
                  {appointment.serviceDescription && (
                    <p className="mt-0.5 text-[10.5px] text-ink-muted">
                      {appointment.serviceDescription}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-white-warm p-5">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70 mb-2">
              Contact & status
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
                    Contact phone
                  </p>
                  <p className="text-[12.5px] font-semibold text-forest-900">
                    {appointment.contactPhone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
                    Contact email
                  </p>
                  <p className="text-[12.5px] font-semibold text-forest-900">
                    {appointment.contactEmail}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true">📋</span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
                    Reference
                  </p>
                  <p className="text-[12.5px] font-mono text-forest-900">
                    {appointment.reference}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Badge variant={variant as any} className="h-9 w-9 shrink-0">
                  {status}
                </Badge>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
                    Request status
                  </p>
                  <p className="text-[12.5px] font-semibold text-forest-900">
                    {status}
                  </p>
                  <p className="mt-0.5 text-[10.5px] text-ink-muted">
                    {appointment.status === "pending"
                      ? "Your request is being reviewed by the provider."
                      : appointment.status === "approved"
                        ? "Your request has been confirmed by the provider."
                        : appointment.status === "completed"
                          ? "Your appointment has been completed."
                          : appointment.status === "rejected"
                            ? "Your request was declined by the provider."
                            : "Your appointment was cancelled."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
          <Button asChild variant="outlineInverse" size="sm" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function BuildingIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-lucide="building-2"
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
      <path d="M22 13v7a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1z" />
      <path d="M1 8h5v5H1z" />
      <path d="M10 14h5v5h-5z" />
      <path d="M10 8h5v3h-5z" />
      <path d="M18 18h-5v5h5z" />
      <path d="M18 8h5v3h-5z" />
    </svg>
  );
}
