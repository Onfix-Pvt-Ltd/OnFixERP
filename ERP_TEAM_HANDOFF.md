# Handoff to the OnFix POS ERP team

> Items the **ERP backend team** must do so the new marketing site at `onfixpos.com` can come online. Marketing-side work is happening in parallel in `D:\OnFixERP\onfix-web`. None of these tasks require modifying business logic — they're operational/config changes.

> **Status update — v2, 2026-05-24.** Since v1: marketing **hosting is decided** — **Vercel** app + **Turso/libSQL** CMS DB, with DNS staying on Cloudflare. `media.onfixpos.com` is **now live** (R2 bucket `onfix-marketing`). The zone moved to the **company Cloudflare account** (`Onfixofficial@gmail`; registrar GoDaddy; ERP origin Hostinger `46.224.210.8`; SSL must stay **Full (strict)**). **Update — v3, 2026-05-25: all blockers DONE (shipped in ERP v1.2.0).** `api.onfixpos.com` serves the API; CORS allows the marketing origins + `onfix-web-*.vercel.app` previews; reserved slugs are enforced; unknown subdomains 301 to the apex. Items #1/#4/#8 are **closed** and the live-API integration is verified. Remaining = the marketing-side **Vercel/Turso deploy + apex DNS flip** (see **`onfix-web/DEPLOYMENT.md`**).

---

## TL;DR

| # | Task | Owner | Blocking? | ETA |
|---|------|-------|-----------|-----|
| 1 | Add marketing origins to CORS allowlist | Backend | **Yes — blocks all browser → ERP API calls** | 5 min |
| 2 | Confirm `/api/platform/plans/public` is reachable from browsers (no auth, no tenant header) | Backend | Yes — pricing page reads this | Verification only |
| 3 | Confirm `/api/Tenants/resolve/{slug}` and `/api/Tenants/register` (+ `register-enterprise`) accept anonymous calls | Backend | Yes — login & signup flows | Verification only |
| 4 | Create new DNS subdomain `api.onfixpos.com` pointing to the ERP host (current API is at `onfixpos.com/api/...`, co-hosted with the ERP frontend) | Ops/DNS | Required **before** apex cutover, not before dev | 30 min + DNS propagation |
| 5 | Decide and confirm: keep apex `onfixpos.com` API endpoints alive during transition, or hard-cut to `api.onfixpos.com`? | Backend + Ops | Affects rollout plan | Discussion |
| 6 | Make sure all 5 term prices (`Monthly`, `6 Months`, `Annual`, `3 Years`, `5 Years`) are populated for every plan in the SuperAdmin panel (some may currently be `0`) | Product/Ops | Pricing page will show `$0` for empty terms | Data check |
| 7 | Confirm whether `/api/contact` exists on the ERP backend | Backend | Marketing falls back to in-repo handler if not | Verification only |
| 8 | **Add infrastructure subdomains to the reserved-slug list in `SlugHelper.cs`** (see §6) | Backend | **Yes — prevents orphaned tenants** | 15 min |
| 9 | After cutover: remove dead marketing components from the ERP frontend (`LandingPage`, `PricingPage` marketing variant, `Partners`, all `*Policy`, `SystemRequirements`, `HelpCenter`, `ReleaseNotes`, `SystemStatus`, `Contact`, `PlatformFooter`) and the `isPlatform` branch in `App.js` | Frontend | Cleanup, not blocking | 1–2 hr |

---

## 1. CORS allowlist (BLOCKING)

The marketing site lives on a **different origin** (`https://onfixpos.com`) and will hit the ERP API directly from the browser. Without explicit CORS entries, every fetch from the marketing site will be blocked by browsers.

**File:** `smart-serve/backend/Program.cs` — search for `AddCors`.

**Add to the existing allowlist:**

```csharp
// Marketing site (new, public-facing)
"https://onfixpos.com",
"https://www.onfixpos.com",

// Vercel preview deploys for the marketing repo (wildcard if your CORS policy supports it,
// otherwise add specific preview URLs as they come up):
"https://onfix-web-*.vercel.app",   // replace with your actual preview URL pattern

// Local dev for the marketing repo:
"http://localhost:3000",
"http://localhost:3001",
```

> **v2 note:** marketing is hosted on **Vercel**. Add the production origins `https://onfixpos.com` and `https://www.onfixpos.com`, plus the specific Vercel preview/staging origin (e.g. `https://onfix-web-<hash>.vercel.app`, or `https://new.onfixpos.com` if a staging subdomain is used) for pre-cutover testing. Keep SSL **Full (strict)**.

