/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "selector",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
