import type { ReactNode } from "react";

function TrainingImage({
  slug,
  title,
  description,
  imageData,
}: {
  slug: string;
  title: string;
  description: string;
  imageData?: string;
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
        color: "#d4d4d8",
        backgroundColor: "#18181b",
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
          }}
        >
          {title} školení
        </p>
        <p
          style={{
            marginTop: "1.5rem",
            maxWidth: "32rem",
            fontSize: "18px",
            lineHeight: "1.5556",
            fontWeight: 300,
            fontFamily: "Space Mono",
          }}
        >
          {description}
        </p>
        <p
          style={{
            fontSize: "2rem",
            fontWeight: 500,
            marginBottom: 0,
            fontFamily: "Space Mono",
          }}
        >
          Vojtěch Mareš
        </p>
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: 300,
            marginTop: 0,
            fontFamily: "Space Mono",
          }}
        >
          DevOps achitekt & lektor
        </p>
        <p
          style={{
            fontSize: "1.5rem",
            fontWeight: 500,
            marginTop: 0,
            fontFamily: "Space Mono",
          }}
        >
          mares.cz/skoleni/{slug}
        </p>
      </div>
      {imageData !== undefined && (
        <img
          style={{ position: "absolute", right: 60, filter: `invert(100%)` }}
          width={400}
          height={400}
          alt=""
          src={imageData}
        />
      )}
    </div>
  );
}

export function CreateTrainingImageComponent({
  slug,
  title,
  description,
  image = undefined,
}: {
  slug: string;
  title: string;
  description: string;
  image?: string;
}): ReactNode {
  return <TrainingImage slug={slug} title={title} description={description} imageData={image} />;
}
