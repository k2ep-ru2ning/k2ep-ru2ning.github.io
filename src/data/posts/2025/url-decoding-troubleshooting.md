---
title: "URL 디코딩 관련 문제 해결"
description: '"C++"이라는 search parameter가 왜 "C  "로 해석되었을까?'
createdAt: 2025-07-22 16:14:00
tags:
  - "Troubleshooting"
  - "Next.js"
---

## 문제

tag search parameter에 `"C++"`이라는 문자열을 넣었는데, Next.js 애플리케이션에서 `"C  "`로 해석되는 문제가 발생했다.

`/posts?tag=C++` 주소를 요청했을 때, tag 값이 `"C++"`이 아니라 `"C  "`가 되어서 태그 기반의 글 필터링이 제대로 동작하지 않았다.

## 원인

Next.js에서 제공하는 `useSearchParams` hook을 이용해 tag search parameter를 조회했다. 이 hook은 `URLSearchParams` 타입의 객체를 반환한다.

그런데, [`URLSearchParams`는 `"+"` 문자를 공백으로 디코딩한다.](https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams#%EB%8D%94%ED%95%98%EA%B8%B0_%EA%B8%B0%ED%98%B8_%EB%B3%B4%EC%A1%B4%ED%95%98%EA%B8%B0) 그래서 `"C++"`라는 tag search parameter 값이 `"C  "`으로 조회되었다.

tag search parameter를 `"C++"`로 하는 url 인스턴스를 `URL` class로 생성해서 테스트해 봤다.

```js
const url = new URL(
  "https://k2ep-ru2ning.github.io/posts?tag=C++&tag=상태 관리&page=1",
);
console.log(`url.search:`, url.search);
console.log(`url.searchParams.getAll("tag"):`, url.searchParams.getAll("tag"));
```

![cpp-search-parameter-decoding-test](/images/posts/2025/url-decoding-troubleshooting/cpp-search-parameter-decoding-test.webp)

`url.search`로 인코딩된 search parameter 문자열을 얻을 수 있다. `"C++"`는 `"C++"`로 인코딩되었다. 반면 한글 문자열인 `"상태 관리"`는 `"%EC%83%81%ED%83%9C%20%EA%B4%80%EB%A6%AC"`로 인코딩되었다.

`url.searchParams`로, `useSearchParams` hook이 반환하는 것과 동일한 `URLSearchParams` 타입의 객체를 얻을 수 있다. `get`, `getAll` 등의 메서드를 통해 특정 search parameter의 값을 쉽게 조회할 수 있다. **조회 과정에서 디코딩도 알아서 해준다.**

`url.searchParams.getAll("tag")`가 반환하는 값에서 `"C++"`로 인코딩된 문자열이 `"C  "`로 디코딩된 것을 확인 할 수 있다. 반면 읽기 힘든 문자열로 인코딩 되었던 한글 문자열은 원래 값인 `"상태 관리"`로 잘 디코딩 되었다.

## 해결

**`"C++"`라는 문자열을 search parameter에 그대로 쓰지 않고, `encodeURIComponent` 함수를 이용해 `"C%2B%2B"`라는 문자열로 인코딩해서 문제를 해결했다.** `URLSearchParams`의 `get`이나 `getAll` 메서드로 조회하면 `"C++"`이라는 값으로 잘 조회된다.

```js
const url = new URL(
  `https://k2ep-ru2ning.github.io/posts?tag=${encodeURIComponent("C++")}`,
);
console.log(`url.search:`, url.search);
console.log(`url.searchParams.get("tag"):`, url.searchParams.get("tag"));
```

![encoded-cpp-search-parameter-decoding-test.webp](/images/posts/2025/url-decoding-troubleshooting/encoded-cpp-search-parameter-decoding-test.webp)

<strong>
`"C++"`를 인코딩한 문자열 `"C%2B%2B"`에는 `"+"` 문자가 없어서 `URLSearchParams`가 `"C++"`로 잘 디코딩한다.
</strong>

여기서 `encodeURI`가 아니라 `encodeURIComponent`로 인코딩해야 `"C++"`의 `"+"`가 제대로 인코딩된다.

- `encodeURI("C++")` → `"C++"`
- `encodeURIComponent("C++")` → `"C%2B%2B"`

`encodeURI`는 `"https://k2ep-ru2ning.github.io/posts?tag=개발 환경 설정"` 같은 **전체 URL을 인코딩할 때 사용한다.** 따라서 한글처럼 URL 상에 쓸 수 없는 문자만 인코딩하고, `:`, `?`, `=`, `&`, `#` 처럼 URL 상에서 구분자로 사용되는, 허용된 문자들을 별도로 인코딩하지 않는다.

반면, `encodeURIComponent`는 **search parameter처럼 URL의 구성요소 각각을 인코딩할 때 사용한다.** 한글처럼 URL 상에 쓸 수 없는 문자뿐만 아니라 `#`, `$`, `&`, `+`, `,`, `/`, `:`, `;`, `=`, `?`, `@`도 인코딩한다. URL 구성요소에 구분자 역할을 하는 문자가 있다면, URL의 구조가 모호해지기 때문이다.

## 참고

- [MDN URLSearchParams - 더하기 기호 보존하기](https://developer.mozilla.org/ko/docs/Web/API/URLSearchParams#%EB%8D%94%ED%95%98%EA%B8%B0_%EA%B8%B0%ED%98%B8_%EB%B3%B4%EC%A1%B4%ED%95%98%EA%B8%B0)
- [모던 JavaScript 튜토리얼 - URL objects](https://ko.javascript.info/url)
