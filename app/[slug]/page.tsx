import { strapi } from "@/lib/strapi/strapi";
import { Metadata } from "next";

import type { Page as PageType } from "@/lib/strapi/types/page";
import { MarkdownContent } from "@/components/markdown-content";
import { notFound } from "next/navigation";

type Params = Promise<{ slug: string }>;

async function getPage(slug: string): Promise<PageType> {
  return await strapi.getPage(slug);
}

export async function generateMetadata(props: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = await getPage(slug);

  return {
    title: `${page.title} | Vojtěch Mareš - DevOps architekt, konzultant, lektor`,
    description: page.description,
    keywords: page.keywords,
    alternates: {
      canonical: `/${page.slug}`,
    },
  };
}

// SSR
export const dynamic = "force-dynamic";

export default async function Page(props: { params: Params }) {
  const { slug } = await props.params;

  try {
    const page = await getPage(slug);

    return (
      <article>
        <MarkdownContent content={page.content} />
      </article>
    );
  } catch (error) {
    console.error("page not found", slug, error);
    notFound();
  }
}
