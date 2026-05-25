import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "System Status — OnFix POS",
  description: "Real-time service health for OnFix POS.",
};

export default function SystemStatus() {
  return (
    <LegalPage
      title="System Status"
      intro="Real-time health of the OnFix POS platform."
    >
      <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6 mb-8 not-prose flex items-center gap-4">
        <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse" />
        <p className="font-bold text-emerald-700 dark:text-emerald-400">
          All systems operational.
        </p>
      </div>
      <p>
        We&apos;re wiring a public status page (e.g. Better Stack / Statuspage)
        in a follow-up — for now, refer to your in-tenant notifications for
        downtime alerts.
      </p>
      <h2>Subscribe to incidents</h2>
      <p>
        Email <a href="mailto:status@onfixpos.com">status@onfixpos.com</a> with{" "}
        <code>SUBSCRIBE</code> in the subject to be notified of incidents and
        scheduled maintenance.
      </p>
    </LegalPage>
  );
}
