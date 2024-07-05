import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

import "@/styles/tailwind.css";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "Vojtěch Mareš - DevOps konzultant, lektor, engineer",
  description: "Vojtěch Mareš - DevOps konzultant, lektor, engineer",
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
  metadataBase: new URL("https://vojtechmares.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: "https://vojtechmares.com",
    type: "website",
    title: "Vojtěch Mareš - DevOps konzultant, lektor",
    description: "Vojtěch Mareš - DevOps konzultant, lektor",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vojtechmares",
    creator: "@vojtechmares",
    title: "Vojtěch Mareš - DevOps konzultant, lektor",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html
      className="h-full scroll-smooth bg-white antialiased [font-feature-settings:'ss01']"
      lang="cs"
    >
      <head>
        <script
          defer
          data-domain="vojtechmares.com"
          src="https://plausible.io/js/script.js"
        ></script>
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
