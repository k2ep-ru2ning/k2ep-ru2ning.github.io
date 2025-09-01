---
title: "MobX 사용 후기"
description: "MobX 핵심 개념 및 React와 함께 사용하는 방법 정리"
createdAt: 2023-11-18 18:00:00
tags:
  - "React"
  - "MobX"
  - "상태 관리"
seriesId: "업무 회고록"
---

회사 업무를 하면서 상태 관리 도구로 MobX를 사용하게 되었다. MobX의 핵심 개념, React와 함께 사용하는 방법을 정리했다.

## 핵심 개념

MobX는 일관적인 상태 관리를 위해, 애플리케이션 상태로부터 계산할 수 있는 값을 자동으로 생성하는 방식을 사용한다.

state, derivations, reactions, actions 개념으로 MobX의 동작 방식을 설명할 수 있다.

### state

- 말 그대로 애플리케이션의 **상태**이다.
- 비슷한 역할을 하는 상태를 여러 번 정의하지 않도록 잘 설계해야 한다. (**single source of truth**)

### derivations

- **state로부터 계산할 수 있는 모든 값**이다.
- state가 변경되면 **자동**으로 계산된다.
- 예시
  - todos 상태 -> 아직 완료되지 않은 일의 개수 계산 가능
  - todos 상태 -> 할 일 목록을 표현하는 HTML 생성 가능

### reactions

- derivations와 비슷하지만, **값을 생성하지 않고 작업을 수행**한다.
- I/O 같은 작업이 될 수 있다.
  - 상태 변화에 따른 DOM 갱신
  - 상태 변화에 따른 네트워크 요청

### actions

- **state를 변경**하는 모든 것

## MobX를 쓰면 편리한 점 (with 채팅룸 상태 관리 예제 코드)

### MobX를 쓰지 않을 때

채팅룸 데이터를 관리하는 `ChatRoomStore` class를 다음과 같이 작성할 수 있다.

```ts title="chat-room-store.ts"
type ChatRoom = {
  name: string;
};

class ChatRoomStore {
  #chatRooms: ChatRoom[];

  constructor() {
    this.#chatRooms = [];
  }

  get recentlyCreatedChatRoom() {
    return this.#chatRooms.at(-1);
  }

  get report() {
    let message = `개수: ${this.#chatRooms.length}`;
    if (this.recentlyCreatedChatRoom) {
      message += `, 최근 생성: ${this.recentlyCreatedChatRoom.name}`;
    }
    return message;
  }

  createChatRoom(name: string) {
    this.#chatRooms.push({ name });
  }

  renameChatRoom(oldName: string, newName: string) {
    const chatRoom = this.#chatRooms.find((room) => room.name === oldName);
    if (chatRoom) {
      chatRoom.name = newName;
    }
  }
}
```

일반적인 class 코드이다.

- `#chatRooms` private property: 채팅룸들을 배열로 관리
- `recentlyCreatedChatRoom` getter: 최근에 생성된 채팅룸 조회
- `report` getter: 전체 채팅룸의 개수와 최근 생성된 채팅룸 이름을 문자열 형태로 조회
- `createChatRoom` method: 새 채팅룸 생성
- `renameChatRoom` method: 채팅룸 이름 변경

```ts title="chat-room-store-test.ts"
const chatRoomStore = new ChatRoomStore();
console.log(chatRoomStore.report);

chatRoomStore.createChatRoom("React study 룸");
console.log(chatRoomStore.report);

chatRoomStore.createChatRoom("MobX study 룸");
console.log(chatRoomStore.report);

chatRoomStore.createChatRoom("JS study 룸");
console.log(chatRoomStore.report);

chatRoomStore.renameChatRoom("JS study 룸", "Java study 룸");
console.log(chatRoomStore.report);

chatRoomStore.renameChatRoom("React study 룸", "Next.js study 룸");
console.log(chatRoomStore.report);
```

`ChatRoomStore` 타입의 인스턴스를 생성하고, `createChatRoom`과 `renameChatRoom`을 호출해 store 내부의 상태를 바꾸었다. 인스턴스 생성 후와 store 내부의 상태가 변경된 후의 **변경 사항을 알기 위해** `console.log`를 활용해 `report` 값을 출력했다. 실행 결과는 아래와 같다.

![pure-chat-room-store](/images/posts/2023/how-to-use-mobx/pure-chat-room-store-result.webp)

### MobX를 쓸 때

