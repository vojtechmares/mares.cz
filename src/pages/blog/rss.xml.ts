import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context: any) {
  const locale = context.locals?.locale ?? "cs";
  const isEnglish = locale === "en";

  const articles = (
    await getCollection("blog", ({ id, data }) => {
      if (data.draft) return false;
      return isEnglish ? id.startsWith("en/") : !id.includes("/");
    })
  ).sort((a, b) => {
    return b.data.publish_time.valueOf() - a.data.publish_time.valueOf();
  });

  const articlesToItems = articles.map((article) => {
    const slug = isEnglish ? article.id.replace(/^en\//, "") : article.id;
    const linkPrefix = isEnglish ? "/en/blog/" : "/blog/";
    return {
      title: article.data.title,
      description: article.data.description,
      link: context.site + linkPrefix + slug,
      pubDate: new Date(article.data.publish_time as Date),
      author: "vojtech@mares.cz",
    };
  });

  return rss({
    title: isEnglish ? "Vojtěch Mareš's Blog" : "Vojtěch Mareš's blog",
    description: isEnglish ? "Blog about DevOps and more" : "Blog nejen o DevOps",
    site: context.site,
    items: articlesToItems,
    customData: `<language>${isEnglish ? "en" : "cs-cz"}</language>`,
  });
}
