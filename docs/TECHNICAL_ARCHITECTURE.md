# Practo for Animals — Technical Architecture

**Version:** 1.0
**Status:** Implemented baseline (see `BUILD_PROGRESS.md` for verified state)
**Target:** Vercel / Node.js 22+ runtime

---

## 1. Stack decisions

| Layer | Choice | Version target | Rationale |
| --- | --- | --- | --- |
| Framework | Next.js App Router | 16.4.x stable | Server components, server actions, metadata, streaming, first-class Vercel deployment |
| Language | TypeScript (strict) | 5.x | Safer data contracts across server/client boundary |
| UI runtime | React | 19.3.x | Required by Next 16 |
| Styling | Tailwind CSS | 4.3.x | Token-driven design system, small CSS surface, fast iteration |
| Components | shadcn/ui conventions + Radix primitives | latest stable | Accessible headless behaviour, owned source, consistent styling |
| Icons | Lucide React | 1.70.x | One coherent icon family |
| Validation | Zod | 4.x | Shared client/server schemas |
| Auth | Signed JWT session (jose), demo accounts | 6.x | Working demo auth; Supabase Auth is the production migration path |
| Persistence | Local JSON store behind a repository boundary | Node fs | Zero-credential, fully working demo; persistent across local restarts |
| Production DB/Auth | Supabase Postgres + Auth + RLS | latest | SQL schema and policies included; adapter documented |
| Automation | n8n webhooks | n8n 1.x | Importable workflows with local fallback |
| Design handoff | Canva manual template workflow | — | Editable export pack; no false API integration claim |
| Deployment | Vercel | — | Native Next.js platform |

> **Version note:** pinned ranges are recorded in `package.json` and `package-lock.json`. Next 16 uses `proxy.ts` rather than the deprecated `middleware.ts`.

---

## 2. System context

```
┌────────────────────────────────────────────────────────────────────┐
│                            Browser                                  │
│  Marketing pages · Studio wizard · Dashboard · Auth                │
└───────────────┬───────────────────────────────┬────────────────────┘
                │ RSC / server actions           │ fetch (studio research)
                ▼                               ▼
┌────────────────────────────────────────────────────────────────────┐
│                     Next.js 16 on Vercel / Node                      │
│  app/(marketing)  app/(studio)  app/(workspace)  app/login          │
│  proxy.ts (route guard) · server actions · route handlers           │
│  ┌───────────────────┐  ┌──────────────────┐  ┌─────────────────┐  │
│  │ Auth/session      │  │ Data repository  │  │ AI orchestration│  │
│  │ jose JWT cookie   │  │ local JSON now;  │  │ n8n bridge +    │  │
│  │ role checks       │  │ Supabase next    │  │ local generator │  │
│  └───────────────────┘  └────────┬─────────┘  └────────┬────────┘  │
└──────────────────────────────────┼─────────────────────┼───────────┘
                                   │                     │
                     ┌─────────────▼────────┐   ┌────────▼─────────┐
                     │ Supabase Postgres    │   │ n8n workflow     │
                     │ + Auth + RLS         │   │ (optional)       │
                     └──────────────────────┘   └──────────────────┘
                                   │
                     ┌─────────────▼────────┐
                     │ Canva (manual export)│
                     └──────────────────────┘
```

The demo runs entirely without external credentials. Optional integrations are detected at runtime and surfaced in the UI/dashboard.

---

## 3. Route architecture

### Route groups

```
app/
├─ layout.tsx                    Root fonts, metadata, globals
├─ globals.css                   Tailwind v4 theme + base styles
├─ (marketing)/
│  ├─ layout.tsx                 SiteHeader + SiteFooter + skip link
│  ├─ page.tsx                   /
│  ├─ find/page.tsx              /find
│  ├─ providers/[slug]/page.tsx  /providers/:slug
│  ├─ list-business/page.tsx     /list-business
│  ├─ submit-correction/page.tsx /submit-correction
│  ├─ education/page.tsx         /education
│  ├─ education/thank-you/page.tsx
│  ├─ programs/[slug]/page.tsx
│  ├─ privacy/page.tsx
│  └─ terms/page.tsx
├─ (studio)/
│  ├─ layout.tsx                 Compact studio header
│  └─ content-studio/page.tsx    /content-studio
├─ (workspace)/
│  ├─ layout.tsx                 Auth guard + dashboard shell
│  ├─ dashboard/page.tsx
│  ├─ dashboard/providers/page.tsx
│  ├─ dashboard/enquiries/page.tsx
│  ├─ dashboard/corrections/page.tsx
│  ├─ dashboard/content/page.tsx
│  ├─ dashboard/content/[id]/page.tsx
│  ├─ dashboard/workflows/page.tsx
│  └─ admin/page.tsx
├─ login/page.tsx
├─ api/studio/research/route.ts
├─ api/health/route.ts
├─ actions/*.ts                  Server actions grouped by domain
├─ not-found.tsx
├─ error.tsx
├─ sitemap.ts
└─ robots.ts
proxy.ts                         Route protection
```

