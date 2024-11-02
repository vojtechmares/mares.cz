type Article = {
  title: string;
  slug: string;
  description: string;
  text: string;
  keywords: string;
  publishedAt: Date;
  updatedAt: Date;
  locale: "cs" | "en";
  trainingAd?: string;
};

export type { Article };
