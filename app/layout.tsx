import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";

import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

import "@/styles/tailwind.css";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
  description:
    "Vojtěch Mareš - DevOps architekt, konzultant a lektor na volné noze",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
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
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const isProduction = process.env.NODE_ENV === "production";

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
      </head>
      <body className="flex h-full flex-col">
        <Navigation />
        {children}
        <Footer />
        {isProduction ? <GoogleAnalytics gaId="G-9N0T70XBV8" /> : <></>}
      </body>
    </html>
  );
};

export default RootLayout;
