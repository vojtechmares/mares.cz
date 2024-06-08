import { default as NextImage } from "next/image";
import { clsx } from "clsx";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function Image({ src, alt, className }: ImageProps) {
  return (
    <NextImage src={src} alt={alt} className={clsx("rounded-2xl", className)} />
  );
}
