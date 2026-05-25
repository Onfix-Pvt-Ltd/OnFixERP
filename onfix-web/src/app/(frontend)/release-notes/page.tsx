import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Release Notes — OnFix POS",
  description: "Latest updates, features, and fixes shipped to OnFix POS.",
};

export default function ReleaseNotes() {
  return (
    <LegalPage
      title="Release Notes"
      intro="Changelog of features and improvements shipped to OnFix POS."
    >
      <h2>v3.6 — May 2026</h2>
      <ul>
        <li>New marketing site at <code>onfixpos.com</code></li>
        <li>SuperAdmin: edit plan prices and display names live</li>
        <li>Pricing pulled from a single source of truth across web and tenant apps</li>
      </ul>
      <h2>v3.5 — April 2026</h2>
      <ul>
        <li>Kitchen Display System v2 — multi-section routing with one-tap bumping</li>
        <li>Offline mutation engine — improved conflict resolution after long outages</li>
      </ul>
      <p>
        <em>Older releases coming soon. For per-tenant changelogs, sign in to your shop&apos;s admin.</em>
      </p>
    </LegalPage>
  );
}
