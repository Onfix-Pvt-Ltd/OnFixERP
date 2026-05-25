import type { GlobalConfig } from "payload";

/**
 * Site-wide settings used by the footer (and available to any page).
 * Singleton global — edit once at /admin/globals/site-settings.
 * Public read so the marketing site can render anonymously.
 */
export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site Settings",
  admin: { group: "Settings" },
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "tagline",
      type: "textarea",
      admin: { description: "Short blurb shown under the logo in the footer." },
    },
    {
      name: "copyrightName",
      type: "text",
      admin: { description: "Name in the footer copyright line, e.g. \"ONFIX POS\"." },
    },
    {
      type: "group",
      name: "social",
      label: "Social links",
      fields: [
        { name: "linkedin", type: "text", admin: { description: "Full URL or # to hide." } },
        { name: "twitter", type: "text" },
        { name: "instagram", type: "text" },
      ],
    },
    {
      type: "group",
      name: "contact",
      label: "Contact details",
      fields: [
        { name: "address", type: "textarea" },
        { name: "phone", type: "text" },
        { name: "email", type: "text" },
      ],
    },
  ],
};
