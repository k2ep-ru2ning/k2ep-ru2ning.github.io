/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: "selector",
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "code:not([data-language])": {
              display: "inline-block",
              "background-color": theme("colors.zinc.100"),
              "border-radius": theme("borderRadius.md"),
              "padding-left": theme("spacing[1.5]"),
              "padding-right": theme("spacing[1.5]"),
              color: theme("colors.indigo.500"),
              "&::before": {
                display: "none",
              },
              "&::after": {
                display: "none",
              },
            },
            ".dark code:not([data-language])": {
              "background-color": theme("colors.zinc.800"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
