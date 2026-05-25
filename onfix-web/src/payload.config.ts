import path from "path";
import { fileURLToPath } from "url";

import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import sharp from "sharp";

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Reviews } from "./payload/collections/Reviews";
import { Partners } from "./payload/collections/Partners";
import { PressKit } from "./payload/collections/PressKit";
import { Guides } from "./payload/collections/Guides";
import { SystemModules } from "./payload/collections/SystemModules";
import { SiteSettings } from "./payload/globals/SiteSettings";
import { HomeContent } from "./payload/globals/HomeContent";
import { AboutContent } from "./payload/globals/AboutContent";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const publicUrl = (process.env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: "— OnFix CMS",
    },
  },
  collections: [Users, Media, Reviews, Partners, PressKit, Guides, SystemModules],
  globals: [SiteSettings, HomeContent, AboutContent],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      // Local dev: a file URL. Production (Vercel/serverless): a remote libSQL
      // URL (e.g. Turso `libsql://<db>.turso.io`) so the CMS DB persists and is
      // reachable at build-time prerendering. authToken is ignored for file URLs.
      url: process.env.DATABASE_URI ?? "file:./onfix-cms.sqlite",
      authToken: process.env.DATABASE_AUTH_TOKEN,
    },
  }),
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          // Serve straight from R2's public custom domain (media.onfixpos.com),
          // bypassing Payload's own /api/media access-control proxy for speed.
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename: fn, prefix }) => {
            const key = prefix ? `${prefix}/${fn}` : fn;
            return `${publicUrl}/${key}`;
          },
        },
      },
      bucket: process.env.R2_BUCKET ?? "",
      config: {
        endpoint: process.env.R2_ENDPOINT,
        region: "auto",
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
        },
        forcePathStyle: true,
      },
    }),
  ],
});