**Endpoints that need to be CORS-reachable from the marketing origin:**

- `GET /api/platform/plans/public` — pricing page reads this on every load
- `GET /api/Tenants/resolve/{slug}` — `/login` step 1
- `POST /api/Tenants/register` — pricing page signup (Basic / Pro / Pro+Rooms)
- `POST /api/Tenants/register-enterprise` — pricing page signup (Enterprise)
- `GET /api/shop-config` *(optional)* — only if marketing wants to show the tenant logo on the `/login` step 2 confirmation screen. Requires `X-Tenant-Slug` header to be in the CORS-allowed-headers list.

**Do NOT** allow credentials/cookies on these CORS entries — auth is JWT-in-localStorage and origin-scoped per tenant. Marketing never authenticates against the apex; setting `AllowCredentials()` would be a footgun.

**How to verify:** from a browser console at `http://localhost:3000` (with marketing site running locally),

```js
await fetch('https://onfixpos.com/api/platform/plans/public').then(r => r.json())
```

…should succeed. If it errors with `CORS policy: No 'Access-Control-Allow-Origin' header`, the allowlist isn't picking up the marketing origin yet.

---

## 2. Verify the public endpoints

These four endpoints are documented in `MARKETING_SITE_SPEC.md` §5 and `MARKETING_PRICING_SIGNUP_PROMPT.md`. Please confirm each:

### `GET /api/platform/plans/public`
- Anonymous (no `Authorization` header)
- No `X-Tenant-Slug` header required
- Returns `Plan[]` with all 5 term prices and (for Enterprise) all 5 per-property prices
- Currently exposed at: `https://onfixpos.com/api/platform/plans/public` (will move to `https://api.onfixpos.com/api/platform/plans/public` once DNS subdomain lands)

### `GET /api/Tenants/resolve/{slug}`
- Anonymous
- 200 → `{ tenantId, slug, name }`
- 404 → `{ message: "Tenant with slug '<x>' not found." }`
- 400 → slug missing/empty

### `POST /api/Tenants/register`
- Anonymous
- Request body keys: `ShopName`, `AdminUsername`, `AdminEmail`, `AdminPassword`, `PlanType`, `Duration`, optional `BillingEmail`, optional `ReferredBy`
- `PlanType` accepts both new (`Starter` / `Professional` / `Pro + Rooms`) and legacy (`Basic` / `Pro`) values
- 200 → `{ message, shopName, slug, tenantUrl, trialEnds }`
- 4xx → `{ message: <user-friendly string> }`

### `POST /api/Tenants/register-enterprise`
- Anonymous
- Request body keys: `GroupName`, `FirstPropertyName`, `AdminUsername`, `AdminEmail`, `AdminPassword`, `Duration`, optional `BillingEmail`
- 200 → `{ message, groupName, firstPropertyName, orgId, tenantId, loginUrl, trialEnds }`

If any of these have changed shape since the spec was written, **flag it before marketing goes live** — the marketing site's TypeScript types are pinned to these exact shapes.

---

## 3. DNS plan — `api.onfixpos.com`

**Current state:** ERP API is co-hosted at `onfixpos.com/api/...` on the same Hetzner box as the ERP frontend.

**Target state at cutover:**
- `onfixpos.com` (apex) → marketing host (Vercel)
- `www.onfixpos.com` → marketing host (or 301 to apex, pick one)
- `api.onfixpos.com` → ERP host (new subdomain for the API)
- `*.onfixpos.com` → ERP host (existing wildcard, unchanged — this is how tenant subdomains work)

**Sequence (recommended):**

1. **Today/before marketing dev finishes:** add `api.onfixpos.com` `A`/`AAAA` to the ERP host. Verify `https://api.onfixpos.com/api/platform/plans/public` returns the plan list. **Keep `onfixpos.com/api/*` working in parallel** during the transition.
2. **When marketing is ready to deploy:** marketing repo points its `NEXT_PUBLIC_ERP_API_BASE` env to `https://api.onfixpos.com`. Test thoroughly on a Vercel preview deploy.
3. **Cutover day:** flip apex `A`/`AAAA` from the ERP host to Vercel. The marketing site goes live on `onfixpos.com`. Tenant subdomains (`*.onfixpos.com`) and the new `api.onfixpos.com` are unaffected.
4. **Post-cutover:** the apex `onfixpos.com/api/*` endpoints become unreachable (because the apex no longer routes to the ERP). Tenant subdomains and `api.onfixpos.com` keep working. Decide whether to leave a 301 redirect from `onfixpos.com/api/*` → `api.onfixpos.com/api/*` for any third-party callers — probably not needed since these are internal APIs.

