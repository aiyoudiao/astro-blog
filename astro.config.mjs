// @ts-check

import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig, envField } from "astro/config";

import preact from "@astrojs/preact";
import { loadEnv } from "vite";

const { SECRET_PASSWORD } = loadEnv(process.env.NODE_ENV, process.cwd(), "");

// https://astro.build/config
export default defineConfig({
  site: "https://aiyoudiao.netlify.app",
  integrations: [mdx(), sitemap(), preact()],
  env: {
    schema: {
      API_URL: envField.string({
        context: "client",
        access: "public",
        optional: true,
      }),
      PORT: envField.number({
        context: "server",
        access: "public",
        default: 4321,
      }),
      API_SECRET: envField.string({ context: "server", access: "secret" }),
    },
  },
});
