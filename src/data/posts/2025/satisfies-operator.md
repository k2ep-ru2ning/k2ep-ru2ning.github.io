---
title: "타입스크립트 satisfies 연산자"
description: "type annotation을 사용했을 때와 satisfies를 사용했을 때의 차이점은 무엇일까?"
createdAt: 2025-07-12 15:50:42
tags:
  - TypeScript
---

Next.js 문서에서 `getStaticPaths` 함수의 타입 검사를 위해 `satisfies` 연산자를 활용하는 코드를 봤다.

```ts {12}
export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          name: "next.js",
        },
      }, // See the "paths" section below
    ],
    fallback: true, // false or "blocking"
  };
}) satisfies GetStaticPaths;
```

`GetStaticPaths` **타입을 type annotation으로 추가하는 것과 satisfies 연산자로 적용하는 것의 차이점**이 궁금했다.

## 예제

```ts {4-5, 8}
const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  // blue 프로퍼티 이름 오타!. 타입 검사로 검출하고 싶음.
  bleu: [0, 0, 255],
};

console.log(palette.green.toUpperCase());
```

색깔을 정의하는 `palette` 객체를 만들었다.

![example](/images/posts/2025/satisfies-operator/example.webp)

`{ red: number[]; green: string; bleu: number[]; }` 타입으로 추론이 잘 된다. 그리고, `palette`의 `green` 프로퍼티에 접근해서 `string` method를 사용하고 있다. 원래 `blue`라는 프로퍼티를 만들고 싶었는데 오타가 났다. **오타를 타입 검사로 해결**하고 싶다.

## type annotation

타입 검사를 하기 위해서는 변수를 선언할 때, 타입을 선언하면 된다

```ts {5}
type Colors = "red" | "green" | "blue";

type RGB = [red: number, green: number, blue: number];

const palette: Record<Colors, RGB | string> = {
  red: [255, 0, 0],
  green: "#00ff00",
  bleu: [0, 0, 255],
};

console.log(palette.green.toUpperCase());
```

`palette` 객체의 프로퍼티 키는 `"red"`, `"green"`, `"blue"` 중 하나이고, 프로퍼티 값은 `[number, number, number]` 타입이거나 `string` 타입이다.

따라서 `palette` 변수의 타입을 `Record<Colors, RGB | string>` 으로 선언하면 된다.

그러면, **`bleu`라는 오타를 잡아낼 수 있다.**

![type-annotation](/images/posts/2025/satisfies-operator/type-annotation.webp)

하지만 모든 프로퍼티 값이 `string | RGB` 타입이 되기 때문에, **원래 잘 동작하던 `palette.green.toUpperCase()` 코드에서 타입 에러가 발생한다.**

type annotation이 아닌 satisfies 연산자를 쓰면 이런 문제를 해결할 수 있다.

## satisfies 연산자

```ts {9, 11}
type Colors = "red" | "green" | "blue";

type RGB = [red: number, green: number, blue: number];

const palette = {
  red: [255, 0, 0],
  green: "#00ff00",
  bleu: [0, 0, 255],
} satisfies Record<Colors, RGB | string>;

console.log(palette.green.toUpperCase());
```

type annotation을 지웠다.

그리고 satisfies 연산자로 주어진 expression이 `Record<Colors, RGB | string>` 타입인지 검증했다.

![satisfies-1](/images/posts/2025/satisfies-operator/satisfies-1.webp)

`bleu` 오타를 잘 잡아냈고, `palette.green.toUpperCase()` 코드에서도 `palette.green`이 `string` 타입으로 추론 되어 타입 에러가 발생하지 않았다.

![satisfies-2](/images/posts/2025/satisfies-operator/satisfies-2.webp)

`bleu` 오타를 해결하고 palette 변수의 타입이 어떻게 추론되는지 확인하면, `{ red: [number, number, number]; green: string; blue: [number, number, number]; }` 타입으로 추론되고, 이 타입은 `Record<Colors, RGB | string>` 타입과 매칭되는(호환되는) 타입이다.

<strong>(expression E `satisfies` type T)</strong>는 **E가 T type인지 체크는 하지만, E의 타입을 T로 만들지 않는다. 이게 type annotation을 사용했을 때와 차이점이다.**

## 정리

**타입 추론을 유지하면서 expression의 타입을 검사할 필요가 있을 때** `satisfies` 연산자를 유용하게 사용할 수 있다.

(설정과 관련된) 객체를 만들고 타입을 검사하는 상황에 유용할 것 같다.

## 참고

[타입스크립트 공식문서 satisfies operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator)
