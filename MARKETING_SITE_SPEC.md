# OnFix POS — Marketing Site Implementation Spec

> **For the agent building the marketing site:** this document is your complete brief. The OnFix POS ERP backend already exposes every endpoint you need — your job is to build a separate marketing site that consumes them and hands off cleanly to the existing tenant subdomains. Do not modify the ERP backend or ERP frontend. Read the "How OnFix POS works" section first so you understand the multi-tenant model before you build anything.

---

> ## ⚠️ As-built amendments — 2026-05-24
>
> The site described below is **now built** (Phases 1–3 complete). This document is preserved as the original brief; where as-built reality diverges, the source of truth is **`onfix-web/README.md`** (architecture, CMS model, mirror checklist) and **`onfix-web/DEPLOYMENT.md`** (hosting + cutover). Divergences to know before trusting the text below:
>
> - **Framework:** built on **Next.js 16** (not 15). `NEXT_PUBLIC_API_BASE` in §9 is actually **`NEXT_PUBLIC_ERP_API_BASE`** (default `https://api.onfixpos.com`).
> - **Brand:** **orange `#FF5C00` only** — the blue/purple/indigo palette in §7 and §9 was **superseded** by the user. (Pricing brand specifics: see `MARKETING_PRICING_SIGNUP_PROMPT.md`.)
> - **Landing page:** the custom orange "absolute clarity" home page was **kept**; the ERP's `LandingPage.js` was **not** ported — overrides §4.1 and §9 item 1.
> - **CMS:** an embedded **Payload CMS 3** (SQLite local / **Turso** in prod + **Cloudflare R2** media at `media.onfixpos.com`) was added in Phases 2–3. `/reviews`, `/media`, `/guides` (+ `/guides/[slug]`), `/partners`, `/system`, `/about`, plus footer/home/ROI content are CMS-backed via collections + globals (hardcoded fallbacks throughout). Admin at `/admin`. The "static / lightly-dynamic" framing in §2 and §4.4 is superseded.
> - **Hosting:** **decided — Vercel (app) + Turso/libSQL (CMS DB) + Cloudflare (DNS/R2).** Cloudflare Pages (floated in §2/§10.1) is **not viable** — Payload + `sharp` need a Node runtime. See `DEPLOYMENT.md`.
> - **Cutover status:** ERP prerequisites are **done & live** — `api.onfixpos.com`, CORS, reserved slugs (ERP v1.2.0, 2026-05-25); the live-API integration is verified. Remaining is the marketing-side Vercel/Turso deploy + the apex DNS flip. See `ERP_TEAM_HANDOFF.md` and `DEPLOYMENT.md`.
>
> Everything else below remains accurate and binding — the multi-tenant model (§1), endpoint contracts (§5), the login-handoff UX (§4.3), the never-SSG pricing rule (§2), the PSP forward-compat rules (§10.3), and the sync rules (§7b).

---

## 1. How OnFix POS works (brief)

OnFix POS (also called Smart Serve internally) is a multi-tenant SaaS for restaurant and hotel management. Each customer ("shop") is a **tenant** with isolated data — orders, menu, staff, inventory — all scoped by `TenantId`.

**Tenant addressing.** Each tenant gets a unique `slug` (e.g. `legacy`, `pro`) and is reachable at `<slug>.onfixpos.com`. The backend resolves which tenant a request belongs to by reading the host's first DNS label — so `legacy.onfixpos.com` → tenant with slug `legacy`. The header `X-Tenant-Slug: <slug>` is also accepted as a fallback (used when a frontend can't influence the host, e.g. desktop Electron, or this marketing site).

**Plans.** Three SaaS plans (`basic`, `pro`, `pro_rooms`) plus an `enterprise` SKU for hotel groups. The plan a tenant is on controls feature flags (`PlanFeature` rows) and quota limits (`PlanLimit` rows). The same React+.NET code runs for every tenant; behaviour differs only because of the plan attached to the tenant.

**Auth model.** JWT bearer tokens, **not cookies**. Login returns `{ token, ... }`; the frontend stores it in `localStorage` and sends `Authorization: Bearer <token>` on subsequent requests. Each token is bound to a single tenant — log in to `legacy.onfixpos.com` and you cannot use that token on `pro.onfixpos.com`.

> **Key consequence for the marketing site:** because tokens live in `localStorage` (origin-scoped), a token minted at `onfixpos.com` is NOT readable at `<slug>.onfixpos.com`. So the marketing site must **never log the user in itself** — it can only redirect them to the right tenant subdomain where the existing login page handles the credential exchange.

**Two demo tenants** already exist in production: `legacy.onfixpos.com` (Basic plan, capped) and `pro.onfixpos.com` (Pro+Rooms plan, everything on). Both seeded by EF Core migrations.

