import type { Metadata } from "next";
import { Cookie, Database, EyeOff, MessageSquare, ShieldCheck } from "lucide-react";
import { LegalPage } from "@/components/marketing/legal-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How the Practo for Animals demonstration handles form submissions, browser drafts, and the demo session cookie.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      breadcrumb="Privacy"
      title="A small demo should collect a small amount of data."
      description="This policy explains exactly what the demonstration stores, where it lives, and what it deliberately does not do. It is written to match the implementation, not to describe an imaginary production service."
      updated="10 November 2026"
      aside={
        <div className="rounded-[24px] border border-line bg-white-warm p-6 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-forest-700">
            The short version
          </p>
          <ul className="mt-4 space-y-3">
            {[
              { icon: Database, text: "Form submissions go to a local JSON file, not a live cloud database." },
              { icon: Cookie, text: "One HttpOnly cookie holds the demo session for eight hours." },
              { icon: EyeOff, text: "No analytics, advertising pixels, or third-party trackers." },
              { icon: ShieldCheck, text: "Do not submit real personal or medical information." },
            ].map((item) => (
              <li key={item.text} className="flex gap-2.5 text-[11px] leading-5 text-ink-muted">
                <item.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      }
      sections={[
        {
          title: "What this demonstration is",
          body: (
            <>
              <p>
                Practo for Animals is an independent internship concept. It is
                not an official Practo product, and it does not provide
                veterinary care, diagnosis, or emergency services. The provider
                directory contains sample listings that do not represent real
                businesses, verification, ratings, or partnerships.
              </p>
              <p>
                Because this is a demonstration, the privacy expectations are
                deliberately narrow: use sample information, explore the
                product, and avoid entering anything you would not want stored
                in a local file.
              </p>
            </>
          ),
        },
        {
          title: "What the forms collect",
          body: (
            <>
              <p>Public forms may ask for:</p>
              <ul>
                <li>business listing enquiry details: business name, category, city, contact name, email, phone, website, services, species, and message;</li>
                <li>correction details: provider, field, proposed value, evidence URL, note, and submitter contact details;</li>
                <li>academy enquiry details: name, email, optional phone and city, role, organisation, programme, and goals;</li>
                <li>studio projects: the brief, researched outline, slide copy, design direction, reviewer name, and review notes.</li>
              </ul>
              <p>
                The forms also include a hidden honeypot field used only to
                reduce automated spam. Every submitted value is validated with
                server-side schemas before it is stored.
              </p>
            </>
          ),
        },
        {
          title: "Where the data lives",
          body: (
            <>
              <p>
                In this build, submitted records are written to a local JSON
                data store at <code>.data/db.json</code> on the machine running
                the application. The Supabase adapter is documented but not
                active. No live Supabase project, CRM, email platform, or n8n
                instance receives the data.
              </p>
              <p>
                Studio drafts are different: they autosave in your browser’s{" "}
                <code>localStorage</code> under a single draft key, so you can
                leave and return. Clearing the draft in the studio or clearing
                browser storage removes it.
              </p>
            </>
          ),
        },
        {
          title: "Cookies and the demo session",
          body: (
            <>
              <p>
                The workspace uses one cookie named <code>pfa_session</code>. It
                contains a signed session token with your demo name, email, and
                role. It is <code>HttpOnly</code>, <code>SameSite=Lax</code>,
                and marked <code>Secure</code> in production. It expires after
                eight hours, and signing out clears it.
              </p>
              <p>
                The cookie is required for the dashboard and admin routes. It is
                not a marketing or analytics cookie, and it is not shared with
                third parties.
              </p>
            </>
          ),
        },
        {
          title: "Why information is used",
          body: (
            <>
              <ul>
                <li>to display a confirmation and reference for a submission;</li>
                <li>to let a founder or administrator review sample enquiries and corrections;</li>
                <li>to record a human content-review decision and an audit entry;</li>
                <li>to demonstrate the intended product flow honestly, including where automation is simulated.</li>
              </ul>
              <p>
                The demonstration does not sell data, build advertising
                profiles, or use submissions to train an external model.
              </p>
            </>
          ),
        },
        {
          title: "Retention, reset, and deletion",
          body: (
            <>
              <p>
                There is no automatic retention job. The local dataset persists
                until it is reset from the admin console or the JSON file is
                removed. The administrator reset restores the seeded sample
                dataset and removes submissions created during the demo; it
                cannot be undone.
              </p>
              <p>
                Because no email provider is configured, deletion requests cannot
                be verified or acknowledged automatically. If you need a record
                removed from a running demonstration, use the admin reset or
                ask the person operating the environment to delete{" "}
                <code>.data/db.json</code>.
              </p>
            </>
          ),
        },
        {
          title: "Automation and third parties",
          body: (
            <>
              <p>
                Workflow run records show steps that were completed, simulated,
                or left pending. In this environment, notification and email
                steps are simulated. Importable n8n workflow files exist in the
                repository but are not executed. Canva handoff is manual: the
                studio produces Markdown, CSV, and JSON files on your device.
              </p>
              <p>
                Photography is served from local files downloaded from Unsplash
                and Pexels under their licences. No analytics scripts, ad
                networks, or social embeds are loaded.
              </p>
            </>
          ),
        },
        {
          title: "Your choices",
          body: (
            <>
              <ul>
                <li>Use the demo without signing in; only workspace routes require a session.</li>
                <li>Discard the studio draft at any time; exports happen on your device.</li>
                <li>Sign out to clear the session cookie.</li>
                <li>Do not submit real medical records, emergency details, or another person’s information.</li>
              </ul>
            </>
          ),
        },
        {
          title: "Children and sensitive information",
          body: (
            <>
              <p>
                This demonstration is intended for an adult professional
                audience. It is not directed at children. Public forms ask you
                not to include medical histories, diagnoses, prescriptions, or
                other sensitive health information. If such information is
                submitted accidentally, use the reset control or remove the
                local data file.
              </p>
            </>
          ),
        },
        {
          title: "Changes and contact",
          body: (
            <>
              <p>
                This policy may change as the concept develops. The “last
                updated” date above reflects the version implemented in this
                build.
              </p>
              <p>
                Demo contact:{" "}
                <a href={`mailto:${siteConfig.demoEmail}`}>{siteConfig.demoEmail}</a>.
                This address is part of the demonstration and may not be
                monitored.
              </p>
              <p className="flex items-start gap-2 rounded-xl bg-ivory-100 p-3 text-[11px] text-ink-muted">
                <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest-600" aria-hidden="true" />
                This is a demonstration policy, not legal advice or a certified
                privacy programme.
              </p>
            </>
          ),
        },
      ]}
    />
  );
}
