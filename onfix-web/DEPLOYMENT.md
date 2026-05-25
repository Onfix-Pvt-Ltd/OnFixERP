# Deploying the marketing site & cutting `onfixpos.com` over

This is the runbook for hosting this app and pointing the apex `onfixpos.com`
at it while the ERP keeps running on the `*.onfixpos.com` wildcard.

**Recommended stack:** Vercel (app) + Turso/libSQL (CMS DB) + Cloudflare R2
(media, already live) + Cloudflare DNS (already managing the zone).
See `README.md` for why Cloudflare Pages/Workers is **not** used (Payload + `sharp`
need a Node runtime).

---

## Target end state

| Hostname | Points at | Cloudflare proxy |
|----------|-----------|------------------|
| `onfixpos.com` (apex) | Vercel (this app) | **DNS-only** (Vercel does SSL/CDN) |
| `www.onfixpos.com` | Vercel (or 301 → apex) | DNS-only |
| `*.onfixpos.com` | ERP origin `46.224.210.8` | Proxied (unchanged) |
| `api.onfixpos.com` | ERP origin | Proxied |
| `media.onfixpos.com` | R2 bucket `onfix-marketing` | Proxied (unchanged) |

SSL/TLS mode stays **Full (strict)** — the ERP origin is HTTPS-only (Flexible → 521s).

---

## Prerequisites — ERP team — ✅ DONE (shipped in ERP v1.2.0, 2026-05-25)

All three blockers from `ERP_TEAM_HANDOFF.md` are live in production:

1. **`api.onfixpos.com` serves the ERP API** — verified: `/api/platform/plans/public`
   → 200 anonymous `Plan[]`; `/api/Tenants/resolve/{slug}` → 200 / 404; `register` +
   `register-enterprise` unchanged. (`/api/contact` does **not** exist on the ERP — keep
   the in-repo Next.js handler.)
2. **CORS** allows `https://onfixpos.com`, `https://www.onfixpos.com`, any
   `*.onfixpos.com` (incl. `new.onfixpos.com`), and Vercel previews matching
   `https://onfix-web-*.vercel.app`.
   > ⚠️ The preview rule only matches the **`onfix-web-` prefix**. If the Vercel project
   > emits previews under a different prefix (e.g. `onfixerp-*.vercel.app`), browser calls
   > (`/login`, signup) will be CORS-blocked. **Sidestep it: run staging on
   > `new.onfixpos.com`** (already allowed, zero caveats), or name the Vercel project
   > `onfix-web`, or have the ERP team widen the rule to your exact preview hostname.
3. **Reserved slugs** rejected at signup: `api www media cdn assets admin app dashboard
   auth sso mail email docs help support status blog dev staging test preview` (400 with
   the existing message the form already surfaces). Bonus: unknown tenant subdomains now
   301 to `https://onfixpos.com` instead of a broken ERP shell.

Re-verify any time (safe, anonymous GETs — do **not** POST `register` unless you want real tenants created):
```bash
curl https://api.onfixpos.com/api/platform/plans/public        # 200 + Plan[]
curl -o /dev/null -w '%{http_code}\n' https://api.onfixpos.com/api/Tenants/resolve/legacy   # 200
# CORS check from the staging origin's browser console:
await fetch('https://api.onfixpos.com/api/platform/plans/public').then(r => r.json())
```

---

## One-time setup

### 1. Turso (CMS database)
```bash
turso db create onfix-cms
turso db show onfix-cms --url       # → DATABASE_URI
turso db tokens create onfix-cms    # → DATABASE_AUTH_TOKEN
```
> The content in your local `onfix-cms.sqlite` (first admin user, uploaded media,
> any Phase 3 content) is **not** in Turso. Either re-enter it via `/admin` after
> deploy (fast — pages fall back to sensible defaults until then), or dump/import:
> `turso db shell onfix-cms < dump.sql`. Media files themselves already live in R2.

### 2. Vercel project
- Import the repo, root directory `onfix-web`.
- Framework preset: Next.js. Build/output: defaults (no `vercel.json` needed).
- Add every variable from `.env.production.example` (Settings → Environment Variables).
  - `PAYLOAD_SECRET`: `openssl rand -base64 32` — set once, never rotate casually.
  - `DATABASE_URI` / `DATABASE_AUTH_TOKEN`: from Turso above.
  - R2 keys: from the Cloudflare R2 token for the `onfix-marketing` bucket.
  - For the **staging** deploy, set `NEXT_PUBLIC_ERP_API_BASE=https://onfixpos.com`
    (current working API) so pricing/login work before `api.` exists; switch to
    `https://api.onfixpos.com` at cutover.

### 3. Create the first admin user
Visit `https://<deploy>/admin` — Payload shows a create-first-user screen on an
empty DB.

---

## Staging (safe — zero risk to the live ERP / apex)

1. Deploy to Vercel; it gives a `*.vercel.app` URL. Optionally bind a temporary
   subdomain like `new.onfixpos.com` (CNAME → Vercel, DNS-only) for realistic testing.
2. Ask the ERP team to add that origin to CORS.
3. Smoke test: `/`, `/pricing` (plans load + a test signup), `/login` (slug
   resolves + redirects to `<slug>.onfixpos.com/#/login`), `/contact`, `/admin`
   (log in, edit a global/collection, confirm it appears on the page within ~1m),
   media renders from `media.onfixpos.com`.

Nothing above touches the apex or tenant traffic.

---

## Cutover (the apex flip)

Do this in a low-traffic window. Lower the apex record's TTL to ~2 min a day ahead.

1. Confirm ERP prerequisites #1–#3 are verified live.
2. In Vercel, set production `NEXT_PUBLIC_ERP_API_BASE=https://api.onfixpos.com`
   and add `onfixpos.com` (+ `www`) as production domains. Redeploy.
3. In Cloudflare DNS, change the **apex `onfixpos.com` A record**:
   - from `A 46.224.210.8` (ERP)
   - to the target Vercel gives you (A `76.76.21.21` or the ANAME/CNAME flow),
     and set it to **DNS-only (grey cloud)**.
   - Leave `*` , `api`, `media`, and all mail (MX/CNAME/DKIM/DMARC) records **untouched**.
4. Confirm `www` resolves to Vercel too (CNAME → Vercel, DNS-only).
5. Keep SSL/TLS **Full (strict)**.

DNS propagates in minutes (short TTL). Tenant subdomains and `api.` are unaffected
because their records didn't change.

---

## Post-cutover verification

```bash
curl -I https://onfixpos.com                      # Vercel (x-vercel-id header)
curl -I https://www.onfixpos.com                  # Vercel or 301
curl -s https://api.onfixpos.com/api/platform/plans/public | head   # ERP, still 200
curl -I https://<a-real-tenant>.onfixpos.com      # ERP, still serving the tenant app
curl -I https://media.onfixpos.com/<known-file>   # R2, 200
```
In a browser: `/pricing` loads live plans, a test signup returns a `tenantUrl`,
`/login` resolves a known slug, `/admin` logs in and saves.

---

## Rollback

Revert the single apex `A` record back to `46.224.210.8` (ERP) and restore its
proxied state. Because only the apex record changed, rollback is one edit and
propagates within the TTL. Tenant/`api`/`media`/mail were never touched.
