import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service — OnFix POS",
  description: "Terms governing your use of the OnFix POS platform.",
};

export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      effectiveDate="May 1, 2026"
      intro="These Terms of Service govern your access to and use of the OnFix POS platform. Please read them carefully — they set out the rules for both sides."
    >
      <p>
        <strong>Placeholder content.</strong> Final legal copy will be supplied
        by counsel before public launch. The structure below mirrors the
        sections expected.
      </p>
      <h2>1. Acceptance of Terms</h2>
      <p>By creating an account or using the OnFix POS service, you agree to these terms.</p>
      <h2>2. The Service</h2>
      <p>OnFix POS is a multi-tenant SaaS platform for hospitality operations.</p>
      <h2>3. Your Account</h2>
      <p>You are responsible for maintaining the confidentiality of your credentials.</p>
      <h2>4. Subscriptions and Billing</h2>
      <p>Plans are billed per the term selected at signup. The 14-day free trial requires no payment card.</p>
      <h2>5. Acceptable Use</h2>
      <p>See our <a href="/acceptable-use-policy">Acceptable Use Policy</a>.</p>
      <h2>6. Termination</h2>
      <p>You may cancel at any time from your tenant&apos;s admin panel.</p>
      <h2>7. Limitation of Liability</h2>
      <p>To the maximum extent permitted by law…</p>
      <h2>8. Governing Law</h2>
      <p>These terms are governed by the laws of the jurisdiction where OnFix POS is incorporated.</p>
      <h2>9. Contact</h2>
      <p>Questions? <a href="/contact">Contact us</a>.</p>
    </LegalPage>
  );
}
