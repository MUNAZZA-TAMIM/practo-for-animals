# Practo for Animals — AI Workflows

**Version:** 1.0
**Human principle:** AI may draft, sort, and suggest. A named human approves anything that reaches a pet parent, provider, or learner.

---

## 1. Why these workflows exist

Animal-health content carries an unusual risk: a plausible sentence can become medical advice. The product uses AI for **structure and drafting**, not diagnosis, verification, or publish authority. Every workflow has:

1. A narrow job.
2. Structured, validated inputs and outputs.
3. A visible mode (live AI vs local demo adapter).
4. Safety guardrails by audience.
5. A human-review gate.
6. Failure handling that never silently loses a submission.

---

## 2. Content Studio workflow

### Stages and ownership

| Stage | System | Human | Output |
| --- | --- | --- | --- |
| 1. Brief | Validates fields, prepares context | Chooses idea, audience, channel, tone, count | Structured brief |
| 2. Research | Generates draft research notes and checks | Reviews, edits implied direction, flags source needs | Research draft |
| 3. Outline | Proposes slide sequence and purpose | Edits/reorders | Slide plan |
| 4. Slides | Drafts kicker/headline/body/CTA | Edits every slide; adds/removes | Editable deck |
| 5. Design | Applies design direction tokens | Chooses direction, checks safe areas | Visual system |
| 6. Review | Enforces checklist | Completes checklist, names reviewer, approves | Approved/exportable project |

### Input contract

```json
{
  "topic": "string, 8–180 chars",
  "goal": "string, 0–300 chars",
  "audience": "pet-parents | veterinary-teams | clinic-owners | animal-ngos",
  "channel": "instagram | linkedin | facebook",
  "tone": "warm-practical | clinical-clear | playful | authoritative",
  "slideCount": 4
}
```

### Research output contract

```json
{
  "summary": "string",
  "keyPoints": ["string"],
  "cautions": ["string"],
  "questions": ["string"],
  "angles": ["string"],
  "checks": ["string"],
  "engine": "n8n | local-demo | local-fallback",
  "warning": "optional string"
}
```

No fabricated citations. The UI presents **source checks to run**, not invented references. Sources must be added by a human before publication.

### Prompt blueprint (production LLM node)

**System**
> You are a careful research assistant for an animal-care education brand. You do not diagnose, prescribe, or claim verification. Produce structured, plain-language notes for a non-clinical carousel. Flag anything that needs a veterinarian's review. Use no invented statistics, studies, quotes, testimonials, partnerships, or provider ratings. If a fact cannot be verified from the supplied context, put it in `checks` instead of asserting it. Return strict JSON matching the schema.

**User**
```
Brief: {{brief}}
Audience: {{audience}}
Channel: {{channel}}
Tone: {{tone}}
Slide count: {{slideCount}}
Constraints:
- General education only; no diagnosis, dosage, or treatment plans.
- For emergencies, advise contacting a veterinarian/emergency service.
- No claims about Practo for Animals verification or results.
- Distinguish observation from diagnosis.
Return only the JSON contract.
```

### Audience guardrails

| Audience | Include | Avoid |
| --- | --- | --- |
| Pet parents | Clear observation prompts, questions to ask a vet, when to seek care | Diagnoses, drug names/doses, "this will cure" |
| Veterinary teams | Workflow framing, communication aids, review steps | Clinical decision support presented as validated |
| Clinic owners | Operations, intake quality, staff review | Financial guarantees |
| Animal NGOs | Reusable education, consent, tone | Sensational rescue claims |

### Build-mode behaviour

- **Local generator (verified):** deterministic content frameworks selected by topic keywords, with cautious language and mandatory review.
- **n8n configured:** `POST /api/studio/research` forwards the validated brief to `N8N_CONTENT_WEBHOOK_URL` with a shared secret and 20s timeout. Response is zod-validated.
- **n8n failure:** returns local research with `mode: local-fallback` and a visible warning; user can continue.
- **Response size:** capped; unknown fields stripped.
- **Rendering:** plain text only; no raw HTML.

### Human review checklist (enforced before save)

1. Every factual claim has been checked or removed.
2. No diagnosis, dosage, treatment plan, or guaranteed outcome.
3. Emergency guidance points to a veterinarian / emergency service.
4. Tone fits the audience and channel; no fear-based selling.
5. No fabricated ratings, testimonials, statistics, verification, or partnerships.
6. Copy is readable, alt text/design contrast considered, and within safe areas.
7. A named reviewer approves the deck.

The server rejects a save when required checklist items are not true.

### Export and Canva handoff

Generated assets:
- `carousel-copy.md` — full copy deck with slide numbers, design notes, disclaimer.
- `carousel-project.json` — structured project (for automation or design systems).
- `carousel-canva.csv` — columns: slide, type, kicker, headline, body, cta, design note.
- Browser print / PDF with 4:5 slide layout.

Canva workflow (manual, honest):
1. In Canva, create a 1080×1350 px presentation/carousel template with brand colours and type.
2. Add text placeholders for kicker, headline, body, CTA.
3. Download the Canva CSV/Markdown pack from the Studio.
4. Paste each slide's copy into the corresponding template.
5. Keep the human reviewer's name and approval date in the file.
6. Export PNG/PDF from Canva.

