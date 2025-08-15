---
title: "다익스트라 알고리즘"
description: "다익스트라 알고리즘에 대해 학습한 내용 정리"
createdAt: 2025-07-23 16:07:52
tags:
  - "algorithm"
  - "C++"
---

## 목적

**시작 점으로부터 모든 정점까지 최단 거리를 구하는 그래프 알고리즘**이다.

- 방향 그래프인지, 무 방향 그래프인지 상관없다.
- **간선의 가중치가 음수이면 안 된다.** → 벨만포드 알고리즘을 쓰면 된다.

## 핵심 아이디어

도달할 수 있는 정점 중 **시작 점과 거리가 가장 가까운 정점의 최단 거리를 확정하는 과정을 반복하는 알고리즘**이다. 매번 Greedy 하게 선택하는 알고리즘이다.

## naive 다익스트라 알고리즘 구현

- 정점 V개, 간선 E개, 정점의 번호는 1 ~ V, 시작 정점의 번호는 S
- (크기가 V인) 최단 거리 테이블 `d`를 준비한다. (1차원 배열 `d`)
  - 다익스트라 알고리즘은 `d` 테이블을 채워나가는 과정이다.
- (크기가 V인) 시작점에서 해당 정점까지 최단 거리를 확정했는지 여부를 기록하는 `fixed` 테이블을 준비한다. (1차원 배열 `fixed`)

```
1. d[S]는 0으로 초기화. 나머지 정점 i에 대해 d[i]를 INF(무한대)로 초기화.
2. 모든 정점 i에 대해 fixed[i]도 false로 초기화.
3. d, fixed 테이블을 순회하면서 아직 최단 거리를 확정하지 않은 정점 중
   거리가 INF가 아니면서 가장 작은 정점 i를 찾음.
   3-1. 그런 정점이 없으면 알고리즘 끝냄.
   3-2. 그런 정점 i가 있으면,
        현재 d[i] 값이 시작점으로부터 정점 i까지의 최단 거리라는 의미로,
        fixed[i]를 true로 업데이트.
        정점 i까지의 최단 거리가 확정되었으므로,
        확정된 d[i]를 활용해
        정점 i의 인접한 정점 j에 대해 d[j]를 업데이트.
4. 3의 과정을 반복.
```

- `d` 테이블의 갱신(최단 거리가 될 수도 있는 값으로 업데이트)과 `fixed` 테이블의 갱신(최단 거리 확정)은 다른 시점에 별도로 발생한다.
- 최대 V 번의 최단 거리 확정이 발생한다. 최단 거리를 확정한 정점을 찾기 위해 크기가 V인 `d` 테이블을 탐색해야 하므로 전체적으로 O(V<sup>2</sup>) 소요된다. 그리고 정점의 최단 거리를 확정하고 나서 해당 정점과 연결된 간선들을 탐색하게 되므로, 알고리즘 전반에 걸쳐 E가 추가로 소요된다. 따라서 **시간복잡도는 O(V<sup>2</sup> + E)** 이다.
- “`d` 테이블을 탐색해 아직 최단 거리가 확정되지 않고 `d` 값이 가장 작은 정점 `i`의 최단 거리를 확정 → `i`의 인접 정점 `j`의 `d[j]`값 업데이트”를 반복해 `d` 테이블을 완성하는 것이 핵심 아이디어

