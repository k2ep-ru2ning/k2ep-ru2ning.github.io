import { type ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement>;

export default function PageNavButton({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className="w-7 h-7 flex justify-center items-center border border-gray-300 dark:border-gray-700 rounded-md disabled:text-gray-300 dark:disabled:text-gray-700"
    >
      {children}
    </button>
  );
}
