---
title: "FSD 도입 및 문제 해결 회고"
description: "FSD 도입, FSD 관련 커스텀 스킬 작성, FSD 배럴 파일 관련 문제 해결 과정을 정리한 글"
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

2026년 4~5월, 회사에서 진행하는 신생아 대상 유전자 검사 주문 포털 개발에 참여했다. 나는 주로, 초기 개발환경 설정을 맡아서 진행했다.

초기 개발환경 설정을 하면서 **신경써서 진행했던 부분**은 **FSD의 도입**과 **다국어 처리** 설정이다.

다국어 처리 설정 과정은 [이전 글](/posts/2026/i18n-configuration)에서 다루었다.

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

좀 더 구체적이고, **이번에 진행하는 프로젝트에 맞는 컨벤션과 가이드가 있다면, 개발 초기 단계 부터 Claude가 개발자가 원하는 코드를 생산**해줄 거 같았다. 그래서, 이번 프로젝트에 적용할 커스텀 스킬을 만들기로 결정 했다.

스킬 내용을 직접 다 작성하는 것은 오래 걸릴거 같아, **직접 원하는 스타일의 예시 코드를 작성하고, Claude를 활용해 코드를 분석 시켜 스킬을 추출**했다.

예시 코드는

- TanStack Query, zod, react hook form, msw 등의 기술 스택을 FSD 내에서 어떻게 활용할 것인지
- 쿼리와 entities 레이어를 어떻게 구성할 것인지
- 뮤테이션과 features 레이어를 어떻게 구성할 것인지
- 파일명은 어떻게 할 것인지

고민하면서 작성했다.

스킬을 만들기 위한 코드는 유전자 검사를 조회하고 생성하는 기능을 만든다고 가정하고 작성했다. (예시 코드는 단순히 프로젝트 초기 코드 컨벤션과 구조를 잡기 위한 예시 코드라, 실제 프로덕션 코드가 아니다.)

### entities 레이어, 조회 관련 예시 코드 작성

![entities-layer-structure](/images/posts/2026/fsd-retrospective/entities-layer-structure.webp)

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

