type Theme = "light" | "dark";

// themeClassInitializationScript는 Root Layout에 스크립트로 주입되어야 하므로, 모듈내부의 다른 함수를 의존할 수 없다.
// 의존하는 코드를 작성하면 의존하는 함수가 없다는 에러를 발생시킴.
// 그래서 모듈 내부의 setThemeClass를 사용할 수 없고, 내부에 _setThemeClass 함수를 별도로 정의해서 사용했음.
export function themeClassInitializationScript() {
  const themeFromLocalStorage = localStorage.getItem("theme");
  if (themeFromLocalStorage === "light" || themeFromLocalStorage === "dark") {
    _setThemeClass(themeFromLocalStorage);
    return;
  }

  const themeFromSystem = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
  _setThemeClass(themeFromSystem);

  function _setThemeClass(newTheme: Theme) {
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}

export function setThemeClass(theme: Theme) {
  switch (theme) {
    case "dark": {
      document.documentElement.classList.add("dark");
      break;
    }
    case "light": {
      document.documentElement.classList.remove("dark");
      break;
    }
    default: {
      const _exhaustivenessCheck: never = theme;
      throw new Error(`유효하지 않은 테마: ${_exhaustivenessCheck}`);
    }
  }
}

export function toggleTheme() {
  document.documentElement.classList.toggle("dark");
  const nextTheme = document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";
  localStorage.setItem("theme", nextTheme);
}
