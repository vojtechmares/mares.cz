export const LocalizedMetadata = [
  {
    locale: "cs",
    title: "Vojtěch Mareš - DevOps architekt",
    titlePrefix: "Vojtěch Mareš",
    description:
      "Vojtěch Mareš - freelance DevOps architekt, konzultant a lektor. Kubernetes, CI/CD a cloud native technologie.",
    keywords: "devops, devops achitekt, konzultant, lektor, školení, devops školení, freelancer",
  },
  {
    locale: "en",
    title: "Vojtěch Mareš - DevOps architect",
    titlePrefix: "Vojtěch Mareš",
    description:
      "Vojtěch Mareš - freelance DevOps architect, consultant, and trainer. Kubernetes, CI/CD, and cloud native technologies.",
    keywords: "devops, devops architect, consultant, lector, training, devops training, freelancer",
  },
];

/**
 * Primary navigation. `href` is the Czech (internal) path - localize it with `localizeUrl()`.
 * `match` lists path prefixes that mark the item as active.
 */
export const PrimaryNavigation = [
  { key: "nav.training", href: "/skoleni", match: ["/skoleni"] },
  { key: "nav.services", href: "/sluzby", match: ["/sluzby"] },
  { key: "nav.about", href: "/o-mne", match: ["/o-mne"] },
  { key: "nav.blog", href: "/blog", match: ["/blog", "/prednasky"] },
  { key: "nav.contact", href: "/kontakt", match: ["/kontakt"] },
] as const;

export const MeetingUrl = "https://cal.com/vojtechmares/30min";

export const Contact = {
  name: "Vojtěch Mareš",
  email: "vojtech@mares.cz",
  phone: "+420 732 490 651",
  phoneHref: "tel:+420732490651",
  companyId: "06999280",
  vatId: "CZ9709180063",
} as const;

export const SocialLinks = [
  { name: "GitHub", href: "https://github.com/vojtechmares" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/vojtech-mares/" },
  { name: "Bluesky", href: "https://bsky.app/profile/mares.cz" },
  { name: "X", href: "https://x.com/vojtechmares_" },
] as const;
