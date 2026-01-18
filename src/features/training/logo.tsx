import type { CollectionEntry } from "astro:content";

import clsx from "clsx";

export function Logo({ training }: { training: CollectionEntry<"training"> }) {
  let imageURL = training.data.logo?.src;

  if (imageURL === undefined) {
    // using SVG icon as fallback
    imageURL = training.data.icon?.src;
  }

  if (imageURL === undefined) {
    return <></>;
  }

  return (
    <img
      src={imageURL}
      alt=""
      width="100"
      height="100"
      className={clsx("h-32 w-auto", imageURL.endsWith(".svg") ? "invert" : "")}
    />
  );
}
