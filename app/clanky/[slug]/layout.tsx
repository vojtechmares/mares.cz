import { Container } from "@/components/Container";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <div className="pb-14 sm:pb-20 lg:pb-32">
        <div className="prose:text-black prose prose-h1:text-4xl prose-h1:font-bold prose-h2:text-2xl prose-h2:font-medium prose-h3:text-xl prose-h3:font-medium prose-p:text-xl prose-p:text-slate-700 prose-li:my-0">
          {children}
        </div>
      </div>
    </Container>
  );
}
