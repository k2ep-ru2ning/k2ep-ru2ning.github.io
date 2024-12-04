import { type ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function PageNavButton({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className="size-7 flex justify-center items-center border border-zinc-300 dark:border-zinc-700 rounded-md disabled:text-zinc-300 dark:disabled:text-zinc-700"
    >
      {children}
    </button>
  );
}
