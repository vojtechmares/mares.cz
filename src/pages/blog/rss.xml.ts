import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const articles = (
    await getCollection("blog", ({ id, data }) => {
      return !data.draft && !id.includes("/");
    })
  ).sort((a, b) => {
    return b.data.publish_time.valueOf() - a.data.publish_time.valueOf();
  });

  const articlesToItems = articles.map((article) => {
    return {
      title: article.data.title,
      description: article.data.description,
      link: context.site + "/blog/" + article.id,
      pubDate: new Date(article.data.publish_time as Date),
      author: "vojtech@mares.cz",
    };
  });

  return rss({
    // `<title>` field in output xml
    title: "Vojtěch Mareš's blog",
    // `<description>` field in output xml
    description: "Blog nejen o DevOps",
    // Pull in your project "site" from the endpoint context
    // https://docs.astro.build/en/reference/api-reference/#site
    site: context.site,
    // Array of `<item>`s in output xml
    // See "Generating items" section for examples using content collections and glob imports
    items: articlesToItems,
    // (optional) inject custom xml
    customData: `<language>cs-cz</language>`,
  });
}
