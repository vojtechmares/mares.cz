/* eslint-disable @next/next/no-img-element */

import {ImageResponse} from "next/og"
import {strapi} from "@/lib/strapi/strapi"
import {Training} from "@/lib/strapi/types/training"

// Image metadata
type Props = {
  params: {slug: string}
}

async function getTraining(slug: string): Promise<Training> {
  const training = await strapi.getTraining(slug)

  return training
}

export async function generateImageMetadata({params}: Props) {
  const {slug} = params
  const training = await getTraining(slug)

  return [
    {
      id: params.slug,
      alt: "Školení " + training.title,
      size: {
        width: 1200,
        height: 630,
      },
      contentType: "image/png",
    },
  ]
}

function withImage(training: Training, logoSrc: ArrayBuffer): ImageResponse {
  return new ImageResponse(
    (
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
        <div tw="ml-16 flex flex-col justify-center h-full">
          <p
            style={{
              fontWeight: 700,
              fontSize: "4rem",
              marginBottom: 0,
              paddingBottom: 0,
            }}
            tw="text-amber-500"
          >
            Školení {training.title}
          </p>
          <p tw="mt-6 max-w-2xl text-lg">{training.description}</p>
          <p style={{fontSize: "2rem", fontWeight: 500, marginBottom: 0}}>
            Vojtěch Mareš
          </p>
          <p style={{fontSize: "1.5rem", fontWeight: 300, marginTop: 0}}>
            mares.cz/skoleni/{training.slug}
          </p>
        </div>
        {logoSrc && (
          <img
            style={{position: "absolute", right: 60}}
            width="400"
            height="400"
            alt=""
            src={logoSrc as unknown as string}
          />
        )}
      </div>
    ),
  )
}

function withoutImage(training: Training): ImageResponse {
  return new ImageResponse(
    (
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
        <div tw="ml-16 flex flex-col justify-center h-full">
          <p style={{fontWeight: 700, fontSize: "4rem"}} tw="text-amber-500">
            Školení {training.title}
          </p>
          <p tw="mt-6 max-w-5xl text-lg">{training.description}</p>
          <p style={{fontSize: "2rem", fontWeight: 500, marginBottom: 0}}>
            Vojtěch Mareš
          </p>
          <p style={{fontSize: "1.5rem", fontWeight: 300, marginTop: 0}}>
            mares.cz/skoleni/{training.slug}
          </p>
        </div>
      </div>
    ),
  )
}

// Image generation
export default async function Image({params}: Props) {
  const {slug} = params
  const training = await getTraining(slug)

  let imageURL = training.logo?.formats.small?.url

  if (imageURL === undefined) {
    return withoutImage(training)
  }

  const imageSrc = await fetch(new URL(imageURL)).then((res) =>
    res.arrayBuffer(),
  )

  if (!imageSrc) {
    return withoutImage(training)
  }

  return withImage(training, imageSrc)
}
