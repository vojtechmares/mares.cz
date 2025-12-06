import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { unified } from "unified";

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

export async function markdownToHtml(md: string) {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypeHighlight, {
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
    })
    .use(rehypeStringify)
    .process(md);

  return result.toString();
}
