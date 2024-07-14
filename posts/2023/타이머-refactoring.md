---
title: 타이머 refactoring
description: 타이머 컴포넌트 refactoring 회고
createdAt: 2023-05-28
---

## 개요

- 남은 시간을 표시하는 SelectedToDoProgressTimer 컴포넌트 코드의 가독성을 높이고 싶었다.
- 기존 코드에서는, 남은 시간을 매초 줄이기 위해서 useEffect에서 setInterval 함수를 직접 사용했었다.
- setInterval 함수를 직접 사용하는 대신, (setInterval을 내부적으로 사용하는) 추상화된 CountdownTimer class를 만들어 사용하기로 했다.
  - 카운트다운 할 기간을 설정하고(schedule), 카운트다운 타이머를 실행하고(start), 정지하는(stop) 메서드를 가진 클래스를 정의했다.
  - 메서드의 이름으로 타이머가 어떤 일을 수행할지 파악할 수 있게 되었다.

## CountdownTimer 구상 및 구현

### 요구사항

- 타이머의 동작 기간을 정할 수 있다. (schedule)
- 시작, 정지할 수 있다. (start, stop)
- 남은 시간이 1초씩 줄어들 때마다 수행할 로직을 callback 함수로 등록할 수 있다.
- 타이머가 종료되었을 때 수행할 로직을 callback 함수로 등록할 수 있다.

### 구현

- 먼저, 타이머의 동작을 정의했다.

  - timer.schedule(duration): 타이머의 동작 기간을 정한다.
  - timer.start(): 동작 기간이 정해진 타이머를 시작한다.
  - timer.stop(): 타이머를 정지한다.

- 타이머의 상태를 정의했다.

  - `idle`: 타이머가 아무것도 하지 않는 상태. 타이머 생성, 정지, 완료 후 `idle` 상태가 된다.
  - `scheduled`: 동작 기간이 정해진 상태.
  - `running`: 카운트다운을 실행 중인 상태.

