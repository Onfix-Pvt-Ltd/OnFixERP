import type { CollectionConfig } from "payload";

/**
 * Customer case studies shown on /reviews (ReviewsShowcase carousel + modal).
 *
 * Maps 1:1 to the shape ReviewsShowcase renders:
 *   name, role, quote (card text), rating, image, fullStory (modal body).
 *
 * Image: either upload a `photo` (served from R2) OR paste an external
 * `imageUrl`. The page prefers `photo` when both are set.
 *
 * Public read so the marketing site renders anonymously; writes need an admin.
 */
export const Reviews: CollectionConfig = {
  slug: "reviews",
  labels: { singular: "Review", plural: "Reviews" },
  admin: {
    group: "Content",
    useAsTitle: "name",
    defaultColumns: ["name", "role", "rating", "featured", "order"],
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
      admin: { description: "Venue / company name, e.g. \"The Grand Royale\"." },
    },
    {
      name: "role",
      type: "text",
      required: true,
      admin: { description: "Person & title, e.g. \"Sarah Jenkins, GM\"." },
    },
    {
      name: "quote",
      type: "textarea",
      required: true,
      admin: { description: "Short pull-quote shown on the card." },
    },
    {
      name: "rating",
      type: "number",
      required: true,
      defaultValue: 5,
      min: 1,
      max: 5,
    },
    {
      name: "fullStory",
      type: "textarea",
      required: true,
      admin: { description: "Longer story shown in the case-study modal." },
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      admin: { description: "Preferred image. Overrides Image URL when set." },
    },
    {
      name: "imageUrl",
      type: "text",
      admin: { description: "Fallback external image URL (used if no photo)." },
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: { description: "Highlight this story (reserved for future use)." },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower numbers appear first." },
    },
  ],
};