`chat-room-store-test.ts`에서는 `ChatRoomStore`의 변경사항을 확인하기 위해 매번 직접 `console.log`를 호출했다. 하지만, MobX를 활용하면 `console.log`를 직접 호출하는 대신, **store의 변경사항이 있을 때 `console.log`가 자동으로 호출**되게 만들 수 있다.

앞서 언급한 state, derivations, reactions, actions를 생각하면서

store의

- `#chatRooms` -> state로 등록
- `recentlyCreatedChatRoom` -> derivation으로 등록
- `report` -> derivation으로 등록, `report`를 로깅하는 함수를 reaction으로 등록
- `createChatRoom` -> action으로 등록
- `renameChatRoom` -> action으로 등록

하면 된다.

동작 방식은 다음과 같다.

1. `createChatRoom`, `renameChatRoom` action에 의해 `#chatRooms` state가 변경됨
2. `#chatRooms` state 변경에 의해 `recentlyCreatedChatRoom`, `report` derivation이 자동으로 다시 계산됨
3. `#chatRooms` state 변경에 의해 `report` 값이 변경되었다면 `report`를 로깅하는 함수를 reaction으로 등록했기 때문에, 변경된 `report` 값이 출력됨

**MobX를 사용하면, state 변화에 반응하는 Reactive한 코드를 쉽게 작성할 수 있다.**

```ts title="observable-chat-room-store.ts" showLineNumbers {1, 8, 12-19}
import { action, autorun, computed, makeObservable, observable } from "mobx";

type ChatRoom = {
  name: string;
};

class ObservableChatRoomStore {
  private chatRooms: ChatRoom[];

  constructor() {
    this.chatRooms = [];
    makeObservable<ObservableChatRoomStore, "chatRooms">(this, {
      chatRooms: observable,
      recentlyCreatedChatRoom: computed,
      report: computed,
      createChatRoom: action,
      renameChatRoom: action,
    });
    autorun(() => console.log(this.report));
  }

  get recentlyCreatedChatRoom() {
    return this.chatRooms.at(-1);
  }

  get report() {
    let message = `개수: ${this.chatRooms.length}`;
    if (this.recentlyCreatedChatRoom) {
      message += `, 최근 생성: ${this.recentlyCreatedChatRoom.name}`;
    }
    return message;
  }

  createChatRoom(name: string) {
    this.chatRooms.push({ name });
  }

  renameChatRoom(oldName: string, newName: string) {
    const chatRoom = this.chatRooms.find((room) => room.name === oldName);
    if (chatRoom) {
      chatRoom.name = newName;
    }
  }
}
```

MobX를 이용해서 `chatRooms` state 변화에 반응하는 `ObservableChatRoomStore` class를 작성했다.

먼저, `8`번째 줄에서 JavaScript의 private 프로퍼티(`#`) 대신, TypeScript의 private 접근 제어자를 사용하도록 변경했다. MobX의 `make(Auto)Observable` 함수가 `#`을 지원하지 않기 때문이다.

`12` 번째 줄의 `makeObservable` 함수는 property, method, getter 등을 state, derivations, actions으로 등록하는 함수이다. private 프로퍼티의 경우, `makeObservable` 함수가 타입을 찾지 못하기 때문에 직접 제네릭 인자로 `"chatRooms"`라는 프로퍼티 이름을 넘겨주었다. (안 그러면 타입 에러가 발생한다.)

`13` 번째 줄의 `observable`은 `chatRooms`를 state로 등록하겠다는 의미이다.

`14-15` 번째 줄의 `computed`는 `recentlyCreatedChatRoom`, `report`를 derivation으로 등록하겠다는 의미이다.

`16-17` 번째 줄의 `action`은 `createChatRoom`, `renameChatRoom`을 action로 등록하겠다는 의미이다.

`19` 번째 줄의 `autorun`은 인자로 넘긴 콜백함수를 reaction으로 등록하겠다는 의미이다.

```ts title="observable-chat-room-store-test.ts" showLineNumbers
const observableChatRoomStore = new ObservableChatRoomStore();

observableChatRoomStore.createChatRoom("React study 룸");

observableChatRoomStore.createChatRoom("MobX study 룸");

observableChatRoomStore.createChatRoom("JS study 룸");

observableChatRoomStore.renameChatRoom("JS study 룸", "Java study 룸");

observableChatRoomStore.renameChatRoom("React study 룸", "Next.js study 룸");
```

`ObservableChatRoomStore`의 인스턴스를 생성하고, `createChatRoom`, `renameChatRoom`을 호출해 store 상태를 변경했다. 실행 결과는 아래와 같다.

