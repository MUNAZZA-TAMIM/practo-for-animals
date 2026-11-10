import Link from "next/link";
import { redirect } from "next/navigation";
import { requireProvider } from "@/lib/auth/session";
import { getProviderByUserId } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeading } from "@/components/workspace/page-heading";
import { ProviderListingEditFormClient } from "@/app/provider-dashboard/listing-form-client";
import type { Provider } from "@/lib/data/providers";
import { ArrowRight, MapPin, Phone, Mail, Globe, Calendar, PawPrint } from "lucide-react";

export default async function ProviderListingPage() {
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
        eyebrow="Business listing"
        title="Manage your listing"
        description="Update your business details so animal owners can find and contact you."
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

      <ProviderListingEditFormClient provider={provider} />
    </div>
  );
}
