import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { readdir } from "fs/promises";

async function getArticles() {
  const slugs = (
    await readdir("./content/articles", { withFileTypes: true })
  ).filter((dirent) => !dirent.isDirectory());

  let articles = await Promise.all(
    slugs.map(async (dirent) => {
      const { meta } = await import(`@/content/articles/${dirent.name}`);
      return { slug: dirent.name.replace(/\.mdx$/, ""), ...meta };
    }),
  );

  // remove articles that are not published yet
  articles = articles.filter(
    (article) => new Date() >= new Date(article.publishDate),
  );

  articles.sort((a, b) => +new Date(b.publishDate) - +new Date(a.publishDate));

  return articles;
}

export default async function Articles() {
  const articles = await getArticles();

  return (
    <Container className="pb-14 sm:pb-20 lg:pb-32">
      <h2 className="font-display mb-8 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
        Články
      </h2>
      <div className="max-w-prose">
        {articles.map((article) => (
          <div key={article.slug}>
            <h3 className="font-display mb-8 mt-16 text-3xl font-bold tracking-tight">
              {article.title}
            </h3>
            <p className="my-4 text-xl text-slate-700">
              {new Date(article.publishDate).toLocaleDateString("cs-CZ", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="my-4 text-xl text-slate-700">{article.description}</p>
            {/* <Link className="my-4 text-xl text-slate-700 underline" href={"/clanky/" + article.slug}>Přečíst si článek</Link> */}
            <Button href={"/clanky/" + article.slug} color="black">
              Přečíst si článek
            </Button>
          </div>
        ))}
      </div>
    </Container>
  );
}
