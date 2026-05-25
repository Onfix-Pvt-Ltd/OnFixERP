import type { CollectionConfig } from "payload";

/**
 * Integration partners shown on /partners.
 *
 * `icon` is a stable key (not a React component — those can't live in the DB).
 * The page maps the key → a lucide-react icon via ICON_MAP. Add new options
 * here AND in src/lib/cms.ts PARTNER_ICONS when introducing a new icon.
 * Optionally upload a `logo` instead, which the page prefers when set.
 */
export const Partners: CollectionConfig = {
  slug: "partners",
  labels: { singular: "Partner", plural: "Partners" },
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: ["name", "category", "order"],
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
      name: "name",
      type: "text",
      required: true,
      admin: { description: "Partner name, e.g. \"Opera PMS\"." },
    },
    {
      name: "category",
      type: "text",
      required: true,
      admin: { description: "e.g. Payments, Property Management, Accounting." },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "icon",
      type: "select",
      defaultValue: "Box",
      options: [
        { label: "Credit Card", value: "CreditCard" },
        { label: "Hotel", value: "Hotel" },
        { label: "Pie Chart", value: "PieChart" },
        { label: "Box", value: "Box" },
        { label: "Plug", value: "Plug" },
        { label: "Globe", value: "Globe" },
      ],
      admin: { description: "Icon shown when no logo is uploaded." },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Optional logo. Overrides the icon when set." },
    },
    {
      name: "url",
      type: "text",
      admin: { description: "Optional link to the integration page." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower numbers appear first." },
    },
  ],
};
