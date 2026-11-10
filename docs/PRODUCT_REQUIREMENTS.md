# Practo for Animals — Product Requirements

**Document owner:** Product & Design
**Version:** 1.0
**Status:** Approved for build
**Last updated:** 9 November 2026

---

## 1. Product summary

Practo for Animals is a connected animal-care platform with three products that share one brand, one data layer, and one visual system:

1. **Care discovery** — a trustworthy directory that helps pet parents and animal caregivers find the right kind of care, understand what a provider offers, and take the next step.
2. **AI Academy** — a conversion-focused education programme that teaches animal-health teams and pet-care communicators to use AI safely and usefully.
3. **Content Studio** — an AI-assisted carousel workspace that moves from idea to researched outline to editable slides, through a mandatory human review, and out as a Canva-ready handoff pack.

A founder dashboard and protected admin area operate the directory, enquiries, corrections, content projects, and automation health.

### Product promise

> Better care starts with a clearer path.

Every screen should reduce the distance between a person who is worried about an animal and the next useful action.

### What this is not

- Not a veterinary diagnosis or telemedicine product.
- Not a replacement for professional veterinary judgement.
- Not a marketplace that claims verified providers, ratings, placements, testimonials, or partnerships it does not have.
- The build uses **clearly labelled sample directory data** and a **demo programme**. No real provider verification, ratings, testimonials, cohort statistics, or partner logos are fabricated.
- This is an independent internship concept and is not presented as an official Practo product.

---

## 2. Users and jobs to be done

### 2.1 Pet parent / animal caregiver

**Situation:** Something has changed — a new puppy, a limping older dog, a cat who will not eat, a bird with a changed routine — and the next step is unclear.

**Jobs:**
- Find a relevant provider nearby, including emergency and home-visit options.
- Understand species treated, services, hours, and how to make contact.
- Compare options without being overwhelmed or misled.
- Flag incorrect information.

**Primary paths:** Homepage search → Find results → Provider profile → Call / directions. Provider correction. Education or Studio browsing.

### 2.2 Animal-care provider

**Situation:** A clinic, groomer, boarding facility, trainer, or rescue wants to be discoverable, but does not want to hand over control of its information.

**Jobs:**
- Submit a listing with confidence about the review process.
- Understand what information is required and how it will be used.
- Correct an existing listing.

**Primary paths:** For providers → List your practice → Enquiry confirmation. Correction form.

### 2.3 Veterinary team member / pet-care professional

**Situation:** AI tools are impressive in demos and risky in practice. The team wants practical workflows with human review, not hype.

**Jobs:**
- Learn where AI is useful in clinic or content work and where it is not.
- Practise prompting, research, and review with animal-health context.
- Leave with a usable workflow, policy, and checklist.

**Primary paths:** AI Academy landing → Programme detail → Enquiry form → Confirmation.

### 2.4 Pet-care brand founder / content lead

**Situation:** A small team needs a consistent content engine but cannot publish unchecked AI output.

**Jobs:**
- Turn one useful idea into a coherent carousel.
- Choose an audience, channel, tone, and design direction.
- Edit every slide.
- See clear AI limitations and run a human review.
- Export editable copy for Canva, plus structured JSON for a production pipeline.

**Primary paths:** Studio → Brief → Research → Outline → Slides → Design → Review & export.

### 2.5 Founder / operator (demo role: Munazza)

**Jobs:**
- See what needs attention across listings, enquiries, corrections, and content.
- Publish or pause providers; feature listings.
- Review business enquiries and education leads.
- Resolve corrections and update the underlying record.
- Review AI projects before approval and export.
- Monitor automation and data-source mode.

### 2.6 Administrator (demo role: Dev)

**Jobs:**
- Verify role-based access and configuration.
- Review audit activity.
- Understand which integrations are live, simulated, or unconfigured.
- Reset demo data safely.

---

## 3. Goals and success measures

### Experience goals
- A first-time visitor understands the three products within 10 seconds.
- A pet parent can reach a relevant sample provider profile in two interactions.
- Every form has clear expectations, accessible errors, and a real confirmation state.
- No screen relies on invented social proof.

