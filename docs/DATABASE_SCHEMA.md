# Practo for Animals — Database Schema

**Version:** 1.0
**Production target:** Supabase Postgres 15+
**Demo implementation:** typed JSON store with identical logical entities.

The executable SQL is in [`supabase/schema.sql`](../supabase/schema.sql). This document explains intent, relationships, and access rules.

---

## 1. Entity relationship overview

```
profiles (auth users)
  └── authored/reviewed content_projects (owner_id, reviewer_id)

providers
  ├── corrections (provider_id)
  └── business_enquiries — no FK: enquiry may arrive before a provider exists

education_leads (standalone; programme slug reference only)

content_projects
  └── workflow_runs (subject_type = content_project)

audit_logs (actor_id → profiles, polymorphic entity)

workflow_runs (polymorphic subject: business_enquiry, correction,
               education_lead, content_project)
```

---

## 2. Enumerations (CHECK constraints in SQL)

| Domain | Values |
| --- | --- |
| user role | `founder`, `admin` |
| provider category | `veterinary`, `emergency`, `grooming`, `boarding`, `training`, `mobile`, `exotic`, `rescue`, `equine` |
| provider status | `draft`, `published`, `paused` |
| enquiry status | `new`, `in_review`, `contacted`, `closed` |
| correction status | `pending`, `approved`, `rejected` |
| correction field | `phone`, `address`, `website`, `hours`, `services`, `other` |
| lead status | `new`, `contacted`, `enrolled`, `closed` |
| content status | `draft`, `in_review`, `changes_requested`, `approved`, `exported` |
| workflow kind | `provider-intake`, `correction-review`, `education-enquiry`, `content-generation` |
| workflow status | `queued`, `running`, `completed`, `needs_attention`, `failed` |
| run mode | `demo-adapter`, `n8n`, `local-fallback` |
| step status | `pending`, `running`, `completed`, `simulated`, `failed` |

---

## 3. Tables

### 3.1 `profiles`
One row per Supabase Auth user.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid PK | References `auth.users(id)` on delete cascade |
| `full_name` | text not null | Display name |
| `email` | text not null unique | Mirrors auth email |
| `role` | text not null default `'founder'` | Check `founder/admin` |
| `created_at` | timestamptz default now() | |
| `updated_at` | timestamptz default now() | Trigger maintained |

Indexes: `lower(email)`, `role`.
Access: user can select/update own non-role fields; admins can read all. Role changes service-role/admin only.

---

### 3.2 `providers`
Sample directory records in this build; production records would be provider-claimed.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid PK default gen_random_uuid() | |
| `slug` | text not null unique | URL key, lowercase kebab |
| `name` | text not null | |
| `category` | text not null | Check enum above |
| `city` | text not null | |
| `area` | text not null | Neighbourhood |
| `address` | text not null | |
| `phone` | text | E.164/India format recommended |
| `whatsapp` | text | Optional |
| `email` | text | Optional, validated |
| `website` | text | http/https only |
| `about` | text not null | Bounded length |
| `services` | text[] not null default '{}' | |
| `species` | text[] not null default '{}' | Dog, Cat, Bird, Rabbit, Exotic, Equine, Livestock |
| `features` | text[] not null default '{}' | Home visits, Emergency, Open 24/7, Cat-friendly, Accessible |
| `hours` | text | Human-readable display |
| `price_note` | text | Avoid fabricated exact prices |
| `image_url` | text | Local path or CDN URL |
| `image_alt` | text | Required for accessibility |
| `image_credit` | text | Stock attribution |
| `status` | text not null default `'draft'` | published/paused/draft |
| `featured` | boolean not null default false | Curated ordering only |
| `is_sample` | boolean not null default true | Drives honest demo labelling |
| `completeness` | smallint default 0 | 0–100 profile completion |
| `created_at` / `updated_at` | timestamptz | |

Indexes:
- `status`, `city`, `category`
- GIN on `services`, `species`, `features`
- `lower(name)` trigram for future fuzzy search
- `(status, featured desc, name)` for listing order

Access:
- `anon`/`authenticated`: select where `status = 'published'` (or is_sample true in demo).
- Insert/update/delete: service role / authorized founder via server.
- No public writes.

---