No claim is made that this build connects to Canva's API or creates a share link. If Canva Connect is added later, it should create a copy of a verified template and store the resulting edit URL, not auto-publish.

### Failure modes

| Failure | UX | Recovery |
| --- | --- | --- |
| Research API 4xx | Field errors / safe message | Fix brief |
| Research API timeout | After 20s falls back locally with notice | Continue or retry |
| Invalid AI JSON | Falls back locally, logs mode | Continue |
| Save validation fails | Inline field/summary errors | Fix, resubmit |
| Rate limit | Friendly retry guidance | Retry later |
| Refresh mid-draft | Local draft restored | Continue |

---

## 3. Education lead workflow

### Trigger
Successful `submitEducationEnquiry` server action.

### Flow
1. Validate + normalise lead with Zod.
2. Persist lead immediately (source of truth).
3. Create workflow run (`queued`).
4. If `N8N_LEAD_WEBHOOK_URL` configured:
   - POST lead reference, programme, safe metadata + secret header.
   - n8n notifies the founder channel, creates CRM/email task, returns acknowledgement.
   - Mark run completed; store steps.
5. Else:
   - Mark run completed with a **simulated** notification step (demo adapter).
6. Redirect to `/education/thank-you?ref=...` (confirmation).
7. Founder dashboard shows lead with status and workflow.

### Privacy
- Send the minimum: reference, programme, role, organisation, city, goal category. Avoid free-text goals in external notifications if they may contain sensitive data.
- No medical records.
- Retention: 24 months or withdrawal.
- Consent is explicit and stored.

### Confirmation page
- Reference, programme name, next steps, response expectation.
- Honest note when no email is actually sent in demo mode.
- Links to programme, privacy, studio.

---

## 4. Provider intake workflow

1. Validate business enquiry; honeypot + rate limit.
2. Persist first; generate `B-` reference.
3. Create run (`provider-intake`), steps: validated → stored → review queued → notification (simulated or n8n).
4. Founder sees enquiry in dashboard; updates status.
5. In production, verification/KYC would be a separate, human-operated process. **Not implemented and not claimed.**
6. Listing publication is a manual dashboard action after review.

---

## 5. Correction workflow

1. Validate correction; snapshot current value from provider.
2. Persist pending correction; create run (`correction-review`).
3. Founder compares current vs proposed, checks evidence URL.
4. Approve or reject with note.
5. On approve, only whitelisted fields are applied to the provider:
   - phone, address, website, hours, services.
6. Audit log records before/after summary + reviewer.
7. No automatic approval; no unverified overwrite.

---

## 6. n8n implementation

### Importable files
- [`workflows/content-generation.json`](../workflows/content-generation.json)
- [`workflows/lead-intake.json`](../workflows/lead-intake.json)

### Content workflow nodes

1. **Webhook** — POST `/webhook/content-research`; header auth.
2. **Validate** — Code node checks required fields/lengths; rejects invalid.
3. **Build prompt** — Code node inserts brief and guardrails.
4. **LLM request** — HTTP Request node to the chosen model provider. Credential is configured in n8n, not in this repo.
5. **Normalise** — Code node parses JSON, enforces arrays/limits, strips extra fields.
6. **Respond** — `{ research, engine: "n8n" }`.
7. **Error branch** — returns 422/500 with safe message; no partial sensitive data.

### Lead workflow nodes

1. Webhook with secret.
2. Normalise/validate.
3. Notify founder (Slack/email placeholder).
4. Upsert CRM/email tool placeholder.
5. Respond with run acknowledgement.
6. Error branch logs failed execution; app already persisted the lead.

### Environment
```
N8N_CONTENT_WEBHOOK_URL=https://your-n8n.example/webhook/content-research
N8N_LEAD_WEBHOOK_URL=https://your-n8n.example/webhook/lead-intake
N8N_WEBHOOK_SECRET=...
```

### Operational rules
- Timeout 20s in app; n8n should respond within 15s.
- Retries are idempotent by reference; duplicate submissions should not create duplicate notifications.
- Log only metadata (reference, workflow, duration), not full content/leads.
- Alert on repeated failures; dashboard shows `needs_attention`.
- Models: choose a provider with data-processing terms suitable for business content. Never send medical records or personal health data.

> **Verification status:** the workflows are supplied as importable JSON. No live n8n instance was available in this environment, so live execution is not claimed. The app's local adapter path is the one exercised by tests.

---

## 7. Content safety policy

- **No diagnosis.** Use "signs to watch", "questions to ask", "seek veterinary advice".
- **No dosing or treatment protocols.**
- **Emergency content** must include a clear directive to contact a veterinarian/emergency service.
- **No invented evidence.** Statistics, studies, quotes, and expert names require a human-provided source.
- **No fear marketing.** No "your pet will die if…" framing.
- **Human accountability.** Reviewer name, date, and checklist stored with project.
- **Accessibility.** Check contrast, alt text, and readability as part of review.
- **Audit.** Content status changes are logged.

---

## 8. Evaluation and quality metrics (production)

- % of AI drafts approved without substantive changes (quality, not velocity alone).
- Average number of factual corrections per deck.
- Review checklist completion rate.
- Time from brief to approved handoff.
- Workflow failure/fallback rate.
- % of projects with a named reviewer.
- Lead follow-up time.
- No publish without review (target 100%).

These are proposed metrics; no performance statistics are claimed in the demo.
