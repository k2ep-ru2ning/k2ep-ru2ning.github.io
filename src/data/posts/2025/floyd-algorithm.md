---
title: "플로이드 알고리즘"
description: "플로이드 알고리즘에 대해 학습한 내용 정리"
createdAt: 2025-07-17 14:51:41
tags:
  - "algorithm"
  - "C++"
---

## 목적

그래프에서 **모든 정점 쌍 사이의 최단 거리를 구하는 알고리즘**

- 방향 그래프인지, 무방향 그래프인지 상관없음
- 간선의 가중치가 음수여도 됨
- 음수 사이클은 있으면 안 됨

그래프의 정점 개수가 V개일 때 **O(V<sup>3</sup>)** 시간 복잡도

## 아이디어

정점 `i`에서 정점 `j`로 가는 최단 거리를 기록하기 위한 2차원 배열 `dist`를 준비한다.

`dist` 배열을 초기화한다.

- 간선 `a` → `b`의 비용이 `cost`일 때, `dist[a][b]`를 `cost`로 초기화
  (`a` → `b`로 가는 간선이 여러 개이면 그 중 최소 비용으로 `dist[a][b]`를 업데이트)
- `dist[i][i]`는 `0`으로 초기화, 그 외의 값은 `INF`(무한대)로 초기화

**`dist` 배열의 상태를 점진적으로 업데이트**한다.
**중간에 거쳐 갈 정점 `k` 개를 고려해 `dist`를 채워둔 상황에서, 추가로 중간에 정점 `k+1`을 거쳐 갈 수 있다고 고려해 `dist`를 업데이트하는 것**이 핵심 아이디어이다.

```
중간에 아무 정점을 거치지 않고, 정점 i에서 j로 가는 최단 거리를 기록하는 dist
↓
중간에 아무 정점을 거치지 않거나 정점 1을 거쳐서, 정점 i에서 j로 가는 최단 거리를 기록하는 dist
↓
중간에 아무 정점을 거치지 않거나 정점 1 또는 정점 2를 거쳐서, 정점 i에서 j로 가는 최단 거리를 기록하는 dist
↓
...
↓
중간에 아무 정점을 거치지 않거나 정점 1 또는 정점 2 또는 ... 또는 정점 V를 거쳐서, 정점 i에서 j로 가는 최단 거리를 기록하는 dist
```

## 예시 코드

```c++ showLineNumbers {18, 41-50, 53-63}
/**
 * https://www.acmicpc.net/problem/11404
 * 플로이드
 */

#include <bits/stdc++.h>
using namespace std;

// 정점 a에서 정점 b로 가는 경로가 없을 때, 비용을 INF로 표현
// INF 값은 대략 (정점 수 * 가중치의 최대값)으로 정하면 됨
// 경로에 같은 정점이 여러 번 등장하면 사이클이 있다는 의미고
// 이런 경로는 최단 경로가 아님
// 최단 경로에는 최악의 경우 모든 정점이 한 번씩 등장하고,
// 최단 경로의 간선 수는 (정점 수 - 1)
// ((정점 수 - 1) * 가중치의 최대값) 보다 크게 INF를 설정하면 됨
// 플로이드 알고리즘에서 INF끼리 더할 수 있으므로
// 오버플로우를 조심해야 함
const int INF = 1e7;

int main() {
  ios::sync_with_stdio(0);
  cin.tie(0);

  // n: 정점 수
  // m: 간선 수
  int n, m;
  cin >> n >> m;

  // 플로이드를 사용한다면
  // dist 배열만 잘 관리하면 되므로
  // 그래프를 굳이 인접 리스트 형태로 관리할 필요가 없음

  // dist[i][j]: 정점 i에서 정점 j로 가는 최단 경로
  // dist 배열 초기화 과정
  // - (간선 정보를 활용해서)
  //   정점 a -> 정점 b로 가는 간선이 있다면
  //   가장 적은 비용의 간선을 선택하고,
  //   그 비용으로 dist[a][b]를 설정
  // - dist[i][i]는 0으로 설정
  // - 그외의 dist[i][j]는 INF로 설정
  vector<vector<int>> dist(n + 5, vector<int>(n + 5, INF));
  for (int i = 0; i < m; i++) {
    int a, b, c;  // 간선 a -> b의 비용 c
    cin >> a >> b >> c;
    // dist[a][b] = c;
    dist[a][b] = min(dist[a][b], c);  // a -> b 간선이 여러 개일 수 있음
  }
  for (int i = 1; i <= n; i++) {
    dist[i][i] = 0;
  }

  // 플로이드. O(n^3)
  for (int k = 1; k <= n; k++) {  // 새롭게 고려할, 중간에 거쳐 갈 수 있는 정점 k
    for (int i = 1; i <= n; i++) {    // 시작 정점 i
      for (int j = 1; j <= n; j++) {  // 도착 정점 j
        // 기존의 i -> j로 가는 최소 비용 dist[i][j]와
        // 중간에 정점 k를 거쳐서 가는 최소 비용 dist[i][k] + dist[k][j]를
        // 비교해서 더 작은 값을 선택
        // min 함수에 의해 dist[i][j] 값은 항상 INF 이하로 유지됨
        dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);
      }
    }
  }

  for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= n; j++) {
      int cost = dist[i][j] == INF ? 0 : dist[i][j];
      cout << cost << ' ';
    }
    cout << '\n';
  }

  return 0;
}
```

