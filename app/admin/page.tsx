import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  Check,
  CheckCircle2,
  CircleAlert,
  Database,
  KeyRound,
  RefreshCcw,
  ServerCog,
  ShieldCheck,
  Users,
  XCircle,
  Inbox,
  Building2,
  FilePenLine,
  Clock,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth/session";
import { getDemoAccounts } from "@/lib/auth/demo-accounts";
import { getIntegrationStatus } from "@/lib/config";
import {
  getAuditLogs,
  getAppointmentRequests,
  getBusinessEnquiries,
  getContentProjects,
  getCorrections,
  getEducationLeads,
  getProviders,
  getWorkflowRuns,
} from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/workspace/page-heading";
import { ConfirmSubmit } from "@/components/workspace/confirm-submit";
import { relativeTime, titleCase } from "@/lib/utils";
import { resetDemoDataAction } from "@/app/dashboard/actions";

export const metadata: Metadata = {
  title: "Admin console",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const [session, params, integration, providers, enquiries, leads, corrections, projects, runs, logs, accounts, appointmentRequests] =
    await Promise.all([
      requireAdmin(),
      searchParams,
      Promise.resolve(getIntegrationStatus()),
      getProviders(),
      getBusinessEnquiries(),
      getEducationLeads(),
      getCorrections(),
      getContentProjects(),
      getWorkflowRuns(),
      getAuditLogs(),
      Promise.resolve(getDemoAccounts()),
      getAppointmentRequests(),
    ]);

  const integrations = [
    { label: "Supabase", value: integration.supabaseConfigured ? "Connected" : "Not configured", ok: integration.supabaseConfigured },
    { label: "n8n content webhook", value: integration.n8nContentConfigured ? "URL set" : "Not configured", ok: integration.n8nContentConfigured },
    { label: "n8n lead webhook", value: integration.n8nLeadConfigured ? "URL set" : "Not configured", ok: integration.n8nLeadConfigured },
    { label: "Canva handoff", value: integration.canvaTemplateConfigured ? "Template set" : "Manual only", ok: integration.canvaTemplateConfigured },
    { label: "Email delivery", value: integration.emailConfigured ? "Configured" : "Not configured", ok: integration.emailConfigured },
    { label: "Auth secret", value: integration.authSecretConfigured ? "Strong secret" : "Fallback secret", ok: integration.authSecretConfigured },
  ];

  const pendingCorrections = corrections.filter((item) => item.status === "pending");
  const pendingAppointments = appointmentRequests.filter((item) => item.status === "pending");
  const draftProviders = providers.filter((item) => item.status === "draft");
  const publishedProviders = providers.filter((item) => item.status === "published");
  const openEnquiries = enquiries.filter((i) => i.status === "new").length + leads.filter((i) => i.status === "new").length;

  const needsAttention = [
    ...pendingCorrections.map((item) => ({
      kind: "Correction" as const,
      title: `${item.providerName} · ${titleCase(item.field)}`,
      detail: `Proposed: ${item.proposedValue}`,
      href: "/admin/corrections",
      date: item.createdAt,
    })),
    ...pendingAppointments.map((item) => ({
      kind: "Appointment" as const,
      title: `${item.providerName} · ${item.service}`,
      detail: `${item.animalName} · ${item.preferredDate} ${item.preferredTime}`,
      href: "/admin/appointments",
      date: item.createdAt,
    })),
    ...draftProviders.map((item) => ({
      kind: "Draft listing" as const,
      title: item.name,
      detail: `${item.city} · ${item.category}`,
      href: "/admin/providers",
      date: item.createdAt,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8);

  const recentLogs = logs.slice(0, 6);

  const dataStats = [
    { label: "Total providers", value: providers.length, sub: `${publishedProviders.length} published`, href: "/admin/providers", icon: Building2, color: "green" },
    { label: "Open enquiries", value: openEnquiries, sub: "new submissions", href: "/dashboard/enquiries", icon: Inbox, color: openEnquiries > 0 ? "amber" : "gray" },
    { label: "Pending corrections", value: pendingCorrections.length, sub: "need review", href: "/admin/corrections", icon: CircleAlert, color: pendingCorrections.length > 0 ? "red" : "gray" },
    { label: "Appointment requests", value: appointmentRequests.length, sub: `${pendingAppointments.length} pending`, href: "/admin/appointments", icon: Calendar, color: "blue" },
    { label: "Content projects", value: projects.length, sub: "AI-generated", href: "/dashboard/content", icon: FilePenLine, color: "purple" },
    { label: "Workflow runs", value: runs.length, sub: `${runs.filter((r) => r.status === "needs_attention").length} need attention`, href: "/dashboard/workflows", icon: ServerCog, color: "gray" },  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeading
        eyebrow="Admin console"
        title={
          <>
            System{" "}
            <span className="display-italic text-forest-600">overview</span>
          </>
        }
        description="Monitor platform health, review pending items, and manage demo data."
        actions={
          <Badge variant="forest" className="text-xs">
            <ShieldCheck className="h-3.5 w-3.5 mr-1" />
            Admin access
          </Badge>
        }
      />

      {/* Notice */}
      {params.notice === "reset-done" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Demo data has been reset to its seed state.
        </div>
      )}

      {/* Stats grid */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dataStats.map((stat) => {
          const colorMap: Record<string, { bg: string; icon: string; val: string }> = {
            green: { bg: "bg-emerald-50", icon: "bg-emerald-100 text-emerald-700", val: "text-emerald-700" },
            amber: { bg: "bg-amber-50", icon: "bg-amber-100 text-amber-700", val: "text-amber-700" },
            red: { bg: "bg-red-50", icon: "bg-red-100 text-red-700", val: "text-red-700" },
            blue: { bg: "bg-sky-50", icon: "bg-sky-100 text-sky-700", val: "text-sky-700" },
            purple: { bg: "bg-violet-50", icon: "bg-violet-100 text-violet-700", val: "text-violet-700" },
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

      {/* Main 2-col layout */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
        {/* Attention queue */}
        <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ink-muted/60">Action queue</p>
              <p className="mt-0.5 text-sm font-semibold text-forest-900">Items needing attention</p>
            </div>
            {needsAttention.length > 0 && (
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-700">
                {needsAttention.length}
              </span>
            )}
          </div>

          {needsAttention.length > 0 ? (
            <ul className="space-y-2">
              {needsAttention.map((item, i) => {
                const kindConfig: Record<string, { bg: string; text: string }> = {
                  Correction: { bg: "bg-red-100", text: "text-red-700" },
                  Appointment: { bg: "bg-sky-100", text: "text-sky-700" },
                  "Draft listing": { bg: "bg-amber-100", text: "text-amber-700" },
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
              <p className="mt-1 text-xs text-ink-muted">No items need attention right now.</p>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Demo accounts */}
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-4 w-4 text-forest-600" />
              <p className="text-xs font-bold uppercase tracking-widest text-ink-muted/60">Demo accounts</p>
            </div>
            <ul className="space-y-3">
              {accounts.map((account) => (
                <li key={account.email} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest-100 text-xs font-bold text-forest-700">
                    {account.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-forest-900">{account.name}</p>
                    <p className="text-[10px] text-ink-muted truncate">{account.email}</p>
                  </div>
                  <Badge variant={account.role === "founder" ? "forest" : account.role === "admin" ? "warning" : "coral"} className="text-[10px] shrink-0">
                    {account.role}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent audit log */}
          <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-bold uppercase tracking-widest text-ink-muted/60">Audit log</p>
              <Link href="/admin/audit-log" className="text-[11px] font-semibold text-forest-700 hover:text-forest-900">
                View all
              </Link>
            </div>
            {recentLogs.length > 0 ? (
              <ul className="space-y-3">
                {recentLogs.map((log) => (
                  <li key={log.id} className="flex items-start gap-2.5">
                    <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-forest-400" />
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

      {/* Integration status */}
      <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-5">
          <ServerCog className="h-4 w-4 text-forest-600" />
          <p className="text-sm font-semibold text-forest-900">Integration status</p>
          <span className="ml-auto text-xs text-ink-muted/60">Demo mode — no live connections</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {integrations.map((item) => (
            <div key={item.label} className={`flex items-center gap-3 rounded-xl border p-3.5 ${item.ok ? "border-emerald-200 bg-emerald-50/50" : "border-line bg-gray-50/50"}`}>
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${item.ok ? "bg-emerald-100" : "bg-gray-100"}`}>
                {item.ok
                  ? <Check className="h-3.5 w-3.5 text-emerald-600" />
                  : <XCircle className="h-3.5 w-3.5 text-gray-400" />
                }
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-forest-900">{item.label}</p>
                <p className="text-[10px] text-ink-muted/70">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security + Reset */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Security posture */}
        <div className="rounded-2xl border border-forest-800/20 bg-forest-900 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-forest-700">
              <KeyRound className="h-4 w-4 text-emerald-300" />
            </div>
            <h2 className="text-sm font-semibold text-ivory-50">Security posture</h2>
          </div>
          <ul className="space-y-2">
            {[
              "Signed HttpOnly session cookie with server-side re-check on every route.",
              "Zod validation and rate limits on all public-facing actions.",
              "CSP, frame denial, no-sniff, and strict referrer policy enabled.",
              "Every moderation decision appends an audit record.",
              "No service-role key or credential is accessible client-side.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[11px] leading-5 text-ivory-50/70">
                <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-400" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-ivory-50/10 pt-3 text-[10px] text-ivory-50/35">
            Demo-grade only. Supabase Auth, RLS, MFA, and secret rotation are production follow-ups.
          </p>
        </div>

        {/* Reset demo data */}
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 shadow-sm">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
              <RefreshCcw className="h-4 w-4 text-red-600" />
            </div>
            <h2 className="text-sm font-semibold text-red-900">Reset demo data</h2>
          </div>
          <p className="text-xs leading-5 text-red-800/80 mb-5">
            Deletes all enquiries, corrections, content projects, and audit entries added during the demo,
            then restores the original seed dataset. This cannot be undone.
          </p>
          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-2 text-xs text-red-700">
              <Database className="h-3.5 w-3.5 shrink-0" />
              <span>Local JSON store · {logs.length} audit entries</span>
            </div>
          </div>
          <form action={resetDemoDataAction}>
            <ConfirmSubmit
              message="Reset the local demo database to its seed? This removes any submissions and reviews created during this demo."
              variant="danger"
              size="sm"
              pendingLabel="Resetting…"
            >
              <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Restore seed dataset
            </ConfirmSubmit>
          </form>
        </div>
      </div>
    </div>
  );
}
