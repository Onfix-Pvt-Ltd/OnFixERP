import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Acceptable Use Policy — OnFix POS",
  description: "Rules for using the OnFix POS platform.",
};

export default function AcceptableUsePolicy() {
  return (
    <LegalPage
      title="Acceptable Use Policy"
      effectiveDate="May 1, 2026"
      intro="Activities prohibited on the OnFix POS platform."
    >
      <p>
        <strong>Placeholder content.</strong> Final policy supplied by counsel
        before launch.
      </p>
      <h2>You may not</h2>
      <ul>
        <li>Use OnFix POS for illegal activity or to process payments for unlawful goods or services.</li>
        <li>Attempt to circumvent rate limits, tenant isolation, or access control.</li>
        <li>Reverse engineer, scrape, or resell the platform without written permission.</li>
        <li>Send spam, phishing, or unsolicited bulk communication through OnFix systems.</li>
        <li>Upload malware, exploits, or content infringing third-party rights.</li>
      </ul>
      <h2>Enforcement</h2>
      <p>Violations may result in immediate suspension. Repeat or severe violations result in account termination without refund.</p>
    </LegalPage>
  );
}
