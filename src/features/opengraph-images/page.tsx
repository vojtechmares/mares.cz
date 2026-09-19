import type { ReactNode } from "react";

import { OgFrame } from "./frame";

// Async and `baseUrl` are part of the signature the card routes call; the card no longer fetches any image.
export async function CreatePageImageComponent({
  slug,
  title,
  description,
}: {
  slug: string;
  title: string;
  description: string;
  baseUrl: string | URL;
}): Promise<ReactNode> {
  return <OgFrame url={`mares.cz/${slug}`} title={title} description={description} />;
}
