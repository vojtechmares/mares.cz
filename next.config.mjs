import remarkGfm from "remark-gfm";
import remarkSlug from "remark-slug";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkSlug],
    rehypePlugins: [],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    reactCompiler: true,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default withMDX(nextConfig);
