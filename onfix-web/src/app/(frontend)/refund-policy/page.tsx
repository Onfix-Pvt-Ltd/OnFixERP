import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Refund Policy — OnFix POS",
  description: "OnFix POS refund and cancellation terms.",
};

export default function RefundPolicy() {
  return (
    <LegalPage
      title="Refund Policy"
      effectiveDate="May 1, 2026"
      intro="Our approach to refunds and subscription cancellations."
    >
      <p>
        <strong>Placeholder content.</strong> Final policy supplied by counsel
        before launch.
      </p>
      <h2>Free Trial</h2>
      <p>All plans include a 14-day free trial. No payment card required.</p>
      <h2>Subscription Refunds</h2>
      <p>Monthly: pro-rated for unused days on cancellation. Annual / multi-year: refundable within 30 days of purchase.</p>
      <h2>Enterprise</h2>
      <p>Refunds for Enterprise are governed by the signed master services agreement.</p>
      <h2>How to Request</h2>
      <p>Email <a href="mailto:billing@onfixpos.com">billing@onfixpos.com</a> with your tenant slug and reason.</p>
    </LegalPage>
  );
}
