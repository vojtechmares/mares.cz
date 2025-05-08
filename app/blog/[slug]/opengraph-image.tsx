/* eslint-disable @next/next/no-img-element */

import {strapi} from "@/lib/strapi/strapi"
import {join} from "node:path"
import {readFile} from "node:fs/promises"
import {ImageResponse} from "next/og"

type Props = {
  params: {slug: string}
}

async function getArticle(slug: string) {
  const article = await strapi.getArticle(slug)

  return article
}

export async function generateImageMetadata({params}: Props) {
  const {slug} = await params
  const article = await getArticle(slug)

  return [
    {
      id: params.slug,
      alt:
        article.title +
        " | Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
      size: {
        width: 1200,
        height: 630,
      },
      contentType: "image/png",
    },
  ]
}

// Image generation
export default async function Image(props: Props) {
  const avatarData = await readFile(
    join(process.cwd(), "./public/images/people/vojtech-mares.png"),
  )

  console.log(
    "static-image-path:",
    join(process.cwd(), "./public/images/people/vojtech-mares.png"),
  )

  const avatarSrc = Uint8Array.from(avatarData).buffer

  const {slug} = await props.params
  const article = await getArticle(slug)

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
          <p style={{fontWeight: 500, fontSize: "2.5rem"}} tw="text-amber-500">
            Na blogu
          </p>
          <p
            tw="max-w-2xl"
            style={{fontWeight: 700, fontSize: "4rem", marginTop: 0}}
          >
            {article.title}
          </p>
          <p tw="mt-6 max-w-xl text-lg">{article.description}</p>
          <p style={{fontSize: "2rem", fontWeight: 500, marginBottom: 0}}>
            Vojtěch Mareš
          </p>
          <p style={{fontSize: "1.5rem", fontWeight: 300, marginTop: 0}}>
            mares.cz/blog/{article.slug}
          </p>
        </div>
        <img
          style={{position: "absolute", bottom: 0, right: 60}}
          height="600"
          alt=""
          src={avatarSrc as unknown as string}
        />
      </div>
    ),
  )
}
