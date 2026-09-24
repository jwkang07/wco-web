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
const client = new pg.Client({
  connectionString: pooler(env.get("DATABASE_URL")),
  ssl: { rejectUnauthorized: false },
});
await client.connect();
try {
  // 동일 sort_order(0 등)면 연도·등록일 기준으로 1..N 재부여
  await client.query(`
    with ordered as (
      select id,
             row_number() over (
               order by sort_order asc, year asc, created_at asc, id asc
             ) as rn
      from public.histories
    )
    update public.histories h
    set sort_order = ordered.rn,
        updated_at = now()
    from ordered
    where h.id = ordered.id
  `);
  const { rows } = await client.query(`
    select year, sort_order, left(body, 40) as body
    from public.histories
    order by sort_order asc
  `);
  console.log(rows);
} finally {
  await client.end();
}
