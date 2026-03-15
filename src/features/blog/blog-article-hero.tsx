import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Container } from "../../components/ui/container";
import { Heading } from "../../components/ui/heading";
import { Link } from "../../components/ui/link";
import { Section } from "../../components/ui/section";
import { Text } from "../../components/ui/text";
import { t, type Locale } from "../../i18n";
import { formatDate } from "../../i18n/formatting";
import { localizeUrl } from "../../i18n/routes";

interface BlogArticleHeroProps {
  title: string;
  description: string;
  publishDate: Date;
  tags: string[];
  readingTimeMinutes: number;
  locale: Locale;
}

export function BlogArticleHero({
  title,
  description,
  publishDate,
  tags,
  readingTimeMinutes,
  locale,
}: BlogArticleHeroProps) {
  const formattedDate = formatDate(publishDate, locale);

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
              <Button size="medium" href={localizeUrl("/blog", locale)} variant="accent">
                {t(locale, "blog.back_to_blog")}
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">{formattedDate}</span>
              <Body color="muted" className="mt-1">
                {t(locale, "blog.publish_date")}
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">
                {tags.map((tag, i) => (
                  <span key={tag}>
                    <Link href={localizeUrl(`/blog/tag/${tag}`, locale)} className="text-white hover:text-orange-400">
                      #{tag}
                    </Link>
                    {i < tags.length - 1 && " "}
                  </span>
                ))}
              </span>
              <Body color="muted" className="mt-1">
                {tags.length === 1 ? t(locale, "blog.topic_singular") : t(locale, "blog.topic_plural")}
              </Body>
            </div>
            <div className="border-l-2 border-orange-500 pl-6">
              <span className="font-sans text-3xl font-bold text-white">{readingTimeMinutes} min</span>
              <Body color="muted" className="mt-1">
                {t(locale, "blog.reading_time")}
              </Body>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
