# Deploying the IMS Platform

This runbook gets the platform live at **`portal.imsmethod.com`** on Vercel.

Total time: ~20 minutes if you follow it linearly.

---

## Prerequisites

- ✅ Supabase project (`ims-platform`) created and migrations run (see `README.md`)
- ✅ Owner user created in Supabase Auth with `role = 'owner'` in `profiles`
- ✅ Anthropic API key in console.anthropic.com
- ✅ Tested locally: `npm run dev` and login worked at `localhost:3000`
- ✅ Stripe account created (can be brand new — no products needed yet)

---

## Step 1 — Push code to GitHub

```bash
cd ims-platform
git init
git add .
git commit -m "Phase 1 — secure foundation + Today Dashboard"
git branch -M main
git remote add origin https://github.com/IMS858/IMS-Platform.git
git push -u origin main
```

If the repo already has commits and you want a clean slate:
```bash
git push -f origin main
```

---

## Step 2 — Create the Vercel project

1. Go to https://vercel.com/dashboard
2. **Add New → Project**
3. **Import Git Repository** → find `IMS858/IMS-Platform`
4. Click **Import**
5. **Framework Preset:** Next.js (auto-detected)
6. **Root Directory:** `./` (leave default)
7. **Build & Output Settings:** leave default
8. **DO NOT click Deploy yet** — we need env vars first

---

## Step 3 — Add environment variables in Vercel

In the same project setup screen, expand **Environment Variables**.

Add each one below. For each: type the **Key**, paste the **Value**, leave **All Environments** checked.

| Key | Value | Where to get it |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://wlhuimpkardlyjcmvqlw.supabase.co` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_xxxxx` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...xxxxx` (click Reveal) | Supabase → Settings → API |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-xxxxx` | console.anthropic.com → API Keys |
| `NEXT_PUBLIC_APP_URL` | `https://portal.imsmethod.com` | (after domain is connected) |
| `NEXT_PUBLIC_APP_ENV` | `production` | hardcoded |

⚠️ **Critical:**
- `SUPABASE_SERVICE_ROLE_KEY` must NOT have the `NEXT_PUBLIC_` prefix. If it does, anyone visiting the site can grab it.
- `ANTHROPIC_API_KEY` is also server-only — no `NEXT_PUBLIC_` prefix.

---

## Step 4 — Deploy

Click **Deploy**.

First build takes ~2-3 minutes. Vercel will:
1. Install dependencies
2. Run `next build`
3. Generate the production bundle
4. Deploy to a `*.vercel.app` URL

When it finishes, you'll see a confetti screen. Click **Continue to Dashboard**.

---

## Step 5 — Test on the Vercel URL first

Visit the `*.vercel.app` URL (something like `ims-platform-xyz.vercel.app`).

You should be redirected to `/login`. Log in with the owner credentials you created in Supabase. You should land on `/today` and see the dashboard rendering with mock data.

**If login fails:** check Vercel → your project → Deployments → click the latest → **Runtime Logs** tab. Look for `[reset-password]` or supabase error messages.

---

## Step 6 — Connect the custom domain

1. In your Vercel project → **Settings** → **Domains**
2. Click **Add** → type `portal.imsmethod.com` → click **Add**
3. Vercel shows the DNS record needed. It'll be a **CNAME** record like:
   - **Type:** CNAME
   - **Name:** `portal`
   - **Value:** `cname.vercel-dns.com` (or a project-specific value like `XYZ.vercel-dns-017.com`)
4. **Copy the exact value Vercel shows you** — it may be project-specific.

### Step 6b — Add the CNAME in GoDaddy

1. Open https://godaddy.com → sign in → **My Products**
2. Find `imsmethod.com` → click **Manage DNS**
3. Click **Add New Record**:
   - **Type:** CNAME
   - **Name:** `portal`
   - **Value:** whatever Vercel showed you (no trailing dot)
   - **TTL:** 1 hour
4. **Save**

Wait 5–30 minutes for DNS to propagate. Vercel will auto-detect and switch the domain status to green ✅. SSL is auto-issued.

---

## Step 7 — Update `NEXT_PUBLIC_APP_URL`

Once the domain is live:

1. Vercel → **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_APP_URL` → **Edit** → change to `https://portal.imsmethod.com` → **Save**
3. **Deployments** tab → latest → **⋯** → **Redeploy** to pick up the new env value

---

## Step 8 — Verify everything

Test these in order:

- [ ] https://portal.imsmethod.com loads with login screen
- [ ] Login with owner credentials → land on `/today`
- [ ] Today Dashboard renders with mock data (Smart Action Queue, schedule, lead snapshot, revenue)
- [ ] Sidebar nav works — Schedule, Clients, Leads, Settings all show their stub pages
- [ ] Mobile (resize browser to 390px or open on phone) — sidebar collapses to drawer, bottom nav appears
- [ ] Quick Add dropdown opens
- [ ] User menu dropdown opens → Sign out works → redirected to `/login`
- [ ] https://portal.imsmethod.com/api/health returns `{"ok":true,...}`
- [ ] Try a forbidden user (create a second Supabase user with `role = 'client'`) — should land on `/forbidden`

---

## Troubleshooting

### "Build failed: Module not found"
Most likely a case sensitivity issue. The repo path is `IMS858/IMS-Platform` (capital). Make sure all imports use lowercase `@/` aliases.

### "Login works locally but not in Vercel"
Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in Vercel and there are no trailing spaces.

### "I see a blank page or 500 error"
Vercel → project → Deployments → latest → **Runtime Logs**. The error message will tell you what's missing — usually an env var.

### "Domain still says Invalid Configuration after 1 hour"
Check propagation at https://dnschecker.org → enter `portal.imsmethod.com` → CNAME. Once it shows globally, click Refresh in Vercel.

### "I logged in but get redirected back to /login"
The `profiles` table likely doesn't have your row, OR doesn't have `role = 'owner'`. Run the SQL from `README.md` step 3.

---

## Going live checklist (before sharing with real users)

- [ ] All env vars set in Vercel for **Production** environment
- [ ] Owner has 2FA enabled (Phase 2 work)
- [ ] Sentry connected for error monitoring (optional but recommended)
- [ ] Backup strategy confirmed (Supabase auto-backs up Pro tier; verify yours)
- [ ] At least one real client + lead created to test end-to-end
- [ ] Stripe configured (when Phase 6 ships)
- [ ] Audit log writes verified in Supabase Table Editor
- [ ] Health endpoint monitored: `GET /api/health`

---

## Rollback procedure

If a deployment breaks something:

1. Vercel → Deployments → find the last known good deployment
2. Click its **⋯** menu → **Promote to Production**
3. Boom — traffic is back on the working version
4. Investigate the broken deploy in a feature branch, not main

---

© Innovative Movement Solutions
