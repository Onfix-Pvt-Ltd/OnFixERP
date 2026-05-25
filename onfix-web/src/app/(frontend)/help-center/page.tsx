import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Help Center — OnFix POS",
  description: "Getting help with OnFix POS.",
};

export default function HelpCenter() {
  return (
    <LegalPage
      title="Help Center"
      intro="Find answers, contact support, and explore step-by-step guides."
    >
      <p>
        Looking for product documentation? Browse our{" "}
        <a href="/guides">Guides &amp; Tutorials</a> for in-depth walkthroughs.
      </p>
      <h2>Contact support</h2>
      <p>
        Email <a href="mailto:support@onfixpos.com">support@onfixpos.com</a> for
        anything urgent. Most tickets get a reply within 4 business hours.
      </p>
      <h2>Live chat</h2>
      <p>
        Chat is available from your tenant&apos;s admin panel — bottom-right
        chat icon, signed-in users only.
      </p>
      <h2>Status &amp; incidents</h2>
      <p>
        Track ongoing incidents on the <a href="/system-status">System Status</a> page.
      </p>
    </LegalPage>
  );
}
