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

예시 코드는

- Tanstack Query, zod, react hook form, msw 등의 기술 스택을 FSD 내에서 어떻게 활용할 것인지
- 쿼리와 entities 레이어를 어떻게 구성할 것인지
- 뮤테이션과 features 레이어를 어떻게 구성할 것인지
- 파일명은 어떻게 할 것인지

고민하면서 작성했다.

스킬을 만들기 위한 코드는 유전자 검사를 조회하고 생성하는 기능을 만든다고 가정하고 작성했다. (예시 코드는 단순히 프로젝트 초기 코드 컨벤션과 구조를 잡기 위한 예시 코드라, 실제 프로덕션 코드가 아니다.)

### entities 레이어, 조회 관련 예시 코드 작성

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

```ts title="src/entities/test/api/test.contracts.ts" showLineNumbers
import * as z from "zod";

export const testDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  orderedAt: z.iso.datetime(),
  status: z.enum(["ordered", "sampleTransit", "inProgress", "resultsReady"]),
});

export const testsDtoSchema = z.object({
  tests: z.array(testDtoSchema),
});

export const createTestDtoSchema = z.object({
  name: z.string(),
  code: z.string(),
});

export type TestDto = z.infer<typeof testDtoSchema>;
export type TestsDto = z.infer<typeof testsDtoSchema>;
export type CreateTestDto = z.infer<typeof createTestDtoSchema>;
```

- 검사 조회 응답 DTO, 검사 생성 요청 DTO를 정의했다.
- zod로 DTO 스키마를 정의하고, 타입을 추출하는 방식을 사용했다.

```ts title="src/entities/test/api/test.api.ts" showLineNumbers
import { apiClient, responseContract } from "@/shared/api";

import {
  testDtoSchema,
  testsDtoSchema,
  type CreateTestDto,
  type TestDto,
  type TestsDto,
} from "./test.contracts";

import type { AxiosRequestConfig, AxiosResponse } from "axios";

export async function getMyTests(
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<TestsDto>> {
  const response = await apiClient.get("/me/tests", config);
  return responseContract(testsDtoSchema)(response);
}

export async function createTest(
  payload: CreateTestDto,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<TestDto>> {
  const response = await apiClient.post("/me/tests", payload, config);
  return responseContract(testDtoSchema)(response);
}
```

- Test 엔티티 관련, 서버 API 호출 함수를 정의했다.

```ts title="src/entities/test/api/test.queries.ts" showLineNumbers {12, 14-17}
import { createQueryKeys } from "@lukemorales/query-key-factory";
import { queryOptions } from "@tanstack/react-query";

import { getMyTests } from "./test.api";
import { transformTestsDtoToTests } from "../lib/test.transform";

export const testKeys = createQueryKeys("tests", {
  list: null,
});

export function myTestsQueryOptions() {
  return queryOptions({
    queryKey: testKeys.list.queryKey,
    queryFn: async ({ signal }) => {
      const { data } = await getMyTests({ signal });
      return transformTestsDtoToTests(data);
    },
  });
}
```

- Tanstack Query의 **쿼리 옵션을 생성하는 함수**들을 정의했다.
- `useQuery`나 `useSuspenseQuery`를 감싸는 커스텀 훅을 만드는 것보다 유연한 방식이라고 생각해서, 쿼리 옵션을 활용했다.
- 쿼리 함수가 **API를 호출하고, DTO를 엔티티로 변환하는 역할**까지 담당하도록 작성했다.
- Test 관련 뮤테이션은 features 레이어에서 다룰거라 여기서 다루지 않는다.

