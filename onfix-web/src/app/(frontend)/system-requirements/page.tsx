import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "System Requirements — OnFix POS",
  description: "Supported devices, browsers, and hardware for OnFix POS.",
};

export default function SystemRequirements() {
  return (
    <LegalPage
      title="System Requirements"
      intro="What you need to run OnFix POS — terminals, kitchen displays, browsers, and network."
    >
      <h2>Browsers</h2>
      <ul>
        <li>Chrome / Edge — latest two versions</li>
        <li>Safari — 16 and newer (iPad / Mac)</li>
        <li>Firefox — latest version</li>
      </ul>
      <h2>POS Terminals</h2>
      <ul>
        <li>Tablet: iPad Air (5th gen) or newer; Android tablet with 8&quot; or larger display, 4 GB RAM minimum</li>
        <li>Desktop: Windows 10 / 11, macOS 12+, 8 GB RAM</li>
      </ul>
      <h2>Kitchen Display</h2>
      <ul>
        <li>Any display with a Chrome-compatible browser. 15&quot; or larger recommended.</li>
      </ul>
      <h2>Printers</h2>
      <ul>
        <li>Epson TM-T20III, TM-T88VI (recommended)</li>
        <li>Star TSP143III</li>
      </ul>
      <h2>Network</h2>
      <ul>
        <li>Stable internet — minimum 10 Mbps down / 2 Mbps up. Offline mode handles brief outages automatically.</li>
        <li>Local Wi-Fi or wired LAN between terminals and the print bridge.</li>
      </ul>
    </LegalPage>
  );
}
