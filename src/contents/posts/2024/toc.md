---
title: "TOC(Table of Contents) 컴포넌트 만들기"
description: "글 상세 페이지에서 사용할 TOC 컴포넌트 개발 후기"
createdAt: 2024-12-04 13:43:06
tags:
  - "React"
  - "회고"
  - "Next.js"
series: "개인 웹 사이트 개발"
---

## 만들고 싶은 것

글 내부의 제목(h2, h3)을 활용해 간단하게 **글의 목차를 표시**하고 싶었다. 또, **사용자가 보고있는 영역의 제목을 highlight**해서 현재 어떤 부분을 읽고 있는지 쉽게 알려주고 싶었다. 이러한 TOC 컴포넌트는 라이브러리의 공식문서, 블로그 등에서 널리 사용되는 컴포넌트이기도 하다.

![toc-example](/images/posts/2024/toc/react-doc-toc-example.png)

위의 그림은 React 공식 문서에서 사용하는 TOC인데, 위와 같은 컴포넌트를 개발하고 싶었다.

## 글 내부의 제목을 추출해서 표시하기

한 번에 모든 기능을 구현하기 어려울 것 같아서, 먼저 글 내부의 제목을 추출해서 표시하는 기능부터 구현하기로 했다.

먼저 생각한 방법은 **웹 브라우저에서 `document.querySelectorAll("h2,h3")`를 호출**해 제목을 추출하는 방법이다. 사용하는 데 문제 없는 방식이긴 하지만 브라우저에서 컴포넌트가 mount 되고 나서야 목차를 표시할 수 있다. ~~(물론 금방 표시된다.)~~

"next 애플리케이션을 build 할 때 서버가 글 데이터를 다 가지고 있는데, 굳이 브라우저에서 제목을 추출해야 하나? 서버에서도 충분히 할 수 있을거 같은데"라는 생각이 들었고, 서버에서 제목을 추출하는 방법을 찾던 중 `@vcarl/remark-headings`라는 remark plugin을 발견하게 되었다.

`@vcarl/remark-headings` plugin은 markdown에서 `#`, `##` 등으로 시작하는 **제목을 추출해주는 plugin**이고, **서버에서 파일형태로 저장된 글들을 읽고나서** 이 plugin을 이용해 글 안의 제목 정보를 추출하도록 만들었다. 추출한 제목 정보로 목차를 화면에 표시하면 된다.

## 목차 아이템을 클릭했을 때, 해당 영역으로 스크롤하는 기능 구현

다음으로 구현해야 할 기능은 **목차 아이템을 클릭했을 때, 해당 목차 아이템을 제목으로 하는 영역이 화면에 나타나도록 스크롤**하는 기능이다.

`element.scrollIntoView()` 메서드를 사용할 수도 있지만, 이를 위해서는 글 내부의 모든 제목을 ref로 접근할 수 있도록 별도의 코드를 작성해야 한다.

실제로 구현할 때는 **URI fragment**를 사용했다. `https://react.dev/learn/your-first-component#components-ui-building-blocks` 에서 `#components-ui-building-blocks` 부분을 `URI fragment`라고 한다. `#`으로 시작하는 문자열이고 리소스의 특정 부분을 식별하는데 사용한다. 리소스의 특정 부분이라함은 '문서의 특정 section'이나 '영상의 특정 position'이 될 수 있다. fragment는 서버에 URI를 요청할 때 전송하지 않고, 리소스를 불러온 후 클라이언트에서 처리한다는 특징이 있다. 또, HTML 문서에서 element의 id가 fragment가 될 수 있고, **fragment가 포함된 URI를 웹 브라우저 주소창에 입력하면 브라우저가 해당 element로 스크롤한다.**

**글을 HTML로 변환할 때 h2, h3 태그에 id를 부여**하고, TOC 컴포넌트에서는 **해당 id fragment를 가리키는 link로 목차 아이템을 만들면**, 브라우저의 기본 동작에 의해 **목차 아이템(링크)을 클릭했을 때 해당 영역으로 이동하게 된다.**

markdown 형태의 글을 HTML로 변환하면서 생성될 h2, h3 태그에 id를 값을 기반으로 자동으로 부여하기 위해서 `remark-heading-id` plugin을 활용했다.

## 중간 정리

지금까지의 아이디어를 정리하면 다음과 같다.

