import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Clock3,
  MapPin,
  PawPrint,
  ShieldAlert,
} from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import {
  getAppointmentRequests,
  getAnimals,
} from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/workspace/page-heading";
import { StatusBadge } from "@/components/workspace/status-badge";
import { formatDateTime, relativeTime } from "@/lib/utils";
import type { SessionUser } from "@/lib/auth/token";

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

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function AccountOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const [session, params, appointments, animals] = await Promise.all([
    requireUser("/account"),
    searchParams,
    getAppointmentRequests(),
    getAnimals("current-user"),
  ]);

  const upcoming = appointments.filter(
    (a) => a.status === "pending" || a.status === "approved",
  );
  const recent = appointments.slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeading
        eyebrow="Your care profile"
        title={
          <>
            {greeting()}, {session.name.split(" ")[0]}.{" "}
            <span className="display-italic text-coral-500">Here is your overview.</span>
          </>
        }
        description="Track your appointment requests, manage your animal profiles, and stay connected with your care providers."
        actions={
          <>
            <Button asChild size="sm">
              <Link href="/find">
                Find animal care
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/account/appointments">
                View all appointments
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
          </>
        }
      />

      {params.notice === "signed-out" ? (
        <div className="rounded-xl border border-forest-700/15 bg-mint-100 p-4">
          <p className="text-[12px] font-medium text-forest-800">
            You have been signed out. Your demo session cookie was cleared.
          </p>
        </div>
      ) : null}

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
            Upcoming appointment
          </p>
          {upcoming.length > 0 ? (
            <div className="mt-3 space-y-3">
              <div className="flex items-start gap-3">
                <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-forest-600" aria-hidden="true" />
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-forest-900">
                    {upcoming[0].providerName}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">
                    {upcoming[0].service}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">
                    {upcoming[0].animalName} · {upcoming[0].animalSpecies}
                  </p>
                  <p className="mt-0.5 text-[11px] text-ink-muted">
                    {formatDateTime(`${upcoming[0].preferredDate} ${upcoming[0].preferredTime}`)}
                  </p>
                </div>
              </div>
              <Badge variant={STATUS_VARIANTS[upcoming[0].status] as any}>
                {STATUS_LABELS[upcoming[0].status] ?? upcoming[0].status}
              </Badge>
              <Link
                href="/account/appointments"
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-forest-800 link-underline"
              >
                View details
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
              </Link>
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-line bg-ivory-50 p-5">
              <ShieldAlert className="mt-0.5 h-4 w-4 text-forest-500" aria-hidden="true" />
              <p className="mt-2 text-[11px] leading-5 text-ink-muted">
                No upcoming appointments. Request one from a provider profile.
              </p>
              <Button
                asChild
                size="sm"
                className="mt-3"
              >
                <Link href="/find">Browse providers</Link>
              </Button>
            </div>
          )}
        </div>

        <div className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
            Recent requests
          </p>
          <div className="mt-3 space-y-3">
            {recent.length > 0 ? (
              recent.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-xl bg-ivory-50/50">
                  <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-800">
                    <PawPrint className="h-3.5 w-3.5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-bold text-forest-900 truncate">
                      {item.providerName}
                    </p>
                    <p className="mt-0.5 text-[10px] text-ink-muted truncate">
                      {item.service}
                    </p>
                    <Badge variant={STATUS_VARIANTS[item.status] as any} className="mt-2">
                      {STATUS_LABELS[item.status] ?? item.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-ink-muted">
                No appointment requests yet.
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
            Your animals
          </p>
          <div className="mt-3 space-y-2">
            {animals.slice(0, 3).map((animal) => (
              <div key={animal.id} className="flex items-start gap-3 p-3 rounded-xl bg-ivory-50/50">
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-800">
                  <PawPrint className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-bold text-forest-900 truncate">
                    {animal.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-ink-muted truncate">
                    {animal.species}{animal.breed ? ` · ${animal.breed}` : ""}{animal.age ? ` · ${animal.age}` : ""}
                  </p>
                </div>
              </div>
            ))}
            {animals.length === 0 && (
              <p className="text-[11px] text-ink-muted">
                No animals in your profile yet.
              </p>
            )}
            {animals.length > 3 && (
              <p className="mt-2 text-[10px] text-ink-muted/60">
                +{animals.length - 3} more animal{animals.length - 3 !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          <Button asChild size="sm" className="mt-3">
            <Link href="/account/animals">Manage animals</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-[1fr_1fr]">
        <div className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70 mb-4">
            Quick actions
          </p>
          <ul className="space-y-3">
            <li>
              <Button asChild variant="secondary" size="sm" className="w-full text-left">
                <Link href="/find">
                  Find a provider
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="secondary" size="sm" className="w-full text-left">
                <Link href="/account/appointments">
                  Request an appointment
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="secondary" size="sm" className="w-full text-left">
                <Link href="/account/animals">
                  Add an animal
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="secondary" size="sm" className="w-full text-left">
                <Link href="/account/appointments">
                  View appointment history
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              </Button>
            </li>
          </ul>
        </div>

        <div className="rounded-[20px] border border-forest-900/15 bg-forest-950 p-5 sm:p-6 text-ivory-50">
          <p className="font-display text-[24px] leading-tight text-ivory-50 mb-2">
            A note on your data
          </p>
          <p className="text-[11px] leading-6 text-ivory-50/70">
            This demonstration uses local demo storage. Your appointment
            requests and animal profiles are stored in a local JSON file and
            are not connected to Supabase, n8n, or any real booking system.
          </p>
          <p className="mt-3 text-[9px] text-ivory-50/50">
            All listings and data are sample content, clearly labelled.
          </p>
        </div>
      </section>
    </div>
  );
}
