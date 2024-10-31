import localFont from "next/font/local";

const jetbrainsMono = localFont({
  src: [
    {
      path: "./JetBrainsMono-Thin.woff2",
      weight: "100",
      style: "normal",
    },
    {
      path: "./JetBrainsMono-ExtraLight.woff2",
      weight: "200",
      style: "normal",
    },
    {
      path: "./JetBrainsMono-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./JetBrainsMono-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./JetBrainsMono-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./JetBrainsMono-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./JetBrainsMono-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./JetBrainsMono-ExtraBold.woff2",
      weight: "800",
      style: "normal",
    },
    {
      path: "./JetBrainsMono-ThinItalic.woff2",
      weight: "100",
      style: "italic",
    },
    {
      path: "./JetBrainsMono-ExtraLightItalic.woff2",
      weight: "200",
      style: "italic",
    },
    {
      path: "./JetBrainsMono-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./JetBrainsMono-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./JetBrainsMono-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./JetBrainsMono-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./JetBrainsMono-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "./JetBrainsMono-ExtraBoldItalic.woff2",
      weight: "800",
      style: "italic",
    },
  ],
  variable: "--font-jetbrains-mono",
});

export default jetbrainsMono;
