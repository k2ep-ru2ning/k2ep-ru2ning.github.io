"use client";

import { useEffect } from "react";
import { setThemeClass } from "@/utils/theme";
import DesktopMenu from "./desktop-menu";
import MobileMenu from "./mobile-menu";

export default function Menu() {
  useEffect(() => {
    const handleChangeLocalStorage = ({ key, newValue }: StorageEvent) => {
      if (key === null || newValue === null) return;
      if (key !== "theme" || (newValue !== "light" && newValue !== "dark"))
        return;
      setThemeClass(newValue);
    };

    window.addEventListener("storage", handleChangeLocalStorage);

    return () => {
      window.removeEventListener("storage", handleChangeLocalStorage);
    };
  }, []);

  return (
    <>
      <MobileMenu />
      <DesktopMenu />
    </>
  );
}
