import { Hero } from "@/components/homepage/Hero";
import { CallToAction } from "@/components/homepage/CallToAction";
import { Faqs } from "@/components/homepage/Faqs";
import { Services } from "@/components/homepage/Services";
import { WhatIDo } from "@/components/homepage/WhatIDo";
import { Testimonials } from "@/components/homepage/Testimonials";
import { KubernetesEverywhere } from "@/components/homepage/KubernetesEverywhere";
import { TrainingList } from "@/components/homepage/Training";

import { strapi } from "@/lib/strapi/strapi";

export default async function Home() {
  const trainings = await strapi.fetchTrainings();

  return (
    <main>
      <Hero />
      <WhatIDo />
      <TrainingList trainings={trainings} />
      <KubernetesEverywhere />
      <CallToAction />
      <Testimonials />
      <Services />
      {/* <Faqs /> */}
    </main>
  );
}