- TanStack Query의 **쿼리 옵션을 생성하는 함수**들을 정의했다.
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
- `test.api.ts` 와 가깝게 위치시키는게 좋다고 생각해서, `entities/test`에 위치 시킴 (스포일러: 이 선택이 추후, [문제](/posts/2026/fsd-retrospective#트러블-슈팅-프로덕션-빌드했을-때-msw-코드가-initial-chunk-포함되는-문제-해결)를 발생시킴)

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

마지막으로 배럴(barrel) 파일 형태로 외부에서 사용할 Public API들을 export 했다.

```ts title="src/entities/test/index.ts" showLineNumbers
export { createTest } from "./api/test.api";
export { transformTestDtoToTest } from "./lib/test.transform";
export { testHandlers } from "./api/test.mocks";
export { myTestsQueryOptions, testKeys } from "./api/test.queries";
export type { CreateTestDto, TestDto } from "./api/test.contracts";
export type { Test, TestStatus } from "./model/test";
export { TestCard } from "./ui/test-card";
```

이런식으로 원하는 스타일의 entities 레이어 코드를 작성한 뒤, Claude에게 코드를 분석 시켜 스킬을 만들어 달라고 했다.

```md
---
name: entity-api-flow
description: >
  프로젝트에서 도메인 엔티티의 Read(조회) API 플로우를 구현할 때 사용.
  MSW mock, Zod DTO 스키마, Axios API 호출, DTO→Domain 변환(.lib),
  React Query queryOptions, Suspense UI 소비까지의 레이어링·파일 구조·명명 규칙을
  다룸. 새 엔티티 조회 기능을 추가하거나 기존 도메인을 이 패턴으로 정비할 때 적용.
---

본문 생략...
```

조회 api와 엔티티 관련 작업 시, 앞서 작성한 예제 코드와 비슷한 패턴으로 코드를 생성하기 위한 스킬이 생성되었다. 스킬 본문에는 예제 코드를 짜면서 의도했던 코드 컨벤션이 대체로 잘 작성되어 있었다.

### features 레이어, 생성 관련 예시 코드 작성

![features-layer-structure](/images/posts/2026/fsd-retrospective/features-layer-structure.webp)

- 이제는 features 레이어의 create-test 슬라이스를 위와 같이 구상했다.
- 마찬가지로 슬라이스 안에 코드의 역할을 표현할 수 있는 api, lib, model, ui 같은 세그먼트를 두었다.
- 그리고, 각 파일의 이름을 `{도메인}.{역할}` 형태의 케밥케이스로 작성했다.

여기서도, 각 파일의 내용을 살펴보자.

```ts title="src/features/create-test/model/create-test.schema.ts" showLineNumbers
import * as z from "zod";

export const createTestFormSchema = z.object({
  name: z
    .string()
    .min(1, "이름을 입력해 주세요.")
    .max(50, "50자 이하로 입력해 주세요."),
  code: z
    .string()
    .min(1, "코드를 입력해 주세요.")
    .max(20, "20자 이하로 입력해 주세요."),
});

export type CreateTestFormValues = z.infer<typeof createTestFormSchema>;
```

- 검사 생성 폼의 스키마를 zod로 정의했다.

```ts title="src/features/create-test/lib/create-test.transform.ts" showLineNumbers
import type { CreateTestDto } from "@/entities/test";

import type { CreateTestFormValues } from "../model/create-test.schema";

export function transformCreateTestFormValuesToCreateTestDto(
  values: CreateTestFormValues,
): CreateTestDto {
  return {
    name: values.name,
    code: values.code,
  };
}
```

- 검사 생성 폼 데이터 → 검사 생성 API의 요청 DTO로 변환하는 함수이다.

```ts title="src/features/create-test/api/use-create-test.ts" showLineNumbers {30-32,35-42}
import {
  useMutation,
  useQueryClient,
  type DefaultError,
  type UseMutationOptions,
} from "@tanstack/react-query";

import {
  createTest,
  testKeys,
  transformTestDtoToTest,
  type Test,
} from "@/entities/test";

import { transformCreateTestFormValuesToCreateTestDto } from "../lib/create-test.transform";

import type { CreateTestFormValues } from "../model/create-test.schema";

type UseCreateTestOptions = Pick<
  UseMutationOptions<Test, DefaultError, CreateTestFormValues, unknown>,
  "onMutate" | "onSuccess" | "onError" | "onSettled"
>;

export function useCreateTest(options: UseCreateTestOptions = {}) {
  const { onMutate, onSuccess, onError, onSettled } = options;
  const queryClient = useQueryClient();

  return useMutation<Test, DefaultError, CreateTestFormValues, unknown>({
    mutationFn: async (formValues) => {
      const payload = transformCreateTestFormValuesToCreateTestDto(formValues);
      const { data: testDto } = await createTest(payload);
      return transformTestDtoToTest(testDto);
    },
    onMutate,
    onSuccess: (data, variables, onMutateResult, context) => {
      return Promise.all([
        queryClient.invalidateQueries({
          queryKey: testKeys.list.queryKey,
        }),
        onSuccess?.(data, variables, onMutateResult, context),
      ]);
    },
    onError,
    onSettled,
  });
}
```

- `useMutation`을 감싸는 검사를 생성하는 커스텀 훅이다.
  - 뮤테이션도 쿼리와 비슷하게 `mutationOptions`가 있지만, 굳이 많이 쓸거 같지 않아서 그냥 커스텀 훅 형태로 정의했다.
- 뮤테이션 함수가 API 호출, 폼 데이터 → DTO 변환, DTO → 엔티티 변환을 담당하도록 했다.
- 뮤테이션 성공 시, 연관된 쿼리를 무효화하도록 했고, 다른 콜백들도 받을 수 있도록 커스텀 훅의 파라미터를 정의했다.

```tsx title="src/features/create-test/ui/create-test-form.tsx" showLineNumbers {23,25-31}
import type { ReactNode } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useCreateTest } from "../api/use-create-test";
import {
  createTestFormSchema,
  type CreateTestFormValues,
} from "../model/create-test.schema";

export function CreateTestForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateTestFormValues>({
    resolver: zodResolver(createTestFormSchema),
    defaultValues: { name: "", code: "" },
  });

  const mutation = useCreateTest();

  const onSubmit = handleSubmit((values) => {
    mutation.mutate(values, {
      onSuccess: () => {
        reset();
      },
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <Field label="검사 이름" error={errors.name?.message}>
        <input {...register("name")} disabled={mutation.isPending} />
      </Field>
      <Field label="검사 코드" error={errors.code?.message}>
        <input {...register("code")} disabled={mutation.isPending} />
      </Field>
      {mutation.isError && (
        <p>검사 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.</p>
      )}
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "생성 중…" : "검사 생성"}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label>
      <span>{label}</span>
      {children}
      {error && <span>{error}</span>}
    </label>
  );
}
```

- 뮤테이션 성공 시, 컴포넌트 레벨의 사이드 이펙트(폼 초기화, 토스트 알림 등)는 `useMutation`에 콜백으로 등록하지 않고, `mutation.mutate`를 호출할 때 콜백으로 등록하도록 설정했다.

마지막으로 배럴 파일 형태로 외부에서 사용할 Public API 들을 export 했다.

```ts title="src/features/create-test/index.ts" showLineNumbers
export { useCreateTest } from "./api/use-create-test";
export { CreateTestForm } from "./ui/create-test-form";
```

이런식으로 원하는 스타일의 features 레이어 코드를 작성한 뒤, Claude에게 코드를 분석 시켜 스킬을 만들어 달라고 했다.

```md
---
name: feature-mutation-flow
description: >
  프로젝트에서 도메인 엔티티의 CUD(생성/수정/삭제) mutation 플로우를
  구현할 때 사용. entities 레이어의 DTO contracts·API 함수·MSW 핸들러 확장부터,
  features/{action}-{domain} 슬라이스의 Form 스키마·FormValues→Dto 변환(.lib)·
  useMutation 커스텀 훅·폼 UI, 그리고 invalidateQueries 로 query 캐시를 갱신하기
  까지의 레이어링·파일 구조·명명 규칙을 다룸.
---

본문 생략...
```

뮤테이션과 feature 관련 작업 시, 앞서 작성한 예제 코드와 비슷한 패턴으로 코드를 생성하기 위한 스킬이 생성되었다. 스킬 본문에는 예제 코드를 짜면서 의도했던 코드 컨벤션이 대체로 잘 작성되어 있었다.

### 커스텀 스킬 사용 후기

**프로젝트 초반에 레퍼런스 코드가 없는 상황**에서도 FSD와 zod, react hook form, TanStack Query를 활용한, **원하는 형태의 코드를 Claude를 통해 쉽게 생성**할 수 있었다.

### 예시 코드를 작성하면서 고민했던 부분: 검사 생성 관련 코드가 entities/features 레이어에 분산된 이유

[상황과 결정]

- 검사 생성 기능은 entities 레이어가 아니라 features 레이어에 구현하려고 했었다.
- 그러면서도, "검사 관련 API를 호출 하는 함수" 와 "msw 핸들러 코드"처럼 test 엔티티에 대한 CRUD를 다루는 코드는 `entities/test`, 한 곳에 모아 두면 좋겠다고 생각했다.
  - msw 핸들러 코드를 작성할 때, 보통 하나의 리소스에 대한 CRUD 코드를 한 곳에 모아두니까, test 조회도, test 생성도, 모두 `entities/test`에 모아두어야 겠다고 처음에 생각했던 것 같다.
- 그러다보니, 검사 생성 요청 DTO 정의, 검사 생성 API 호출 함수, 검사 생성 API mocking 핸들러가 entities 레이어에 작성되고, 나머지 코드는 features 레이어에 작성하게 되었다.

[회고]

- 선택한 방식도, FSD의 규칙을 지키기 때문에 문제가 되지 않는다. (FSD의 레이어간 의존 규칙을 위배하지 않아서 문제가 되지 않는다.)
- 단지, 검사 생성과 관련된 코드가 entities, features 두 군데에 혼재되어서 아쉬운 선택이었다.
- 엔티티 관련 CRUD 코드가 한 곳에 모이지 않더라도, entities에는 조회 API 관련 함수, DTO, mocking만 두고, 나머지는 각각의 features에 정의하면 좀 더 좋았을 거 같다.
- 결과적으로, **msw 핸들러를 entities 레이어에 두었던 선택**이, **아래에서 다루는 문제를 야기**했다.

## 트러블 슈팅: 프로덕션 빌드했을 때, msw 코드가 initial chunk에 포함되는 문제 해결

### 상황

번들을 분석하다가, 개발 환경에서만 의미있는 msw 코드가 프로덕션 빌드의 initial chunk(`index.html`에 `modulepreload`로 설정된 chunk)에 포함된 것을 발견했다.

### 분석

먼저 msw 관련 설정을 살펴보자.

```tsx title="src/app/main.tsx" showLineNumbers
import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import "@/shared/i18n";

import { App } from "@/app/app";
import { enableMocking } from "@/app/mocks";

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
```

엔트리 포인트 파일에서 `enableMocking` 함수를 호출한다. `enableMocking` 함수 코드를 살펴보자

```ts title="app/mocks/enable-mocking.ts" showLineNumbers {8}
import { env } from "@/shared/config";

export async function enableMocking() {
  if (!env.VITE_MSW_ENABLED) {
    return;
  }

  const { worker } = await import("./browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}
```

좀 더 따라보면, "./browser" 파일 내에서

```ts title="app/mocks/browser.ts" showLineNumbers {3}
import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

export const worker = setupWorker(...handlers);
```

"./handers"를 임포트하고, "./handlers" 파일에서

```ts title="app/mocks/handlers.ts" showLineNumbers
import { authHandlers } from "@/entities/auth";
// ...
import { testHandlers } from "@/entities/test";

import type { RequestHandler } from "msw";

export const handlers: RequestHandler[] = [
  ...authHandlers,
  // ...
  ...testHandlers,
];
```

entities 레이어에서 msw handler들을 import 하고 있다.

다시, `enableMocking` 함수를 살펴보자.

```ts title="app/mocks/enable-mocking.ts" showLineNumbers {4-6,8}
import { env } from "@/shared/config";

export async function enableMocking() {
  if (!env.VITE_MSW_ENABLED) {
    return;
  }

  const { worker } = await import("./browser");
  return worker.start({ onUnhandledRequest: "bypass" });
}
```

위 코드만 봤을 때, 예상되는 번들링 결과/동작은 다음과 같다.

- 8번째 줄에 **import() 표현식** 이 있으므로, 번들러가 이 지점에서 msw 관련 코드를 별도의 lazy chunk로 분리한다.
  - 즉, msw 관련 lazy chunk는 프로덕션 빌드 결과에도 생성이 된다.
- 하지만, 프로덕션 빌드를 하면, 런타임에 `env.VITE_MSW_ENABLED` 값은 `false`이기 때문에, 실제로 msw 관련 lazy chunk는 브라우저가 다운로드 하지 않는다.

그리고, 나도 위와 같은 방식으로, msw 관련 코드는 모두 lazy chunk에 잘 모이길 원했다.

**하지만, 실제로는 msw 코드가 lazy chunk뿐만 아니라, 초기 다운로드되는 initial chunk에도 포함되어 있었다.**

앞서, entities 레이어의 배럴 파일에서 다음과 같이 msw handler를 export 했다. 그리고 이것이 문제의 원인이었다.

```ts title="src/entities/test/index.ts" showLineNumbers {3}
export { createTest } from "./api/test.api";
export { transformTestDtoToTest } from "./lib/test.transform";
export { testHandlers } from "./api/test.mocks";
export { myTestsQueryOptions, testKeys } from "./api/test.queries";
export type { CreateTestDto, TestDto } from "./api/test.contracts";
export type { Test, TestStatus } from "./model/test";
export { TestCard } from "./ui/test-card";
```

그리고, FSD의 특성상, 이 배럴 파일로부터 import를 많이 하게 된다. (아래 코드처럼 말이다.)

```ts
import {
  createTest,
  testKeys,
  transformTestDtoToTest,
  type Test,
} from "@/entities/test";
```

`app/mocks/handlers.ts` 말고는 testHandlers(msw handler)를 import 하는 곳이 없다. 그런데 **`@/entities/test` 배럴을 import 하는 곳은 많다.** 그리고, **그 배럴을 import 하는 곳에 msw 관련 코드가 딸려 들어간 게 문제**였다.

배럴에서 Test 타입 하나만 가져와도, 배럴이 re-export 하는 핸들러 모듈까지 번들러의 정적 분석 대상에 같이 들어온다. 그리고 핸들러 모듈은 top-level 에서 `http.get()` 을 호출하고 있고, 번들러가 "어떤 사이드 이펙트가 있을지 몰라서, 지워도 된다"고 판단하지 못한다. 사이드 이펙트가 있을지 모르는 코드는 tree-shaking 으로 제거되지 않는다.

그래서 lazy chunk로 분리될 거라고 예상했던 코드들이 사용자가 초기에 다운로드 하는 chunk에도 포함되었던 것이다.

### 해결

이를 해결 하기 위해서는 **msw handler의 위치를 entities 레이어에서 app 레이어로 옮기는 것**이다. 사실 msw handler는 msw 설정 코드에서만 사용되고 있으므로, 다른 msw 코드 처럼 app 레이어로 옮기면 된다. 그리고 **entities 레이어의 배럴 파일에서 msw 핸들러 re-export를 제거**하면 된다.

이렇게 수정하고 빌드했더니 **msw 코드는 프로덕션에서 로드되지 않는 lazy chunk에만 남고, 사용자가 다운로드하는 chunk에서는 모두 빠진 걸** 확인할 수 있었다.

한 줄로 요약하면, **msw 핸들러를 entities 레이어에 둔 탓**에 **FSD 규칙상 배럴로 export 할 수밖에 없었고**, **그 배럴을 import 하는 모든 곳에 msw 관련 코드가 딸려 들어간** 문제였다.