### Demo success measures (this build)
- All specified routes render without runtime errors.
- Search supports text, city, category, species, feature, and sort across sample data.
- Provider intake and correction submissions persist and appear in the dashboard.
- Education enquiry creates a lead and shows a confirmation page.
- Studio completes all six stages, saves a reviewable project, and exports Markdown, JSON, and CSV.
- Dashboard can publish/pause a provider, update enquiry status, resolve a correction, and move content through review.
- Keyboard navigation and responsive layouts pass manual QA at 360 px, 768 px, 1024 px, and 1440 px.
- No fabricated verification badges, ratings, testimonials, placement claims, or partner marks.

### Out of scope for this build
- Real payment processing, paid placements, or insurance.
- Real-time availability, appointment booking, or telemedicine.
- Live provider identity verification / KYC.
- Live Canva Connect API integration (manual editable handoff is provided instead).
- Production email/SMS delivery (workflow payloads and confirmation UI are implemented).
- Live Supabase deployment without project credentials. The schema, policies, and adapter blueprint are supplied; the working demo uses a local persistent data adapter and clearly labels its mode.

---

## 4. Information architecture

```
/                          Practo for Animals homepage
/find                      Search + filters + sample provider results
/providers/[slug]          Provider profile
/list-business             Provider registration / enquiry
/submit-correction         Correction submission
/education                 AI education landing page
/education/thank-you       Enquiry confirmation
/programs/[slug]           Individual programme detail
/content-studio            Six-stage AI carousel workspace
/dashboard                 Founder overview
/dashboard/providers       Manage providers
/dashboard/enquiries       Business enquiries + education leads
/dashboard/corrections     Correction review queue
/dashboard/content         Content projects
/dashboard/content/[id]    Project review + export
/dashboard/workflows       Automation + workflow status
/login                     Sign in
/admin                     Protected administrator area
/privacy                   Privacy notice
/terms                     Terms
```

### Global navigation
- **Find care** → `/find`
- **AI Academy** → `/education`
- **Content Studio** → `/content-studio`
- **For providers** → `/list-business`
- Utility: sign in / dashboard, mobile menu.
- Persistent primary CTA: **Find a provider**.
- Studio CTA: **Open the studio**.
- Provider CTA: **List your practice**.

---

## 5. Functional requirements

### 5.1 Homepage (`/`)
- Editorial hero with search (need + city), quick category chips, and assertive primary CTA.
- Trust-building without invented proof: explain the sample-data status honestly, explain what the directory does and does not do.
- Category navigation to `/find`.
- Featured sample provider cards (marked **Sample listing**).
- Three-step "how care discovery works" section.
- AI Academy conversion panel with programme outcomes and **Explore the academy** CTA.
- Content Studio product preview with **Try the studio** CTA.
- Provider acquisition panel with **List your practice** and correction link.
- Closing CTA, footer with legal, demo, and photography credits.
- Fully responsive; mobile hero, bento categories, and CTAs stack intentionally.

### 5.2 Search (`/find`)
- URL-driven state: `q`, `city`, `type`, `species`, `feature`, `sort`.
- Text search matches provider name, area, services, species, and summary.
- Filters: city, care type, species, feature (home visits, emergency, open 24/7, cat-friendly, accessible), sort (featured, name A–Z).
- Desktop sticky filter rail; mobile filter dialog.
- Active filter chips with individual removal and **Clear all**.
- Result count and sample-data notice.
- Provider cards: image, sample badge, category, name, area/city, short description, service tags, contact-friendly CTA.
- Empty state with clear reset CTA and "know a provider?" link.
- Preserve search criteria when navigating to a profile and back.

### 5.3 Provider profile (`/providers/[slug]`)
- Image-led editorial header with category, location, sample status.
- CTAs: call (sample number), directions (map query), correction.
- About, services, species treated, features, hours, contact, address, accessibility notes, pricing note (text only, no fabricated prices).
- "Before you visit" practical checklist and "Questions worth asking".
- Clear disclaimer that the listing and contact details are sample data.
- Related providers.
- 404 for unknown slugs.

### 5.4 Provider listing enquiry (`/list-business`)
- Fields: contact name, business name, category, city, area, email, phone, website (optional), services, species, message, consent.
- Client + server validation; accessible inline errors; server-side zod schema; honeypot; rate limit.
- Persist enquiry + workflow run + audit log.
- Confirmation screen with reference, next steps, and what not to expect in the demo.
- Link to correction form.

### 5.5 Correction submission (`/submit-correction`)
- Optional provider prefill via `?provider=slug`.
- Fields: provider, field, proposed value, evidence URL, note, submitter name, email, consent.
- Validation, honeypot, rate limit.
- Persist correction + workflow run + audit log.
- Confirmation state with reference and review expectation.
- Dashboard approve action updates supported provider fields (phone, address, website, hours, services) and records the change.

