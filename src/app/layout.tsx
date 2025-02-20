import "@/styles/globals.css";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import Footer from "@/components/footer";
import Header from "@/components/header";
import jetbrainsMono from "@/fonts/jetbrains-mono";
import pretendard from "@/fonts/pretendard";
import initializeThemeFromLocal from "@/scripts/initialize-theme-from-local";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${jetbrainsMono.variable} scroll-smooth antialiased`}
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
          {/* mobile에서 scroll to top button이 헤더에 가려질 수 있도록 z-index 설정 */}
          <div className="z-10 sticky top-0 bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-3xl lg:max-w-5xl w-full mx-auto">
              <Header />
            </div>
          </div>
          <main className="px-2 py-6 grow max-w-3xl lg:max-w-5xl w-full mx-auto">
            {children}
          </main>
          <div className="max-w-3xl lg:max-w-5xl w-full mx-auto border-t-1 border-zinc-300 dark:border-zinc-700">
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
    default: "k2ep-ru2ning | Software Engineer & Front-end Web Developer",
  },
  description:
    "k2ep-ru2ning의 개발 블로그. 개발하면서 배우고 경험한 내용을 정리하는 공간.",
  authors: [{ name: "k2ep-ru2ning" }],
};
