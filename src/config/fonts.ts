import { JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

export const jetbrainsMono = JetBrains_Mono({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const pretendard = localFont({
  src: "./PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});
