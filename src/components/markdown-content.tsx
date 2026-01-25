import { markdownToHtml } from "../lib/markdown-to-html";
import { Prose } from "./prose";

export async function MarkdownContent({ content, className }: { content: string; className?: string }) {
  const html = await markdownToHtml(content);
  return (
    <Prose className={className}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </Prose>
  );
}
