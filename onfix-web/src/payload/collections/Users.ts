import type { CollectionConfig } from "payload";

/**
 * Admin users for the CMS. Auth-enabled so /admin requires login.
 * Keep this small — only OnFix staff who manage marketing content.
 */
export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    group: "System",
  },
  access: {
    // Only logged-in admins can read the user list.
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
    },
  ],
};
