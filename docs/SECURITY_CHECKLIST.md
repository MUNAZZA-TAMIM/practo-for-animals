# Security Checklist — Practo for Animals

**Version:** 1.0
**Scope:** Next.js 16 application, demo authentication, public forms, studio AI bridge, dashboard/admin, deployment.
**Status legend:** ✅ implemented/verified · ◐ implemented, requires production configuration · ○ production follow-up

---

## 1. Authentication

- [x] ✅ Session issued as signed JWT (HS256, `jose`) with issuer, audience, subject, role, 8h expiry.
- [x] ✅ Session cookie: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` in production.
- [x] ✅ Logout clears the cookie with matching attributes.
- [x] ✅ Login credentials compared using timing-safe comparison.
- [x] ✅ Login rate limited (5 attempts / 10 minutes / IP, in-memory demo).
- [x] ✅ Redirect target sanitised: only single-slash absolute paths accepted; external/protocol-relative blocked.
- [x] ✅ Signed-in users redirected away from `/login`.
- [ ] ◐ Production: replace demo accounts with Supabase Auth.
- [ ] ◐ Production: MFA/SSO option for admin, password reset, email verification.
- [ ] ○ Production: centralised rate limiting (Redis/Upstash) so limits work across instances.
- [ ] ○ Production: lockout notifications and anomaly monitoring.

**Demo credentials are intentionally public for evaluation.** They must never protect production data.

---

## 2. Authorization

- [x] ✅ `proxy.ts` gates `/dashboard` and `/admin`; admin additionally requires `role === "admin"`.
- [x] ✅ Workspace layout re-verifies the session server-side.
- [x] ✅ Every privileged server action calls `requireUser()` / `requireAdmin()`; proxy is not trusted as the only control.
- [x] ✅ Public studio save is allowed by design; dashboard review/approval is protected.
- [x] ✅ Provider publish/pause/feature; enquiry status; correction approval; content approval; demo reset all require a session.
- [x] ✅ `requireAdmin()` guards `/admin` page and reset action.
- [ ] ◐ Production RLS policies for all tables (provided in SQL, not exercised against a live instance).
- [ ] ○ Automated authorization tests per role and action.

---

## 3. Input and output

- [x] ✅ Zod schemas validate every public form and studio payload on the server.
- [x] ✅ String length limits, email format, URL scheme validation (http/https only).
- [x] ✅ Numeric/enumeration whitelists for filters, statuses, roles, fields, slide counts.
- [x] ✅ Unknown request fields ignored/stripped.
- [x] ✅ React escaping used; no `dangerouslySetInnerHTML` for user or AI content.
- [x] ✅ Honeypot field on public forms.
- [x] ✅ Search params normalised; no direct interpolation into queries.
- [x] ✅ AI response is zod-validated and rendered as text.
- [x] ✅ AI response size and array lengths limited by schema.
- [ ] ◐ Production: add CAPTCHA/Turnstile if abuse volume requires.
- [ ] ○ CSP report-only monitoring then enforcement tuning.

---

## 4. CSRF and request integrity

- [x] ✅ Mutations use Next.js server actions (framework origin protection) rather than ad-hoc browser POST endpoints.
- [x] ✅ Session cookie is `SameSite=Lax`.
- [x] ✅ Studio research endpoint requires JSON content type and validates body; rate limited.
- [x] ✅ n8n bridge uses a server-side shared secret header; secret never reaches the client.
- [ ] ○ Production: explicit Origin/Host validation for any additional public API routes.
- [ ] ○ Production: idempotency keys for webhook retries.

---

## 5. Secrets and configuration

- [x] ✅ `.env*` gitignored except `.env.example` with placeholders.
- [x] ✅ Server-only secrets have no `NEXT_PUBLIC_` prefix.
- [x] ✅ No Supabase service-role key or n8n secret in client code.
- [x] ✅ Admin page exposes only configuration presence (configured/not configured), never values.
- [ ] ◐ Production: set a strong `AUTH_SECRET` (32+ random bytes); rotate on compromise.
- [ ] ◐ Production: restrict Supabase service-role usage to server code with strict authorization.
- [ ] ○ Secret manager + rotation policy (Vercel env / 1Password).
- [ ] ○ Remove default demo credentials in production.

---

## 6. Transport and headers

- [x] ✅ HTTPS enforced by Vercel in production.
- [x] ✅ Security headers configured in `next.config.ts`:
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'`
  - `Permissions-Policy` disabling camera/microphone/geolocation (except where needed)
  - Baseline Content-Security-Policy
