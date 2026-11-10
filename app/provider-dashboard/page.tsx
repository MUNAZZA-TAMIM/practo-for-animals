import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  PawPrint,
  Phone,
  Star,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { requireProvider } from "@/lib/auth/session";
import { getAppointmentRequestsByProvider, getProviderByUserId } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/workspace/page-heading";
import type { AppointmentRequest } from "@/lib/db";

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
  completed: "forest",
  rejected: "danger",
  cancelled: "muted",
};

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(dateStr: string) {
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default async function ProviderDashboardOverviewPage() {
  const session = await requireProvider();
  if (!session.providerId) {
    redirect("/provider-login?notice=account-setup");
  }
  const provider = await getProviderByUserId(session.providerId);
  if (!provider) {
    redirect("/provider-login?notice=account-setup");
  }
  const appointments = await getAppointmentRequestsByProvider(provider.slug);

  const pendingCount = appointments.filter((a) => a.status === "pending").length;
  const confirmedCount = appointments.filter((a) => a.status === "approved").length;
  const completedCount = appointments.filter((a) => a.status === "completed").length;
  const totalCount = appointments.length;
  const recent = appointments.slice(0, 6);

  const completenessItems = [
    { label: "Business name", complete: Boolean(provider.name) },
    { label: "Description", complete: Boolean(provider.about) },
    { label: "Location", complete: Boolean(provider.address) },
    { label: "Contact phone", complete: Boolean(provider.phone) },
    { label: "Services listed", complete: Boolean(provider.services?.length) },
    { label: "Animals treated", complete: Boolean(provider.species?.length) },
    { label: "Opening hours", complete: Boolean(provider.hours) },
  ];
  const doneCount = completenessItems.filter((i) => i.complete).length;
  const completenessPercent = Math.round((doneCount / completenessItems.length) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeading
        eyebrow="Provider workspace"
        title={
          <>
            {greeting()},{" "}
            <span className="display-italic text-coral-500">{session.name}</span>
          </>
        }
        description={`Managing ${provider.name} · ${provider.city}, ${provider.area}`}
        actions={
          <>
            <Button asChild size="sm">
              <Link href={`/providers/${provider.slug}`}>
                View public profile
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="sm">
              <Link href="/provider-dashboard/appointments">
                All appointments
              </Link>
            </Button>
          </>
        }
      />

      {/* Stats row */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pending requests"
          value={pendingCount}
          icon={<Clock className="h-5 w-5" />}
          color="amber"
          detail="Awaiting your review"
          href="/provider-dashboard/appointments?filter=pending"
        />
        <StatCard
          label="Confirmed"
          value={confirmedCount}
          icon={<CheckCircle2 className="h-5 w-5" />}
          color="green"
          detail="Upcoming appointments"
          href="/provider-dashboard/appointments?filter=approved"
        />
        <StatCard
          label="Completed"
          value={completedCount}
          icon={<Star className="h-5 w-5" />}
          color="blue"
          detail="Appointments done"
          href="/provider-dashboard/appointments?filter=completed"
        />
        <StatCard
          label="Total requests"
          value={totalCount}
          icon={<TrendingUp className="h-5 w-5" />}
          color="purple"
          detail="All time requests"
          href="/provider-dashboard/appointments"
        />
      </section>

      {/* Main content grid */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Appointment list */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ink-muted/60">Recent Appointments</p>
              <p className="mt-0.5 text-sm font-semibold text-forest-900">Latest appointment requests</p>
            </div>
            <Link
              href="/provider-dashboard/appointments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-forest-700 hover:text-forest-900 transition-colors"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {recent.length > 0 ? (
            <ul className="space-y-3">
              {recent.map((item) => (
                <AppointmentRow key={item.id} item={item} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mint-100">
                <Calendar className="h-6 w-6 text-forest-600" />
              </div>
              <p className="mt-3 text-sm font-semibold text-forest-900">No appointment requests yet</p>
              <p className="mt-1 text-xs text-ink-muted">
                Requests will appear here when animal owners book through your profile.
              </p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Listing card */}
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted/60 mb-4">Listing Status</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-100">
                <PawPrint className="h-5 w-5 text-forest-700" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-forest-900 truncate">{provider.name}</p>
                <p className="text-xs text-ink-muted truncate">{provider.category}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-ink-muted">
              {provider.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-forest-500" />
                  <span className="line-clamp-2">{provider.address}</span>
                </div>
              )}
              {provider.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 shrink-0 text-forest-500" />
                  <span>{provider.phone}</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Badge variant={
                provider.status === "published" ? "success" :
                provider.status === "paused" ? "muted" : "warning"
              }>
                {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
              </Badge>
              {provider.featured && (
                <Badge variant="forest">Featured</Badge>
              )}
            </div>
            <Button asChild size="sm" className="mt-4 w-full" variant="secondary">
              <Link href="/provider-dashboard/listing">Edit listing</Link>
            </Button>
          </div>

          {/* Completeness */}
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-muted/60">Profile completeness</p>
              <span className="text-sm font-bold text-forest-700">{completenessPercent}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ivory-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-forest-500 to-emerald-400 transition-all"
                style={{ width: `${completenessPercent}%` }}
              />
            </div>
            <ul className="mt-4 space-y-2">
              {completenessItems.map((item) => (
                <li key={item.label} className="flex items-center gap-2.5">
                  {item.complete ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-forest-500" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0 text-ink-muted/30" />
                  )}
                  <span className={`text-xs ${item.complete ? "text-forest-900" : "text-ink-muted/60"}`}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
  detail,
  href,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: "amber" | "green" | "blue" | "purple";
  detail: string;
  href: string;
}) {
  const colorMap = {
    amber: { bg: "bg-amber-50", icon: "bg-amber-100 text-amber-700", num: "text-amber-700" },
    green: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-700", num: "text-emerald-700" },
    blue: { bg: "bg-sky-50", icon: "bg-sky-100 text-sky-700", num: "text-sky-700" },
    purple: { bg: "bg-violet-50", icon: "bg-violet-100 text-violet-700", num: "text-violet-700" },
  };
  const c = colorMap[color];
  return (
    <Link href={href} className="group block">
      <div className={`rounded-2xl border border-line ${c.bg} p-5 shadow-sm transition-shadow hover:shadow-md`}>
        <div className="flex items-start justify-between">
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.icon}`}>
            {icon}
          </div>
          <ArrowRight className="h-4 w-4 text-ink-muted/40 group-hover:text-ink-muted transition-colors mt-1" />
        </div>
        <p className={`mt-4 text-3xl font-bold leading-none ${c.num}`}>{value}</p>
        <p className="mt-1 text-xs font-semibold text-ink-muted/80">{label}</p>
        <p className="mt-0.5 text-xs text-ink-muted/60">{detail}</p>
      </div>
    </Link>
  );
}

function AppointmentRow({ item }: { item: AppointmentRequest }) {
  return (
    <li className="flex items-start gap-3 rounded-xl border border-line bg-ivory-50/50 p-3.5 hover:bg-ivory-50 transition-colors">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mint-100">
        <PawPrint className="h-4 w-4 text-forest-700" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-forest-900">{item.animalName}</span>
          <span className="text-xs text-ink-muted">·</span>
          <span className="text-xs text-ink-muted">{item.animalSpecies}</span>
          <Badge variant={STATUS_VARIANTS[item.status] ?? "outline"} className="ml-auto text-[10px]">
            {STATUS_LABELS[item.status]}
          </Badge>
        </div>
        <p className="mt-0.5 text-xs font-medium text-forest-800">{item.service}</p>
        <div className="mt-1 flex flex-wrap gap-3 text-[11px] text-ink-muted">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {item.preferredDate}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {item.preferredTime}
          </span>
          <span>{item.contactName}</span>
        </div>
      </div>
    </li>
  );
}
