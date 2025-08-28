import "@/styles/globals.css";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { jetbrainsMono, pretendard } from "@/config/fonts";
import { themeClassInitializationScript } from "@/utils/theme";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html
      lang="ko"
      className={`${pretendard.variable} ${jetbrainsMono.variable} scroll-smooth antialiased`}
      // 서버에서 HTML을 받고나서 script로 html 태그에 dark class를 주입하기 때문에,
      // 하이드레이션할 때, html의 class 속성이 서버에서 가져온 것과 달라졌다고 에러를 발생시킴.
      // 이걸 허용하기 위한 옵션.
      suppressHydrationWarning
    >
      <head>
        {/* Next의 Script 컴포넌트를 beforeInteractive strategy로 사용해도 새로고침 시 스크립트가 늦게 적용되어 깜빡이는 문제 발생 */}
        {/* 그래서 그냥 script 태그 활용 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeClassInitializationScript.toString()})();`,
          }}
        />
      </head>
      <body>
        <div className="px-4 min-h-dvh flex flex-col">
          {/* mobile에서 scroll to top button이 헤더에 가려질 수 있도록 z-index 설정 */}
          <div className="z-10 sticky top-0 bg-background">
            <div className="max-w-3xl lg:max-w-5xl w-full mx-auto">
              <Header />
            </div>
          </div>
          <main className="px-2 py-6 grow max-w-3xl lg:max-w-5xl w-full mx-auto">
            {children}
          </main>
          <div className="max-w-3xl lg:max-w-5xl w-full mx-auto border-t border-border">
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
    "개발자 k2ep-ru2ning의 개인 웹사이트이자 기술 블로그. 개발하면서 배우고 경험한 내용을 정리하는 공간입니다.",
  authors: [{ name: "k2ep-ru2ning" }],
};
