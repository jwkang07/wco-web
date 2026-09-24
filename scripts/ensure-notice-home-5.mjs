import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

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

const env = loadEnv();
const sb = createClient(
  env.get("NEXT_PUBLIC_SUPABASE_URL"),
  env.get("SUPABASE_SERVICE_ROLE_KEY"),
  { auth: { persistSession: false, autoRefreshToken: false } },
);

const { data, error } = await sb
  .from("notices")
  .select("id, title, show_on_home")
  .order("is_pinned", { ascending: false })
  .order("created_at", { ascending: false });
if (error) throw error;

const home = (data ?? []).filter((r) => r.show_on_home);
const need = Math.max(0, 5 - home.length);
const extra = (data ?? [])
  .filter((r) => !r.show_on_home)
  .slice(0, need)
  .map((r) => r.id);

if (extra.length) {
  const { error: upErr } = await sb
    .from("notices")
    .update({ show_on_home: true })
    .in("id", extra);
  if (upErr) throw upErr;
}

const { data: after } = await sb
  .from("notices")
  .select("title")
  .eq("show_on_home", true)
  .order("is_pinned", { ascending: false })
  .order("created_at", { ascending: false });
console.log(
  "home notices:",
  after?.length,
  after?.map((a) => a.title),
);
