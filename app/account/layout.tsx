import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import { AccountShell } from "@/components/workspace/account-shell";

export const metadata: Metadata = {
  title: "My account",
  robots: { index: false, follow: false },
};

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser("/account");

  return (
    <AccountShell user={session} counts={{ appointments: 0 }}>
      {children}
    </AccountShell>
  );
}
