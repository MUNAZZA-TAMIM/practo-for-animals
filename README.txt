================================================================================
PRACTO FOR ANIMALS — PLATFORM & AI CONTENT STUDIO SPECIFICATION
================================================================================
Version: 1.0 Production-Ready Architecture
Framework: Next.js 16.4.5 (App Router, Turbopack) | React 19 | Tailwind CSS 4 | TypeScript 5
Data Layer: Modular Repository Architecture (Local JSON & PostgreSQL-Ready)
Base URL: http://localhost:3000

================================================================================
DELIVERABLE 1: PRACTO FOR ANIMALS — MVP DESIGN
================================================================================

1. ESSENTIAL MVP ELEMENTS & USER EXPERIENCE:
   - Real-Video Hero Section: Pure natural-color video background showcasing animal
     care with zero color tinting. High-contrast typography with drop shadows.
   - Unified Discovery Search Card: Immediate dual-input search for Location (with
     GPS "Locate Me") and Clinical Discipline (Vets, Hospitals, Boarding, Ambulance,
     Diagnostics, NGOs).
   - Species-First Taxonomy: Instant filtration for 7 key animal classifications:
     Canines, Felines, Avian, Lagomorphs, Equine, Livestock, and Exotics.
   - Provider Directory Engine (/find): Real-time search with interactive filter
     sidebar, verified provider badges, direct telephone hotlines, and instant
     appointment request buttons.
   - Patient Booking Flow (/book-appointment): Multi-step booking intake capturing
     animal species, name, age, symptom description, preferred slot, and owner details.
   - Community Data Integrity (/submit-correction): Crowdsourced correction queue
     allowing users and vets to report changed numbers, moved addresses, or new hours.
   - Provider Acquisition Funnel (/list-business): Self-serve application portal
     for veterinary practices and pet businesses seeking verified placement.

2. USEFUL FILTERS & INFORMATION ARCHITECTURE:
   - Care Category: Vet Clinic, 24/7 Animal Hospital, Boarding & Daycare, Diagnostics,
     Ambulance & Triage, NGO & Wildlife Rescue, Farm & Equine Care.
   - Species Handled: Target care by animal type (prevents dog clinics receiving birds).
   - Emergency Availability: "Open 24 Hours", "Weekend Slots", "Quiet Hours".
   - Geographic Proximity: Neighborhood and city-level geo-lookup.
   - Verification Status: Clinical audit status and credentialed practice badges.

3. KEY CALLS TO ACTION (CTAs):
   - "Find a Vet" -> Directs to /find with pre-selected filters.
   - "Book Appointment" -> Persistent high-contrast emerald action button in header.
   - "24/7 Rapid Triage" -> Emergency filter triggering emergency hospital hotlines.
   - "List Your Business" -> B2B partnership gateway for veterinary practices.
   - "Submit a Correction" -> Footer & profile link safeguarding data freshness.

