import Link from "next/link"

const Page = () => {
  return (
    <main className="my-auto mx-8 2xl:mx-auto">
        <h1 className="font-display text-5xl font-medium tracking-tight text-black sm:text-7xl leading-10">
          Hello 👋
          <br />
          You found my OG / Twitter card image generator.
        </h1>
        <p className="mt-6 text-3xl tracking-tight text-slate-700">
          Interested in source code?{" "}
          <Link className="underline text-slate-800 hover:text-slate-900" href="https://github.com/vojtechmares/websites/tree/main/apps/og">
            [github.com/vojtechmares/websites/og]
          </Link>
        </p>
    </main>
  )
}

export default Page
