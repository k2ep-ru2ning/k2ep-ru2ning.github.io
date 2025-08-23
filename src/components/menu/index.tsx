"use client";

import { useThemeSyncWithLocalStorage } from "@/hooks/use-theme-sync-with-local-storage";
import DesktopMenu from "./desktop-menu";
import MobileMenu from "./mobile-menu";

export default function Menu() {
  useThemeSyncWithLocalStorage();

  return (
    <>
      <MobileMenu />
      <DesktopMenu />
    </>
  );
}