![observable-chat-room-store-result](/images/posts/2023/how-to-use-mobx/observable-chat-room-store-result.webp)

`createChatRoom`, `renameChatRoom` 메서드를 호출하는 코드만 있고, `console.log`를 호출하는 코드는 없다. 하지만, `report`을 로깅하는 함수를 reaction으로 등록해 두었기 때문에, `chatRooms`의 변경에 따라 `report` 값이 변경되면 로그가 찍힌다.

- `1` 번째 줄에 의해 **"개수: 0"** 출력
- `3` 번째 줄에 의해 **"개수: 1, 최근 생성: React study 룸"** 출력
- `5` 번째 줄에 의해 **"개수: 2, 최근 생성: MobX study 룸"** 출력
- `7` 번째 줄에 의해 **"개수: 3, 최근 생성: JS study 룸"** 출력
- `9` 번째 줄에 의해 **"개수: 3, 최근 생성: Java study 룸"** 출력

`11` 번째 줄에 의해 상태가 변했지만, reaction이 수행되지 않아 로그가 찍히지 않았다. "React Study 룸"의 이름이 "Next.js study 룸"으로 바뀌는 상태 변화가 발생했지만, `report`의 값은 "개수: 3, 최근 생성: Java study 룸"으로 바뀌지 않았다. 등록한 reaction에서는 `report` 값만 출력하는 데, `chatRooms` 상태가 바뀌어도 `report` 값은 바뀌지 않아서 reaction이 수행되지 않았다.

또 하나 알아두면 좋은 것은, `chatRooms`라는 배열을 `observable`로 선언했는데, 배열 요소의 프로퍼티 변화도 감지한다는 것이다.

## React와 함께 사용하기 (with 채팅룸 컴포넌트 예제 코드)

`mobx-react-lite` 패키지의 `observer` HoC로, React 컴포넌트를 감싸기만 하면 된다. `observer` 내부적으로 컴포넌트를 렌더링 하는 함수를 `autorun`으로 감싸는데, **컴포넌트에서 사용하는 데이터가 변경되었을 때 다시 렌더링하도록 만들어서,** MobX 상태와 컴포넌트를 동기화한다.

### MobX Store 작성

```ts title="chat-room-store.ts"
import { action, computed, makeObservable, observable } from "mobx";

type ChatRoom = {
  name: string;
};

export default class ChatRoomStore {
  private chatRooms: ChatRoom[];

  constructor() {
    this.chatRooms = [];
    makeObservable<ChatRoomStore, "chatRooms">(this, {
      chatRooms: observable,
      list: computed,
      recentlyCreatedChatRoom: computed,
      report: computed,
      createChatRoom: action,
      renameChatRoom: action,
    });
  }

  get list() {
    return this.chatRooms;
  }

  get recentlyCreatedChatRoom() {
    return this.chatRooms.at(-1);
  }

  get report() {
    let message = `개수: ${this.chatRooms.length}`;
    if (this.recentlyCreatedChatRoom) {
      message += `, 최근 생성: ${this.recentlyCreatedChatRoom.name}`;
    }
    return message;
  }

  createChatRoom(name: string) {
    this.chatRooms.push({ name });
  }

  renameChatRoom(oldName: string, newName: string) {
    const chatRoom = this.chatRooms.find((room) => room.name === oldName);
    if (chatRoom) {
      chatRoom.name = newName;
    }
  }
}
```

(앞서 작성한 store와 비슷하게) 채팅룸 상태 관리를 위한 `ChatRoomStore` class를 작성했다.

### MobX Store를 제공하는 Provider 작성

**Store를 여러 컴포넌트에서 공유하기 위해 Context를 사용한다.** 물론, Store 인스턴스를 전역으로 하나 만들어 두고 export 해서 사용해도 된다. 하지만 Context를 이용해 Store를 컴포넌트에 제공하면 Store의 적용 범위를 제한할 수 있어 더 좋은 것 같다.

