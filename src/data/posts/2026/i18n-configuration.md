---
title: "React 앱에서 다국어 처리 및 트러블 슈팅"
description: "React 앱에서 다국어 처리하는 방법, i18next-cli 도입 후기, react-hook-form/zod와 함께 사용할 때 발생한 문제의 해결 과정을 정리한 글"
createdAt: 2026-07-12
tags:
  - "회고"
  - "React"
  - "i18n"
  - "개발 환경 설정"
  - "Troubleshooting"
seriesId: "업무 회고록"
---

회사에서 새로운 프로젝트(신생아 대상 유전자 검사 주문 애플리케이션)를 진행하는 과정에서 다국어 처리 설정을 하게 되었다.

React 앱에서 `i18next` 패키지를 활용해 다국어 처리를 할 수 있도록 설정했다. 또 번역 키 자동 완성과 타입 체크를 위해서 `i18next-cli`도 도입했다. 또, `react-hook-form`과 `zod`를 활용해 폼 검증을 하는 환경에서 에러 메시지 다국어 처리할 때, 겪은 문제를 해결했던 과정을 정리했다.

## React 앱에서 다국어 처리 설정하기

### 기본 설정

React 앱에서 다국어 처리를 하기 위해서는 `i18next`, `react-i18next` 패키지가 필요하다.

- `i18next`: 다국어 처리를 하기 위한 핵심 기능을 제공 (언어 리소스 관리, 언어 변경 등의 핵심 기능)
- `react-i18next`: React 앱에서 `i18next`의 기능을 편하게 쓸 수 있도록 도와주는 패키지

먼저 i18next 패키지가 제공하는 i18n 인스턴스를 설정하는 파일을 작성한다.

```ts title="src/i18n/init.ts" showLineNumbers {4-6,9,13-14,17,23-29}
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    common: {
      pending: "loading...",
    },
    signUp: {
      pending: "creating an account...",
    },
  },
  ko: {
    common: {
      pending: "로딩...",
    },
    signUp: {
      pending: "계정 생성 중...",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  interpolation: {
    escapeValue: false,
  },
});
```

- `resources`는 언어와 네임스페이스에 따라 키를 어떤 값으로 해석할지 정의한 객체이다.
  - `en`, `ko`가 언어이고, `common`, `signUp`이 네임스페이스이다.
- `lng`는 초기에 선택된 언어이다.
- `interpolation.escapeValue`는 React가 기본적으로 값을 이스케이프 처리하기 때문에, 사용하지 않는다고 설정했다.
- React 앱에서 `useTranslation` hook으로 i18n 인스턴스에 접근하기 위해서는 `use(initReactI18next)` 설정이 필요하다.

```tsx title="src/main.tsx" showLineNumbers {4}
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import "./i18n/init.ts";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

React 앱의 엔트리 파일인 `main.tsx`에서, 앞서 만든 i18n 인스턴스 설정 파일을 import 하면 된다. 그러면, 컴포넌트 내에서 `useTranslation` hook으로 `i18n` 인스턴스와 `t` 함수에 접근할 수 있다.

```tsx title="src/app.tsx" showLineNumbers {4, 7, 11, 25, 29}
import { useTranslation } from "react-i18next";

