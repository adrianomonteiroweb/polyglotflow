import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config();

export default {
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  out: "./src/db/migrations",
  schemaFilter: "public",

  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },

  verbose: true,
  strict: true,
} satisfies Config;
