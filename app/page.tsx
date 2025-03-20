import { Hero } from "@/components/homepage/Hero";
import { CallToAction } from "@/components/homepage/call-to-action";
import { Faqs } from "@/components/homepage/Faqs";
import { Services } from "@/components/homepage/services";
import { WhatIDo } from "@/components/homepage/cooperation";
import { References } from "@/components/homepage/references";
import { KubernetesEverywhere } from "@/components/homepage/KubernetesEverywhere";
import { TrainingList } from "@/components/homepage/training";
import { Clients } from "@/components/homepage/clients";

import { strapi } from "@/lib/strapi/strapi";

export default async function Home() {
  const trainings = await strapi.fetchTrainings();

  return (
    <main>
      <Hero />
      <Services />
      <Clients />
      <TrainingList trainings={trainings} />
      <References />
      <WhatIDo />
      <CallToAction />
      {/* <KubernetesEverywhere /> */}
      {/* <Faqs /> */}
    </main>
  );
}
