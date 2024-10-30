import type { Article } from "@/lib/strapi/types/blog/article";

interface StrapiData {
  id: string;
  [key: string]: any;
}

interface StrapiResponse {
  data: StrapiData | StrapiData[];
}

interface FetchArticlesOptions {
  page?: number;
  limit?: number;
}

class Strapi {
  private readonly strapiURL: string;
  private readonly strapiToken: string;

  // TODO: implement proper pagination and set to 12
  private static articlesPerPage = 100;

  constructor(strapiToken: string, strapiURL: string) {
    this.strapiToken = strapiToken;
    this.strapiURL = strapiURL;
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
      throw new Error("Page number must be greater than 0");
    }
    const page = options?.page || 1;
    const limit = options?.limit || Strapi.articlesPerPage;

    // TODO: implement proper pagination
    const data = await this.sendRequest(
      `/articles?pagination[page]=${page}&pagination[pageSize]=${limit}&sort=publishedAt:desc&filters[publishedAt][$notNull]=true`,
    );

    const articles = data.data.map((article: any) => {
      return this.transformToArticle(article);
    });

    return articles;
  }

  public async getArticle(slug: string): Promise<Article> {
    const article = await this.sendRequest(`/articles/${slug}`);

    return this.transformToArticle(article.data);
  }

  /**
   *
   * @param {string} path
   * @throws {Error}
   * @returns {Promise<Article>}
   */
  private async sendRequest(path: string): Promise<StrapiResponse> {
    const response = await fetch(`${this.strapiURL}${path}`, {
      next: { revalidate: 60 }, // cache for 60 seconds
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.strapiToken}`,
        ContentType: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Strapi request failed with status ${response.status}`);
    }

    return (await response.json()) as StrapiResponse;
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
    };
  }
}

const strapi = new Strapi(process.env.CMS_API_TOKEN!, process.env.CMS_API_URL!);

export { strapi };
