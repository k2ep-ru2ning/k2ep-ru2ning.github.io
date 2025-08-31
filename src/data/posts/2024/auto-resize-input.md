---
title: "value 값에 따라 width가 늘어나고 줄어드는 input 컴포넌트 만들기"
description: "value 값에 따라 width가 알아서 늘어나고 줄어드는 input (React) 컴포넌트를 만들면서 겪었던 시행착오 정리"
createdAt: 2024-01-16 20:00:00
tags:
  - "회고"
  - "React"
seriesId: "업무 회고록"
---

회사에서 해시태그 입력 폼을 개발하던 도중, **value 값에 따라서 너비가 늘어나고 줄어드는 input React 컴포넌트**를 개발하게 되었다.

생각보다 간단하지 않았고 잊어버리기 전에 개발 과정에서 겪었던 시행착오를 기록하고 싶어서 정리했다.

## 요구사항

- input 태그는 "최소 width" 미만으로 줄어들지 않는다. (**항상 "최소 width" 이상으로 유지된다.**)
- "input의 value가 차지하는 width"가 "input의 최소 width" 이상인 경우, "input의 width"는 "input의 value가 차지하는 width"가 되어야 한다. (즉, input의 width는 input의 value를 모두 표시하는 최소 width여야 한다.)
- "input의 value가 차지하는 width"가 "input의 최소 width" 미만인 경우, "input의 width"는 "input의 최소 width"이면 된다.

## 아이디어

사용자가 입력할 때마다, input 태그의 width를 업데이트하면 된다.

"입력할 때마다 input 태그의 width를 **어떤 값**으로 업데이트해야 할까"가 고민거리이다.

문자마다 너비를 `W` px이라고 가정하고, 입력할 때마다 input의 width를 `value.length * W` px로 설정하는 아이디어를 떠올릴 수 있다. 하지만 영어, 한글, 공백 등 문자마다 너비가 다르기 때문에, value 문자열이 화면에서 차지하는 정확한 width가 `value.length * W` px이 아니다.

또 다른 아이디어는 input 태그와 같은 스타일링을 적용한 span 태그를 사용하는 것이다. **사용자가 입력할 때마다 input의 value를 span의 textContent로 설정하고, span 태그의 width를 input의 width로 삼는 것이다.** 이렇게 하면 value 문자열이 화면에서 차지하는 정확한 width를 span의 width로 알 수 있다. 물론 span 태그를 화면에 표시할 필요없으니 화면에 나타나지 않게 하는 스타일링도 필요하다.

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
    // enter 입력 시, 브라우저 기본동작으로 폼 제출 되는 경우를 방지하기 위함.
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

54-56번째 줄 코드에서 span 태그의 자식으로 value prop을 두었다. 28-34번째 줄 코드에서 사용자가 입력했을 때 `visuallyHiddenSpanRef.current.getBoundingClientRect().width`로 span 태그의 width를 얻고, 이 값을 인자로 `setWidthInPx` 함수를 호출해 input 태그의 width를 업데이트했다.

잘 동작할 것 같았지만 아래 그림처럼 잘 동작하지 않았다.

![첫 번째 시도](/images/posts/2024/auto-resize-input/auto-resize-input-try-1.gif)

value 값의 변화에 한 단계 늦게 반응했다. handleChange가 호출된 시점에서 `e.target.value`는 사용자의 마지막 입력값을 의미하지만, value prop은 바로 직전 입력값을 의미한다. 따라서 이 시점에서 `visuallyHiddenSpanRef.current.getBoundingClientRect().width`를 참조해도 직전 입력값의 width일 뿐이다. 그래서 한 단계 늦게 width를 늘려서 앞부분이 잘려서 표시된다.

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
    // enter 입력 시, 브라우저 기본동작으로 폼 제출 되는 경우를 방지하기 위함.
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

`visuallyHiddenSpanRef.current.getBoundingClientRect().width`로 span 태그의 width를 측정하고 `setWidthInPx` 함수를 호출해 input의 width를 업데이트하는 코드의 위치를 change event handler에서 useEffect로 변경했다.

