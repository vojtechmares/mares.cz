import { Client } from "@notionhq/client";
import type {
    DatabaseObjectResponse,
    PageObjectResponse,
    PartialPageObjectResponse,
    DataSourceObjectResponse,
    PartialDataSourceObjectResponse,
    PartialDatabaseObjectResponse,
    BlockObjectResponse,
    PartialBlockObjectResponse,
} from "@notionhq/client";
import { type TrainingSession } from "../interfaces/training";

type ObjectResponse =
    | PageObjectResponse
    | PartialPageObjectResponse
    | DataSourceObjectResponse
    | PartialDataSourceObjectResponse
    | DatabaseObjectResponse
    | PartialDatabaseObjectResponse
    | BlockObjectResponse
    | PartialBlockObjectResponse;

class Notion {
    private client: Client;

    private readonly trainingSessionsDatabaseID: string;

    constructor(notionAPIKey: string) {
        this.client = new Client({
            auth: notionAPIKey,
        });

        this.trainingSessionsDatabaseID =
            import.meta.env.NOTION_TRAINING_SESSIONS_DATABASE_ID;
    }

    public async GetFutureTrainingSessions(): Promise<TrainingSession[]> {
        const pages = await this.queryAllFutureTrainingSessions();

        return this.mapPagesToTrainingSessions(pages);
    }

    public async GetFutureTrainingSessionsForSlug(
        slug: string
    ): Promise<TrainingSession[]> {
        const pages = await this.queryFutureTrainingSessionsForSlug(slug);

        return this.mapPagesToTrainingSessions(pages);
    }

    private isFullDatabase(
        response: ObjectResponse
    ): response is DatabaseObjectResponse {
        return response.object === "database";
    }

    private async queryAllFutureTrainingSessions() {
        const pages: any[] = [];
        let cursor: string | undefined = undefined;

        const shouldContinue = true;
        while (shouldContinue) {
            const database = await this.client.databases.retrieve({
                database_id: this.trainingSessionsDatabaseID,
            });

            if (!this.isFullDatabase(database)) {
                break;
            }

            const { results, next_cursor } =
                await this.client.dataSources.query({
                    data_source_id: database.data_sources[0].id,
                    start_cursor: cursor,
                    page_size: 50,
                    filter: {
                        and: [
                            {
                                property: "Status",
                                status: {
                                    does_not_equal: "Done",
                                },
                            },
                            {
                                property: "Status",
                                status: {
                                    does_not_equal: "Cancelled",
                                },
                            },
                        ],
                    },
                    sorts: [
                        {
                            property: "Date",
                            direction: "ascending",
                        },
                    ],
                });

            pages.push(...results);

            if (!next_cursor) {
                break;
            }

            cursor = next_cursor;
        }

        return pages;
    }

    private async queryFutureTrainingSessionsForSlug(slug: string) {
        const pages: any[] = [];
        let cursor: string | undefined = undefined;

        const shouldContinue = true;
        while (shouldContinue) {
            const database = await this.client.databases.retrieve({
                database_id: this.trainingSessionsDatabaseID,
            });

            if (!this.isFullDatabase(database)) {
                break;
            }

            const { results, next_cursor } =
                await this.client.dataSources.query({
                    data_source_id: database.data_sources[0].id,
                    start_cursor: cursor,
                    page_size: 50,
                    filter: {
                        and: [
                            {
                                property: "Status",
                                status: {
                                    does_not_equal: "Done",
                                },
                            },
                            {
                                property: "Status",
                                status: {
                                    does_not_equal: "Cancelled",
                                },
                            },
                            {
                                property: "meta_slug",
                                select: {
                                    equals: slug,
                                },
                            },
                        ],
                    },
                    sorts: [
                        {
                            property: "Date",
                            direction: "ascending",
                        },
                    ],
                });

            pages.push(...results);

            if (!next_cursor) {
                break;
            }

            cursor = next_cursor;
        }

        return pages;
    }

    private mapPagesToTrainingSessions(pages: any[]): TrainingSession[] {
        const sessions: TrainingSession[] = [];
        for (const page of pages) {
            const session = this.mapPageToTrainingSession(page);

            if (session === null) {
                continue;
            }

            sessions.push(session);
        }

        return sessions;
    }

    private mapPageToTrainingSession(page: any): TrainingSession | null {
        const props = page.properties;

        const name = props.Training?.title[0]?.plain_text;
        if (typeof name === "undefined") {
            return null;
        }

        const slug = props.meta_slug?.select?.name;
        if (typeof slug === "undefined") {
            return null;
        }

        const location = props.Location?.rich_text[0]?.plain_text;
        if (typeof location === "undefined") {
            return null;
        }

        const price = props.Price?.number;
        if (typeof price === "undefined") {
            return null;
        }

        const signUpFormURL = props["Sign up form URL"]?.url;
        if (typeof signUpFormURL === "undefined") {
            return null;
        }

        const start = props.Date?.date?.start;
        const end = props.Date?.date?.end;
        if (typeof start === "undefined") {
            return null;
        }

        const session: TrainingSession = {
            name: name,
            slug: slug,
            location: location,
            price: price,
            signUpFormURL: signUpFormURL,
            dates: {
                start: start,
                end: undefined,
            },
        } as TrainingSession;

        if (typeof end !== "undefined") {
            session.dates.end = end;
        }

        return session;
    }
}

const notion = new Notion(import.meta.env.NOTION_API_KEY);

export { notion };
