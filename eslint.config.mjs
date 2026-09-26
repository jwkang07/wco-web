import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

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
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
