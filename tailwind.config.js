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
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