### Rendering strategy

| Area | Strategy |
| --- | --- |
| Marketing pages | Server components, static where possible; real data for provider pages |
| `/find` | Server component reading `searchParams`; URL is the state store |
| Provider detail | Server component; `generateStaticParams` optional; 404 on unknown slug |
| Forms | Server actions with client `useActionState` for pending/errors/success |
| Studio | Client wizard with local draft persistence; server validation on save |
| Dashboard | Server components; mutations via server actions + `revalidatePath` |
| Auth | Server action sets signed HttpOnly cookie; `proxy.ts` + layout/server-action guards |
| Research API | POST route handler with zod validation, rate limit, optional n8n forward |

`proxy.ts` is a **defence-in-depth redirect layer only**. Every server action and protected page re-checks the session and role server-side.

---

## 4. Data layer

### 4.1 Demo adapter (active)

`lib/db/store.ts` implements a small repository over `.data/db.json`:

- Auto-seeds from `lib/db/seed.ts` on first read.
- Serialised write queue prevents concurrent write corruption in a single Node process.
- Atomic write: write to temp file, then rename.
- Schema version in the file; unsupported versions reset only via explicit admin action.
- Server-only imports (`fs/promises`, `path`); never bundled to the client.
- `.data/` is gitignored.

**Limitations (honest):**
- Vercel’s serverless filesystem is ephemeral/read-only outside `/tmp`; durable deployment must use Supabase.
- No multi-instance consistency.
- This is a demo repository, not a production database.

### 4.2 Repository boundary

All pages/actions call domain functions in `lib/db/index.ts` (providers, enquiries, corrections, leads, projects, workflows, audits). They never import the raw store. This keeps the Supabase migration to one layer.

### 4.3 Supabase production path

Supplied:
- `supabase/schema.sql`: tables, enums/checks, indexes, updated-at triggers, RLS policies, admin helper.
- `docs/DATABASE_SCHEMA.md`: mapping and access rules.
- `lib/supabase/admin.ts` + `server.ts`: guarded client factories that throw if unconfigured.
- The dashboard/admin surface truthfully shows data mode; no claim that Supabase is live.

