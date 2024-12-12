---
title: "form에서 이미지 파일 선택 상태 관리 및 이미지 파일 프리뷰 기능 구현"
description: "프로필 생성/편집 form을 개발하면서 겪었던, 이미지 파일 관련 문제 해결 과정을 정리한 회고"
createdAt: 2023-10-11 20:00:00
tags:
  - "회고"
  - "React"
---

회사에서 첫 업무로 유저 프로필 컴포넌트 개발을 맡았다. 프로필 생성/편집 form을 만들면서, 프로필 이미지 파일을 선택하고 프리뷰를 표시하는 기능을 구현했다. 구현 과정에서 겪었던 문제와 새롭게 알게된 내용을 잊어버리기 전에 정리했다. (회사 코드를 그대로 쓸 수 없어서, 간단한 예시 코드를 준비했다.)

## 만들고 싶은 것

(업무하면서 만든 코드는 기능이 더 복잡하지만) 집중해서 정리하고 싶은 부분이 **프로필 이미지 파일 상태관리**와 **프로필 이미지 프리뷰 기능 구현**이기 때문에, 간단한 **프로필 생성 form**을 만드는 과정으로 간략화했다.

![profile-create-form](/images/posts/2023/image-preview-form/profile-create-form-view.png)

요구사항을 정리하면 다음과 같다.

- 닉네임, 프로필 이미지 필드가 있다.
  - 닉네임 필드는 `string`
  - 프로필 이미지 필드는 사용자가 선택한 이미지 파일 또는 기본 이미지
- 카메라 버튼을 누르면 "기본 이미지", "이미지 변경" 메뉴가 포함된 Dropdown이 열린다.
  - "이미지 변경" 메뉴를 클릭하면 (OS가 제공하는) 파일 선택 창이 열린다.
  - 파일 선택 창에서 파일을 선택하면, 해당 파일을 선택한 상태가 되고 선택한 파일의 프리뷰를 표시한다.
  - 파일 선택 창에서 파일을 선택하지 않고 (닫기 클릭, 취소 버튼, ESC 키 등을 통해)창을 닫으면, 기존 이미지 선택이 취소되고 기본 이미지를 선택한다.
  - "기본 이미지" 메뉴를 클릭하면 기존 이미지 선택이 취소되고 기본 이미지를 선택한다.

## 코드 준비

먼저 UI 구조를 구상하고 스타일링을 진행했다.

`ProfileCreateForm`, `ProfileImagePreview`, `ProfileImageDropdownMenu` 3개의 컴포넌트를 준비했다.

### ProfileCreateForm

프로필 생성 form을 의미하는 컴포넌트이다.

```tsx title="profile-create-form.tsx" showLineNumbers {19, 30-32}
import styled from "@emotion/styled";
import ProfileImagePreview from "./profile-image-preview";
import ProfileImageDropdownMenu from "./profile-image-dropdown-menu";

export default function ProfileCreateForm() {
  return (
    <StyledSection>
      <StyledHeading>프로필 만들기</StyledHeading>
      <StyledForm>
        <StyledRelativeBox>
          <ProfileImagePreview previewSource={null} />
          <StyledAbsoluteBox>
            <ProfileImageDropdownMenu
              onClickDefaultImageButton={() => {}}
              onClickChangeImageButton={() => {}}
            />
          </StyledAbsoluteBox>
        </StyledRelativeBox>
        <StyledFileInput type="file" accept="image/png, image/jpeg" />
        <StyledFormField>
          <StyledLabel htmlFor="nickname">닉네임</StyledLabel>
          <StyledTextInput id="nickname" type="text" />
        </StyledFormField>
        <StyledButton type="submit">만들기</StyledButton>
      </StyledForm>
    </StyledSection>
  );
}

const StyledFileInput = styled.input`
  display: none;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  row-gap: 24px;
`;

const StyledSection = styled.section`
  width: 360px;
  border: 1px solid black;
  border-radius: 8px;
  padding: 16px;
`;

const StyledHeading = styled.h2`
  text-align: center;
