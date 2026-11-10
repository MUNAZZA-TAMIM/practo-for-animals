import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import {
  getBusinessEnquiries,
  getContentProjects,
  getCorrections,
  getEducationLeads,
} from "@/lib/db";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";

export const metadata: Metadata = {
  title: "Admin console",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();
  const [enquiries, leads, corrections, projects] = await Promise.all([
    getBusinessEnquiries(),
    getEducationLeads(),
    getCorrections(),
    getContentProjects(),
  ]);

  return (
    <WorkspaceShell
      user={session}
      console="admin"
      counts={{
        enquiries:
          enquiries.filter((item) => item.status === "new").length +
          leads.filter((item) => item.status === "new").length,
        corrections: corrections.filter((item) => item.status === "pending").length,
        content: projects.filter((item) => item.status === "in_review").length,
      }}
    >
      {children}
    </WorkspaceShell>
  );
}
