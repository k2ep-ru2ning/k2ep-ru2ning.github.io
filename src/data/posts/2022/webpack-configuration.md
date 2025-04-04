---
title: "React 개발 환경 직접 설정하기: Webpack"
description: "Webpack에 대해 공부한 내용 정리"
createdAt: 2022-09-26 14:00:00
tags:
  - "React"
  - "Webpack"
  - "개발 환경 설정"
series: "React 개발 환경 직접 설정하기"
---

## 번들러(Bundler)

`Webpack`, `Rollup`, `Parcel` 등이 있다.

### 역할

여러 개의 파일을 하나로 합쳐준다.

개발할 때는 모듈을 활용해 여러 파일로 분리해 개발한다.

배포할 때는 **시작점이 되는 파일**(**entry**)로부터 모든 의존하는 모듈들을 합쳐 하나의 파일로 만든다.

### 필요성

최신 웹 브라우저는 이미 모듈을 지원한다. 그런데 굳이 번들러를 사용해 하나의 파일로 만들 필요가 있을까?

- 아직 모듈을 지원하지 않는 웹 브라우저도 있다.
- 웹 브라우저가 여러 개의 js 파일(모듈을 사용하므로 여러 개의 파일)을 동시에 로딩하는 것은 속도(성능)에 문제가 발생할 수 있다.
  - 중간에 하나의 js 파일이라도 로딩이 지연되면 전체적으로 지연될 수 있다.
  - 그래서 번들러를 통해 하나의 파일로 합쳐서 웹 브라우저에게 제공하는 방식으로 배포한다.

## Webpack 설정하기

Webpack을 사용해 번들링 하기 위해서는 webpack 명령어를 실행하면서 mode, entry, output 같은 옵션을 주면 된다.

보통, 설정해야 할 옵션이 많으므로 명령어를 입력하면서 모든 옵션을 인자(argument)로 명시하기 힘들다. 그래서 `webpack.config.js` 같은 설정 파일을 별도로 만든다. (js 파일로, 설정을 담은 객체를 export 하면 된다.)

### mode 설정

```js title="webpack.config.js"
// Webpack은 node 환경에서 실행된다.
// process.env.NODE_ENV를 통해 NODE_ENV 라는 환경 변수를 참조할 수 있다.
const isDevelopment = process.env.NODE_ENV !== "production";

module.exports = {
  mode: isDevelopment ? "development" : "production",
};
```

`"development"` 또는 `"production"` 중 하나로 설정한다.

개발할 때는 `"development"`로, 배포할 때는 `"production"`을 사용한다.

설정한 mode(환경)에 맞게 webpack이 기본적인 최적화를 한다.

### entry 설정

```js title="webpack.config.js"
module.exports = {
  entry: {
    // key - value 형태로 지정한다.
    // value에 entry 가 될 파일 이름을 작성한다.
    // key는 번들링 된 결과물의 이름을 만들 때 사용된다.
    app: "./src/main",
  },
};
```

**말 그대로 시작점(entry)이 되는 모듈**을 지정한다.

React를 사용할 때는 App 컴포넌트를 root container에 렌더링하는 모듈이 entry가 된다. (주로 main.jsx 혹은 index.jsx 라는 이름이 붙은 파일)

### output 설정

```js title="webpack.config.js"
module.exports = {
  output: {
    // 번들링 된 결과물이 저장될 위치
    // 절대 경로를 사용해야 한다.
    // node가 제공하는 path 모듈을 사용한다.
    path: path.resolve(__dirname, "dist"),
    // 번들링 된 결과물의 이름
    // [name] 은 엔트리의 key를 의미한다.
    // 즉 이 경우, dist 폴더 내부의 assets 폴더 내에 app.js가 생성된다.
    filename: "assets/[name].js",
    // 매번 빌드 전에 output 폴더를 정리한다.
    clean: true,
  },
};
```

번들링 된 결과물이 저장될 **위치**를 지정한다.

**번들링 된 결과물의 이름**을 지정한다.

### loader 설정

원래 Webpack은 js 파일과 JSON 만 처리 가능하다.

loader를 사용하면 다른 형태의 파일도 Webpack이 처리할 수 있으며, 유효한 모듈 형태로 변환할 수 있다. (변환된 모듈은 앱 내에서 사용할 수 있으며, 자연스럽게 의존성 그래프에도 추가된다.)

loader를 통해 js 뿐만 아니라 css, image, font 등도 모듈로 인식하여, js 파일에서 import 해 사용할 수 있다.

Webpack은 기본적으로 모든 파일을 모듈로 생각한다.

```js title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // css 파일에 대해, 아래 명시한 loader들을 적용한다.
        /* 
          loader는 배열의 역순으로 적용된다.
          개발환경이라면,
          postcss-loader -> css-loader -> style-loader 순으로 적용된다.
        */
        use: [
          isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
};
```

module.rules에 배열 형태로 설정한다.

배열의 원소는 test, use 프로퍼티를 가지는 객체 형태이다.

- test에는 어떤 파일을 대상으로 loader를 적용할지 명시한다.
- use에는 어떤 loader를 이용해 변환할지 명시한다.

### plugin 설정

loader가 다양한 형태의 파일을 유효한 모듈로 변환하는 데 사용되는 반면, plugin은 좀 더 광범위한 task를 처리하는 데 사용된다.

즉, 번들 된 결과물을 처리한다.

환경 변수 주입, 번들 최적화, 번들 난독화 등을 할 수 있다.

```js title="webpack.config.js"
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  plugins: [
    // plugin은 class 형태이므로 인스턴스를 생성해주면 된다.
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),
  ],
};
```

plugins에 배열 형태로 설정한다.

plugin은 class 이므로 new 연산자를 통해 인스턴스를 생성하면 된다.
