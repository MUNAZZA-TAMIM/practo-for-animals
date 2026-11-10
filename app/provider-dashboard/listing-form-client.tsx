"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/input";
import { updateProviderListing } from "@/app/provider-dashboard/actions";
import { useActionState } from "react";
import type { Provider } from "@/lib/data/providers";
import { Phone, Mail, Globe } from "lucide-react";

export function ProviderListingEditFormClient({
  provider,
}: {
  provider: Provider;
}) {
  const [listingState, updateListingAction] = useActionState(updateProviderListing, {
    status: "idle",
  });

  return (
    <section className="rounded-[20px] border border-line bg-white-warm p-5 sm:p-6 shadow-card">
      <div className="flex items-end justify-between gap-3 mb-5">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-muted/70">
            Business details
          </p>
          <p className="text-[11px] text-ink-muted">
            Changes are saved to your listing and appear on your public profile.
          </p>
        </div>
      </div>

      <form action={updateListingAction} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="listing-name">Business name</Label>
            <Input
              id="listing-name"
              name="name"
              defaultValue={provider.name}
              required
              maxLength={120}
              placeholder="e.g. Cedar & Clover Veterinary"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="listing-about">Description</Label>
            <Textarea
              id="listing-about"
              name="about"
              defaultValue={provider.about}
              required
              rows={4}
              maxLength={1000}
              placeholder="Describe your practice, approach, and what makes it unique."
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="listing-category">Category</Label>
            <Select id="listing-category" name="category" required>
              <option value="veterinary">Veterinary care</option>
              <option value="emergency">Emergency care</option>
              <option value="grooming">Grooming & wellness</option>
              <option value="boarding">Boarding & daycare</option>
              <option value="training">Training & behaviour</option>
              <option value="mobile">Home visits</option>
              <option value="exotic">Exotic & avian care</option>
              <option value="rescue">Rescues & rehoming</option>
              <option value="equine">Equine care</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="listing-address">Address</Label>
            <Input
              id="listing-address"
              name="address"
              defaultValue={provider.address}
              required
              maxLength={200}
              placeholder="e.g. 12, 100 Feet Road, Indiranagar"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="listing-phone">Phone</Label>
            <div className="flex items-start gap-2">
              <Phone className="mt-1 h-4 w-4 text-ink-muted" aria-hidden="true" />
              <Input
                id="listing-phone"
                name="phone"
                type="tel"
                defaultValue={provider.phone}
                required
                maxLength={24}
                placeholder="+91 80 5550 0100"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="listing-email">Email</Label>
            <div className="flex items-start gap-2">
              <Mail className="mt-1 h-4 w-4 text-ink-muted" aria-hidden="true" />
              <Input
                id="listing-email"
                name="email"
                type="email"
                defaultValue={provider.email ?? ""}
                maxLength={160}
                placeholder="hello@clinic.example"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="listing-website">Website</Label>
            <div className="flex items-start gap-2">
              <Globe className="mt-1 h-4 w-4 text-ink-muted" aria-hidden="true" />
              <Input
                id="listing-website"
                name="website"
                type="url"
                defaultValue={provider.website ?? ""}
                maxLength={500}
                placeholder="https://example.com/clinic"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="listing-hours">Opening hours</Label>
            <Input
              id="listing-hours"
              name="hours"
              defaultValue={provider.hours}
              required
              maxLength={200}
              placeholder="Mon–Sat · 9:00–19:00"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="listing-services">Services offered</Label>
          <div className="flex flex-wrap gap-2">
            {provider.services.map((service) => (
              <ServicePill key={service} value={service} />
            ))}
          </div>
          <p className="mt-1 text-[10px] text-ink-muted/60">
            Select the services you offer. Animal owners can filter by service
            when requesting appointments.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="listing-species">Animals treated</Label>
          <div className="flex flex-wrap gap-2">
            {provider.species.map((species) => (
              <SpeciesPill key={species} value={species} />
            ))}
          </div>
          <p className="mt-1 text-[10px] text-ink-muted/60">
            Select the animal types you care for.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="listing-price-note">Price note (optional)</Label>
          <Input
            id="listing-price-note"
            name="priceNote"
            defaultValue={provider.priceNote}
            maxLength={500}
            placeholder="e.g. Consultation pricing shared before booking"
          />
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
          <Button type="button" variant="outlineInverse" size="sm" asChild>
            <Link href="/provider-dashboard">Cancel</Link>
          </Button>
          <Button type="submit" size="sm">
            Save changes
          </Button>
        </div>
      </form>
    </section>
  );
}

function ServicePill({ value }: { value: string }) {
  return (
    <span
      key={value}
      className="rounded-full border px-2.5 py-1 text-[9px] font-bold bg-white-warm border-line text-forest-800"
    >
      {value}
    </span>
  );
}

function SpeciesPill({ value }: { value: string }) {
  return (
    <span
      key={value}
      className="rounded-full border px-2.5 py-1 text-[9px] font-bold bg-white-warm border-line text-forest-800"
    >
      {value}
    </span>
  );
}
