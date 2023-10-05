import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/react'

import { Footer } from '@/components/layout/Footer'
import { Navigation } from '@/components/layout/Navigation'

import '@/styles/tailwind.css'

export const metadata: Metadata = {
  title: 'Vojtěch Mareš - DevOps konzultant, lektor, engineer',
  description: 'Vojtěch Mareš - DevOps konzultant, lektor, engineer',
  themeColor: '#ffffff',
  viewport: 'width=device-width, initial-scale=1.0',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/shortcut-icon.png',
    apple: '/apple-touch-icon.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  manifest: '/site.webmanifest',
  twitter: {
    card: 'summary_large_image',
    site: '@vojtechmares',
    creator: '@vojtechmares',
    title: 'Vojtěch Mareš - DevOps konzultant, lektor, engineer',
    images: [
      { url: '/og.png' },
    ]
  },
}

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
      </head>
      <body className="flex h-full flex-col">
        <Navigation />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}

export default RootLayout