- markdown 또는 mdx 형식의 **글을 HTML로 변환할 때**, `remark-heading-id` plugin을 사용해 heading의 값을 기반으로 **id를 만들어 생성될 h2, h3 태그에 주입**한다.
- markdown 또는 mdx 형식의 글에 `@vcarl/remark-headings plugin`을 적용해 **글 내부의 제목 정보를 모두 추출**한다.
- **추출한 글 내부의 제목 정보를 순회하면서 리스트 형식으로 목차 아이템을 표시**한다. **목차 아이템은 `#{id}`를 href로 하는 링크**이다.

추가로, **스크롤이 부드럽게** 되길 바란다면 스크롤 컨테이너에 `scroll-behavior: smooth;` CSS를 적용하면 된다.

![toc-implement](/images/posts/2024/toc/toc-implement.webp)

구현 결과는 위와 같다. 목차 아이템을 클릭했을 때 해당 영역으로 잘 이동한다.

## 사용자가 보고 있는 영역의 제목을 highlight 하기

마지막으로 구현하고 싶었던 기능은 사용자가 보고 있는 영역의 제목을 highlight 하는 기능이다.

화면에 표시될 **h2, h3 태그의 가시성 변화를 감지**하면 될 것 같아 **Intersection Observer**를 이용해 구현하기로 했다.

### Intersection Observer로 h2, h3를 관찰하는 방법을 이용한 구현

```tsx title="post-article-toc-sidebar.tsx" showLineNumbers {16-18,21-23,25-48,50-53,55-57,72}
"use client";

import { useEffect, useState } from "react";
import PostArticleTOCItem from "./post-article-toc-item";
import HorizontalSeparator from "../../separator/horizontal-separator";

type Props = {
  headings: {
    type: "h2" | "h3";
    text: string;
    id: string;
  }[];
};

export default function PostArticleTOCSidebar({ headings }: Props) {
  const [activeHeadingIdSet, setActiveHeadingIdSet] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    const headingElements = headings.map((heading) =>
      document.querySelector(`#article-content #${heading.id}`),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute("id");
          if (!id) continue;
          if (entry.isIntersecting) {
            setActiveHeadingIdSet((prev) => {
              const nxt = new Set(prev);
              nxt.add(id);
              return nxt;
            });
          } else {
            setActiveHeadingIdSet((prev) => {
              const nxt = new Set(prev);
              nxt.delete(id);
              return nxt;
            });
          }
        }
      },
      {
        rootMargin: "-64px 0px 0px 0px", // sticky header 영역 제외
      },
    );

    for (const headingElement of headingElements) {
      if (!headingElement) continue;
      observer.observe(headingElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [headings]);

  return (
    <section className="max-h-full rounded-md border border-zinc-300 dark:border-zinc-700 p-3 flex flex-col gap-3">
      <h2 className="text-lg shrink-0">목차</h2>
      <HorizontalSeparator />
      <nav className="flex-grow overflow-auto">
        <ul className="flex flex-col gap-1">
          {headings.map((item) => (
            <PostArticleTOCItem
              key={item.id}
              type={item.type}
              link={`#${item.id}`}
              text={item.text}
              isActive={activeHeadingIdSet.has(item.id)}
            />
          ))}
        </ul>
      </nav>
    </section>
  );
}
```

Intersection Observer 같은 웹 브라우저가 제공하는 API를 사용할 것이므로, useEffect를 사용했다.

**16-18번째 줄**에서 현재 사용자가 보고 있는 h2, h3 태그의 id들을 set으로 관리하는 상태, `activeHeadingIdSet`을 정의했다.

**21-23번째 줄**에서 (Intersection Observer에 등록하기 위해) querySelector로 `heading.id`를 id 값으로 갖는 h2, h3 element들을 모두 찾는다. (처음에는 querySelectorAll로 h2, h3 태그를 모두 찾았는데, 추후 IntersectionObserver가 어느 순간 동작하지 않는 이슈가 발생했다. ~~왜 그런지 모르겠네 ㅜㅜ~~)

**25-48번째 줄**에서 **callback 함수**와 **options**을 인자로 넘기면서 Intersection Observer 인스턴스를 생성한다.

options에서는 관찰 영역을 설정할 수 있고, 기본적으로는 viewport가 관찰 영역이 된다. **46번째 줄**에서 **rootMargin**을 설정했는데, 관찰 영역의 margin을 설정하는 옵션이다. header가 계속 viewport에 표시되므로 header 영역을 관찰 영역에서 제외하려고 설정했다.

callback 함수는 관찰 대상의 가시성에 변경사항이 있을 때 호출된다. callback의 첫 번째 인자로, **가시성에 변경사항이 있는 관찰 대상들만 요소로 하는 배열**이 들어온다.

**27번째 줄**에서 가시성에 변화가 있는 모든 element를 순회하면서, 해당 element의 id 속성을 조회하고(**28-29번째 줄**), viewport에 들어온 element의 경우(`isIntersecting`이 `true`인 경우, **30번째 줄**)엔 `activeHeadingIdSet`에 추가하고, viewport에서 나간 element의 경우(**36번째 줄**) `activeHeadingIdSet`에서 제거한다. **즉 h2, h3가 viewport에 들어오면 `activeHeadingIdSet`에 추가하고, h2, h3가 viewport에서 나가게 되면 `activeHeadingIdSet`에서 제거했다.**

**50-53번째 줄**에서 Intersection Observer 인스턴스에 앞서 찾은 h2, h3 element들을 모두 관찰 대상으로 등록한다.

**55-57번째 줄**의 clean up 함수에서 등록한 관찰 대상을 모두 해제한다.

**72번째 줄**에서는 현재 viewport에 들어온 h2, h3의 id들을 담고 있는 상태, `activeHeadingIdSet`을 활용해 해당 목차 아이템의 활성화 상태를 결정했다.

![observing-headings](/images/posts/2024/toc/toc-highlight-observing-headings-1.webp)

구현 결과 잘 동작하는 것처럼 보인다. (여러개의 h2, h3가 동시에 viewport에 들어오면 모두 highlight 되도록 구현했다.)

### 문제점

![observing-headings-bugs](/images/posts/2024/toc/toc-highlight-observing-headings-2.webp)

위 그림에서 "결과" -> "클라이언트 코드에서 타입 추론이 제대로 되지 않는 문제 해결" **영역**으로 스크롤을 옮겼음에도, TOC 컴포넌트에서 "클라이언트 코드에서 타입 추론이 제대로 되지 않는 문제 해결" 목차 아이템이 highlight 되지 않았다.

원인은 생각보다 간단한데, "클라이언트 코드에서 타입 추론이 제대로 되지 않는 문제 해결" 제목이 viewport에 나타나지 않았기 때문이다. 위에서 구현할 때 Intersection Observer로 h2, h3 제목을 관찰했으므로 제목이 viewport에 나타나지 않으면 TOC 컴포넌트는 반응하지 않는다.

### 해결

**제목을 관찰하는 게 아니라 제목을 포함한 영역을 관찰해야 겠다**는 생각이 들었고, h2, h3를 div나 section 같은 태그로 감싸고 그 태그를 관찰하도록 만들면 될 것 같았다.

다행히 `remark-sectionize` plugin을 이용하면 markdown/mdx에서 HTML로 글을 변환하면서 h2, h3를 감싸는 section을 쉽게 주입할 수 있었다.

```md
## heading2

