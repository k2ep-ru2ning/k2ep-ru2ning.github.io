import path from "node:path";

function buildEslintCommand(filenames) {
  return `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;
}

/**
 * @type {import('lint-staged').Configuration}
 */
const config = {
  "*.{js,mjs,jsx,ts,tsx}": [buildEslintCommand, "prettier --write"],
  "*.{md,mdx,css,json}": ["prettier --write"],
};

export default config;
