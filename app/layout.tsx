import "./_style/globals.css";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import pretendard from "./_font/pretendard";
import Header from "./_component/header";
import Footer from "./_component/footer";
import initializeThemeFromLocal from "./_util/initialize-theme-from-local";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${initializeThemeFromLocal.toString()})();`,
          }}
        />
      </head>
      <body
        className={`${pretendard.className} bg-zinc-50 dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50`}
      >
        <div className="px-4 max-w-screen-md mx-auto min-h-dvh flex flex-col">
          <Header />
          <div className="px-2 grow">{children}</div>
          <Footer />
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
