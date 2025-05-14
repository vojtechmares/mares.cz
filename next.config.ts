import type {NextConfig} from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    // dynamicIO: true, // "use cache" directive -- only next.js canary 2024-11-02
  },
  outputFileTracingIncludes: {
    // /blog/kubecon-2025-prvni-den/opengraph-image/kubecon-2025-prvni-den
    "/blog/\\[slug\\]/opengraph-image": [
      "./public/images/people/vojtech-mares.png",
    ],
    // /prednasky/opengraph-image/prednasky
    "/\\[slug\\]/opengraph-image": ["./public/images/people/vojtech-mares.png"],
    "/opengraph-image": ["./public/images/people/vojtech-mares.png"],
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mareshq-strapi-uploads-live.s3.eu-central-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/clanky",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/clanky/:slug",
        destination: "/blog/:slug",
        permanent: true,
      },
    ]
  },
}

export default nextConfig
