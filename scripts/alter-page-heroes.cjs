const fs = require("fs");
const { Client } = require("pg");

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    console.error("SUPABASE_DB_URL is required (server-only).");
    process.exit(1);
  }

  const sql = fs.readFileSync("supabase/alter-page-heroes-multi.sql", "utf8");
  const client = new Client({
    connectionString,
    ssl: true,
  });

  await client.connect();
  console.log("CONNECTED");
  try {
    await client.query(sql);
    console.log("ALTER_OK");
    const { rows } = await client.query(`
      select column_name
      from information_schema.columns
      where table_schema = 'public' and table_name = 'page_heroes'
      order by ordinal_position
    `);
    console.log("COLS", rows.map((r) => r.column_name).join(","));
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : "failed");
  process.exit(1);
});
