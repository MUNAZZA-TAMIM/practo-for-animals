import type { Metadata } from "next";
import { AlertTriangle, BookOpenCheck, PawPrint, ShieldAlert } from "lucide-react";
import { LegalPage } from "@/components/marketing/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms for using the Practo for Animals demonstration: sample directory, no veterinary advice, human-reviewed content, and demo accounts.",
};

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Terms"
      breadcrumb="Terms"
      title="A careful concept, with clear limits."
      description="These terms describe how the demonstration may be used, what it does not promise, and why the sample directory, academy, and studio must not be treated as production services."
      updated="10 November 2026"
      aside={
        <div className="rounded-[24px] border border-line bg-white-warm p-6 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-forest-700">
            What this is not
          </p>
          <ul className="mt-4 space-y-3">
            {[
              { icon: ShieldAlert, text: "Not a veterinary clinic or emergency service." },
              { icon: PawPrint, text: "Not a verified directory of real providers." },
              { icon: BookOpenCheck, text: "Not an accredited course or placement programme." },
              { icon: AlertTriangle, text: "Not an automated publisher of AI content." },
            ].map((item) => (
              <li key={item.text} className="flex gap-2.5 text-[11px] leading-5 text-ink-muted">
                <item.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-coral-500" aria-hidden="true" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      }
      sections={[
        {
          title: "The concept and these terms",
          body: (
            <>
              <p>
                Practo for Animals is an independent internship concept
                exploring animal-care discovery, practical AI education, and a
                human-reviewed content workflow. It is not an official Practo
                product and is not affiliated with or endorsed by Practo.
              </p>
              <p>
                By using the demonstration, you accept these terms. If you do not
                agree, do not use the site or submit information.
              </p>
            </>
          ),
        },
        {
          title: "No veterinary advice, diagnosis, or emergency service",
          body: (
            <>
              <p>
                Nothing on this site is veterinary advice, diagnosis, treatment,
                or a substitute for an examination by a qualified professional.
                Provider profiles, academy lessons, and studio content are
                general educational material at most.
              </p>
              <p>
                If an animal is in pain, struggling to breathe, collapsing,
                bleeding, unable to eat or drink, or showing another urgent
                sign, contact a qualified veterinarian or emergency service
                directly. Do not wait for a response through this demonstration.
              </p>
            </>
          ),
        },
        {
          title: "Sample directory, no verification",
          body: (
            <>
              <p>
                Every provider listing is sample data. Names, addresses, phone
                numbers, hours, services, imagery, and completeness scores are
                illustrative. They do not represent real businesses and do not
                imply verification, accreditation, ratings, reviews, or
                partnerships.
              </p>
              <p>
                Contact actions on provider profiles are disabled and explain
                that the listing is a sample. Do not rely on the directory to
                locate care.
              </p>
            </>
          ),
        },
        {
          title: "Submissions and moderation",
          body: (
            <>
              <p>
                Business enquiries and correction requests are stored for human
                review. Submitting a form does not create a listing, verify a
                business, or guarantee a response. The operator may reject,
                edit, or discard a submission.
              </p>
              <p>
                Do not submit false information, impersonate another person, or
                include sensitive medical records. Correction approvals update
                only the local sample record; they are not external
                verification.
              </p>
            </>
          ),
        },
        {
          title: "Academy content and outcomes",
          body: (
            <>
              <p>
                The AI Academy is a concept programme. Curriculum outlines,
                duration, formats, and outcomes are illustrative. No
                certification, placement, employment outcome, or partnership is
                promised or implied.
              </p>
              <p>
                Enquiries are sample leads stored in the local demo. No email
                confirmation, payment, seat reservation, or enrolment occurs.
              </p>
            </>
          ),
        },
        {
          title: "Content Studio and human review",
          body: (
            <>
              <p>
                Studio research and first drafts are generated by a deterministic
                local demonstrator unless an n8n endpoint is configured. Output
                may be incomplete, generic, or wrong. A named human reviewer
                must confirm all six review checks before a project can be
                saved to the review queue.
              </p>
              <p>
                No content is published automatically. Exports are files created
                on your device. You are responsible for verifying claims,
                checking medical accuracy, respecting image licences, and
                adapting copy before any real use.
              </p>
            </>
          ),
        },
        {
          title: "Demo accounts and acceptable use",
          body: (
            <>
              <p>
                The workspace uses two seeded demonstration accounts. Do not
                reuse the demo credentials for any real service. Do not attempt
                to access accounts, data, or functions you are not authorised to
                use.
              </p>
              <p>You agree not to:</p>
              <ul>
                <li>submit malicious code, spam, or automated bulk content;</li>
                <li>probe, disrupt, or overload the service;</li>
                <li>misrepresent the demonstration as a verified care provider or official programme;</li>
                <li>use the studio to create harmful, misleading, or unlawful content.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Intellectual property and photography",
          body: (
            <>
              <p>
                The interface, written concept, and original code are part of
                this demonstration. Photography is used illustratively under
                Unsplash and Pexels licences and does not depict the sample
                providers. Logo names and trademarks remain the property of
                their respective owners.
              </p>
              <p>
                You retain responsibility for any text you enter. By submitting
                it, you confirm you have the right to share it for demonstration
                purposes.
              </p>
            </>
          ),
        },
        {
          title: "Availability, changes, and liability",
          body: (
            <>
              <p>
                The demonstration is provided “as is” and may change or be
                removed at any time. There is no uptime commitment, support
                commitment, or guarantee that local data will persist. On
                serverless infrastructure, the local JSON store is ephemeral.
              </p>
              <p>
                To the extent permitted by applicable law, the operator is not
                liable for indirect or consequential loss arising from use of
                the demonstration, reliance on sample data, or decisions made
                from generated content. Nothing in these terms excludes
                liability that cannot lawfully be excluded.
              </p>
            </>
          ),
        },
        {
          title: "Contact",
          body: (
            <>
              <p>
                Questions about the concept can be sent to{" "}
                <a href={`mailto:${siteConfig.demoEmail}`}>{siteConfig.demoEmail}</a>.
                This is a demonstration address and may not be monitored.
              </p>
              <p>
                These terms are a demonstration document, not legal advice. A
                production launch would require review by qualified counsel and
                a real operating entity.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
