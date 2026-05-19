# IMS Platform

The internal operating system for **Innovative Movement Solutions** — scheduling, client management, leads pipeline, programs, AI tools, and business metrics.

Premium, secure, and built to scale. Hybrid SaaS aesthetic + IMS brand. Next.js 14 + Supabase + Tailwind.

---

## Phase 1 — What's in this build

✅ Auth foundation: SSR cookie sessions, password + reset flow, owner role gate
✅ Owner shell: dark sidebar, light workspace, IMS blue accents, mobile bottom nav
✅ **Today Dashboard** with Smart Action Queue, Today's Schedule, Lead Snapshot, Client Momentum, Revenue Snapshot
✅ Database schema with RLS on every business table (20 tables)
✅ Audit logging, permissions helpers, Zod validation
✅ Stub pages for Schedule, Clients, Leads (Sprint 2+3)
✅ Stub pages for Programs, Tools, Retention, Billing, Metrics (Sprint 4+5+6)
✅ Settings page with integration status panel
✅ Security headers, no-index for the whole app
✅ Mock seed data — full UI works without Supabase connected (then real once you connect)

---

## Quick start (10 minutes from zero to running)

### 1. Install dependencies

```bash
cd ims-platform
npm install
# or pnpm install
```

### 2. Set up Supabase

Skip if your `ims-platform` Supabase project already exists.

1. Open https://supabase.com/dashboard → your `ims-platform` project
2. Left sidebar → **SQL Editor** → click **New query**
3. Run migrations **in this exact order**:
   - Paste contents of `db/migrations/001_init.sql` → click **Run**
   - Paste contents of `db/migrations/002_rls.sql` → click **Run**
   - Paste contents of `db/migrations/003_bootstrap.sql` → click **Run**
4. Verify it worked: Left sidebar → **Table Editor** — you should see ~20 tables.

### 3. Create your owner account

You need a signed-in user with the `owner` role before you can log into the platform.

**Option A — Email/password (recommended)**

1. Supabase Dashboard → **Authentication** → **Users** → **Add user** → **Create new user**
2. Email: `your@email.com` · Password: pick something strong · ✅ Auto Confirm Email
3. Click **Create user**
4. Copy the new user's UUID (visible in the row after creation)
5. SQL Editor → run this, replacing the UUID:

```sql
update public.profiles
set role = 'owner', full_name = 'Jason Patterson'
where id = '<paste-uuid-here>';
```

If the row doesn't exist yet (depends on trigger setup):
```sql
insert into public.profiles (id, role, full_name)
values ('<paste-uuid-here>', 'owner', 'Jason Patterson');
```

### 4. Configure environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` — your project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/publishable key from Supabase → Settings → API
- `SUPABASE_SERVICE_ROLE_KEY` — service role key from same page (click Reveal)
- `ANTHROPIC_API_KEY` — only needed for Phase 5+ AI features. Optional for now.

### 5. Run the dev server

```bash
npm run dev
```

Open http://localhost:3000 → you should be redirected to `/login`.
Log in with the email + password from step 3. You'll land on `/today`.

---

## Project structure

```
app/
  (auth)/             public routes — login, reset-password
  (owner)/            protected — sidebar shell wraps everything
    today/            the most important screen — Smart Action Queue
    schedule/         Sprint 2 — week view
    clients/          Sprint 2 — roster + 8-tab profile
    leads/            Sprint 3 — 6-stage kanban
    programs/         Sprint 4 — AI-assisted programs
    tools/            Sprint 5 — BOD POD interpreter etc.
    retention/        Sprint 4 — churn risk
    billing/          Sprint 6 — Stripe overview
    metrics/          Sprint 6 — charts
    settings/         configuration + integration status
  api/
    health/           healthcheck
  auth/callback/      Supabase auth return URL
  forbidden/          shown to non-owner roles

components/
  app-shell/          Sidebar, Topbar, Quick Add, User Menu, Mobile Menu/Nav
  dashboard/          PageHeader + 5 dashboard widgets
  auth/               LoginForm
  ui/                 Button, Input, Label, Avatar, Dropdown, Toaster

lib/
  supabase/           4 clients: browser, server, admin (service-role), middleware
  auth/               require() helpers for protected routes
  permissions/        role-based gates
  audit/              audit log writers
  validations/        Zod schemas (extended per phase)
  seed/               mock data + future db:seed script

db/
  migrations/         001_init.sql, 002_rls.sql, 003_bootstrap.sql

types/
  index.ts            domain types (Role, ClientStatus, SmartAction, etc.)
  database.ts         Supabase-generated type stubs

middleware.ts         SSR session refresh + route protection
```

---

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start dev server at localhost:3000 |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check (no emit) |

---

## Security posture (Phase 1)

- **Middleware-protected routes** — `(owner)/*` requires auth, non-owner redirected to `/forbidden`
- **RLS on every table** — even if a route forgets the check, Supabase blocks the query
- **Service role key server-only** — never reaches the browser
- **Anthropic key server-only** — all Claude calls go through Next.js API routes
- **Stripe webhooks** — architecture ready, signature verification required when activated
- **No-index headers** — the entire app is robots-blocked
- **Security headers** — HSTS, X-Frame-Options DENY, no MIME sniffing
- **No medical claims** — AI prompts explicitly forbid diagnosis/treatment language

### What still needs hardening before going live

- [ ] Enable TOTP/2FA for the owner role (Supabase MFA enrollment scaffolded, not enforced)
- [ ] Rate-limit `/api/ai/*` routes (per-user, per-day)
- [ ] Set up Sentry for error monitoring
- [ ] Add CSP header (deferred to Phase 2 to avoid blocking dev iteration)
- [ ] Stripe webhook signature verification (when Stripe activates in Phase 6)

---

## Deployment

See `DEPLOY.md` for the step-by-step Vercel + DNS deployment runbook.

---

## Phase roadmap

| Phase | Scope | Sprint |
|---|---|---|
| **Phase 1** | Auth + Today Dashboard + app shell | Now ✅ |
| Phase 2 | Schedule (week view, session drawer, Vagaro sync) | Sprint 2 |
| Phase 3 | Clients (roster, profile, notes) | Sprint 2 |
| Phase 4 | Leads (kanban) + Retention (churn risk) | Sprint 3-4 |
| Phase 5 | Programs + AI Tools | Sprint 4-5 |
| Phase 6 | Billing + Metrics | Sprint 6 |
| Phase 7 | Client portal | Later |

---

© Innovative Movement Solutions
