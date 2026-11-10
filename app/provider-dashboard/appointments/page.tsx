import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  PawPrint,
  ShieldAlert,
} from "lucide-react";
import { redirect } from "next/navigation";
import { requireProvider } from "@/lib/auth/session";
import { getAppointmentRequestsByProvider, getProviderByUserId } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/workspace/page-heading";
import type { Provider } from "@/lib/data/providers";
import { AppointmentActionFormClient } from "@/app/provider-dashboard/appointment-action-form-client";

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

const FILTERS = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Confirmed" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
] as const;

export default async function ProviderAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ provider?: string; filter?: string }>;
}) {
  const session = await requireProvider();
  if (!session.providerId) {
    redirect("/provider-login?notice=account-setup");
  }
  const provider = await getProviderByUserId(session.providerId);
  if (!provider) {
    redirect("/provider-login?notice=account-setup");
  }
  const { filter: filterParam } = await searchParams;
  const appointments = await getAppointmentRequestsByProvider(provider.slug);

  const filtered = appointments.filter((item) => {
    if (filterParam === "all") return true;
    return item.status === filterParam;
  });

  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-8">
      <PageHeading
        eyebrow="Appointment requests"
        title="Manage requests"
        description="Review and respond to appointment requests from animal owners."
        actions={
          <>
            <Button asChild variant="secondary" size="sm">
              <Link href="/provider-dashboard">
                Back to overview
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </Button>
          </>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
            Filter by status
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const active = filterParam === f.value;
            return (
              <Button
                key={f.value}
                asChild
                variant={active ? "coral" : "ghost"}
                size="sm"
              >
                <Link
                  href={`/provider-dashboard/appointments?filter=${f.value}`}
                >
                  {f.label}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-[20px] border border-line bg-white-warm p-12 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-ink-muted/30" aria-hidden="true" />
          <p className="mt-4 text-[12px] font-bold text-forest-900">
            {filterParam === "all"
              ? "No appointment requests yet."
              : `No ${filterParam} requests.`}
          </p>
          <p className="mt-1 text-[11px] text-ink-muted">
            {filterParam === "all"
              ? "Requests will appear here when animal owners book with you."
              : "Try a different filter."}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-line space-y-3">
          {filtered.map((item) => (
            <AppointmentRequestCard
              key={item.id}
              item={item}
              provider={provider}
            />
          ))}
        </ul>
      )}

      {pendingCount > 0 && (
        <div className="rounded-[20px] border border-amber-ink/15 bg-amber-bg p-5">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-4 w-4 text-amber-ink" aria-hidden="true" />
            <div>
              <p className="text-[10px] font-bold text-amber-ink">
                {pendingCount} pending request{pendingCount !== 1 ? "s" : ""}
              </p>
              <p className="mt-1 text-[10px] text-amber-ink/85">
                Review and respond to pending appointment requests from animal
                owners.
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="mt-4">
            <Link href="/provider-dashboard/appointments?filter=pending">
              Review pending requests
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

function AppointmentRequestCard({
  item,
  provider,
}: {
  item: { id: string; reference: string; service: string; animalName: string; animalSpecies: string; animalAge?: string; preferredDate: string; preferredTime: string; contactName: string; contactPhone: string; status: string; createdAt: string };
  provider: Provider;
}) {
  const status = STATUS_LABELS[item.status] ?? item.status;
  const variant = STATUS_VARIANTS[item.status] ?? "outline";
  const isPending = item.status === "pending";

  return (
    <li className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-0 items-start">
        <div className="sm:col-span-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-800">
              <PawPrint className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="font-display text-[16px] leading-[1.04] tracking-[-0.02em] text-forest-900 sm:text-[18px]">
                {item.animalName}
              </p>
              <p className="mt-0.5 text-[11px] leading-5 text-ink-muted">
                {item.animalSpecies}{item.animalAge ? ` · ${item.animalAge}` : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="sm:col-span-4">
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
              Service
            </p>
            <p className="text-[12px] font-bold text-forest-900 truncate">
              {item.service}
            </p>
          </div>
        </div>
        <div className="sm:col-span-4">
          <div className="space-y-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
              Preferred date & time
            </p>
            <p className="text-[12px] font-bold text-forest-900">
              {item.preferredDate} at {item.preferredTime}
            </p>
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
            {item.createdAt.slice(0, 10)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outlineInverse"
            size="sm"
          >
            <Link href={`/providers/${provider.slug}`}>
              View public profile
            </Link>
          </Button>
          {isPending && <AppointmentActionFormClient item={item} />}
        </div>
      </div>
    </li>
  );
}
