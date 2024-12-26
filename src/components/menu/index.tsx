"use client";

import useThemeSync from "@/hooks/use-theme-sync";
import DesktopMenu from "./desktop-menu";
import MobileMenu from "./mobile-menu";

export default function Menu() {
  useThemeSync();

  return (
    <>
      <MobileMenu />
      <DesktopMenu />
    </>
  );
}
