export interface StaticLinkData {
    name: string;
    href: string;
}

export const LocalizedStaticNavigationLinks = [
    {
        locale: "cs",
        links: [
            {
                name: "Školení",
                href: "/#skoleni",
            },
            {
                name: "Termíny školení",
                href: "/skoleni/verejne-terminy",
            },
            {
                name: "Služby",
                href: "/#sluzby",
            },
            {
                name: "Blog",
                href: "/blog",
            },
        ],
    },
    {
        locale: "en",
        links: [
            {
                name: "Training",
                href: "/#training",
            },
            {
                name: "Training sessions",
                href: "/en/training/public-sessions",
            },
            {
                name: "Services",
                href: "/en/#services",
            },
            {
                name: "Blog",
                href: "/en/blog",
            },
        ],
    },
];