export default function App() {
  const { t, i18n } = useTranslation();

  const handleClickEN = () => {
    i18n.changeLanguage("en");
  };

  const handleClickKO = () => {
    i18n.changeLanguage("ko");
  };

  return (
    <div>
      <div>
        <button type="button" onClick={handleClickEN}>
          영어
        </button>
        <button type="button" onClick={handleClickKO}>
          한국어
        </button>
      </div>
      <div>
        일반적인 컨텍스트에서 pending의 의미: <span>{t("common:pending")}</span>
      </div>
      <div>
        회원 가입 컨텍스트에서 pending의 의미:{" "}
        <span>{t("pending", { ns: "signUp" })}</span>
      </div>
    </div>
  );
}
```

- `i18n.changeLanguage`을 호출해 언어를 변경할 수 있다.
- `t` 함수에 네임스페이스와 키을 넘겨서, 번역된 값을 얻을 수 있다.
  - `t("네임스페이스:키")` 형태로 호출하거나 `t("키", { ns: "네임스페이스" })` 형태로 호출할 수 있다.

![result-basic](/images/posts/2026/i18n-configuration/result-basic.gif)

### 번역 리소스를 json 파일로 분리해 관리하기 (i18next-http-backend)

앞에서는 리소스를 자바스크립트 객체로 관리했고, i18n 인스턴스를 초기화할 때 리소스를 등록했다.
`i18next-http-backend` 플러그인을 활용하면, json 파일 형태로 리소스를 관리할 수 있다. 또 해당 리소스가 필요할 때가 되었을 때, 가져올 수 있다. (지연 로딩)

설정 파일을 다음과 같이 수정한다.

```ts title="src/i18n/init.ts" showLineNumbers {3, 7, 10, 14-16}
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .init({
    lng: "en",
    ns: ["common", "signUp"],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
  });
```

- `i18next-http-backend` 플러그인을 i18n 인스턴스에 적용했다. (7번째 줄)
- 리소스 파일의 경로를 설정했다. (14-16번째 줄)
- 애플리케이션에서 사용할 네임스페이스를 명시했다. (10번째 줄)
  - 리소스를 직접 `init`에 등록할 때는 그 안에 네임스페이스 정보가 있었지만, 이제는 별도로 `ns` 옵션을 설정해야 함

설정한 리소스 파일의 경로에 맞게, 리소스 파일을 생성한다. Vite 기준으로 `public` 폴더 하위에 `locales` 폴더를 만든다.

![resources-file-location](/images/posts/2026/i18n-configuration/resources-file-location.png)

실행시키면, 다음과 같이 한국어 리소스가 필요할 때 가져오는 걸 확인할 수 있다.

![result-backend-plugin](/images/posts/2026/i18n-configuration/result-backend-plugin.gif)

그런데, 중간에 `locales/dev/common.json`처럼 `dev`라는 언어코드가 들어간 파일을 요청하는 걸 볼 수 있다.

이는 `fallbackLng` 설정 때문이다.
특정 언어가 선택되었고 그 언어의 리소스 파일에 찾으려는 키가 없는 경우, `fallbackLng`에 설정된 언어의 리소스 파일에서 대신 찾게 된다. 예를 들어서 `fallbackLng`이 `ko`이고, 현재 선택된 언어가 `en`일 때, 찾으려는 키가 `en` 리소스에 없으면, `fallbackLng`인 `ko` 리소스에서 해당 키를 찾아보는 것이다.

`fallbackLng`의 기본값은 `dev`이다.
`i18next-http-backend`이 `lng`인 `en` 뿐만 아니라 `fallbackLng`인 `dev` 리소스까지 초기에 요청하기 때문에, 위와 같은 `locales/dev/common.json` 파일도 요청하게 된 것이다. 그래서 이런 `dev` 리소스 관련 요청이 생기는 걸 막고, `en`만 초기에 가져오게 하려면 `fallbackLng`도 명시적으로 `en`으로 설정하면 된다.

### 궁금했던 것: i18n 인스턴스의 useSuspense 옵션은 뭘까?

i18n 인스턴스를 초기화할 때 설정하는 옵션 중, `react.useSuspense` 라는 옵션이 있다. 기본값은 `true`이다.

이름에서 유추할 수 있듯이, 비동기적으로 번역 리소스를 가져오는 동안 fallback을 표시하고, 번역 리소스 로드가 끝나면 번역 리소스를 사용하는 컴포넌트들을 렌더링해주는 기능이다. 가장 쉬운 방법은 App 컴포넌트를 감싸는 전역 Suspense를 하나 두고 fallback도 설정하는 것이다.

렌더링된 컴포넌트 내에서 항상 번역 리소스가 준비되었음이 보장되기 때문에, 렌더링 된 이후에 화면이 깜빡이지 않고, `useTranslation`으로 접근한 `ready` 플래그도 항상 `true`가 된다.

만약 이 옵션을 `false`로 두면, 번역 리소스가 준비되지 않았더라도, 리소스를 사용하는 컴포넌트를 렌더링한다. 그래서 컴포넌트 내에서 `t` 함수를 사용해 번역 리소스를 참조했을 때, 아직 리소스가 없으면 번역 키가 화면에 표시되었다가, 리소스를 가져온 다음에야 번역된 값으로 표시된다. `ready` 플래그의 값도 리소스가 로드 되기 전에는 `false`였다가 로드 된 후에 `true`가 된다.

### 웹 페이지 로드 할 때, 언어 감지하기 (i18next-browser-languagedetector)

현재까지의 i18n 설정에서는 `lng` 옵션을 `en`으로 두었다. 그래서 페이지를 열 때마다 초기에 `en`이 기본 언어로 설정된다.

코드에 정적으로 설정한 언어가 아니라, 페이지가 열릴 때마다 언어를 감지해서 초기 언어를 i18n 인스턴스에 설정해줄 수 있다. `i18next-browser-languagedetector` 플러그인을 활용하면 된다.

이는, 접속한 국가에 따라 초기 언어를 정해주거나, 사용자가 마지막에 선택한 언어로 초기 언어를 정해주는 요구사항을 구현할 때 유용하다.

```ts title="src/i18n/init.ts" showLineNumbers {4, 9, 22-25}
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en",
    ns: ["common", "signUp"],
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    react: {
      useSuspense: true,
    },
    supportedLngs: ["en", "ko"],
    detection: {
      order: ["htmlTag"],
    },
  });
