---
title: "React 개발 환경 직접 설정하기: eslint, prettier"
description: "eslint, prettier, husky, lint-staged 사용 방법 정리"
createdAt: 2022-09-26 17:00:00
tags:
  - "React"
  - "개발 환경 설정"
---

## eslint 역할

코드를 분석해서 문제를 찾아주는 도구이다.

선언한 변수를 사용하지 않은 경우 등 코드 품질이 나빠지는 것을 예방할 수 있게 도와준다.

버그를 예방할 수 있게 도와준다.

코드를 (일관적인 스타일을 유지할 수 있게) 포맷팅 해준다.

## eslint 사용 방법

공식문서를 참고해 설치하고, 설정 파일을 작성한다.

`npx eslint yourfile.js` 형태의 명령어를 입력해 실행하면 된다.

- 콘솔창에 검사 결과가 표시된다.

에디터, IDE가 제공하는 **eslint extension**을 사용하면 매번 명령어를 입력해 실행하지 않아도 된다.

- 에디터가 밑줄로 실시간으로 오류를 표시해준다.
- 마치 정적 언어의 에디터가 프로그래머를 도와주는 것처럼 동작한다.

## eslint 설정

eslint를 사용하기 위해서는 `.eslintrc` 라는 이름의 설정 파일을 작성해야 한다.

- 확장자는 `.js`, `.json`, `.yml` 등 다양하다.

### rule

**코드를 검사할 규칙**

예시

- `no-const-assign` rule: `const` 키워드로 선언된 변수의 값을 변경하는지 검사하는 규칙

명시한 rule을 기반으로 eslint가 코드를 분석한다.

규칙 중 **fixable** 한 규칙들이 있다.

- eslint를 실행할 때 `--fix` option을 주면 fixable한 규칙을 위반한 경우, 알아서 고쳐준다.

### plugin

**rule을 정의한 패키지**

npm을 통해 third-party plugin을 설치하고, plugin에 정의된 rule, config 등을 사용할 수 있다.

예시

- `eslint-plugin-react`: 리액트와 관련된 rule을 정의한 패키지

**설정 파일에 plugin을 추가하는 것은 eslint의 동작에 아무런 영향을 미치지 않는다.**

```json title=".eslintrc.json"
{
  "plugins": ["react", "react-hooks"]
}
```

`eslint-plugin-react`, `eslint-plugin-react-hooks` plugin을 추가했다.

패키지 이름에 `eslint-plugin-` prefix가 붙는다.

plugin을 추가할 때, `eslint-plugin-` prefix는 생략할 수 있다.

**plugin에 의해 정의된 rule, config를 사용해야 eslint가 동작한다.**

