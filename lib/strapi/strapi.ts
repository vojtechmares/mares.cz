import type {Article} from "@/lib/strapi/types/article"
import type {Page} from "@/lib/strapi/types/page"
import type {Training} from "@/lib/strapi/types/training"
import axios from "axios"

interface StrapiData {
  id: string
  [key: string]: any
}

interface StrapiResponse {
  data: StrapiData | StrapiData[]
}

interface FetchArticlesOptions {
  page?: number
  limit?: number
}

class Strapi {
  private readonly strapiURL: string
  private readonly strapiToken: string

  // TODO: implement proper pagination and set to 12
  private static articlesPerPage = 100

  constructor(strapiToken: string, strapiURL: string) {
    this.strapiToken = strapiToken
    this.strapiURL = strapiURL
  }

  /**
   *
   * @param {number} page
   * @throws {Error}
   * @returns {Promise<Article[]>}
   */
  public async fetchArticles(
    options?: FetchArticlesOptions,
  ): Promise<Article[]> {
    if (options?.page && options.page < 1) {
      throw new Error("Page number must be greater than 0")
    }
    const page = options?.page || 1
    const limit = options?.limit || Strapi.articlesPerPage

    // TODO: implement proper pagination
    const data = await this.sendRequest(
      `/articles?pagination[page]=${page}&pagination[pageSize]=${limit}&sort=publishedAt:desc&filters[publishedAt][$notNull]=true`,
    )

    const articles = data.data.map((article: any) => {
      return this.transformToArticle(article)
    })

    return articles
  }

  public async getArticle(slug: string): Promise<Article> {
    const article = await this.sendRequest(`/articles/${slug}`)

    return this.transformToArticle(article.data)
  }

  public async fetchTrainings(): Promise<Training[]> {
    const data = await this.sendRequest(
      "/trainings?populate=*&pagination[pageSize]=100&filters[publishedAt][$notNull]=true",
    )

    const trainings = data.data.map((training: any) => {
      return this.transformToTraining(training)
    })

    return trainings
  }

  public async getTraining(slug: string): Promise<Training> {
    const training = await this.sendRequest(`/trainings/${slug}?populate=*`)

    return this.transformToTraining(training.data)
  }

  public async fetchPages(): Promise<Page[]> {
    const data = await this.sendRequest(
      "/pages?populate=*&pagination[pageSize]=100&filters[publishedAt][$notNull]=true&sort=title:asc",
    )

    const pages = data.data.map((page: any) => {
      return this.transformToPage(page)
    })

    return pages
  }

  public async getPage(slug: string): Promise<Page> {
    const page = await this.sendRequest(`/pages/${slug}`)

    return this.transformToPage(page.data)
  }

  /**
   *
   * @param {string} path
   * @throws {Error}
   * @returns {Promise<StrapiResponse>}
   */
  private async sendRequest(path: string): Promise<StrapiResponse> {
    const response = await axios.get(`${this.strapiURL}${path}`, {
      headers: {
        Authorization: `Bearer ${this.strapiToken}`,
      },
      timeout: 5000,
    })

    if (response.status < 100 || response.status >= 400) {
      throw new Error(`Strapi request failed with status ${response.status}`)
    }

    return response.data as StrapiResponse
  }

  private transformToArticle(data: any): Article {
    return {
      title: data.title,
      slug: data.slug,
      description: data.description,
      text: data.text,
      keywords: data.keywords,
      publishedAt: new Date(data.publishedAt),
      updatedAt: new Date(data.updatedAt),
      locale: data.locale,
      trainingAd: data.trainingAd !== "" ? data.trainingAd : null,
    }
  }

  private transformToTraining(data: any): Training {
    return {
      slug: data.slug,
      title: data.title,
      description: data.description,
      keywords: data.keywords,
      days: data.days,
      content: data.content,
      adText: data.adText,
      priceOpen: Number(data.priceOpen),
      priceCorporate: Number(data.priceCorporate),
      publishedAt:
        data.publishedAt !== null ? new Date(data.publishedAt) : null,
      icon: {
        url: data.icon?.url,
        alt: data.icon?.alternativeText,
      },
      logo: {
        alt: data.logo?.alternativeText,
        formats: {
          thumbnail: {
            url: data.logo?.formats.thumbnail?.url,
          },
          small: {
            url: data.logo?.formats.small?.url,
          },
          medium: {
            url: data.logo?.formats.medium?.url,
          },
          large: {
            url: data.logo?.formats.large?.url,
          },
        },
      },
    }
  }

  private transformToPage(data: any): Page {
    return {
      slug: data.slug,
      title: data.title,
      keywords: data.keywords,
      description: data.description,
      content: data.content,
      featured: data.featured,
    }
  }
}

const strapi = new Strapi(
  process.env.STRAPI_API_TOKEN!,
  process.env.STRAPI_API_URL!,
)

export {strapi}
