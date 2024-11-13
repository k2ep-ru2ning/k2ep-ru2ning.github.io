import typography from "@tailwindcss/typography";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "selector",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
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
};

export default config;