- 타이머 상태와 동작을 그림으로 표현하면 다음과 같다.

  ![countdown timer 상태변화 표](https://github.com/keeep-runnning/to-do-player/assets/80243123/095e44cf-04d1-482e-be2c-f2ba5fbb6fd1)

- 구현 코드

  ```ts
  type OnTick = (countInSecond: number) => void;
  type OnFinish = () => void;
  type Status = "idle" | "scheduled" | "running";

  const DELAY_IN_MS = 1000;
  const NOT_SCHEDULED_DURATION = -1;
  const NOT_RUNNING_DEADLINE = -1;

  export default class CountdownTimer {
    // 타이머 동작 기간.
    private scheduledDurationInSecond: number;

    // 타이머가 종료될 시각.
    private deadlineTimestampInMS: number;

    private intervalID?: number;

    // 매초 수행할 callback 함수.
    private onTick?: OnTick;

    // 타이머가 종료될 때 수행할 callback 함수.
    private onFinish?: OnFinish;

    constructor() {
      this.scheduledDurationInSecond = NOT_SCHEDULED_DURATION;
      this.deadlineTimestampInMS = NOT_RUNNING_DEADLINE;
    }

    setOnTick(onTick: OnTick): void {
      if (this.status === "running") {
        throw new Error("CountdownTimer is running now. Can't set onTick.");
      }

      this.onTick = onTick;
    }

    setOnFinish(onFinish: OnFinish): void {
      if (this.status === "running") {
        throw new Error("CountdownTimer is running now. Can't set onFinish.");
      }

      this.onFinish = onFinish;
    }

    // 타이머 동작 기간을 설정하는 메서드.
    schedule(scheduledDurationInSecond: number): void {
      if (this.status === "running") {
        throw new Error("CountdownTimer is running now. Can't schedule.");
      }

      if (
        !Number.isInteger(scheduledDurationInSecond) ||
        scheduledDurationInSecond <= 0
      ) {
        throw new Error("scheduledDurationInSecond must be positive integer.");
      }

      this.scheduledDurationInSecond = scheduledDurationInSecond;
    }

    // 타이머를 시작하는 메서드.
    start(): void {
      if (this.status !== "scheduled") {
        throw new Error("CountdownTimer is not scheduled. Can't start.");
      }

      // 동작 기간을 이용해, 타이머가 종료될 시각을 계산한다.
      this.deadlineTimestampInMS =
        Date.now() + this.scheduledDurationInSecond * 1000;

      // setInterval을 이용해 매초 tick 메서드를 호출하도록 설정한다.
      this.intervalID = window.setInterval(() => {
        this.tick();
      }, DELAY_IN_MS);

      // 시작 직후, tick 메서드를 1번 호출한다.
      this.tick();
    }

    // 타이머를 종료하는 메서드.
    stop(): void {
      window.clearInterval(this.intervalID);
      this.scheduledDurationInSecond = NOT_SCHEDULED_DURATION;
      this.deadlineTimestampInMS = NOT_RUNNING_DEADLINE;
    }

    // 매초 수행할 로직을 담은 메서드.
    private tick(): void {
      if (this.status !== "running") {
        throw new Error("CountdownTimer is not running. Can't tick.");
      }

      // tick 메서드가 호출될 시점의 남은 시간을 계산한다.
      const countInSecond = this.getCountInSecond();

      // 외부에서 설정한 onTick 함수를 호출한다.
      this.onTick?.(countInSecond);

      // 남은 시간이 0, 즉 타이머가 종료되었다면...
      if (countInSecond === 0) {
        this.stop(); // 타이머를 멈추고,
        this.onFinish?.(); // 외부에서 설정한 onFinish 함수를 호출한다.
      }
    }

    // 현재 남은 시각을 초로 반환하는 함수.
    private getCountInSecond(): number {
      if (this.status !== "running") {
        throw new Error(
          "CountdownTimer is not running. Can't calculate current count in second.",
        );
      }

      // 종료 시각에서 현재 시각을 빼서, ms 단위의 남은 시간을 계산한다.
      const countInMS = this.deadlineTimestampInMS - Date.now();

      /* 
        남은 시간이 0ms 이하이면 타이머가 종료되었다는 의미로 0초를 반환한다.
      
        남은 시간이 0ms 초과이면 타이머는 아직 진행 중이다.
        남은 시간이 2120ms, 즉 2.12초이면 3초를 표시하고,
        남은 시간이 1000ms, 즉 1초이면 1초를 표시하고,
        남은 시간이 120ms, 즉 0.12초이면 1초를 표시하고 싶었다.
        그래서 ms 단위의 시간을 1000으로 나누고 올림 해서 반환했다.
      */
      return countInMS <= 0 ? 0 : Math.ceil(countInMS / 1000);
    }

    // 내부 프로퍼티를 이용해, 타이머의 현재 상태를 반환하는 getter.
    private get status(): Status {
      if (
        this.deadlineTimestampInMS === NOT_RUNNING_DEADLINE &&
        this.scheduledDurationInSecond === NOT_SCHEDULED_DURATION
      ) {
        return "idle";
      } else if (
        this.deadlineTimestampInMS === NOT_RUNNING_DEADLINE &&
        this.scheduledDurationInSecond !== NOT_SCHEDULED_DURATION
      ) {
        return "scheduled";
      } else if (
        this.deadlineTimestampInMS !== NOT_RUNNING_DEADLINE &&
        this.scheduledDurationInSecond !== NOT_SCHEDULED_DURATION
      ) {
        return "running";
      } else {
        throw new Error("CountdownTimer status is invalid.");
      }
    }
  }
  ```

## SelectedToDoProgressTimer 컴포넌트에서 CountdownTimer class 사용

React의 state와 외부 객체(시스템) CountdownTimer를 동기화하려면, useEffect를 사용하면 된다.

- 구현 코드

  ```tsx
  import { useEffect, useRef } from "react";
  import { ButtonGroup, IconButton, VStack } from "@chakra-ui/react";
  import { IoPlaySharp, IoRefreshSharp, IoStopSharp } from "react-icons/io5";

  import { type SelectedToDo, useToDosDispatch } from "../../contexts/to-dos";
  import TimerTime from "./timer-time";
  import CountdownTimer from "../../lib/countdown-timer";

  type Props = {
    selectedToDo: SelectedToDo;
  };

  export default function SelectedToDoProgressTimer({ selectedToDo }: Props) {
    const { remainingTimeInSecond, scheduledTimeInSecond, status } =
      selectedToDo;

    const dispatch = useToDosDispatch();

    // CountdownTimer 객체를 참조하기 위해 useRef 사용
    const countdownTimerRef = useRef<CountdownTimer | null>(null);

    /*
      const countdownTimerRef = useRef(new CountdownTimer());
      
      위와 같이 ref를 사용하면, 컴포넌트가 렌더링 될 때마다 새롭게 생성할 필요가 없는데도
      CountdownTimer 객체를 계속 생성한다.
  
      이를 방지하려면, 컴포넌트에 다음과 같은 if문을 추가하면 된다.
  
      if (countdownTimerRef.current === null) {
        countdownTimerRef.current = new CountdownTimer();
      }
  
      하지만, countdownTimerRef.current를 참조할 때마다 null check가 필요하다.
      
      아래의 getCountdownTimer 같은 함수를 만들면,
      불필요한 CountdownTimer 객체가 생성되는 것도 방지할 수 있고,
      반환값의 타입이 CountdownTimer이기 때문에 null check가 필요 없다. 
    */
    const getCountdownTimer = (): CountdownTimer => {
      if (countdownTimerRef.current) {
        return countdownTimerRef.current;
      }

      countdownTimerRef.current = new CountdownTimer();
      return countdownTimerRef.current;
    };

    /*
      첫 rendering의 effect에서 (컴포넌트가 마운트 되면)
      onTick, onFinish 함수를 등록한다.
    */
    useEffect(() => {
      const countdownTimer = getCountdownTimer();

      countdownTimer.setOnTick((countdownInSecond) => {
        dispatch({
          type: "selectedToDoRan",
          payload: {
            newRemainingTimeInSecond: countdownInSecond,
          },
        });
      });

      countdownTimer.setOnFinish(() => {
        dispatch({ type: "selectedToDoFinished" });
      });
    }, [dispatch]);

    // (react state인) status 값과 외부 시스템 CountdownTimer를 동기화한다.
    useEffect(() => {
      // 선택된 to-do의 status가 "ready" 혹은 "finished"라면 동기화할 게 없다.
      if (status === "ready" || status === "finished") return;

      // 선택된 to-do의 status가 "running"이면
      const countdownTimer = getCountdownTimer();

      // countdownTimer를 시작한다.
      countdownTimer.start();

      /* 
        시작했다면, 끝내야 하므로, clean-up 함수로 
        countdownTimer를 멈추는 함수를 등록한다.
      */
      return () => {
        countdownTimer.stop();
      };
    }, [status]);

    // 시작 버튼을 누르면...
    const handleClickStartButton = (): void => {
      if (status !== "ready") return;

      // to-do의 남은 시간만큼 타이머의 동작 기간을 설정하고,
      getCountdownTimer().schedule(remainingTimeInSecond);
      // 선택된 to-do를 시작한다.
      dispatch({ type: "selectedToDoStarted" });
    };

    // 초기화 버튼을 누르면...
    const handleClickResetButton = (): void => {
      if (status !== "ready") return;

      // 선택된 to-do를 초기화한다.
      dispatch({ type: "selectedToDoReset" });
    };

    // 정지 버튼을 누르면...
    const handleClickStopButton = (): void => {
      if (status !== "running") return;

      // 선택된 to-do를 멈춘다.
      dispatch({ type: "selectedToDoStopped" });
    };

    // 다시 시작 버튼을 누르면...
    const handleClickRestartButton = (): void => {
      if (status !== "running") return;

      const countdownTimer = getCountdownTimer();
      // 타이머를 멈추고,
      countdownTimer.stop();
      // 선택된 to-do를 초기화하고,
      dispatch({ type: "selectedToDoReset" });
      // to-do의 계획 시간만큼 타이머의 동작 기간을 설정하고,
      countdownTimer.schedule(scheduledTimeInSecond);
      // 타이머를 시작한다.
      countdownTimer.start();
    };

    return (
      <VStack spacing={4}>
        <TimerTime timeInSecond={remainingTimeInSecond} />
        <ButtonGroup spacing={4}>
          {status === "ready" ? (
            <>
              <IconButton
                rounded="full"
                aria-label="타이머 시작"
                icon={<IoPlaySharp />}
                onClick={handleClickStartButton}
              />
              <IconButton
                rounded="full"
                aria-label="타이머 초기화"
                icon={<IoRefreshSharp />}
                onClick={handleClickResetButton}
              />
            </>
          ) : null}
          {status === "running" ? (
            <>
              <IconButton
                rounded="full"
                aria-label="타이머 정지"
                icon={<IoStopSharp />}
                onClick={handleClickStopButton}
              />
              <IconButton
                rounded="full"
                aria-label="타이머 재시작"
                icon={<IoRefreshSharp />}
                onClick={handleClickRestartButton}
              />
            </>
          ) : null}
        </ButtonGroup>
      </VStack>
    );
  }
  ```

## 개선 전 코드와 비교

### 개선 전 코드 일부

```tsx
const handleClickStartButton = (): void => {
  if (!canStartTimer) return;

  const newDeadlineTimeStampInSecond =
    getNowTimeStampInSecond() + remainingTimeInSecond;
  dispatch({
    type: "selectedToDoStarted",
    payload: { newDeadlineTimeStampInSecond },
  });
};

const handleClickResetButton = (): void => {
  if (!canResetTimer) return;

  const newDeadlineTimeStampInSecond = isRunning
    ? getNowTimeStampInSecond() + resetTimeInSecond
    : null;
  dispatch({
    type: "selectedToDoReset",
    payload: { newDeadlineTimeStampInSecond },
  });
};

useEffect(() => {
  if (!isRunning) return;

  const intervalId = setInterval(() => {
    let newRemainingTimeInSecond =
      deadlineTimeStampInSecond - getNowTimeStampInSecond();
    if (newRemainingTimeInSecond < 0) {
      newRemainingTimeInSecond = 0;
    }
    dispatch({
      type: "selectedToDoRan",
      payload: { newRemainingTimeInSecond },
    });
  }, 1000);

  return () => clearInterval(intervalId);
}, [deadlineTimeStampInSecond, isRunning]);
```

handler, useEffect에 전달되는 함수에 끝날 시각 혹은 남은 시간을 계산하는 로직이 들어있어서 코드의 흐름을 잘 따라가야 어떤 로직을 수행하는지 파악할 수 있다.

### 개선 후 코드 일부

```tsx
const handleClickStartButton = (): void => {
  if (status !== "ready") return;

  getCountdownTimer().schedule(remainingTimeInSecond);
  dispatch({ type: "selectedToDoStarted" });
};

const handleClickResetButton = (): void => {
  if (status !== "ready") return;

  dispatch({ type: "selectedToDoReset" });
};

const handleClickRestartButton = (): void => {
  if (status !== "running") return;

  const countdownTimer = getCountdownTimer();
  countdownTimer.stop();
  dispatch({ type: "selectedToDoReset" });
  countdownTimer.schedule(scheduledTimeInSecond);
  countdownTimer.start();
};

useEffect(() => {
  if (status === "ready" || status === "finished") return;

  const countdownTimer = getCountdownTimer();
  countdownTimer.start();

  return () => {
    countdownTimer.stop();
  };
}, [status]);
```

- 카운트다운을 수행하는 추상적인 CountdownTimer class를 작성해서 사용했다.
- 전체적인 코드 수는 늘어났다.
- 하지만,
  - handler, useEffect에 전달되는 함수에서 CountdownTimer 타입의 객체를 사용하기만 하면 되므로 코드가 간결해졌다.
  - 메서드 이름을 통해 어떤 작업을 하는지 유추할 수 있어서 코드를 읽기 쉬워졌다.
