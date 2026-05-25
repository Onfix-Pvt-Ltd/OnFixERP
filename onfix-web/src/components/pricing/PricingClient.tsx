"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, AlertCircle, Zap, Building2, Hotel, Globe } from "lucide-react";
import {
  ALL_TERMS,
  ErpApiError,
  getEnterpriseTotal,
  getPrice,
  type Plan,
  type PlanCode,
  type PlanTerm,
} from "@/lib/erpApi";
import { SignupForm } from "./SignupForm";

const FAQS = [
  {
    q: "Can I switch plans later?",
    a: "Absolutely. You can upgrade or downgrade at any time. When upgrading, you'll be prorated for the remaining billing period. Downgrades take effect at the next billing cycle.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — every plan includes a 14-day free trial with full access to all features in that tier. No credit card required to start.",
  },
  {
    q: "What happens when my trial ends?",
    a: "You'll be prompted to choose a plan. Your data is preserved for 30 days, so there's no rush. If you don't subscribe, your account enters read-only mode.",
  },
  {
    q: "Do you offer discounts for annual billing?",
    a: "Yes. Multi-year plans save you significantly compared to monthly billing. The discount is applied automatically when you select a longer term.",
  },
  {
    q: "Can I add rooms to an existing Professional plan?",
    a: "Yes — you can upgrade from Professional to Pro + Rooms at any time. All your existing data, settings, and configurations carry over seamlessly.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards via our payment processor. Enterprise customers can also pay via bank transfer or invoice.",
  },
];

// Marketing-only tile metadata, keyed by stable plan code.
// Bullets and icons are hardcoded here per spec §7b — they don't auto-sync from ERP yet.
const PLAN_PRESENTATION: Record<
  PlanCode,
  {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    bullets: string[];
  }
> = {
  basic: {
    icon: Zap,
    bullets: [
      "Core POS & billing",
      "Table management",
      "QR table ordering",
      "Menu management",
      "Basic inventory tracking",
      "Staff accounts (up to 10)",
      "Sales reports",
      "Email support",
    ],
  },
  pro: {
    icon: Building2,
    bullets: [
      "Everything in Starter, plus:",
      "Advanced POS (barcode, splits)",
      "Kitchen Display System",
      "FIFO inventory & recipes",
      "Supplier management",
      "Shift scheduling & payroll",
      "Analytics dashboard",
      "Offline mode & desktop app",
      "Custom branding",
      "Priority support",
    ],
  },
  pro_rooms: {
    icon: Hotel,
    bullets: [
      "Everything in Professional, plus:",
      "Room booking & calendar",
      "Guest self-service portal",
      "Room service ordering",
      "Housekeeping board",
      "Room-to-POS folio billing",
      "Maintenance & service requests",
      "Custom onboarding session",
    ],
  },
  enterprise: {
    icon: Globe,
    bullets: [
      "Everything in Pro + Rooms, plus:",
      "Multi-property management",
      "Cross-property transfers",
      "Centralized executive reporting",
      "Organization dashboard",
      "Dedicated account manager",
      "Custom integrations",
      "SLA guarantee",
    ],
  },
};

const TERM_LABEL: Record<PlanTerm, string> = {
  Monthly: "/mo",
  "6 Months": "/mo",
  Annual: "/mo",
  "3 Years": "/mo",
  "5 Years": "/mo",
};

interface PricingClientProps {
  initialPlans?: Plan[];
  initialError?: string;
}