### 3.3 `business_enquiries`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `reference` | text unique not null | `B-XXXXXX` |
| `contact_name` | text not null | |
| `business_name` | text not null | |
| `category` | text not null | Same provider enum |
| `city` | text not null | |
| `area` | text not null | |
| `email` | text not null | lowercased |
| `phone` | text not null | |
| `website` | text | optional |
| `services` | text | free text |
| `species` | text not null | free text / comma list |
| `message` | text | |
| `consent` | boolean not null | must be true |
| `status` | text not null default `'new'` | |
| `is_sample` | boolean not null default false | Seed records true |
| `created_at` / `updated_at` | timestamptz | |

Indexes: `status`, `created_at desc`, `lower(email)`.
Access: no anon read; inserts via server action/service role only. Founders/admin via server auth.

---

### 3.4 `corrections`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `reference` | text unique not null | `C-XXXXXX` |
| `provider_id` | uuid references providers | nullable if provider unknown |
| `provider_slug` | text not null | survives provider deletion |
| `provider_name` | text not null | snapshot |
| `field` | text not null | Phone/address/website/hours/services/other |
| `current_value` | text | snapshot at submission |
| `proposed_value` | text not null | |
| `evidence_url` | text | optional http/https |
| `note` | text | |
| `submitter_name` | text not null | |
| `submitter_email` | text not null | |
| `status` | text not null default `'pending'` | |
| `review_note` | text | founder note |
| `reviewed_by` | uuid references profiles | nullable in demo |
| `reviewed_at` | timestamptz | |
| `is_sample` | boolean not null default false | |
| `created_at` / `updated_at` | timestamptz | |

Indexes: `status`, `provider_id`, `created_at desc`.
Access: inserts via server action only; reads/updates founder/admin.

---

### 3.5 `education_leads`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `reference` | text unique not null | `E-XXXXXX` |
| `full_name` | text not null | |
| `email` | text not null | |
| `phone` | text | |
| `city` | text | |
| `role` | text not null | Vet, clinic owner, NGO, founder, marketer, other |
| `organisation` | text | |
| `programme_slug` | text not null | No FK; static programme catalogue |
| `programme_name` | text not null | snapshot |
| `goals` | text | |
| `consent` | boolean not null | |
| `status` | text not null default `'new'` | |
| `source` | text default `'website'` | |
| `is_sample` | boolean not null default false | |
| `created_at` / `updated_at` | timestamptz | |

Indexes: `programme_slug`, `status`, `created_at desc`.
Access: insert via server action; read/update founders/admin.

---

### 3.6 `content_projects`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `reference` | text unique not null | `CS-XXXXXX` |
| `title` | text not null | Derived from idea |
| `idea` | text not null | |
| `goal` | text | |
| `audience` | text not null | pet-parents, veterinary-teams, clinic-owners, animal-ngos |
| `channel` | text not null | instagram, linkedin, facebook |
| `tone` | text not null | |
| `slide_count` | smallint not null | 4–10 |
| `research` | jsonb not null | typed research notes |
| `outline` | jsonb not null | slide plan |
| `slides` | jsonb not null | array of slide objects |
| `design_direction` | text not null | field-notes, clinic-calm, night-vet |
| `review_checklist` | jsonb not null | booleans + reviewer name |
| `review_notes` | text | |
| `status` | text not null default `'draft'` | |
| `owner_id` | uuid references profiles | nullable in public demo |
| `reviewed_by` | uuid references profiles | nullable |
| `reviewed_at` | timestamptz | |
| `is_sample` | boolean not null default false | seeded projects |
| `created_at` / `updated_at` | timestamptz | |

Indexes: `status`, `updated_at desc`, `owner_id`, GIN on `slides` if searching.
Access:
- Demo: public save via server action, rate-limited; dashboard protected.
- Production: owner read/write, founder/admin read/review. RLS policies included for authenticated owners; anonymous studio use should be disabled.

Slide object schema (validated with Zod):
```ts
{
  id: string,
  kicker?: string,
  title: string,       // max 90
  body: string,        // max 320
  cta?: string,        // max 60
  imageNote?: string   // art-direction note, never a fake source
}
```

---

### 3.7 `workflow_runs`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `workflow` | text not null | provider-intake etc. |
| `subject_type` | text not null | business_enquiry, correction, education_lead, content_project |
| `subject_id` | text not null | string in demo; uuid where FK known |
| `subject_label` | text | human-readable |
| `status` | text not null | |
| `mode` | text not null | demo-adapter/n8n/local-fallback |
| `steps` | jsonb not null | [{name,status,at,detail}] |
| `error` | text | |
| `started_at` / `finished_at` | timestamptz | |
| `is_sample` | boolean not null default false | |

