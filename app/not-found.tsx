import Link from "next/link";

import { Container } from "@/components/Container";

export default function NotFound() {
  return (
    <Container className="mb-8 mt-16">
      <h2 className="mb-8 text-5xl font-medium">Jejda.</h2>
      <p>Je mi líto, ale tady nic není.</p>
      <div className="my-8">
        <h3 className="text-3xl font-bold">chyba 404</h3>
        <p className="text-slate-600">Stránka kterou hledáte neexistuje.</p>
      </div>
      <Link href="/" className="underline">
        Vrátit se na hlavní stránku
      </Link>
    </Container>
  );
}