`;

const StyledLabel = styled.label``;

const StyledTextInput = styled.input`
  padding: 8px;
  border: 1px solid black;
  border-radius: 8px;
`;

const StyledFormField = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 8px;
`;

const StyledButton = styled.button`
  cursor: pointer;
  border: 1px solid black;
  border-radius: 8px;
  padding: 8px;
  background-color: white;
  :hover {
    background-color: black;
    color: white;
  }
`;

const StyledRelativeBox = styled.div`
  margin: 0 auto;
  position: relative;
`;

const StyledAbsoluteBox = styled.div`
  position: absolute;
  bottom: 4px;
  right: 0px;
`;
```

파일 입력을 다루기 위해 **19번째 줄**에서 file input을 사용했다. 그리고 기본 UI를 사용하지 않을 것이라서 **31번째 줄**에서 `display: none;`으로 설정해 화면에서 가렸다.

### ProfileImagePreview

선택한 파일의 프리뷰를 표시하는 컴포넌트이다.

```tsx title="profile-image-preview.tsx"
import styled from "@emotion/styled";
import defaultImage from "./default-image.svg";

type Props = {
  // previewSource가 null: 기본이미지 표시
  previewSource: string | null;
};

const SIZE = 80;

export default function ProfileImagePreview({ previewSource }: Props) {
  return (
    <StyledImage
      src={previewSource ?? defaultImage}
      width={SIZE}
      height={SIZE}
      alt="profile-image-preview"
    />
  );
}

const StyledImage = styled.img`
  border-radius: 9999px;
`;
```

### ProfileImageDropdownMenu

프로필 이미지 선택 관련 기능(기본 이미지/이미지 변경)을 제공하는 Dropdown 컴포넌트이다. Radix UI를 이용해 구현했다.

```tsx title="profile-image-dropdown-menu.tsx"
import styled from "@emotion/styled";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LuCamera } from "react-icons/lu";

type Props = {
  // "기본 이미지" 버튼 클릭 handler.
  onClickDefaultImageButton: () => void;
  // "이미지 변경" 버튼 클릭 handler.
  onClickChangeImageButton: () => void;
};

export default function ProfileImageDropdownMenu({
  onClickChangeImageButton,
  onClickDefaultImageButton,
}: Props) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <StyledTriggerButton>
          <LuCamera size={16} />
        </StyledTriggerButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <StyledDropdownMenuContent side="right" sideOffset={8} align="center">
          <StyledDropdownMenuItem onSelect={onClickDefaultImageButton}>
            기본 이미지
          </StyledDropdownMenuItem>
          <StyledDropdownMenuItem onSelect={onClickChangeImageButton}>
            이미지 변경
          </StyledDropdownMenuItem>
        </StyledDropdownMenuContent>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

const StyledTriggerButton = styled.button`
  background-color: black;
  color: white;
  border-radius: 9999px;
  padding: 3px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const StyledDropdownMenuContent = styled(DropdownMenu.Content)`
  border: 1px solid black;
  border-radius: 8px;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
`;

const StyledDropdownMenuItem = styled(DropdownMenu.DropdownMenuItem)`
  cursor: pointer;
  padding: 4px 12px;
  :hover {
    background-color: lightgray;
  }
  :focus {
    outline: 0;
  }
`;
```

## "이미지 변경" 메뉴를 클릭했을 때, 파일 선택 창 열기

앞서 `display: none;`으로 file input을 가렸기 때문에, 파일 선택 창을 열 수 있는 방법이 없다. "이미지 변경" 메뉴를 클릭했을 때 파일 선택 창을 열어주는 기능을 만들어야 한다.

