"use client";

import { useState } from "react";
import { FadeIn } from "@/components/animations/FadeIn";
import { Check, Minus, ArrowRight, Zap, Building2, Hotel, Globe } from "lucide-react";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const plans = [
  {
    name: "Starter",
    desc: "For small cafés and single-outlet restaurants getting started.",
    monthly: 59,
    annual: 49,
    icon: Zap,
    popular: false,
    cta: "Start Free Trial",
    href: "/contact",
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
  {
    name: "Professional",
    desc: "For serious restaurants ready to scale and automate.",
    monthly: 119,
    annual: 99,
    icon: Building2,
    popular: true,
    cta: "Start Free Trial",
    href: "/contact",
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
  {
    name: "Pro + Rooms",
    desc: "For hotels and resorts with integrated F&B operations.",
    monthly: 219,
    annual: 179,
    icon: Hotel,
    popular: false,
    cta: "Start Free Trial",
    href: "/contact",
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
  {
    name: "Enterprise",
    desc: "For multi-property chains requiring centralized command.",
    monthly: null,
    annual: null,
    icon: Globe,
    popular: false,
    cta: "Contact Sales",
    href: "/contact",
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
];

type Tier = "starter" | "pro" | "proRooms" | "enterprise";

interface FeatureRow {
  name: string;
  starter: boolean;
  pro: boolean;
  proRooms: boolean;
  enterprise: boolean;
}

interface FeatureCategory {
  category: string;
  rows: FeatureRow[];
}

const comparison: FeatureCategory[] = [
  {
    category: "Core POS & Billing",
    rows: [
      { name: "Table management & floor plan", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Split billing (item & amount)", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Multiple payment methods", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Park & recall orders", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Barcode scanning", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Customer-facing display", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Cash drawer management", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Refunds with reason tracking", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Discount handling", starter: true, pro: true, proRooms: true, enterprise: true },
    ],
  },
  {
    category: "Menu & Kitchen",
    rows: [
      { name: "Categories & items", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Item images", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Add-ons system", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Kitchen section routing", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Kitchen Display System (KDS)", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "KOT thermal printing", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Waiter task claiming", starter: false, pro: true, proRooms: true, enterprise: true },
    ],
  },
  {
    category: "QR & Digital Ordering",
    rows: [
      { name: "QR table ordering", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Guest self-service menu", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Order & item notes", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Real-time order updates", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Table group ordering", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Order types (Dine / Take / Deliver)", starter: false, pro: true, proRooms: true, enterprise: true },
    ],
  },
  {
    category: "Inventory & Supply Chain",
    rows: [
      { name: "Stock item tracking", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Recipe-based deduction", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "FIFO batch tracking", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Low stock alerts", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Waste logging", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Purchase orders", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Storage location management", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Supplier management", starter: false, pro: true, proRooms: true, enterprise: true },
    ],
  },
  {
    category: "Staff & Payroll",
    rows: [
      { name: "Staff management", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Role-based access control", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Attendance tracking", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Shift scheduling & templates", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Leave request workflow", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Salary & payroll processing", starter: false, pro: true, proRooms: true, enterprise: true },
    ],
  },
  {
    category: "Reporting & Analytics",
    rows: [
      { name: "Sales reports", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Inventory reports", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Cash reports", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Analytics dashboard", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Data export (CSV)", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Cross-property reporting", starter: false, pro: false, proRooms: false, enterprise: true },
    ],
  },
  {
    category: "Room Management",
    rows: [
      { name: "Room listing & booking", starter: false, pro: false, proRooms: true, enterprise: true },
      { name: "Guest self-service portal", starter: false, pro: false, proRooms: true, enterprise: true },
      { name: "Room service ordering", starter: false, pro: false, proRooms: true, enterprise: true },
      { name: "Housekeeping board", starter: false, pro: false, proRooms: true, enterprise: true },
      { name: "Booking calendar", starter: false, pro: false, proRooms: true, enterprise: true },
      { name: "Room-to-POS folio billing", starter: false, pro: false, proRooms: true, enterprise: true },
      { name: "DND & service requests", starter: false, pro: false, proRooms: true, enterprise: true },
    ],
  },
  {
    category: "Enterprise & Scale",
    rows: [
      { name: "Multi-branch management", starter: false, pro: false, proRooms: false, enterprise: true },
      { name: "Cross-property transfers", starter: false, pro: false, proRooms: false, enterprise: true },
      { name: "Organization dashboard", starter: false, pro: false, proRooms: false, enterprise: true },
      { name: "Centralized executive reporting", starter: false, pro: false, proRooms: false, enterprise: true },
    ],
  },
  {
    category: "Platform & Support",
    rows: [
      { name: "Dark & light themes", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Real-time sync (SignalR)", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Offline mode", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Desktop application", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Custom branding", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Email support", starter: true, pro: true, proRooms: true, enterprise: true },
      { name: "Priority support", starter: false, pro: true, proRooms: true, enterprise: true },
      { name: "Dedicated account manager", starter: false, pro: false, proRooms: false, enterprise: true },
      { name: "Custom onboarding", starter: false, pro: false, proRooms: true, enterprise: true },
    ],
  },
];

const faqs = [
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
    a: "Yes. Annual plans save you up to 18% compared to monthly billing. The discount is applied automatically when you select annual billing.",
  },
  {
    q: "Can I add rooms to an existing Professional plan?",
    a: "Yes — you can upgrade from Professional to Pro + Rooms at any time. All your existing data, settings, and configurations carry over seamlessly.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards via Stripe. Enterprise customers can also pay via bank transfer or invoice.",
  },
];

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [openCat, setOpenCat] = useState<number | null>(0);

  const tierKeys: Tier[] = ["starter", "pro", "proRooms", "enterprise"];
  const tierLabels = ["Starter", "Professional", "Pro + Rooms", "Enterprise"];

  return (
    <div className="pt-40 pb-32 min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* ── HERO ── */}
        <FadeIn>
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h1 className="text-5xl md:text-8xl font-heading font-extrabold tracking-tighter mb-8 leading-[1.1]">
              Simple,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                transparent
              </span>{" "}
              pricing.
            </h1>
            <p className="text-2xl text-muted-foreground font-medium leading-relaxed">
              Start free for 14 days. No credit card required. Scale when you're ready.
            </p>
          </div>
        </FadeIn>

        {/* ── BILLING TOGGLE ── */}
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-lg font-semibold transition-colors ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative h-10 w-20 rounded-full transition-colors duration-300 ${annual ? "bg-primary" : "bg-muted"}`}
              aria-label="Toggle billing period"
            >
              <div className={`absolute top-1 h-8 w-8 rounded-full bg-white shadow-lg transition-transform duration-300 ${annual ? "translate-x-11" : "translate-x-1"}`} />
            </button>
            <span className={`text-lg font-semibold transition-colors ${annual ? "text-foreground" : "text-muted-foreground"}`}>
              Annual
            </span>
            {annual && (
              <span className="ml-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-bold border border-emerald-500/20">
                Save up to 18%
              </span>
            )}
          </div>
        </FadeIn>

        {/* ── PLAN CARDS ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-32">
          {plans.map((plan, i) => (
            <FadeIn key={plan.name} delay={i * 0.1} direction="up">
              <div
                className={`relative rounded-[2rem] p-8 flex flex-col h-full transition-all duration-500 ${
                  plan.popular
                    ? "bg-foreground text-background border-2 border-primary shadow-[0_20px_60px_rgba(255,92,0,0.25)] scale-[1.02]"
                    : "bg-card border border-border/50 shadow-lg hover:shadow-xl hover:border-primary/30"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 rounded-full bg-primary text-white text-sm font-bold tracking-widest uppercase shadow-lg">
                    Most Popular
                  </div>
                )}

                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 ${plan.popular ? "bg-primary/20 text-primary" : "bg-foreground/5 text-foreground"}`}>
                  <plan.icon size={28} />
                </div>

                <h3 className="text-2xl font-heading font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-8 leading-relaxed ${plan.popular ? "text-background/70" : "text-muted-foreground"}`}>
                  {plan.desc}
                </p>

                {/* Price */}
                <div className="mb-8">
                  {plan.monthly !== null ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-heading font-extrabold tracking-tight">
                          ${annual ? plan.annual : plan.monthly}
                        </span>
                        <span className={`text-lg ${plan.popular ? "text-background/60" : "text-muted-foreground"}`}>
                          /mo
                        </span>
                      </div>
                      {annual && (
                        <p className={`text-sm mt-2 ${plan.popular ? "text-background/50" : "text-muted-foreground"}`}>
                          Billed annually (${plan.annual! * 12}/yr)
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="text-4xl font-heading font-extrabold tracking-tight">Custom</div>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={plan.href}
                  className={`w-full h-14 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 mb-8 ${
                    plan.popular
                      ? "bg-primary text-white shadow-[0_0_30px_rgba(255,92,0,0.4)]"
                      : "bg-foreground text-background hover:shadow-lg"
                  }`}
                >
                  {plan.cta} <ArrowRight size={18} />
                </Link>

                {/* Features */}
                <ul className="space-y-3 flex-1">
                  {plan.bullets.map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm">
                      <Check size={16} className={`shrink-0 mt-0.5 ${plan.popular ? "text-primary" : "text-emerald-500"}`} />
                      <span className={plan.popular ? "text-background/90" : "text-foreground/80"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* ── FEATURE COMPARISON ── */}
        <FadeIn>
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter mb-4">
                Compare <span className="text-primary">all features.</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Every detail, across every tier. Find exactly what your operation needs.
              </p>
            </div>

            {/* Sticky header row (desktop) */}
            <div className="hidden lg:grid grid-cols-[1fr_repeat(4,120px)] gap-4 px-6 py-4 mb-2 sticky top-20 z-30 bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl">
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Feature</div>
              {tierLabels.map((t) => (
                <div key={t} className="text-sm font-bold text-center">{t}</div>
              ))}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              {comparison.map((cat, ci) => (
                <div key={ci} className="border border-border/50 rounded-2xl overflow-hidden bg-card/50">
                  <button
                    onClick={() => setOpenCat(openCat === ci ? null : ci)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-muted/30 transition-colors"
                  >
                    <h4 className="text-lg font-bold font-heading">{cat.category}</h4>
                    <div className={`h-8 w-8 rounded-full border border-border flex items-center justify-center transition-transform duration-300 ${openCat === ci ? "rotate-45 bg-primary border-primary text-white" : ""}`}>
                      <span className="text-xl leading-none">+</span>
                    </div>
                  </button>

                  {openCat === ci && (
                    <div className="px-6 pb-6">
                      {cat.rows.map((row, ri) => (
                        <div
                          key={ri}
                          className={`grid grid-cols-1 lg:grid-cols-[1fr_repeat(4,120px)] gap-2 lg:gap-4 py-3 items-center ${ri !== cat.rows.length - 1 ? "border-b border-border/30" : ""}`}
                        >
                          <span className="text-sm font-medium text-foreground/80">{row.name}</span>

                          {/* Mobile: inline labels */}
                          <div className="flex lg:hidden gap-4 flex-wrap">
                            {(["starter", "pro", "proRooms", "enterprise"] as Tier[]).map((k, ki) => (
                              <div key={k} className="flex items-center gap-1.5 text-xs">
                                <span className="text-muted-foreground">{tierLabels[ki]}:</span>
                                {row[k] ? (
                                  <Check size={14} className="text-emerald-500" />
                                ) : (
                                  <Minus size={14} className="text-muted-foreground/40" />
                                )}
                              </div>
                            ))}
                          </div>

                          {/* Desktop: centered icons */}
                          {(["starter", "pro", "proRooms", "enterprise"] as Tier[]).map((k) => (
                            <div key={k} className="hidden lg:flex justify-center">
                              {row[k] ? (
                                <div className="h-7 w-7 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                  <Check size={14} className="text-emerald-500" />
                                </div>
                              ) : (
                                <Minus size={14} className="text-muted-foreground/30" />
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── FAQ ── */}
        <FadeIn>
          <div className="max-w-3xl mx-auto mb-32">
            <h2 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter mb-12 text-center">
              Frequently asked <span className="text-primary">questions.</span>
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border/50 rounded-2xl overflow-hidden bg-card/50">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-muted/30 transition-colors"
                  >
                    <span className="font-bold text-lg pr-4">{faq.q}</span>
                    <div className={`h-8 w-8 shrink-0 rounded-full border border-border flex items-center justify-center transition-transform duration-300 ${openFaq === i ? "rotate-45 bg-primary border-primary text-white" : ""}`}>
                      <span className="text-xl leading-none">+</span>
                    </div>
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── CTA ── */}
        <FadeIn>
          <div className="text-center py-24 rounded-[3rem] bg-foreground text-background relative overflow-hidden group">
            <div className="absolute inset-[-50%] animate-[spin_6s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,transparent_70%,#FF5C00_100%)] opacity-30 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none" />
            <div className="absolute inset-[2px] bg-foreground rounded-[3rem] z-0" />

            <div className="relative z-10">
              <h3 className="text-4xl md:text-5xl font-heading font-extrabold tracking-tighter mb-6">
                Still deciding?
              </h3>
              <p className="text-xl text-background/70 mb-10 max-w-2xl mx-auto">
                Book a personalized walkthrough and we'll help you choose the perfect plan for your venue.
              </p>
              <Link
                href="/contact"
                className="inline-flex h-16 items-center px-10 bg-primary text-white rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,92,0,0.3)] gap-3"
              >
                Book a Demo <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
