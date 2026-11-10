import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  PawPrint,
  Phone,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { getAppointmentRequests } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/workspace/page-heading";
import { StatusBadge } from "@/components/workspace/status-badge";
import { appointmentDecisionAction } from "@/app/admin/actions";
import { formatDateTime, relativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { AppointmentRequest } from "@/lib/db";

const filters = ["all", "pending", "approved", "completed", "rejected", "cancelled"] as const;
type AppointmentFilter = (typeof filters)[number];

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Confirmed",
  completed: "Completed",
  rejected: "Declined",
  cancelled: "Cancelled",
};

const STATUS_VARIANTS: Record<
  string,
  "outline" | "warning" | "success" | "default" | "danger" | "muted" | "coral" | "forest" | "sample" | "ghostInverse"
> = {
  pending: "warning",
  approved: "success",
  completed: "default",
  rejected: "danger",
  cancelled: "muted",
};

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string; filter?: string }>;
}) {
  const { provider: providerSlug, filter: filterParam } = await searchParams;
  const status: AppointmentFilter = filters.includes(
    filterParam as AppointmentFilter,
  )
    ? (filterParam as AppointmentFilter)
    : "all";
  const appointments = await getAppointmentRequests();

  const filtered = appointments.filter((item) => {
    if (status === "all") return true;
    return item.status === status;
  });

  const counts = {
    all: appointments.length,
    pending: appointments.filter((item) => item.status === "pending").length,
    approved: appointments.filter((item) => item.status === "approved").length,
    completed: appointments.filter((item) => item.status === "completed").length,
    rejected: appointments.filter((item) => item.status === "rejected").length,
    cancelled: appointments.filter((item) => item.status === "cancelled").length,
  };

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="Appointment requests"
        title="Appointment review queue"
        description="Review appointment requests from animal owners. Confirm requests the provider can honor, decline those they cannot, or request changes."
        actions={
          <>
            <Button asChild variant="secondary" size="sm">
              <Link href="/admin">
                Back to overview
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-1.5">
        {filters.map((item) => {
          const active = status === item;
          return (
            <Link
              key={item}
              href={`/admin/appointments?status=${item}`}
              aria-current={status === item ? "page" : undefined}
              className={cn(
                "rounded-full border px-3 py-1.5 text-[10.5px] font-bold transition-colors",
                status === item
                  ? "border-forest-900 bg-forest-900 text-ivory-50"
                  : "border-line bg-white-warm text-forest-800 hover:border-forest-900/25",
              )}
            >
              {item.charAt(0).toUpperCase() + item.slice(1)}
              <span className="ml-1.5 opacity-60">{counts[item]}</span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[18px] border border-dashed border-line bg-white-warm px-6 py-14 text-center">
          <ShieldAlert className="mx-auto h-8 w-8 text-forest-500" aria-hidden="true" />
          <p className="mt-3 text-[14px] font-bold text-forest-900">
            No appointments in this view
          </p>
          <p className="mt-1 text-[11.5px] text-ink-muted">
            Appointment requests appear here as animal owners submit them.
          </p>
          <Button asChild variant="secondary" size="sm" className="mt-4">
            <Link href="/admin/appointments?status=all">Show all appointments</Link>
          </Button>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map((appointment) => (
            <li
              key={appointment.id}
              className="overflow-hidden rounded-[18px] border border-line bg-white-warm"
            >
              <AppointmentCard appointment={appointment} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: AppointmentRequest }) {
  const status = STATUS_LABELS[appointment.status] ?? appointment.status;
  const variant = STATUS_VARIANTS[appointment.status] ?? "outline";
  const isPending = appointment.status === "pending";

  return (
    <li className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 rounded-full bg-mint-100 flex items-center justify-center">
            <PawPrint className="h-5 w-5 text-forest-800" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-[16px] leading-[1.04] tracking-[-0.02em] text-forest-900 sm:text-[18px]">
              {appointment.animalName}
            </p>
            <p className="mt-0.5 text-[10.5px] leading-5 text-ink-muted">
              {appointment.animalSpecies}{appointment.animalAge ? ` · ${appointment.animalAge}` : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={variant}>{status}</Badge>
          <Link
            href={`/providers/${appointment.providerSlug}`}
            className="text-[10px] font-bold text-forest-800 link-underline"
          >
            View provider profile
            <ArrowRight className="h-3 w-3" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 mb-4">
        <div className="rounded-xl border border-line bg-white-warm p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60 mb-2">
            Provider
          </p>
          <p className="text-[11px] font-semibold text-forest-900">
            {appointment.providerName}
          </p>
        </div>
        <div className="rounded-xl border border-line bg-white-warm p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60 mb-2">
            Service
          </p>
          <p className="text-[11px] text-ink-muted">{appointment.service}</p>
        </div>
        <div className="sm:col-span-2 rounded-xl border border-line bg-white-warm p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60 mb-2">
            Preferred date & time
          </p>
          <div className="flex items-start gap-2">
            <Clock3 className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-forest-900">
                {appointment.preferredDate}
              </p>
              <p className="text-[10px] text-ink-muted">{appointment.preferredTime}</p>
            </div>
          </div>
        </div>
        <div className="sm:col-span-2 rounded-xl border border-line bg-white-warm p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60 mb-2">
            Contact
          </p>
          <div className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 text-forest-600" aria-hidden="true" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-forest-900">
                {appointment.contactPhone}
              </p>
              <p className="text-[10px] text-ink-muted">{appointment.contactEmail}</p>
            </div>
          </div>
        </div>
      </div>

      {appointment.reasonForVisit && (
        <div className="mb-4 rounded-xl border border-line bg-white-warm p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60 mb-2">
            Reason for visit
          </p>
          <p className="text-[11px] leading-5 text-ink-muted">{appointment.reasonForVisit}</p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-line">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60 mb-3">
          Review actions
        </p>
        <form action={appointmentDecisionAction} className="space-y-2">
          <input type="hidden" name="id" value={appointment.id} />
          <div className="flex gap-2">
            {isPending ? (
              <>
                <Button
                  type="submit"
                  name="decision"
                  value="approve"
                  size="sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Confirm
                </Button>
                <Button
                  type="submit"
                  name="decision"
                  value="reject"
                  variant="danger"
                  size="sm"
                >
                  <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                  Decline
                </Button>
                <Button
                  type="submit"
                  name="decision"
                  value="request_changes"
                  variant="outlineInverse"
                  size="sm"
                >
                  Request changes
                </Button>
              </>
            ) : (
              <span className="text-[9px] font-bold text-ink-muted/60">
                Status: {status}
              </span>
            )}
          </div>
        </form>
      </div>

      <div className="mt-3 text-[10px] leading-5 text-ink-muted">
        <Clock3 className="mt-0.5 h-3 w-3 shrink-0 text-ink-muted/40" aria-hidden="true" />
        <span className="ml-1">Submitted {relativeTime(appointment.createdAt)}</span>
      </div>
    </li>
  );
}
