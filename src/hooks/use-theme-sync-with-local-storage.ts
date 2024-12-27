import { useEffect } from "react";

function setThemeClass(theme: "light" | "dark") {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

// 다른 탭에 의한 local storage의 변화를 감지하고, 반영한다.
export default function useThemeSyncWithLocalStorage() {
  useEffect(() => {
    const handleChangeLocalStorage = (e: StorageEvent) => {
      const { key, newValue: nextTheme } = e;
      if (!key || !nextTheme) return;
      if (key !== "theme" || (nextTheme !== "light" && nextTheme !== "dark"))
        return;
      setThemeClass(nextTheme);
    };

    window.addEventListener("storage", handleChangeLocalStorage);

    return () => {
      window.removeEventListener("storage", handleChangeLocalStorage);
    };
  }, []);
}