```cpp title="naive-dijkstra.cpp"
#include <bits/stdc++.h>
using namespace std;

// INF 값은 문제의 크기에 맞게 결정하면 됨
const int INF = 100;

int main() {
  ios::sync_with_stdio(0);
  cin.tie(0);

  // 정점 수 V
  // 간선 수 E
  int V, E;
  cin >> V >> E;

  // 인접 리스트 g
  // g[u]는 {v, cost}를 요소로 하는 vector
  // v는 u에서 출발해서 도착할 정점, cost는 간선 u -> v의 가중치
  vector<vector<pair<int, int>>> g(V + 5);
  for (int i = 0; i < E; i++) {
    int u, v, cost;
    cin >> u >> v >> cost;
    g[u].push_back({v, cost});
  }

  // 시작 정점
  const int start = 1;

  // 시작점으로부터 각 정점까지의 최단 거리를 기록할 d 테이블
  vector<int> d(V + 5, INF);

  // 시작점으로부터 해당 정점까지의 최단 거리가 확정되었는지 여부를 기록하는
  // fixed 테이블
  vector<bool> fixed(V + 5, false);

  // d[start]만 0으로 초기화.
  // 아직 start의 최단 거리가 0으로 확정하지 않은 상태.
  // 최단 거리 갱신(d 테이블 값 갱신)과 최단 거리 확정(fixed 테이블 값 갱신)은
  // 별도로 처리됨
  d[start] = 0;

  while (true) {
    // d 테이블에서
    // 아직 최단 거리를 확정하지 않은 정점 중
    // 최소값을 갖는 정점 cur를 선택
    int cur = -1;
    for (int i = 1; i <= V; i++) {
      if (fixed[i]) {
        // 이미 최단 거리 확정한 정점이면...
        continue;
      }
      if (cur == -1 || d[i] < d[cur]) {
        // 첫 정점 혹은 더 작은 값을 갖는 정점 i를 발견했을 때, cur 갱신
        cur = i;
      }
    }
    if (cur == -1 || d[cur] == INF) {
      // 더 이상 선택할 수 있는 정점이 없을 때, 알고리즘 중단
      // (모두 선택했거나 또는 선택한 정점의 값이 INF인 경우)
      break;
    }
    // 선택한 cur 정점의 최단 거리 확정
    fixed[cur] = true;
    // cur 정점과 연결된 간선을 확인해
    // cur 정점과 인접한 정점의 최단 거리 갱신
    for (const auto& [u, cost] : g[cur]) {
      if (fixed[u]) {
        continue;
      }
      d[u] = min(d[cur] + cost, d[u]);
    }
  }

  // d 테이블 출력
  for (int i = 1; i <= V; i++) {
    cout << d[i] << ' ';
  }

  return 0;
}
```

## 최소 힙을 활용한 다익스트라 알고리즘 구현

**매번 O(V)에 `d` 테이블을 선형 탐색해서 최단 거리를 확정할 정점을 찾는 대신, 최소 힙에서 정점 정보를 빠르게 꺼내서 그 정점의 최단 거리를 확정할 수 있는지 체크**한다.

이를 위해서 정점 `i`의 최단 거리 테이블값 `d[i]`이 업데이트될 때마다 정점 `i`와 `d[i]` 값을 최소 힙에 넣어 둔다.

