import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ShieldAlert } from "lucide-react";
import { requireProvider } from "@/lib/auth/session";
import { getProviderByUserId } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/workspace/page-heading";

export default async function ProviderSettingsPage() {
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
        eyebrow="Business settings"
        title="Settings"
        description="Manage your business preferences and contact information."
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
          <SettingsFormSection provider={provider} />
        </div>
        <div className="space-y-6">
          <SettingsInfoCard provider={provider} />
        </div>
      </div>
    </div>
  );
}

function SettingsFormSection({ provider }: { provider: any }) {
  return (
    <section className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
            Business contact details
          </p>
          <p className="text-[11px] text-ink-muted">
            Update how animal owners can reach you.
          </p>
        </div>
      </div>

      <form className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="settings-name">Business name</Label>
          <Input
            id="settings-name"
            name="name"
            defaultValue={provider.name}
            required
            maxLength={120}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="settings-email">Email address</Label>
          <div className="flex items-start gap-2">
            <Mail className="mt-1 h-4 w-4 text-ink-muted" aria-hidden="true" />
            <Input
              id="settings-email"
              name="email"
              type="email"
              defaultValue={provider.email ?? ""}
              maxLength={160}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="settings-phone">Phone number</Label>
          <div className="flex items-start gap-2">
            <Phone className="mt-1 h-4 w-4 text-ink-muted" aria-hidden="true" />
            <Input
              id="settings-phone"
              name="phone"
              type="tel"
              defaultValue={provider.phone}
              required
              maxLength={24}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="settings-website">Website URL</Label>
          <div className="flex items-start gap-2">
            <Globe className="mt-1 h-4 w-4 text-ink-muted" aria-hidden="true" />
            <Input
              id="settings-website"
              name="website"
              type="url"
              defaultValue={provider.website ?? ""}
              maxLength={500}
              placeholder="https://example.com/clinic"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="settings-hours">Opening hours</Label>
          <Input
            id="settings-hours"
            name="hours"
            defaultValue={provider.hours}
            required
            maxLength={200}
            placeholder="Mon–Sat · 9:00–19:00"
          />
        </div>
      </form>
    </section>
  );
}

function SettingsInfoCard({ provider }: { provider: any }) {
  return (
    <section className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card sticky top-24">
      <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70 mb-4">
        About settings
      </p>
      <ul className="space-y-4">
        <li className="flex items-start gap-3">
          <div className="mt-1 h-4 w-4 rounded-full bg-mint-100 flex items-center justify-center text-forest-800">
            <span className="text-[9px] font-bold">1</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
              Contact details
            </p>
            <p className="text-[11px] text-ink-muted">
              Phone, email, and website are displayed on your public profile so
              animal owners can reach you.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 h-4 w-4 rounded-full bg-mint-100 flex items-center justify-center text-forest-800">
            <span className="text-[9px] font-bold">2</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
              Opening hours
            </p>
            <p className="text-[11px] text-ink-muted">
              Helps animal owners know when you&rsquo;re available before
              requesting an appointment.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3">
          <div className="mt-1 h-4 w-4 rounded-full bg-mint-100 flex items-center justify-center text-forest-800">
            <span className="text-[9px] font-bold">3</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-ink-muted/60">
              Authorization
            </p>
            <p className="text-[11px] text-ink-muted">
              You are signed in as a provider. Your listing data is protected
              and can only be modified by your authenticated session.
            </p>
          </div>
        </li>
      </ul>

      <div className="mt-6 pt-6 border-t border-line">
        <Badge
          variant={
            provider.status === "published"
              ? "success"
              : provider.status === "paused"
                ? "muted"
                : "warning"
          }
        >
          {provider.status === "published"
            ? "Published"
            : provider.status === "paused"
              ? "Paused"
              : "Draft"}
        </Badge>
      </div>
    </section>
  );
}

import { Mail, Phone, Globe } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
