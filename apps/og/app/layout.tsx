import { Analytics } from '@vercel/analytics/react'

import './tailwind.css'

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html className="h-full scroll-smooth bg-white antialiased [font-feature-settings:'ss01']" lang="cs">
      <head>
      </head>
      <body className="flex h-full flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  )
}

export default RootLayout
