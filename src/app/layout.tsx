import "@/styles/globals.css";
import { type Metadata } from "next";
import { type ReactNode } from "react";
import { LogoLink } from "@/components/logo-link";
import { Menu } from "@/components/menu/menu";
import { owner } from "@/config/const";
import { jetbrainsMono, pretendard } from "@/config/fonts";
import { themeClassInitializationScript } from "@/utils/theme";

type Props = {
  children: ReactNode;
};

export default function RootLayout({ children }: Props) {
  const year = new Date().getFullYear();

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
        {/* 
          grid-template-columns: 1fr minmax(0,var(--content-max-width)) 1fr;
          3단 컬럼 중, 가운데 컬럼에 max-width: var(--content-max-width); width: 100%; 설정한 것과 같은 효과
          좌우 컬럼은 동일한 비율로 나눔
        */}
        <div className="px-4 min-h-dvh grid gap-y-6 grid-cols-[1fr_minmax(0,var(--content-max-width))_1fr] grid-rows-[var(--header-height)_1fr_var(--footer-height)]">
          {/* scroll to top button이 헤더에 가려질 수 있도록 z-index 설정 */}
          <header className="row-start-1 col-start-2 bg-background text-foreground z-10 sticky top-0 flex items-center justify-between">
            <LogoLink />
            <Menu />
          </header>
          <div className="row-start-2 col-span-full">{children}</div>
          <footer className="px-(--content-horizontal-padding) row-start-3 col-start-2 border-t border-border flex flex-col justify-center items-center">
            <small>
              &copy; {year} {owner}
            </small>
          </footer>
        </div>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: {
    template: `%s | ${owner}`,
    default: `${owner} | Software Engineer & Front-end Web Developer`,
  },
  description: `개발자 ${owner}의 개인 웹사이트이자 기술 블로그. 개발하면서 배우고 경험한 내용을 정리하는 공간입니다.`,
  authors: [{ name: owner }],
};
