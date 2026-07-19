---
title: "유전체 기반 신생아 선별검사 주문 포털 개발 회고"
description: "유전체 기반 신생아 선별검사 주문 포털 - 프론트엔드 개발 회고, FSD 도입 및 문제 해결"
createdAt: 2026-07-19
tags:
  - "회고"
  - "React"
  - "개발 환경 설정"
  - "Troubleshooting"
  - "Claude"
  - "FSD"
seriesId: "업무 회고록"
---

2026년 4 ~ 5월, 회사에서 진행하는 신생아 대상 유전자 검사 주문 포털 개발에 참여했다. 나는 주로, 초기 개발환경 설정을 맡아서 진행했다.

초기 개발환경 설정을 하면서 **신경써서 진행했던 부분**은 **FSD의 도입**과 **다국어 처리** 설정이다.

회고에 등장하는 코드는 프로덕션 코드가 아니라 예시코드이다.

## FSD (Feature-Sliced Design) 도입 결정

이전에 다른 프로젝트를 진행할 때, 동료의 추천으로 FSD를 접하게 되었다.

FSD를 사용해보고 느낀점은 다음과 같았다.

### 장점

- FSD 규칙에 익숙한 개발자는 코드를 파악하기 쉽고, 코드의 위치도 유추하기 쉬움.
- 폴더 구조에 대한 컨벤션을 따로 고민할 필요 없고, FSD의 규칙을 따르면 됨.
- 대부분의 비즈니스 로직(기능)을 동일한 구조의 코드 패턴으로 작성할 수 있음.
  - entities → features → page 레이어 형태로 풀어낼 수 있음.

### 단점

- [공식 문서](https://fsd.how/)가 존재할 만큼, 잘 쓰려면 알아야 할 게 많음.
- 익숙해 졌다고 생각해도, 가끔식 파일을 어디에 두어야 할지 고민될 때가 있음.
- FSD를 적용한 예제 프로젝트들을 서로 비교해봤을 때, 조금씩 다른 부분이 있고, 그 다른 부분을 우리 프로젝트에서는 어떻게 할 지 결정해야 함.
  - 어떤 프로젝트는 api 호출하는 함수를 모두 모아서, shared 레이어에 둠.
  - 다른 프로젝트는 colocation을 지켜서 "api를 호출하는 함수를 사용하는 코드의 레이어" 혹은 "그 하위 레이어"에 api를 호출하는 함수를 위치 시킴.

좀 더 **일관성 있는 코드를 작성**할 수 있고, **폴더 구조나 아키텍쳐에 대한 고민을 줄일 수 있어서** 이번 프로젝트를 진행할 때도 FSD를 도입하기로 했다.

## FSD 관련 프로젝트 설정

다음과 같은 린터와 스킬을 프로젝트에 설정했다.

- [`Steiger`](https://github.com/feature-sliced/steiger): 프로젝트의 구조가 FSD에 맞는지 검사하는 린터
- [`feature-sliced-design`](https://www.skills.sh/feature-sliced/skills/feature-sliced-design): AI agent를 위한 FSD 관련 스킬

둘 다 FSD 공식 문서에서 추천하는 도구이다.

## FSD 관련 커스텀 스킬 만들기

좀 더 구체적이고, 이번에 진행하는 프로젝트에 맞는 컨벤션과 가이드가 있다면, 개발 초기 단계 부터 Claude가 개발자가 원하는 코드를 생산해줄 거 같았다. 그래서, 이번 프로젝트에 적용할 커스텀 스킬을 만들기로 결정 했다.

스킬 내용을 직접 다 작성하는 것은 오래 걸릴거 같아, **직접 원하는 스타일의 예시 코드를 작성하고, Claude를 활용해 코드를 분석 시켜 스킬을 추출**했다.

### 예시 코드 작성 및 스킬 추출

예시 코드는

- Tanstack Query, zod, react hook form, msw 등의 기술 스택을 FSD 내에서 어떻게 활용할 것인지
- 쿼리와 entities 레이어를 어떻게 구성할 것인지
- 뮤테이션과 features 레이어를 어떻게 구성할 것인지
- 파일명은 어떻게 할 것인지

고민하면서 작성했다.

스킬을 만들기 위한 코드는 유전자 검사를 조회하고 생성하는 기능을 만든다고 가정하고 작성했다. (예시 코드는 단순히 프로젝트 초기 코드 컨벤션과 구조를 잡기 위한 예시 코드라, 실제 프로덕션 코드가 아니다.)

![entities-layer-structure](/images/posts/2026/newborn-screening-project-retrospective/entities-layer-structure.png)

- entities 레이어의 test 슬라이스를 위와 같이 구상했다.
- 슬라이스 안에 코드의 역할을 표현할 수 있는 api, lib, model, ui 같은 세그먼트를 두었다.
- 각 파일의 이름을 `{도메인}.{역할}` 형태의 케밥케이스로 작성했다.

각 파일의 내용을 살펴보자.

```ts title="src/entities/test/model/test.ts" showLineNumbers
export type TestStatus =
  | "ordered"
  | "sampleTransit"
  | "inProgress"
  | "resultsReady";

export type Test = {
  id: string;
  name: string;
  code: string;
  orderedAt: Date;
  status: TestStatus;
};
```

- 유전자 검사를 의미하는 Test 엔티티를 정의했다.
