import { Container } from "@/components/Container";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Přednášky | Vojtěch Mareš - DevOps konzultant, lektor",
  description:
    "Kde jsem přednášel o DevOps, automatizaci, vývoji softwaru a infrastruktuře",
  alternates: {
    canonical: "/prednasky",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <div className="pb-14 sm:pb-20 lg:pb-32">
        <div className="prose:text-black prose-h1:font-display prose-h2:font-display prose-h3:font-display prose md:prose-lg lg:prose-xl prose-h1:text-3xl prose-h1:font-extrabold prose-h1:tracking-tight prose-h2:my-8 prose-h2:text-2xl prose-h2:font-bold prose-h2:tracking-tight prose-h3:text-xl prose-h3:font-medium prose-p:my-4 prose-p:text-slate-700 prose-li:my-0 prose-h1:sm:text-4xl prose-h2:sm:text-3xl prose-h1:md:text-5xl">
          {children}
        </div>
      </div>
    </Container>
  );
}
