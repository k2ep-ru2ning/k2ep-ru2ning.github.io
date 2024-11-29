import Image from "next/image";
import { type ComponentProps } from "react";

type Props = ComponentProps<typeof Image>;

export default function PostArticleImage({ src, alt, width, height }: Props) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority
      className="mx-auto max-w-full rounded-md border border-zinc-300 dark:border-zinc-700"
    />
  );
}
