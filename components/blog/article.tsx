import { markdownToHtml } from "@/lib/markdown-to-html";
import type { Article } from "@/lib/strapi/types/article";

export async function Article({ article }: { article: Article }) {
  const content = await markdownToHtml(article.text);

  return (
    <article className="px-4 md:px-0 prose:text-black prose-h1:font-display prose-h2:font-display prose-h3:font-display prose mx-auto pb-14 md:prose-lg lg:prose-xl prose-h1:text-3xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h3:text-xl prose-h3:font-medium prose-p:text-slate-700 prose-pre:text-xl prose-pre:leading-none prose-ol:ps-5 prose-ul:ps-5 prose-li:my-0 prose-img:mx-auto prose-img:max-h-[20rem] prose-img:rounded-2xl sm:pb-20 sm:prose-h1:text-4xl sm:prose-h2:text-3xl md:prose-h1:text-5xl md:prose-ol:ps-6 md:prose-ul:ps-6 md:prose-img:max-h-[30rem] lg:pb-32 lg:prose-img:max-h-[38rem]">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
