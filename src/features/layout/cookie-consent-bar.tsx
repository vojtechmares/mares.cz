import { actions } from "astro:actions";
import { useState } from "react";

import { Button } from "../../components/ui/button";
import { t, type Locale } from "../../i18n";

export function CookieConsentBar({ locale }: { locale: Locale }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleConsent = async (consent: "accept" | "deny") => {
    try {
      // Call the Astro action to set the cookie
      const { error } = await actions.setCookieConsent({ consent });

      if (!error) {
        // Grant Google Analytics consent if accepted
        if (consent === "accept" && typeof gtag !== "undefined") {
          gtag("consent", "update", {
            ad_storage: "granted",
            ad_user_data: "granted",
            ad_personalization: "granted",
            analytics_storage: "granted",
          });
        }

        // Hide the consent bar
        setIsVisible(false);
      } else {
        console.error("Failed to save cookie consent:", error);
      }
    } catch (error) {
      console.error("Failed to save cookie consent:", error);
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-100 flex flex-col justify-between gap-x-8 gap-y-4 bg-white px-6 py-1 ring-1 ring-zinc-900/10 md:flex-row md:items-center lg:px-8">
      <p className="max-w-8xl text-sm/6 text-zinc-700">
        {t(locale, "cookie.text")}{" "}
        <a href="/zasady-pouzivani-cookies" className="font-semibold text-zinc-900 underline">
          {t(locale, "cookie.policy_link")}
        </a>
        .
      </p>
      <div className="flex flex-none items-center gap-x-5">
        <Button style="solid" variant="primary" className="cursor-pointer" onClick={() => handleConsent("accept")}>
          {t(locale, "cookie.accept")}
        </Button>
        <Button style="outline" variant="primary" className="cursor-pointer" onClick={() => handleConsent("deny")}>
          {t(locale, "cookie.deny")}
        </Button>
      </div>
    </div>
  );
}