```tsx title="profile-create-form.tsx" showLineNumbers {2, 4-7, 18, 25}
export default function ProfileCreateForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClickChangeImageButton = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  return (
    <StyledSection>
      <StyledHeading>프로필 만들기</StyledHeading>
      <StyledForm>
        <StyledRelativeBox>
          <ProfileImagePreview previewSource={null} />
          <StyledAbsoluteBox>
            <ProfileImageDropdownMenu
              onClickDefaultImageButton={() => {}}
              onClickChangeImageButton={handleClickChangeImageButton}
            />
          </StyledAbsoluteBox>
        </StyledRelativeBox>
        <StyledFileInput
          type="file"
          accept="image/png, image/jpeg"
          ref={fileInputRef}
        />
        <StyledFormField>
          <StyledLabel htmlFor="nickname">닉네임</StyledLabel>
          <StyledTextInput id="nickname" type="text" />
        </StyledFormField>
        <StyledButton type="submit">만들기</StyledButton>
      </StyledForm>
    </StyledSection>
  );
}
```

file input에 접근할 수 있도록, ref를 활용했다. 그리고 **6번째 줄**에서 file input element의 click 메서드를 호출해 파일 선택 창을 열었다.

## form 상태 관리

react-hook-form 같은 form 라이브러리를 사용해도 되지만, 지금은 **프로필 이미지 파일 처리에 집중**할 것이므로 간단하게 `useState`를 이용해 form 상태 관리를 할 것이다. (validation도 생략!)

```tsx title="profile-create-form.tsx" showLineNumbers {1, 8-10, 21-31, 33-39, 44, 58}
type ProfileImage = { type: "default" } | { type: "file"; file: File };

export default function ProfileCreateForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nicknameField, setNicknameField] = useState("");

  const [profileImageField, setProfileImageField] = useState<ProfileImage>({
    type: "default",
  });

  const handleClickChangeImageButton = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleChangeNickname: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNicknameField(e.target.value);
  };

  const handleChangeProfileImageFile: ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setProfileImageField({ type: "default" });
    } else {
      setProfileImageField({ type: "file", file: selectedFile });
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    window.alert(
      `[닉네임: ${nicknameField} / 이미지: ${profileImageField.type === "default" ? "기본 이미지" : profileImageField.file.name}] 프로필 생성 완료!`,
    );
  };

  return (
    <StyledSection>
      <StyledHeading>프로필 만들기</StyledHeading>
      <StyledForm onSubmit={handleSubmit}>
        <StyledRelativeBox>
          <ProfileImagePreview previewSource={null} />
          <StyledAbsoluteBox>
            <ProfileImageDropdownMenu
              onClickDefaultImageButton={() => {}}
              onClickChangeImageButton={handleClickChangeImageButton}
            />
          </StyledAbsoluteBox>
        </StyledRelativeBox>
        <StyledFileInput
          type="file"
          accept="image/png, image/jpeg"
          ref={fileInputRef}
          onChange={handleChangeProfileImageFile}
        />
        <StyledFormField>
          <StyledLabel htmlFor="nickname">닉네임</StyledLabel>
          <StyledTextInput
            id="nickname"
            type="text"
            value={nicknameField}
            onChange={handleChangeNickname}
          />
        </StyledFormField>
        <StyledButton type="submit">만들기</StyledButton>
      </StyledForm>
    </StyledSection>
  );
}
```

위의 코드는, form 상태관리를 추가한 `ProfileCreateForm` 컴포넌트 코드이다.

```ts
type ProfileImage = { type: "default" } | { type: "file"; file: File };
```

먼저 **기본 이미지를 선택한 상태**와 **이미지 파일을 선택한 상태**를 표현하기 위해 `ProfileImage` 타입을 정의했다.

```ts
const [profileImageField, setProfileImageField] = useState<ProfileImage>({
  type: "default",
});
```

`useState`로 프로필 이미지 필드 상태를 관리하는 데, 기본 이미지가 선택된 상황을 의미하는 `{ type: "default" }`로 초기화 했다.

```tsx {4}
const handleChangeProfileImageFile: ChangeEventHandler<HTMLInputElement> = (
  e,
) => {
  const selectedFile = e.target.files?.[0];

  if (!selectedFile) {
    // 선택한 파일이 없는 경우: 기본 이미지를 선택한 상태로 업데이트
    setProfileImageField({ type: "default" });
  } else {
    // 파일 선택창에서 파일을 선택한 경우: 선택한 파일을 선택한 상태로 업데이트
    setProfileImageField({ type: "file", file: selectedFile });
  }
};
```

