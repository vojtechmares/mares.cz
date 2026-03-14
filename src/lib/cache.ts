export const CachePresets = {
  content: "public, s-maxage=3600, stale-while-revalidate=86400", // 1h edge, 24h stale
  archive: "public, s-maxage=1800, stale-while-revalidate=3600", // 30min edge, 1h stale
  training: "public, s-maxage=300, stale-while-revalidate=600", // 5min edge (dynamic sessions)
  ogImage: "public, s-maxage=86400, stale-while-revalidate=86400", // 24h edge, 24h stale
} as const;
