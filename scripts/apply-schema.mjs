const fs = require("fs");
const { Client } = require("pg");

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL;
  if (!connectionString) {
    console.error("SUPABASE_DB_URL is required (server-only).");
    process.exit(1);
  }

  const sql = fs.readFileSync("supabase/schema.sql", "utf8");
  const client = new Client({
    connectionString,
    ssl: true,
  });

  await client.connect();
  console.log("CONNECTED");
  try {
    await client.query(sql);
    console.log("SCHEMA_OK");
    const { rows } = await client.query(`
      select table_name
      from information_schema.tables
      where table_schema = 'public'
        and table_name in (
          'admins','admin_audit_logs','page_heroes','histories',
          'performances','press_articles','musicians','faqs','inquiries'
        )
      order by table_name
    `);
    console.log(
      "TABLES",
      rows.map((r) => r.table_name).join(","),
    );
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : "failed");
  process.exit(1);
});