This is heading2 content

### heading3 - 1

This is heading3 - 1 content

### heading3 - 2

This is heading3 - 2 content
```

위의 markdown은 HTML로 변환하면

```html
<h2>heading2</h2>
<p>This is heading2 content</p>
<h3>heading3 - 1</h3>
<p>This is heading3 - 1 content</p>
<h3>heading3 - 2</h3>
<p>This is heading3 - 2 content</p>
```

원래는 위의 형태로 변환되는데, `remark-sectionize` plugin을 사용하면

```html
<section>
  <h2>heading2</h2>
  <p>This is heading2 content</p>
  <section>
    <h3>heading3 - 1</h3>
    <p>This is heading3 - 1 content</p>
  </section>
  <section>
    <h3>heading3 - 2</h3>
    <p>This is heading3 - 2 content</p>
  </section>
</section>
```

위의 형태로 변환된다. h2, h3를 감싸는 section 태그가 생성되었다.

그리고 이젠 h2, h3 대신 section을 관찰할 것이다. 다음과 같이 코드를 수정했다.

```tsx title="post-article-toc-sidebar.tsx" showLineNumbers {21-23, 28-29,52-54}
"use client";

import { useEffect, useState } from "react";
import PostArticleTOCItem from "./post-article-toc-item";
import HorizontalSeparator from "../../separator/horizontal-separator";

type Props = {
  headings: {
    type: "h2" | "h3";
    text: string;
    id: string;
  }[];
};

