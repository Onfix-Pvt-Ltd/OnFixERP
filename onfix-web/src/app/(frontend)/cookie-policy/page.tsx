import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy — OnFix POS",
  description: "How OnFix POS uses cookies and similar technologies.",
};

export default function CookiePolicy() {
  return (
    <LegalPage
      title="Cookie Policy"
      effectiveDate="May 1, 2026"
      intro="How we use cookies and similar technologies on the OnFix POS marketing site and tenant subdomains."
    >
      <p>
        <strong>Placeholder content.</strong> Final policy supplied by counsel
        before launch.
      </p>
      <h2>What we use</h2>
      <ul>
        <li><strong>Strictly necessary</strong> — keep your session live, store theme preference. Cannot be disabled.</li>
        <li><strong>Analytics</strong> — privacy-respecting page-view counts (no cross-site tracking). You can opt out.</li>
      </ul>
      <h2>Marketing site vs tenant subdomains</h2>
      <p>The marketing site at <code>onfixpos.com</code> uses minimal cookies. Tenant subdomains store JWTs in <code>localStorage</code>, scoped to that tenant — they are not shared across tenants or with the marketing site.</p>
      <h2>Managing cookies</h2>
      <p>Your browser settings allow you to block or clear cookies at any time.</p>
    </LegalPage>
  );
}
