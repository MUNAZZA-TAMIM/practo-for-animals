"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export type FAQ = {
  question: string;
  answer: string;
};

export const HOME_FAQS: FAQ[] = [
  {
    question: "What is Practo for Animals?",
    answer:
      "Practo for Animals is an independent internship concept that helps people discover animal-care providers. It is not an official Practo product, and the directory is a demonstration rather than a live commercial service.",
  },
  {
    question: "What types of animal-care services can I find?",
    answer:
      "You can discover veterinary clinics, animal hospitals, diagnostics, boarding, grooming, ambulances, rescue organisations and equine care — all organised by category, city and species.",
  },
  {
    question: "How can I find veterinary clinics near me?",
    answer:
      "Use the search on the homepage or visit the directory. You can filter by city, care type and species to narrow your results.",
  },
  {
    question: "Can I list my animal-care business?",
    answer:
      "Yes. Use the “List Your Business” option to prepare a listing. Submissions are reviewed before anything is prepared for publication.",
  },
  {
    question: "How can I report incorrect provider information?",
    answer:
      "Use the “Report Incorrect Information” link to submit a correction. A member of the team will review your request before any changes are made.",
  },
  {
    question: "Are all listed providers verified?",
    answer:
      "No. Every listing is marked as sample data. There is no provider verification, rating, ranking or partnership claimed. Verification status depends on the platform’s actual verification process, which is not yet live.",
  },
  {
    question: "Can I use Practo for Animals for farm animal care?",
    answer:
      "Yes. The directory includes equine and farm animal care categories. Use the category explorer or search to find providers who work with horses, livestock and other farm animals.",
  },
] as const;

export function HomeFAQ() {
  return (
    <section className="section-pad border-t border-line/70 bg-ivory-100/60" id="faq">
      <div className="container-page">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-2xl">
            <p className="kicker">A few things worth knowing</p>
            <h2 className="mt-4 text-[40px] leading-[1.01] tracking-[-0.04em] text-forest-900 sm:text-[48px]">
              Clearer answers,{" "}
              <span className="display-italic text-forest-700">before you begin.</span>
            </h2>
            <p className="mt-5 max-w-sm text-[14px] leading-7 text-ink-muted">
              This is an independent concept, not a live commercial directory. The details below explain
              exactly what is real and what is illustrative.
            </p>
          </div>
        </div>

        <Accordion type="multiple" className="border-t border-line">
          {HOME_FAQS.map((faq, index) => (
            <AccordionItem key={`faq-${index}`} value={`faq-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
