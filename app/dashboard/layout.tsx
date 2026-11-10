import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/session";
import {
  getBusinessEnquiries,
  getContentProjects,
  getCorrections,
  getEducationLeads,
} from "@/lib/db";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export const metadata: Metadata = {
  title: "Founder dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireUser("/dashboard");
  const [enquiries, educationLeads, corrections, projects] = await Promise.all([
    getBusinessEnquiries(),
    getEducationLeads(),
    getCorrections(),
    getContentProjects(),
  ]);

  return (
    <WorkspaceShell
      user={session}
      counts={{
        enquiries:
          enquiries.filter((item) => item.status === "new").length +
          educationLeads.filter((item) => item.status === "new").length,
        corrections: corrections.filter((item) => item.status === "pending").length,
        content: projects.filter((item) => item.status === "in_review").length,
      }}
    >
      {children}
    </WorkspaceShell>
  );
}
