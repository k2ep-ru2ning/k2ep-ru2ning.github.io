import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "selector",
  content: ["./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
