import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {
  const trainings = await getCollection("training", ({ id, data }) => !data.draft && id !== "empty");

  const items = trainings.map((entry) => {
    const isEnglish = entry.id.startsWith("en/");
    const slug = isEnglish ? entry.id : `cs/${entry.id}`;
    const locale = isEnglish ? "en" : "cs";

    return {
      slug,
      href: `/api/v1/trainings/${slug}`,
      title: entry.data.title,
      description: entry.data.description,
      length: entry.data.length,
      locale,
    };
  });

  return new Response(JSON.stringify(items), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
