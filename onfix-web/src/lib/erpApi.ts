/**
 * Typed client for the ERP backend at NEXT_PUBLIC_ERP_API_BASE.
 *
 * The marketing site treats this as a read-and-handoff layer:
 *   - GET  /api/platform/plans/public        → live pricing data
 *   - GET  /api/Tenants/resolve/{slug}       → /login slug finder
 *   - POST /api/Tenants/register             → Basic / Pro / Pro+Rooms signup
 *   - POST /api/Tenants/register-enterprise  → Enterprise signup
 *
 * No auth, no cookies, no JWT — every call is anonymous. The ERP team
 * adds the marketing origin to the CORS allowlist (see ERP_TEAM_HANDOFF.md).
 */

export const ERP_API_BASE =
  process.env.NEXT_PUBLIC_ERP_API_BASE ?? "https://api.onfixpos.com";

export type PlanCode = "basic" | "pro" | "pro_rooms" | "enterprise";

export type PlanTerm =
  | "Monthly"
  | "6 Months"
  | "Annual"
  | "3 Years"
  | "5 Years";

export interface Plan {
  id: string;
  code: PlanCode;
  displayName: string;
  description: string;
  priceMonthly: number;
  price6Months: number;
  priceAnnual: number;
  price3Years: number;
  price5Years: number;
  pricePerPropertyMonthly?: number;
  pricePerProperty6Months?: number;
  pricePerPropertyAnnual?: number;
  pricePerProperty3Years?: number;
  pricePerProperty5Years?: number;
  currency: string;
  isDefault: boolean;
  sortOrder: number;
}

export interface ResolvedTenant {
  tenantId: string;
  slug: string;
  name: string;
}

export interface RegisterRequest {
  ShopName: string;
  AdminUsername: string;
  AdminEmail: string;
  AdminPassword: string;
  PlanType: string;
  Duration: PlanTerm;
  BillingEmail?: string;
  ReferredBy?: string;
}

export interface RegisterResponse {
  message: string;
  shopName: string;
  slug: string;
  tenantUrl: string;
  trialEnds: string;
}

export interface RegisterEnterpriseRequest {
  GroupName: string;
  FirstPropertyName: string;
  AdminUsername: string;
  AdminEmail: string;
  AdminPassword: string;
  Duration: PlanTerm;
  BillingEmail?: string;
}

export interface RegisterEnterpriseResponse {
  message: string;
  groupName: string;
  firstPropertyName: string;
  orgId: string;
  tenantId: string;
  loginUrl: string;
  trialEnds: string;
}