```ts title="src/entities/test/api/test.mocks.ts" showLineNumbers
import { delay, http, HttpResponse } from "msw";

import { env } from "@/shared/config";

import {
  createTestDtoSchema,
  type TestDto,
  type TestsDto,
} from "./test.contracts";

const delayTimeInMs = 1000;

const baseURL = env.VITE_API_BASE_URL;

let store: TestDto[] = [];

export const testHandlers = [
  http.get(`${baseURL}/me/tests`, async () => {
    await delay(delayTimeInMs);
    return HttpResponse.json({ tests: store } satisfies TestsDto);
  }),
  http.post(`${baseURL}/me/tests`, async ({ request }) => {
    await delay(delayTimeInMs);
    const body = createTestDtoSchema.parse(await request.json());
    const created: TestDto = {
      id: `test-${crypto.randomUUID()}`,
      name: body.name,
      code: body.code,
      orderedAt: new Date().toISOString(),
      status: "ordered",
    };
    store = [created, ...store];
    return HttpResponse.json(created, { status: 201 });
  }),
];
```

- `test.api.ts` 에서 호출할 서버 응답을 mocking 하는 msw 핸들러
- `test.api.ts` 와 가깝게 위치시키는게 좋다고 생각해서, `entities/test`에 위치 시킴 (스포일러: 이 선택이 추후, 문제를 발생시킴)

```ts title="src/entities/test/lib/test.transform.ts" showLineNumbers
import type { TestDto, TestsDto } from "../api/test.contracts";
import type { Test } from "../model/test";

export function transformTestDtoToTest(testDto: TestDto): Test {
  return {
    id: testDto.id,
    name: testDto.name,
    code: testDto.code,
    orderedAt: new Date(testDto.orderedAt),
    status: testDto.status,
  };
}

export function transformTestsDtoToTests(testsDto: TestsDto): Test[] {
  return testsDto.tests.map(transformTestDtoToTest);
}
```

- 조회 응답 DTO → 엔티티로 변환하는 함수를 정의했다.

그외에 `src/entities/test/ui`에 test 엔티티 관련 컴포넌트를 정의했다.

마지막으로 Barrel 파일 형태로 외부에서 사용할 Public API들을 export 했다.

```ts title="src/entities/test/index.ts" showLineNumbers {3}
export { createTest } from "./api/test.api";
export { transformTestDtoToTest } from "./lib/test.transform";
export { testHandlers } from "./api/test.mocks";
export { myTestsQueryOptions, testKeys } from "./api/test.queries";
export type { CreateTestDto, TestDto } from "./api/test.contracts";
export type { Test, TestStatus } from "./model/test";
export { TestCard } from "./ui/test-card";
```

이런식으로 원하는 스타일의 entities 레이어 코드를 작성한 뒤, Claude에게 코드를 분석 시켜 스킬을 만들어 달라고 했다.

### 예시 코드 짜면서, 고민했던 부분: 검사 생성 관련 코드가 entities/features 레이어에 분산된 이유

[상황과 결정]

- 검사 생성 기능은 entities 레이어가 아니라 features 레이어에 구현할 예정이었음
- 그런데, 검사 관련 API를 호출 하는 함수 및 MSW 핸들러 코드는 test 엔티티에 대한 CRUD 코드라 `entities/test`에 모아 두면 좋겠다고 생각했음.
  - 특히 MSW 핸들러 코드를 작성할 때 하나의 리소스에 대한 CRUD 코드를 한 곳에 모아두니까, test 조회도, test 생성도, 모두 `entities/test`에 모아두어야 겠다고 처음에 생각했음
- 그러다보니, 검사 생성 요청 DTO 정의, 검사 생성 API 호출 함수, 검사 생성 API mocking 핸들러가 entities 레이어에 작성되고, 나머지 코드는 features 레이어에 작성하게 되었음.

[회고]

- 선택한 방식도, features는 entities를 의존할 수 있고, entities는 features를 의존할 수 없는 FSD의 규칙을 지키기 때문에 문제가 되지 않는다.
- 단지, 검사 생성과 관련된 코드가 entities, features 두 군데에 혼재되어서 아쉬운 선택이었다.
- entities 레이어에 엔티티 관련 CRUD 코드가 모이지 않더라도, 엔티티에는 조회 API 관련 함수, DTO, mocking만 두고, 나머지는 각각의 features에 정의하면 좀 더 좋았을 거 같음.
