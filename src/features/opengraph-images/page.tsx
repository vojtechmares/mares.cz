import type { ReactNode } from "react";

import { OgFrame } from "./frame";
import { displayUrl } from "../../i18n/routes";
import type { Locale } from "../../i18n/types";
import { bareSlug } from "../../lib/content";

// Async and `baseUrl` are part of the signature the card routes call; the card no longer fetches any image.
export async function CreatePageImageComponent({
  slug,
  title,
  description,
  locale = "cs",
}: {
  slug: string;
  title: string;
  description: string;
  baseUrl: string | URL;
  locale?: Locale;
}): Promise<ReactNode> {
  return <OgFrame url={displayUrl(`/${bareSlug(slug)}`, locale)} title={title} description={description} />;
}
