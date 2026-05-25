"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Loader2, Store, AlertCircle } from "lucide-react";
import { resolveTenant, type ResolvedTenant, ErpApiError } from "@/lib/erpApi";

const TENANT_URL_TEMPLATE =
  process.env.NEXT_PUBLIC_TENANT_URL_TEMPLATE ?? "https://{slug}.onfixpos.com";

function tenantLoginUrl(slug: string): string {
  return `${TENANT_URL_TEMPLATE.replace("{slug}", slug)}/#/login`;
}

export function ShopFinder() {
  const [step, setStep] = useState<1 | 2>(1);
  const [slug, setSlug] = useState("");
  const [resolved, setResolved] = useState<ResolvedTenant | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const cleaned = slug.trim().toLowerCase();
    if (!cleaned) {
      setError("Enter your shop ID to continue.");
      return;
    }
    startTransition(async () => {
      try {
        const tenant = await resolveTenant(cleaned);
        if (!tenant) {
          setError("Shop not found. Check the ID and try again.");
          return;
        }
        setResolved(tenant);
        setStep(2);
      } catch (err) {
        if (err instanceof ErpApiError) {
          setError(err.message);
        } else {
          setError("Couldn't reach the server. Please try again.");
        }
      }
    });
  };

  const onContinue = () => {
    if (!resolved) return;
    window.location.href = tenantLoginUrl(resolved.slug);
  };

  const onBack = () => {
    setStep(1);
    setResolved(null);
    setError(null);
  };

  return (
    <div className="bg-card border border-border/50 rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.06)] p-10 backdrop-blur-xl">
      <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
        <div className="relative h-10 w-auto overflow-hidden">
          <img
            src="/logos/Onfix%20Oval%20Logo.png"
            alt="OnFix POS"
            className="h-10 w-auto object-contain dark:hidden transition-transform group-hover:scale-105"
          />
          <img
            src="/logos/Onfix%20Oval%20Logo%20Alt.png"
            alt="OnFix POS"
            className="h-10 w-auto object-contain hidden dark:block transition-transform group-hover:scale-105"
          />
        </div>
      </Link>

      {step === 1 ? (
        <>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-muted-foreground mb-10">
            Sign in to your OnFix POS shop.
          </p>

          <form onSubmit={onLookup} className="space-y-6" noValidate>
            <div>
              <label
                htmlFor="shop-id"
                className="block text-sm font-bold uppercase tracking-wider text-foreground/80 mb-3"
              >
                Shop ID
              </label>
              <div className="relative">
                <Store
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                />
                <input
                  id="shop-id"
                  type="text"
                  inputMode="text"
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="your-shop"
                  aria-describedby={error ? "shop-id-error" : undefined}
                  aria-invalid={Boolean(error)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-foreground/80 focus:border-foreground transition-all font-medium text-base"
                  disabled={isPending}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                You will find this in your welcome email — it&apos;s the part before{" "}
                <span className="font-mono">.onfixpos.com</span>.
              </p>
              {error && (
                <p
                  id="shop-id-error"
                  className="mt-3 flex items-start gap-2 text-sm text-destructive"
                  role="alert"
                >
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-14 rounded-2xl bg-foreground text-background font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Checking…
                </>
              ) : (
                <>
                  Continue <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-10">
            Don&apos;t have a shop?{" "}
            <Link
              href="/pricing"
              className="font-bold text-primary hover:underline"
            >
              Start free →
            </Link>
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-heading font-extrabold tracking-tight mb-2">
            Continue to {resolved?.name}?
          </h1>
          <p className="text-muted-foreground mb-10">
            You will log in on your shop&apos;s secure page.
          </p>

          <div className="rounded-2xl bg-muted/40 border border-border p-5 mb-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Store size={20} />
            </div>
            <div className="min-w-0">
              <p className="font-bold truncate">{resolved?.name}</p>
              <p className="text-sm text-muted-foreground font-mono truncate">
                {resolved?.slug}.onfixpos.com
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onContinue}
            className="w-full h-14 rounded-2xl bg-foreground text-background font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
          >
            Continue to {resolved?.slug}.onfixpos.com{" "}
            <ArrowRight size={18} />
          </button>

          <button
            type="button"
            onClick={onBack}
            className="mt-6 mx-auto flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} /> Use a different shop
          </button>
        </>
      )}
    </div>
  );
}
