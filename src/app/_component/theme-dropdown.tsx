"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeDropdown() {
  const [isMounted, setIsMounted] = useState(false);

  const { theme, setTheme } = useTheme();

  // 컴포넌트가 mount 되기전에,
  // theme 상태값을 사용하면 데이터 불일치 문제가 발생.

  // 서버에서는 theme 값을 제대로 알 수 없다.
  // => 즉, 서버가 전송한 html을 확인하면,
  // local storage에 있는 값이 아닌 디폴트값이
  // 선택되어 html이 생성된 것을 확인할 수 있다.
  // => 그래서 next-themes 공식문서에서,
  // 컴포넌트가 마운트 된 후,
  // 제대로 된 state 값을 사용해 UI를 Render 하라고 되어 있다.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      <option value="system">{"system"}</option>
      <option value="light">{"light"}</option>
      <option value="dark">{"dark"}</option>
    </select>
  );
}
