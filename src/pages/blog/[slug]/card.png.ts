import { type CollectionEntry, getCollection } from "astro:content";

import { CreateArticleImageComponent } from "../../../features/opengraph-images/article";
import { OpenGraphImageResponse } from "../../../lib/opengraph";

interface Props {
  article: CollectionEntry<"blog">;
}

export async function getStaticPaths() {
  // Get all `src/content/blog/` entries
  const articles = await getCollection("blog", ({ data }) => {
    return !data.draft;
  });

  // const paths = pages.map(page => {
  //   const [lang, ...slug] = page.id.split('/');
  //   return { params: { lang, slug: slug.join('/') || undefined }, props: page };
  // });

  return articles.map((article) => {
    return {
      params: { slug: article.id },
      props: { article: article },
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
  const { slug: _slug } = params;
  const { article } = props;

  const component = await CreateArticleImageComponent({
    slug: article.id,
    title: article.data.title,
    description: article.data.description,
  });

  return OpenGraphImageResponse(component);
}
