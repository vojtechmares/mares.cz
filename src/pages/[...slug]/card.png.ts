import { type CollectionEntry, getCollection } from "astro:content";

import { CreatePageImageComponent } from "../../features/opengraph-images/page";
import { OpenGraphImageResponse } from "../../lib/opengraph";

interface Props {
  page: CollectionEntry<"page">;
}

export async function getStaticPaths() {
  // Get all `src/content/page/` entries
  const pages = await getCollection("page", ({ data }) => {
    return !data.draft;
  });

  // const paths = pages.map(page => {
  //   const [lang, ...slug] = page.id.split('/');
  //   return { params: { lang, slug: slug.join('/') || undefined }, props: page };
  // });

  return pages.map((page) => {
    return {
      params: { slug: page.id },
      props: { page: page },
    };
  });

  // return paths;
}

export async function GET({
  params,
  props,
}: {
  params: { slug: string };
  props: Props;
}) {
  // const { lang, slug } = Astro.params;
  const { slug: _slug } = params;
  const { page } = props;

  const component = await CreatePageImageComponent({
    slug: page.id,
    title: page.data.title,
    description: page.data.description,
  });

  return OpenGraphImageResponse(component);
}