```cpp title="dijkstra.cpp" showLineNumbers {83-85}
/**
 * https://www.acmicpc.net/problem/1753
 * 최단경로
 */

#include <bits/stdc++.h>
using namespace std;

// 무한대 값을 의미.
// (정점 수) * (가중치 최댓값)으로 설정.
const int INF = 20000 * 10;

int main() {
  ios::sync_with_stdio(0);
  cin.tie(0);

  // V: 정점 수, E: 간선 수
  int V, E;
  cin >> V >> E;

  // K: 시작점
  int K;
  cin >> K;

  // 인접 리스트 형태의 그래프 g
  // g[i]: {w, j}를 요소로 하는 리스트
  // w: 간선 i -> j의 가중치
  vector<vector<pair<int, int>>> g(V + 5);
  for (int i = 0; i < E; i++) {
    int u, v, w;
    cin >> u >> v >> w;
    g[u].push_back({w, v});
  }

  // 최소 힙을 활용한 다익스트라 알고리즘
  // 매번 O(V)에 d 테이블을 선형 탐색헤서
  // 최단 거리를 확정할 정점을 찾는 방법 대신,
  // 최소 힙에서 정점 정보를 꺼내서,
  // 그 정점의 최단 거리를 확정할 수 있는지 체크한다.
  // 이를 위해서
  // 정점 i의 최단 거리 테이블값 d[i]의 업데이트가
  // 발생할 때마다 { d[i], i } 값을
  // 최소 힙에 넣어둔다.

  // 최단 거리 테이블 d
  vector<int> d(V + 5, INF);

  // {시작점으로부터 정점 i까지 거리, 정점 i} 형태의 pair를
  // 저장하기 위한 최소힙.
  // 거리를 기준으로 작은 값부터 pop 하도록 만들고 싶어서,
  // {거리, 정점} 형태로 저장.
  // STL의 priority_queue는 세 번째로 전달한 정렬 기준을 이용해 정렬한 후,
  // 마지막 끝값부터 pop 한다.
  // 정렬 기준으로 greater<pair<int, int>>을 주었기 때문에
  // pair<int, int>를 내림차순으로 정렬한 후
  // 마지막 끝값부터 pop 하면 크기가 작은 pair<int, int>부터
  // pop 되므로 최소 힙이 된다.
  priority_queue<pair<int, int>, vector<pair<int, int>>,
                 greater<pair<int, int>>>
      minHeap;

  // 최소 힙을 활용한 다익스트라에서도
  // 최단 거리 테이블 갱신과 최단 거리 확정을 따로 발생.

  // 최단 거리 테이블 갱신.
  // d[i]를 갱신하면, {d[i], i}를 최소 힙에 push.
  d[K] = 0;
  minHeap.push({d[K], K});

  // 간선 개수만큼 최소 힙에 정점 정보가 들어갔다가 나오므로
  // O(ElgE)
  while (!minHeap.empty()) {
    // 선형 탐색 없이
    // 최단 거리 확정 지을 정점 정보를
    // 최소 힙에서 pop
    auto [cost, cur] = minHeap.top();
    minHeap.pop();

    // d[cur]값이 cost보다 작을 수 있음.
    // 이 경우, 쓸모없는 정점 정보라서 버림.
    // 시작점에서 cur로 가는 비용이 cost보다 더 작은 경로가 발견되어,
    // d[cur]가 cost보다 더 작은 값으로 업데이트 된 케이스.
    if (cost != d[cur]) {
      continue;
    }

    // 위의 검사를 통과했다면
    // 시작점으로부터 cur까지 최단 거리가 cost(즉, d[cur])로 확정

    // cur까지의 확정된 최단 거리를 활용해,
    // d 테이블 갱신 및 최소 힙에 정점 정보 push
    for (auto [w, nxt] : g[cur]) {
      if (d[cur] + w >= d[nxt]) {
        continue;
      }
      d[nxt] = d[cur] + w;
      minHeap.push({d[nxt], nxt});
    }
  }

  for (int i = 1; i <= V; i++) {
    if (d[i] == INF) {
      cout << "INF" << '\n';
    } else {
      cout << d[i] << '\n';
    }
  }

  return 0;
}
```

