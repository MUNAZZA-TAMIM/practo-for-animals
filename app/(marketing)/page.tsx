import type { Metadata } from "next";
import { AnimalCareHero } from "@/components/home/AnimalCareHero";
import { AnimalCareCategories } from "@/components/home/AnimalCareCategories";
import { ValueProposition } from "@/components/home/ValueProposition";
import { FeaturedProviders } from "@/components/home/FeaturedProviders";
import { AnimalSelector } from "@/components/home/AnimalSelector";
import { LocationDiscovery } from "@/components/home/LocationDiscovery";
import { ProviderCTA } from "@/components/home/ProviderCTA";
import { CorrectionCTA } from "@/components/home/CorrectionCTA";
import { HomeFAQ } from "@/components/home/HomeFAQ";
import { FinalCTA } from "@/components/home/FinalCTA";

export const metadata: Metadata = {
  title: "Better care starts with a clearer path",
  description:
    "Find animal-care providers, explore veterinary clinics, hospitals, diagnostics and boarding services. Practo for Animals is an independent concept for animal-care discovery.",
};

export default function HomePage() {
  return (
    <>
      {/* Section 01 — Existing cinematic hero */}
      <AnimalCareHero />

      {/* Section 02 — Animal Care Category Explorer */}
      <AnimalCareCategories />

      {/* Section 03 — Trust and Value Proposition */}
      <ValueProposition />

      {/* Section 04 — Featured Animal Care Providers */}
      <FeaturedProviders />

      {/* Section 05 — Search by Animal */}
      <AnimalSelector />

      {/* Section 06 — Location-Based Discovery */}
      <LocationDiscovery />

      {/* Section 07 — For Animal Care Providers */}
      <ProviderCTA />

      {/* Section 08 — Report Incorrect Information */}
      <CorrectionCTA />

      {/* Section 09 — Frequently Asked Questions */}
      <HomeFAQ />

      {/* Section 10 — Final Conversion CTA */}
      <FinalCTA />
    </>
  );
}
