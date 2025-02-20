---
title: "이진 탐색 (Binary Search)"
description: "이진 탐색, lower bound, upper bound 등에 대해 정리"
createdAt: 2025-02-08 19:14:40
tags:
  - algorithm
---

## 이진 탐색

주어진 배열에서 원하는 값을 찾기 위해서 어떻게 해야 할까? 배열의 첫 번째 요소부터 마지막 요소까지 순서대로 순회하면서 원하는 값인지 확인하면 된다. 이렇게 선형 탐색을 수행하면 시간복잡도는 `O(N)`이 된다.

만약 배열이 정렬되어 있다면, **배열의 중앙에 위치한 요소와 찾고자 하는 값을 비교**해 **매번 탐색 범위를 절반으로 줄일 수 있다.** 탐색 범위의 크기가 `N`에서 `1`까지 계속해서 절반으로 줄어들기 때문에 시간복잡도는 `O(lgN)`이다. 이것이 **이진 탐색**이다.

### 이진 탐색 아이디어

찾으려는 target이 `6`이고, 다음과 같은 정렬된 배열 array가 있다고 하자.

|       |     |     |     |     |     |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| index | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   |
| value | 1   | 3   | 3   | 3   | 5   | 5   | 7   | 7   | 9   |

탐색 범위를 표현하기 위해 두 개의 커서 `st`와 `en`이 필요하다. `st`는 탐색 범위의 시작 요소를 가리키고, `en`은 끝 요소를 가리킨다. 탐색 범위를 `[st, en]`으로 표현할 수 있다.

초기에는 탐색 범위가 `[0, 8]`인 상황이다.

탐색 범위의 중앙에 위치한 요소는 `array[4]`이고, `array[4]`의 값 `5`는 target 값 `6`보다 작다. array는 정렬되어 있으므로 `array[4]` 뿐만 아니라 `array[0]`부터 `array[3]`도 target보다 작고, 이들을 한 번에 탐색 범위에서 제거해도 된다. 그래서 `st`를 `5`로 변경해 탐색 범위를 `[5, 8]`로 줄인다. **탐색 범위의 중앙에 위치한 요소와 찾고자 하는 값의 비교 한 번으로 탐색 범위를 절반으로 줄였다.**

이제 탐색 범위가 `[5, 8]`인 상황이다.

탐색 범위의 중앙에 위치한 요소는 `array[6]`이고, `array[6]`의 값 `7`은 target 값 `6`보다 크다. array는 정렬되어 있으므로 `array[6]` 뿐만 아니라 `array[7]`, `array[8]`도 target보다 크고, 이들을 한 번에 탐색 범위에서 제거해도 된다. 그래서 `en`을 `5`로 변경해 탐색 범위를 `[5, 5]`로 줄인다.

이제 탐색 범위가 `[5, 5]`인 상황이다.

탐색 범위의 중앙에 위치한 요소는 `array[5]`이고, `array[5]`의 값 `5`는 target 값 `6`보다 작다. array는 정렬되어 있기 때문에, 인덱스 `5` 이하의 요소들은 모두 target보다 작고 이들을 탐색 범위에서 제거하기 위해 `st`를 `6`으로 변경한다. 탐색 범위가 `[6, 5]`가 되었다.

target인 `6`을 array에서 못 찾았지만, `st`가 `6`, `en`이 `5`가 되어 **더 이상 탐색할 범위가 없으므로 종료**한다.

이 예시는 target이 array에 없는 경우지만, target이 array에 있는 경우에는 탐색 범위의 중앙값이 target과 같을 때 반복을 종료하게 된다.

### 이진 탐색 구현 코드

