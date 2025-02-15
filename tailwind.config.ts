import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  darkMode: "selector",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-pretendard)"],
        mono: ["var(--font-jetbrains-mono)"],
      },
    },
  },
  plugins: [typography],
} satisfies Config;
