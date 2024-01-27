import { Hero } from "@/components/homepage/Hero";
import { CallToAction } from "@/components/homepage/CallToAction";
import { Faqs } from "@/components/homepage/Faqs";
import { Services } from "@/components/homepage/Services";
import { WhatIDo } from "@/components/homepage/WhatIDo";
import { Testimonials } from "@/components/homepage/Testimonials";
import { KubernetesEverywhere } from "@/components/homepage/KubernetesEverywhere";
import { TrainingList } from "@/components/homepage/Training";

const Page = () => {
  return (
    <main>
      <Hero />
      <WhatIDo />
      <TrainingList />
      <KubernetesEverywhere />
      <CallToAction />
      <Testimonials />
      <Services />
      {/* <Faqs /> */}
    </main>
  );
};

export default Page;