```js title="binary-search.js"
// array에서 찾은 target의 idx를 반환한다. 없다면 -1을 반환한다.
function binarySearch(array, target) {
  // 탐색 범위를 의미하는 st, en 커서
  // 즉 탐색범위는 array[st], ..., array[en] 이다.
  let st = 0;
  let en = array.length - 1;
  // (찾은) target의 인덱스. -1이면 없다는 의미이다.
  let idx = -1;

  // st와 en이 같아서 탐색 범위의 길이가 1이어도 탐색을 진행한다.
  // st > en이 되어서 탐색 범위가 사라지면 반복문 종료.
  while (st <= en) {
    const md = Math.trunc((st + en) / 2);
    if (array[md] < target) {
      // array[md] < target이므로,
      // (array는 정렬되어 있으니까)
      // array[st], ..., array[md] 값은 모두 target보다 작다.
      // st를 md+1로 업데이트해서,
      // array[st], ..., array[md] 들을 탐색 구간에서 제외한다.
      st = md + 1;
    } else if (array[md] > target) {
      // array[md] > target이므로,
      // (array는 정렬되어 있으니까)
      // array[md], ..., array[en] 값은 모두 target보다 크다.
      // en = md-1로 업데이트해서,
      // array[md], ..., array[en] 들을 탐색 구간에서 제외한다.
      en = md - 1;
    } else {
      // target을 찾은 경우.
      idx = md;
      break;
    }
  }
  return idx;
}
```

## lower bound, upper bound

정렬된 array 배열에 target 값을 삽입할 때,

- 정렬 순서가 깨지지 않는 가장 왼쪽 위치(인덱스)를 lower bound
- 정렬 순서가 깨지지 않는 가장 오른쪽 위치(인덱스)를 upper bound

라고 한다.

|       |     |     |     |     |     |     |       |     |       |     |     |
| ----- | --- | --- | --- | --- | --- | --- | ----- | --- | ----- | --- | --- |
| index | 0   | 1   | 2   | 3   | 4   | 5   | **6** | 7   | **8** | 9   | 10  |
| value | 1   | 3   | 3   | 3   | 4   | 4   | 5     | 5   | 7     | 7   | 9   |

위의 정렬된 배열에 `5`를 삽일 할 때, lower bound는 `6`, upper bound는 `8`이다.

`array[6]`에 `5`를 삽입해도 아래 배열처럼 정렬 순서가 깨지지 않는다. (기존의 `array[6]`, ..., `array[10]` 요소들을 한 칸씩 뒤로 옮기고, `array[6]`에 `5`를 넣어야 한다.)

|       |     |     |     |     |     |     |     |     |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| index | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  |
| value | 1   | 3   | 3   | 3   | 4   | 4   | 5   | 5   | 5   | 7   | 7   | 9   |

만약 `array[5]`에 `5`를 삽입했다면, 정렬 순서가 깨진다. 그래서 `5`는 lower bound가 아니고 `6`은 lower bound이다.

`array[8]`에 `5`를 삽입해도 아래 배열처럼 정렬 순서가 깨지지 않는다.

|       |     |     |     |     |     |     |     |     |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| index | 0   | 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   | 9   | 10  | 11  |
| value | 1   | 3   | 3   | 3   | 4   | 4   | 5   | 5   | 5   | 7   | 7   | 9   |

만약 `array[9]`에 `5`를 삽입했다면, 정렬 순서가 깨진다. 그래서 `9`는 upper bound가 아니고 `8`은 upper bound이다.

### lower bound, upper bound 아이디어

lower bound와 upper bound를 구현할 때도 선형 탐색을 이용할 수 있다. 단지, 시간복잡도가 `O(N)`이 될 뿐이다. 하지만 lower bound와 upper bound를 구해야 하는 상황에서 배열은 이미 정렬된 상태이므로, 이진 탐색의 아이디어를 사용해서 시간복잡도를 `O(lgN)`으로 만들 수 있다.

정렬된 array에서 target의 **lower bound를 찾는 과정**은 **array에서 target 이상의 요소 중 가장 작은 인덱스를 찾는 과정**이다.

길이가 `11`인 정렬된 array에서 `5`(target)의 lower bound를 구하는 과정은 다음과 같다.

|       |     |     |     |     |     |     |       |     |     |     |     |     |
| ----- | --- | --- | --- | --- | --- | --- | ----- | --- | --- | --- | --- | --- |
| index | 0   | 1   | 2   | 3   | 4   | 5   | **6** | 7   | 8   | 9   | 10  | 11  |
| value | 1   | 3   | 3   | 3   | 4   | 4   | 5     | 5   | 7   | 7   | 9   |     |

