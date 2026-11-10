import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireProvider } from "@/lib/auth/session";
import { getProviderByUserId } from "@/lib/db";
import { ProviderShell } from "@/components/provider-dashboard/provider-shell";

export const metadata: Metadata = {
  title: "Provider Dashboard",
  robots: { index: false, follow: false },
};

export default async function ProviderDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireProvider();
  if (!session.providerId) {
    redirect("/provider-login?notice=account-setup");
  }

  const provider = await getProviderByUserId(session.providerId);
  if (!provider) {
    redirect("/provider-login?notice=account-setup");
  }

  return (
    <ProviderShell provider={provider}>
      {children}
    </ProviderShell>
  );
}
