import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nextBin = require.resolve("next/dist/bin/next");

let stopping = false;
let child = null;

function start() {
  console.log("[dev] Starting Next.js dev server (.next-dev)…");

  child = spawn(process.execPath, [nextBin, "dev", "--turbopack", "-H", "0.0.0.0"], {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_DIST_DIR: ".next-dev",
    },
  });

  child.on("exit", (code, signal) => {
    if (stopping) {
      process.exit(code ?? 0);
      return;
    }

    if (signal === "SIGINT" || signal === "SIGTERM") {
      process.exit(0);
      return;
    }

    console.log(
      `[dev] Server stopped (code ${code ?? "unknown"}). Restarting in 2s…`,
    );
    setTimeout(start, 2000);
  });
}

function shutdown() {
  stopping = true;
  if (child && !child.killed) {
    child.kill("SIGTERM");
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

start();
