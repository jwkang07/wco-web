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
  const sql = fs.readFileSync("supabase/alter-page-heroes-multi.sql", "utf8");
  const urls = [
    process.env.DATABASE_URL,
    "postgresql://postgres:D1NJDrdn8O4SpcRf@db.wtdvzvlizcvabziihsle.supabase.co:5432/postgres",
    "postgresql://postgres.wtdvzvlizcvabziihsle:D1NJDrdn8O4SpcRf@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres",
  ].filter(Boolean);

  let client;
  for (const url of urls) {
    try {
      client = await tryConnect(url);
      console.log("CONNECTED");
      break;
    } catch (e) {
      console.log("fail", e.message);
    }
  }
  if (!client) process.exit(1);

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
  console.error(e);
  process.exit(1);
});
