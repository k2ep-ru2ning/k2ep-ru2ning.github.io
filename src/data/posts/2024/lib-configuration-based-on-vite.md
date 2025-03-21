---
title: "라이브러리 개발 환경 설정 회고 (Rollup -> Vite 마이그레이션)"
description: "Vite 기반의 React 컴포넌트 라이브러리 개발 환경 설정 후기"
createdAt: 2024-06-12 20:00:00
tags:
  - "회고"
  - "Vite"
  - "React"
  - "개발 환경 설정"
series: "업무 회고록"
---

## 문제

회사에서 React 컴포넌트 라이브러리를 개발하는 중인데, 기존에는 빌드 도구로 Rollup을 사용하고 있었다.

팀에서는 `yarn link`를 활용해 개발 중인 라이브러리의 심볼릭 링크를 만들고, (local의) 테스트용 애플리케이션에서 라이브러리를 링크해서 개발하고 있었다. 코드를 변경할 때마다 라이브러리가 빌드되고, 빌드된 결과물이 테스트용 애플리케이션에 반영되어 화면에 변경사항이 표시되는 방식이다.

그런데, **빌드 시간이 1분 넘게 걸렸기 때문에, 코드를 변경하고 변경사항을 눈으로 확인하는 데 너무 오래 걸렸다.**

![rollup build 속도](/images/posts/2024/lib-configuration-based-on-vite/rollup-build-time.png)

기존에 사용하던 Rollup 버전이 너무 오래 되었고(기존 버전: `2`, 24.06.12 기준 최신 버전: `4`), Rollup 설정 파일도 2년에 퇴사 하신분의 commit을 끝으로 관리되지 않았다.

그래서 최근 빠른 속도로 각광 받고 있는 Vite를 도입하면서 빌드 속도를 개선하기로 했다.

## 사용한 Vite 플러그인

### @vitejs/plugin-react

Vite 프로젝트에서 React를 사용할 수 있게 만드는 플러그인, Babel 기반.

### vite-plugin-dts

lib mode로 Vite를 사용할 때, declaration file(`*.d.ts`)을 생성해주는 플러그인.

개발 중인 라이브러리가 TypeScript로 작성한 라이브러리이기도 하고, 클라이언트 코드에서 타입 추론이 가능하도록 이 플러그인을 사용했다.

### vite-tsconfig-paths

`tsconfig.json`에 작성한 `compilerOptions.paths`를 이용해, Vite가 모듈의 위치를 찾도록 도와주는 플러그인.

`vite.config.ts`에 `resolve.alias`를 설정할 필요가 없어진다. (같은 설정을 `tsconfig.json`과 `vite.config.ts`에 해야하는 불편함을 해결해준다.)

### vite-plugin-css-injected-by-js

Vite로 빌드하면, bundle된 js 파일과 css 파일이 생성된다. 이때 생성된 css를 bundle된 js 내부에서 import하도록 만들고 싶어서 이 플러그인을 사용했다. 이렇게 하면, 클라이언트 코드에서 별도로 라이브러리의 css 파일을 import 할 필요가 없다.

## Vite 플러그인 설정하기

**@vitejs/plugin-react** 플러그인을 사용해서 Vite 프로젝트에서 React 코드를 작성할 수 있게 했고, **vite-plugin-dts** 플러그인을 사용해서 lib 모드로 빌드할 때, `*.d.ts` 파일들을 생성하게 만들었다.

**vite-tsconfig-paths** 플러그인을 이용해 path에 대한 alias 설정을 `tsconfig.json` 파일에만 하고 동일한 설정을 vite에서 사용할 수 있게 만들었다.

그리고 클라이언트 코드에서 별도로 css 파일을 import 할 필요없도록 생성된 css를 bundle된 js 파일에 주입하게 **vite-plugin-css-injected-by-js** 플러그인을 사용했다.

