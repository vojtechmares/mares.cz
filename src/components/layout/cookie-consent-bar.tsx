import { useState } from "react";
import { actions } from "astro:actions";
import { Button } from "../ui/button";

export function CookieConsentBar() {
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
    <div className="fixed inset-x-0 bottom-0 z-100 flex flex-col justify-between gap-x-8 gap-y-4 bg-white p-6 ring-1 ring-zinc-900/10 md:flex-row md:items-center lg:px-8">
      <p className="max-w-8xl text-sm/6 text-zinc-700">
        Tento web používá soubory cookies k analýze návštěvnosti pomocí služby
        Google Analytics. Díky nim můžu zlepšovat svoje stránky na základě
        anonymních statistik. Více informací najdete v{" "}
        <a
          href="/zasady-pouzivani-cookies"
          className="font-semibold text-zinc-900 underline"
        >
          zásadách používání cookies
        </a>
        .
      </p>
      <div className="flex flex-none items-center gap-x-5">
        <Button
          variant="solid"
          color="black"
          className="cursor-pointer"
          onClick={() => handleConsent("accept")}
        >
          Přijmout vše
        </Button>
        <Button
          variant="outline"
          color="black"
          className="cursor-pointer"
          onClick={() => handleConsent("deny")}
        >
          Odmítnout vše
        </Button>
      </div>
    </div>
  );
}
