type Props = {
  src: string;
  alt: string;
};

export default function PostArticleImage({ src, alt }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className="mx-auto max-w-full rounded-md border border-zinc-300 dark:border-zinc-700"
    />
  );
}
