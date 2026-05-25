import type { CollectionConfig } from "payload";

/**
 * Downloadable press / brand assets shown on /media (the "Media Kit" grid).
 *
 * Each item points at a `file` (PDF/ZIP/image) stored in R2 via the Media
 * collection. `assetType` is the small label on the card (e.g. "PDF Document",
 * "ZIP (SVG, PNG)").
 */
export const PressKit: CollectionConfig = {
  slug: "press-kit",
  labels: { singular: "Media Kit Item", plural: "Media Kit" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "assetType", "order"],
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: "order",
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      admin: { description: "e.g. \"Brand Guidelines\"." },
    },
    {
      name: "assetType",
      type: "text",
      required: true,
      admin: { description: "Small label, e.g. \"PDF Document\" or \"ZIP (High-Res)\"." },
    },
    {
      name: "file",
      type: "upload",
      relationTo: "media",
      admin: { description: "The downloadable asset (PDF / ZIP / image)." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower numbers appear first." },
    },
  ],
};
