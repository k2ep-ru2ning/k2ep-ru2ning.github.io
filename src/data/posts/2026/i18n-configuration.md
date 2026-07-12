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

- React 앱에서 `i18next` 패키지를 활용해 다국어 처리를 할 수 있도록 설정했다.
- 번역 키 자동 완성과 타입 체크를 위해서 `i18next-cli`도 도입했다.
- `react-hook-form`과 `zod`를 활용해 폼 검증을 하는 환경에서 에러 메시지 다국어 처리할 때, 겪은 문제를 해결했던 과정을 정리했다.

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

### 번역 리소스를 json 파일로 분리해 관리하기 (`i18next-http-backend`)

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

### 궁금했던 것: i18n 인스턴스의 `useSuspense` 옵션은 뭘까?

i18n 인스턴스를 초기화할 때 설정하는 옵션 중, `react.useSuspense` 라는 옵션이 있다. 기본값은 `true`이다.

이름에서 유추할 수 있듯이, 비동기적으로 번역 리소스를 가져오는 동안 fallback을 표시하고, 번역 리소스 로드가 끝나면 번역 리소스를 사용하는 컴포넌트들을 렌더링해주는 기능이다. 가장 쉬운 방법은 App 컴포넌트를 감싸는 전역 Suspense를 하나 두고 fallback도 설정하는 것이다.

렌더링된 컴포넌트 내에서 항상 번역 리소스가 준비되었음이 보장되기 때문에, 렌더링 된 이후에 화면이 깜빡이지 않고, `useTranslation`으로 접근한 `ready` 플래그도 항상 `true`가 된다.

만약 이 옵션을 `false`로 두면, 번역 리소스가 준비되지 않았더라도, 리소스를 사용하는 컴포넌트를 렌더링한다. 그래서 컴포넌트 내에서 `t` 함수를 사용해 번역 리소스를 참조했을 때, 아직 리소스가 없으면 번역 키가 화면에 표시되었다가, 리소스를 가져온 다음에야 번역된 값으로 표시된다. `ready` 플래그의 값도 리소스가 로드 되기 전에는 `false`였다가 로드 된 후에 `true`가 된다.

### 웹 페이지 로드 할 때, 언어 감지하기 (`i18next-browser-languagedetector`)

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

### 궁금했던 것: `i18n.language`, `i18n.languages`, `i18n.resolvedLanguage` 차이점은 뭘까?

간단히 정리하면...

- `i18n.language`: "`i18n.changeLanguage`에 전달한 인자" 혹은 "언어 감지 플러그인이 감지한 값". 즉 i18n을 사용하는 쪽에서 **i18n에게 요청한/원하는 언어 리소스**
- `i18n.languages`: i18n 인스턴스가 키를 찾기 위해 탐색할 언어 리소스를 순서대로 명시한 배열. 만약 `["ko", "en"]`이라면, 키를 찾을 때 언어 리소스를 `ko` -> `en` 순으로 탐색한다는 뜻. 보통 `fallbackLng`이 마지막 요소로 위치함
- `i18n.resolvedLanguage`: 실제로 i18n이 가지고 있고, 사용할 언어 리소스

헷갈릴 수 있는 부분은 `i18n.resolvedLanguage`가 `ko`이더라도, 모두 한국어로 번역된다는 뜻은 아니라는 것이다.

`i18n.resolvedLanguage`가 `ko`이더라도, `ko` 리소스에 찾으려는 키가 없다면 먼저 `fallbackLng` 언어 리소스에서 키를 찾으려고 할테고, 그 리소스에도 없으면 화면에는 그냥 번역 키가 렌더링될 것이다.

또한 `i18n.language`/`i18n.languages`는 `supportedLngs` 옵션에 영향을 받는다. 일단 `supportedLngs`을 지우고, 테스트를 해보자 (이전과 동일하게 `en`, `ko` 2개의 언어 리소스가 존재하는 상황이다.)

```ts title="src/i18n/init.ts" showLineNumbers {22}
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
    // supportedLngs: ["en", "ko"],
    detection: {
      order: ["htmlTag"],
    },
  });
```

