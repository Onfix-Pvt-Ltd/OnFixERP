import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Data Processing Agreement — OnFix POS",
  description: "Data processing terms between OnFix POS and its customers.",
};

export default function DataProcessingAgreement() {
  return (
    <LegalPage
      title="Data Processing Agreement"
      effectiveDate="May 1, 2026"
      intro="This Data Processing Agreement (DPA) sets out the terms under which OnFix POS processes personal data on behalf of its customers."
    >
      <p>
        <strong>Placeholder content.</strong> Final DPA, including subprocessor
        list and SCCs, supplied by counsel before launch.
      </p>
      <h2>Roles</h2>
      <p>Customer is the data controller. OnFix POS is the data processor.</p>
      <h2>Subprocessors</h2>
      <p>A current list is maintained at <a href="/contact">contact us</a> to request the latest version.</p>
      <h2>Security</h2>
      <p>OnFix maintains appropriate technical and organisational measures, including encryption in transit and at rest, role-based access control, and regular backups.</p>
      <h2>International Transfers</h2>
      <p>Where data leaves the EEA, transfers rely on Standard Contractual Clauses or equivalent.</p>
      <h2>Audits</h2>
      <p>Customers may audit our compliance with reasonable notice and confidentiality undertakings.</p>
    </LegalPage>
  );
}
