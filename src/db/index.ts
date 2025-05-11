import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as dotenv from "dotenv";
import * as schema from "./schema";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "",
  options: "-c TimeZone=America/Fortaleza",
});

export const db = drizzle(pool, { schema });
export * from "./schema";

export default db;