4. ATTRACTIVE, INTUITIVE & MOBILE-FRIENDLY UX:
   - Forest & Ivory Palette: Forest green (#103a2f), emerald (#059669), warm ivory
     (#fbf8f2) creating clinical trust without sterile coldness.
   - Mobile-First Thumb Zone: Touch targets >= 44px, sticky header, sliding species
     dock, and bottom-anchored booking sheets on mobile screens.

================================================================================
DELIVERABLE 2: AI EDUCATION — COURSE LANDING PAGE (/education)
================================================================================

1. PAGE STRUCTURE & SECTION PROGRESSION:
   - Section 1: Hero Banner with high-impact headline, trust statistics, and dual
     primary action buttons ("Explore Programmes" and "Request Syllabus").
   - Section 2: Value Pillars & Outcome Metrics: Hands-on project hours, real tool
     stack, community support, and verified competency certificates.
   - Section 3: Programme Cards:
     * Programme 01: "AI for Animal Health Teams" (Clinical notes & patient triage)
     * Programme 02: "Clinic Automation Sprint" (n8n, CRM & appointment preparation)
     * Programme 03: "AI Content for Pet-Care Brands" (Weekly carousel pipeline)
   - Section 4: Deep-Dive Curriculum Accordions: Week-by-week syllabus breakdowns
     detailing lecture topics, prompts, code snippets, and capstone deliverables.
   - Section 5: Lead-Capture Registration Form: Clean inputs for Full Name, Email,
     Phone, Role (Student, Veterinarian, Clinic Owner, Marketer), and Learning Goals.
   - Section 6: Educational FAQs: Addressing prerequisites, time commitments, and
     software tool access.

2. VALUE PROPOSITION:
   - "Practical, Not Theoretical": Every lesson ends in a deployable tool (an AI triage
     assistant, an automated client follow-up workflow, or a ready carousel).
   - "Designed for Healthcare & Young Professionals": Tailored for students, early
     career veterinarians, and marketers who need immediate workflow leverage.

3. REGISTRATION & LEAD-CAPTURE JOURNEY:
   - Step 1: Learner navigates /education and reviews course syllabus.
   - Step 2: Clicks "Enroll Now" or scrolls to interactive registration module.
   - Step 3: Completes Zod-validated registration form with career role and objectives.
   - Step 4: Submission is saved locally/in PostgreSQL database and fires webhook.
   - Step 5: Learner receives instant on-screen reference ID and confirmation.
   - Step 6: Submission appears in Founder & Admin Review Inbox for cohort onboarding.

================================================================================
DELIVERABLE 3: AI-POWERED CONTENT CREATION SYSTEM (/content-studio)
================================================================================

1. THE FOUNDER'S REPEATABLE WORKFLOW:
   No in-house graphic designer needed. The 6-step human-in-the-loop pipeline:
   
   [1. Raw Idea] --> [2. AI Research] --> [3. Outline] --> [4. Copy Engine]
          --> [5. Design Theming] --> [6. Human Review Gate] --> [7. Export]

2. STEP-BY-STEP STAGES:
   - Stage 1: Brief Input -> Founder enters topic, target audience (Pet Parents,
     Veterinary Teams, Clinic Owners), channel (Instagram, LinkedIn), and tone.
   - Stage 2: AI Research & Clinical Fact-Checking -> Automated research draft
     extracting veterinary guidelines, common mistakes, and clinical disclaimers.
   - Stage 3: Slide Sequence & Outline -> Formulates engagement arc: Hook ->
     Observation -> Escalation -> Home Action -> Red Flags -> Call to Action.
   - Stage 4: Slide Copywriting -> Generates concise kicker, headline, body text,
     and swipe indicators formatted for square (1:1) and portrait (4:5) frames.
   - Stage 5: Visual Direction Engine -> One-click theme switching between:
     * "Field Notes": Warm paper tones, editorial fonts, natural care vibe.
     * "Clinic Calm": Soft sage, crisp typography, clean wellness aesthetic.
     * "Night Vet": High-contrast dark charcoal with urgent amber accents.
   - Stage 6: Mandatory Human Sign-off Gate -> Reviewer confirms 6 checklist items:
     [X] No medical diagnosis claims.
     [X] Clear escalation to physical vet.
     [X] Tone adherence.
     [X] Safe reading zones.
     [X] Source verification.
     [X] Named founder approval logged in audit trail.
   - Stage 7: Export -> Instant generation of LinkedIn Carousel PDF, Instagram PNG
     cards, raw Markdown/JSON, and Canva template handoff link.

3. PRODUCTION SAMPLE CAROUSEL INCLUDED IN PLATFORM:
   - Reference: CS-A7K2Q9
   - Topic: "Itchy skin in the monsoon: what to notice before changing foods"
   - Format: 6-Slide Carousel (Instagram 1080x1080 & LinkedIn Document)
   - Slide 1: Hook -> "Itchy skin in monsoon: What to notice before changing foods."
   - Slide 2: Observation -> "Check paws and ear folds before switching diets."
   - Slide 3: Pitfall -> "Don't switch foods immediately; damp fur triggers yeast."
   - Slide 4: Routine -> "3 steps after walks: Dry webbing, inspect ears, brush coat."
   - Slide 5: Red Flags -> "See a vet if skin is hot, oozing, or constant chewing."
   - Slide 6: Action CTA -> "Better care starts with early checks. Find vetted clinics."

================================================================================
TECHNOLOGY STACK & INTEGRATIONS
================================================================================
- Frontend & Core: Next.js 16.4.5 (Turbopack, App Router) + React 19 + TypeScript 5
- Styling: Tailwind CSS 4 + Lucide React Icons
- Data Layer: Dual-mode repository (Local JSON store + Database Adapter Ready)
- Architecture: Role-based navigation and protected workspace routing
- Automation: n8n workflow engine (Webhook intake, AI research nodes, CRM sync)
- AI Models (Recommended): Google Gemini 2.5 Flash / Anthropic Claude 3.5 Sonnet
- Graphics & Handoff: Satori SVG / Canvas API + Canva Template Handoff

================================================================================
LOCAL PROTOTYPE DIRECTORY & EXPLORATION
================================================================================
Start server: npm run dev
Base URL: http://localhost:3000

Primary Routes:
- Homepage:             http://localhost:3000/
- Provider Discovery:   http://localhost:3000/find
- AI Education Academy: http://localhost:3000/education
- Content Studio:       http://localhost:3000/content-studio
- Book Appointment:     http://localhost:3000/book-appointment
- List Business:        http://localhost:3000/list-business
- Submit Correction:    http://localhost:3000/submit-correction
- Founder Dashboard:    http://localhost:3000/dashboard
- Admin Console:        http://localhost:3000/admin
- Provider Portal:      http://localhost:3000/provider-dashboard

Role Previews:
Demo roles (Founder, Admin, Provider) can be accessed directly using the
convenient one-click quick-fill buttons located on the sign-in page (/login).
================================================================================
