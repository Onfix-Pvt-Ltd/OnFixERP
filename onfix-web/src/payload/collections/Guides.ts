import type { CollectionConfig } from "payload";

/**
 * Knowledge-base articles shown on /guides (sidebar categories + popular list)
 * and at /guides/[slug] for the full article.
 *
 * `category` is one of a fixed set; the /guides sidebar derives its icon/label
 * from src/lib/cms.ts GUIDE_CATEGORIES and the article count live from the CMS.
 * `body` is Lexical rich text rendered on the detail page.
 */
export const Guides: CollectionConfig = {
  slug: "guides",
  labels: { singular: "Guide", plural: "Guides" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "popular", "order"],
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
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "URL segment, e.g. \"setting-up-your-first-floor-plan\".",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      defaultValue: "getting-started",
      options: [
        { label: "Getting Started", value: "getting-started" },
        { label: "POS Operations", value: "pos-operations" },
        { label: "Automations", value: "automations" },
        { label: "Developer API", value: "developer-api" },
      ],
    },
    {
      name: "excerpt",
      type: "textarea",
      admin: { description: "One-line summary shown in lists." },
    },
    {
      name: "body",
      type: "richText",
      admin: { description: "Full article shown at /guides/[slug]." },
    },
    {
      name: "popular",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Show in the \"Popular Guides\" list on /guides." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower numbers appear first." },
    },
  ],
};
