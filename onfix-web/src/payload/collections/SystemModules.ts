import type { CollectionConfig } from "payload";

/**
 * Product modules shown in the /system scrollytelling section.
 *
 * Maps to the `modules` prop of <SystemScrollytelling />:
 *   moduleId (anchor id), title, description, benefits[], workflow.
 *
 * Only the scrollytelling modules are CMS-driven; the feature-category grid and
 * "architecture secrets" blocks on /system remain in code (design-coupled).
 */
export const SystemModules: CollectionConfig = {
  slug: "system-modules",
  labels: { singular: "System Module", plural: "System Modules" },
  admin: {
    group: "Content",
    useAsTitle: "title",
    defaultColumns: ["title", "moduleId", "order"],
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
      name: "moduleId",
      type: "text",
      required: true,
      admin: { description: "Stable anchor id, e.g. \"pos\", \"qr\", \"inventory\"." },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "benefits",
      type: "array",
      labels: { singular: "Benefit", plural: "Benefits" },
      fields: [{ name: "benefit", type: "text", required: true }],
    },
    {
      name: "workflow",
      type: "textarea",
      required: true,
      admin: { description: "One-line end-to-end workflow sentence." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower numbers appear first." },
    },
  ],
};
