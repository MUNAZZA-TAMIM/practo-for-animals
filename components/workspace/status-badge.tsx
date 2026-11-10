import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusMap: Record<
  string,
  { label: string; variant: "default" | "success" | "warning" | "danger" | "muted" | "outline" | "sample" | "coral" }
> = {
  new: { label: "New", variant: "coral" },
  in_review: { label: "In review", variant: "warning" },
  contacted: { label: "Contacted", variant: "success" },
  enrolled: { label: "Enrolled", variant: "success" },
  closed: { label: "Closed", variant: "muted" },
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  draft: { label: "Draft", variant: "muted" },
  changes_requested: { label: "Changes requested", variant: "danger" },
  exported: { label: "Exported", variant: "default" },
  published: { label: "Published", variant: "success" },
  paused: { label: "Paused", variant: "muted" },
  queued: { label: "Queued", variant: "muted" },
  running: { label: "Running", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  needs_attention: { label: "Needs attention", variant: "warning" },
  failed: { label: "Failed", variant: "danger" },
  simulated: { label: "Simulated", variant: "outline" },
};

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const entry = statusMap[status] ?? {
    label: status.replaceAll("_", " "),
    variant: "outline" as const,
  };
  return (
    <Badge variant={entry.variant} className={cn("whitespace-nowrap", className)}>
      {entry.label}
    </Badge>
  );
}