**SSL:**
- Vercel handles `onfixpos.com` and `www.onfixpos.com` automatically.
- `api.onfixpos.com` needs a cert on the ERP host — either via the existing `*.onfixpos.com` wildcard cert (if it covers `api`) or by adding `api.onfixpos.com` as a SAN to your existing Let's Encrypt config.
- **DNS is on the company Cloudflare account** (`Onfixofficial@gmail`; registrar GoDaddy). At cutover, set the apex `onfixpos.com` record to **DNS-only (grey cloud)** so Vercel serves SSL/CDN; leave `*.onfixpos.com`, `api`, `media`, and all mail records proxied/unchanged. SSL/TLS mode must stay **Full (strict)** — Flexible causes 521s because the ERP origin is HTTPS-only.

**`robots.txt`:**
- Marketing host serves `robots.txt` allowing all + `sitemap.xml`.
- `api.onfixpos.com` should serve `robots.txt` with `Disallow: /` (no reason for crawlers to hit the API).
- Tenant subdomains (`*.onfixpos.com`) should also `Disallow: /` so private tenant apps don't get indexed.

---

## 4. Plan-data sanity check

The new pricing page renders **whatever the API returns**. If a plan has `priceAnnual: 0` because it was never filled in, the page will display `$0/yr`. Before launch:

1. Open the SuperAdmin panel → Plans.
2. For each of the 4 plan codes (`basic`, `pro`, `pro_rooms`, `enterprise`) confirm:
   - `displayName` is the new naming if you've adopted it (`Starter` / `Professional` / `Pro + Rooms` / `Enterprise`) or whatever you want shown publicly.
   - `description` is a short tagline (renders under the plan name on the marketing tile).
   - All 5 term prices are populated and non-zero (or intentionally zero if you want a free tier).
   - For `enterprise`: all 5 `pricePerProperty*` fields are populated.
   - `sortOrder` is set so plans render in the right order on the page.
   - `currency` is what you actually want shown (currently `USD` per spec).

---

## 5. After-cutover cleanup (ERP frontend)

Per `MARKETING_SITE_SPEC.md` §8, once marketing is live and the apex no longer hits the ERP, the following ERP code becomes dead:

**`smart-serve/frontend/src/App.js:564-599`** — the `isPlatform` branch and the components it renders:
- `LandingPage`
- `PricingPage` (the marketing variant — the in-tenant `/#/pricing` for upgrades stays)
- `Partners`
- `*Policy` components (`TermsOfService`, `PrivacyPolicy`, `RefundPolicy`, `AcceptableUsePolicy`, `DataProcessingAgreement`, `CookiePolicy`)
- `SystemRequirements`, `HelpCenter`, `ReleaseNotes`, `SystemStatus`
- `Contact`
- `PlatformFooter`

**`smart-serve/backend/Services/Tenancy/TenantResolutionService.cs:123-128`** — the legacy-tenant fallback for anonymous shop-config queries on the apex. Once the apex never hits the API, this is dead code.

**In-tenant `/#/pricing` route on `<slug>.onfixpos.com`** — purpose changes from "create new account" to "upgrade existing plan." Replace its `Create Account` form with a plan-switch form that calls `POST /api/Subscriptions/simulate-payment` for the logged-in tenant. (Already implemented backend-side per the spec.)

**Don't do this until marketing is verified live.** No rush.

---

## 6. Reserved slugs — prevent orphaned tenants (BLOCKING before launch)

**The problem:** as marketing infrastructure grows, certain subdomains under `onfixpos.com` will point to non-ERP hosts (e.g. `api.onfixpos.com` → ERP API host, `media.onfixpos.com` → Cloudflare R2 bucket — **already live as of 2026-05-24**, `www.onfixpos.com` → Vercel marketing site). DNS resolves the most specific match, so these subdomains **bypass** the `*.onfixpos.com` wildcard that normally sends traffic to the ERP.

If a customer signs up with `ShopName: "media"` (or `api`, or `www`), the ERP happily creates the tenant in Postgres — but the user's URL `media.onfixpos.com` points to R2 (or Vercel, or wherever), **not** the ERP. The tenant is orphaned in the database and the user lands on a 404 or XML error page. Worst case the user gives up; mid case they file a support ticket; either way it's an avoidable bad experience.

