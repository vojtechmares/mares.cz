"use client"

import Script from "next/script"
import {usePathname, useSearchParams} from "next/navigation"
import {useEffect} from "react"

declare global {
  interface Window {
    gtag: any
  }
}

export function GoogleAnalytics({gaID}: {gaID: string}) {
  const pathname = usePathname()
  // SearchParams is a client side function.
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()

    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("config", gaID, {
        page_path: url,
      })
    }
  }, [pathname, searchParams, gaID])

  // Script is added to the head of the document. To Begin, consent is denied.
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaID}`}
      />

      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('consent', 'default', {
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied',
                    analytics_storage: 'denied',
                });

                gtag('config', '${gaID}', {
                    page_path: window.location.pathname,
                });
                `,
        }}
      />
    </>
  )
}
