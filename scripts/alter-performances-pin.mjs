import { readFileSync } from "fs";
import pg from "pg";

function loadEnv() {
  const map = new Map();
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    let v = t.slice(i + 1).trim();
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1);
    }
    map.set(t.slice(0, i).trim(), v);
  }
  return map;
}

function pooler(databaseUrl) {
  const u = new URL(databaseUrl);
  const projectRef = u.hostname.startsWith("db.")
    ? u.hostname.slice(3).split(".")[0]
    : null;
  return `postgresql://${decodeURIComponent(u.username)}.${projectRef}:${encodeURIComponent(decodeURIComponent(u.password))}@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres`;
}

const env = loadEnv();
const sql = readFileSync("supabase/alter-performances-pin.sql", "utf8");
const client = new pg.Client({
  connectionString: pooler(env.get("DATABASE_URL")),
  ssl: { rejectUnauthorized: false },
});
await client.connect();
try {
  await client.query(sql);
  console.log("OK is_pinned on performances");
} finally {
  await client.end();
}
