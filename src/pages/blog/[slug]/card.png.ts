import { type CollectionEntry, getCollection } from "astro:content";

import satori from "satori";
import sharp from "sharp";

import { join } from "node:path";
import { readFile } from "node:fs/promises";

import { CreateArticleImageComponent } from "../../../features/opengraph-images/article";

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

  const avatarData = await readFile(
    join(process.cwd(), "./src/images/people/vojtech-mares.png"),
  );
  const avatarSrc = Uint8Array.from(avatarData).buffer;

  const component = CreateArticleImageComponent({
    slug: article.id,
    title: article.data.title,
    description: article.data.description,
    imageData: avatarSrc,
  });

  const interFontRegular = await readFile(
    join(process.cwd(), "./src/fonts/Inter_18pt-Regular.ttf"),
  );
  const interFontLight = await readFile(
    join(process.cwd(), "./src/fonts/Inter_18pt-Light.ttf"),
  );
  const interFontBold = await readFile(
    join(process.cwd(), "./src/fonts/Inter_18pt-Bold.ttf"),
  );

  const svg = await satori(component, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Inter",
        data: interFontRegular,
        weight: 500,
      },
      {
        name: "Inter",
        data: interFontLight,
        weight: 300,
      },
      {
        name: "Inter",
        data: interFontBold,
        weight: 700,
      },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(png as unknown as ArrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
