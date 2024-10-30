import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import createMDX from "@next/mdx";
import rehypeHighlight from "rehype-highlight";

// highlight.js languages
// using custom list, since providing additional languages overrides the rehype-highlight default of 'common' from lowlight package
// the following list is based on the 'common' package from lowlight, with some "DevOps focused" additions
// see supported: https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
import http from "highlight.js/lib/languages/http";
import nginx from "highlight.js/lib/languages/nginx";
import dns from "highlight.js/lib/languages/dns";
import awk from "highlight.js/lib/languages/awk";
import nix from "highlight.js/lib/languages/nix";
import protobuf from "highlight.js/lib/languages/protobuf";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import csharp from "highlight.js/lib/languages/csharp";
import css from "highlight.js/lib/languages/css";
import diff from "highlight.js/lib/languages/diff";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import go from "highlight.js/lib/languages/go";
import graphql from "highlight.js/lib/languages/graphql";
import ini from "highlight.js/lib/languages/ini";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import kotlin from "highlight.js/lib/languages/kotlin";
import lua from "highlight.js/lib/languages/lua";
import makefile from "highlight.js/lib/languages/makefile";
import markdown from "highlight.js/lib/languages/markdown";
import php from "highlight.js/lib/languages/php";
import phpTemplate from "highlight.js/lib/languages/php-template";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import pythonRepl from "highlight.js/lib/languages/python-repl";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import shell from "highlight.js/lib/languages/shell";
import sql from "highlight.js/lib/languages/sql";
import swift from "highlight.js/lib/languages/swift";
import typescript from "highlight.js/lib/languages/typescript";
import wasm from "highlight.js/lib/languages/wasm";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

import type { NextConfig } from "next";

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeHighlight,
        {
          languages: {
            http,
            nginx,
            dns,
            awk,
            nix,
            protobuf,
            bash,
            c,
            cpp,
            csharp,
            css,
            diff,
            dockerfile,
            go,
            graphql,
            ini,
            java,
            javascript,
            json,
            kotlin,
            lua,
            makefile,
            markdown,
            php,
            phpTemplate,
            plaintext,
            python,
            pythonRepl,
            ruby,
            rust,
            shell,
            sql,
            swift,
            typescript,
            wasm,
            xml,
            yaml,
          },
        },
      ],
    ],
  },
});

const nextConfig: NextConfig = {
  output: "standalone",
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "/mareshq-strapi-uploads-local/**",
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

export default withMDX(nextConfig);
