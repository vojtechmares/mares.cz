import { default as NextImage } from "next/image";
import { clsx } from "clsx";

type ImageProps = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

export function Image({ src, alt, width, height, className }: ImageProps) {
  return (
    <NextImage
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={clsx("rounded-2xl", className)}
    />
  );
}