탐색 범위를 표현하기 위해 시작점을 가리키는 `st`, 끝점을 가리키는 `en` 커서가 필요하다.

초기 탐색 범위는 `[0, 11]`인 상황이다. **마지막 요소 뒤 인덱스도 lower bound가 될 수 있기 때문에** 인덱스 `11`도 범위에 포함한다.

탐색 범위의 중앙에 위치한 `array[5]`의 값 `4`는 target 값 `5`보다 작다. array는 정렬되어 있기 때문에 `array[5]`와 왼쪽에 위치한 요소들은 모두 target보다 작다. target보다 작으면 lower bound가 될 수 없기 때문에 인덱스 `5` 이하를 탐색 범위에서 제거한다. `st`를 `6`으로 변경해 탐색 범위를 `[6, 11]`로 줄인다.

이제 탐색 범위가 `[6, 11]`인 상황이다.

탐색 범위의 중앙에 위치한 `array[8]`의 값 `7`은 target 값 `5`보다 크다. array는 정렬되어 있기 때문에 `array[8]`와 오른쪽에 위치한 요소들은 모두 target 초과이다. target 초과이면서 인덱스가 더 작은 `array[8]`이 있어서, 인덱스가 `9` 이상인 요소들은 lower bound가 될 수 없다. 인덱스 `9` 이상을 탐색 범위에서 제거한다. `en`을 `8`로 변경해 탐색 범위를 `[6, 8]`로 줄인다.

이제 탐색 범위가 `[6, 8]`인 상황이다.

탐색 범위 중앙에 위치한 `array[7]`의 값 `5`는 target 값 `5`와 같다. array는 정렬되어 있기 때문에 `array[7]`과 오른쪽에 위치한 요소들은 모두 target 이상이다. target 이상이면서 인덱스가 더 작은 `array[7]`이 있어서, 인덱스가 `8` 이상인 요소들은 lower bound가 될 수 없다. 인덱스 `8` 이상을 탐색 범위에서 제거한다. `en`을 `7`로 변경해 탐색 범위를 `[6, 7]`로 줄인다.

이제 탐색 범위가 `[6, 7]`인 상황이다.

탐색 범위의 중앙에 위치한 `array[6]`의 값 `5`는 target 값 `5`와 같다. array는 정렬되어 있기 때문에 `array[6]`과 오른쪽에 위치한 요소들은 모두 target 이상이다. target 이상이면서 인덱스가 더 작은 `array[6]`이 있어서, 인덱스가 `7` 이상인 요소들은 lower bound가 될 수 없다. 인덱스 `7` 이상을 탐색 범위에서 제거한다. `en`을 `6`으로 변경해 탐색 범위를 `[6, 6]`으로 줄인다.

이제 탐색 범위가 `[6, 6]`인 상황이다. 이는 인덱스 `6`을 의미하고, 이 값이 정렬된 array에서 `5`의 lower bound가 된다. `array[6]`이 `5` 이상의 값 중 가장 작은 인덱스를 갖는 요소이다.

탐색 범위 `[st, en]`의 크기가 `1`이 될 때까지 중앙값과 target을 비교해 범위를 줄이면 lower bound를 찾을 수 있다.

- **중앙값 \>\= target** 일 때는 중앙값의 오른쪽에 위치한 요소들은 인덱스가 중앙값보다 커서 lower bound가 될 수 없다. 중앙값을 lower bound가 될 수 있는 마지노선으로 간주하고, `[st, en]` -> `[st, md]`로 탐색 범위를 줄인다.
- **중앙값 \< target** 일 때는 중앙값과 왼쪽에 위치한 요소들이 target보다 작아서 lower bound가 될 수 없다. `[st, en]` -> `[md+1, en]`으로 탐색 범위를 줄인다.

정렬된 array에서 target의 **upper bound를 찾는 과정**은 **array에서 target 초과의 요소 중 가장 작은 인덱스를 찾는 과정**이다.

lower bound를 찾는 과정과 비슷하게 탐색 범위 `[st, en]`의 크기가 `1`이 될 때까지 중앙값과 target을 비교해 범위를 줄이면 upper bound를 찾을 수 있다.

