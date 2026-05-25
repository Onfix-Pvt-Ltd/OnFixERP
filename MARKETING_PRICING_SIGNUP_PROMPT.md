# Prompt for the OnFix marketing-site agent — `/pricing` shop creation flow

> Hand this entire document to the agent working on `https://github.com/Onfix-Pvt-Ltd/OnFixERP.git` (the OnFix marketing site, the one with the orange brand and pages at `/`, `/system`, `/pricing`, `/reviews`, `/partners`, `/about`, `/contact`, `/media`, `/guides`, `/book-demo`). Do NOT touch the OnFix POS ERP repo (a separate codebase) — your changes are scoped to this marketing repo only.

---

> ## ✅ As-built status — 2026-05-24
>
> This `/pricing` flow is **implemented** (Phase 1) per this brief, which remains accurate. Notes for a reader today:
>
> - **Built files:** `src/components/pricing/{PricingClient,SignupForm,PaymentSection}.tsx` and `src/lib/erpApi.ts` (typed ERP client). Plan tiles `.map()` over the live API; `<PaymentSection mode="placeholder" />`; the two-phase `handleRegister` + replaceable `getPaymentToken()` seam are in place per the forward-compat rules below.
> - **API base:** read from **`NEXT_PUBLIC_ERP_API_BASE`** (default `https://api.onfixpos.com`). `api.onfixpos.com` is **live** (ERP v1.2.0, 2026-05-25) and the integration is **verified** — pricing fetch + slug resolve work against prod. See `onfix-web/DEPLOYMENT.md`.
> - **Brand:** orange-only, Professional tile highlighted — confirmed as-built.
> - **`/book-demo`** (referenced in the intro above) was **not built** — demo/CTA links point to **`/contact`**.
> - **Mirror checklist** now lives in `onfix-web/README.md`.

---

## What the user wants

The current `/pricing` page on the marketing site renders four plan tiles (Starter / Professional / Pro + Rooms / Enterprise) with placeholder prices, and the per-tile CTAs ("Start Free Trial" / "Contact Sales") currently lead nowhere. **Two changes:**

1. **Wire the prices to the live ERP backend.** Plan prices and display names must come from `GET https://api.onfixpos.com/api/platform/plans/public`. The placeholder values (`$49`, `$99`, `$179`) must go away — the user changes prices via a SuperAdmin panel on the ERP, and that change must show up on the marketing site within seconds.
2. **Make every "Start Free Trial" / "Contact Sales" CTA actually create a shop.** The user already has a working shop-creation flow in the ERP today and they like its UX (form on the right side of the pricing page, single-step register, success state with link to the new shop subdomain). Replicate that flow on the marketing site, but in the marketing site's existing orange/black/white brand — do NOT introduce blue/purple/indigo accents.

The form does not collect a real payment yet. The ERP backend issues a 14-day free trial via the same anonymous endpoint regardless. Card fields shown on the page are visual-only (placeholders). The user is wiring Stripe + likely PayPal in a follow-up; structure your code so that swap is easy (see "Forward-compat" below).

## How the existing OnFix POS ERP does it (reference, do not copy verbatim)

The ERP repo has a `PricingPage.js` that already implements this entire flow. It's blue/purple/indigo (their old palette — being deprecated), so you cannot copy its visuals. But the **logic** is what you want, and you should mirror it. The relevant pieces:

- `useState` for `selectedPlan` (one of `'Starter' | 'Professional' | 'Pro + Rooms' | 'Enterprise'`)
- `useState` for `term` (one of `'Monthly' | '6 Months' | 'Annual' | '3 Years' | '5 Years'`)
- `useState` for `propertyCount` (Enterprise only, integer ≥ 1)
- `useState` for `formData` (`shopName`, `groupName`, `adminUsername`, `adminEmail`, `password`, `billingEmail`)
- `useState` for `loading`, `error`, `successData`, `agreedToTerms`
- `useEffect` on mount: `axios.get('/api/platform/plans/public')` → setPlans
- A `getPlan(key)` helper that resolves a plan from the array by code first, then by displayName, then by normalized name (`'Pro + Rooms'` → `'pro_rooms'`)
- A `getPrice(key)` helper that returns the current term's price
- A `getEnterpriseTotal()` helper: `enterpriseBase + (propertyCount - 1) * pricePerProperty`
- A `handleRegister(e)` handler: validates, sets `loading`, posts to the right endpoint, handles success/error, sets `successData`

Use this as your blueprint. Re-implement in your own components, in TypeScript, with your existing orange brand.

## API contract — exactly what to call

### 1. Fetch plans on `/pricing` mount