Migration steps:
1. Create Supabase project.
2. Run `supabase/schema.sql` in SQL editor.
3. Seed or import providers.
4. Create auth users; set `profiles.role`.
5. Set env (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`).
6. Implement/activate the Supabase repository adapter for the same interface; server-side service-role client only after authorization checks.
7. Replace demo auth action with Supabase Auth (`signInWithPassword` or magic link), then issue the app session or use Supabase’s cookie session.

> The current build has **verified the local adapter**. Supabase SQL/RLS is provided and reviewed statically but not executed against a live project in this environment. This limitation is recorded in BUILD_PROGRESS.

### 4.4 Entities

- providers
- business_enquiries
- corrections
- education_leads
- content_projects (slides stored as JSONB)
- workflow_runs (steps stored as JSONB)
- audit_logs
- profiles (production auth)

Detailed table definitions live in `docs/DATABASE_SCHEMA.md`.

---

## 5. Authentication and authorization

### Demo session
- Login action validates demo credentials (constant-time comparison, login rate limit).
- `jose` signs an HS256 JWT: `sub`, `name`, `email`, `role`, `iss`, `aud`, `exp` (8h).
- Cookie: `pfa_session`, HttpOnly, SameSite=Lax, Secure in production, Path=/.
- `proxy.ts` verifies and gates `/dashboard` + `/admin`; admin requires role `admin`.
- Workspace layout and every mutation re-verify via `requireUser()` / `requireAdmin()`.
- Open redirects prevented by accepting only same-origin paths beginning with a single `/`.
- Logout clears the cookie.

### Production path
- Supabase Auth (password or magic link) is the intended identity provider.
- `profiles.role` drives founder/admin authorization.
- RLS policies enforce owner/admin access at the database layer in addition to app checks.
- Demo credentials are not to be used in production; `AUTH_SECRET` must be a strong random value.

### Roles
| Role | Access |
| --- | --- |
| Anonymous | Marketing, search, public profiles, forms, studio |
| `founder` | `/dashboard/**`, management mutations |
| `admin` | `/dashboard/**` + `/admin/**` + reset demo data |

---

## 6. Server actions and validation

- `app/actions/auth.ts` — login, logout.
- `app/actions/enquiries.ts` — business enquiry create, status updates.
- `app/actions/corrections.ts` — correction create, resolve.
- `app/actions/education.ts` — lead create (redirect to confirmation).
- `app/actions/studio.ts` — save content project, update status.
- `app/actions/providers.ts` — publish/pause/feature.
- `app/actions/admin.ts` — reset demo data (admin only).

Pattern:
1. Read `FormData` / typed payload.
2. Zod parse; return field errors without throwing for expected validation failures.
3. Check auth/role for privileged actions.
4. Honeypot + in-memory rate limit for public submissions.
5. Mutate repository.
6. Append audit log and workflow run.
7. `revalidatePath` affected routes.
8. Return reference/success or redirect.

All public input is bounded (length limits), normalised, and rendered escaped by React. URLs are validated to `http/https`.

---

## 7. Search architecture

`/find` is URL-driven and server-rendered:

```
/find?q=skin&city=Bengaluru&type=veterinary&species=Dog&feature=home-visit&sort=name
```

- Normalise query/params with a zod schema and whitelist enums.
- Filter in memory over sample data (small dataset).
- Ranking: featured first, then name; sort option overrides.
- Active filters derived from the same parsed params.
- Filter forms are GET forms, so they work without JavaScript.
- Mobile filters use a Radix dialog; submitting closes navigation naturally.
- For production scale: move to Postgres full-text/trigram indexes and server-side pagination.

---

## 8. AI Content Studio architecture

### Client
- Stepper state machine: `brief → research → outline → slides → design → review`.
- Draft persisted to `localStorage` (versioned key, 7-day timestamp) and restored after hydration.
- Editable slides with stable ids.
- Design directions are token sets applied to a live 4:5 preview.
- Export handles generated on the client from typed content.

### Research
`POST /api/studio/research`
- Zod body: topic, goal, audience, channel, tone, slideCount.
- Rate limit per IP.
- If `N8N_CONTENT_WEBHOOK_URL` is configured:
  - POST JSON with `x-webhook-secret`, 20s timeout.
  - Validate response shape.
  - On failure: fall back to deterministic local research and return `mode: "local-fallback"` with a warning.
- Else use `lib/studio/generator.ts`.
- Response includes research notes, suggested angles, and safety guardrails.
- Engine/mode is displayed in the UI.

### Outline/slide generation
Deterministic template engine produces a coherent deck from the brief and research. Production replacement point: call the n8n workflow per stage (outline, slides) or one workflow returning all stages. The local generator exists to make the demo fully usable and to keep the safety constraints testable.

### Save & review
- `saveContentProject` validates the full deck, enforces review checklist completion, stores status `in_review`, creates a workflow run and audit entry.
- Founder dashboard can approve/request changes; content project detail can export.
- Carousel copy is not publishable automatically; export is a human action.

### Canva handoff
- Markdown copy deck, JSON structure, CSV (slide number, kicker, headline, body, CTA), and print/PDF.
- Step-by-step template setup documented in `docs/AI_WORKFLOWS.md`.
- No claim of a live Canva API integration.

---

## 9. n8n integration

- Workflows in `/workflows` are importable JSON.
- `content-generation.json`: webhook → validate → LLM HTTP request → normalise → human-review status → respond.
- `lead-intake.json`: webhook → classify/normalise lead → notify founder channel → CRM/email placeholder → respond.
- Secret header shared via env, never exposed client-side.
- All workflow output is treated as untrusted: zod-validated, size-limited, and rendered escaped.
- Failure path: no silent data loss; form submission persists first, automation is best-effort and its status is recorded.
- Local mode records workflow runs with `mode: demo-adapter` and simulated notification steps.

---

## 10. Security architecture

- Strict TypeScript; no `any` in public contracts.
- Server-only modules import `server-only` where appropriate.
- Service-role/secret env vars are never prefixed `NEXT_PUBLIC_`.
- Security headers configured in `next.config.ts`:
  - CSP (script/style allowances required by Next; tighten in production),
  - `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`/frame-ancestors,
  - `Permissions-Policy`.
- Auth cookies HttpOnly/SameSite/Secure (prod).
- Authorization checked in proxy + layout + action (defence in depth).
- Rate limits for login and public submissions (in-memory demo; use Upstash/Redis at scale).
- Honeypot on public forms.
- Zod schemas cap string lengths and validate email/phone/URLs.
- No raw HTML rendering of user/AI content.
- Audit log for privileged mutations.
- Dependency pinning and `npm audit` in release checklist.
- Full checklist: `docs/SECURITY_CHECKLIST.md`.

---

## 11. Design system implementation

- Tailwind v4 `@theme` tokens in `app/globals.css` mirror `docs/DESIGN_SYSTEM.md`.
- Fonts via `next/font/google` (Fraunces, Manrope) exposed as CSS variables.
- UI primitives in `components/ui` use `class-variance-authority`, `clsx`, `tailwind-merge`, Radix for accessible dialog/accordion.
- `cn()` utility for conditional classes.
- No ad-hoc hex values in page code; use tokens.
- Shared marketing shell, dashboard shell, and studio shell.
- Reusable provider card, section heading, form fields, status badge, stat card, stepper.

---

## 12. Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `AUTH_SECRET` | Production yes | JWT signing secret (32+ random bytes) |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URLs/metadata |
| `DEMO_FOUNDER_EMAIL` / `DEMO_FOUNDER_PASSWORD` | No | Override demo credentials |
| `DEMO_ADMIN_EMAIL` / `DEMO_ADMIN_PASSWORD` | No | Override admin demo credentials |
| `N8N_CONTENT_WEBHOOK_URL` | No | Live research workflow |
| `N8N_WEBHOOK_SECRET` | If n8n used | Shared secret header |
| `N8N_LEAD_WEBHOOK_URL` | No | Lead intake workflow |
| `NEXT_PUBLIC_SUPABASE_URL` | Production | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production | Public anon key (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | Production server | Server-only privileged key |
| `CANVA_TEMPLATE_URL` | No | Editable template link when available |

`.env.example` contains placeholders only. `.env*` is gitignored except `.env.example`.

---

## 13. Deployment (Vercel)

1. Push repository to Git.
2. Import into Vercel; framework preset Next.js.
3. Add environment variables (at minimum `AUTH_SECRET`; Supabase for durable data).
4. Build command `npm run build`; Node 22+.
5. For durable demo data, configure Supabase and activate the Supabase adapter; otherwise accept that serverless local data is ephemeral.
6. Set `NEXT_PUBLIC_SITE_URL` to the deployment URL.
7. Verify `/api/health`, `/login`, `/dashboard`, and a form submission.
8. Run the release QA checklist.

No deployment has been performed in this environment because no Vercel credentials were supplied. Local production build evidence is recorded instead.

---

## 14. Performance

- Server components by default; client islands only for studio, filters dialog, menus, accordions, and form feedback.
- Local images served via `next/image` with width/height, `sizes`, and priority only on hero.
- Fonts self-hosted; `display: swap`.
- Avoid heavy animation libraries; CSS transitions only.
- Small data set in memory; no waterfalls for marketing pages.
- Studio generation is synchronous/local and fast; external n8n has timeout + fallback.
- Dashboard reads a single JSON file per request in demo; acceptable for the dataset.
- Target Lighthouse: Performance ≥ 90 on marketing pages locally (to be measured), Accessibility ≥ 95.

---

## 15. Observability and operations (demo vs production)

| Concern | Demo | Production recommendation |
| --- | --- | --- |
| Errors | Next error boundary + server logs | Sentry |
| Audit | JSON audit log | Append-only DB table + retention |
| Rate limits | In-memory map | Redis/Upstash |
| Workflow monitoring | `workflow_runs` + UI | n8n executions API + alerting |
| Data mode visibility | Dashboard/admin cards | Health endpoint + alerts |
| Backups | None (local demo) | Supabase PITR |
| Costs | Free/local | Supabase + Vercel + n8n hosting + model usage |

---

## 16. Known limitations and next steps

1. Local JSON persistence is not durable on serverless; Supabase adapter activation is the next production task.
2. Supabase Auth is documented but demo auth is the verified path in this environment.
3. n8n workflows are supplied but not live-executed; the local generator is the verified path.
4. Canva integration is intentionally a manual handoff; no API credentials or partnership.
5. Provider verification/KYC is out of scope; the product does not claim verification.
6. Search runs in memory; production needs Postgres and pagination.
7. No automated email/SMS delivery; workflow payloads and confirmation UI are implemented.
8. Seed data is illustrative and labelled; it must never be presented as real provider information.