[백준 11404 플로이드](https://www.acmicpc.net/problem/11404) 문제의 답안이다.

주의해야 할 코드는

- 18번째 줄의 INF 상수를 정하는 부분
- 41 - 50번째 줄에서 dist 배열을 초기화하는 부분
- 53 - 63번째 줄에서 3중 for 문으로 플로이드를 구현한 부분

이다.

## 경로 구하기

추가로, 2차원 배열 `nxt`를 활용한다.

- `nxt[i][j]`: 정점 `i`에서 `j`로 가는 최단 경로가 있을 때, **정점 `i`(출발점) 다음으로 방문해야 할 정점을 기록**
- 정점 `i`에서 `j`로 가는 최단 경로가 있다면, `i` → `nxt[i][j]` → `nxt[nxt[i][j]][j]` → ... → `j` 이런 식으로 경로를 구할 수 있다.

```cpp showLineNumbers {22, 26-31, 40-46, 63-76}
/**
 * https://www.acmicpc.net/problem/11780
 * 플로이드 2
 */

#include <bits/stdc++.h>
using namespace std;

const int INF = 1e7;

int main() {
  ios::sync_with_stdio(0);
  cin.tie(0);

  int n, m;
  cin >> n >> m;

  vector<vector<int>> dist(n + 5, vector<int>(n + 5, INF));
  // nxt[i][j]
  // 정점 i에서 정점 j로 최단 거리로 이동하기 위해
  // i 다음으로 가야 할 첫 번째 정점을 기록하는 배열
  vector<vector<int>> nxt(n + 5, vector<int>(n + 5));
  for (int i = 0; i < m; i++) {
    int a, b, c;
    cin >> a >> b >> c;
    if (c < dist[a][b]) {
      dist[a][b] = c;
      // dist[a][b]를 c로 업데이트할 때,
      // a 다음에 가야 할 위치를 b로 설정
      nxt[a][b] = b;
    }
  }
  for (int i = 1; i <= n; i++) {
    dist[i][i] = 0;
  }

  for (int k = 1; k <= n; k++) {
    for (int i = 1; i <= n; i++) {
      for (int j = 1; j <= n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
          // k를 거쳐서 가는 게 더 빠른 경우, nxt[i][j]도 업데이트 필요.
          // i에서 k로 가기 위해 다음으로 가야 할 정점 nxt[i][k]로
          // nxt[i][j]를 업데이트.
          nxt[i][j] = nxt[i][k];
        }
      }
    }
  }

  for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= n; j++) {
      int cost = dist[i][j] == INF ? 0 : dist[i][j];
      cout << cost << ' ';
    }
    cout << '\n';
  }

  for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= n; j++) {
      if (dist[i][j] == 0 || dist[i][j] == INF) {
        cout << 0 << '\n';
      } else {
        // i -> j 최단 경로가 존재하고, 길이가 1 이상인 경우.
        // nxt 배열을 활용해 경로를 출력
        int cur = i;
        vector<int> path{cur};  // 시작점을 경로에 추가
        while (cur != j) {      // cur가 목적지가 아니라면...
          cur = nxt[cur][j];    // 최단 경로 안에서 다음 정점으로 이동 후
          path.push_back(cur);  // 경로에 추가
        }
        cout << path.size() << ' ';  // 경로 길이 출력
        // 경로 출력
        for (const int v : path) cout << v << ' ';
        cout << '\n';
      }
    }
  }

  return 0;
}

```

[백준 11780 플로이드 2](https://www.acmicpc.net/problem/11780) 문제의 답안이다.

주의해야 할 코드는

- 22번째 줄의 `nxt` 배열 선언
- 26 - 31번째 줄에서 `dist[a][b]` 값을 초기화할 때, `nxt[a][b]` 값도 초기화하는 부분
- 40 - 46번째 줄에서 `k`를 거쳐서 `i` → `j`로 가는 게 비용이 더 적은 경우, `nxt[i][j]`를 `nxt[i][k]`로 업데이트하는 코드
- 63 - 76번째 줄에서 최단 경로가 존재하고 길이가 1 이상인 경우, `nxt` 배열을 이용해 `i`에서 `j`까지의 경로를 추적하는 코드

이다.

## 참고

- [바킹독의 실전 알고리즘 0x1C강 - 플로이드 알고리즘](https://blog.encrypted.gg/1035)