**The fix:** add infrastructure subdomain names to the reserved-word list in `smart-serve/backend/Helpers/SlugHelper.cs` (the same list that already rejects names like `admin`, `root`, etc. per the spec). At minimum the list should reject these slugs:

```
api          // ERP API subdomain
www          // apex alias
media        // R2 media bucket — LIVE (media.onfixpos.com)
cdn          // future
assets       // future
admin        // future admin panel
dashboard    // future
app          // common SaaS subdomain
auth         // future SSO endpoint
sso          // future
mail         // mail server / aliases
email        // mail server / aliases
docs         // docs site
help         // help center
support      // support portal
status       // status page
blog         // blog
dev          // dev environments
staging      // staging environments
test         // test environments
preview      // preview environments
```

Anything you ever expect to point at non-ERP infrastructure should go in this list. The list is cheap to extend later, expensive to add **after** a customer has snagged a colliding slug. Be generous now.

**Behaviour on collision:** when the marketing signup form posts `ShopName: "media"`, the ERP should respond with the existing 400 error message (`'<x>' is not a valid shop name (must be 3+ alphanumeric characters and not a reserved word).`). The marketing site already surfaces this inline above the submit button — no marketing-side changes needed.

**One-time audit:** before adding to the list, run a query against production:

```sql
SELECT slug, name, created_at FROM "Tenants" WHERE slug IN (
  'api','www','media','cdn','assets','admin','dashboard','app','auth','sso',
  'mail','email','docs','help','support','status','blog','dev','staging','test','preview'
);
```

If any tenants already exist with these slugs, decide per-row whether to rename them (with customer notification) or grandfather them in. After the audit, lock the list down.

---

## 7. Forward-compat: things marketing will need from the ERP later

Not blocking the launch, but nice-to-have for reducing manual cross-repo mirroring:

### `Plan.featuresShown[]`

Add a `string[]` field to the `Plan` entity (or a related `PlanFeatureBullet` table) that holds the bullet points shown on each marketing tile (e.g. `["Core POS & billing", "Table management", "QR table ordering", ...]`). Today these are hardcoded in both the ERP `PricingPage.js` and the marketing repo. Pushing them into the API means a SuperAdmin edit propagates to both clients.

### `Plan.tagline`

A separate field for the short pitch under each plan title — currently lives in `description` but you may want both. Optional.

### Comparison-matrix data

The full feature comparison table on `/pricing` (9 categories × ~70 rows) is currently hardcoded in the marketing repo. If you ever want this driven from the API, the right shape is:

```ts
type PlanFeatureMatrix = {
  categories: Array<{
    name: string;
    rows: Array<{
      name: string;
      includedIn: Array<'basic' | 'pro' | 'pro_rooms' | 'enterprise'>;
    }>;
  }>;
};
GET /api/platform/feature-matrix/public  // anonymous, cacheable
```

Defer until you've made one or two manual edits to the matrix and felt the pain. Don't pre-build.

### `/api/contact`

If you want lead-form submissions to land in the ERP database (e.g. for support staff to triage), expose `POST /api/contact` accepting `{ name, email, company?, message, source }`. Otherwise the marketing site handles its own contact form via a Next.js route handler that emails you.

---

## Questions for the ERP team

Please reply on each before marketing freezes scope:

1. **CORS** — can you add the marketing origins to `Program.cs` allowlist this week? If not, what's the timeline?
2. **`api.onfixpos.com` DNS** — when can the new subdomain be set up? It needs to be working *before* apex cutover.
3. **Apex transition** — keep `onfixpos.com/api/*` alive in parallel during the marketing dev cycle, or hard-cut to `api.onfixpos.com` from day one?
4. **Plan data** — are all 4 plans' 5 term prices populated in production? (Marketing will show `$0` for any that aren't.)
5. **`/api/contact`** — exists today, or should marketing handle it in its own backend?
6. **Reserved slugs** — can you confirm `api`, `www`, `media`, `cdn`, `admin`, etc. (full list in §6) are in `SlugHelper.cs`'s reserved-word array, and run the audit query against production? **Blocking before launch** — otherwise a customer could snag `media` and end up with an orphaned tenant.
7. **Forward-compat fields** — interest in `Plan.featuresShown[]` to remove the cross-repo mirror burden? Not blocking, but cheap to add now.

---

*Document version: 2, 2026-05-24 (initial v1 2026-05-10). Maintained alongside `MARKETING_SITE_SPEC.md`, `MARKETING_PRICING_SIGNUP_PROMPT.md`, and the cutover runbook `onfix-web/DEPLOYMENT.md`.*
