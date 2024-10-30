import Image from "next/image";
import { type ComponentProps } from "react";

export default function RoundedImage({
  src,
  alt,
}: ComponentProps<typeof Image>) {
  return (
    <Image
      src={src}
      alt={alt}
      width={600}
      height={380}
      priority
      className="rounded-md w-full"
    />
  );
}
