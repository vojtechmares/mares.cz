import { defineCollection } from "astro:content";

import { glob } from "astro/loaders";

import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({
    pattern: ["*.mdx", "*.md"],
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
    publish_time: z.date(),
  }),
});

const training = defineCollection({
  loader: glob({
    pattern: ["*.mdx", "*.md"],
    base: "./src/content/training",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
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
  }),
});

const page = defineCollection({
  loader: glob({
    pattern: ["*.mdx", "*.md"],
    base: "./src/content/page",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    featured: z.boolean().default(false),
    hidden: z.boolean().default(false),
    draft: z.boolean().default(true),
  }),
});

// const reference = defineCollection({
//   /* ... */
// });

export const collections = { blog, page, training };
// export const collections = { blog, training, page, reference };
