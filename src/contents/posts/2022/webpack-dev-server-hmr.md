---
title: "React 개발 환경 직접 설정하기: Webpack Dev Server, HMR"
description: "Webpack Dev Server 설정 방법 정리"
createdAt: 2022-09-26 16:00:00
tags:
  - "React"
  - "Webpack"
  - "개발 환경 설정"
series: "React 개발 환경 직접 설정하기"
---

## Webpack Dev Server

### 필요성

개발 서버 없이 개발한다면, 코드를 변경하고 직접 빌드한 뒤, 빌드 결과물을 웹 브라우저를 통해 확인해야 한다.

- 매번 **코드 변경 -> 직접 빌드 -> 빌드 결과물을 웹 브라우저에서 확인하는 과정**을 수행하는 것은 번거롭다.

webpack이 제공하는 개발 서버를 사용하면 매번 직접 빌드하고, 새로운 빌드 결과물을 웹 브라우저로 열어서 확인할 필요가 없다.

- 빌드 결과물을 직접 웹 브라우저로 열 필요가 없다. 대신 개발 서버를 통해 빌드 결과를 확인할 수 있다.
- **개발 서버가 파일의 변경 사항을 감지하고 알아서 reloading 해준다.**

### 설정

```js title="webpack.config.js"
module.exports = {
  // ...
  devServer: {
    port: 3000, // 개발 서버가 실행될 port.
    historyApiFallback: true,
    open: true, // 개발 서버 구동 후, 웹 브라우저를 실행하라는 옵션.
  },
};
```

`historyApiFallback` 옵션

SPA(Single Page Application) 개발하면서 라우팅 기능을 사용하는 경우, 주로 `true`로 설정한다.

클라이언트에서 **React Router** 등에서 정의한 주소를 웹 브라우저의 주소창에 입력하면, 실제 서버에는 해당 주소가 존재하지 않기 때문에 `404` 상태 코드로 응답한다.

- 이런 경우 `index.html`로 리다이렉트 해서 문제를 해결해주는 옵션이다.

### 실행

`npx webpack serve` 명령어를 통해 실행할 수 있다.

주로 npm script로 등록해 사용한다.

```json title="package.json"
{
  "scripts": {
    "dev": "webpack serve"
  }
}
```

## HMR(Hot Module Replacement)

### HMR 필요성

개발 서버만 사용하면 파일을 변경했을 때, 웹 브라우저 화면 전체가 reloading 된다.

- 변경한 컴포넌트와 관련 없는 컴포넌트들의 상태도 모두 초기화된다.
- 개발용으로 설정한 데이터도 모두 초기화된다. 불편하다.

**Webpack Dev Server**의 **HMR** 기능과 **React Refresh Webpack Plugin**을 함께 사용하면 변경된 React 컴포넌트의 변경 사항만 반영한다.

### HMR 설정

**React Refresh Webpack Plugin** ReadMe를 확인해 설정하면 된다.

**Webpack Dev Server** 버전 `4`부터 **HMR**이 기본적으로 `enabled` 되어있으므로 **Webpack Dev Server** 설정은 별도로 수정할 게 없다.
