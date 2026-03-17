import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

const blog = defineCollection({
  loader: glob({
    pattern: ["**/*.mdx", "**/*.md"],
    base: "./src/content/blog",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    tags: z.array(z.string()),
    image: z
      .nullable(
        z.object({
          url: z.string(),
          alt: z.string(),
        }),
      )
      .optional(),
    trainingAd: z.nullable(z.string()).optional(),
    draft: z.boolean().default(true),
    redirectFrom: z.array(z.string()).optional(),
    alternate: z.string().optional(),
    publish_time: z.date(),
  }),
});

const training = defineCollection({
  loader: glob({
    pattern: ["**/*.mdx", "**/*.md"],
    base: "./src/content/training",
  }),
  schema: z.object({
    backofficeID: z.number(),
    title: z.string(),
    description: z.string().max(240),
    keywords: z.array(z.string()),
    featured: z.boolean().default(false),
    length: z.number().default(1),
    ad: z.nullable(z.string()),
    icon: z
      .object({
        src: z.string(),
        alt: z.nullable(z.string()),
      })
      .optional(),
    logo: z
      .object({
        src: z.string(),
        alt: z.nullable(z.string()),
      })
      .optional(),
    price: z.object({
      open: z.array(
        z.object({
          amount: z.number(),
          currency: z.enum(["CZK", "EUR"]),
        }),
      ),
      corporate: z.array(
        z.object({
          amount: z.number(),
          currency: z.enum(["CZK", "EUR"]),
        }),
      ),
    }),
    draft: z.boolean().default(true),
    redirectFrom: z.array(z.string()).optional(),
  }),
});

const page = defineCollection({
  loader: glob({
    pattern: ["**/*.mdx", "**/*.md"],
    base: "./src/content/page",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    featured: z.boolean().default(false),
    hidden: z.boolean().default(false),
    draft: z.boolean().default(true),
    redirectFrom: z.array(z.string()).optional(),
    alternate: z.string().optional(),
  }),
});

const reference = defineCollection({
  loader: glob({
    pattern: ["**/*.md"],
    base: "./src/content/reference",
  }),
  schema: z.object({
    authorName: z.string(),
    authorRole: z.string(),
    authorImage: z.string(),
    kind: z.enum(["cooperation", "training", "consultation"]),
    order: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

const talk = defineCollection({
  loader: glob({
    pattern: ["**/*.mdx", "**/*.md"],
    base: "./src/content/talk",
  }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    event: z.object({
      name: z.string(),
      url: z.string().url().optional(),
    }),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog, page, training, reference, talk };