export function PricingClient({
  initialPlans,
  initialError,
}: PricingClientProps) {
  const [plans, setPlans] = useState<Plan[] | null>(initialPlans ?? null);
  const [loadError, setLoadError] = useState<string | null>(initialError ?? null);
  const [term, setTerm] = useState<PlanTerm>("Annual");
  const [userPickedCode, setUserPickedCode] = useState<PlanCode | null>(null);
  const [propertyCount, setPropertyCount] = useState(2);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Client-side fetch only when SSR didn't pre-supply plans.
  useEffect(() => {
    if (initialPlans?.length || initialError) return;
    let cancelled = false;
    (async () => {
      try {
        const { getPublicPlans } = await import("@/lib/erpApi");
        const data = await getPublicPlans();
        if (!cancelled) setPlans(data);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ErpApiError) setLoadError(err.message);
        else setLoadError("Couldn't reach the pricing service.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialPlans, initialError]);

  // Effective selection: user pick overrides default; default is "pro" (Most Popular)
  // if available, otherwise the first plan returned by the API.
  const selectedCode: PlanCode | null = useMemo(() => {
    if (userPickedCode) return userPickedCode;
    if (!plans?.length) return null;
    return (plans.find((p) => p.code === "pro") ?? plans[0]).code;
  }, [plans, userPickedCode]);

  const selectedPlan = useMemo(
    () => plans?.find((p) => p.code === selectedCode),
    [plans, selectedCode]
  );

  const formatPrice = (amount: number, currency: string) => {
    if (amount === 0 && plans?.length) return "Custom";
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${currency} ${amount}`;
    }
  };

  return (
    <div className="container mx-auto px-6 max-w-7xl relative z-10">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 leading-[1.1]">
          Simple,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
            transparent
          </span>{" "}
          pricing.
        </h1>
        <p className="text-2xl text-muted-foreground font-medium leading-relaxed">
          Start free for 14 days. No credit card required. Scale when you&apos;re
          ready.
        </p>
      </div>

      {/* Term selector — neutral pill toggle, no orange */}
      <div className="flex justify-center mb-16">
        <div className="inline-flex items-center gap-1 p-1.5 rounded-full bg-muted/40 border border-border/50">
          {ALL_TERMS.map((t) => {
            const active = term === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTerm(t)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                  active
                    ? "bg-background text-foreground shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={active}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {loadError && (
        <div className="max-w-2xl mx-auto mb-12 rounded-2xl border border-destructive/30 bg-destructive/5 p-6 flex items-start gap-4">
          <AlertCircle size={20} className="text-destructive shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-1">Couldn&apos;t load live pricing.</p>
            <p className="text-sm text-muted-foreground">
              {loadError}. Please refresh in a moment, or{" "}
              <a href="/contact" className="text-primary font-bold underline">
                contact us
              </a>{" "}
              if it persists.
            </p>
          </div>
        </div>
      )}

      {!plans && !loadError && (
        <div className="flex items-center justify-center py-32 text-muted-foreground">
          <Loader2 size={20} className="animate-spin mr-3" /> Loading live
          pricing…
        </div>
      )}

      {plans && (
        <>
          {/* Plan grid + signup form layout */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-32">
            <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
              {plans.map((plan) => {
                const presentation = PLAN_PRESENTATION[plan.code];
                const Icon = presentation?.icon ?? Zap;
                const bullets = presentation?.bullets ?? [];
                const isPopular = plan.code === "pro";
                const isEnterprise = plan.code === "enterprise";
                const isSelected = plan.code === selectedCode;

                const baseAmount = getPrice(plan, term);
                const total = isEnterprise
                  ? getEnterpriseTotal(plan, term, propertyCount)
                  : baseAmount;

                return (
                  <button
                    type="button"
                    key={plan.id}
                    onClick={() => setUserPickedCode(plan.code)}
                    className={`relative text-left rounded-[2rem] p-7 flex flex-col h-full transition-all duration-300 ${
                      isSelected
                        ? isPopular
                          ? "bg-foreground text-background border-2 border-primary shadow-[0_15px_45px_rgba(255,92,0,0.25)] scale-[1.01]"
                          : "bg-card border-2 border-foreground shadow-[0_15px_45px_rgba(0,0,0,0.08)] scale-[1.01]"
                        : isPopular
                          ? "bg-foreground text-background border-2 border-primary shadow-[0_10px_30px_rgba(255,92,0,0.18)]"
                          : "bg-card border border-border/50 hover:border-foreground/40"
                    }`}
                    aria-pressed={isSelected}
                  >
                    {isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-white text-xs font-bold tracking-widest uppercase shadow-md">
                        Most Popular
                      </div>
                    )}

                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center mb-5 ${
                        isPopular
                          ? "bg-primary/20 text-primary"
                          : "bg-foreground/5 text-foreground"
                      }`}
                    >
                      <Icon size={24} />
                    </div>

                    <h3 className="text-xl font-heading font-bold mb-1">
                      {plan.displayName}
                    </h3>
                    <p
                      className={`text-sm mb-6 leading-relaxed line-clamp-2 ${
                        isPopular ? "text-background/70" : "text-muted-foreground"
                      }`}
                    >
                      {plan.description || "—"}
                    </p>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-heading font-extrabold tracking-tight">
                          {formatPrice(total, plan.currency)}
                        </span>
                        {total > 0 && (
                          <span
                            className={`text-base ${
                              isPopular ? "text-background/60" : "text-muted-foreground"
                            }`}
                          >
                            {TERM_LABEL[term]}
                          </span>
                        )}
                      </div>
                      {isEnterprise && total > 0 && (
                        <p
                          className={`text-xs mt-1 ${
                            isPopular ? "text-background/50" : "text-muted-foreground"
                          }`}
                        >
                          for {propertyCount} properties
                        </p>
                      )}
                    </div>

                    <ul className="space-y-2.5 flex-1 mb-2">
                      {bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <Check
                            size={14}
                            className={`shrink-0 mt-0.5 ${
                              isPopular ? "text-primary" : "text-emerald-500"
                            }`}
                          />
                          <span
                            className={
                              isPopular ? "text-background/90" : "text-foreground/80"
                            }
                          >
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </button>
                );
              })}
            </div>

            <div className="xl:col-span-4 xl:sticky xl:top-28 self-start">
              <SignupForm
                selectedPlan={selectedPlan}
                term={term}
                propertyCount={propertyCount}
                onPropertyCountChange={setPropertyCount}
              />
            </div>
          </div>

          {/* FAQs (marketing-only) */}
          <div className="max-w-3xl mx-auto mb-24">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter mb-12 text-center">
              Frequently asked{" "}
              <span className="text-primary">questions.</span>
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <div
                  key={i}
                  className="border border-border/50 rounded-2xl overflow-hidden bg-card/50"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-muted/30 transition-colors"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-bold text-lg pr-4">{faq.q}</span>
                    <div
                      className={`h-8 w-8 shrink-0 rounded-full border border-border flex items-center justify-center transition-transform duration-300 ${
                        openFaq === i ? "rotate-45 bg-primary border-primary text-white" : ""
                      }`}
                    >
                      <span className="text-xl leading-none">+</span>
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