[백준 1753 최단경로](https://www.acmicpc.net/problem/1753) 문제의 답안이다.

83 - 85번째 줄에서 **최소 힙에서 꺼낸 정점 `cur`와 `cur`까지의 거리 `cost`가 의미가 있는지 체크**하는 부분의 코드를 조심해야 한다.

- **`cost`와 `d[cur]`의 값이 다르면 이번에 최소 힙에서 꺼낸 `{ cost, cur }` 정보는 의미가 없다.**
- `{ cost, cur }` 정보가 최소 힙에 push 되고 나서, `cur`로 가는 비용이 `cost`보다 더 작은 경로가 발견된 경우이다.
- `{ cost, cur }` 정보가 최소 힙에 push 되고 나서, `cur`로 가는 비용이 `cost_s`로 `cost`보다 더 작은 비용을 갖는 경로가 발견되었다고 하자. 그러면, `d[cur]`는 `cost_s`로 업데이트되고, `{ cost_s, cur }` 정보가 최소 힙에 push 된다. 그리고 이 정보는 `{ cost, cur }` 보다 비용이 적어 최소 힙에서 먼저 pop 된다. (이때 `d[cur]`와 `cost_s`가 같아서 `cur`의 최단 거리를 `cost_s`로 확정하게 된다.)
- 반면, **`cost`와 `d[cur]`의 값이 같다면 `cur`까지의 최단 거리를 `cost`로 확정한다.**
- 최소 힙에서 꺼낸 정보와 `d` 테이블의 정보를 비교해, 특정 정점의 최단 거리가 확정되었는지 판단할 수 있으므로, **별도의 `fixed` 배열을 관리할 필요가 없다.**

간선의 개수만큼 최소 힙에 (거리, 정점) 정보가 들어갔다가 나오므로, 시간복잡도는 **O(ElgE)** 이다.

## 최단 경로 추적

정점 `i`의 최단 경로를 확정하고, 정점 `i`를 거쳐서 `i`의 인접한 정점 `j`로 가는 비용이 기존의 `d[j]`보다 작아서 `d[j]`를 업데이트하는 경우를 생각하자. 어떤 직전 정점으로부터 정점 `j`로 도달할 때 `d[j]`의 값이 업데이트되었는지 기록하면, 시작 점에서 `j`로 오는 최단 경로를 추적할 수 있다.

이를 위해, **어떤 정점에 최단 경로로 도달할 때 직전에 방문해야 할 정점을 기록하는 `pre` 배열**을 두었다. 그리고 정점 `x`에 대해 `d[x]`를 업데이트할 때, `pre[x]`도 함께 업데이트한다.

다익스트라 알고리즘을 수행한 후,

```
정점 x → pre[x] → pre[pre[x]] → … → 시작점
```

처럼 끝점에서 시작 점으로 경로를 추적할 수 있다. 시작 점에서 출발하는 경로가 필요하면 경로를 뒤집으면 된다.

```cpp showLineNumbers {71, 81-87}
/**
 * https://www.acmicpc.net/problem/11779
 * 최소비용 구하기 2
 *
 * 다익스트라 알고리즘에서 경로 추적하기
 */

#include <bits/stdc++.h>
using namespace std;

const int INF = 1e3 * 1e5;

int main() {
  ios::sync_with_stdio(0);
  cin.tie(0);

  // 정점 n개
  // 간선 m개
  int n, m;
  cin >> n >> m;

  // 인접 리스트 형태의 그래프 g
  // g[u]: {w, v}를 요소로 하는 리스트
  // w: 간선 u -> v의 가중치
  vector<vector<pair<int, int>>> g(n + 5);
  for (int i = 0; i < m; i++) {
    int u, v, w;
    cin >> u >> v >> w;
    g[u].push_back({w, v});
  }

  // 시작 정점 st
  // 끝 정점 en
  int st, en;
  cin >> st >> en;

  vector<int> d(n + 5, INF);
  // 최단 경로 추적을 위함
  // pre[i]: 시작점으로부터 i로 최단 거리로 가기 위해, i 직전에 pre[i]를 방문
  // d[i] 값을 업데이트할 때, pre[i]값도 같이 업데이트
  vector<int> pre(n + 5);
  priority_queue<pair<int, int>, vector<pair<int, int>>,
                 greater<pair<int, int>>>
      min_heap;

  d[st] = 0;
  min_heap.push({d[st], st});
  // 시작점의 직전 정점은 없으므로,
  // d[st]는 업데이트하지만, pre[st]는 업데이트 하지 않음.

  while (!min_heap.empty()) {
    auto [cur_cost, cur] = min_heap.top();
    min_heap.pop();

    if (d[cur] != cur_cost) {
      continue;
    }

    for (auto [w, nxt] : g[cur]) {
      if (d[cur] + w >= d[nxt]) {
        continue;
      }
      // 최단 거리가 확정된 정점 cur의 정보로
      // d 테이블 업데이트할 때,
      // 최소 힙에 정점 정보를 넣고,
      // pre 테이블도 업데이트함.
      d[nxt] = d[cur] + w;
      min_heap.push({d[nxt], nxt});
      // d[nxt]가 d[cur]를 활용해 계산되었으므로
      // nxt 직전의 정점을 cur로 기록
      pre[nxt] = cur;
    }
  }

  // st -> en 최단 거리 출력
  cout << d[en] << '\n';

  // pre 배열을 활용해서 st -> en 최단 거리 추적
  // en -> pre[en] -> pre[pre[en]] -> ... -> st
  // 순으로 추적 가능
  vector<int> path;
  int cur = en;
  while (cur != st) {
    path.push_back(cur);
    cur = pre[cur];
  }
  path.push_back(st);
  // en -> st 경로를 뒤집기
  reverse(path.begin(), path.end());
  // 경로 크기 출력
  cout << path.size() << '\n';
  // 경로에 속한 정점 출력
  for (int v : path) cout << v << ' ';
  return 0;
}
```

[백준 11779 최소비용 구하기 2](https://www.acmicpc.net/problem/11779) 문제의 답안이다.

자세히 살펴봐야 할 코드는

- 71번째 줄에서, `d[nxt]`를 업데이트 할 때 `pre[nxt]`도 `cur`로부터 파생되었다고 기록하는 부분
- 81 - 87번째 줄에서, 목적지 정점에서 시작 정점으로 경로를 추적하는 부분

이다.

## 참고

- [바킹독의 실전 알고리즘 0x1D강 - 다익스트라 알고리즘](https://blog.encrypted.gg/1037)
