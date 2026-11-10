import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, PawPrint, ShieldAlert, Plus, Trash2 } from "lucide-react";
import { requireProvider } from "@/lib/auth/session";
import { getProviderByUserId } from "@/lib/db";
import { updateProviderServices } from "@/app/provider-dashboard/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/workspace/page-heading";
import { Field } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Provider } from "@/lib/data/providers";

export default async function ProviderServicesPage() {
  const session = await requireProvider();
  if (!session.providerId) {
    redirect("/provider-login?notice=account-setup");
  }
  const provider = await getProviderByUserId(session.providerId);
  if (!provider) {
    redirect("/provider-login?notice=account-setup");
  }

  return (
    <div className="space-y-8">
      <PageHeading
        eyebrow="Services"
        title="Services you offer"
        description="These are the services shown on your public profile and used when animal owners request appointments."
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

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ServicesListSection provider={provider} />
        </div>
        <div className="space-y-6">
          <ServicesInfoCard provider={provider} />
        </div>
      </div>
    </div>
  );
}

function ServicesListSection({ provider }: { provider: Provider }) {
  return (
    <section className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
            Current services
          </p>
          <p className="text-[11px] text-ink-muted">
            {provider.services.length} service{provider.services.length !== 1 ? "s" : ""} listed
          </p>
        </div>
      </div>

      {provider.services.length > 0 ? (
        <ul className="space-y-3">
          {provider.services.map((service, index) => (
            <li
              key={service}
              className="flex items-center justify-between p-3 rounded-xl bg-ivory-50/50 border border-line"
            >
              <div className="flex items-center gap-3">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-mint-100 text-forest-800">
                  <span className="text-[9px] font-bold">{index + 1}</span>
                </div>
                <span className="text-[12px] font-semibold text-forest-900">
                  {service}
                </span>
              </div>
              <Button
                type="button"
                variant="outlineInverse"
                size="sm"
                onClick={() => {
                  // Service removal handled via form
                }}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-line bg-ivory-50 p-8 text-center">
          <PawPrint className="mx-auto h-10 w-10 text-ink-muted/30" aria-hidden="true" />
          <p className="mt-3 text-[11px] font-bold text-forest-900">
            No services listed
          </p>
          <p className="mt-1 text-[10px] text-ink-muted">
            Add services so animal owners know what you offer.
          </p>
        </div>
      )}
    </section>
  );
}

function ServicesInfoCard({ provider }: { provider: Provider }) {
  return (
    <section className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card sticky top-24">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70 mb-4">
        About services
      </p>
      <ul className="space-y-4">
        <li className="flex items-start gap-3">
          <div className="mt-1 h-4 w-4 rounded-full bg-mint-100 flex items-center justify-center text-forest-800">
            <span className="text-[9px] font-bold">1</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
              Public visibility
            </p>
            <p className="text-[11px] text-ink-muted">
              Services appear on your public provider profile and are used when
              animal owners request appointments.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 h-4 w-4 rounded-full bg-mint-100 flex items-center justify-center text-forest-800">
            <span className="text-[9px] font-bold">2</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
              Service management
            </p>
            <p className="text-[11px] text-ink-muted">
              Update your services here. Changes are saved to your listing and
              reflected on your public profile.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 h-4 w-4 rounded-full bg-mint-100 flex items-center justify-center text-forest-800">
            <span className="text-[9px] font-bold">3</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
              Booking flow
            </p>
            <p className="text-[11px] text-ink-muted">
              Animal owners select from these services when requesting an
              appointment with you.
            </p>
          </div>
        </li>
      </ul>

      <div className="mt-6 pt-6 border-t border-line">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
          All services ({provider.services.length})
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {provider.services.map((service) => (
            <span
              key={service}
              className="rounded-full border border-line bg-white-warm px-2.5 py-1 text-[9px] font-bold text-forest-800"
            >
              {service}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
