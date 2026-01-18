import { Button } from "../../components/ui/button";

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
      {/*
        This example requires updating your template:

        ```
        <html class="h-full">
        <body class="h-full">
        ```
      */}
      <main className="grid min-h-full place-items-center bg-zinc-900 px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-amber-500">{status}</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">
            {messages.headline}
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-zinc-300 sm:text-xl/8">{messages.description}</p>
          {error !== undefined && <p className="mt-6 text-base text-pretty text-zinc-300">{error}</p>}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button href="/" variant="accent">
              Zpět na hlavní stránku
            </Button>
            {/* <a
              href="#"
              className="text-sm font-semibold text-gray-900 dark:text-white"
            >
              Contact support <span aria-hidden="true">&rarr;</span>
            </a> */}
          </div>
        </div>
      </main>
    </>
  );
}