```tsx title="chat-room-store-provider.tsx" showLineNumbers {12, 14-21}
import {
  createContext,
  type PropsWithChildren,
  useContext,
  useRef,
} from "react";
import ChatRoomStore from "./chat-room-store";

const ChatRoomStoreContext = createContext<ChatRoomStore | null>(null);

export const ChatRoomStoreProvider = ({ children }: PropsWithChildren) => {
  const storeRef = useRef<ChatRoomStore | null>(null);

  const getStore = () => {
    if (storeRef.current !== null) {
      return storeRef.current;
    }
    const store = new ChatRoomStore();
    storeRef.current = store;
    return store;
  };

  return (
    <ChatRoomStoreContext value={getStore()}>{children}</ChatRoomStoreContext>
  );
};

export const useChatRoomStore = () => {
  const chatRoomStore = useContext(ChatRoomStoreContext);

  if (!chatRoomStore) {
    throw new Error(
      "ChatRoomStoreProvider 내부에서 useChatRoomStore hook을 사용해야 합니다.",
    );
  }

  return chatRoomStore;
};
```

하위 컴포넌트에 `ChatRoomStore` 인스턴스를 제공하는 `ChatRoomStoreProvider`를 작성했다. `ChatRoomStoreProvider`가 리렌더링 되었을 때, `ChatRoomStore` 인스턴스가 새로 생성되는 것을 방지하기 위해 `ref`로 관리했다. (`14` - `21` 번째 줄)

추가로, Context 하위 컴포넌트에서 `ChatRoomStore` 인스턴스에 접근할 수 있도록 `useChatRoomStore` hook도 작성했다.

### MobX Store에 반응하는 채팅룸 컴포넌트 작성

채팅룸 목록 조회, 생성, 이름 변경 등의 기능을 제공하는 `ChatRoom` 컴포넌트를 만들었다.

```tsx title="chat-room.tsx" showLineNumbers {8, 12, 14, 16, 19}
import { ChatRoomStoreProvider } from "./store/chat-room-store-provider";
import ChatRoomCreateButton from "./components/chat-room-create-button";
import ChatRoomList from "./components/chat-room-list";
import ChatRoomReportMessage from "./components/chat-room-report-message";

const ChatRoom = () => {
  return (
    <ChatRoomStoreProvider>
      <section className="p-1 w-80 max-h-80 overflow-y-hidden flex flex-col gap-2">
        <header className="p-0.5 flex justify-between items-center">
          <h2 className="text-lg font-bold">채팅룸 목록</h2>
          <ChatRoomCreateButton />
        </header>
        <ChatRoomReportMessage />
        <div className="grow overflow-y-auto">
          <ChatRoomList />
        </div>
      </section>
    </ChatRoomStoreProvider>
  );
};

export default ChatRoom;
```

`8`, `19` 번째 줄에서 `ChatRoomStoreProvider`를 사용했다. 따라서 자식 컴포넌트인 `ChatRoomCreationButton`, `ChatRoomReportMessage`, `ChatRoomList` 컴포넌트에서 Context를 통해 `ChatRoomStore` 인스턴스에 접근할 수 있다.

```tsx title="chat-room-create-button.tsx" showLineNumbers {4, 5, 10}
import { observer } from "mobx-react-lite";
import { useChatRoomStore } from "../store/chat-room-store-provider";

const ChatRoomCreateButton = observer(() => {
  const chatRoomStore = useChatRoomStore();

  const handleClickButton = () => {
    const chatRoomName = window.prompt("채팅룸 이름을 입력하세요.");
    if (!chatRoomName) return;
    chatRoomStore.createChatRoom(chatRoomName);
  };

  return (
    <button
      type="button"
      onClick={handleClickButton}
      className="border border-gray-400 rounded-md p-0.5 cursor-pointer"
    >
      채팅룸 생성
    </button>
  );
});

export default ChatRoomCreateButton;
```

`ChatRoomCreateButton` 컴포넌트의 `4` 번째 줄에서 **MobX Store와 동기화되는 컴포넌트로 만들기 위해 `observer` HoC로 감쌌다.**

`5`번째 줄에서 `ChatRoomStore` 인스턴스에 접근하기 위해 `useChatRoomStore` hook을 사용했다.

(`10`번째 줄의) 채팅룸 생성 버튼 click 이벤트 핸들러 내부에서 **`createChatRoom` action을 통해 새로운 채팅룸을 추가했다. (store의 상태를 변경했다.)**

```tsx title="chat-room-report-message.tsx" showLineNumbers {4, 5, 7}
import { observer } from "mobx-react-lite";
import { useChatRoomStore } from "../store/chat-room-store-provider";

const ChatRoomReportMessage = observer(() => {
  const chatRoomStore = useChatRoomStore();

  return <p>{chatRoomStore.report}</p>;
});

export default ChatRoomReportMessage;
```

전체 채팅룸 개수와 최근 생성된 채팅룸 이름을 표시하는 `ChatRoomReportMessage` 컴포넌트에서는 `chatRoomStore.report` 값을 표시하고 있다.