파일 선택 창에서 파일을 변경한 경우, file input에서 change event가 발생한다. 단, **동일한 파일을 선택한 경우 change event가 발생하지 않는다.** (파일 A가 선택된 상황에서 다시 파일 A를 선택한 경우) 또, **파일이 선택된 상태에서 파일을 선택하지 않은 상태가 되어도 change event가 발생한다.** (**파일 선택 창에서 파일 선택을 하지 않고** 닫기/취소 버튼을 누르거나 ESC키를 눌러 **파일 선택 창을 닫으면 파일을 선택하지 않은 상태가 된다.**)

input element의 `files` 속성으로 선택된 파일 목록에 접근할 수 있다. `FileList` 타입이며 순회 가능하다. (지금은 `multiple` 속성을 사용하지 않아서 하나의 파일만 선택할 수있다.)

`e.target.files?.[0]`으로 첫 번째로 선택된 파일에 접근했고, 선택된 파일이 있는 경우와 없는 경우에 따라 form 상태를 업데이트했다.

처음에는 버그있는 코드를 작성하기도 했는데, `handleChangeProfileImageFile` 함수를 다음과 같이 작성했었다.

```ts
const handleChangeProfileImageFile: ChangeEventHandler<HTMLInputElement> = (
  e,
) => {
  const files = e.target.files;

  if (!files) {
    setProfileImageField({ type: "default" });
  } else {
    setProfileImageField({ type: "file", file: files[0] });
  }
};
```

얼핏 보면 맞는 코드 같다.

하지만 이렇게 코드를 짜면, **이미지를 선택한 상태**에서 (파일 선택 창을 다시 열고 아무 파일도 선택하지 않고 창을 닫아서) **이미지를 선택하지 않은 상태**가 되었을 때 `setProfileImageField({ type: "default" })`를 호출하지 않고, `setProfileImageField({ type: "file", file: files[0] })`를 호출하는 문제가 발생한다. (else 문이 실행된다. 코드를 짤 때 의도했던 바는 if 문이 실행되는 것이었다.)

심지어 코드가 실행되면서 else문에서 `files[0]`으로 접근하면 선택한 파일이 없기에 `undefined` 값을 얻어서, 코드 작성 시점에 TypeScript가 추론한 타입(`File`)과 런타임의 타입(`undefined`)이 달라지는 문제도 생긴다.

위 코드를 짤 때 TypeScript의 도움으로 `e.target.files`의 타입이 `FileList | null` 임을 알고 있었다. 그리고 선택된 파일이 없으면 `e.target.files`의 값이 `null` 일 것이라고 생각하고 코드를 작성했다.

하지만 실제로는 선택된 파일이 없으면 `e.target.files`의 값이 `null`이 아니라 length가 0인 `FileList`가 된다. 그래서 선택한 파일이 없는 경우, **변수 `files`의 값**은 `null`이 아니라 length가 0인 `FileList`가 되어 if 문이 아니라 else 문의 코드가 실행되었던 것이다.

그러니까 애초에 선택된 파일이 없으면 `e.target.files`이 `null`이 될 거라는 잘못된 지식 기반으로 코드를 짜서 문제가 발생한 것이다. (MDN을 잘 읽어야 겠다는 생각이 들었다.)

그럼 `e.target.files` 값은 언제 `null`이 될까?
**file input의 경우** **files 속성의 값은 항상 `FileList`이다.** 선택된 파일이 없으면 단지 length가 0인 `FileList`일 뿐 `null`은 아니다.
**file input이 아닌 경우**에 **files 속성 값이 `null`이 된다**고 한다.

```tsx {5}
<StyledFileInput
  type="file"
  accept="image/png, image/jpeg"
  ref={fileInputRef}
  onChange={handleChangeProfileImageFile}
/>
```

그리고 `onChange` prop에 `handleChangeProfileImageFile` 함수를 전달하면 된다.

