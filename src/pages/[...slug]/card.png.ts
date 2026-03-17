import type { APIContext } from "astro";

import { CreatePageImageComponent } from "../../features/opengraph-images/page";
import { OpenGraphImageResponse } from "../../lib/opengraph";
import { getLocalizedEntry, getLocalizedCollection, bareSlug } from "../../lib/content";
import { localizeUrl } from "../../i18n/routes";

export async function GET({ params, url, locals, site }: APIContext) {
  const baseUrl = site?.origin ?? "https://www.mares.cz";
  const locale = locals.locale;
  const { slug } = params;
  if (!slug) {
    return new Response("Not Found", { status: 404 });
  }

  const page = await getLocalizedEntry("page", slug, locale);
  if (!page || page.data.draft) {
    const allPages = await getLocalizedCollection(
      "page",
      locale,
      ({ data }) => !data.draft && data.redirectFrom?.includes(slug!),
    );
    if (allPages.length > 0) {
      return Response.redirect(
        new URL(localizeUrl(`/${bareSlug(allPages[0].id)}/card.png`, locale), url).toString(),
        301,
      );
    }
    const alternatePages = await getLocalizedCollection(
      "page",
      locale,
      ({ data }) => !data.draft && data.alternate === slug,
    );
    if (alternatePages.length > 0) {
      return Response.redirect(
        new URL(localizeUrl(`/${bareSlug(alternatePages[0].id)}/card.png`, locale), url).toString(),
        301,
      );
    }
    return new Response("Not Found", { status: 404 });
  }

  const component = await CreatePageImageComponent({
    slug: page.id,
    title: page.data.title,
    description: page.data.description,
    baseUrl,
  });

  return OpenGraphImageResponse(component, baseUrl);
}