```ts
GET https://api.onfixpos.com/api/platform/plans/public

Response:
type Plan = {
  id: string;              // GUID (stable, treat as opaque)
  code: 'basic' | 'pro' | 'pro_rooms' | 'enterprise';   // STABLE — use for logic
  displayName: string;     // EDITABLE — what to render. Currently: 'Starter' | 'Professional' | 'Pro + Rooms' | 'Enterprise'
  description: string;     // EDITABLE — short tagline under each plan name
  priceMonthly: number;
  price6Months: number;
  priceAnnual: number;
  priceXNumberOfYears: number; // 3 and 5
  pricePerPropertyMonthly?: number; // Enterprise only
  pricePerProperty6Months?: number;
  pricePerPropertyAnnual?: number;
  pricePerProperty3Years?: number;
  pricePerProperty5Years?: number;
  currency: string;        // 'USD' for now
  isDefault: boolean;
  sortOrder: number;       // Render plans ordered by this
};
type Response = Plan[];
```

**Important:** fetch this **live** every page load (or with `revalidate: 60` if you want ISR). DO NOT static-render plan data into the build artifact — the user will change prices via the SuperAdmin panel and expect it to reflect within a minute. Match by `code` in your logic (it's stable); use `displayName` and `description` for what to render. If a future SuperAdmin renames "Starter" to "Solo", the `code` stays `basic` and your form keeps working.

Don't hardcode "Starter / Professional / Pro + Rooms / Enterprise" anywhere except as fallback text if the API is unreachable. The whole point is that the user can rename a plan in the admin panel and your tiles update on the next page load.

### 2. Submit signup — Starter / Professional / Pro + Rooms

```ts
POST https://api.onfixpos.com/api/Tenants/register

Request body (all required unless marked):
{
  ShopName: string;          // max 150, becomes the slug — reserved-word check is server-side
  AdminUsername: string;     // max 50, regex ^[a-zA-Z0-9_\.]+$
  AdminEmail: string;        // valid email
  AdminPassword: string;     // 8-128 chars
  PlanType: string;          // send the displayName the user picked: 'Starter' | 'Professional' | 'Pro + Rooms'
                             // The backend accepts both new names and legacy ('Basic' | 'Pro') for transition.
  Duration: string;          // 'Monthly' | '6 Months' | 'Annual' | '3 Years' | '5 Years'
  BillingEmail?: string;     // optional, defaults to AdminEmail server-side
  ReferredBy?: string;       // optional, max 100 — read from localStorage('onfix_ref') if present
}

Success response (HTTP 200):
{
  message: 'Shop created successfully!';
  shopName: string;
  slug: string;              // URL-safe slug derived from ShopName by the backend
  tenantUrl: string;         // e.g. 'https://billys-burgers.onfixpos.com' — use directly, do NOT construct
  trialEnds: string;         // ISO 8601, 14 days from creation
}

Error responses:
- 400 — { message: "'<x>' is not a valid shop name (must be 3+ alphanumeric characters and not a reserved word)." }
- 400 — { message: "Unknown PlanType '<x>'." }
- 400 — { message: "Duration must be one of: Monthly, 6 Months, ..." }
- 409 — { message: "The shop name '<x>' (slug: <y>) is already taken." }
- 409 — { message: "Username/email is already taken." }
```

### 3. Submit signup — Enterprise

```ts
POST https://api.onfixpos.com/api/Tenants/register-enterprise

Request body:
{
  GroupName: string;          // max 150, the hotel group name
  FirstPropertyName: string;  // max 150, the first hotel/property; becomes its slug
  AdminUsername: string;      // max 50, same regex
  AdminEmail: string;
  AdminPassword: string;      // 8-128 chars
  Duration: string;           // same intervals as above
  BillingEmail?: string;
}

Success response (HTTP 200):
{
  message: 'Enterprise group created successfully!';
  groupName: string;
  firstPropertyName: string;
  orgId: string;              // GUID of the hotel group
  tenantId: string;           // GUID of the first property
  loginUrl: string;           // e.g. 'https://sunrise-flagship.onfixpos.com' — use directly
  trialEnds: string;
}
```

The Enterprise total to charge is computed client-side: `enterpriseBase + (propertyCount - 1) * pricePerProperty`. The backend doesn't currently take a `PropertyCount` field — additional properties beyond the first are added later via the in-tenant Enterprise dashboard. Render the property selector + price math for transparency, but don't expect the API to validate the count.

## Visual / UX requirements — orange brand only

This site already has a coherent visual language in the screenshots the user shared: orange (`#f97316`, Tailwind `orange-500`) as the only accent, black for primary CTAs and headings, white for surfaces, soft gray for borders/dividers. **Stick to it.** Specifically:

- **Three of the four tiles are NEUTRAL.** White card, gray border, black price text, black "Start Free Trial" / "Contact Sales" button. The Starter / Pro + Rooms / Enterprise tiles all look the same visually — only their copy differs.
- **One tile is ORANGE-HIGHLIGHTED — the Professional tile.** Filled `orange-500` (or `bg-orange-500/10` with orange border, your call) with `MOST POPULAR` badge in white-on-orange, orange price text, and an orange "Start Free Trial" button. Match the Most Popular treatment in the screenshot.
- **Feature checkmarks**: green (`emerald-500`) is fine — the existing screenshot uses green checks. Don't make checks orange; reserve orange for the "popular" emphasis.
- **Form**: place it as a sticky card on the right side of the pricing area at desktop widths, or as a modal that slides in when a plan's "Start Free Trial" button is clicked at mobile widths. Either approach is acceptable; pick whichever fits your existing marketing layout. The ERP places it as a sticky card; it works.
- **Form inputs**: gray border, black focus ring (`focus:ring-black`). NOT orange focus rings — orange is the brand accent, not the form chrome. The submit button should be orange when Professional is selected, black for everything else.
- **Test Mode banner under the card form**: "🛡 Test Mode: No charge will be made." in `text-emerald-600` (matches the existing payment-placeholder convention).
- **Success state**: full-screen overlay or dedicated success route showing the new shop URL + a primary button to navigate there. The success-card top section can be `bg-orange-500` with a white check icon inside a white circle. The "Go to Dashboard" button on the success card should be black-on-white (matches the marketing brand's primary CTA).
- **Term selector** (`Monthly / 6 Months / Annual / 3 Years / 5 Years`): pill toggle group at the top of the plan grid. The selected term has a white pill with subtle shadow on a gray background — same pattern the ERP uses, neutral colours, no orange.
- **Property stepper for Enterprise**: `–` and `+` buttons can be filled orange (this is an interactive element, brand-accent qualifies). The stepper background can be `bg-orange-50/30` for subtle visual grouping.

## Forward-compat constraints (lock these in now so future PSP wiring is one file change, not a rewrite)

1. **Isolate the payment block as its own component** — `<PaymentSection mode="placeholder" />`. When Stripe lands, you swap to `<PaymentSection mode="stripe" />` (or render multiple in a tabbed selector). The rest of the form must NOT change.
2. **Never hold real card data in form state.** Even in placeholder mode, treat the card-number / MM-YY / CVC fields as inert — `disabled` inputs with placeholder text are fine. When real PSPs land, Stripe Elements / PayPal Smart Buttons own those values inside iframes / SDK contexts. Building a placeholder that holds raw PAN in `useState` would set up a habit that becomes a PCI violation the moment real charges are wired.
3. **Split your submit handler into two phases now, even though phase 1 is a no-op today:**

   ```ts
   async function handleRegister(e) {
     e.preventDefault();
     setLoading(true);
     try {
       // Phase 1 — payment. Currently a no-op; future PSPs replace ONLY this function.
       const payment = await getPaymentToken();
       if (!payment.ok) {
         setError(payment.error);
         return;
       }

       // Phase 2 — create the tenant. Stable; no PSP changes touch this.
       const res = await axios.post(API_URL, { ...payload, paymentToken: payment.token ?? null });
       setSuccessData(res.data);
     } catch (err) {
       setError(err.response?.data?.message ?? 'Registration failed.');
     } finally {
       setLoading(false);
     }
   }

   // Replace this function when wiring Stripe / PayPal. Keep the same return shape.
   async function getPaymentToken(): Promise<{ ok: true; token: string | null } | { ok: false; error: string }> {
     return { ok: true, token: null };
   }
   ```

   When Stripe lands, only `getPaymentToken()` becomes a real call — `handleRegister` and the `axios.post` body stay the same.

## Success state — what to do after `POST /Tenants/register` returns 200

Don't try to log the user in on the marketing site. Tokens are origin-scoped to each tenant subdomain, and the marketing origin can't mint a useful one. Instead, show a success card with:

- "Setup Complete!" headline (or "Enterprise Group Created!" for Enterprise)
- The new shop's display name from `successData.shopName` / `successData.groupName`
- A copyable "Your Shop URL" block showing `successData.tenantUrl` (or `successData.loginUrl` for Enterprise)
- A primary "Go to Dashboard" button: `<a href={`${successData.tenantUrl}/login`}>` — this navigates the browser to the tenant subdomain where the existing ERP login page handles the credential entry. The user signs in there and lands in their new shop. Don't try to pre-fill any auth context across origins.
- Trial ends date: `new Date(successData.trialEnds).toLocaleDateString()`

## Errors — surface them inline

Map common 4xx errors to friendly inline messages above the submit button. The most common case is a slug collision — surface the backend's `409` message verbatim ("The shop name 'X' (slug: Y) is already taken."). Don't suppress it; users need to know to pick a different name. Same for invalid email, weak password, duplicate username — the backend's messages are already user-friendly.

## What NOT to do

- Don't create a marketing-side database for plans or pricing. The ERP is the single source of truth. Any caching layer you add (Redis, ISR) must invalidate within a minute; better to fetch live each time.
- Don't try to replicate the ERP's `PricingPage.js` styling — its blue/purple/indigo per-plan colours are deprecated. Use ONLY your marketing repo's existing orange/black/white brand.
- Don't add a "Sign in" tab to the form. Login is a separate page (`/login`, two-step shop finder per the main MARKETING_SITE_SPEC.md). The pricing page is exclusively for new shop creation.
- Don't build a "logged-in pricing page" view. If a user navigates to `/pricing` while authenticated against a tenant elsewhere, the marketing site doesn't know about it (no shared cookie). Render the same anonymous flow regardless. The "upgrade existing plan" flow lives inside each tenant's ERP at `<slug>.onfixpos.com/#/pricing` — a different page entirely.
- Don't change the four tile names from the API response. If the user later renames a plan via SuperAdmin, your tiles must follow. Hardcoding "Starter" / "Professional" defeats the auto-sync goal.
- Don't fetch the plans through your marketing backend as a proxy. Call the ERP API directly from the browser — it's anonymous, it's CORS-allowed (the ERP team will add `https://onfixpos.com` to the CORS allowlist if not already there; ping if you get blocked), and adding a proxy layer is two more places that can desync.

## Testing checklist (run before declaring done)

1. Open `/pricing`. The four tiles render with **live prices from the API**, not placeholder values. Ranking matches `sortOrder`.
2. Toggle Monthly → Annual. Prices change. (Confirm with backend team that all 5 intervals have prices populated; some may be 0 currently.)
3. Click each plan tile. The form's submit button copy / colour changes to reflect the selected plan.
4. With Professional selected, fill the form with a fresh shop name, valid email, password ≥ 8 chars, agree to terms. Submit. Expect success card with a `tenantUrl` like `https://<your-shop>.onfixpos.com`. Click "Go to Dashboard" — should navigate to the tenant subdomain's login page (which is the ERP's existing branded login).
5. Repeat with the same shop name. Expect inline error: "The shop name 'X' (slug: Y) is already taken."
6. Repeat with an invalid shop name (e.g. "ab" — too short, or "api" — reserved). Expect the backend's validation error inline.
7. Switch to Enterprise. Form fields change to require GroupName. Submit. Expect success card with `loginUrl`.
8. Run `npm run build` (or your equivalent). Zero type errors. Zero unused-variable warnings on the new code.
9. Lighthouse score on `/pricing`: ≥ 90 for Performance, Accessibility, SEO. Use semantic markup (`<form>`, proper labels, `aria-describedby` for inline errors).

## What to put in your README after shipping

Add a "Mirror checklist" section. The pricing page lives in two places now (this marketing site + the ERP's per-tenant `/pricing`), and they share API endpoints but have separate JSX. Document:

- "When a plan price or display name changes — no code change needed; both sites read from `/api/platform/plans/public`."
- "When the form's fields, validation, or success-state behaviour changes — mirror the change in this marketing repo AND the ERP repo's [`smart-serve/frontend/src/components/PricingPage.js`]."
- "When a brand-new plan code is added (beyond `basic` / `pro` / `pro_rooms` / `enterprise`) — backend ships first; both this site and the ERP need new tile copy + feature bullets."
- "Feature bullets and the comparison table on `/pricing` are hardcoded in this repo — they don't auto-sync from the ERP. Edit here when you change them in the ERP."

---

## One-paragraph summary for the agent's intro context

"You're working on the OnFix marketing site (Onfix-Pvt-Ltd/OnFixERP), a Next.js + Tailwind site with an orange brand at `onfixpos.com`. The `/pricing` page currently shows four plan tiles with placeholder prices and dead 'Start Free Trial' buttons. Your job: (1) make the prices come from the live ERP backend at `GET https://api.onfixpos.com/api/platform/plans/public` so the SuperAdmin's price changes propagate within a minute; (2) wire the 'Start Free Trial' / 'Contact Sales' buttons to a working shop creation form that posts to `POST /api/Tenants/register` (or `register-enterprise` for the Enterprise tier) and shows a success card with a link to the new shop's tenant subdomain. Match the existing orange/black/white brand exactly — DO NOT introduce blue/purple/indigo from the old ERP design. The card form is visual placeholder only (Stripe + PayPal coming later); structure your submit handler so PSP wiring is a single-function swap. Read the full spec above before writing any code."
