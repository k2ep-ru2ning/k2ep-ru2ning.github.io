import path from "node:path";

function buildEslintCommand(filenames) {
  return `eslint --fix ${filenames
    .map((f) => `"${path.relative(process.cwd(), f)}"`)
    .join(" ")}`;
}

/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{js,mjs,jsx,ts,tsx}": [buildEslintCommand, "prettier --write"],
  "*.{md,mdx,css,json}": ["prettier --write"],
};

export default config;