신기했던 점은 **file input의 경우**, `value`와 `onChange`을 함께 사용해 **controlled 컴포넌트 형태로 사용하지 않는다**는 점이다. file input의 경우, value 속성은 `"C:\fakepath\haaland.jpg"`처럼 file의 경로를 의미하고 실제로 선택된 File 객체를 의미하지 않는다. file input에서 change event가 발생했을 때, 변경된 파일 데이터는 value 속성이 아닌 files 속성에 있으므로 다른 타입의 input과 다르게 다룬다.

```ts
const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
  e.preventDefault();

  window.alert(
    `[닉네임: ${nicknameField} / 이미지: ${profileImageField.type === "default" ? "기본 이미지" : profileImageField.file.name}] 프로필 생성 완료!`,
  );
};
```

마지막으로, 테스트를 위해 form을 제출하면 form 필드의 값을 표시하는 alert 창을 띄우도록 만들었다.

![profile-image-form-field-state-management](/images/posts/2023/image-preview-form/profile-image-form-field-state-management.webp)

아직 프리뷰 기능이 없어서, 파일이 잘 선택되었는지 시각적으로 확인할 수 없지만, **form을 제출했을 때 선택한 이미지 파일의 이름(haaland.jpg)을 잘 표시**하고 있다.

## 이미지 프리뷰

이제 파일을 변경할 때마다, 선택된 파일의 프리뷰를 표시하는 기능을 구현할 것이다.

`URL.createObjectURL(file)`과 `URL.revokeObjectURL(url)`을 사용할 것이다.

`URL.createObjectURL(file)`은 인자로 주어진 **object**(File, Blob 등)**를 가리키는 URL을 생성**하는 정적 메서드이다. 이 메서드로 선택된 파일을 가리키는 URL을 생성해 img 태그로 프리뷰를 표시할 것이다.

`URL.revokeObjectURL(url)`은 **생성한 URL을 해제**하는 역할을 한다. **메모리 누수를 막기 위해** 더 이상 사용하지 않는 URL은 이 메서드를 통해 해제해야 한다.

```tsx title="profile-create-form.tsx" showLineNumbers {1-3, 26-28, 35-36, 53-59}
type ProfileImage =
  | { type: "default" }
  | { type: "file"; file: File; previewURL: string };

export default function ProfileCreateForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nicknameField, setNicknameField] = useState("");

  const [profileImageField, setProfileImageField] = useState<ProfileImage>({
    type: "default",
  });

  const handleClickChangeImageButton = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleChangeNickname: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNicknameField(e.target.value);
  };

  const handleChangeProfileImageFile: ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    if (profileImageField.type === "file") {
      URL.revokeObjectURL(profileImageField.previewURL);
    }

    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setProfileImageField({ type: "default" });
    } else {
      const previewURL = URL.createObjectURL(selectedFile);
      setProfileImageField({ type: "file", file: selectedFile, previewURL });
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    window.alert(
      `[닉네임: ${nicknameField} / 이미지: ${profileImageField.type === "default" ? "기본 이미지" : profileImageField.file.name}] 프로필 생성 완료!`,
    );
  };

  return (
    <StyledSection>
      <StyledHeading>프로필 만들기</StyledHeading>
      <StyledForm onSubmit={handleSubmit}>
        <StyledRelativeBox>
          <ProfileImagePreview
            previewSource={
              profileImageField.type === "file"
                ? profileImageField.previewURL
                : null
            }
          />
          <StyledAbsoluteBox>
            <ProfileImageDropdownMenu
              onClickDefaultImageButton={() => {}}
              onClickChangeImageButton={handleClickChangeImageButton}
            />
          </StyledAbsoluteBox>
        </StyledRelativeBox>
        <StyledFileInput
          type="file"
          accept="image/png, image/jpeg"
          ref={fileInputRef}
          onChange={handleChangeProfileImageFile}
        />
        <StyledFormField>
          <StyledLabel htmlFor="nickname">닉네임</StyledLabel>
          <StyledTextInput
            id="nickname"
            type="text"
            value={nicknameField}
            onChange={handleChangeNickname}
          />
        </StyledFormField>
        <StyledButton type="submit">만들기</StyledButton>
      </StyledForm>
    </StyledSection>
  );
}
```