```

- `i18next-browser-languagedetector` 플러그인을 추가했다.
- `lng` 옵션을 지웠다.
  - 이 옵션은 `i18next-browser-languagedetector` 플러그인이 감지한 언어를 덮어쓰는 옵션이기에 지웠다.
  - 어차피 초기 언어 설정을 `i18next-browser-languagedetector` 으로 할 것이므로 지워야 하는 옵션이다.
- `supportedLngs` 옵션을 추가했다.
  - `i18next-browser-languagedetector` 문서에서 추가하길 권장하는 옵션이다.
  - `supportedLngs`은 이 i18n 인스턴스가 지원하는 언어 리소스를 정의하는 옵션이다.
  - "`changeLanguage` 메서드에 전달한 인자값" 혹은 "언어 감지 플러그인이 감지한 언어"를 이 i18n 인스턴스가 제공하는 언어인지 판단할 때 사용하는 옵션이다. 만약 요청한 언어 리소스를 이 i18n 인스턴스가 제공하지 않으면 fallbackLng 리소스를 사용하게 된다.
- `detection.order` 옵션에는 언어를 어디서 감지할지 명시할 수 있다. `htmlTag`라고 적었으므로 일단 `html` 태그의 `lang` 애트리뷰트를 참조해 언어를 감지한다.

```tsx title="src/app.tsx" showLineNumbers {17}
import { useTranslation } from "react-i18next";

export default function App() {
  const { t, i18n } = useTranslation();

  const handleClickEN = () => {
    i18n.changeLanguage("en");
  };

  const handleClickKO = () => {
    i18n.changeLanguage("ko");
  };

  return (
    <div>
      <div>
        <div>resolved language: {i18n.resolvedLanguage}</div>
        <button type="button" onClick={handleClickEN}>
          영어
        </button>
        <button type="button" onClick={handleClickKO}>
          한국어
        </button>
      </div>
      <div>
        일반적인 컨텍스트에서 pending의 의미: <span>{t("common:pending")}</span>
      </div>
      <div>
        회원 가입 컨텍스트에서 pending의 의미:{" "}
        <span>{t("pending", { ns: "signUp" })}</span>
      </div>
    </div>
  );
}
```

17번째 줄에 추가한 `i18n.resolvedLanguage`을 통해서 현재 선택된 언어를 알 수 있다.

![result-language-detector-plugin](/images/posts/2026/i18n-configuration/result-language-detector-plugin.gif)

`lng: en` 옵션을 제거했지만, `index.html`에 `<html lang="en">`으로 작성했기 때문에, 언어 감지 플러그인에 의해 페이지를 새로 고침했을 때 `en`으로 선택된다.
