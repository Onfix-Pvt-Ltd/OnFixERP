import type { GlobalConfig } from "payload";

/**
 * Editable copy + ROI-calculator math for the home page (/).
 *
 * The hero heading renders as two lines: `headingLine1` then `headingHighlight`
 * (the gradient/orange part). The `roi` group holds the assumptions baked into
 * the ROI calculator — marketing can tune the claimed uplift/savings without a
 * code change. Slider ranges stay in the component (UI concern).
 */
export const HomeContent: GlobalConfig = {
  slug: "home-content",
  label: "Home Page",
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
        { name: "headingHighlight", type: "text", admin: { description: "The highlighted/gradient second line." } },
        { name: "subheading", type: "textarea" },
        { name: "primaryCtaLabel", type: "text" },
        { name: "primaryCtaHref", type: "text", defaultValue: "/contact" },
        { name: "secondaryCtaLabel", type: "text" },
        { name: "secondaryCtaHref", type: "text", defaultValue: "/media" },
      ],
    },
    {
      type: "group",
      name: "finalCta",
      label: "Final call-to-action",
      fields: [
        { name: "heading", type: "textarea" },
        { name: "subheading", type: "textarea" },
        { name: "buttonLabel", type: "text" },
      ],
    },
    {
      type: "group",
      name: "roi",
      label: "ROI calculator",
      admin: { description: "Default inputs and the uplift assumptions used in the math." },
      fields: [
        { name: "defaultTables", type: "number", defaultValue: 25 },
        { name: "defaultTicketSize", type: "number", defaultValue: 45 },
        { name: "defaultTurns", type: "number", defaultValue: 3 },
        {
          name: "ticketUpliftPct",
          type: "number",
          defaultValue: 15,
          admin: { description: "% increase in avg ticket via smart upselling." },
        },
        {
          name: "turnsUpliftPct",
          type: "number",
          defaultValue: 20,
          admin: { description: "% faster table turns via QR & KDS." },
        },
        {
          name: "minutesSavedPerTurn",
          type: "number",
          defaultValue: 10,
          admin: { description: "Operational minutes saved per table turn." },
        },
        {
          name: "wasteReductionPct",
          type: "number",
          defaultValue: 5,
          admin: { description: "% of revenue recouped via FIFO waste reduction." },
        },
      ],
    },
  ],
};
