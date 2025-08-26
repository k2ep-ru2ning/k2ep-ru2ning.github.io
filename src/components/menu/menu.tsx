"use client";

import { useEffect } from "react";
import { setThemeClass } from "@/utils/theme";
import { DesktopMenu } from "./desktop-menu";
import { MobileMenuDialog } from "./mobile-menu-dialog";

export function Menu() {
  useEffect(() => {
    // 다른 탭에서 로컬 스토리지 theme을 변경한 경우, 현재 탭에도 반영하기 위함. (즉 탭간 동기화를 위함.)
    const handleChangeLocalStorage = ({ key, newValue }: StorageEvent) => {
      if (key === null || newValue === null) return;
      if (key !== "theme" || (newValue !== "light" && newValue !== "dark"))
        return;
      setThemeClass(newValue);
    };

    // "storage" 이벤트는 다른 탭에 의해서 로컬 스토리지의 값이 변경되었을 때 발생.
    // 직접 로컬 스토리지를 변경한 탭에는 해당 이벤트가 발생하지 않음.
    window.addEventListener("storage", handleChangeLocalStorage);

    return () => {
      window.removeEventListener("storage", handleChangeLocalStorage);
    };
  }, []);

  return (
    <>
      <MobileMenuDialog />
      <DesktopMenu />
    </>
  );
}
