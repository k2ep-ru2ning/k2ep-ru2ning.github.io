import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";

// esm에서 cjs의 __filename, __dirname 변수를 흉내내기 위함.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // compat.config: ESLintRC-style config를 flag-config-style config로 변환.
  ...compat.config({
    extends: [
      "next/core-web-vitals", // next: next의 기본 config, next/core-web-vitals: 조금 더 엄격한 config.
      "next/typescript", // 'plugin:@typescript-eslint/recommended'와 동일.
      "prettier", // eslint-config-prettier, prettier와 충돌할 수 있는 rule들을 off.
    ],
    rules: {
      // eslint-config-next에 eslint-plugin-import가 포함되어 있음.
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // 내장 모듈
            "external", // 외부 라이브러리
            "internal", // 내부 모듈
            "sibling", // 형제 모듈
            "parent", // 부모 모듈
            "index",
            "object",
            "type",
          ],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  }),
];

export default eslintConfig;
