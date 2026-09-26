/**
 * 개발 서버 포트·프로세스 점검/정리 유틸.
 *
 * 기본: 대상 포트·프로세스만 출력 (종료하지 않음).
 * 종료가 필요할 때만 명시적으로:
 *   node scripts/kill-dev-ports.mjs --force
 *
 * Cursor / Codex / Antigravity가 동시에 `npm run dev`를 켜지 않도록
 * 로컬에서는 개발 서버 1개만 사용하세요. (scripts/dev-server.mjs 자동 재시작은 유지)
 */

import { execSync } from "child_process";

const FORCE = process.argv.includes("--force");
const PORTS = [3000, 3001];

function listPortPids(port) {
  try {
    const out = execSync(
      `powershell -NoProfile -Command "Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique"`,
      { encoding: "utf8" },
    );
    return out
      .split(/\r?\n/)
      .map((l) => Number(l.trim()))
      .filter((pid) => Number.isFinite(pid) && pid > 0);
  } catch {
    return [];
  }
}

function listRelatedNodePids() {
  try {
    const out = execSync(
      `powershell -NoProfile -Command "Get-CimInstance Win32_Process -Filter \\"name='node.exe'\\" | Where-Object { $_.CommandLine -match 'next|dev-server|wco_web' } | ForEach-Object { '{0}|{1}' -f $_.ProcessId, $_.CommandLine }"`,
      { encoding: "utf8" },
    );
    return out
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const i = line.indexOf("|");
        const pid = Number(i >= 0 ? line.slice(0, i) : line);
        const cmd = i >= 0 ? line.slice(i + 1) : "";
        return { pid, cmd: cmd.slice(0, 160) };
      })
      .filter((row) => Number.isFinite(row.pid) && row.pid > 0);
  } catch {
    return [];
  }
}

console.log(
  FORCE
    ? "[kill-dev-ports] --force: 아래 프로세스를 종료합니다."
    : "[kill-dev-ports] 점검 모드 (종료 안 함). 종료하려면: node scripts/kill-dev-ports.mjs --force",
);
console.log("");

const portRows = [];
for (const port of PORTS) {
  const pids = listPortPids(port);
  portRows.push({ port, pids });
  console.log(
    pids.length
      ? `port ${port}: pid ${pids.join(", ")}`
      : `port ${port}: (no listener)`,
  );
}

const related = listRelatedNodePids().filter((row) => row.pid !== process.pid);
console.log("");
console.log("related node processes:");
if (!related.length) {
  console.log("  (none matched)");
} else {
  for (const row of related) {
    console.log(`  pid ${row.pid}: ${row.cmd || "(no cmdline)"}`);
  }
}

if (!FORCE) {
  console.log("");
  console.log("아무 프로세스도 종료하지 않았습니다.");
  process.exit(0);
}

const killSet = new Set();
for (const { pids } of portRows) {
  for (const pid of pids) killSet.add(pid);
}
for (const row of related) killSet.add(row.pid);

console.log("");
for (const pid of killSet) {
  try {
    process.kill(pid);
    console.log(`killed pid ${pid}`);
  } catch (e) {
    console.log(`kill failed ${pid}: ${e.message}`);
  }
}

console.log("done");
