import type { CollectionConfig } from "payload";

/**
 * Uploaded media (images, and later PDFs/ZIPs for the press kit).
 * Files are stored in Cloudflare R2 via the s3Storage plugin (see payload.config.ts)
 * and served from R2_PUBLIC_URL (media.onfixpos.com).
 *
 * Public read so the marketing site can render images anonymously;
 * writes require an authenticated admin.
 */
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  admin: {
    group: "Library",
  },
  upload: {
    // Image sizes generated on upload. Marketing cards use ~480–1200px wide.
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: undefined },
      { name: "hero", width: 1600, height: undefined },
    ],
    mimeTypes: ["image/*", "application/pdf", "application/zip"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Alt text",
      admin: {
        description: "Describe the image for accessibility and SEO.",
      },
    },
    {
      name: "caption",
      type: "text",
    },
  ],
};
