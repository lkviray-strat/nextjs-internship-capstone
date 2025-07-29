import { defineConfig } from "drizzle-kit";
import { POSTGRES_DATABASE_URL } from "./lib/db/index";

export default defineConfig({
  out: "./lib/db/migrations",
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",

  dbCredentials: {
    url:
      process.env.USE_NEON?.toLowerCase() === "true"
        ? process.env.NEON_DATABASE_URL!
        : POSTGRES_DATABASE_URL,
    ssl: process.env.USE_NEON?.toLowerCase() === "true" ? true : undefined,
  },

  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__estratify_migrations__",
    schema: "public",
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});
