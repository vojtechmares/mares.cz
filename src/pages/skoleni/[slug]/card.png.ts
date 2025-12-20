import { type CollectionEntry, getCollection } from "astro:content";

import satori from "satori";
import sharp from "sharp";

import { join } from "node:path";
import { readFile } from "node:fs/promises";

import { CreateTrainingImageComponent } from "../../../features/opengraph-images/training";

// switch to static page rendering during build time
export const prerender = true;

interface Props {
  training: CollectionEntry<"training">;
}

export async function getStaticPaths() {
  const trainings = await getCollection("training", ({ data }) => {
    return !data.draft;
  });

  // const paths = pages.map(page => {
  //   const [lang, ...slug] = page.id.split('/');
  //   return { params: { lang, slug: slug.join('/') || undefined }, props: page };
  // });

  return trainings.map((training) => {
    return {
      params: { slug: training.id },
      props: { training: training },
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
  const { training } = props;

  // const training = await strapi.getTraining(slug);

  // const avatarData = await readFile(
  //     join(process.cwd(), "./src/images/people/vojtech-mares.png")
  // );
  // const avatarSrc = Uint8Array.from(avatarData).buffer;

  let iconData: ArrayBuffer | string | undefined = undefined;
  if (training.data.icon?.src !== undefined) {
    console.log(training.data.icon.src);
    // const res = await fetch(training.icon.url);
    // iconData = await res.arrayBuffer();
    iconData = training.data.icon.src;
  }

  const component = CreateTrainingImageComponent({
    slug: training.id,
    title: training.data.title,
    description: training.data.description,
    image: iconData,
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