```ts title="vite.config.ts"
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    react(),
    dts({
      /*
        이 옵션이 false이면
        기본적으로 {outDir}/src에 index.d.ts를 비롯한
        *.d.ts 파일을 생성한다.
        
        이 옵션이 true이면
        {outDir}/dts에 src/index.d.ts를 생성해준다.
        
        즉, dts 디렉터리를 만들고
        그 디렉터리에 src/index.d.ts 파일을 생성한다. 
        
        dts 디렉터리를 만들고 싶지 않다면 굳이 쓸 필요 없다.

        그리고 package.json의 
        "types"에 index.d.ts 파일 경로를 작성하면 된다.
      */
      insertTypesEntry: true,
    }),
    tsconfigPaths(),
    cssInjectedByJsPlugin(),
  ],

  /*
    vite-tsconfig-paths 플러그인을 사용했기 때문에
    이미 tsconfig.json에 설정한 경로 alias 설정을
    vite 설정 파일에 또 설정할 필요가 없다.
  */
  /*
    resolve: {
      alias: [
        {
          find: '@',
          replacement: path.resolve(__dirname, 'src'),
        },
      ],
    },
  */

  // ...
});
```

## Vite 빌드 설정하기

Vite 프로젝트를 라이브러리 형태로 빌드하기 위해서는 `build.lib` 옵션을 설정해야 한다.

**엔트리 파일이 무엇인지, 패키지 이름은 무엇인지, 빌드 결과로 생성될 js 파일의 이름은 어떻게 할 것인지, 어떤 모듈 시스템을 사용해서 빌드할 것인지** 등을 설정할 수 있다.

추가로, 번들에 포함하고 싶지 않은 dependency들은 `build.rollupOptions.external`에 명시할 수 있다.

```ts title="vite.config.ts"
import path from "node:path";
import { defineConfig } from "vite";
// ...

export default defineConfig({
  // ...

  build: {
    // 빌드 결과를 담은 디렉터리.
    // rollup을 쓸 때도 "dist"였기에 그대로 "dist"로 설정
    outDir: "dist",
    lib: {
      // 엔트리 파일
      entry: path.resolve(__dirname, "src/index.ts"),

      // 패키지 이름
      name: "@your-company/your-package",

      // 빌드 결과물 파일 이름
      fileName: (format) => `index.${format}.js`,

      // 어떤 모듈 시스템에 호환되도록 빌드할 것인가
      // rollup을 쓸 때 es, cjs 방식으로 빌드했었기 때문에,
      // 해당 방식을 사용하게 설정
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      // 라이브러리 빌드 결과에 포함하고 싶지 않은 패키지를 명시할 수 있다.
      // 또한, 이 패키지들을 peer dependencies에 명시하면 된다.
      external: [
        "react",
        "react-dom",
        "mobx",
        "mobx-react-lite",
        "@your-company/your-another-package",
      ],
    },
  },
});
```

## 전체 Vite 설정

앞서 언급한 플러그인, 빌드 설정을 정리한 Vite 설정 파일은 다음과 같다. (확실히 기존에 사용하던 rollup 설정 파일보다 간결해졌다.)

```ts title="vite.config.ts"
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
    tsconfigPaths(),
    cssInjectedByJsPlugin(),
  ],
  build: {
    outDir: "dist",
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "@your-company/your-package",
      fileName: (format) => `index.${format}.js`,
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "mobx",
        "mobx-react-lite",
        "@your-company/your-another-package",
      ],
    },
  },
});
```

## package.json 파일 설정

라이브러리 개발할 때는 `main`, `module`, `types`, `files` 속성값을 잘 설정하면 된다.

```json
{
  "name": "@your-company/your-package",
  "type": "module",
  "main": "./dist/index.cjs.js",
  "module": "./dist/index.es.js",
  "types": "./dist/dts/src/index.d.ts",
  "files": ["dist"]
}
```

`type`은 `"module"` 또는 `"commonjs"` 값을 가질 수 있는데, `"module"`인 경우, `.js` 파일을 ES 모듈 시스템으로 해석한다는 의미이다.