`4` 번째 줄에서 **`observer` HoC로 감쌌기 때문에, store에 변경 사항이 생겨서 직접적으로 참조하는 `chatRoomStore.report` 데이터가 변경되면 다시 렌더링 된다.**

```tsx title="chat-room-list.tsx" showLineNumbers {4, 5, 10, 15, 17, 20}
import { observer } from "mobx-react-lite";
import { useChatRoomStore } from "../store/chat-room-store-provider";

const ChatRoomList = observer(() => {
  const chatRoomStore = useChatRoomStore();

  const handleClickRenameButton = (oldName: string) => () => {
    const newName = window.prompt("채팅룸의 새 이름을 입력하세요.");
    if (!newName) return;
    chatRoomStore.renameChatRoom(oldName, newName);
  };

  return (
    <ul className="flex flex-col gap-1">
      {chatRoomStore.list.map((chatRoom) => (
        <li
          key={chatRoom.name}
          className="flex justify-between items-center p-0.5 border border-gray-500 rounded-md"
        >
          {chatRoom.name}
          <button
            type="button"
            onClick={handleClickRenameButton(chatRoom.name)}
            className="border border-gray-400 rounded-md p-0.5 cursor-pointer"
          >
            이름 수정
          </button>
        </li>
      ))}
    </ul>
  );
});

export default ChatRoomList;
```

`ChatRoomList` 컴포넌트에서는 전체 채팅룸 목록을 표시한다. 또, 각 채팅룸의 "이름 수정" 버튼을 통해 이름을 변경할 수 있다.

(`10`번째 줄의) 이름 수정 버튼 click 이벤트 핸들러 내부에서 **`renameChatRoom` action을 통해 채팅룸 이름을 변경했다.** (store의 상태를 변경했다.)

`15`번째 줄에서 `chatRoomStore.list`를 통해 채팅룸 배열을 조회했고, `20` 번째 줄에서는 채팅룸의 이름을 참조했다.

`4` 번째 줄에서 **`observer` HoC로 감쌌기 때문에, store에 변경 사항이 생겨서 `chatRoomStore.list` 같은 참조하는 데이터가 변경되면 다시 렌더링 된다.**

구현 결과는 아래와 같다.

![mobx-chat-room-component](/images/posts/2023/how-to-use-mobx/mobx-chat-room-component.webp)

새 채팅룸을 추가하거나 기존 채팅룸의 이름을 변경하면 **MobX store가 업데이트되고, React 컴포넌트는 MobX store의 변화에 적절하게 반응하면서 리렌더링** 되었다.

## 정리

MobX를 사용해 상태 관리를 편하게 할 수 있다.

- action을 통해 state를 변경
- state가 변경되면 자동으로 derivation 다시 계산
- state, derivation 같은 reaction이 의존하는 데이터가 변경되면 reaction이 다시 수행

위와 같은 동작 방식을 통해, **state의 변화에 반응하는 Reactive한 코드를 쉽게 작성할 수 있다.**

React와 함께 사용하기 위해서 `mobx-react-lite` 패키지의 `observer` HoC로 React 컴포넌트를 감싸면 된다. **`observer`로 래핑된 React 컴포넌트**가 **의존하는 MobX store의 데이터가 변경되면**, **자동으로 React 컴포넌트가 다시 렌더링** 된다. 즉, MobX Store와 React 컴포넌트가 동기화된다.

## 다른 상태 관리 도구와 차별점이라고 생각하는 부분

`useState`, `useReducer` 같은 상태 관련 hook이나 다른 상태 관리 도구를 사용할 때는 상태를 변경할 때 불변성을 지켜야 했다. 객체를 복사해서 새로운 객체를 만들고 나서 변경해야 했다.

MobX를 사용하면 불변성을 지킬 필요가 없기 때문에 객체를 복사하는 수고로움을 덜 수 있고, mutable한 메서드를 사용하거나 프로퍼티를 직접 수정해도 된다. 개인적으로 편리했던 부분이라고 생각한다.

다른 상태 관리 도구를 쓸 땐 class를 거의 사용하지 못했는데, MobX를 쓸 때는 class도 자유롭게 쓸 수 있어서 좀 더 객체 지향적인 코드를 작성할 수도 있다.

## 참고

- [MobX 공식문서](https://mobx.js.org)
- [Ten minute introduction to MobX and React](https://mobx.js.org/getting-started)
