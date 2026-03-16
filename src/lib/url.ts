export function canonicalUrl(astroUrl: URL, astroSite: URL | undefined): URL {
  const site = astroSite ?? new URL("https://www.mares.cz");
  return new URL(astroUrl.pathname, site);
}
