"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState } from "react";
import { updateProviderAppointmentStatus } from "@/app/provider-dashboard/actions";

export function AppointmentActionFormClient({
  item,
}: {
  item: { id: string; reference: string; service: string; animalName: string; animalSpecies: string; animalAge?: string; preferredDate: string; preferredTime: string; contactName: string; contactPhone: string; status: string; createdAt: string };
}) {
  const [updateState, updateAction] = useActionState(updateProviderAppointmentStatus, {
    status: "idle",
  });

  return (
    <form action={updateAction} className="space-y-2">
      <input type="hidden" name="id" value={item.id} />
      <div className="flex flex-wrap gap-2">
        <Button type="submit" name="decision" value="approve" size="sm">
          Confirm
        </Button>
        <Button type="submit" name="decision" value="reject" variant="danger" size="sm">
          Decline
        </Button>
        <Button type="submit" name="decision" value="request_changes" variant="outlineInverse" size="sm">
          Request changes
        </Button>
        <Button type="submit" name="decision" value="complete" size="sm">
          Mark complete
        </Button>
      </div>
    </form>
  );
}
