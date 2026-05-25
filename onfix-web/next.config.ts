import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const r2PublicHost = (() => {
  try {
    return process.env.R2_PUBLIC_URL
      ? new URL(process.env.R2_PUBLIC_URL).hostname
      : undefined;
  } catch {
    return undefined;
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Cloudflare R2 public domain for CMS-uploaded media.
      ...(r2PublicHost
        ? [{ protocol: "https" as const, hostname: r2PublicHost }]
        : []),
      // Legacy external images still referenced in some components (to be migrated to CMS).
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
