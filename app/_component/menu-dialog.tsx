"use client";

import * as Dialog from "@radix-ui/react-dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import Link from "next/link";
import { LuAlignJustify, LuX } from "react-icons/lu";
import HorizontalSeparator from "./separator/horizontal-separator";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function MenuDialog() {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className=" hover:bg-zinc-200 dark:hover:bg-zinc-700 size-8 flex justify-center items-center rounded-md">
          <LuAlignJustify className="size-6" />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content className="bg-zinc-50 dark:bg-zinc-950 fixed inset-0 focus:outline-none flex flex-col">
          <header className="flex items-center justify-between p-4">
            <Dialog.Title className="p-2 font-extrabold text-xl">
              k2ep-ru2ning
            </Dialog.Title>
            <VisuallyHidden.Root asChild>
              <Dialog.Description className="mb-5 mt-2.5 text-[15px] leading-normal text-mauve11">
                메뉴 (내부 링크, 외부 링크, 테마 변경 등)
              </Dialog.Description>
            </VisuallyHidden.Root>
            <Dialog.Close asChild>
              <button className="hover:bg-zinc-200 dark:hover:bg-zinc-700 size-8 flex justify-center items-center rounded-md">
                <LuX className="size-6" />
              </button>
            </Dialog.Close>
          </header>
          <div className="px-4 py-6 flex flex-col gap-y-2 overflow-y-auto grow">
            <ul>
              <li>
                <Link href="/" className="block p-2">
                  홈
                </Link>
              </li>
              <li>
                <Link href="/posts/pages/1" className="block p-2">
                  글 목록
                </Link>
              </li>
              <li>
                <Link href="/tags" className="block p-2">
                  태그 목록
                </Link>
              </li>
            </ul>
            <HorizontalSeparator />
            <ul>
              <li>
                <a
                  href="https://github.com/k2ep-ru2ning/k2ep-ru2ning.github.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2"
                >
                  Github 저장소
                </a>
              </li>
            </ul>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