export default function PostArticleTOCSidebar({ headings }: Props) {
  const [activeHeadingIdSet, setActiveHeadingIdSet] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    const sectionElements = document.querySelectorAll(
      "#article-content section",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const heading = entry.target.querySelector("h2,h3");
          if (!heading) continue;
          const id = heading.getAttribute("id");
          if (!id) continue;
          if (entry.isIntersecting) {
            setActiveHeadingIdSet((prev) => {
              const nxt = new Set(prev);
              nxt.add(id);
              return nxt;
            });
          } else {
            setActiveHeadingIdSet((prev) => {
              const nxt = new Set(prev);
              nxt.delete(id);
              return nxt;
            });
          }
        }
      },
      {
        rootMargin: "-64px 0px 0px 0px", // sticky header 영역 제외
      },
    );

    sectionElements.forEach((sectionElement) =>
      observer.observe(sectionElement),
    );

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="max-h-full rounded-md border border-zinc-300 dark:border-zinc-700 p-3 flex flex-col gap-3">
      <h2 className="text-lg shrink-0">목차</h2>
      <HorizontalSeparator />
      <nav className="flex-grow overflow-auto">
        <ul className="flex flex-col gap-1">
          {headings.map((item) => (
            <PostArticleTOCItem
              key={item.id}
              type={item.type}
              link={`#${item.id}`}
              text={item.text}
              isActive={activeHeadingIdSet.has(item.id)}
            />
          ))}
        </ul>
      </nav>
    </section>
  );
}
```

`headings` prop이 가지고 있는 id 값을 이용해 id 속성을 갖는 h2, h3를 조회하는 대신, **21-23번째 줄**에서 section들을 조회했다.

그리고 **52-54번째 줄**에서 이 section들을 Intersection Observer의 관찰 대상으로 등록했다.

callback 내부에서는 `entry`가 더이상 h2, h3 element가 아니라 section element이기 때문에 자식 h2, h3 element를 찾는 과정이 추가되었다. (**28-29번째 줄**)

![observing-sections](/images/posts/2024/toc/toc-highlight-observing-section.webp)

이제 "결과" -> "클라이언트 코드에서 타입 추론이 제대로 되지 않는 문제 해결" 영역으로 스크롤을 옮기면, 비록 "클라이언트 코드에서 타입 추론이 제대로 되지 않는 문제 해결"이라는 **제목이 viewport에 없어도, 그 제목을 포함하는 영역이 viewport에 나타나면** TOC에서 "클라이언트 코드에서 타입 추론이 제대로 되지 않는 문제 해결" **목차 아이템을 highlight 한다.**

## 정리

개인 웹 사이트를 개발하면서 글 관련 기능으로 TOC 기능을 꼭 구현하고 싶었다. 글 전체의 흐름을 알려주고 글 내부의 여기 저기를 편하게 옮겨 다닐 수 있어서 유용할 것 같았다.

쉽게 만들 수 있을 것 같았는데 구현하다보니 신경써야 할 부분이 많았다.

서버에서 글들을 읽어들이고 HTML로 변환할 때, remark 플러그인을 활용해 h2, h3 관련 데이터를 미리 추출하고 이를 이용해 TOC 컴포넌트의 목차 아이템들을 표시했다.

또, 글들을 HTML로 변환할 때 h2, h3 태그에 id 속성을 주입하고(값을 기반으로 자동 생성, remark plugin 활용) 목차 아이템을 해당 h2, h3를 가리키는 링크로 만들어(URI fragment 활용) 목차 아이템을 클릭했을 때 해당 영역으로 스크롤하는 기능을 구현했다.

사용자가 현재 보고 있는 부분의 목차 아이템을 highlight 하는 기능을 만들기 위해서 viewport의 h2, h3의 가시성을 관찰하는 Intersection Observer를 활용하는 방법을 사용했었다. 잘 동작하는 것 같았지만 h2, h3의 가시성만 관찰했기 때문에 viewport에 h2, h3가 없는 경우 사용자가 보고 있는 영역의 제목을 highlight 하지 못했다.

글을 HTML로 변환할 때 h2, h3를 감싸는 section을 주입했고, Intersection Observer가 h2, h3 대신 이 section을 관찰하도록 구현해서 비록 viewport에 h2, h3 태그가 없더라도 사용자가 보고 있는 영역을 판단할 수 있게 고쳤다.
