import { type CollectionEntry, getCollection } from "astro:content";
import { join } from "node:path";

import { CreateTrainingImageComponent } from "../../../features/opengraph-images/training";
import { imageToDataUrl, OpenGraphImageResponse } from "../../../lib/opengraph";

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

export async function GET({ params, props }: { params: { slug: string }; props: Props }) {
  const { slug: _slug } = params;
  const { training } = props;

  let iconDataUrl: string | undefined = undefined;
  if (training.data.icon?.src !== undefined) {
    iconDataUrl = await imageToDataUrl(join(process.cwd(), "./public", training.data.icon.src));
  }

  const component = CreateTrainingImageComponent({
    slug: training.id,
    title: training.data.title,
    description: training.data.description,
    image: iconDataUrl,
  });

  return OpenGraphImageResponse(component);
}
