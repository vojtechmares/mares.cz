import type { ReactNode } from "react";

function Page({
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
                        fontWeight: 700,
                        fontSize: "4rem",
                        marginBottom: 0,
                        paddingBottom: 0,
                        color: "#f59e0b",
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
                <p style={{ fontSize: "2rem", fontWeight: 500 }}>
                    mares.cz/{slug}
                </p>
            </div>
            <img
                style={{ position: "absolute", bottom: 0, right: 60 }}
                alt=""
                height={600}
                src={imageData as unknown as string}
            />
        </div>
    );
}

export function CreatePageImageComponent({
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
        <Page
            slug={slug}
            title={title}
            description={description}
            imageData={imageData}
        />
    );
}
