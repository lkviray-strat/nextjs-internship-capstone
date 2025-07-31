// seeds/seed.ts

import { seed } from "drizzle-seed";
import { db, POSTGRES_DATABASE_URL } from ".";
import * as schema from "./schema"; // adjust path

async function main() {
  console.log(POSTGRES_DATABASE_URL);
  await seed(db, schema);
}

main().catch((e) => {
  console.error("❌ Seeding failed:", e);
  process.exit(1);
});
