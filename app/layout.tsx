import type {Metadata, Viewport} from "next"
import {GoogleAnalytics, GoogleTagManager} from "@next/third-parties/google"
import Script from "next/scriptt"

import {Footer} from "@/components/layout/footer"
import {Navigation} from "@/components/layout/navigation"

import "@/styles/tailwind.css"
import {strapi} from "@/lib/strapi/strapi"

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1.0,
}

export const metadata: Metadata = {
  title: "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
  description:
    "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
  icons: {
    icon: [
      {url: "/favicon.ico"},
      {url: "/favicon-16x16.png", sizes: "16x16", type: "image/png"},
      {url: "/favicon-32x32.png", sizes: "32x32", type: "image/png"},
    ],
    shortcut: "/shortcut-icon.png",
    apple: "/apple-touch-icon.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/apple-touch-icon-precomposed.png",
    },
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://www.mares.cz"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "https://www.mares.cz",
    type: "website",
    siteName:
      "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
    title:
      "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
    description:
      "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vojtechmares_",
    creator: "@vojtechmares_",
    title:
      "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
    description:
      "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
  },
}

const RootLayout = async ({children}: {children: React.ReactNode}) => {
  const isProduction = process.env.NODE_ENV === "production"
  const suppressGoogleAnalytics =
    process.env.SUPPRESS_GOOGLE_ANALYTICS === "true"

  const pages = await strapi.fetchPages()
  const trainings = await strapi.fetchTrainings()

  return (
    <html
      className="h-full scroll-smooth bg-white antialiased [font-feature-settings:'ss01']"
      lang="cs"
    >
      <head>
        <link
          rel="sitemap"
          type="application/xml"
          title="Sitemap"
          href="/sitemap.xml"
        />
        <link rel="me" href="https://mastodon.social/@vojtechmares" />
        <meta
          name="fediverse:creator"
          content="@vojtechmares@mastodon.social"
        />
        <link rel="preconnect" href="https://cdn.mares.cz" />
        {isProduction || suppressGoogleAnalytics ? (
          <GoogleTagManager gtmId="	GTM-5W5Q3LTV" />
          {/* Twitter conversion tracking base code */}
          <Script
            src="/twpx.js"
            strategy="lazyOnload"
          />
          {/* End Twitter conversion tracking base code */}
        ) : (
          <></>
        )}
      </head>
      <body className="flex h-full flex-col">
        <Navigation pages={pages} />
        {children}
        <Footer pages={pages} trainings={trainings} />
        {isProduction || suppressGoogleAnalytics ? (
          <GoogleAnalytics gaId="G-9N0T70XBV8" />
        ) : (
          <></>
        )}
      </body>
    </html>
  )
}

export default RootLayout