### 5.6 AI Academy (`/education`)
- Conversion-oriented hero with programme promise, proof-free positioning, primary CTA to enquiry form.
- Audience sections: veterinary teams, animal NGOs, pet-care founders/communicators.
- Learning outcomes.
- Four-module curriculum preview with lesson detail.
- Format and weekly rhythm.
- Programme comparison / links to individual programme pages.
- FAQ accordion (eligibility, time, medical advice, AI tools, demo status).
- Enquiry/registration form with programme, role, organisation, goals, consent.
- Lead confirmation page with reference, next steps, and honest demo note.
- No fabricated testimonials, placements, salary claims, partner logos, or cohort statistics.

### 5.7 Programme detail (`/programs/[slug]`)
- Programme-specific hero, summary facts, audience, outcomes, curriculum modules/lessons, format, FAQs, and enquiry CTA.
- Three seeded programmes:
  - AI for Animal Health Teams
  - AI Content for Pet-Care Brands
  - Clinic Automation Sprint
- All programme pages cross-link to the Academy and enquiry form with programme preselected.

### 5.8 Content Studio (`/content-studio`)
Six explicit, navigable stages:
1. **Brief** — idea/topic, goal, audience, channel, tone, slide count.
2. **Research** — AI-research draft with key points, cautions, questions, source checks, and a visible engine label (local demo or n8n).
3. **Outline** — editable slide plan with title/purpose.
4. **Slides** — generate editable slides; edit kicker, headline, body, CTA; reorder/add/remove; live 4:5 preview.
5. **Design** — three design directions with palettes and typography; choice reflected in preview; safe-zone guidance.
6. **Review & export** — human-review checklist (claims, tone, medical safety, accessibility, approval), reviewer name/notes, save for founder review, exports.

Additional requirements:
- Persist working state in the browser so a refresh does not lose progress.
- Clearly label AI-assisted draft content and the need for human verification.
- Saving creates a content project with status `in_review` and a workflow run.
- Export Markdown, JSON, and Canva text CSV; copy each slide; print/PDF path.
- Provide exact Canva handoff instructions without claiming an API integration.
- Accessible stepper, form labels, error states, focus management, and mobile layout.

### 5.9 Founder dashboard (`/dashboard`)
Protected. Requires a valid session. All mutations re-check authorization server-side.

- **Overview:** counts of sample providers, new enquiries, pending corrections, content in review; attention queue; pipeline breakdown; automation status; recent audit activity.
- **Providers:** searchable table, status filter, publish/pause, feature/unfeature, view profile. No fake verification controls.
- **Enquiries:** tabs for business listings and education leads; detail view; status update (new → in review → contacted → closed).
- **Corrections:** current vs proposed values; approve/reject with note; approve updates supported provider fields.
- **Content:** project list with status; project detail with slide preview; approve, request changes, mark exported.
- **Workflows:** run history with step status, integration mode, timestamps; honest connection state for n8n, Supabase, Canva, email.
- **Admin-only (`/admin`):** environment/data-mode summary, demo user roles, audit log, security configuration checklist, guarded demo reset.

### 5.10 Authentication (`/login`)
- Demo email/password sign-in with founder and admin roles.
- Quick-fill demo account cards.
- Signed, HttpOnly, SameSite session cookie; 8-hour expiry.
- Role-based redirects and route protection.
- Signed-in users visiting `/login` go to `/dashboard`.
- Clear demo-credential and production-auth notice.
- Login rate limiting and safe redirect handling.

### 5.11 Legal (`/privacy`, `/terms`)
- Plain-language privacy notice covering demo data, local storage, cookies, form submissions, AI processing, retention, and contact route.
- Terms covering sample data, no medical advice, no provider verification claims, acceptable use, AI output limitations, intellectual property, and demo status.
- Linked from footer and forms.

---

## 6. Content and data honesty rules

1. Every sample provider is labelled **Sample listing** on cards and profiles.
2. Search and provider pages carry a plain-language demo-data notice.
3. Ratings are not displayed because none exist.
4. Verification is not displayed or implied. The dashboard manages publication status, not identity verification.
5. Testimonials are not used.
6. Programme pages state **Demo programme** and avoid placement/salary/cohort-result claims.
7. Automation steps that are simulated are labelled **Simulated** or **Demo adapter**.
8. Integrations that are not configured are shown as **Not configured**, not as connected.
9. Canva is described as a manual export/handoff workflow, not an API partnership.
10. Photography is licensed stock used illustratively; it is not presented as the actual provider or team.

