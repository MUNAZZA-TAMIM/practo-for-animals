import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Inbox,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";
import { getBusinessEnquiries, getEducationLeads } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/workspace/page-heading";
import { StatusBadge } from "@/components/workspace/status-badge";
import {
  businessEnquiryStatusAction,
  educationLeadStatusAction,
} from "@/app/dashboard/actions";
import { formatDate, relativeTime, titleCase } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Enquiries",
  robots: { index: false, follow: false },
};

const businessStatuses = ["new", "in_review", "contacted", "closed"] as const;
const educationStatuses = ["new", "contacted", "enrolled", "closed"] as const;

export default async function DashboardEnquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;
  const tab = params.tab === "education" ? "education" : "business";
  const [enquiries, leads] = await Promise.all([
    getBusinessEnquiries(),
    getEducationLeads(),
  ]);

  const businessNew = enquiries.filter((item) => item.status === "new").length;
  const educationNew = leads.filter((item) => item.status === "new").length;

  return (
    <div className="space-y-7">
      <PageHeading
        eyebrow="Public response"
        title="Enquiries & leads"
        description="Every submission is stored before any automation runs. Update the human follow-up status here; no email is sent by this demo."
        actions={
          <Button asChild variant="secondary" size="sm">
            <Link href="/dashboard/workflows">
              Workflow log
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2 border-b border-line">
        <TabLink
          href="/dashboard/enquiries?tab=business"
          active={tab === "business"}
          icon={Building2}
          label="Business enquiries"
          count={businessNew}
        />
        <TabLink
          href="/dashboard/enquiries?tab=education"
          active={tab === "education"}
          icon={GraduationCap}
          label="Academy leads"
          count={educationNew}
        />
      </div>

      {tab === "business" ? (
        <section className="space-y-3">
          {enquiries.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No business enquiries yet"
              detail="Submissions from the public listing form will appear here."
              href="/list-business"
              linkLabel="Open the public form"
            />
          ) : (
            enquiries.map((enquiry) => (
              <article
                key={enquiry.id}
                className="overflow-hidden rounded-[18px] border border-line bg-white-warm"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[15px] font-bold text-forest-900">
                        {enquiry.businessName}
                      </h2>
                      <StatusBadge status={enquiry.status} className="scale-90" />
                      {enquiry.isSample ? (
                        <span className="text-[8.5px] font-bold uppercase tracking-[0.1em] text-amber-ink/70">
                          Sample
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-ink-muted">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" aria-hidden="true" />
                        {enquiry.area}, {enquiry.city}
                      </span>
                      <span>{titleCase(enquiry.category)}</span>
                      <span className="font-mono text-[9px] text-ink-muted/50">
                        {enquiry.reference}
                      </span>
                      <span>{relativeTime(enquiry.createdAt)}</span>
                    </p>
                  </div>

                  <form
                    action={businessEnquiryStatusAction}
                    className="flex shrink-0 items-center gap-2"
                  >
                    <input type="hidden" name="id" value={enquiry.id} />
                    <label htmlFor={`status-${enquiry.id}`} className="sr-only">
                      Update status for {enquiry.businessName}
                    </label>
                    <select
                      id={`status-${enquiry.id}`}
                      name="status"
                      defaultValue={enquiry.status}
                      className="h-9 rounded-full border border-line bg-ivory-50 px-3 text-[10.5px] font-semibold text-forest-900 outline-none focus:border-forest-700"
                    >
                      {businessStatuses.map((status) => (
                        <option key={status} value={status}>
                          {titleCase(status)}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="secondary" size="sm">
                      Update
                    </Button>
                  </form>
                </div>

                <div className="grid gap-4 border-t border-line bg-ivory-50/50 px-5 py-4 sm:grid-cols-2 lg:grid-cols-4">
                  <Detail icon={UserRound} label="Contact" value={enquiry.contactName} />
                  <Detail icon={Mail} label="Email" value={enquiry.email} />
                  <Detail icon={Phone} label="Phone" value={enquiry.phone} />
                  <Detail
                    icon={Building2}
                    label="Website"
                    value={enquiry.website ?? "Not supplied"}
                  />
                </div>

                <details className="group border-t border-line">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 text-[10.5px] font-bold text-forest-800 transition-colors hover:bg-ivory-50">
                    Read the enquiry details
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-open:rotate-90"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="space-y-4 border-t border-line px-5 py-5 text-[11.5px] leading-6 text-ink-muted">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60">
                        Services
                      </p>
                      <p className="mt-1 text-forest-900">{enquiry.services}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60">
                        Species
                      </p>
                      <p className="mt-1 text-forest-900">{enquiry.species}</p>
                    </div>
                    {enquiry.message ? (
                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/60">
                          Message
                        </p>
                        <p className="mt-1">{enquiry.message}</p>
                      </div>
                    ) : null}
                    <p className="text-[9.5px] text-ink-muted/60">
                      Consent recorded: {enquiry.consent ? "yes" : "no"} · Submitted{" "}
                      {formatDate(enquiry.createdAt)}
                    </p>
                  </div>
                </details>
              </article>
            ))
          )}
        </section>
      ) : (
        <section className="space-y-3">
          {leads.length === 0 ? (
            <EmptyState
              icon={GraduationCap}
              title="No academy leads yet"
              detail="Enquiries from programme pages will appear here."
              href="/education"
              linkLabel="Open the AI Academy"
            />
          ) : (
            leads.map((lead) => (
              <article
                key={lead.id}
                className="overflow-hidden rounded-[18px] border border-line bg-white-warm"
              >
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-[15px] font-bold text-forest-900">
                        {lead.fullName}
                      </h2>
                      <StatusBadge status={lead.status} className="scale-90" />
                      {lead.isSample ? (
                        <span className="text-[8.5px] font-bold uppercase tracking-[0.1em] text-amber-ink/70">
                          Sample
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-ink-muted">
                      <span>{lead.organisation || "Independent"}</span>
                      <span>{titleCase(lead.role)}</span>
                      <span className="font-mono text-[9px] text-ink-muted/50">
                        {lead.reference}
                      </span>
                      <span>{relativeTime(lead.createdAt)}</span>
                    </p>
                    <p className="mt-2 inline-flex rounded-full bg-mint-100 px-2.5 py-1 text-[9.5px] font-bold text-forest-800">
                      {lead.programmeName}
                    </p>
                  </div>

                  <form
                    action={educationLeadStatusAction}
                    className="flex shrink-0 items-center gap-2"
                  >
                    <input type="hidden" name="id" value={lead.id} />
                    <label htmlFor={`lead-status-${lead.id}`} className="sr-only">
                      Update status for {lead.fullName}
                    </label>
                    <select
                      id={`lead-status-${lead.id}`}
                      name="status"
                      defaultValue={lead.status}
                      className="h-9 rounded-full border border-line bg-ivory-50 px-3 text-[10.5px] font-semibold text-forest-900 outline-none focus:border-forest-700"
                    >
                      {educationStatuses.map((status) => (
                        <option key={status} value={status}>
                          {titleCase(status)}
                        </option>
                      ))}
                    </select>
                    <Button type="submit" variant="secondary" size="sm">
                      Update
                    </Button>
                  </form>
                </div>

                <div className="grid gap-4 border-t border-line bg-ivory-50/50 px-5 py-4 sm:grid-cols-3">
                  <Detail icon={Mail} label="Email" value={lead.email} />
                  <Detail icon={Phone} label="Phone" value={lead.phone ?? "Not supplied"} />
                  <Detail icon={MapPin} label="City" value={lead.city ?? "Not supplied"} />
                </div>

                {lead.goals ? (
                  <details className="group border-t border-line">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-3 text-[10.5px] font-bold text-forest-800 transition-colors hover:bg-ivory-50">
                      Read the stated goals
                      <ArrowRight
                        className="h-3.5 w-3.5 transition-transform group-open:rotate-90"
                        aria-hidden="true"
                      />
                    </summary>
                    <p className="border-t border-line px-5 py-4 text-[11.5px] leading-6 text-ink-muted">
                      {lead.goals}
                    </p>
                  </details>
                ) : null}
              </article>
            ))
          )}
        </section>
      )}

      <p className="text-[9.5px] leading-5 text-ink-muted/60">
        Contact details are sample values (@example.com) unless a submission was
        created in this local demo. No email or message has been sent. Status
        changes are audit-logged.
      </p>
    </div>
  );
}

function TabLink({
  href,
  active,
  icon: Icon,
  label,
  count,
}: {
  href: string;
  active: boolean;
  icon: typeof Inbox;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 border-b-2 px-3 py-3 text-[11.5px] font-bold transition-colors",
        active
          ? "border-coral-500 text-forest-900"
          : "border-transparent text-ink-muted hover:text-forest-900",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
      {count > 0 ? (
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1 text-[8.5px] font-bold text-forest-950">
          {count}
        </span>
      ) : null}
    </Link>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Inbox;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1.5 text-[8.5px] font-bold uppercase tracking-[0.12em] text-ink-muted/60">
        <Icon className="h-3 w-3" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 truncate text-[11px] font-medium text-forest-900">{value}</p>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  detail,
  href,
  linkLabel,
}: {
  icon: typeof Inbox;
  title: string;
  detail: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="rounded-[18px] border border-dashed border-line bg-white-warm px-6 py-14 text-center">
      <Icon className="mx-auto h-8 w-8 text-forest-500" aria-hidden="true" />
      <p className="mt-3 text-[14px] font-bold text-forest-900">{title}</p>
      <p className="mt-1 text-[11.5px] text-ink-muted">{detail}</p>
      <Button asChild variant="secondary" size="sm" className="mt-4">
        <Link href={href}>{linkLabel}</Link>
      </Button>
    </div>
  );
}
