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
  plugins: [require("@tailwindcss/typography")],
};

export default config;
