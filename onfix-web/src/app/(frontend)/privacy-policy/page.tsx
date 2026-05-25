import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — OnFix POS",
  description: "How OnFix POS collects, uses, and protects your data.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      effectiveDate="May 1, 2026"
      intro="This Privacy Policy describes the personal data we collect, how we use it, and the rights you have over it."
    >
      <p>
        <strong>Placeholder content.</strong> Final privacy copy will be
        supplied by counsel before public launch.
      </p>
      <h2>1. Information We Collect</h2>
      <p>Account data (name, email, shop name) and operational data (orders, inventory, etc.) entered by tenants.</p>
      <h2>2. How We Use Information</h2>
      <p>To deliver the service, support customers, and improve the platform.</p>
      <h2>3. Sharing</h2>
      <p>We don&apos;t sell personal data. We share with subprocessors needed to run the service (payment processors, hosting, email).</p>
      <h2>4. Data Retention</h2>
      <p>Tenant data is retained for the life of the subscription plus 30 days after cancellation.</p>
      <h2>5. Your Rights</h2>
      <p>Access, correction, deletion, and portability — contact <a href="mailto:privacy@onfixpos.com">privacy@onfixpos.com</a>.</p>
      <h2>6. Cookies</h2>
      <p>See our <a href="/cookie-policy">Cookie Policy</a>.</p>
      <h2>7. Contact</h2>
      <p><a href="/contact">Contact us</a> with privacy questions.</p>
    </LegalPage>
  );
}
