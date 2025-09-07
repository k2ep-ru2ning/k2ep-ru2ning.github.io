import { JetBrains_Mono, Asta_Sans } from "next/font/google";

export const jetbrainsMono = JetBrains_Mono({
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const astaSans = Asta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-asta-sans",
});