---

## 7. Design and content requirements

- Warm editorial animal-healthcare identity: forest green, warm ivory, soft mint, muted coral, charcoal.
- Display serif + humanist sans; generous spacing; strong hierarchy; avoid generic dashboard/SaaS styling.
- Natural animal photography, arched crops, paper-like textures, fine rules, restrained motion.
- Mobile-first responsive behaviour; touch targets ≥ 44 px.
- WCAG 2.2 AA colour contrast; keyboard access; visible focus; reduced-motion support; semantic landmarks.
- Interaction states for hover, focus, active, disabled, loading, success, empty, and error.
- CTA strategy:
  - Primary consumer action is always find care or contact a provider.
  - Secondary actions educate or build trust, never compete visually.
  - Studio/Academy pages each have one dominant conversion action repeated at decision points.
  - Provider acquisition is prominent but separate from consumer search.

---

## 8. Non-functional requirements

- Next.js App Router, TypeScript strict, Tailwind CSS, accessible shadcn-style components, Lucide icons.
- Server-rendered content where SEO/shareability matters; client interactivity only where needed.
- All forms validated on the client and server with a shared schema.
- All dashboard mutations authorized on the server.
- No secrets in client bundles. No service-role key exposed.
- Page metadata and semantic headings.
- Build passes type-check and production build.
- Seed data initialises automatically in demo mode.
- Deployment target: Vercel. Environment variables documented in `.env.example` and README.
- Real integrations are optional and degrade gracefully with explicit UI status.

---

## 9. Assumptions and risks

| Assumption / risk | Impact | Mitigation |
| --- | --- | --- |
| No Supabase credentials are available in the build environment | Cannot prove live Supabase persistence | Ship a complete SQL schema + RLS policies, a documented adapter path, and a working local persistent adapter; expose actual mode in UI/docs |
| No n8n instance is available | Cannot prove live workflow execution | Ship importable workflows, a secured API bridge, local deterministic fallback, and visible engine status |
| No Canva account/API access | Cannot create live share links | Ship editable handoff packs, CSV/Markdown/JSON exports, and documented template setup; no claim of integration |
| Stock photography could imply real providers | Trust risk | Label sample listings and credit stock photography; never caption photos as real clinics/teams |
| AI content can contain medical errors | Safety risk | Local generator uses cautious, non-diagnostic guidance; mandatory human-review checklist; visible disclaimers in UI/export |
| Serverless local filesystem is ephemeral | Demo persistence can reset on Vercel | Document Supabase as required for durable deployment; dashboard shows current data mode |

---

## 10. Delivery milestones

| # | Milestone | Outcome |
| --- | --- | --- |
| M0 | Discovery, docs, data model | Requirements, design system, architecture, schema, workflows, security plan |
| M1 | Foundation + design system | Next.js 16, tokens, typography, UI primitives, shell, assets |
| M2 | Homepage | High-quality responsive homepage and shared navigation |
| M3 | Care discovery | Search, filters, cards, provider profile, seeded directory |
| M4 | Provider intake + corrections | Validated forms, persistence, confirmations |
| M5 | AI Academy | Landing, programme detail, enquiry, confirmation |
| M6 | Content Studio | Six-stage workflow, editable slides, design, review, export, n8n bridge |
| M7 | Auth + founder dashboard + admin | Secure sessions, management actions, workflow status, audit |
| M8 | Persistence + security hardening | SQL schema/RLS, audit, rate limits, headers, env docs |
| M9 | QA + release | Responsive/accessibility/functional testing, build, docs, evidence |

Completion evidence is tracked in `docs/BUILD_PROGRESS.md`. Claims are limited to what has been executed and verified.

---

## 11. Definition of done

- All required routes implemented and linked.
- Visual system consistent across marketing, studio, dashboard, and auth.
- All primary flows demonstrably work end to end in a local production build.
- Server-side authorization tested for dashboard/admin actions.
- No fabricated proof or unlabelled sample data.
- `npm run typecheck` and `npm run build` pass.
- QA evidence recorded, including screenshots and tested scenarios.
- Remaining production integrations and limitations documented without overclaiming.
