import rss from "@astrojs/rss";
import { strapi } from "../../lib/strapi";

export async function GET(context: any) {
    const articles = await strapi.fetchArticles();

    const articlesToItems = articles.map((article) => {
        return {
            title: article.title,
            description: article.description,
            link: context.site + "/blog/" + article.slug,
            pubDate: new Date(article.publishedAt as Date),
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