위의 코드는, 프리뷰 기능을 추가한 `ProfileCreateForm` 컴포넌트 코드이다.

```ts {3}
type ProfileImage =
  | { type: "default" }
  | { type: "file"; file: File; previewURL: string };
```

먼저, 프리뷰 URL을 관리할 수 있도록 `ProfileImage` 타입을 수정했다.

```ts {4-6, 13-14}
const handleChangeProfileImageFile: ChangeEventHandler<HTMLInputElement> = (
  e,
) => {
  if (profileImageField.type === "file") {
    URL.revokeObjectURL(profileImageField.previewURL);
  }

  const selectedFile = e.target.files?.[0];

  if (!selectedFile) {
    setProfileImageField({ type: "default" });
  } else {
    const previewURL = URL.createObjectURL(selectedFile);
    setProfileImageField({ type: "file", file: selectedFile, previewURL });
  }
};
```

사용자가 파일을 선택한 경우 **선택한 파일을 가리키는 URL을 생성해** `profileImageField`를 업데이트 했다. 그리고 **file input에 change event가 발생했을 때, 직전에 파일을 선택한 상태였을 경우, 해당 파일을 가리키는 URL을 해제**했다.

```tsx
<ProfileImagePreview
  previewSource={
    profileImageField.type === "file" ? profileImageField.previewURL : null
  }
/>
```

파일이 선택된 경우 프리뷰를, 아닌 경우는 기본 이미지를 표시하도록 `ProfileImagePreview` 컴포넌트의 `previewSource` prop에 적절한 값을 전달했다.

![profile-image-form-field-preview](/images/posts/2023/image-preview-form/profile-image-form-field-preview.webp)

이제 이미지를 선택했을 때, 프리뷰 이미지가 표시된다.

## "기본 이미지" 메뉴를 클릭했을 때, 기본 이미지 선택 상태로 만들기(+file 상태 초기화)

```tsx title="profile-create-form.tsx" showLineNumbers {23-27, 32, 44-49, 73}
type ProfileImage =
  | { type: "default" }
  | { type: "file"; file: File; previewURL: string };

export default function ProfileCreateForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nicknameField, setNicknameField] = useState("");

  const [profileImageField, setProfileImageField] = useState<ProfileImage>({
    type: "default",
  });

  const handleClickChangeImageButton = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleChangeNickname: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNicknameField(e.target.value);
  };

  const clearPreviewURL = () => {
    if (profileImageField.type === "file") {
      URL.revokeObjectURL(profileImageField.previewURL);
    }
  };

  const handleChangeProfileImageFile: ChangeEventHandler<HTMLInputElement> = (
    e,
  ) => {
    clearPreviewURL();

    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setProfileImageField({ type: "default" });
    } else {
      const previewURL = URL.createObjectURL(selectedFile);
      setProfileImageField({ type: "file", file: selectedFile, previewURL });
    }
  };

  const handleClickDefaultImageButton = () => {
    clearPreviewURL();
    setProfileImageField({ type: "default" });
    if (!fileInputRef.current) return;
    fileInputRef.current.value = "";
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    window.alert(
      `[닉네임: ${nicknameField} / 이미지: ${profileImageField.type === "default" ? "기본 이미지" : profileImageField.file.name}] 프로필 생성 완료!`,
    );
  };

  return (
    <StyledSection>
      <StyledHeading>프로필 만들기</StyledHeading>
      <StyledForm onSubmit={handleSubmit}>
        <StyledRelativeBox>
          <ProfileImagePreview
            previewSource={
              profileImageField.type === "file"
                ? profileImageField.previewURL
                : null
            }
          />
          <StyledAbsoluteBox>
            <ProfileImageDropdownMenu
              onClickDefaultImageButton={handleClickDefaultImageButton}
              onClickChangeImageButton={handleClickChangeImageButton}
            />
          </StyledAbsoluteBox>
        </StyledRelativeBox>
        <StyledFileInput
          type="file"
          accept="image/png, image/jpeg"
          ref={fileInputRef}
          onChange={handleChangeProfileImageFile}
        />
        <StyledFormField>
          <StyledLabel htmlFor="nickname">닉네임</StyledLabel>
          <StyledTextInput
            id="nickname"
            type="text"
            value={nicknameField}
            onChange={handleChangeNickname}
          />
        </StyledFormField>
        <StyledButton type="submit">만들기</StyledButton>
      </StyledForm>
    </StyledSection>
  );
}
```

