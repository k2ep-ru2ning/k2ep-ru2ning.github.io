import path from "node:path";

function buildEslintCommand(filenames) {
  return `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(" --file ")}`;
}

const config = {
  "*.{ts,tsx}": [buildEslintCommand, "prettier --write"],
  "*.{md,mdx,css}": "prettier --write",
};

export default config;
