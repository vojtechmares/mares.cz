import { Body } from "../../components/ui/body";
import { Button } from "../../components/ui/button";
import { Heading } from "../../components/ui/heading";
import { Text } from "../../components/ui/text";

type ErrorProps = {
  status: number;
  error?: string;
};

export function Error({ status, error = undefined }: ErrorProps) {
  const errorMessages = {
    "404": {
      headline: "Page Not Found",
      description: "Je mi líto, ale stránka kterou hledáte, tady není.",
    },
    "500": {
      headline: "Internal Server Error",
      description: "Hups, něco se rozbilo. Na serveru došlo k neočekávané chybě.",
    },
  };

  let messages = errorMessages["500"];

  if (status === 404) {
    messages = errorMessages["404"];
  }

  return (
    <>
      <main className="grid min-h-full place-items-center bg-zinc-900 px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <Body variant="base" color="primary" className="font-semibold text-orange-500">
            {status}
          </Body>
          <Heading level="h1" variant="inverse" className="mt-4 text-balance">
            {messages.headline}
          </Heading>
          <Text variant="muted" className="mt-6 font-medium text-pretty">
            {messages.description}
          </Text>
          {error !== undefined && (
            <Text variant="muted" className="mt-6 text-pretty">
              {error}
            </Text>
          )}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button href="/" variant="accent">
              Zpět na hlavní stránku
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
