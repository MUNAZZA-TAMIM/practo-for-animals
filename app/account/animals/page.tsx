import { requireUser } from "@/lib/auth/session";
import { getAnimals } from "@/lib/db";
import { AnimalList } from "@/components/dashboard/animal-list";
import { PageHeading } from "@/components/workspace/page-heading";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AccountAnimalsPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const session = await requireUser("/account");
  const params = await searchParams;
  const animals = await getAnimals(session.sub);

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Your animals"
        title="My animals"
        description="Manage your animal profiles. Select an animal when requesting an appointment so your provider knows who needs care."
        actions={
          <>
            <Button asChild size="sm">
              <a href="/find">
                Find animal care
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </Button>
          </>
        }
      />

      {params.notice === "signed-out" ? (
        <div className="rounded-xl border border-forest-700/15 bg-mint-100 p-4">
          <p className="text-[12px] font-medium text-forest-800">
            You have been signed out. Your demo session cookie was cleared.
          </p>
        </div>
      ) : null}

      <AnimalList animals={animals} />
    </div>
  );
}
