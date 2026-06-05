import type { APIRoute } from "astro";
import { getEntry } from "astro:content";
import yaml from "js-yaml";

export const GET: APIRoute = async ({ params }) => {
  const { locale, slug } = params;

  if (locale !== "cs" && locale !== "en") {
    return new Response("Not found", { status: 404 });
  }

  const entryId = locale === "cs" ? slug! : `en/${slug}`;
  const entry = await getEntry("training", entryId);

  if (!entry || entry.data.draft) {
    return new Response("Not found", { status: 404 });
  }

  const frontmatter = yaml.dump(entry.data, { lineWidth: -1 });
  const markdown = `---\n${frontmatter}---\n${entry.body}`;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
