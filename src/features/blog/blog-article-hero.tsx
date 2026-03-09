import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Link } from "../../components/ui/link";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";

interface BlogArticleHeroProps {
  title: string;
  description: string;
  publishDate: Date;
  tags: string[];
  readingTimeMinutes: number;
}

export function BlogArticleHero({ title, description, publishDate, tags, readingTimeMinutes }: BlogArticleHeroProps) {
  const formattedDate = new Date(publishDate).toLocaleDateString("cs-CZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <Section variant="inverse" ariaLabel="Článek">
      <Container>
        <div className="flex flex-col gap-y-8 lg:flex-row lg:justify-between lg:gap-y-0">
          <div>
            <Heading variant="inverse" level="h1">
              {title}
            </Heading>
            <Text variant="muted" className="mt-6 max-w-xl">
              {description}
            </Text>
            <div className="mt-8">
              <Button size="medium" href="/blog" variant="accent">
                ← Zpět na blog
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-mono text-3xl font-bold text-white">{formattedDate}</span>
              <Body color="muted" className="mt-1">
                datum publikace
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-mono text-3xl font-bold text-white">
                {tags.map((tag, i) => (
                  <span key={tag}>
                    <Link href={`/blog/tag/${tag}`} className="text-white hover:text-orange-400">
                      #{tag}
                    </Link>
                    {i < tags.length - 1 && " "}
                  </span>
                ))}
              </span>
              <Body color="muted" className="mt-1">
                {tags.length === 1 ? "téma článku" : "témata článku"}
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-mono text-3xl font-bold text-white">{readingTimeMinutes} min</span>
              <Body color="muted" className="mt-1">
                doba čtení
              </Body>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