value prop이 변경되어 re-rendering이 발생한 경우 effect 함수 내에서 `visuallyHiddenSpanRef.current.getBoundingClientRect().width`로 span 태그의 width를 참조하는데, 이때는 이미 span의 자식인 value prop이 업데이트 된 이후라서 사용자의 마지막 입력값의 너비를 잘 반영한다.

한단계 늦게 width가 반응하는 문제가 해결되었다.

![두 번째 시도](/images/posts/2024/auto-resize-input/auto-resize-input-try-2.gif)

하지만 빠르게 입력했을 때, 입력값이 깜빡이는(덜덜거리는) 문제가 발생했다.

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
    // enter 입력 시, 브라우저 기본동작으로 폼 제출 되는 경우를 방지하기 위함.
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

useEffect 대신, useLayoutEffect를 사용해서 문제를 해결했다.

useLayoutEffect는 useEffect와 비슷하지만, 웹 브라우저가 repaint하기 전에 effect 함수를 동기적으로 실행하는 것을 보장한다는 차이점이 있다.

useEffect를 사용했을 때는 effect 함수 내부의 `setWidthInPx` 함수 호출이 끝나기 전에 브라우저가 paint할 수 있어서, input 태그의 width가 입력값에 맞게 변하기 전에 화면에 표시되어 깜빡거리는 문제가 발생했다.

반면 useLayoutEffect를 사용하면, effect 함수 내에서 `setWidthInPx` 함수 호출이 완료되고 상태가 업데이트 된 이후에 브라우저가 paint하기 때문에 깜빡거리지 않는다.

React 공식문서에도, 깜빡거리는 문제가 발생하거나 브라우저가 paint하기 전에 effect 함수가 반드시 완료되어야 하는 경우는 useEffect 대신 useLayoutEffect를 사용하면 된다고 설명한다.

![세 번째 시도](/images/posts/2024/auto-resize-input/auto-resize-input-try-3.gif)

useEffect를 사용할 때와 달리 깜빡거림 없이 잘 동작함을 확인할 수 있다.

## 최종 구현: useLayoutEffect 제거 / 다시 change event handler에서 input의 width를 업데이트 하기

앞서 useLayoutEffect를 이용해 구현한 코드도 문제가 없었지만, change event handler 내부에서도 현재 입력값을 자식으로 가지는 span 태그의 width를 정확하게 알아낼 방법이 생각나서 적용하기로 했다.
input의 width 업데이트를 change event handler 내에서 할 수 있다면 굳이 useLayoutEffect 쓸 필요도 없고, 코드도 간결해질 것 같았다.

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
    // enter 입력 시, 브라우저 기본동작으로 폼 제출 되는 경우를 방지하기 위함.
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

change event handler 내부에서 ref로 직접 span 태그에 접근해 `textContent` 값을 `e.target.value`로 갱신하고(29번째 줄), 그후 span 태그의 width로 widthInPx state를 업데이트했다.

ref로 `textContent` 값을 직접 변경하므로, span 태그의 자식으로 value prop을 두는 코드는 제거했다. (55번째 줄)

(input 태그의 width를 의미하는) widthInPx state를 갱신하는 코드를, 입력값 변경되었을 때 호출될 change event handler 함수에 두어서 useEffect나 useLayoutEffect를 사용할 때보다 코드 파악하기 더 쉬워졌다.

![최종 구현](/images/posts/2024/auto-resize-input/auto-resize-input-final.gif)

useLayoutEffect를 사용했을 때와 마찬가지로 깜빡임 없이 잘 동작한다.

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

## 정리

입력한 value 값에 따라 알아서 너비가 늘어나고 줄어드는 input 컴포넌트를 React를 이용해 만들었다. 생각보다 간단하지 않았고, 구현 할 때마다 버그가 생겨서 해결하려고 노력했다.

최종 구현에서는 useEffect나 useLayoutEffect를 사용하지 않았지만, 구현 과정에서 이 둘의 차이를 직접 눈으로 확인할 수 있어서 좋았다.
