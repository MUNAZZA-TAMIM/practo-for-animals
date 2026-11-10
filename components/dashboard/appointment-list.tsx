"use client";

import * as React from "react";
import {
  ChevronRight,
  Clock3,
  MapPin,
  PawPrint,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cancelAppointmentAction } from "@/app/account/actions";
import type { AppointmentRequest } from "@/lib/db";
import { formatDateTime, relativeTime } from "@/lib/utils";
import { CancelConfirmDialog } from "./cancel-confirm-dialog";
import { AppointmentDetailDialog } from "./appointment-detail-dialog";

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

const FILTERS = [
  { value: "all", label: "All" },
  { value: "upcoming", label: "Upcoming" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export function AppointmentList({
  appointments,
  filterParam,
}: {
  appointments: AppointmentRequest[];
  filterParam?: string;
}) {
  const [filter, setFilter] = React.useState(filterParam ?? "all");
  const [openCancelId, setOpenCancelId] = React.useState<string | null>(null);
  const [openDetailId, setOpenDetailId] = React.useState<string | null>(null);

  const [cancelState, cancelAction] = React.useActionState<
    { status: "idle" | "error"; message?: string },
    FormData
  >(cancelAppointmentAction, { status: "idle" });

  const filtered = appointments.filter((item) => {
    if (filter === "all") return true;
    if (filter === "upcoming")
      return item.status === "pending" || item.status === "approved";
    return item.status === filter;
  });

  const hasUpcoming = appointments.some(
    (item) => item.status === "pending" || item.status === "approved",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="kicker">Your appointments</p>
          <h1 className="mt-2 font-display text-[34px] leading-[1.02] tracking-[-0.04em] text-forest-900 sm:text-[42px]">
            Appointment requests
          </h1>
          <p className="mt-1 text-[11px] leading-5 text-ink-muted">
            {filtered.length} appointment request{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <Button
                key={f.value}
                variant={active ? "coral" : "ghost"}
                size="sm"
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </Button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[20px] border border-line bg-white-warm p-12 text-center">
          <CalendarIcon className="mx-auto h-10 w-10 text-ink-muted/30" aria-hidden="true" />
          <p className="mt-4 text-[12px] font-semibold text-forest-900">
            {filter === "all" ? "No appointment requests yet." : `No ${filter} appointments.`}
          </p>
          <p className="mt-1 text-[11px] leading-5 text-ink-muted">
            {filter === "all"
              ? "Request your first appointment from a provider profile, or browse the care directory."
              : "Try a different filter, or request a new appointment."}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <a href="/find">Find animal care</a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="/account/animals">Manage my animals</a>
            </Button>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-line space-y-4">
          {filtered.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onViewDetails={() => setOpenDetailId(appointment.id)}
              onCancel={() => setOpenCancelId(appointment.id)}
              isCancelling={openCancelId === appointment.id}
            />
          ))}
        </ul>
      )}

      <CancelConfirmDialog
        open={openCancelId !== null}
        onOpenChange={(open) => setOpenCancelId(open ? openCancelId : null)}
        appointmentId={openCancelId ?? undefined}
        appointments={appointments}
        onSubmit={cancelAction}
        pending={cancelState.status === "error" ? false : Boolean(openCancelId)}
        error={cancelState.message}
      />

      <AppointmentDetailDialog
        open={openDetailId !== null}
        onOpenChange={(open) => setOpenDetailId(open ? openDetailId : null)}
        appointmentId={openDetailId ?? undefined}
        appointments={appointments}
      />
    </div>
  );
}

function CalendarIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      data-lucide="calendar"
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
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="11" y2="11" />
    </svg>
  );
}

function AppointmentCard({
  appointment,
  onViewDetails,
  onCancel,
  isCancelling,
}: {
  appointment: AppointmentRequest;
  onViewDetails: () => void;
  onCancel: () => void;
  isCancelling: boolean;
}) {
  const status = STATUS_LABELS[appointment.status] ?? appointment.status;
  const variant = STATUS_VARIANTS[appointment.status] ?? "outline";
  const isCancellable =
    appointment.status === "pending" || appointment.status === "approved";

  return (
    <li className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-0 items-start">
        <div className="sm:col-span-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-mint-100 text-forest-800">
              <PawPrint className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[16px] leading-[1.04] tracking-[-0.02em] text-forest-900 sm:text-[18px]">
                {appointment.animalName}
              </p>
              <p className="mt-0.5 text-[11px] leading-5 text-ink-muted">
                {appointment.animalSpecies}{appointment.animalAge ? ` · ${appointment.animalAge}` : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="sm:col-span-4">
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
              Provider & service
            </p>
            <p className="text-[12px] font-bold text-forest-900 truncate">
              {appointment.providerName}
            </p>
            <p className="text-[11px] leading-5 text-ink-muted truncate">
              {appointment.service}
            </p>
          </div>
        </div>
        <div className="sm:col-span-4">
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
              Preferred date & time
            </p>
            <p className="text-[12px] font-bold text-forest-900">
              {formatDateTime(`${appointment.preferredDate} ${appointment.preferredTime}`)}
            </p>
            {appointment.area && (
              <p className="text-[11px] leading-5 text-ink-muted truncate">
                {appointment.area}, {appointment.city}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 border-t border-line pt-4 sm:flex sm:items-end sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] ${
              variant === "success"
                ? "border-mint-200 bg-mint-200 text-forest-800"
                : variant === "warning"
                  ? "border-amber-ink/15 bg-amber-bg text-amber-ink"
                  : variant === "danger"
                    ? "border-danger-ink/15 bg-danger-bg text-danger-ink"
                    : variant === "muted"
                      ? "border-transparent bg-ivory-200 text-ink-muted"
                      : "border-transparent bg-mint-200 text-forest-900"
            }`}
          >
            {status}
          </span>
          <Clock3 className="h-3 w-3 text-ink-muted" aria-hidden="true" />
          <span className="text-[10px] text-ink-muted/60">
            {relativeTime(appointment.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outlineInverse"
            size="sm"
            onClick={onViewDetails}
          >
            View details
          </Button>
          {isCancellable && !isCancelling ? (
            <Button
              variant="danger"
              size="sm"
              onClick={onCancel}
            >
              Cancel
            </Button>
          ) : null}
        </div>
      </div>
    </li>
  );
}
