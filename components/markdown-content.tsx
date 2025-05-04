import { markdownToHtml } from "@/lib/markdown-to-html"
import clsx from "clsx"

export async function MarkdownContent({
  content,
  classNames,
}: {
  content: string
  classNames?: string
}) {
  const html = await markdownToHtml(content)

  // className="prose:text-black prose-h1:font-display prose-h2:font-display prose-h3:font-display prose md:prose-lg lg:prose-xl prose-h1:text-3xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h2:mb-0 prose-h2:mt-10 prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h3:text-xl prose-h3:font-medium prose-p:my-4 prose-p:text-slate-700 prose-li:my-0 sm:prose-h1:text-4xl sm:prose-h2:text-3xl md:prose-h1:text-5xl"

  return (
    <div
      className={clsx(
        "prose:text-black prose-h1:font-display prose-h2:font-display prose-h3:font-display prose md:prose-lg lg:prose-xl prose-h1:text-4xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h3:text-xl prose-h3:font-medium prose-p:text-slate-700 prose-pre:text-xl prose-pre:leading-none prose-ol:ps-5 prose-ul:ps-5 prose-li:my-0 prose-img:mx-auto prose-img:max-h-[20rem] prose-img:rounded-2xl sm:prose-h2:text-3xl md:prose-h1:text-5xl md:prose-ol:ps-6 md:prose-ul:ps-6 md:prose-img:max-h-[30rem] lg:prose-img:max-h-[38rem] mx-auto px-4 pb-14 sm:pb-20 md:px-0 lg:pb-32",
        classNames,
      )}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
