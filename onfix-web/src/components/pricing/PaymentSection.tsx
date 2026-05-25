"use client";

/**
 * Payment block for the /pricing signup form.
 *
 * Today: placeholder only. Card / MM-YY / CVC are RENDERED but DISABLED —
 * they exist for visual completeness, not for data capture. The 14-day trial
 * is granted by /Tenants/register without any charge.
 *
 * Tomorrow: when Stripe / PayPal land, swap the `mode` prop and provide a
 * real getPaymentToken() implementation (see SignupForm.tsx). The card-input
 * state will live inside Stripe Elements / PayPal SDK, not in this component
 * — never put PAN in React state, even in placeholder mode.
 */

import { ShieldCheck, Lock } from "lucide-react";

interface PaymentSectionProps {
  mode: "placeholder" | "stripe" | "paypal";
}

export function PaymentSection({ mode }: PaymentSectionProps) {
  if (mode !== "placeholder") {
    return (
      <div className="rounded-2xl border border-border/50 bg-muted/20 p-6 text-sm text-muted-foreground">
        Real PSP integration not yet wired ({mode}).
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-emerald-600">
        <ShieldCheck size={16} />
        <span className="text-sm font-bold">
          Test Mode: No charge will be made.
        </span>
      </div>

      <div className="rounded-2xl border border-border bg-muted/10 p-5 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Card number
          </label>
          <div className="relative">
            <input
              type="text"
              disabled
              aria-disabled
              placeholder="•••• •••• •••• ••••"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/40 text-foreground/40 font-mono tracking-widest cursor-not-allowed"
            />
            <Lock
              size={16}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Expiry
            </label>
            <input
              type="text"
              disabled
              aria-disabled
              placeholder="MM / YY"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/40 text-foreground/40 font-mono cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
              CVC
            </label>
            <input
              type="text"
              disabled
              aria-disabled
              placeholder="•••"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background/40 text-foreground/40 font-mono cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
