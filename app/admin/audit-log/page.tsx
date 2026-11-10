import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { getAuditLogs } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/workspace/page-heading";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/utils";
import type { AuditLog } from "@/lib/db";

export default async function AdminAuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ actor?: string; action?: string }>;
}) {
  const params = await searchParams;
  const logs = await getAuditLogs();

  const actors = [...new Set(logs.map((log) => log.actor))].sort();
  const actions = [
    ...new Set(logs.map((log) => log.action.split(".")[0])),
  ].sort();

  const actorFilter = params.actor ?? "";
  const actionFilter = params.action ?? "";

  const filtered = logs.filter((log) => {
    if (actorFilter && log.actor !== actorFilter) return false;
    if (actionFilter && !log.action.startsWith(actionFilter + ".")) return false;
    return true;
  });

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="Audit history"
        title="Review log"
        description="Every moderation decision, provider status change, and appointment review is recorded here with the actor, timestamp, and entity affected."
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

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
            Total entries
          </p>
          <p className="mt-2 font-display text-[30px] leading-none tracking-[-0.04em] text-forest-900">
            {logs.length}
          </p>
        </div>
        <div className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
            Sample data entries
          </p>
          <p className="mt-2 font-display text-[30px] leading-none tracking-[-0.04em] text-forest-900">
            {logs.filter((item) => item.isSample).length}
          </p>
        </div>
        <div className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
            Live review entries
          </p>
          <p className="mt-2 font-display text-[30px] leading-none tracking-[-0.04em] text-forest-900">
            {logs.filter((item) => !item.isSample).length}
          </p>
        </div>
      </div>

      <section className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
              Filter by actor
            </p>
            <select
              name="actor"
              defaultValue={actorFilter}
              onChange={(event) => {
                const value = (event.target as HTMLSelectElement).value;
                const params = new URLSearchParams(window.location.search);
                if (value) params.set("actor", value);
                else params.delete("actor");
                window.location.href = `/admin/audit-log?${params.toString()}`;
              }}
              className="h-10 rounded-[10px] border border-line bg-white-warm px-3.5 py-2.5 text-[13px] text-charcoal shadow-[0_1px_2px_rgba(13,43,35,0.03)] outline-none transition-[border-color,box-shadow] hover:border-forest-900/25 focus:border-forest-700 focus:ring-4 focus:ring-forest-900/8"
            >
              <option value="">All actors</option>
              {actors.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
              Filter by action
            </p>
            <select
              name="action"
              defaultValue={actionFilter}
              onChange={(event) => {
                const value = (event.target as HTMLSelectElement).value;
                const params = new URLSearchParams(window.location.search);
                if (value) params.set("action", value);
                else params.delete("action");
                window.location.href = `/admin/audit-log?${params.toString()}`;
              }}
              className="h-10 rounded-[10px] border border-line bg-white-warm px-3.5 py-2.5 text-[13px] text-charcoal shadow-[0_1px_2px_rgba(13,43,35,0.03)] outline-none transition-[border-color,box-shadow] hover:border-forest-900/25 focus:border-forest-700 focus:ring-4 focus:ring-forest-900/8"
            >
              <option value="">All actions</option>
              {actions.map((action) => (
                <option key={action} value={action}>
                  {titleCaseAction(action)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-ivory-50 text-[8px] font-bold uppercase tracking-[0.12em] text-ink-muted/60">
              <tr>
                <th className="px-5 py-3">When</th>
                <th className="px-5 py-3">Actor</th>
                <th className="px-5 py-3">Action</th>
                <th className="px-5 py-3">Entity</th>
                <th className="px-5 py-3 text-right">Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {filtered.length > 0 ? (
                filtered.map((log) => (
                  <tr key={log.id} className="text-[9.5px]">
                    <td className="px-5 py-3">
                      <p className="font-bold text-forest-900">
                        {formatDateTime(log.createdAt)}
                      </p>
                      {log.isSample ? (
                        <span className="ml-1 rounded bg-amber-bg px-1 py-0.5 text-[7px] font-bold uppercase text-amber-ink">
                          seed
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-3 text-ink-muted">{log.actor}</td>
                    <td className="px-5 py-3">
                      <p className="font-bold text-forest-900">
                        {log.action.replaceAll(".", " ").replaceAll("_", " ")}
                      </p>
                    </td>
                    <td className="px-5 py-3 text-ink-muted">
                      {log.entityType.replaceAll("_", " ")}
                    </td>
                    <td className="px-5 py-3 text-right font-mono text-[8.5px] text-ink-muted">
                      {log.entityId}
                    </td>
                  </tr>
                ))
              ) : null}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <p className="mt-3 text-[9px] leading-5 text-ink-muted/60">
            No matching records. Try a different filter.
          </p>
        ) : (
          <p className="mt-3 text-[9px] leading-5 text-ink-muted/60">
            Seed entries are marked and represent demo data created during
            seeding. Live review entries record decisions made by admins through
            this workspace.
          </p>
        )}
      </section>
    </div>
  );
}

function titleCaseAction(action: string): string {
  return action
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
