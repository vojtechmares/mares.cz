interface Article {
    title: string;
    slug: string;
    description: string;
    text: string;
    keywords: string;
    publishedAt: Date | null;
    updatedAt: Date | null;
    locale: "cs" | "en";
    trainingAd?: string;
}

export type { Article };
