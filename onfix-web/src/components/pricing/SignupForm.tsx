"use client";

import { useMemo, useState, useTransition } from "react";
import {
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check as CheckIcon,
  Building2,
  Minus,
  Plus,
} from "lucide-react";
import { PaymentSection } from "./PaymentSection";
import {
  registerTenant,
  registerEnterprise,
  ErpApiError,
  type Plan,
  type PlanTerm,
  type RegisterResponse,
  type RegisterEnterpriseResponse,
} from "@/lib/erpApi";

interface SignupFormProps {
  selectedPlan: Plan | undefined;
  term: PlanTerm;
  propertyCount: number;
  onPropertyCountChange: (n: number) => void;
}

type SuccessData =
  | { kind: "standard"; payload: RegisterResponse }
  | { kind: "enterprise"; payload: RegisterEnterpriseResponse };

/**
 * Phase 1 — payment. Currently a no-op; future PSPs replace ONLY this function.
 * Keep the return shape stable: { ok: true, token: string | null } | { ok: false, error: string }.
 */
async function getPaymentToken(): Promise<
  { ok: true; token: string | null } | { ok: false; error: string }
> {
  return { ok: true, token: null };
}

export function SignupForm({
  selectedPlan,
  term,
  propertyCount,
  onPropertyCountChange,
}: SignupFormProps) {
  const isEnterprise = selectedPlan?.code === "enterprise";
  const isPopular = selectedPlan?.code === "pro";

  const [shopName, setShopName] = useState("");
  const [groupName, setGroupName] = useState("");
  const [adminUsername, setAdminUsername] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [password, setPassword] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<SuccessData | null>(null);
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);

  // Read referral code at submit time so we never touch state in an effect.
  const readReferral = (): string | undefined => {
    try {
      return window.localStorage.getItem("onfix_ref") ?? undefined;
    } catch {
      return undefined;
    }
  };

  const submitButtonClasses = useMemo(() => {
    const base =
      "w-full h-14 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed";
    return isPopular
      ? `${base} bg-primary text-white shadow-[0_10px_30px_rgba(255,92,0,0.3)]`
      : `${base} bg-foreground text-background`;
  }, [isPopular]);

  const validate = (): string | null => {
    if (!selectedPlan) return "Please select a plan above.";
    if (isEnterprise) {
      if (!groupName.trim() || groupName.trim().length < 2)
        return "Group name is required.";
      if (!shopName.trim() || shopName.trim().length < 3)
        return "First property name is required (3+ characters).";
    } else {
      if (!shopName.trim() || shopName.trim().length < 3)
        return "Shop name is required (3+ characters).";
    }
    if (!/^[a-zA-Z0-9_.]+$/.test(adminUsername))
      return "Username can only contain letters, numbers, dots, and underscores.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(adminEmail.trim()))
      return "A valid admin email is required.";
    if (password.length < 8)
      return "Password must be at least 8 characters.";
    if (
      billingEmail &&
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(billingEmail.trim())
    )
      return "Billing email looks invalid.";
    if (!agreedToTerms) return "Please agree to the Terms of Service to continue.";
    return null;
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (!selectedPlan) return;

    startTransition(async () => {
      try {
        // Phase 1 — payment. No-op today; PSP integration replaces this.
        const payment = await getPaymentToken();
        if (!payment.ok) {
          setError(payment.error);
          return;
        }

        // Phase 2 — create the tenant. Stable; payment token is forward-compat.
        if (isEnterprise) {
          const res = await registerEnterprise({
            GroupName: groupName.trim(),
            FirstPropertyName: shopName.trim(),
            AdminUsername: adminUsername.trim(),
            AdminEmail: adminEmail.trim(),
            AdminPassword: password,
            Duration: term,
            BillingEmail: billingEmail.trim() || undefined,
          });
          setSuccess({ kind: "enterprise", payload: res });
        } else {
          const res = await registerTenant({
            ShopName: shopName.trim(),
            AdminUsername: adminUsername.trim(),
            AdminEmail: adminEmail.trim(),
            AdminPassword: password,
            PlanType: selectedPlan.displayName,
            Duration: term,
            BillingEmail: billingEmail.trim() || undefined,
            ReferredBy: readReferral(),
          });
          setSuccess({ kind: "standard", payload: res });
        }
      } catch (err) {
        if (err instanceof ErpApiError) {
          setError(err.message);
        } else {
          setError("Couldn't reach the server. Please try again.");
        }
      }
    });
  };

  if (success) {
    const url =
      success.kind === "standard"
        ? success.payload.tenantUrl
        : success.payload.loginUrl;
    const headline =
      success.kind === "standard" ? "Setup Complete!" : "Enterprise Group Created!";
    const displayName =
      success.kind === "standard"
        ? success.payload.shopName
        : success.payload.groupName;
    const trialDate = new Date(success.payload.trialEnds).toLocaleDateString();

    return (
      <div className="overflow-hidden rounded-[2rem] border border-border/50 bg-card shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
        <div className="bg-primary text-white p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-white text-primary flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-3xl font-heading font-extrabold tracking-tight">
            {headline}
          </h2>
          <p className="text-white/90 mt-2">{displayName} is ready to go.</p>
        </div>
        <div className="p-8 space-y-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Your Shop URL
            </p>
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-muted/30 p-4">
              <code className="flex-1 font-mono text-sm break-all">{url}</code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(url).then(() => {
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  });
                }}
                className="h-9 w-9 rounded-lg border border-border bg-background flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                aria-label="Copy URL"
              >
                {copied ? <CheckIcon size={16} /> : <Copy size={16} />}
              </button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Free trial ends{" "}
            <span className="font-bold text-foreground">{trialDate}</span>. No
            payment card required.
          </p>
          <a
            href={`${url}/login`}
            className="w-full h-14 rounded-2xl bg-foreground text-background font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
          >
            Go to Dashboard <ArrowRight size={18} />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-[2rem] border border-border/50 bg-card shadow-[0_20px_60px_rgba(0,0,0,0.06)] p-8">
      <h3 className="text-2xl font-heading font-extrabold tracking-tight mb-2">
        Create your shop
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        {selectedPlan
          ? `Starting on the ${selectedPlan.displayName} plan, ${term.toLowerCase()}.`
          : "Pick a plan above to get started."}
      </p>

      {isEnterprise && selectedPlan && (
        <div className="mb-6 rounded-2xl bg-orange-50/30 dark:bg-primary/5 border border-primary/20 p-5">
          <div className="flex items-center gap-3 mb-4">
            <Building2 size={18} className="text-primary" />
            <span className="text-sm font-bold uppercase tracking-wider">
              Number of properties
            </span>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                onPropertyCountChange(Math.max(2, propertyCount - 1))
              }
              className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform disabled:opacity-40"
              disabled={propertyCount <= 2}
              aria-label="Decrease property count"
            >
              <Minus size={18} />
            </button>
            <div className="text-center">
              <div className="text-4xl font-heading font-extrabold tracking-tight">
                {propertyCount}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                properties
              </div>
            </div>
            <button
              type="button"
              onClick={() => onPropertyCountChange(propertyCount + 1)}
              className="h-12 w-12 rounded-xl bg-primary text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
              aria-label="Increase property count"
            >
              <Plus size={18} />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            You can add more properties later from your group dashboard.
          </p>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {isEnterprise && (
          <div>
            <label
              htmlFor="group-name"
              className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2"
            >
              Hotel group name
            </label>
            <input
              id="group-name"
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
              maxLength={150}
              autoComplete="organization"
              placeholder="Sunrise Hospitality Group"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
            />
          </div>
        )}

        <div>
          <label
            htmlFor="shop-name"
            className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2"
          >
            {isEnterprise ? "First property name" : "Shop name"}
          </label>
          <input
            id="shop-name"
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            required
            maxLength={150}
            autoComplete="off"
            placeholder={isEnterprise ? "Sunrise Flagship" : "Billy's Burgers"}
            aria-describedby="shop-name-hint"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
          />
          <p
            id="shop-name-hint"
            className="text-xs text-muted-foreground mt-2"
          >
            This becomes your subdomain — e.g. <span className="font-mono">billys-burgers.onfixpos.com</span>.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="admin-username"
              className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2"
            >
              Admin username
            </label>
            <input
              id="admin-username"
              type="text"
              value={adminUsername}
              onChange={(e) => setAdminUsername(e.target.value)}
              required
              maxLength={50}
              pattern="[a-zA-Z0-9_.]+"
              autoComplete="username"
              placeholder="alex"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              placeholder="8+ characters"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="admin-email"
            className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2"
          >
            Admin email
          </label>
          <input
            id="admin-email"
            type="email"
            value={adminEmail}
            onChange={(e) => setAdminEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="alex@billysburgers.com"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="billing-email"
            className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2"
          >
            Billing email <span className="text-muted-foreground/60 normal-case font-medium">(optional)</span>
          </label>
          <input
            id="billing-email"
            type="email"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            autoComplete="email"
            placeholder="Defaults to admin email"
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
          />
        </div>

        <PaymentSection mode="placeholder" />

        <label className="flex items-start gap-3 cursor-pointer pt-2">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-foreground accent-foreground focus:ring-foreground"
          />
          <span className="text-sm text-muted-foreground leading-relaxed">
            I agree to the{" "}
            <a href="/terms-of-service" className="text-foreground font-bold underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy-policy" className="text-foreground font-bold underline">
              Privacy Policy
            </a>
            .
          </span>
        </label>

        {error && (
          <p
            className="flex items-start gap-2 text-sm text-destructive"
            role="alert"
            aria-describedby="signup-error"
          >
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span id="signup-error">{error}</span>
          </p>
        )}

        <button
          type="submit"
          disabled={isPending || !selectedPlan}
          className={submitButtonClasses}
        >
          {isPending ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Creating your shop…
            </>
          ) : (
            <>
              Start 14-Day Free Trial <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
