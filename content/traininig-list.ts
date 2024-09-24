import { StaticImageData } from "next/image";

import logoKubernetes from "@/images/logos/tools/kubernetes.svg";
import logoTerraform from "@/images/logos/tools/terraform.svg";
import logoArgo from "@/images/logos/tools/argo.svg";
import logoGit from "@/images/logos/tools/git.svg";
import logoPostgres from "@/images/logos/tools/postgresql.svg";
import logoDocker from "@/images/logos/tools/docker.svg";

export type TrainingType = {
  name: string;
  logo: {
    src: StaticImageData;
    alt: string;
  };
  price: {
    public: number;
    corporate: number;
  };
  href: string;
  slug?: string;
  days?: number;
  adText?: string;
};

export const trainingMap: Record<string, TrainingType> = {};

export const trainingList: TrainingType[] = [
  {
    name: "Kubernetes",
    href: "/skoleni/kubernetes",
    slug: "kubernetes",
    logo: {
      src: logoKubernetes,
      alt: "Kubernetes logo",
    },
    price: { public: 9900, corporate: 44000 },
    days: 2,
    adText:
      "Zajímá Vás Kubernetes a chcete se dozvědět víc? Jak pracovat s Kubernetes, jak spravovat cluster, jak nasadit aplikaci do Kubernetes atd.? Pak přijďte na moje školení o Kubernetes. Školení probíhá formou workshopu, kde si všechno vyzkoušíte na vlastní kůži. Přihlaste se buď na veřejný termín nebo mě kontaktujte ohledně firemního školení.",
  },
  {
    name: "Terraform",
    href: "/skoleni/terraform",
    slug: "terraform",
    logo: {
      src: logoTerraform,
      alt: "Terraform logo",
    },
    price: { public: 5900, corporate: 24000 },
    adText:
      "Pokud Vás zajímá Terraform více do hloubky a chtěli byste se s ním naučit víc nebo chcete aby Váš tým začal Terraform používat, přijďte na moje školení Terraformu. Školení probíhá formou workshopu, kde si práci s Terraformem všichni sami vyzkouší. Buď přijďte na veřejný termín nebo se domluvme na firemním školení.",
  },
  {
    name: "ArgoCD",
    href: "/skoleni/argocd",
    slug: "argocd",
    logo: {
      src: logoArgo,
      alt: "ArgoCD logo",
    },
    price: { public: 5900, corporate: 24000 },
    adText:
      "Už vás nebaví do nekonečna psát CI/CD pipeliny a nasazovat každou aplikaci do Kubernetes skrz pipeline? Vyzkoušejte GitOps přístup s ArgoCD: všechny informace o nasazených aplikacích jsou přehledně verzované v Git repozitáři. A zároveň to slouží i jako záloha, kdyby vám Kubernetes cluster spadnul... Přijďte na veřejný termín školení nebo se domluvme na firemním školení.",
  },
  {
    name: "Git",
    href: "/skoleni/git",
    slug: "git",
    logo: {
      src: logoGit,
      alt: "Git logo",
    },
    price: { public: 5900, corporate: 24000 },
  },
  {
    name: "Postgres na Kubernetes",
    href: "/skoleni/postgres-on-k8s",
    slug: "postgres-on-k8s",
    logo: {
      src: logoPostgres,
      alt: "PostgreSQL logo",
    },
    price: { public: 5900, corporate: 24000 },
  },
  {
    name: "Docker",
    href: "/skoleni/docker",
    slug: "docker",
    logo: {
      src: logoDocker,
      alt: "Docker logo",
    },
    price: { public: 9900, corporate: 44000 },
    days: 2,
    adText:
      "Chcete provozovat Vaše aplikace v kontejnerech a přestat řešit, že na serveru je třeba aktualizovat knohovnu XY nebo verzi runtimu? Začněte používat Docker. Přijďte na školení o Dockeru a nakopněte Váš vývoj kupředu. Přihlaste se buď na veřejný termín nebo mě kontaktujte ohledně firemního školení.",
  },
];