**Backend.** ASP.NET Core 8 (.NET) at the apex of `api.onfixpos.com` (or wherever the user deploys it — confirm with the user). Postgres in production, SQLite locally / on Electron. All endpoints below are already implemented and live.

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  onfixpos.com   ─── marketing site (THIS PROJECT, separate deploy) │
│                                                                     │
│   /                LandingPage      (already designed, port over    │
│                                      [LandingPage.js] from ERP)     │
│   /pricing         PricingPage      (signup → POST /Tenants/register│
│                                      or /Tenants/register-enterprise│
│   /login           Two-step shop    (slug input → redirect to       │
│                    finder            <slug>.onfixpos.com/#/login)   │
│   /contact         Contact form                                     │
│   /partners,       static / lightly-dynamic content                 │
│   /terms-of-service, /privacy-policy, /refund-policy,               │
│   /acceptable-use-policy, /data-processing-agreement,               │
│   /cookie-policy, /system-requirements, /help-center,               │
│   /release-notes,  /system-status                                   │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              │ axios / fetch
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│  api.onfixpos.com   ─── existing .NET backend (DO NOT MODIFY)       │
│                                                                     │
│   GET  /api/platform/plans/public       (list plans for pricing)    │
│   GET  /api/Tenants/resolve/{slug}      (validate shop slug)        │
│   POST /api/Tenants/register            (signup Basic/Pro/Pro+Rooms)│
│   POST /api/Tenants/register-enterprise (signup Enterprise group)   │
│   GET  /api/shop-config                 (branding for a tenant)     │
│                                                                     │
│   Plus everything else the ERP uses — irrelevant to marketing.      │
└─────────────────────────────────────────────────────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
┌──────────────────────────┐         ┌──────────────────────────┐
│ <slug>.onfixpos.com      │         │ <slug>.onfixpos.com      │
│                          │  ...    │                          │
│ existing React ERP       │         │ existing React ERP       │
│ /#/login, /#/pricing,    │         │ (one per tenant)         │
│ /#/dashboard, etc.       │         │                          │
└──────────────────────────┘         └──────────────────────────┘
```

**Deployment.** Marketing site is a **completely separate deploy on its own server / infrastructure** — confirmed by the user. Vercel is the natural fit (free SSL on apex `onfixpos.com`, edge caching, instant rollbacks), but it can equally live on Netlify, Cloudflare Pages, a fresh Hetzner box, etc. The only couplings to the ERP are: (a) DNS — apex `onfixpos.com` and `www.onfixpos.com` `A`/`AAAA` to the marketing host, while `*.onfixpos.com` continues pointing at the ERP; (b) HTTPS API calls to the ERP backend (CORS-allowed); (c) copies of brand asset files. **No** shared filesystem, runtime, session store, or auth context is required.

**Pricing sync.** The user can edit plan prices via the ERP's SuperAdmin panel (`PUT /api/platform/plans/{code}`, see [`PlansController.cs:45-63`](smart-serve/backend/Controllers/PlansController.cs#L45-L63)). Those edits write to the shared `Plans` table that the marketing site reads via `GET /api/platform/plans/public` ([`PlansController.cs:35-43`](smart-serve/backend/Controllers/PlansController.cs#L35-L43)) — so price changes propagate automatically as long as the marketing `/pricing` page fetches plans **live**, not at build time. **Required behaviour:**

- Use a client-side `useEffect` fetch (like the existing `PricingPage.js` does) — simplest, always fresh.
- OR an SSR fetch with `{ cache: 'no-store' }` — also always fresh.
- OR ISR with `export const revalidate = 60` — at most 60 seconds stale, acceptable.

**Forbidden:** do NOT use Next.js full SSG / `generateStaticParams` for plans, do NOT bake the plan list into a build artifact, do NOT cache for hours. Any of those will silently desync prices and burn you when the user changes a plan and the marketing site keeps showing the old number.

---

## 3. Tech stack

**Required:**
- **Next.js 15 (App Router) + TypeScript** — SEO-critical pages need SSR/SSG; CRA's CSR is what we're moving away from. Use `metadata` exports for SEO and `generateMetadata` for dynamic ones.
- **Tailwind CSS** — match the ERP's existing utility-class style. Configure dark mode (`darkMode: 'class'`) so the existing pages translate without rework.
- **lucide-react** — same icon set the ERP already uses (`ChefHat`, `Smartphone`, `TrendingUp`, `Check`, `X`, `CreditCard`, `Store`, `Mail`, `Lock`, `Building2`, `Plus`, `Minus`, `ArrowRight`, `Loader2`, `ShieldCheck`).
- **framer-motion** — same animation library; many ERP marketing components rely on its `motion`, `AnimatePresence`, and `whileInView` APIs.
- **axios** — same HTTP client style. Native `fetch` is fine too.

**Recommended:**
- **next/image** for the hero / feature images (OnFix already has assets at `/images/feature-dashboard.png` etc. on the ERP; copy them into `public/images/` on the marketing repo).
- **react-hook-form** + **zod** for the signup form (the ERP uses plain `useState`, but a marketing-quality form benefits from proper validation).
- **@vercel/analytics** or **plausible** — privacy-respecting page analytics for conversion tracking.

**Do NOT use:**
- Server-side state for auth — there is none. Treat marketing as a fully static/CSR-where-needed site that talks to the ERP API for the two write actions only (signup, slug validation).
- Cookies for cross-domain auth — the ERP is JWT-in-localStorage. Don't try to set `Domain=.onfixpos.com` cookies or imitate sessions.

---

## 4. Pages to build

### 4.1 `/` — Landing page

Port over the existing landing experience. Source of truth for layout: [`smart-serve/frontend/src/components/LandingPage.js`](smart-serve/frontend/src/components/LandingPage.js) on the ERP. **You can copy 90% of the JSX wholesale**; the only meaningful changes:

- Replace `useShopConfig()` with hardcoded brand defaults — there is no tenant context on the apex domain. Hardcode:
  - `logoUrl = "/images/branding/onfix-full-logo.png"` (copy file from ERP's `public/images/branding/`)
  - `shopName = "OnFix POS"`
  - `heroUrl`, `heroType`, `heroImages`: leave undefined and let the gradient fallback render (existing code path).
- Replace `react-helmet` with Next.js `export const metadata` in `app/page.tsx`. Title: `OnFix POS — Run your restaurant like a pro.` Description and OG tags as in the existing component.
- Replace `<Link to="/pricing">` (react-router) with `<Link href="/pricing">` (next/link).
- Replace `react-router-dom` everywhere with `next/link` and `next/navigation`.
- Keep the `FeatureSlider` component — works as-is once router imports are swapped.
- Keep the JSON-LD structured data block.

Header nav links: `Features` (anchor `#features`), `Pricing` (`/pricing`), `Contact` (`/contact`), `Login` (`/login`). Plus a `Get Started` pill that links to `/pricing`.

### 4.2 `/pricing` — Pricing & signup

This is the most complex page. The existing implementation is at [`smart-serve/frontend/src/components/PricingPage.js`](smart-serve/frontend/src/components/PricingPage.js) — port it over with the same caveats as above (router swaps). The key flow:

1. **On mount**, fetch plans from the backend:
   ```ts
   const plans = await axios.get(`${API_BASE}/api/platform/plans/public`);
   ```
   This returns an array of `Plan` objects (see §5.1 for shape).

2. **Plan selector UI** — four tiles: Basic, Pro, Pro + Rooms, Enterprise.
   - Pro shows `POPULAR` badge.
   - Pro + Rooms shows `NEW` badge.
   - Enterprise shows `ENTERPRISE` badge and a property-count stepper (`-` `+`, min 2). Total = `enterpriseBase + (propertyCount - 1) * pricePerProperty`.

3. **Term selector** — toggle between `Monthly`, `6 Months`, `Annual`, `3 Years`, `5 Years`. Switches which `priceXxx` field on the `Plan` is used.

4. **Create Account form** — captures:
   - `shopName` (becomes the slug — see [`smart-serve/backend/Helpers/SlugHelper.cs`](smart-serve/backend/Helpers/SlugHelper.cs) for rules; reserved words are blocked server-side, surface 4xx errors inline)
   - `groupName` (Enterprise only; the hotel group name)
   - `adminUsername` (regex: `^[a-zA-Z0-9_\.]+$`)
   - `adminEmail`
   - `password` (min 8 chars)
   - `billingEmail` (optional; falls back to `adminEmail` server-side)
   - **Payment fields are visual placeholders, exactly mirroring the current ERP form.** Render: card number, MM/YY, CVC inputs, plus a small green "Test Mode: No charge will be made." note (matches the indicator in the current ERP screenshot). Do NOT submit card data anywhere. The backend currently issues a 14-day free trial via `/Tenants/register` and never sees a charge. **The user will wire a real payment gateway (likely Stripe + PayPal, possibly a Sri Lankan PSP) in a follow-up iteration** — see §10 part 3 for forward-compat notes the agent must respect.

5. **Submit** → POST to the right endpoint based on selected plan (see §5.3). On success → success screen with a button to `https://<slug>.onfixpos.com/login`.

6. **Track referrals** — if `localStorage.getItem('onfix_ref')` is set (read from `?ref=` URL param earlier), include it as `ReferredBy` in the register payload.

### 4.3 `/login` — Two-step shop finder

This is the **defining UX** the user asked for. **Do not collect username/password on this page.** Multi-shop owners reuse the same email across tenants, and tokens are origin-scoped to each subdomain anyway. So the marketing login is just a slug-finder that hands off.

Two-step UI:

**Step 1 — Enter shop ID:**
```
┌─────────────────────────────────────┐
│  [OnFix logo]                       │
│  Welcome back                       │
│  Sign in to your OnFix POS shop.    │
│                                     │
│  Shop ID                            │
│  [______________________]           │
│  Continue                           │
│                                     │
│  Don't have a shop? Start free      │
└─────────────────────────────────────┘
```

On submit:
```ts
const res = await axios.get(`${API_BASE}/api/Tenants/resolve/${encodeURIComponent(slug)}`);
// 200 → { tenantId, slug, name } → show step 2
// 404 → show "Shop not found. Check the ID and try again."
```

**Step 2 — Confirm shop, redirect:**
```
┌─────────────────────────────────────┐
│  [OnFix logo]                       │
│  Continue to <Shop Name>?           │
│  You'll log in on your shop's       │
│  secure page.                       │
│                                     │
│  [ Continue to <slug>.onfixpos.com] │
│                                     │
│  ← Use a different shop             │
└─────────────────────────────────────┘
```

Continue button:
```ts
window.location.href = `https://${slug}.onfixpos.com/#/login`;
```

That's it. The existing tenant-side `Login` component renders with the tenant's branded logo / colour (it pulls from `useShopConfig()` which works correctly on a tenant subdomain), the user enters username + password there, and gets the JWT scoped to that tenant.

> **Why two steps and not one?** (a) Same email/password can legitimately belong to a person who owns two shops; we need slug to disambiguate. (b) Step 1 can fail before the user types a password, which avoids tenant-enumeration via login error timing. (c) The credential form on the tenant subdomain renders in that tenant's brand colours for free, which is a nicer UX than a generic marketing-branded login.

### 4.4 Static / policy pages

The ERP currently renders these inside `App.js` for the platform host:

| Path | Notes |
|---|---|
| `/contact` | Form posts to `POST /api/contact` if it exists, otherwise just `mailto:` |
| `/partners` | Static partner programme info |
| `/terms-of-service` | Legal — copy from ERP, host in marketing |
| `/privacy-policy` | Legal — copy from ERP |
| `/refund-policy` | Legal — copy from ERP |
| `/acceptable-use-policy` | Legal — copy from ERP |
| `/data-processing-agreement` | Legal — copy from ERP |
| `/cookie-policy` | Legal — copy from ERP |
| `/system-requirements` | What devices/browsers OnFix runs on |
| `/help-center` | Help articles (ideally proxy or rebuild as MDX) |
| `/release-notes` | Changelog |
| `/system-status` | Either embed a status page widget or link to one |

All of these live as components in [`smart-serve/frontend/src/components/`](smart-serve/frontend/src/components/) on the ERP — port over as Next.js routes, do the router-import swap, and they're done.

### 4.5 Footer

Component: [`smart-serve/frontend/src/components/PlatformFooter.js`](smart-serve/frontend/src/components/PlatformFooter.js). Port as-is.

---

## 5. Backend endpoint reference

All endpoints are at `${API_BASE}/api/...`. None of these require authentication. Set `Content-Type: application/json` for POSTs.

### 5.1 `GET /api/platform/plans/public`

Returns the list of plans for the pricing page. Anonymous, no headers required.

**Source:** [`PlansController.cs:35-43`](smart-serve/backend/Controllers/PlansController.cs#L35-L43)

**Response:**
```ts
type Plan = {
  id: string;              // GUID
  code: string;            // "basic" | "pro" | "pro_rooms" | "enterprise"
  displayName: string;     // "Basic" | "Pro" | "Pro + Rooms" | "Enterprise"
  description: string;
  priceMonthly: number;
  price6Months: number;
  priceAnnual: number;
  price3Years: number;
  price5Years: number;
  // Enterprise-only:
  pricePerPropertyMonthly?: number;
  pricePerProperty6Months?: number;
  pricePerPropertyAnnual?: number;
  pricePerProperty3Years?: number;
  pricePerProperty5Years?: number;
  currency: string;        // "USD"
  isDefault: boolean;
  sortOrder: number;
};
type Response = Plan[];
```

### 5.2 `GET /api/Tenants/resolve/{slug}`

Validates that a shop slug exists. Used by `/login` step 1.

**Source:** [`TenantsController.cs:306-328`](smart-serve/backend/Controllers/TenantsController.cs#L306-L328)

**Response (200):**
```ts
{ tenantId: string; slug: string; name: string }
```

**Errors:**
- `400` — slug missing
- `404` — `{ message: "Tenant with slug 'foo' not found." }`

### 5.3 `POST /api/Tenants/register`

Creates a new tenant on Basic / Pro / Pro+Rooms. **Atomic** — creates Tenant + admin User + 14-day trial in one transaction.

**Source:** [`TenantsController.cs:33-134`](smart-serve/backend/Controllers/TenantsController.cs#L33-L134), DTO at [`RegisterTenantRequest.cs`](smart-serve/backend/DTOs/RegisterTenantRequest.cs)

**Request body:**
```ts
{
  ShopName: string;          // required, max 150, becomes the slug — must NOT be reserved
  AdminEmail: string;        // required, valid email
  AdminUsername: string;     // required, max 50, regex ^[a-zA-Z0-9_\.]+$
  AdminPassword: string;     // required, 8-128 chars
  PlanType: "Basic" | "Pro" | "Pro + Rooms";
  Duration: "Monthly" | "6 Months" | "Annual" | "3 Years" | "5 Years";
  BillingEmail?: string;     // optional, falls back to AdminEmail server-side
  ReferredBy?: string;       // optional, max 100, from localStorage('onfix_ref')
}
```

**Response (200):**
```ts
{
  message: "Shop created successfully!";
  shopName: string;
  slug: string;              // URL-safe slug derived from ShopName
  tenantUrl: string;         // e.g. "https://billys-burgers.onfixpos.com" — use directly
  trialEnds: string;         // ISO 8601
}
```

**Errors:**
- `400` — invalid shop name (`'<x>' is not a valid shop name (must be 3+ alphanumeric characters and not a reserved word).`), unknown plan/duration, validation errors
- `409` — `'<x>' (slug: <slug>) is already taken` OR `Username/email is already taken`

### 5.4 `POST /api/Tenants/register-enterprise`

Creates a hotel group + first property tenant. Only used when the user picks the Enterprise plan.

**Source:** [`TenantsController.cs:136-304`](smart-serve/backend/Controllers/TenantsController.cs#L136-L304), DTO at [`RegisterEnterpriseRequest.cs`](smart-serve/backend/DTOs/RegisterEnterpriseRequest.cs)

**Request body:**
```ts
{
  GroupName: string;          // required, max 150 — the hotel group name
  FirstPropertyName: string;  // required, max 150 — the first property/hotel; becomes its slug
  AdminUsername: string;      // required, max 50, regex ^[a-zA-Z0-9_\.]+$
  AdminEmail: string;         // required, valid email
  AdminPassword: string;      // required, 8-128 chars
  Duration: "Monthly" | "6 Months" | "Annual" | "3 Years" | "5 Years";
  BillingEmail?: string;      // optional
}
```

**Response (200):**
```ts
{
  message: "Enterprise group created successfully!";
  groupName: string;
  firstPropertyName: string;
  orgId: string;              // GUID of the hotel group
  tenantId: string;           // GUID of the first property
  loginUrl: string;           // e.g. "https://sunrise-flagship.onfixpos.com" — use directly
  trialEnds: string;
}
```

**Errors:** as per §5.3.

### 5.5 `GET /api/shop-config`

Optional — useful if you want to fetch a tenant's branded logo / colours for the slug-finder confirmation step. Anonymous, requires `X-Tenant-Slug: <slug>` header to scope to a specific tenant.

**Source:** [`ShopConfigController.cs:37-174`](smart-serve/backend/Controllers/ShopConfigController.cs#L37-L174)

**Response (200) — relevant fields only:**
```ts
{
  branding: {
    shopName: string;
    logoUrl?: string;
    primaryColor?: string;
    // ... more
  };
  // ...
}
```

You don't strictly need this — `GET /api/Tenants/resolve/{slug}` already returns the shop's display name. Use shop-config only if you want to render the tenant's logo on the "Continue to <shop>" confirmation screen.

---

## 6. CORS & deployment notes

- **CORS allowlist** on the backend must include `https://onfixpos.com` and `https://www.onfixpos.com` (and any preview deploy URLs). The user may need to add these — flag it during implementation. Search [`smart-serve/backend/Program.cs`](smart-serve/backend/Program.cs) for `AddCors` to find the existing allowlist.
- **Cookies / credentials**: not used. Do not set `axios.defaults.withCredentials = true` — it's irrelevant and only adds CORS headache.
- **DNS:** `onfixpos.com` (apex) and `www.onfixpos.com` should `A`/`AAAA` to the marketing host. `*.onfixpos.com` wildcard `A` continues to point at the ERP's host.
- **SSL:** Vercel handles apex + `www` automatically. The wildcard cert for `*.onfixpos.com` lives on the ERP host (already configured).
- **Apex redirect:** keep `www.onfixpos.com` redirecting to `onfixpos.com` (or vice versa, but pick one) to avoid SEO duplication.
- **`robots.txt` and `sitemap.xml`**: marketing should serve both. The ERP and tenant subdomains should `Disallow: /` to keep them out of search results.

---

## 7. Visual / brand reference

- Primary brand colour: `#3b82f6` (blue). Pro plan accent: same blue. Pro+Rooms accent: `#9333ea` (purple). Enterprise accent: `#4f46e5` (indigo).
- Logo files: copy from `smart-serve/frontend/public/images/branding/` on the ERP. The orange hexagon mark is the favicon/header logo; the wordmark version is `onfix-full-logo.png`.
- Hero copy: `Run your restaurant like a pro.` — "like a pro." is gradient `from-blue-600 to-purple-600`.
- Sub-hero: `The all-in-one platform for modern dining. Manage orders, inventory, and staff with a POS designed for speed and simplicity.`
- Trust badges below the hero CTA: `No credit card required` / `14-day free trial`.
- Animated accent: small ping dot + `New Generation POS` badge above the hero h1.
- Dark mode: full support. Use Tailwind `dark:` variants throughout. Header & sections have `bg-white dark:bg-black`.

---

## 7b. Keeping marketing in sync with future ERP pricing changes

The user has flagged that they will keep tweaking the ERP's pricing page over time. Because the spec calls for **copying** the JSX (not sharing a component), there are two categories of change with very different sync behaviour. The agent must understand both and document them in the marketing repo's `README.md`.

### What auto-syncs (no marketing change needed)

Anything driven by data the marketing site fetches live from the backend:

- **Plan prices** (`priceMonthly`, `price6Months`, `priceAnnual`, `price3Years`, `price5Years`, and the `pricePerProperty*` fields). Edited via the SuperAdmin panel → `PUT /api/platform/plans/{code}` → next `GET /api/platform/plans/public` reflects it. Marketing shows the new number on the user's next page load.
- **Plan display name and description** — same path, same auto-sync.
- **Adding a brand-new plan to the database** with code `basic` / `pro` / `pro_rooms` / `enterprise` — marketing will automatically pick up changed prices/copy. (See "Doesn't auto-sync" below for the case where the *new plan code* is something the marketing UI doesn't know about.)
- **Currency** (the `currency` field on `Plan`) — display layer reads it.

### What does NOT auto-sync (marketing must be updated separately)

Anything that lives in the JSX or component logic:

- **Visual tweaks** — adding a feature bullet to the Basic plan tile, changing a badge colour, restyling a button, swapping an icon, reordering tiles.
- **Form field changes** — adding a new required input, changing a validation rule, removing a field. (If you add a new field to the ERP form *and* the registration backend, marketing won't include it until the JSX is updated to send it.)
- **New plan codes the UI doesn't know about** — if the ERP introduces a `pro_chains` or `starter` plan via the API, marketing's hardcoded four-tile layout (Basic / Pro / Pro+Rooms / Enterprise) won't render it. Either: extend the marketing tile list, or — better — refactor PricingPage to map over the API response generically (see "Future-proofing" below).
- **Term selector options** — marketing hardcodes `['Monthly', '6 Months', 'Annual', '3 Years', '5 Years']`. If the ERP starts offering a `2 Years` term, marketing won't expose it.
- **Hardcoded feature bullets** — both ERP and marketing PricingPage list features as JSX strings ("POS & Orders", "Kitchen Display System", "Waiter Calling System", etc.). These are NOT in the database. Changing them in one place doesn't change the other.
- **Hero copy, FAQ blocks, testimonials, plan-card footnotes, success-screen copy.**

### Recommended workflow for the user

1. **For price changes** — just edit in the SuperAdmin panel. Marketing reflects automatically. No code change.
2. **For UI / copy / feature-bullet changes** — make the change in the ERP's [`PricingPage.js`](smart-serve/frontend/src/components/PricingPage.js), then mirror the same edit in the marketing repo's pricing page within the same commit cycle. The marketing repo's `README.md` should include a "Mirror checklist" section listing the files that need cross-repo edits.
3. **For new plan codes** — add to backend, then update both ERP `PricingPage.js` and marketing pricing page to render the new tile. Consider this the trigger to do the future-proofing below.

### Future-proofing (recommended, optional)

If pricing-page churn becomes painful, the cleanest fix is to push the static parts of the UI into the API. Add fields like `Plan.featuresShown[]` (array of bullet labels) and `Plan.tagline` to the backend, render generically on both clients. Then editing a feature bullet becomes a SuperAdmin action, not a code deploy on two repos.

For now, with "minor changes" expected, manual mirroring is fine — but the agent should structure the marketing PricingPage so that **plan tiles are rendered in a `.map()` over the API response, not as four hardcoded JSX blocks**. The current ERP code has them mostly hardcoded; the marketing port is a chance to fix that. This way, adding a new plan in the future requires zero marketing-side JSX changes for everything except the plan-specific feature bullets (which themselves should ideally come from the API).

---

## 8. After cutover — cleanup on the ERP side (NOT marketing's job; document for the user)

Once marketing is live and `onfixpos.com` resolves to it, the following ERP code becomes dead and the user (or a separate task) should remove it:

- The `isPlatform` branch at [`smart-serve/frontend/src/App.js:564-599`](smart-serve/frontend/src/App.js#L564-L599) and the `LandingPage`, `PricingPage` (the marketing-style one), `Partners`, all `*Policy`, `SystemRequirements`, `HelpCenter`, `ReleaseNotes`, `SystemStatus`, `Contact`, `PlatformFooter` components.
- The legacy-tenant fallback for anonymous shop-config queries at [`smart-serve/backend/Services/Tenancy/TenantResolutionService.cs:123-128`](smart-serve/backend/Services/Tenancy/TenantResolutionService.cs#L123-L128) — once the apex never hits the API, this is no longer needed.
- The in-tenant `/#/pricing` route on `<slug>.onfixpos.com` should still exist, but its purpose changes from "create new account" to "upgrade existing plan." Replace its `Create Account` form with a plan-switch form that calls `POST /api/Subscriptions/simulate-payment` (already implemented) for the logged-in tenant.

---

## 9. Implementation prompt — give this to the building agent

> You are building the OnFix POS marketing site at `onfixpos.com`, a separate Next.js 15 app deployed independently from the existing OnFix POS ERP. **Read this entire spec document before writing any code.** The ERP backend at `api.onfixpos.com` is already complete; do not modify it — your only output is the marketing site.
>
> **Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS (dark mode `class`), lucide-react, framer-motion, axios. Deploy target: Vercel.
>
> **Pages to build (priority order):**
> 1. `/` — Landing page. Port the JSX from [`smart-serve/frontend/src/components/LandingPage.js`](smart-serve/frontend/src/components/LandingPage.js) on the ERP repo, but: (a) replace `react-router-dom` with `next/link` and `next/navigation`, (b) replace `react-helmet` with `export const metadata`, (c) replace `useShopConfig()` with hardcoded brand defaults (logo `/images/branding/onfix-full-logo.png`, shopName `OnFix POS`), (d) keep `framer-motion` and `lucide-react` usage exactly as is. Copy hero/feature images from the ERP's `public/images/` into the marketing repo's `public/images/`.
> 2. `/login` — Two-step shop finder. Step 1: `Shop ID` text input. On submit, call `GET ${API_BASE}/api/Tenants/resolve/{slug}`. On 200, show step 2 with `Continue to <name>` button that does `window.location.href = "https://<slug>.onfixpos.com/#/login"`. On 404, show inline error `Shop not found. Check the ID and try again.` Add a `Don't have a shop? Start free →` link to `/pricing`. **Do NOT collect username or password on this page.**
> 3. `/pricing` — Pricing & signup. Port [`smart-serve/frontend/src/components/PricingPage.js`](smart-serve/frontend/src/components/PricingPage.js). On mount, fetch `GET ${API_BASE}/api/platform/plans/public` **live** (client-side `useEffect`, or SSR with `cache: 'no-store'`, or ISR `revalidate: 60` — never SSG, see §2 "Pricing sync"). Render four plan tiles (Basic, Pro, Pro+Rooms, Enterprise) — render them via `.map()` over the API response, NOT as four hardcoded JSX blocks (see §7b for why) — plus a term toggle (Monthly / 6 Months / Annual / 3 Years / 5 Years). Enterprise has a property-count stepper. **Build the payment block as an isolated `<PaymentSection mode="placeholder" />` component** — card / MM-YY / CVC inputs, "Test Mode: No charge will be made" indicator, agree-to-ToS checkbox, "Start 14-Day Free Trial" button — exactly mirroring the current ERP screenshot (see §10.3). Do NOT submit card data; it stays purely visual. On form submit: if Enterprise, POST to `/api/Tenants/register-enterprise` with `{GroupName, FirstPropertyName, AdminUsername, AdminEmail, AdminPassword, Duration, BillingEmail}`; otherwise POST to `/api/Tenants/register` with `{ShopName, AdminUsername, AdminEmail, AdminPassword, PlanType, Duration, BillingEmail, ReferredBy}`. **Wrap the submit handler so the PSP integration point is a single replaceable function:** `const paymentResult = await getPaymentToken(); /* placeholder returns { ok: true, token: null } */ — then call `/Tenants/register` with the form data`. On success, show a success card with the returned `tenantUrl` (or `loginUrl`) and a button `Go to Dashboard` that navigates to `${tenantUrl}/login`. Surface 4xx error messages inline (especially the `409 — slug already taken` case).
> 4. `/contact` and the legal/policy pages — port from ERP, swap routers, done.
>
> **Auth:** there is none on the marketing site. The site never logs anyone in directly. Login is "find your shop, then redirect to its subdomain"; signup creates a tenant via the API and redirects to `<new-slug>.onfixpos.com/login`. Tokens never touch the marketing origin.
>
> **API base URL:** read from `process.env.NEXT_PUBLIC_API_BASE` (default `https://api.onfixpos.com`). Confirm the actual backend URL with the user before deploying — it may currently be served from a Railway domain rather than `api.onfixpos.com`.
>
> **CORS:** the user must add `https://onfixpos.com`, `https://www.onfixpos.com`, and Vercel preview URLs to the backend CORS allowlist (in [`smart-serve/backend/Program.cs`](smart-serve/backend/Program.cs)) before the marketing site can hit the API. Flag this in your handoff.
>
> **Brand details:** primary `#3b82f6` blue, Pro+Rooms purple `#9333ea`, Enterprise indigo `#4f46e5`. Hero copy: `Run your restaurant like a pro.` ("like a pro." in `from-blue-600 to-purple-600` gradient). Trust badges: `No credit card required` / `14-day free trial`. Full dark-mode support via Tailwind `dark:` variants.
>
> **Out of scope for this iteration:**
> - Real payment integration. The pricing page collects card UI for visual completeness only — see §10.3 for the three forward-compat rules (isolated `<PaymentSection>` component, no card data in form state, replaceable `getPaymentToken()` seam). The user is planning to wire Stripe + likely PayPal in a follow-up; ask which provider(s) and in what configuration (separate buttons vs tabbed selector) before adding any real charge logic.
> - Modifying anything in the ERP repo. If something on the ERP needs to change (e.g. adding a CORS origin), surface it in your handoff but don't attempt the change yourself.
> - Building any logged-in pages. Marketing is fully anonymous.
>
> **Sync with future ERP changes:** read §7b. Plan prices auto-sync via the API. Anything else (visual tweaks, feature bullets, new fields) requires a manual mirror of the change in this repo. Add a "Mirror checklist" section to your README listing the files involved so the user can keep both repos aligned.
>
> **Verification:**
> - Build and run locally; visit `/`, `/pricing`, `/login`, `/contact`. Check dark/light mode.
> - Test `/login` step 1 with a known-good slug (`legacy` or `pro`) — should resolve and show step 2 with the right shop name.
> - Test `/login` step 1 with garbage like `nonexistent-shop-xyz` — should show the not-found message.
> - Test `/pricing` Basic-plan signup with a fresh shop name — should succeed and return a valid `tenantUrl`. Visit it and confirm the new tenant exists.
> - Run `npm run build` and confirm zero type errors.

---

## 10. Open questions for the user (please confirm before this spec is final)

1. **Marketing host.** **Decided: deferred — agent should default to Vercel for local dev, but the README must document both Vercel and self-host paths.** Marketing is confirmed to live on a different server from the ERP regardless of which one the user picks.
2. **API base URL.** Is the backend currently exposed at `api.onfixpos.com`, or somewhere else (e.g. Railway internal URL)? The marketing build needs `NEXT_PUBLIC_API_BASE` configured correctly.
3. **Payment provider.** **Decided: visual placeholder for now, real PSP wired later.** The pricing page collects card UI mirroring the current ERP screenshot (card number / MM-YY / CVC + a green "Test Mode: No charge will be made" indicator + agree-to-ToS checkbox + "Start 14-Day Free Trial" submit). The backend issues the trial via `/Tenants/register` regardless. **The user has flagged that a real PSP — likely Stripe and/or PayPal, possibly a Sri Lankan provider — is coming in a follow-up iteration.** To keep that change small, the agent must respect three forward-compat rules:
   - **Isolate the payment block.** Build it as its own component (`<PaymentSection mode="placeholder" />`) so it can later be swapped for `<PaymentSection mode="stripe" />`, `<PaymentSection mode="paypal" />`, or a tabbed selector — without touching the rest of the form. Don't entangle card-input state with form state; keep them separate.
   - **Don't put real card data in your form state, ever.** Even in placeholder mode, treat the card fields as un-submitted — they exist for visual completeness only. When real PSPs land, Stripe Elements / PayPal Smart Buttons will own that state in iframes / SDK contexts and you must not duplicate it. Building a placeholder that holds raw PAN in `useState` would create a habit that becomes a PCI violation the moment real charges are wired.
   - **Submit flow must already split "create account" from "charge".** The current placeholder posts only to `/Tenants/register` — a single round-trip. When PSPs are wired, the flow becomes: PSP confirms payment intent → client gets a token → client posts `{ ...registerFields, paymentToken }` to a new backend endpoint that creates the tenant only after payment succeeds. Structure your `handleSubmit` so adding that pre-step is local, not a rewrite. (Concretely: have `handleSubmit` await a `paymentResult = await getPaymentToken()` function that currently returns `{ ok: true, token: null }` immediately. Future PSP wiring replaces only that function.)
4. **Apex vs www.** Should `www.onfixpos.com` redirect to `onfixpos.com` or the other way round?
5. **Existing landing-page assets.** **Decided: copy and adapt.** The agent should literally copy [`LandingPage.js`](smart-serve/frontend/src/components/LandingPage.js) and [`PricingPage.js`](smart-serve/frontend/src/components/PricingPage.js) JSX into the marketing repo, then: (a) replace `react-router-dom` imports with `next/link` + `next/navigation`; (b) replace `react-helmet` with Next.js `metadata` exports; (c) replace `useShopConfig()` calls in `LandingPage` with hardcoded brand defaults (apex has no tenant context); (d) retype as `.tsx` with explicit prop types; (e) keep `framer-motion`, `lucide-react`, and Tailwind class strings exactly as they are. Do not rewrite from scratch — the existing JSX matches the user's screenshots and is production-quality.
