/* eslint-disable @next/next/no-img-element */

import {join} from "node:path"
import {readFile} from "node:fs/promises"
import {ImageResponse} from "next/og"

// Image metadata
export const alt =
  "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default async function Image() {
  const avatarData = await readFile(
    join(process.cwd(), "./public/images/people/vojtech-mares.png"),
  )
  const avatarSrc = Uint8Array.from(avatarData).buffer

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
          >
            <span tw="relative text-amber-500" style={{whiteSpace: "nowrap"}}>
              <span tw="relative">Vojtěch Mareš</span>
            </span>
            <br />,
          </p>
          <p
            style={{
              fontWeight: 700,
              fontSize: "4rem",
              marginTop: 0,
              paddingTop: 0,
            }}
          >
            DevOps architekt.
          </p>
          <p tw="mt-6 max-w-lg text-lg">
            Snížím Vaše náklady na infrastrukturu, zbavím Vás technického dluhu.
            Naučím Váš tým, jak používat moderní cloud-native technologie.
          </p>
          <p style={{fontSize: "2rem", fontWeight: 500}}>mares.cz</p>
        </div>
        <img
          style={{position: "absolute", bottom: 0, right: 60}}
          alt=""
          height="600"
          src={avatarSrc as unknown as string}
        />
      </div>
    ),
  )
}
