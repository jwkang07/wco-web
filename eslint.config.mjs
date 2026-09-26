import { createRequire } from "module";

const require = createRequire(import.meta.url);
const nextVitals = require("eslint-config-next/core-web-vitals");
const nextTs = require("eslint-config-next/typescript");

/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      ".next/**",
      ".next-dev/**",
      ".next-verify-build/**",
      ".next-prod-verify/**",
      "node_modules/**",
      ".tmp/**",
      ".tmp-*/**",
      ".tmp-*.js",
      ".docx-work/**",
      "docs/share/**",
      "scripts/**/*.cjs",
      "scripts/**/*.mjs",
      "next-env.d.ts",
    ],
  },
  ...nextVitals,
  ...nextTs,
];

export default eslintConfig;
