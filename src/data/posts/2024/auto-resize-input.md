---
title: "입력값에 따라 너비가 늘어나고 줄어드는 input React 컴포넌트 만들기"
description: "입력값에 따라 너비가 알아서 늘어나고 줄어드는 input React 컴포넌트를 만들면서 겪었던 시행착오 정리"
createdAt: 2024-01-16 20:00:00
updatedAt: 2025-09-07 12:30:00
tags:
  - "회고"
  - "React"
seriesId: "업무 회고록"
---

회사에서 해시태그 입력 폼을 개발하던 도중, **입력값에 따라서 너비가 늘어나고 줄어드는 input React 컴포넌트**를 개발하게 되었다.

사실, 입력값에 따라 input 같은 요소의 너비를 자동으로 조절해 주는 [`field-sizing` CSS 속성](https://developer.mozilla.org/en-US/docs/Web/CSS/field-sizing)이 있다. 해당 속성에 `content` 값을 주면 원했던 대로 동작한다. 그런데 슬프게도 이 CSS 속성은 **(2024년 기준) 아직 실험 단계**여서 크롬 계열의 브라우저에서만 잘 동작하고, 파이어폭스나 사파리에서 동작하지 않는다. **그래서 직접 구현하기로 결정했다.**

생각보다 간단하지 않았고, 잊어버리기 전에 개발 과정에서 겪었던 시행착오를 기록하고 싶어서 정리했다.

## 요구사항

- input은 **최소 너비**를 가진다.
- input의 너비는 <strong>max(최소 너비, 입력값이 차지하는 너비)</strong>이다.

## 아이디어

유저가 입력할 때마다, input의 너비를 업데이트하면 된다. 그렇다면, **입력할 때마다 input 너비를 어떤 값으로 업데이트해야 할까?**

문자마다 너비를 `W` px이라고 가정하고, 입력할 때마다 input의 너비를 `입력값 길이 * W` px로 설정하는 아이디어를 떠올릴 수 있다. 하지만 영어, 한글, 공백 등 문자마다 너비가 다르기 때문에, 정확한 (입력값의) 너비가 아니다.

또 다른 아이디어는 input 태그와 같은 스타일링을 적용한, 화면에 표시되지 않는 span 태그를 사용하는 것이다. 입력한 값을 span의 `textContent`로 설정하고, span 태그의 너비를 측정해 input의 너비로 설정한다. **유저가 입력한 값의 너비를 측정하기 위해, span 태그를 사용**한 것이다.

span 태그를 활용하는 두 번째 아이디어로 개발을 시작했다.

## 첫 번째 시도

```tsx title="auto-resize-hashtag-input.tsx" showLineNumbers {28-34, 54-56}
import styled from "@emotion/styled";
import {
  useRef,
  useState,
  type ChangeEventHandler,
  type KeyboardEventHandler,
} from "react";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  onEnter: () => void;
};

const INITIAL_WIDTH_IN_PX = 60;

export default function AutoResizeHashtagInput({
  value,
  onValueChange,
  onEnter,
}: Props) {
  const [widthInPx, setWidthInPx] = useState(INITIAL_WIDTH_IN_PX);

  const visuallyHiddenSpanRef = useRef<HTMLSpanElement>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onValueChange(e.target.value);
    if (visuallyHiddenSpanRef.current) {
      const nextWidth = Math.max(
        visuallyHiddenSpanRef.current.getBoundingClientRect().width,
        INITIAL_WIDTH_IN_PX,
      );
      setWidthInPx(nextWidth);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    // form 태그 내부에서 AutoResizeHashtagInput 컴포넌트가 사용될 경우
    // enter 입력 시, 브라우저 기본동작으로 폼 제출되는 경우를 방지하기 위함.
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      onEnter();
      setWidthInPx(INITIAL_WIDTH_IN_PX);
    }
  };

  return (
    <>
      <VisuallyHiddenSpan ref={visuallyHiddenSpanRef}>
        {value}
      </VisuallyHiddenSpan>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        widthInPx={widthInPx}
        placeholder="#태그"
      />
    </>
  );
}

// Input, VisuallyHiddenSpan 컴포넌트가 font 관련해서 동일한 스타일을 갖도록 Base 컴포넌트 정의
const Base = styled.div`
  display: inline-block;
  border: none;
  border-radius: 8px;
  outline: none;
  padding: 4px 8px;
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
`;

const Input = styled(Base.withComponent("input"))<{ widthInPx: number }>`
  width: ${({ widthInPx }) => `${widthInPx}px`};
  background-color: rgb(244, 244, 245);
`;

/*
  white-space: pre;
  - span 태그의 자식에 공백을 유지시키기 위함
  - pre가 아니면 '  hello   world  '를 'hello world'로 화면에 표시함
  - '  hello   world  ' 그대로 표시하려면, pre여야함

  visibility: hidden;
  - span 태그를 시각적으로 가림

  position: absolute;
  left: -9999px;
  - position, left 속성으로 span 태그를 화면에 표시되지 않는 위치로 이동
*/
const VisuallyHiddenSpan = styled(Base.withComponent("span"))`
  white-space: pre;
  visibility: hidden;
  position: absolute;
  left: -9999px;
`;
```

54-56번째 줄 코드에서 span 태그의 자식으로 `value` prop을 두었다. 28-34번째 줄 코드에서 사용자가 입력했을 때 `visuallyHiddenSpanRef.current.getBoundingClientRect().width`로 span 태그의 너비를 측정하고, 이 값을 인자로 `setWidthInPx` 함수를 호출해 input의 너비를 업데이트했다.

잘 동작할 것 같았지만 아래 그림처럼 잘 동작하지 않았다.

![첫 번째 시도](/images/posts/2024/auto-resize-input/auto-resize-input-try-1.gif)

**입력값 전부를 표시할 정도로 늘어나지 못해, 제일 앞 문자 하나가 덜 표시되는 문제가 생겼다.** `handleChange`가 호출된 시점에서 `e.target.value`는 유저의 마지막 입력값을 가지지만, `value` prop은 바로 직전의 입력값을 가진다. 따라서 이 시점에서 `visuallyHiddenSpanRef.current.getBoundingClientRect().width`를 참조해도 직전 입력값의 너비일 뿐이다. 그래서 마지막 입력값 전부를 표시할 정도로 늘어나지 않고, 직전 입력값의 너비 정도로 늘어나 앞의 한 문자가 잘렸다.

## 두 번째 시도: useEffect 활용

```tsx title="auto-resize-hashtag-input.tsx" showLineNumbers {27-35}
import styled from "@emotion/styled";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type KeyboardEventHandler,
} from "react";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  onEnter: () => void;
};

const INITIAL_WIDTH_IN_PX = 60;

export default function AutoResizeHashtagInput({
  value,
  onValueChange,
  onEnter,
}: Props) {
  const [widthInPx, setWidthInPx] = useState(INITIAL_WIDTH_IN_PX);

  const visuallyHiddenSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (visuallyHiddenSpanRef.current) {
      const nextWidth = Math.max(
        visuallyHiddenSpanRef.current.getBoundingClientRect().width,
        INITIAL_WIDTH_IN_PX,
      );
      setWidthInPx(nextWidth);
    }
  }, [value]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onValueChange(e.target.value);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    // form 태그 내부에서 AutoResizeHashtagInput 컴포넌트가 사용될 경우
    // enter 입력 시, 브라우저 기본동작으로 폼 제출되는 경우를 방지하기 위함.
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      onEnter();
      setWidthInPx(INITIAL_WIDTH_IN_PX);
    }
  };

  return (
    <>
      <VisuallyHiddenSpan ref={visuallyHiddenSpanRef}>
        {value}
      </VisuallyHiddenSpan>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        widthInPx={widthInPx}
        placeholder="#태그"
      />
    </>
  );
}

const Base = styled.div`
  display: inline-block;
  border: none;
  border-radius: 8px;
  outline: none;
  padding: 4px 8px;
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
`;

const Input = styled(Base.withComponent("input"))<{ widthInPx: number }>`
  width: ${({ widthInPx }) => `${widthInPx}px`};
  background-color: rgb(244, 244, 245);
`;

const VisuallyHiddenSpan = styled(Base.withComponent("span"))`
  white-space: pre;
  position: absolute;
  visibility: hidden;
  left: -9999px;
`;
```

**`value` prop이 변경되어 re-rendering 된 후, 마지막 입력값이 반영된 span의 너비를 측정하고 input의 너비를 업데이트하기 위해,** `useEffect`를 활용했다.

`visuallyHiddenSpanRef.current.getBoundingClientRect().width`로 span의 너비를 측정하고 `setWidthInPx` 함수를 호출해 input의 너비를 업데이트하는 코드의 위치를 `handleChange`에서 `useEffect`로 변경했다.

**제일 앞 문자 하나가 덜 표시되는 문제가 해결되었다.**

![두 번째 시도](/images/posts/2024/auto-resize-input/auto-resize-input-try-2.gif)

하지만, **입력값이 깜빡이는(덜덜거리는) 문제가 발생했다.**

## 세 번째 시도: useLayoutEffect 활용

```tsx title="auto-resize-hashtag-input.tsx" showLineNumbers {27-35}
import styled from "@emotion/styled";
import {
  useLayoutEffect,
  useRef,
  useState,
  type ChangeEventHandler,
  type KeyboardEventHandler,
} from "react";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  onEnter: () => void;
};

const INITIAL_WIDTH_IN_PX = 60;

export default function AutoResizeHashtagInput({
  value,
  onValueChange,
  onEnter,
}: Props) {
  const [widthInPx, setWidthInPx] = useState(INITIAL_WIDTH_IN_PX);

  const visuallyHiddenSpanRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    if (visuallyHiddenSpanRef.current) {
      const nextWidth = Math.max(
        visuallyHiddenSpanRef.current.getBoundingClientRect().width,
        INITIAL_WIDTH_IN_PX,
      );
      setWidthInPx(nextWidth);
    }
  }, [value]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onValueChange(e.target.value);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    // form 태그 내부에서 AutoResizeHashtagInput 컴포넌트가 사용될 경우
    // enter 입력 시, 브라우저 기본동작으로 폼 제출되는 경우를 방지하기 위함.
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      onEnter();
      setWidthInPx(INITIAL_WIDTH_IN_PX);
    }
  };

  return (
    <>
      <VisuallyHiddenSpan ref={visuallyHiddenSpanRef}>
        {value}
      </VisuallyHiddenSpan>
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        widthInPx={widthInPx}
        placeholder="#태그"
      />
    </>
  );
}

const Base = styled.div`
  display: inline-block;
  border: none;
  border-radius: 8px;
  outline: none;
  padding: 4px 8px;
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
`;

const Input = styled(Base.withComponent("input"))<{ widthInPx: number }>`
  width: ${({ widthInPx }) => `${widthInPx}px`};
  background-color: rgb(244, 244, 245);
`;

const VisuallyHiddenSpan = styled(Base.withComponent("span"))`
  white-space: pre;
  position: absolute;
  visibility: hidden;
  left: -9999px;
`;
```

**`value` prop의 변경만 반영해 웹 브라우저가 화면을 새로 그리고 난 후에 `useEffect`의 effect 함수가 실행되어, 한 단계 늦게 input의 너비가 늘어나서** 입력값이 깜빡이는 문제가 발생했다.

**`value` prop의 변경 후, effect 함수를 동기적으로 실행시켜 `widthInPx` 상태 변화까지 완료되고 나서 웹 브라우저가 화면을 페인트 하도록 만들기 위해,** `useEffect` 대신 `useLayoutEffect`를 사용했다.

`useLayoutEffect`는 `useEffect`와 비슷하지만, effect 함수를 모두 실행시키고 나서 웹 브라우저가 페인팅을 하는 것을 보장하는 차이점이 있다.

[React 공식 문서](https://react.dev/reference/react/useLayoutEffect)에도, 깜빡거리는 문제가 발생하거나 브라우저가 페인트 하기 전에 effect 함수가 반드시 완료되어야 하는 경우는 `useEffect` 대신 `useLayoutEffect`를 사용하면 된다고 설명한다.

![세 번째 시도](/images/posts/2024/auto-resize-input/auto-resize-input-try-3.gif)

`useEffect`를 사용할 때와 달리 **깜빡거림 없이 잘 동작함을 확인할 수 있다.**

## 최종 구현: useLayoutEffect 제거 / 다시 handleChange 함수에서 input의 너비를 업데이트하기

앞서 `useLayoutEffect`를 이용해 구현한 코드도 문제가 없었지만, `handleChange` 함수 내부에서도 현재 입력값을 자식으로 가지는 span의 너비를 정확하게 알아낼 방법이 생각나서 적용하기로 했다.

기존에는 너비 업데이트를 `useLayoutEffect`에서, 값 업데이트를 `handleChange`에서 처리했다. **너비와 값 업데이트를 모두 `handleChange`에서 처리할 수 있다면,** 유저의 입력과 연관된 **상태 변화를 한곳에서 처리하게 되어 코드가 간결해질 것이라 생각**했다.

```tsx title="auto-resize-hashtag-input.tsx" showLineNumbers {28-35, 55}
import styled from "@emotion/styled";
import {
  useRef,
  useState,
  type ChangeEventHandler,
  type KeyboardEventHandler,
} from "react";

type Props = {
  value: string;
  onValueChange: (value: string) => void;
  onEnter: () => void;
};

const INITIAL_WIDTH_IN_PX = 60;

export default function AutoResizeHashtagInput({
  value,
  onValueChange,
  onEnter,
}: Props) {
  const [widthInPx, setWidthInPx] = useState(INITIAL_WIDTH_IN_PX);

  const visuallyHiddenSpanRef = useRef<HTMLSpanElement>(null);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onValueChange(e.target.value);
    if (visuallyHiddenSpanRef.current) {
      visuallyHiddenSpanRef.current.textContent = e.target.value;
      const nextWidth = Math.max(
        visuallyHiddenSpanRef.current.getBoundingClientRect().width,
        INITIAL_WIDTH_IN_PX,
      );
      setWidthInPx(nextWidth);
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    // form 태그 내부에서 AutoResizeHashtagInput 컴포넌트가 사용될 경우
    // enter 입력 시, 브라우저 기본동작으로 폼 제출되는 경우를 방지하기 위함.
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  const handleKeyUp: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      onEnter();
      setWidthInPx(INITIAL_WIDTH_IN_PX);
    }
  };

  return (
    <>
      <VisuallyHiddenSpan ref={visuallyHiddenSpanRef} />
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        widthInPx={widthInPx}
        placeholder="# 태그"
      />
    </>
  );
}

const Base = styled.div`
  display: inline-block;
  border: none;
  border-radius: 8px;
  outline: none;
  padding: 4px 8px;
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
`;

const Input = styled(Base.withComponent("input"))<{ widthInPx: number }>`
  width: ${({ widthInPx }) => `${widthInPx}px`};
  background-color: rgb(244, 244, 245);
`;

const VisuallyHiddenSpan = styled(Base.withComponent("span"))`
  white-space: pre;
  position: absolute;
  visibility: hidden;
  left: -9999px;
`;
```

`handleChange` 함수 내부에서 ref로 직접 span에 접근해 `textContent` 값을 `e.target.value`로 갱신하고(29번째 줄), 그 후 측정한 span의 너비로 `widthInPx` 상태를 업데이트했다.

ref로 `textContent` 값을 직접 변경하므로, span의 자식으로 `value` prop을 두는 코드는 제거했다. (55번째 줄)

input의 **값과 너비를 업데이트하는 코드를 `handleChange` 함수, 한 곳에 위치시켜 좀 더 읽기 편한 코드**가 되었다.

![최종 구현](/images/posts/2024/auto-resize-input/auto-resize-input-final.gif)

`useLayoutEffect`를 사용했을 때와 마찬가지로 깜빡임 없이 **잘 동작한다.**

## 활용 예시

만든 `AutoResizeHashtagInput` 컴포넌트를 활용해서 실무에서는 다음과 비슷한 UI를 가지는 폼을 만들었다.

![활용 예시](/images/posts/2024/auto-resize-input/auto-resize-input-example.gif)

클라이언트 코드는 다음과 같다.

```tsx title="app.tsx"
import { useState } from "react";
import styled from "@emotion/styled";
import AutoResizeHashtagInput from "./auto-resize-hashtag-input";

export default function App() {
  const [hashtag, setHashtag] = useState("");

  const [hashtagSet, setHashtagSet] = useState<Set<string>>(() => new Set());

  const handleChange = (hashtag: string) => {
    setHashtag(hashtag);
  };

  const handleEnter = () => {
    if (hashtag === "") return;

    const nextHashtagSet = new Set(hashtagSet);
    nextHashtagSet.add(hashtag);
    setHashtagSet(nextHashtagSet);
    setHashtag("");
  };

  return (
    <section>
      <h2>Hashtags</h2>
      <Hashtags>
        {[...hashtagSet].map((tag) => (
          <Hashtag key={tag}>{tag}</Hashtag>
        ))}
        <AutoResizeHashtagInput
          value={hashtag}
          onValueChange={handleChange}
          onEnter={handleEnter}
        />
      </Hashtags>
    </section>
  );
}

const Hashtags = styled.div`
  display: flex;
  flex-flow: wrap;
  gap: 8px;
  width: 320px;
  overflow-x: auto;
  border: 1px solid gray;
  border-radius: 8px;
  padding: 8px;
  margin-top: 8px;
`;

const Hashtag = styled.div`
  border: 1px solid gray;
  background-color: rgb(244, 244, 245);
  border-radius: 8px;
  outline: none;
  padding: 4px 8px;
  font-size: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  white-space: pre;
`;
```

## 소감

입력값에 따라 알아서 너비가 늘어나고 줄어드는 input 컴포넌트를 React를 이용해 만들었다. 생각보다 간단하지 않았고, 구현할 때마다 버그가 생겨서 해결하려고 노력했다.

최종 구현에서는 `useEffect`나 `useLayoutEffect`를 사용하지 않았지만, 구현 과정에서 이 둘의 차이를 직접 눈으로 확인할 수 있어서 좋았다.
