import Image from "next/image";
import { type ComponentProps } from "react";

export default function RoundedImage({
  src,
  alt,
  width,
  height,
}: ComponentProps<typeof Image>) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority
      className="rounded-md mx-auto"
    />
  );
}