```json title=".eslintrc.json"
{
  "plugins": ["react", "react-hooks"],
  "rules": {
    "react/jsx-uses-react": "off",
    "react/react-in-jsx-scope": "off",
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

`"rules"`에 rule을 명시할 때는 **"`eslint-plugin-` prefix를 제외한 plugin 이름/rule 이름"** 형태로 명시한다.

- `"react-hooks/rules-of-hooks"`

  - `eslint-plugin-react-hooks` plugin의 `rules-of-hooks` rule 사용

### plugin에 정의된 config 사용

plugin을 추가하고, plugin에 정의된 rule을 하나씩 추가하는 것은 번거롭다.

그래서 대부분 plugin은 `recommended`, `all` 같은 config(eslint 설정 파일, `shareable config`)를 제공한다.

설정 파일의 `extends`에 `plugin`이 제공하는 `config`를 명시하면 된다.

```json title=".eslintrc.json"
{
  "extends": ["plugin:react/recommended"]
}
```

`eslint-plugin-react`가 제공하는 recommended config, 즉 미리 설정해둔 rule들을 사용한다는 의미이다.

`eslint-plugin-react`가 제공하는 recommended config 내에 `eslint-plugin-react` plugin이 추가되어 있고 rule들이 설정되어 있기 때문에, 별도로 `eslint-plugin-react`를 추가할 필요가 없다. (`"plugins"` 없이 `"extends"`만 써도 된다.)

### config(shareable config)

**이미 정의된 eslint 설정을 가져와서 사용할 수 있다.** (plugin과 rule들이 설정되어 있다.)

`eslint-config-*` 형태의 이름을 가지는 패키지이다.

예시

- `eslint-config-prettier`: **prettier와 충돌하는 eslint rule들**을 비 활성하는 설정을 담은 패키지

`"extends"`를 이용해 이미 정의된 config를 사용할 수 있다.

```json title=".eslintrc.json"
{
  "extends": ["eslint:recommended", "plugin:react/recommended", "prettier"]
}
```

plugin이 제공하는 config는 "plugin:plugin이름/plugin이 제공하는 config이름" 형태로 작성한다.

- `eslint-plugin-react`가 제공하는 recommended config => `"plugin:react/recommended"`

`eslint-config-*` 형태의 config는 `"*"`를 작성한다.

- `eslint-config-prettier` config => `"prettier"`

## prettier 역할

코드 포맷터로서, 일관적인 코드 형태를 유지할 수 있게 도와준다.

- comma 스타일, 코드 한 줄의 최대 길이 등을 일관되게 유지한다.
- 코드의 외적인 형태를 일관적으로 유지한다.

코드 포맷팅 하는 부분에서 eslint와 역할이 겹친다.

보통 eslint로 코드 품질을 검사하고, prettier로 코드 포맷팅을 한다.

## prettier 사용 방법

공식 문서를 참고해 설치하고, 설정 파일을 작성하면 된다.

`npx prettier --write .` 커맨드를 통해 프로젝트 전체를 포매팅할 수 있다.

prettier는 `js`, `jsx` 파일 뿐만 아니라, `html`, `css`, `md` 파일 등에도 사용할 수 있다.

## eslint와 prettier 함께 사용하기

eslint와 prettier를 함께 사용하기 위해서는 eslint에 `eslint-config-prettier`를 추가해야 한다.

- 필요 없거나 prettier와 충돌할 가능성이 있는 eslint rule들을 비활성 시키는 eslint 설정이다.
- `eslint-config-prettier` 패키지의 ReadMe를 참고해 eslint 설정 파일에 설정하면 된다.

## eslint, prettier 사용 자동화 (git hook, husky, lint-staged)

### 상황

eslint와 prettier를 사용함으로써, 코드 품질 검사와 코드 포맷팅을 편리하게 할 수 있다.

하지만 commit 하기 전에 매번 명령어를 입력해 eslint와 prettier를 실행시켜줘야 한다. 번거롭고 잊어버릴 수 있다.

### git hook, husky를 이용해 커밋 직전에 eslint, prettier 사용

git은 어떤 이벤트가 생겼을 때, hook을 이용해 특정 스크립트를 실행할 수 있다.

예를 들면, pre-commit hook은 commit 할 때 가장 먼저 호출된다.
따라서 eslint와 prettier를 사용하는 명령어를 pre-commit hook으로 등록해 사용하면 된다.

이때, hook으로 등록한 작업에 실패하면, commit은 취소된다. pre-commit hook 으로 eslint를 등록한 경우: eslint로 코드를 검사했을 때 문제가 있다면, commit이 취소된다.

husky는 git hook을 편리하게 사용할 수 있도록 도와주는 패키지이다.

### lint-staged: 변경된 파일에만 linter 적용

husky를 통해 commit 직전에 eslint, prettier를 실행시킬 수 있지만, 프로젝트 내부의 모든 파일(변경사항이 없는 파일을 포함해서)에 대해 실행되기 때문에 비효율적이다.

**lint-staged는 변경된 파일들에 대해서만 linter를 적용한다.**

lint-staged를 통해 eslint와 prettier를 실행시키고, lint-staged를 pre-commit hook으로 등록해 사용하면, 변경된 파일에 대해서만 eslint, prettier를 적용할 수 있다.
