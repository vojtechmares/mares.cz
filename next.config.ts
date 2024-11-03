import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    // dynamicIO: true, // "use cache" directive -- only next.js canary 2024-11-02
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
    ];
  },
};

export default nextConfig;
