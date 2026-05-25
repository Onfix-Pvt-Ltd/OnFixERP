# OnFix POS — marketing site

Next.js 16 + TypeScript + Tailwind CSS marketing site for [OnFix POS](https://onfixpos.com), the multi-tenant hospitality ERP.

This site is a **read-and-handoff** layer:
- It reads pricing from the ERP backend live (`GET /api/platform/plans/public`).
- It creates new tenants via `POST /api/Tenants/register` (and `register-enterprise`).
- It hands users off to their tenant subdomain (`<slug>.onfixpos.com`) for login — it never authenticates anyone itself.

## Spec documents

Read these before touching anything pricing/login/tenants-related:

- **`../MARKETING_SITE_SPEC.md`** — overall architecture, ERP API contract, deployment notes.
- **`../MARKETING_PRICING_SIGNUP_PROMPT.md`** — `/pricing` flow, payment-placeholder rules, brand specifics.
- **`../ERP_TEAM_HANDOFF.md`** — what the ERP backend team needs to do (CORS, DNS, plan data sanity).

## Getting started

```bash
cp .env.example .env.local
# edit .env.local — at minimum, set NEXT_PUBLIC_ERP_API_BASE
npm install
npm run dev
```

Local dev runs on `http://localhost:3000`. The ERP team must add this origin (and Vercel preview URLs) to the ERP's CORS allowlist before browser → ERP API calls work — see `ERP_TEAM_HANDOFF.md`.

## Architecture

```
onfixpos.com (this site, Vercel)
  ├── /                   custom landing (orange brand)
  ├── /pricing            live ERP plans + inline tenant signup
  ├── /login              two-step shop finder → redirect
  ├── /contact            form → /api/contact (Resend or logged)
  ├── /reviews            CMS-backed (Phase 3)
  ├── /media              CMS-backed (Phase 3)
  ├── /guides             CMS-backed (Phase 3)
  ├── /partners           CMS-backed (Phase 3)
  ├── /about              CMS-backed (Phase 2)
  ├── /system             CMS-backed (Phase 3)
  └── /admin              Payload CMS (Phase 2)
            │
            ▼
   ERP backend (Hetzner)
     api.onfixpos.com (target) / onfixpos.com/api (current)
       ├── /api/platform/plans/public          live pricing
       ├── /api/Tenants/resolve/{slug}         /login step 1
       ├── /api/Tenants/register               /pricing signup
       └── /api/Tenants/register-enterprise    /pricing signup (Enterprise)
```

## Mirror checklist — keeping in sync with the ERP

The ERP repo (`smart-serve`) and this repo share the **plans API** but have separate JSX. When something changes, here's what auto-syncs vs. what you must edit by hand.

### Auto-syncs (no code change needed)

These live in the `Plans` table and are edited via the ERP's SuperAdmin panel. The marketing site picks them up live:

- Plan price (`priceMonthly`, `price6Months`, `priceAnnual`, `price3Years`, `price5Years`)
- Plan display name (`displayName`)
- Plan tagline (`description`)
- Per-property prices for Enterprise (`pricePerProperty*`)
- Currency
- Plan ordering (`sortOrder`)

### Must mirror manually (cross-repo edits)

When changing any of these in the ERP, also update them here:

| What | File in this repo |
|------|------|
| Feature bullets per plan tile | `src/components/pricing/PricingClient.tsx` → `PLAN_PRESENTATION` map |
| FAQ questions/answers on /pricing | `src/components/pricing/PricingClient.tsx` → `FAQS` array |
| Term selector options | `src/lib/erpApi.ts` → `ALL_TERMS` (also affects backend `Duration` validation) |
| Signup form fields / validation | `src/components/pricing/SignupForm.tsx` |
| Success-state copy | `src/components/pricing/SignupForm.tsx` (success branch) |
| Nav links | `src/components/shared/Navbar.tsx` |
| Legal pages | `src/app/(frontend)/{terms-of-service,privacy-policy,refund-policy,acceptable-use-policy,data-processing-agreement,cookie-policy}/page.tsx` |
| New plan code (e.g. `pro_chains`) | Add bullets + icon to `PLAN_PRESENTATION` map. Tile renders automatically since it's a `.map()` over the API. |

> Hero/footer/about copy and the ROI multipliers are **no longer manual edits** — they're CMS-backed (see below).

### Forbidden

- **Don't** SSG plan data. `revalidate: 60` is the cap.
- **Don't** put real card data (`PAN`, CVC, expiry) in any React state — even in placeholder mode. See `MARKETING_PRICING_SIGNUP_PROMPT.md` §10.3.
- **Don't** authenticate against the apex. JWT lives in `localStorage` per tenant subdomain.

## CMS content model (editable in `/admin`)

Marketing content is served by an embedded Payload CMS. All reads go through
`src/lib/cms.ts`, which maps Payload docs to plain view-models and **falls back to
hardcoded defaults when a collection/global is empty** — so pages never go blank
before content is entered. Icons can't be stored in the DB: collections store a
string key (e.g. `"Hotel"`) that each page maps to a lucide component.

**Collections** (`src/payload/collections/`, admin group "Content"):

| Collection | Powers | Notes |
|------------|--------|-------|
| `reviews` | `/reviews` carousel + modal | `photo` (R2 upload) or `imageUrl` fallback |
| `partners` | `/partners` grid | `icon` key or uploaded `logo` |
| `press-kit` | `/media` download cards | `file` upload (PDF/ZIP/image) |
| `guides` | `/guides` + `/guides/[slug]` | `body` is Lexical rich text; `category` select; `popular` flag |
| `system-modules` | `/system` scrollytelling | `benefits` array + `workflow` |

**Globals** (`src/payload/globals/`):

| Global | Powers |
|--------|--------|
| `site-settings` | Footer tagline, social links, contact details, copyright name |
| `home-content` | Home hero copy, final CTA, **ROI calculator defaults + uplift multipliers** |
| `about-content` | `/about` hero, origin story, "Our DNA" values |

Editing a row/global in `/admin` overrides the fallback live (ISR `revalidate: 60`).
Design-coupled bits remain in code: the home logo marquee, `TrustBanner` badges,
`EcosystemNavigator` previews, and the `/system` feature grid.

## Deployment

Vercel by default. DNS:

- `onfixpos.com` (apex) → Vercel
- `www.onfixpos.com` → Vercel (or 301 to apex)
- `api.onfixpos.com` → ERP host (new subdomain, see `ERP_TEAM_HANDOFF.md`)
- `*.onfixpos.com` → ERP host (existing wildcard, unchanged)

CORS allowlist on the ERP backend must include the marketing origin and preview deploy URLs.

## Roadmap

- **Phase 1** ✅ — `/pricing` (live ERP plans + signup), `/login` (slug finder), `/contact` (working form), legal pages, navbar/footer wiring.
- **Phase 2** ✅ — Payload CMS at `/admin` with SQLite + R2 uploads. `/about`, home hero/CTA copy, ROI calculator multipliers, and footer/site settings are CMS-backed via globals (`site-settings`, `home-content`, `about-content`).
- **Phase 3** ✅ — `/reviews`, `/media`, `/guides` (+ `/guides/[slug]`), `/partners`, and the `/system` scrollytelling modules are CMS-backed (collections: Reviews, PressKit, Guides, Partners, SystemModules). Each page reads via `src/lib/cms.ts` and falls back to hardcoded defaults when its collection is empty, so the site never goes blank before content is entered.
- **Phase 4** — SEO `generateMetadata` per page, `robots.txt`, `sitemap.xml`, analytics, Lighthouse pass.

See `../MARKETING_SITE_SPEC.md` for full context.
