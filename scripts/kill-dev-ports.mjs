/**
 * 개발 서버 포트 점검/정리 유틸 (Windows).
 *
 * 기본: 조회만 (종료하지 않음)
 *   node scripts/kill-dev-ports.mjs
 *
 * 강제 종료: --force 와 --port 를 함께 지정 (허용: 3000, 3001)
 *   node scripts/kill-dev-ports.mjs --force --port 3000
 *
 * Cursor / Codex / Antigravity가 동시에 `npm run dev`를 켜지 않도록
 * 로컬에서는 개발 서버 1개만 사용하세요.
 */

import { execFileSync } from "node:child_process";

const ALLOWED_PORTS = new Set([3000, 3001]);

function parseArgs(argv) {
  const force = argv.includes("--force");
  /** @type {number[]} */
  const ports = [];
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--port") {
      const raw = argv[i + 1];
      const n = Number(raw);
      if (!Number.isInteger(n) || !ALLOWED_PORTS.has(n)) {
        throw new Error(
          `--port 값은 3000 또는 3001만 허용합니다. 받은 값: ${raw ?? "(없음)"}`,
        );
      }
      ports.push(n);
      i++;
    }
  }
  return { force, ports: [...new Set(ports)] };
}

/**
 * netstat -ano -p tcp 출력에서 LISTENING + 지정 포트 PID 수집.
 * IPv4 (0.0.0.0:3000) / IPv6 ([::]:3000, :::3000) 모두 처리.
 * @param {number} port
 * @returns {{ ok: true, pids: number[] } | { ok: false, error: string }}
 */
function listListeningPids(port) {
  let out;
  try {
    out = execFileSync("netstat", ["-ano", "-p", "tcp"], {
      encoding: "utf8",
      windowsHide: true,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: `netstat 실행 실패: ${msg}` };
  }

  /** @type {Set<number>} */
  const pids = new Set();
  const lines = out.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Proto  Local Address  Foreign Address  State  PID
    // TCP    0.0.0.0:3000   0.0.0.0:0        LISTENING  1234
    // TCP    [::]:3000      [::]:0           LISTENING  1234
    // TCP    :::3000        :::0             LISTENING  1234
    if (!/\bLISTENING\b/i.test(trimmed)) continue;

    const parts = trimmed.split(/\s+/);
    if (parts.length < 5) continue;
    if (parts[0].toUpperCase() !== "TCP") continue;

    const local = parts[1];
    const state = parts[parts.length - 2];
    const pidRaw = parts[parts.length - 1];
    if (!/^LISTENING$/i.test(state)) continue;

    if (!localAddressMatchesPort(local, port)) continue;

    const pid = Number(pidRaw);
    if (!Number.isInteger(pid) || pid <= 0) continue;
    pids.add(pid);
  }

  return { ok: true, pids: [...pids].sort((a, b) => a - b) };
}

/** @param {string} local @param {number} port */
function localAddressMatchesPort(local, port) {
  // IPv6 bracket form: [::]:3000 or [fe80::1]:3000
  const bracket = local.match(/^\[.*\]:(\d+)$/);
  if (bracket) return Number(bracket[1]) === port;

  // IPv4 or :::port — last :segment is the port
  const idx = local.lastIndexOf(":");
  if (idx < 0) return false;
  const portPart = local.slice(idx + 1);
  return Number(portPart) === port;
}

function formatPortLine(port, result) {
  if (!result.ok) {
    return `port ${port}: ERROR — ${result.error}`;
  }
  if (!result.pids.length) {
    return `port ${port}: (no listener)`;
  }
  return `port ${port}: pid ${result.pids.join(", ")}`;
}

function printParentHint() {
  console.log("");
  console.log(
    "자동 재시작 관리 프로세스가 남아 있을 수 있습니다.",
  );
  console.log(
    "해당 개발 서버를 실행한 Cursor/Codex/Antigravity 터미널에서 직접 종료해 주세요.",
  );
}

function main() {
  let args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(`[kill-dev-ports] ${e instanceof Error ? e.message : e}`);
    process.exit(2);
  }

  const { force, ports: forcePorts } = args;
  const inspectPorts = [3000, 3001];

  if (force && forcePorts.length === 0) {
    console.error(
      "[kill-dev-ports] --force 만으로는 종료할 수 없습니다. 예: node scripts/kill-dev-ports.mjs --force --port 3000",
    );
    process.exit(2);
  }

  if (!force) {
    console.log(
      "[kill-dev-ports] 점검 모드 (종료 안 함). 종료 예: node scripts/kill-dev-ports.mjs --force --port 3000",
    );
  } else {
    console.log(
      `[kill-dev-ports] --force: 포트 ${forcePorts.join(", ")} 의 현재 LISTENING PID만 종료합니다.`,
    );
  }
  console.log("");

  /** @type {Map<number, ReturnType<typeof listListeningPids>>} */
  const firstPass = new Map();
  let lookupFailed = false;

  for (const port of inspectPorts) {
    const result = listListeningPids(port);
    firstPass.set(port, result);
    console.log(formatPortLine(port, result));
    if (!result.ok) lookupFailed = true;
  }

  if (lookupFailed) {
    console.error("");
    console.error(
      "[kill-dev-ports] 포트 조회에 실패했습니다. 위 ERROR를 확인하세요.",
    );
    process.exit(1);
  }

  if (!force) {
    console.log("");
    console.log("아무 프로세스도 종료하지 않았습니다.");
    printParentHint();
    process.exit(0);
  }

  // --force --port N: 해당 포트만, 재조회 후 일치하는 PID만 종료
  console.log("");
  for (const port of forcePorts) {
    const before = firstPass.get(port);
    if (!before || !before.ok) {
      console.error(`port ${port}: 조회 실패로 종료를 건너뜁니다.`);
      continue;
    }
    if (!before.pids.length) {
      console.log(`port ${port}: 리스너 없음 — 종료할 PID 없음`);
      continue;
    }

    const recheck = listListeningPids(port);
    if (!recheck.ok) {
      console.error(`port ${port}: 재조회 실패 — ${recheck.error} (종료하지 않음)`);
      continue;
    }

    const beforeSet = new Set(before.pids);
    const stable = recheck.pids.filter((pid) => beforeSet.has(pid));
    const changed = recheck.pids.filter((pid) => !beforeSet.has(pid));
    const gone = before.pids.filter((pid) => !recheck.pids.includes(pid));

    if (gone.length) {
      console.log(
        `port ${port}: 재조회 시 사라진 PID (종료 안 함): ${gone.join(", ")}`,
      );
    }
    if (changed.length) {
      console.log(
        `port ${port}: 재조회 시 새로 나타난 PID (종료 안 함): ${changed.join(", ")}`,
      );
    }
    if (!stable.length) {
      console.log(`port ${port}: 일치하는 PID 없음 — 종료하지 않음`);
      continue;
    }

    console.log(
      `port ${port}: 종료 대상 PID ${stable.join(", ")}`,
    );
    for (const pid of stable) {
      try {
        process.kill(pid);
        console.log(`  killed pid ${pid}`);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log(`  kill failed pid ${pid}: ${msg}`);
      }
    }

    const after = listListeningPids(port);
    console.log(`  종료 후: ${formatPortLine(port, after)}`);
  }

  printParentHint();
  console.log("done");
}

main();