```tsx title="src/app.tsx" showLineNumbers
import { useTranslation } from "react-i18next";
import { useState } from "react";

const LANGUAGE_OPTIONS = [
  {
    code: "en",
    label: "영어 (en)",
  },
  {
    code: "en-GB",
    label: "영국 영어 (en-GB)",
  },
  {
    code: "ko",
    label: "한국어 (ko)",
  },
  {
    code: "es",
    label: "스페인어 (es)",
  },
];

export default function App() {
  const { t, i18n } = useTranslation();
  const [selected, setSelected] = useState(i18n.resolvedLanguage);

  return (
    <div>
      <div>
        <div>language: {i18n.language}</div>
        <div>languages: {i18n.languages.join(", ")}</div>
        <div>resolved language: {i18n.resolvedLanguage}</div>
        {LANGUAGE_OPTIONS.map(({ code, label }) => (
          <button
            key={code}
            style={{
              backgroundColor: selected === code ? "salmon" : undefined,
            }}
            type="button"
            onClick={() => {
              i18n.changeLanguage(code);
              setSelected(code);
            }}
          >
            {label}
          </button>
        ))}
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

![comparison-no-supported-lngs-1](/images/posts/2026/i18n-configuration/comparison-no-supported-lngs-1.png)

- 언어 코드 뒤에 지역을 대문자로 적으면 언어 리소스를 조금 더 구체적으로 명시할 수 있다. `en-GB`는 영국에서 쓰는 영어, `en-US`는 미국에서 쓰는 영어를 의미한다.
- 영국 영어 버튼을 클릭하면, 사용자가 i18n 인스턴스에게 요청한 리소스는 `en-GB`이다. 그래서 `i18n.language` 값이 `en-GB`이다.
- `fallbackLng`을 `en`으로 설정했기에 i18n의 번역 키 탐색 순서는 `en-GB` → `en` 순이 된다. 이 값이 `i18n.languages`이다.
- 실제로 `en-GB` 리소스가 없기 때문에 i18n은 `en`을 처음으로 탐색 시작할 언어 리소스로 선택한다. 이 값이 `i18n.resolvedLangauge`이다.

![comparison-no-supported-lngs-2](/images/posts/2026/i18n-configuration/comparison-no-supported-lngs-2.png)

- 스페인어 버튼을 클릭하면, 사용자가 i18n 인스턴스에게 요청한 리소스는 `es`이다. 그래서 `i18n.language` 값이 `es`이다.
- `fallbackLng`을 `en`으로 설정했기에 i18n의 번역 키 탐색 순서는 `es` → `en` 순이 된다. 이 값이 `i18n.languages`이다.
- 실제로 `es` 리소스가 없기 때문에 i18n은 `en`을 처음으로 탐색 시작할 언어 리소스를 선택한다. 이 값이 `i18n.resolvedLangauge`이다.

앞서 `supportedLngs` 옵션 값에 따라서 `i18n.language`, `i18n.languages` 값이 영향을 받는다고 했다. 다시 주석을 해제하자. 추가로 `fallbackLng`도 `en`에서 `ko`로 설정해보자.

```ts title="src/i18n/init.ts" showLineNumbers {11, 22}
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .use(LanguageDetector)
  .init({
    fallbackLng: "ko",
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

![comparison-supported-lngs-1](/images/posts/2026/i18n-configuration/comparison-supported-lngs-1.png)

- 영국 영어 버튼을 클릭하면, 사용자가 i18n 인스턴스에게 요청한 리소스는 `en-GB`이다. 하지만, `supportedLngs`에 `en-GB`가 없어서, 지역 정보를 제외한 `en`으로 `i18n.language`가 변경되었다.
- 비슷한 맥락으로 `i18n.languages`도 `["en-GB", "ko"]`가 아니라 `["en", "ko"]`가 되었다.

![comparison-supported-lngs-2](/images/posts/2026/i18n-configuration/comparison-supported-lngs-2.png)

- 스페인어 버튼을 클릭하면, 사용자가 i18n 인스턴스에게 요청한 리소스는 `es`이다. 하지만, `supportedLngs`에 `es`가 없어서, `fallbackLng`인 `ko`로 `i18n.language`가 변경되었다.
- 비슷한 맥락으로 `i18n.languages`도 `["es", "ko"]`가 아니라 `["ko"]`가 되었다.

즉, i18n은 `supportedLngs` 옵션을 반영해서 `i18n.language`, `i18n.languages` 값을 정하려고 한다.

### 웹 페이지에 다시 방문했을 때, 유저가 마지막으로 선택했던 언어 유지하기 (`i18next-browser-languagedetector` + 로컬 스토리지)

사용자가 서비스에 처음 진입했을 때는 (`htmlTag` 옵션 설정을 통해서) `html` 태그의 `lang` 애트리뷰트에 적힌 언어를 감지해서 언어 리소스를 선택했다고 해도, 이후 방문에는 사용자가 마지막으로 선택한 언어를 선택되게 하고 싶을 수 있다.

로컬 스토리지에 사용자가 선택한 언어를 기록해두고, 언어 감지 플러그인이 로컬 스토리지로부터 언어를 감지하게 만들면 된다.

```ts title="src/i18n/init.ts" showLineNumbers {24}
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .use(LanguageDetector)
  .init({
    fallbackLng: "en", // 다시 "ko" -> "en"으로 수정.
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
      order: ["localStorage", "htmlTag"],
    },
  });
```

`detection.order`에 `"localStorage"`만 추가하면 된다.

![result-language-detector-localstorage](/images/posts/2026/i18n-configuration/result-language-detector-localstorage.gif)

사용자가 영어에서 한국어를 선택하고, 새로고침 했는데 한국어가 유지되었다.

### 접속한 위치(나라) 정보 기반으로 언어 감지하기

회사에서는 CloudFront를 활용해서 프론트엔드를 배포하고 있었고, CloudFront function을 활용해 `KR`, `US` 같은 국가 코드를 쿠키로 내려 주고 있었다. 즉 쿠키 값을 보고 어떤 나라에서 접속했는지 알 수 있는 상황이다.

사용자가 웹 페이지를 열었을 때, 접속 국가를 기반으로 초기 언어를 설정해야하는 요구사항을 구현해야 했다.

이번 글에서는 요구사항을 좀 더 간단하게 만들어서, 한국에서 접속했을 때는 한국어로 표시하고 이외의 국가에서 접근했을 때는 영어로 표시해야하는 요구사항이 있다고 하자.

그럼 국가 코드 쿠키를 파싱하고, `KR`이면 언어 코드 `ko`로, 그외의 국가 코드에 대해서는 언어 코드 `en`으로 매핑하는 로직을 언어 감지 플러그인에 등록하면 된다.

먼저, 국가 코드 쿠키로부터 적절한 언어 코드를 계산하는 함수를 작성한다.

```ts title="src/detect-language-code-from-country-code-cookie.ts" showLineNumbers
// 쿠키를 다루기 쉽게 도와주는 js-cookie 유틸 라이브러리
import Cookies from "js-cookie";

export function detectLanguageCodeFromCountryCodeCookie() {
  const countryCodeCookie = Cookies.get("country-code");

  // 국가 코드에서 언어 코드로 매핑하는 로직을 작성한다.
  if (countryCodeCookie === "KR") {
    return "ko";
  }
  return "en";
}
```

그리고 작성한 함수를 커스텀 detector로 등록하면 된다.

```ts title="src/i18n/init.ts" showLineNumbers {7-11, 30-32}
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { detectLanguageCodeFromCountryCodeCookie } from "../detect-language-code-from-country-code-cookie.ts";

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: "countryCodeCookie",
  lookup: () => detectLanguageCodeFromCountryCodeCookie(),
});

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .use(languageDetector)
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
      order: ["localStorage", "countryCodeCookie", "htmlTag"],
    },
  });
```

- `"countryCodeCookie"`라는 이름의 커스텀 detector를 정의했고, 탐지 순서는 `"localStorage"` → `"countryCodeCookie"` → `"htmlTag"` 순으로 등록했다.
- 유저가 첫 방문시에는 로컬 스토리지에 저장된 언어 코드가 없을 테니 국가 코드 쿠키 기반으로 언어를 감지할 것이고, 재 방문시에는 로컬 스토리지에 저장된 언어 코드로 초기 언어 리소스를 선택하게 만들었다.

![result-language-detector-custom](/images/posts/2026/i18n-configuration/result-language-detector-custom.gif)

첫방문시 국가 코드가 `KR`이어서 `ko` 리소스가 선택되고, 유저가 `en` 리소스를 선택한 후, 새로고침시에는 로컬 스토리지 디텍터에 의해 `en` 리소스가 선택되는 시나리오를 시뮬레이션 한 것이다.

## 번역 키 자동 완성 및 타입 체크 (`i18next-cli` 도입 후기)

IDE에서 번역 키 자동 완성 및 타입 체크가 되면 편할 거 같았다. 여러가지 방법이 있겠지만 i18next 공식문서를 살펴보다가 `i18next-cli`를 알게되었고, 이를 활용해서 번역키 자동 완성 및 타입 체크가 가능하도록 설정했다.

`i18next-cli`는 명령어를 통해서

- UI 코드로 부터 번역 키를 추출해 리소스 파일에 반영하고,
- 번역 키 타입을 정의하며,
- 여러 리소스의 상태를 체크해서 누락된 키가 있는지도 알려주는

편리한 도구이다.

### 예시 시나리오

가볍게 이메일 인증 폼을 만들것이다.

- 기존에 `common`, `signUp` 두개의 네임스페이스를 썼는데, 하나의 `translation`이라는 네임스페이스를 쓰도록 수정하자. (예제가 간단해서 굳이 두개의 네임스페이스가 필요 없다.)
- 기존에 있던 리소스 파일을 모두 제거한다.

i18n 설정 파일을 다음과 같이 수정한다.

```ts title="src/i18n/init.ts" showLineNumbers {19-20}
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { detectLanguageCodeFromCountryCodeCookie } from "../detect-language-code-from-country-code-cookie.ts";

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
  name: "countryCodeCookie",
  lookup: () => detectLanguageCodeFromCountryCodeCookie(),
});

i18n
  .use(initReactI18next)
  .use(HttpApi)
  .use(languageDetector)
  .init({
    fallbackLng: "en",
    ns: "translation",
    defaultNS: "translation", // 명시적으로 추가. useTranslation hook 호출시 ns 설정하지 않으면 적용될, 기본 ns를 명시하는 옵션.
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
      order: ["localStorage", "countryCodeCookie", "htmlTag"],
    },
  });
```

### `i18next-cli` 설정하기 (`init` 명령어)

1. `i18next-cli` 패키지를 dev dependencies로 설치한다.

2. `i18next-cli`의 init 명령어를 통해, `i18next-cli`가 애플리케이션 코드를 탐색하고, 자동으로 `i18next-cli` 설정파일을 생성하도록 한다. 다음과 같은 간단한 `i18next-cli` 설정 파일이 프로젝트 루트에 생성된다. (pnpm 기준으로, `pnpm exec i18next-cli init` 실행)

```ts title="i18next.config.ts"
import { defineConfig } from "i18next-cli";

export default defineConfig({
  locales: ["en", "ko"],
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json",
  },
  types: {
    // 필요하면 직접 설정 가능. 생성되는 d.ts 파일의 위치를 정하기 위해서 직접 설정.
    input: "public/locales/en/*.json",
    output: "src/i18n/generated-types.d.ts",
  },
});
```

### UI(컴포넌트) 코드 작성 후, 번역 키를 추출하고 json 파일에 저장하기 (`extract` 명령어)

```tsx title="src/app.tsx"
import { useTranslation } from "react-i18next";

export default function App() {
  const { t, i18n } = useTranslation();

  return (
    <form>
      <div>i18n.resolvedLanguage: {i18n.resolvedLanguage}</div>
      <button type="button" onClick={() => i18n.changeLanguage("en")}>
        en
      </button>
      <button type="button" onClick={() => i18n.changeLanguage("ko")}>
        ko
      </button>
      <div>
        <label>
          {t("signIn.emailLabel")}
          <input />
        </label>
        <button>{t("signIn.emailSubmitButton")}</button>
      </div>
    </form>
  );
}
```

위 처럼 컴포넌트 코드를 작성한다. 이 때 먼저 `"signIn.emailLabel"`, `"signIn.emailSubmitButton"` 같은 키를 미리 리소스 파일에 정의해둘 필요는 없다. cli을 통해서 추출할 것이다.

`i18next-cli`의 `extract` 명령어를 실행한다. pnpm 기준으로, `pnpm exec i18next-cli extract`를 실행한다. 앞에서 기존에 있던 리소스 파일을 다 지웠는데, 다음과 같은 파일들이 생성되었다.

```json title="public/locales/en/translation.json"
{
  "signIn": {
    "emailLabel": "signIn.emailLabel",
    "emailSubmitButton": "signIn.emailSubmitButton"
  }
}
```

```json title="public/locales/ko/translation.json"
{
  "signIn": {
    "emailLabel": "",
    "emailSubmitButton": ""
  }
}
```

개발자는 이제 추출된 키에 대응되는 값만 피그마 등을 참고해 채워 넣으면 된다.

예전에는 프론트엔드 개발자가 다국어 작업을 할 때 리소스 파일에 키를 먼저 정의하고, 그다음에 컴포넌트 코드를 작성하면서 앞서 정의한 키를 가져다 썼다. 리소스 파일의 개수가 많으면 키를 작성할 때 오타를 낼 수도 있고, 각각의 리소스 파일마다 동일한 키를 일일이 설정해줘야 한다. (**번거로운 반복 작업이다.**)

(반면에, `i18next-cli` 활용하면) 컴포넌트 코드를 작성할 때 앱에서 쓸 번역키를 함께 작성해두면, cli가 코드를 정적으로 분석해서 키를 추출해 json 파일에 반영해준다. 개발자는 json 파일에서 값만 적절하게 설정하면 된다.

만약에 작업하다가 키 이름을 변경해야 해서 바꾸고 `extract` 명령어를 다시 사용하면, 기존 키는 제거되고 새로운 키가 생성된다. (즉, 변경사항도 잘 반영해준다.)

### IDE에서 번역키 자동완성 및 타입 체크 (`types` 명령어)

![before-i18next-cli-types](/images/posts/2026/i18n-configuration/before-i18next-cli-types.gif)

기존에는 위처럼 유효하지 않는 키가 `t` 함수에 전달되거나, 자동완성 단축키를 눌러도 제대로 자동완성이 되지 않았았다.

이제 types 명령어를 입력하자(pnpm 기준, `pnpm exec i18next-cli types`). 이 명령어를 입력하면 리소스 파일을 참고해 타입 선언 파일을 생성해준다.

```ts title="src/i18n/generated-types.d.ts"
// This file is automatically generated by i18next-cli, because it was not existing. You can edit it based on your needs: https://www.i18next.com/overview/typescript#custom-type-options
import type Resources from "./resources";

declare module "i18next" {
  interface CustomTypeOptions {
    enableSelector: false;
    defaultNS: "translation";
    resources: Resources;
  }
}
```

```ts title="src/i18n/resources.d.ts"
// This file is automatically generated by i18next-cli. Do not edit manually.
export default interface Resources {
  translation: {
    signIn: {
      emailLabel: "email";
      emailSubmitButton: "submit email";
    };
  };
}
```

cli에 의해서 두가지의 타입 선언 파일이 생성되었다.

생성된 타입 선언 파일을 활용해 IDE가 자동완성 및 타입 체크를 지원한다.

![after-i18next-cli-types](/images/posts/2026/i18n-configuration/after-i18next-cli-types.gif)

이제는 유효하지 않는 키가 전달되면 타입 에러를 내고, 자동완성도 지원한다.

### 번역 리소스 상태 확인 (`status` 명령어)

마지막으로 소개할 명령어는 `status`이다. 특정 언어 리소스에 누락된 번역 키가 있는지 체크 해준다.

일부러 `ko` 리소스에서 `"signIn.emailSubmitButton"` 키를 제거하자.

```json title="public/locales/ko/translation.json"
{
  "signIn": {
    "emailLabel": ""
  }
}
```

```json title="public/locales/en/translation.json"
{
  "signIn": {
    "emailLabel": "email",
    "emailSubmitButton": "submit email"
  }
}
```

`en` 리소스와 비교했을 때, `signIn.emailLabel` 키는 번역되지 않았고, `signIn.emailSubmitButton` 키는 누락되었다.

이제 `status` 명령어를 입력하면, 다음과 같이 언어 리소스 전체를 검사해서 상태를 알려준다. (pnpm 기준으로, `pnpm exec i18next-cli status`)

![i18next-cli-status-result-1](/images/posts/2026/i18n-configuration/i18next-cli-status-result-1.png)

`pnpm exec i18next-cli status ko` 처럼 언어 리소스를 명시하면, `ko` 리소스에 대한 좀 더 자세한 상태 체크를 진행한다.

![i18next-cli-status-result-2](/images/posts/2026/i18n-configuration/i18next-cli-status-result-2.png)
