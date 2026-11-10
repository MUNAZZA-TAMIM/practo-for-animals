import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  CircleAlert,
  FilePenLine,
  Inbox,
  PawPrint,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Workflow,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import {
  getAuditLogs,
  getBusinessEnquiries,
  getContentProjects,
  getCorrections,
  getEducationLeads,
  getProviders,
  getWorkflowRuns,
} from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/workspace/page-heading";
import { relativeTime } from "@/lib/utils";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardOverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const [session, params, providers, enquiries, leads, corrections, projects, runs, logs] =
    await Promise.all([
      requireUser("/dashboard"),
      searchParams,
      getProviders(),
      getBusinessEnquiries(),
      getEducationLeads(),
      getCorrections(),
      getContentProjects(),
      getWorkflowRuns(),
      getAuditLogs(),
    ]);

  const publishedProviders = providers.filter((item) => item.status === "published");
  const openEnquiries =
    enquiries.filter((item) => item.status === "new").length +
    leads.filter((item) => item.status === "new").length;
  const pendingCorrections = corrections.filter((item) => item.status === "pending");
  const awaitingSignOff = projects.filter((item) => item.status === "in_review");
  const needsAttention = runs.filter((item) => item.status === "needs_attention");

  const queue = [
    ...pendingCorrections.map((item) => ({
      kind: "Correction" as const,
      title: `${item.providerName} · ${item.field}`,
      detail: `Proposed: ${item.proposedValue}`,
      href: "/dashboard/corrections",
      date: item.createdAt,
      status: item.status,
    })),
    ...awaitingSignOff.map((item) => ({
      kind: "Content" as const,
      title: item.title,
      detail: `${item.reference} · reviewed by ${item.reviewerName}`,
      href: `/dashboard/content/${item.id}`,
      date: item.updatedAt,
      status: item.status,
    })),
    ...enquiries
      .filter((item) => item.status === "new")
      .map((item) => ({
        kind: "Enquiry" as const,
        title: item.businessName,
        detail: `${item.city} · ${item.category.replaceAll("_", " ")}`,
        href: "/dashboard/enquiries?tab=business",
        date: item.createdAt,
        status: item.status,
      })),
    ...leads
      .filter((item) => item.status === "new")
      .map((item) => ({
        kind: "Academy" as const,
        title: item.fullName,
        detail: item.programmeName,
        href: "/dashboard/enquiries?tab=education",
        date: item.createdAt,
        status: item.status,
      })),
    ...needsAttention.map((item) => ({
      kind: "Workflow" as const,
      title: item.subjectLabel,
      detail: `Run stuck · ${item.workflow.replaceAll("-", " ")}`,
      href: "/dashboard/workflows",
      date: item.startedAt,
      status: item.status as string,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  const stats = [
    {
      label: "Published providers",
      value: publishedProviders.length,
      sub: `of ${providers.length} total`,
      href: "/dashboard/providers",
      icon: Building2,
      color: "green",
    },
    {
      label: "Open enquiries",
      value: openEnquiries,
      sub: "awaiting response",
      href: "/dashboard/enquiries",
      icon: Inbox,
      color: openEnquiries > 0 ? "amber" : "gray",
    },
    {
      label: "Pending corrections",
      value: pendingCorrections.length,
      sub: "need review",
      href: "/dashboard/corrections",
      icon: CircleAlert,
      color: pendingCorrections.length > 0 ? "red" : "gray",
    },
    {
      label: "Content awaiting sign-off",
      value: awaitingSignOff.length,
      sub: "projects in review",
      href: "/dashboard/content",
      icon: FilePenLine,
      color: awaitingSignOff.length > 0 ? "blue" : "gray",
    },
  ];

  const quickLinks = [
    { href: "/dashboard/providers", label: "Provider directory", icon: Building2, desc: "Review and manage listings" },
    { href: "/dashboard/enquiries", label: "Enquiries", icon: Inbox, desc: "Business and academy leads" },
    { href: "/dashboard/corrections", label: "Corrections", icon: CircleAlert, desc: "Review proposed changes" },
    { href: "/dashboard/content", label: "Content studio", icon: Sparkles, desc: "AI-generated carousels" },
    { href: "/dashboard/workflows", label: "Workflows", icon: Workflow, desc: "Automation run history" },
    { href: "/admin", label: "Admin console", icon: ShieldCheck, desc: "System and security settings" },
  ];

  const recentLogs = logs.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeading
        eyebrow="Founder workspace"
        title={
          <>
            {greeting()},{" "}
            <span className="display-italic text-forest-600">{session.name}</span>
          </>
        }
        description="Here's what needs your attention across the platform today."
        actions={
          <Button asChild size="sm">
            <Link href="/dashboard/content/new">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              New content project
            </Link>
          </Button>
        }
      />

      {/* Notice banner */}
      {params.notice === "reset-done" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Demo data has been reset to its seed state.
        </div>
      )}

      {/* Stats grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const colorMap: Record<string, { bg: string; icon: string; val: string }> = {
            green: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-700", val: "text-emerald-700" },
            amber: { bg: "bg-amber-50", icon: "bg-amber-100 text-amber-700", val: "text-amber-700" },
            red: { bg: "bg-red-50", icon: "bg-red-100 text-red-700", val: "text-red-700" },
            blue: { bg: "bg-sky-50", icon: "bg-sky-100 text-sky-700", val: "text-sky-700" },
            gray: { bg: "bg-gray-50", icon: "bg-gray-100 text-gray-500", val: "text-gray-700" },
          };
          const c = colorMap[stat.color] ?? colorMap.gray;
          const Icon = stat.icon;
          return (
            <Link key={stat.label} href={stat.href} className="group block">
              <div className={`rounded-2xl border border-line ${c.bg} p-5 shadow-sm transition-shadow hover:shadow-md`}>
                <div className="flex items-start justify-between">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.icon}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-ink-muted/30 group-hover:text-ink-muted transition-colors" />
                </div>
                <p className={`mt-4 text-3xl font-bold leading-none ${c.val}`}>{stat.value}</p>
                <p className="mt-1 text-xs font-semibold text-ink-muted/80">{stat.label}</p>
                <p className="mt-0.5 text-xs text-ink-muted/60">{stat.sub}</p>
              </div>
            </Link>
          );
        })}
      </section>

      {/* Main content */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.5fr]">
        {/* Attention queue */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ink-muted/60">Action queue</p>
              <p className="mt-0.5 text-sm font-semibold text-forest-900">Items needing your attention</p>
            </div>
            {queue.length > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                {queue.length}
              </span>
            )}
          </div>

          {queue.length > 0 ? (
            <ul className="space-y-2">
              {queue.map((item, i) => {
                const kindConfig: Record<string, { bg: string; text: string }> = {
                  Correction: { bg: "bg-red-100", text: "text-red-700" },
                  Content: { bg: "bg-sky-100", text: "text-sky-700" },
                  Enquiry: { bg: "bg-amber-100", text: "text-amber-700" },
                  Academy: { bg: "bg-violet-100", text: "text-violet-700" },
                  Workflow: { bg: "bg-orange-100", text: "text-orange-700" },
                };
                const kc = kindConfig[item.kind] ?? { bg: "bg-gray-100", text: "text-gray-700" };
                return (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="flex items-start gap-3 rounded-xl border border-line/50 p-3.5 hover:border-forest-200 hover:bg-forest-50/50 transition-all group"
                    >
                      <span className={`mt-0.5 inline-flex shrink-0 items-center justify-center rounded-lg px-2 py-0.5 text-[10px] font-bold ${kc.bg} ${kc.text}`}>
                        {item.kind}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-forest-900 truncate">{item.title}</p>
                        <p className="mt-0.5 text-[11px] text-ink-muted truncate">{item.detail}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] text-ink-muted/60">{relativeTime(item.date)}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-ink-muted/30 group-hover:text-forest-600 transition-colors" />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="mt-3 text-sm font-semibold text-forest-900">All clear!</p>
              <p className="mt-1 text-xs text-ink-muted">No items currently require your attention.</p>
            </div>
          )}
        </div>

        {/* Right: Quick links + Recent logs */}
        <div className="space-y-5">
          {/* Quick links */}
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-muted/60 mb-4">Quick access</p>
            <ul className="space-y-1">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-forest-800 hover:bg-forest-50 transition-colors group"
                    >
                      <Icon className="h-4 w-4 shrink-0 text-forest-500 group-hover:text-forest-700" />
                      <span className="font-medium">{link.label}</span>
                      <ArrowRight className="ml-auto h-3.5 w-3.5 text-ink-muted/30 group-hover:text-forest-600 transition-colors" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Recent audit log */}
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-muted/60">Recent activity</p>
              <Link href="/dashboard/audit" className="text-[11px] font-semibold text-forest-700 hover:text-forest-900">
                View all
              </Link>
            </div>
            {recentLogs.length > 0 ? (
              <ul className="space-y-3">
                {recentLogs.map((log) => (
                  <li key={log.id} className="flex items-start gap-2.5">
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-forest-400" />
                    <div className="min-w-0">
                      <p className="text-[11px] font-medium text-forest-900 leading-tight">{log.detail}</p>
                      <p className="mt-0.5 text-[10px] text-ink-muted/60">{log.actor} · {relativeTime(log.createdAt)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-ink-muted text-center py-3">No activity yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Platform overview */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-muted/60 mb-5">Platform at a glance</p>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Total providers", value: providers.length, href: "/dashboard/providers" },
            { label: "Published", value: publishedProviders.length, href: "/dashboard/providers?status=published" },
            { label: "Business enquiries", value: enquiries.length, href: "/dashboard/enquiries?tab=business" },
            { label: "Academy leads", value: leads.length, href: "/dashboard/enquiries?tab=education" },
            { label: "Corrections", value: corrections.length, href: "/dashboard/corrections" },
            { label: "Content projects", value: projects.length, href: "/dashboard/content" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="group text-center">
              <p className="text-2xl font-bold text-forest-800 group-hover:text-forest-600 transition-colors">{item.value}</p>
              <p className="mt-0.5 text-xs text-ink-muted/70">{item.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