- [x] ✅ `poweredByHeader: false`.
- [x] ✅ Images restricted to local/known remote patterns.
- [ ] ◐ Production: review CSP for Next inline scripts and tighten with nonces if feasible.
- [ ] ○ HSTS preload decision.

---

## 7. Data protection and privacy

- [x] ✅ Demo data is labelled and contains no real provider verification claims.
- [x] ✅ Forms include consent checkboxes and plain-language purpose.
- [x] ✅ Data mode (local demo vs Supabase) is visible in admin/dashboard.
- [x] ✅ No health records are requested; forms warn against sensitive medical details.
- [x] ✅ Audit logs contain no secrets or full form bodies.
- [x] ✅ Local `.data/` directory gitignored.
- [ ] ◐ Production: encryption at rest (Supabase default), backups, retention jobs.
- [ ] ◐ Production: DSAR/deletion process and monitored contact address.
- [ ] ○ DPA review for LLM provider, n8n hosting, email provider.
- [ ] ○ Data minimisation review for n8n payloads.

---

## 8. AI-specific safety

- [x] ✅ Content is always labelled AI-assisted draft.
- [x] ✅ Mandatory human-review checklist and named reviewer before save/review.
- [x] ✅ No diagnosis/dosage/treatment instructions in generated templates.
- [x] ✅ Emergency guidance directs to veterinary care.
- [x] ✅ No fabricated citations; UI asks humans to verify sources.
- [x] ✅ Engine mode (n8n/local/fallback) visible.
- [x] ✅ n8n timeout and local fallback; failures are visible.
- [x] ✅ Server rejects saves with incomplete review checklist.
- [ ] ◐ Production: output moderation/evaluation tests on representative prompts.
- [ ] ○ Prompt injection handling if external documents are ever ingested.
- [ ] ○ Model/provider data-retention review.
- [ ] ○ Human escalation path for flagged medical content.

---

## 9. Automation security

- [x] ✅ n8n webhook secret via environment and server header.
- [x] ✅ Webhook URL not exposed to browser.
- [x] ✅ Request timeout (20s) and response validation.
- [x] ✅ Form data persisted before automation; automation failure cannot lose the submission.
- [x] ✅ Workflow run records failure/fallback mode.
- [ ] ◐ Production: n8n instance behind auth/VPN or IP allowlist; HTTPS only.
- [ ] ○ Replay protection/idempotency in workflows.
- [ ] ○ Alerting on workflow failure and unusual volume.
- [ ] ○ Least-privilege credentials per workflow.

---

## 10. Application and delivery

- [x] ✅ TypeScript strict mode.
- [x] ✅ Production build and type-check pass (evidence in BUILD_PROGRESS).
- [x] ✅ `npm audit` run and recorded.
- [x] ✅ No known high/critical vulnerabilities at audit time (record exact output).
- [x] ✅ Dependencies pinned via lockfile.
- [x] ✅ Demo repository serialises writes and uses atomic temp-file rename.
- [x] ✅ Error boundary without stack traces in UI.
- [ ] ◐ Production: automated dependency updates and CI security scan.
- [ ] ○ WAF/bot protection at edge if public forms are spammed.
- [ ] ○ Uptime/health monitoring and alerting.

---

## 11. Admin and audit

- [x] ✅ `/admin` role-gated server-side.
- [x] ✅ Privileged mutations append audit entries (actor, action, entity, detail, time).
- [x] ✅ Admin can inspect data mode and integration presence without secret values.
- [x] ✅ Demo reset is admin-only and confirmed.
- [ ] ◐ Production: audit log immutability and export.
- [ ] ○ Segregation of duties / dual approval for destructive actions.

---

## 12. Incident readiness (production follow-ups)

- [ ] Documented security contact and incident owner.
- [ ] Secret-rotation runbook.
- [ ] Data-breach notification process (DPDP/legal review).
- [ ] Backup restore test.
- [ ] Access review cadence for founder/admin roles.
- [ ] Log retention and monitoring.

---

## 13. Release gate

Before any public deployment:

1. Set `AUTH_SECRET`, disable or remove demo accounts.
2. Configure Supabase and run RLS verification with real tokens.
3. Confirm `npm audit` review and dependency updates.
4. Re-run form abuse tests and authz tests.
5. Replace sample provider data with verified/onboarded records, or keep the demo banner and sample labels.
6. Update privacy/terms with real entity details and contact addresses.
7. Verify no secrets in client bundles or Git history.

**Important:** passing this checklist locally does not by itself make the platform production-ready. Items marked ◐/○ remain required.
