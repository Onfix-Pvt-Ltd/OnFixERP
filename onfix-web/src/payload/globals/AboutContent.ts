import type { GlobalConfig } from "payload";

/**
 * Editable copy for the /about page: hero, the origin story, and the
 * "Our DNA" values shown in the horizontal-scroll section.
 *
 * `values[].icon` is a string key mapped to a lucide component in the
 * HorizontalScroll component (icons can't live in the DB).
 */
export const AboutContent: GlobalConfig = {
  slug: "about-content",
  label: "About Page",
  admin: { group: "Content" },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      type: "group",
      name: "hero",
      fields: [
        { name: "headingLine1", type: "text" },
        { name: "headingHighlight", type: "text" },
        { name: "subheading", type: "textarea" },
      ],
    },
    {
      name: "bigQuote",
      type: "textarea",
      admin: { description: "Large quote in the square card of the story section." },
    },
    {
      type: "group",
      name: "origin",
      label: "Origin story",
      fields: [
        { name: "badge", type: "text", defaultValue: "Our Origin" },
        { name: "heading", type: "text" },
        { name: "paragraph", type: "textarea" },
        { name: "quote", type: "textarea" },
        { name: "closing", type: "textarea" },
      ],
    },
    {
      name: "values",
      type: "array",
      label: "Our DNA values",
      labels: { singular: "Value", plural: "Values" },
      fields: [
        {
          name: "icon",
          type: "select",
          defaultValue: "Target",
          options: [
            { label: "Target", value: "Target" },
            { label: "Lightbulb", value: "Lightbulb" },
            { label: "Heart", value: "Heart" },
            { label: "Shield", value: "Shield" },
            { label: "Zap", value: "Zap" },
            { label: "Globe", value: "Globe" },
          ],
        },
        { name: "title", type: "text", required: true },
        { name: "desc", type: "textarea", required: true },
      ],
    },
  ],
};