export class ErpApiError extends Error {
  status: number;
  payload: unknown;
  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

async function parseError(res: Response): Promise<never> {
  let payload: unknown = null;
  let message = `Request failed with status ${res.status}`;
  try {
    payload = await res.json();
    if (
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof (payload as { message: unknown }).message === "string"
    ) {
      message = (payload as { message: string }).message;
    }
  } catch {
    // body wasn't JSON — keep the generic message
  }
  throw new ErpApiError(message, res.status, payload);
}

/**
 * Fetch live plans for the pricing page.
 *
 * Server-side usage: pass `{ revalidate: 60 }` in next.fetchOptions for ISR.
 * Client-side usage: call inside useEffect — no caching needed.
 *
 * Per spec: never SSG this. Plans change in SuperAdmin and must propagate
 * within ~1 minute.
 */
export async function getPublicPlans(opts?: {
  revalidate?: number;
  signal?: AbortSignal;
}): Promise<Plan[]> {
  const url = `${ERP_API_BASE}/api/platform/plans/public`;
  const init: RequestInit & { next?: { revalidate?: number } } = {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: opts?.signal,
  };
  if (typeof opts?.revalidate === "number") {
    init.next = { revalidate: opts.revalidate };
  } else {
    init.cache = "no-store";
  }
  const res = await fetch(url, init);
  if (!res.ok) await parseError(res);
  const data = (await res.json()) as Plan[];
  return [...data].sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Resolve a shop slug. Used by /login step 1.
 *
 * Returns the resolved tenant on 200, or null on 404 (slug not found).
 * Re-throws any other error.
 */
export async function resolveTenant(
  slug: string,
  opts?: { signal?: AbortSignal }
): Promise<ResolvedTenant | null> {
  const cleaned = slug.trim().toLowerCase();
  if (!cleaned) {
    throw new ErpApiError("Slug is required.", 400, null);
  }
  const url = `${ERP_API_BASE}/api/Tenants/resolve/${encodeURIComponent(cleaned)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    signal: opts?.signal,
  });
  if (res.status === 404) return null;
  if (!res.ok) await parseError(res);
  return (await res.json()) as ResolvedTenant;
}

/**
 * Register a new tenant (Basic / Pro / Pro+Rooms).
 * Throws ErpApiError on 4xx so the caller can surface the message inline.
 */
export async function registerTenant(
  body: RegisterRequest
): Promise<RegisterResponse> {
  const url = `${ERP_API_BASE}/api/Tenants/register`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as RegisterResponse;
}

/**
 * Register an Enterprise hotel group + first property.
 */
export async function registerEnterprise(
  body: RegisterEnterpriseRequest
): Promise<RegisterEnterpriseResponse> {
  const url = `${ERP_API_BASE}/api/Tenants/register-enterprise`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) await parseError(res);
  return (await res.json()) as RegisterEnterpriseResponse;
}

/**
 * Resolve a plan from a fetched list by code → displayName → normalized name.
 * Stable matcher so the marketing UI keeps working when SuperAdmin renames a plan.
 */
export function getPlan(plans: Plan[], key: string): Plan | undefined {
  if (!plans?.length) return undefined;
  const k = key.toLowerCase().trim();
  const byCode = plans.find((p) => p.code.toLowerCase() === k);
  if (byCode) return byCode;
  const byDisplay = plans.find((p) => p.displayName.toLowerCase() === k);
  if (byDisplay) return byDisplay;
  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "_");
  const knorm = normalize(key);
  return plans.find(
    (p) =>
      normalize(p.code) === knorm || normalize(p.displayName) === knorm
  );
}

const TERM_TO_FIELD: Record<PlanTerm, keyof Plan> = {
  Monthly: "priceMonthly",
  "6 Months": "price6Months",
  Annual: "priceAnnual",
  "3 Years": "price3Years",
  "5 Years": "price5Years",
};

const TERM_TO_PER_PROPERTY: Record<PlanTerm, keyof Plan> = {
  Monthly: "pricePerPropertyMonthly",
  "6 Months": "pricePerProperty6Months",
  Annual: "pricePerPropertyAnnual",
  "3 Years": "pricePerProperty3Years",
  "5 Years": "pricePerProperty5Years",
};

export function getPrice(plan: Plan | undefined, term: PlanTerm): number {
  if (!plan) return 0;
  if (term === "Annual") {
    return Math.round(plan.priceMonthly * 0.82 * 100) / 100;
  }
  const v = plan[TERM_TO_FIELD[term]];
  return typeof v === "number" ? v : 0;
}

export function getPerPropertyPrice(
  plan: Plan | undefined,
  term: PlanTerm
): number {
  if (!plan) return 0;
  if (term === "Annual") {
    return Math.round((plan.pricePerPropertyMonthly ?? 0) * 0.82 * 100) / 100;
  }
  const v = plan[TERM_TO_PER_PROPERTY[term]];
  return typeof v === "number" ? v : 0;
}

/**
 * Enterprise total: base price + (count - 1) * per-property price.
 * Backend doesn't take PropertyCount; this is for UI transparency only.
 */
export function getEnterpriseTotal(
  plan: Plan | undefined,
  term: PlanTerm,
  propertyCount: number
): number {
  const base = getPrice(plan, term);
  const perProperty = getPerPropertyPrice(plan, term);
  const extra = Math.max(0, propertyCount - 1);
  return base + extra * perProperty;
}

export const ALL_TERMS: PlanTerm[] = [
  "Monthly",
  "Annual",
];