- **중앙값 \> target** 일 때는 중앙값의 오른쪽에 위치한 요소들은 인덱스가 중앙값보다 커서 upper bound가 될 수 없다. 중앙값을 upper bound가 될 수 있는 마지노선으로 간주하고, `[st, en]` -> `[st, md]`로 탐색 범위를 줄인다.
- **중앙값 \<\= target** 일 때는 중앙값과 왼쪽에 위치한 요소들이 target 이하라서 upper bound가 될 수 없다. `[st, en]` -> `[md+1, en]`으로 탐색 범위를 줄인다.

### lower bound 구현 코드

```js title="lower-bound.js"
function lowerBound(array, target) {
  // 탐색 범위 [st, en].
  let st = 0;

  // 마지막 요소 뒤 인덱스도 lower bound가 될 수 있는 후보.
  let en = array.length;

  while (st < en) {
    // 탐색 범위의 길이가 1이 될 때까지 반복.
    const md = Math.trunc((st + en) / 2);
    if (array[md] >= target) {
      // array[md]의 오른쪽에 위치한 요소들은
      // (즉, array[md+1], ..., array[en])
      // target 이상이지만,
      // md보다 인덱스가 크기 때문에 lower bound가 될 수 없다.
      // array[md] 오른쪽에 위치한 요소들을 탐색 범위에서 제거한다.
      // [st, en] -> [st, md]
      en = md;
    } else {
      // array[md] < target
      // array[md]와 array[md] 왼쪽에 위치한 요소들은
      // (즉, array[st], ..., array[md-1])
      // target 미만이라서 lower bound가 아니다.
      // array[md]와 array[md] 왼쪽에 위치한 요소들을
      // 탐색 범위에서 제거한다.
      // [st, en] -> [md+1, en]
      st = md + 1;
    }
  }
  return st;
}
```

### upper bound 구현 코드

```js title="upper-bound.js"
function upperBound(array, target) {
  let st = 0;

  // 마지막 요소 뒤 인덱스도 upper bound가 될 수 있는 후보.
  let en = array.length;
  while (st < en) {
    const md = Math.trunc((st + en) / 2);
    if (array[md] > target) {
      // array[md]의 오른쪽에 위치한 요소들은
      // (즉, array[md+1], ..., array[en])
      // target 초과이지만,
      // md보다 인덱스가 크기 때문에 upper bound가 될 수 없다.
      // array[md] 오른쪽에 위치한 요소들을 탐색 범위에서 제거한다.
      // [st, en] -> [st, md]
      en = md;
    } else {
      // array[md] <= target
      // array[md]와 array[md] 왼쪽에 위치한 요소들은
      // (즉, array[st], ..., array[md-1])
      // target 이하라서 upper bound가 아니다.
      // array[md]와 array[md] 왼쪽에 위치한 요소들을
      // 탐색 범위에서 제거한다.
      // [st, en] -> [md+1, en]
      st = md + 1;
    }
  }
  return st;
}
```

### 이진 탐색 구현 코드와 lower bound, upper bound 구현 코드 비교

이진 탐색 구현 코드에서는 탐색 범위의 크기가 `1`일 때도 비교를 수행하지만, lower bound와 upper bound 구현 코드에서는 탐색 범위의 크기가 `1`이 되는 순간 비교를 중단한다.

이진 탐색을 수행할 때 array에 target이 있을 수도 있고, 없을 수도 있다. 그래서 탐색 범위의 크기가 `0`이 될 때까지 비교를 수행해 봐야 한다.

하지만, lower bound와 upper bound에 해당하는 위치는 탐색 범위에 무조건 존재한다. 그래서 탐색 범위의 크기가 `1`이 되는 순간 비교를 중단하고, 그 위치를 lower bound, upper bound라고 판단할 수 있다.

### lower bound, upper bound 활용

lower bound, upper bound를 활용해 **정렬된 배열에서 특정 요소의 개수를 세거나**, lower bound를 이용해 **정렬된 배열에서 등수 계산** 등을 할 수 있다.

## 참고

- [바킹독의 실전 알고리즘 0x13강-이분탐색](https://blog.encrypted.gg/985)
