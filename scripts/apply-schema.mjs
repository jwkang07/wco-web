const fs = require("fs");
const { Client } = require("pg");

async function tryConnect(connectionString) {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();
  return client;
}

async function main() {
  const sql = fs.readFileSync("supabase/schema.sql", "utf8");
  const urls = [
    process.env.DATABASE_URL,
    "postgresql://postgres:D1NJDrdn8O4SpcRf@db.wtdvzvlizcvabziihsle.supabase.co:5432/postgres",
    "postgresql://postgres.wtdvzvlizcvabziihsle:D1NJDrdn8O4SpcRf@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres",
    "postgresql://postgres.wtdvzvlizcvabziihsle:D1NJDrdn8O4SpcRf@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres",
  ].filter(Boolean);

  let client;
  let used;
  const errors = [];
  for (const url of urls) {
    try {
      client = await tryConnect(url);
      used = url.replace(/:[^:@/]+@/, ":****@");
      break;
    } catch (e) {
      errors.push(`${url.replace(/:[^:@/]+@/, ":****@")} => ${e.message}`);
    }
  }
  if (!client) {
    console.error("CONNECT_FAILED");
    console.error(errors.join("\n"));
    process.exit(1);
  }

  console.log("CONNECTED", used);
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
  console.error(e);
  process.exit(1);
});
