import { requireUser } from "@/lib/auth/session";
import { getAppointmentRequests } from "@/lib/db";
import { AppointmentList } from "@/components/dashboard/appointment-list";
import { PageHeading } from "@/components/workspace/page-heading";

export default async function AccountAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const session = await requireUser("/account");
  const params = await searchParams;
  const appointments = await getAppointmentRequests(session.sub);

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Your appointments"
        title="Appointment requests"
        description="Track your appointment requests and their current status. Pending requests are reviewed by the provider."
        actions={
          <>
            <a
              href="/find"
              className="rounded-full px-3 py-2 text-[10.5px] font-semibold text-ink-muted transition-colors hover:bg-mint-100 hover:text-forest-900"
            >
              Browse providers
            </a>
          </>
        }
      />

      <AppointmentList appointments={appointments} filterParam={params.filter} />
    </div>
  );
}
