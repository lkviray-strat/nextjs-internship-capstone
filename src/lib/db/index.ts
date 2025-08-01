// db/index.ts
import { Pool as neonPool } from "@neondatabase/serverless";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import { Pool as pgPool } from "pg";
import * as schema from "./schema";

export const POSTGRES_DATABASE_URL = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`;

export const db =
  process.env.USE_NEON?.toLowerCase() === "true"
    ? drizzleNeon(
        new neonPool({ connectionString: process.env.NEON_DATABASE_URL! }),
        { schema }
      )
    : drizzlePg(new pgPool({ connectionString: POSTGRES_DATABASE_URL }), {
        schema,
      });