`main`은 클라이언트 코드에서 라이브러리를 `require()`로 임포트할 때, 진입점이 되는 파일을 설정한다. vite가 `dist/index.cjs.js`로 번들링하도록 설정했기 때문에 `"./dist/index.cjs.js"` 경로를 적어준다.

`module`은 클라이언트 코드에서 라이브러리를 `import`로 임포트할 때, 진입점이 되는 파일을 설정한다. vite가 `dist/index.es.js`로 번들링하도록 설정했기 때문에 `"./dist/index.es.js"` 경로를 적어준다.

`types`에는 타입 선언 파일의 위치를 지정하면 된다. vite-plugin-dts 플러그인이 `dist/dts/src/index.d.ts`를 생성하므로, `"./dist/dts/src/index.d.ts"` 경로를 적어준다.

`files`에는 패키지를 배포할 때 포함할 파일이나 디렉터리를 작성하면 된다. dist 디렉터리를 포함해서 배포할 것이므로, `["dist"]`를 적어준다.

## link를 이용해 개발하기 위한 명령어

`vite build --watch` 명령어를 실행하면, file 변경사항이 발생할 때마다(코드 수정사항이 생길 때마다) 빌드되고, 테스트용 애플리케이션에서는 변경사항을 감지해서 화면을 갱신한다.

## 클라이언트 코드에서 타입 추론이 제대로 되지 않는 문제 해결

환경 설정을 끝마쳤다고 생각했는데, 마지막에 클라이언트 코드에서 타입 추론이 제대로 되지 않는 문제가 발생했다.

기존에는 타입스크립트 설정 파일에서 다음과 같이 **상대경로**를 이용해 경로의 alias를 설정했다.

```json title="tsconfig.json"
{
  "compilerOptions": {
    // ...
    "paths": {
      "@/*": ["./src/*"]
    }
  }
  // ...
}
```

그런데 이 경우, 클라이언트 코드에서 타입 추론이 제대로 되지 않았다.

번들된 결과물을 살펴보니, 생성된 `*.d.ts` 파일에서 `@` alias가 실제 경로로 변환되지 않고 `@` 그대로 남아있었다.

```ts title="dist/../index.d.ts"
import { SomeType } from "@/types";
```

**생성된 `*.d.ts` 파일들에서 `@` alias 대신 실제 경로를 표시하려면, 타입스크립트 설정에서 `compilerOptions.baseUrl` 옵션을 설정하고 `compilerOptions.paths` 옵션에 "`./`으로 시작하지 않는 경로"를 작성하면 된다.**

```json title="tsconfig.json"
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
  // ...
}
```

번들된 결과물을 살펴보면, 생성된 `*.d.ts` 파일에서 `@` alias가 사라지고 실제 경로로 치환되었다.

```ts title="dist/../index.d.ts"
import { SomeType } from "../../../../types";
```

그리고 실제로 클라이언트 코드에서 배포한 라이브러리를 사용할 때, **타입 추론이 잘 되었다.**

## 결과

![vite build 속도](/images/posts/2024/lib-configuration-based-on-vite/vite-build-time.png)

기존에 **1분이 넘던 빌드시간을 10초대로 줄였다.** 팀에서 `yarn link`를 활용해 개발하고 있었는데, 코드를 변경할 때마다 발생하는 빌드에 걸리는 시간이 줄어들어 **팀 개발 생산성이 증가했다**. 팀원들도 속도가 빨라져서 많이 좋아했다.

오래된 버전의 Rollup을 최신 버전의 Vite로 전환하면서, 관리 되지 않던 빌드도구 설정 파일을 최신화 할 수 있었다.

과거 Rollup 버전으로 빌드했을 때 클라이언트 코드에서 타입 추론이 되지 않았었는데, Vite로 전환하면서 타입 추론이 가능하게 설정했다.

빌드도구/번들러 설정은 막연히 어렵다고 생각해왔는데, 이번에 Vite로 성공적으로 전환하면서 자신감을 얻을 수 있었다.
