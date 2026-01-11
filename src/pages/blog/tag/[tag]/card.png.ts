import { type CollectionEntry, getCollection } from "astro:content";

import { CreateTagArchiveImageComponent } from "../../../../features/opengraph-images/tag-archive";
import { OpenGraphImageResponse } from "../../../../lib/opengraph";

interface Props {
  tag: string;
  articles: CollectionEntry<"blog">[];
}

export async function getStaticPaths() {
  const articles = await getCollection("blog", ({ data }) => !data.draft);

  // Extract unique tags
  const tags = [...new Set(articles.flatMap((article) => article.data.tags))];

  return tags
    .filter((tag) => tag !== "")
    .map((tag) => ({
      params: { tag },
      props: {
        tag,
        articles: articles.filter((a) => a.data.tags.includes(tag)),
      },
    }));
}

export async function GET({ params, props }: { params: { tag: string }; props: Props }) {
  const { tag } = params;
  const { articles } = props;

  const component = await CreateTagArchiveImageComponent({
    tag,
    articleCount: articles.length,
  });

  return OpenGraphImageResponse(component);
}
