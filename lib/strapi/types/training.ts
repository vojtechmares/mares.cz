type Training = {
  slug: string
  title: string
  description: string
  keywords: string
  days: number
  content: string
  adText: string
  priceOpen: number
  priceCorporate: number
  icon?: TrainingIcon
  logo?: TrainingLogo
  publishedAt: Date | null
}

// not icon of the training, but of the technology
type TrainingIcon = {
  url: string
  alt: string | null
}

// not logo of the training, but of the technology
type TrainingLogo = {
  alt: string | null
  formats: {
    thumbnail?: {
      url: string
    }
    small?: {
      url: string
    }
    medium?: {
      url: string
    }
    large?: {
      url: string
    }
  }
}

export type { Training, TrainingIcon, TrainingLogo }
