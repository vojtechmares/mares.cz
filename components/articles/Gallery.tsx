import clsx from "clsx";
import Image from "next/image";

type GalleryProps = {
  images: { src: string; alt: string }[];
};

export function Gallery({ images }: GalleryProps) {
  return (
    <div className="grid grid-cols-1 md:py-4">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.src}
          className={clsx(
            "my-1 rounded-2xl md:-my-4 md:w-2/3",
            index % 2 === 0
              ? "rotate-2 md:justify-self-start"
              : "-rotate-2 md:justify-self-end",
          )}
          alt={image.alt}
        />
      ))}
    </div>
  );
}