Indexes: `workflow`, `status`, `started_at desc`.
Access: founders/admin only. Inserts via server actions.

---

### 3.8 `audit_logs`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid PK | |
| `actor_id` | uuid references profiles | nullable for system/public actions |
| `actor_label` | text not null | snapshot email/name |
| `action` | text not null | e.g. provider.published |
| `entity_type` | text not null | |
| `entity_id` | text | |
| `detail` | text | short, no secrets |
| `created_at` | timestamptz default now() | |

Indexes: `created_at desc`, `(entity_type, entity_id)`, `actor_id`.
Access: admin read; system insert via service role; no update/delete.

---

## 4. Row Level Security policies (summary)

SQL is authoritative in `supabase/schema.sql`.

### Helper
```sql
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;
```

### Policies
| Table | anon | authenticated user | admin |
| --- | --- | --- | --- |
| providers | SELECT published | SELECT published; founders update via server only | ALL |
| business_enquiries | none | none (server/service role) | SELECT/UPDATE |
| corrections | none | none | SELECT/UPDATE |
| education_leads | none | none | SELECT/UPDATE |
| content_projects | none | SELECT/INSERT/UPDATE own | ALL |
| workflow_runs | none | none | SELECT |
| audit_logs | none | none | SELECT |
| profiles | none | SELECT/UPDATE own name | ALL |

Public form writes go through server actions using the service-role client after validation/rate limiting. This prevents anon clients from bypassing honeypots or writing arbitrary rows. If direct anon inserts are ever allowed, add CAPTCHA and stricter per-IP quotas.

### Role escalation guard
`profiles.role` is not user-updatable via RLS. The update policy restricts the `role` column by using a security-definer function or separate admin-only update path.

---

## 5. Retention and privacy

- Demo file store: retained until reset/deleted; no production PII should be entered.
- Production recommendation:
  - Business enquiries: 24 months after last contact.
  - Correction evidence: 12 months after resolution.
  - Education leads: 24 months or until withdrawal.
  - Content projects: until owner deletion + 30 days backup.
  - Audit logs: 12–24 months (security need).
  - AI prompts/outputs: minimise personal data; do not send sensitive medical records to third-party LLMs.
- Provide deletion/access request process at a monitored contact address.
- No sensitive health data should be entered in free-text fields; forms should warn against it.

---

## 6. Data integrity and conventions

- All timestamps UTC (`timestamptz`).
- UUID primary keys in production; demo reference IDs are human-friendly.
- Arrays order is meaningful for display.
- Slugs immutable once published where possible; preserve redirects on change.
- Snapshot provider name/value in corrections so history survives deletion.
- References (`B-`, `C-`, `E-`, `CS-`) are generated server-side and never client-controlled.
- `is_sample` is explicit and drives UI badges; seeded records must have it true.
- No ratings, review scores, verification flags, or claimed partner IDs in schema.
- JSONB fields are validated by Zod before insert; schema version documented in app.

---

## 7. Seed data

`lib/db/seed.ts` supplies:
- 12 providers across Bengaluru, Mumbai, Pune, Delhi NCR, Hyderabad, Chennai. All `is_sample: true`.
- 2 business enquiries, 2 corrections, 3 education leads.
- 3 content projects (in review, changes requested, approved/exported) with complete slides.
- Workflow runs and audit entries.
Every seeded row that can appear in UI is labelled sample or demo. No real phone numbers, ratings, verification, testimonials, or partner names.

The JSON demo store is initialised once and persists locally. The admin **Reset demo data** action restores the seed (admin role only) and records the reset.

---

## 8. Migration to Supabase checklist

- [ ] Create project and run `supabase/schema.sql`.
- [ ] Create founder/admin users in Supabase Auth.
- [ ] Insert corresponding `profiles` rows with roles.
- [ ] Set environment variables.
- [ ] Activate repository adapter and run contract tests against local + Supabase.
- [ ] Verify RLS with anon, founder, and admin tokens using Supabase SQL policies.
- [ ] Replace demo login with Supabase Auth; preserve server-side role checks.
- [ ] Add backup/retention policy.
- [ ] Remove or gate public studio writes behind authenticated ownership.
- [ ] Load production provider data through a verified onboarding flow, not seed data.
