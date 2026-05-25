import type { Metadata } from "next";
import { PricingClient } from "@/components/pricing/PricingClient";
import { getPublicPlans, type Plan, ErpApiError } from "@/lib/erpApi";

export const metadata: Metadata = {
  title: "Pricing — OnFix POS",
  description:
    "Simple, transparent pricing for the OnFix POS hospitality ERP. Start free for 14 days. No credit card required.",
};

// 60-second ISR — plans propagate from SuperAdmin within a minute.
// Per spec §2: never SSG, never long-cache. revalidate=60 is the maximum acceptable staleness.
export const revalidate = 60;

export default async function PricingPage() {
  let initialPlans: Plan[] | undefined;
  let initialError: string | undefined;
  try {
    initialPlans = await getPublicPlans({ revalidate: 60 });
  } catch (err) {
    if (err instanceof ErpApiError) {
      initialError = err.message;
    } else {
      initialError = "Couldn't reach the pricing service.";
    }
  }

  return (
    <div className="pt-32 pb-32 min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <PricingClient initialPlans={initialPlans} initialError={initialError} />
    </div>
  );
}
