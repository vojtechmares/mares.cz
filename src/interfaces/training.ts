interface Training {
    slug: string;
    title: string;
    description: string;
    keywords: string;
    days: number;
    content: string;
    adText: string;
    priceOpen: number;
    priceCorporate: number;
    icon?: TrainingIcon;
    logo?: TrainingLogo;
    publishedAt: Date | null;
    updatedAt: Date | null;
}

// not icon of the training, but of the technology
interface TrainingIcon {
    url: string;
    alt: string | null;
}

// not logo of the training, but of the technology
interface TrainingLogo {
    alt: string | null;
    formats: {
        thumbnail?: {
            url: string;
        };
        small?: {
            url: string;
        };
        medium?: {
            url: string;
        };
        large?: {
            url: string;
        };
    };
}

interface TrainingSession {
    name: string;
    slug: string;
    dates: {
        start: string;
        end?: string;
    };
    location: string;
    price: number;
    signUpFormURL?: URL;
}

export type { Training, TrainingIcon, TrainingLogo, TrainingSession };