위의 코드는, 기본 이미지 메뉴 기능을 추가한 최종 `ProfileCreateForm` 컴포넌트 코드이다.

```ts
const clearPreviewURL = () => {
  if (profileImageField.type === "file") {
    URL.revokeObjectURL(profileImageField.previewURL);
  }
};
```

먼저, 반복되는 코드를 줄이기 위해 생성한 URL을 해제하는 코드를 `clearPreviewURL` 함수로 분리했다.

```ts {2,3,5}
const handleClickDefaultImageButton = () => {
  clearPreviewURL();
  setProfileImageField({ type: "default" });
  if (!fileInputRef.current) return;
  fileInputRef.current.value = "";
};
```

"기본 이미지" 메뉴를 클릭했을 때 어떤 작업을 수행해야 할까?

일단 `setProfileImageField({ type: "default" })`로 `profileImageField` 상태를 기본 이미지가 선택된 상태로 만들어야 한다.

그리고, "기본 이미지" 메뉴가 클릭되기 전에 (이미지 파일이 선택되어) 프리뷰 URL이 존재할 수 있으므로 `clearPreviewURL()`도 호출해야 한다.

마지막으로 **꼭 필요한 작업은 file input을 초기화 하는 작업**이다. "기본 이미지" 메뉴를 눌렀다는 것은 기본 이미지를 선택하겠다는 의미도 있지만 아무런 파일이 선택되지 않은 상태로 만들겠다는 의미이고 이를 위해서는 file input 초기화 작업이 꼭 필요하다.

file input을 (초기의) 아무런 파일이 선택되지 않은 상태로 만들기 위해서는 file input element의 `files` 속성에 `null`이나 length가 0인 `FileList` 타입의 객체를 할당하는 것이 아니라 `value` 속성을 `""`(빈 문자열)로 할당해야 한다. (**`files`가 아니라 `value`의 값을 변경했다는 점이 신기했다.**)

만약 "기본 이미지" 메뉴를 클릭했을 때, file input 초기화 작업을 하지 않는다면?

```txt
홀란드 이미지 선택(A) -> 기본 이미지 버튼 클릭(B) -> 홀란드 이미지 선택(C)
```

위의 과정을 시뮬레이션하면, B -> C 과정을 진행할 때 홀란드 이미지가 새롭게 선택되지 않는 문제가 발생한다. (file input에 change event가 발생하지 않는다.)

왜 그럴까? B에서 기본 이미지 버튼을 누를 때 file input을 초기화 하지 않아서, 아직 file input 입장에서는 (A에서 선택한) 홀란드 이미지가 선택된 상황이다. 그래서 C의 과정에서 다시 홀란드 이미지를 선택해도 동일한 홀란드 이미지이기 때문에 change event가 발생하지 않았다. 따라서 file input의 초기화 과정이 꼭 필요하다.

![profile-image-form-field-default-image-button](/images/posts/2023/image-preview-form/profile-image-form-field-default-image-button.webp)

최종 결과물은 위와 같다. "홀란드 이미지 선택 -> 기본 이미지 버튼 클릭 -> 홀란드 이미지 선택 -> 제출" 했을 때, 프리뷰 이미지도 파일 선택 기능도 모두 잘 동작한다.

## 소감

file input을 다루면서 겪었던 문제들을 정리해봤다. 잘못된 지식을 바탕으로 틀린 코드를 작성하기도 했고, 일반적인 input과 다루는 방법이 살짝 달라서 신기하기도 했다.
