import type { ReactNode } from "react";

function ArticleImage({
    slug,
    title,
    description,
    imageData,
}: {
    slug: string;
    title: string;
    description: string;
    imageData: ArrayBuffer;
}) {
    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center", // flex-end
                justifyContent: "space-between", // space-between
                backgroundColor: "white",
                color: "black",
            }}
        >
            <div
                style={{
                    marginLeft: "4rem",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    height: "100%",
                }}
            >
                <p
                    style={{
                        fontWeight: 500,
                        fontSize: "2.5rem",
                        color: "#fbbf24",
                    }}
                >
                    Na blogu
                </p>
                <p
                    style={{
                        fontWeight: 700,
                        fontSize: "4rem",
                        marginTop: 0,
                        maxWidth: "42rem",
                    }}
                >
                    {title}
                </p>
                <p
                    style={{
                        marginTop: "1.5rem",
                        maxWidth: "32rem",
                        fontSize: "18px",
                        lineHeight: "1.5556",
                    }}
                >
                    {description}
                </p>
                <p
                    style={{
                        fontSize: "2rem",
                        fontWeight: 500,
                        marginBottom: 0,
                    }}
                >
                    Vojtěch Mareš
                </p>
                <p
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: 300,
                        marginTop: 0,
                    }}
                >
                    mares.cz/blog/{slug}
                </p>
            </div>
            <img
                style={{ position: "absolute", bottom: 0, right: 60 }}
                height={600}
                alt=""
                src={imageData as unknown as string}
            />
        </div>
    );
}

export function CreateArticleImageComponent({
    slug,
    title,
    description,
    imageData,
}: {
    slug: string;
    title: string;
    description: string;
    imageData: ArrayBuffer;
}): ReactNode {
    return (
        <ArticleImage
            slug={slug}
            title={title}
            description={description}
            imageData={imageData}
        />
    );
}
