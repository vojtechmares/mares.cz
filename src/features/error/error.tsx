import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Heading } from "../../components/ui/heading";
import { Text } from "../../components/ui/text";
import { t, type Locale } from "../../i18n";

type ErrorProps = {
  status: number;
  error?: string;
  locale?: Locale;
};

export function Error({ status, error = undefined, locale = "cs" }: ErrorProps) {
  const headline = status === 404 ? t(locale, "error.404_headline") : t(locale, "error.500_headline");
  const description = status === 404 ? t(locale, "error.404_description") : t(locale, "error.500_description");

  return (
    <>
      <main className="grid min-h-full place-items-center bg-neutral-900 px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <Body variant="base" color="primary" className="font-semibold text-orange-500">
            {status}
          </Body>
          <Heading level="h1" variant="inverse" className="mt-4 text-balance">
            {headline}
          </Heading>
          <Text variant="muted" className="mt-6 font-medium text-pretty">
            {description}
          </Text>
          {error !== undefined && (
            <Text variant="muted" className="mt-6 text-pretty">
              {error}
            </Text>
          )}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button href="/" variant="accent">
              {t(locale, "error.back_home")}
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
