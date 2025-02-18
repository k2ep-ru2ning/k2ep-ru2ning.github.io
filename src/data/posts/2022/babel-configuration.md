---
title: "React 개발 환경 직접 설정하기: Babel"
description: "Babel에 대해 공부한 내용 정리"
createdAt: 2022-09-26 15:00:00
tags:
  - "Babel"
  - "React"
  - "개발 환경 설정"
series: "React 개발 환경 직접 설정하기"
---

## 역할

최신 js 문법을 사용해서 개발하더라도, 여러 웹 브라우저와 호환될 수 있도록 적당한 하위 버전의 js로 변환하는 것이 Babel의 역할이다.

- 최신버전의 js -> ES5
- 타입스크립트 -> ES5
- jsx -> ES5

## 동작 방식

파싱 -> 변환 -> 출력

- 파싱: 코드를 트리 형태의 자료구조로 변환
- 변환: 파싱된 트리를 변경하며, 실제 코드 변환
- 출력: 변경된 결과물을 출력

## plugin

Babel 자체는 파싱과 출력을 담당한다.

실제 변환은 **plugin**이 수행한다.

설정 파일 혹은 명령어 옵션으로 plugin을 명시하면서 babel을 실행하면 plugin에 의해 변환된 코드가 출력된다.

## preset

실제 변환을 하는 plugin을 일일이 하나씩 추가하는 것은 **번거롭다.**

미리 여러 plugin을 묶어 둔 것은 preset이라고 한다.

대표적인 preset에는

- preset-env
- preset-react
- preset-typescript

가 있다.

JavaScript를 쓰면서 React를 이용해 개발하려면, 직접 plugin을 찾아서 설정하기보다는 preset-env와 preset-react를 사용하면 된다.

### preset-env

target browser 환경을 세세하게 신경 쓰지 않고, JavaScript의 최신문법을 사용해 개발할 수 있게 도와준다.

즉, 최신 JavaScript 문법을 사용해 개발된 코드를 target browser에서 동작할 수 있게 변환해준다.

### preset-react

React 코드를 변환한다.

### preset-typescript

TypeScript 코드를 변환한다.

## Webpack과 통합해 사용하기

Babel을 별도로 실행해서 사용하기보다 **Webpack에 통합해서 사용**하면 편하다.

Webpack의 loader 중 **babel-loader**를 이용하면, Webpack을 통해 Babel을 사용할 수 있다.

```js title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        // .js, .jsx 파일에 babel loader를 적용한다.
        test: /\.jsx?$/,
        use: ["babel-loader"],
        /* 
          변환이 필요 없는 파일(node_modules 디렉터리의 파일들)에
          Babel이 적용되는 것을 막아서 babel-loader가 느려지지 않게 한다.
        */
        exclude: /node_modules/,
      },
    ],
  },
};
```

## babel-loader 설정하기

babel-loader의 options으로 Babel 설정을 할 수 있다.

별도의 babel 설정 파일을 만드는 대신, Webpack 설정 파일에 babel-loader를 명시하면서 babel 설정을 한다.

### preset-env 설정하기

```js title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    corejs: "3",
                  },
                ],
              ],
            },
          },
        ],
        exclude: path.resolve(__dirname, "node_modules"),
      },
    ],
  },
};
```

babel-loader의 options에 Babel 설정을 했다.

preset-env를 preset으로 추가했다.

preset-env의 **target 옵션**을 추가하거나, **browserslist 설정**으로 **target이 되는 웹 브라우저 환경**을 명시해야 한다.

- 위의 경우는 **target 옵션**을 안 주고, 대신 **browserslist 설정**을 한 경우이다.
- **browserslist**는 `package.json`에 설정하면 된다.

폴리필(polyfill) 설정하기

- **useBuiltIns 옵션**은 `"entry"`와 `"usage"` 값을 가질 수 있는데, `"usage"`로 설정하면 필요한 폴리필만 추가한다.
- corejs는 폴리필을 제공한다.
- corejs 옵션으로 corejs 버전을 명시한다.

**폴리필 vs. 트랜스파일**

- Babel 자체는 트랜스파일러로, 최신 js 코드를 예전 표준을 준수하는 코드로 변환시켜, 타겟 환경에서 실행될 수 있게 한다.
- js는 표준에 **새로운 문법**이나 **새로운 내장 함수에 대한 정의**가 포함되면서 발전하고 있다.
  - 프로그래머가 **새로운 문법**으로 코드를 작성하면, 트랜스파일러가 예전 표준을 준수하는 코드로 변경해준다.
  - 하지만, **예전 표준을 지원하는 웹 브라우저**에서, 새 표준에 추가된 **새로운 내장 함수**를 실행하기 위해서는 명세서를 읽고 해당 내장 함수를 직접 구현해 스크립트에 추가해야 한다.
    - 이렇게 새롭게 구현해야 할 코드를 폴리필이라고 한다.
  - corejs는 폴리필을 제공한다.
- preset-env가 target 웹 브라우저 환경에 맞게 필요한 corejs(폴리필)을 추가(import)한다.

### preset-react 설정하기

```js title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic",
                  },
                ],
              ],
            },
          },
        ],
        exclude: path.resolve(__dirname, "node_modules"),
      },
    ],
  },
};
```

babel-loader의 options에 Babel 설정을 했다.

preset-react를 preset으로 추가했다.

`runtime: "automatic"` 옵션은 React 코드를 작성할 때, 매번 `import React from "react"` 코드를 작성하지 않기 위함이다.
