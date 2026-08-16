import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { Pool } from "pg";

async function main() {
  const dir = process.argv[2];
  const connectionString = process.env.DATABASE_URL;
  if (!dir) throw new Error("Usage: node dist/database/run-sql-dir.js <directory>");
  if (!connectionString) throw new Error("DATABASE_URL is required");

  const pool = new Pool({ connectionString });
  try {
    const files = (await readdir(dir)).filter((file) => file.endsWith(".sql")).sort();
    for (const file of files) {
      const sql = await readFile(join(dir, file), "utf8");
      console.log(`Running ${file}`);
      await pool.query(sql);
    }
  } finally {
    await pool.end();
  }
}

void main().catch((error) => {
  console.error(error);
  process.exit(1);
});
