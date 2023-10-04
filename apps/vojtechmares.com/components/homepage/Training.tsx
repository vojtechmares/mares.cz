import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import { Container } from "@/components/Container";

import logoKubernetes from "@/images/logos/tools/kubernetes.svg";
import logoTerraform from "@/images/logos/tools/terraform.svg";
import logoArgo from "@/images/logos/tools/argo.svg";
import logoGit from "@/images/logos/tools/git.svg";

type TrainingType = {
  name: string;
  logo: StaticImageData;
  href: string;
};

const trainingList: TrainingType[] = [
  { name: 'Kubernetes', href: '/skoleni/kubernetes', logo: logoKubernetes },
  { name: 'Terraform', href: '/skoleni/terraform', logo: logoTerraform },
  { name: 'ArgoCD', href: '/skoleni/argocd', logo: logoArgo },
  { name: 'Git', href: '/skoleni/git', logo: logoGit },
];

type TrainingProps = {
  training: TrainingType;
  className?: string;
};

const Training = ({ training, className }: TrainingProps) => {
  return (
    <Link href={training.href} className={className}>
      <Image
        src={training.logo}
        className="rounded-lg p-2 invert mx-auto"
        width="128"
        height="128"
        alt={training.name}
      />
      <h3 className="mt-4 text-lg font-medium text-amber-500 text-center">{training.name}</h3>
    </Link>
  );
};

const TrainingGridMobile = () => {
  return (
    <div className="-mx-4 mt-20 grid grid-cols-2 gap-x-8 gap-y-4 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {trainingList.map((training) => (
        <div key={training.name} >
          <Training training={training} />
        </div>
      ))}
    </div>
  );
};

const TrainingGridDesktop = () => {
  return (
    <div className="hidden lg:mt-20 lg:block">
      <div className="grid grid-cols-4 gap-x-8 gap-y-4">
        {trainingList.map((training) => (
          <div key={training.name} className="relative py-4 cursor-pointer rounded-3xl transition ease-in-out duration-300 md:hover:-translate-y-1 md:hover:scale-110 md:ring-1 md:hover:ring-slate-700 md:ring-transparent">
            <Training training={training} />
          </div>
        ))}
      </div>
    </div>
  );
};

const TrainingList = () => {
  return (
    <section
      id="skoleni"
      aria-label="Training"
      className="pt-20 pb-14 sm:pb-20 sm:pt-32 lg:pb-32 bg-black"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Moje školení
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-400">
            Od veřejného cloudu přes on-premise až po serverless, se vším vám
            poradím.
          </p>
        </div>
        <TrainingGridMobile />
        <TrainingGridDesktop />
      </Container>
    </section>
  );
};

export { TrainingList };
