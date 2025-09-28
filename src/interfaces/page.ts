interface Page {
    slug: string; // id
    title: string;
    keywords: string; // seo
    description: string; // seo
    content: string; // markdown
    featured: boolean; // show in navigation
    updatedAt: Date | null;
}

export type { Page };
