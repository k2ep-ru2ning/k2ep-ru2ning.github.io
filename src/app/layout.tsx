import "@/styles/globals.css";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import jetbrainsMono from "@/fonts/jetbrains-mono";
import pretendard from "@/fonts/pretendard";
import { initializeThemeFromLocal } from "@/utils/theme";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${initializeThemeFromLocal.toString()})();`,
          }}
        />
      </head>
      <body
        className={
          "font-sans bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50"
        }
      >
        <div className="px-4 min-h-dvh flex flex-col">
          <div className="sticky top-0 bg-zinc-50 dark:bg-zinc-950 max-w-screen-md lg:max-w-screen-lg w-full mx-auto">
            <Header />
          </div>
          <main className="px-2 py-6 grow max-w-screen-md lg:max-w-screen-lg w-full mx-auto">
            {children}
          </main>
          <div className="max-w-screen-md lg:max-w-screen-lg w-full mx-auto">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: "%s | k2ep-ru2ning",
    default: "k2ep-ru2ning",
  },
  description: "프로그래밍 관련 지식/경험을 기록/회고하는 공간",
  authors: [{ name: "k2ep-ru2ning" }],
};
