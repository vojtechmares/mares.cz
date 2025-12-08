declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (
      command: "consent",
      action: "default" | "update",
      params: {
        ad_storage?: "granted" | "denied";
        ad_user_data?: "granted" | "denied";
        ad_personalization?: "granted" | "denied";
        analytics_storage?: "granted" | "denied";
      },
    ) => void;
  }

  function gtag(
    command: "consent",
    action: "default" | "update",
    params: {
      ad_storage?: "granted" | "denied";
      ad_user_data?: "granted" | "denied";
      ad_personalization?: "granted" | "denied";
      analytics_storage?: "granted" | "denied";
    },
  ): void;
}

export {};
