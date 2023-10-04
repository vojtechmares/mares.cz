import Image, { StaticImageData } from "next/image";
import clsx from "clsx";

import { Container } from "@/components/Container";
import { Button } from "@/components/Button";

import logoKubernetes from "@/images/logos/tools/kubernetes.svg";
import logoRancher from "@/images/logos/tools/rancher.svg";

import logoAWS from "@/images/logos/tools/amazonaws.svg";
import logoDigitalOcean from "@/images/logos/tools/digitalocean.svg";
import logoGCP from "@/images/logos/tools/googlecloud.svg";
import logoAzure from "@/images/logos/tools/microsoftazure.svg";
import logoLinode from "@/images/logos/tools/linode.svg";

import logoOpenStack from "@/images/logos/tools/openstack.svg";
import logoProxmox from "@/images/logos/tools/proxmox.svg";
import logovmware from "@/images/logos/tools/vmware.svg";

const sections = [
  {
    title: "Kubernetes",
    description: "Kubernetes je open-source platforma pro automatizaci a správu kontejnerizovaných aplikací. Je to jednotná standardizovaná platforma pro vývoj a provozování aplikací, která umožňuje rychle a efektivně nasazovat a spravovat aplikace v kontejnerech.",
    images: [
      { src: logoKubernetes, alt: "Kubernetes"},
    ],
  },
  {
    title: "Veřejný cloud",
    description: "Veřejný cloud je sdílená fyzická infrastruktura, která je spravována třetí stranou, díky tomu se nestaráte o vlastní hardware a jeho údržbu. Veřejné cloudy jsou využívány společnostmi ať pro vývoj a testování, ale i pro produkční nasazení a dodávání jejich aplikace zákazníkům, kdekoliv na celém světě.",
    images: [
      { src: logoAWS, alt: "Amazon Web Services"},
      { src: logoGCP, alt: "Google Cloud Platform"},
      { src: logoAzure, alt: "Microsoft Azure"},
    ],
  },
  {
    title: "\"Malý\" veřejný cloud",
    description: "Ne všichni hráči na cloudovém trhu jsou velké firmy. Existují i menší poskytovatelé, kteří sice nenabízí jejich rešení pro každý Váš problém, ale jen virtuální stroje, spravované Kubernetes a databáze a objektové úložiště. Což je však pro většinu aplikací naprosto dostatečné.",
    images: [
      { src: logoDigitalOcean, alt: "Digital Ocean"},
      { src: logoLinode, alt: "Linode"},
    ],
  },
  {
    title: "Vlastní infrastruktura",
    description: "Ať máte vlastní datacentrum nebo jen pár virtuálních strojů, můžete využít Kubernetes a všechny jeho výhody. Využijte vlastní infrastrukturu a vytvořte si vlastní cloud. Pokud používáte například Proxmox, OpenStack nebo VMware vSphere, můžete využít jejich API a přímo je propojit s Vašimi Kubernetes, ať jeden cluster nebo víc.",
    images: [
      { src: logoOpenStack, alt: "OpenStack"},
      { src: logoProxmox, alt: "Proxmox"},
      { src: logovmware, alt: "VMware"},
    ],
  },
  {
    title: "Hybridní řešení",
    description: "Pokud máte vlastní infrastrukturu, ale chcete využít i veřejný cloud, můžete využít například Rancher, který vám umožní propojit Vaši vlastní infrastrukturu s veřejným cloudem. Využijte výhody obou světů a vytvořte si hybridní řešení. Díky Rancheru získáte jednotnou ucelenou platformu pro všechny prostředí.",
    images: [
      { src: logoRancher, alt: "Rancher"},
    ],
  },
]

const SectionDesktop = ({title, description, images, reverse}: { title: string, description: string, images: { src: StaticImageData, alt: string }[], reverse: boolean}) => (
  <div className="grid grid-cols-2 gap-x-24 gap-y-32">
    <div>
      <h3 className="font-display text-xl font-medium">{title}</h3>
      <p className="mt-4 text-slate-700">{description}</p>
    </div>
    <div className={clsx(reverse ? "order-first" : "")}>
      <div className="flex flex-row justify-around">
        {images.map((image, index) => (
          <Image key={index} src={image.src} width={128} height={128} alt={image.alt} title={image.alt} />
        ))}
      </div>
    </div>
  </div>
)

const SectionMobile = ({title, description, images}: { title: string, description: string, images: { src: StaticImageData, alt: string }[]}) => (
  <>
    <div className="flex flex-wrap gap-x-8 justify-around overflow-hidden mb-4">
      {images.map((image, index) => (
      <Image key={index} src={image.src} width={128} height={128} alt={image.alt} title={image.alt} />
    ))}
    </div>
    <h3 className="font-display text-xl font-medium">{title}</h3>
    <p className="mt-4 text-slate-700">{description}</p>
  </>
)

const Mobile = () => (
  <div className="lg:hidden mt-10">
    {sections.map((section, index) => (
      <div key={index} className={clsx(sections.length - 1 !== index ? "mb-10" : "")}>
        <SectionMobile {...section} />
      </div>
    ))}
  </div>
)

const Desktop = () => (
  <div className="hidden lg:block mt-10 lg:mt-20">
    {sections.map((section, index) => (
      <div key={index} className={
        clsx(sections.length - 1 !== index ? "mb-32" : "")
      }>
        <SectionDesktop {...section} reverse={index % 2 === 1}/>
      </div>
    ))}
  </div>
)

export function KubernetesEverywhere() {
  return (
    <section
      id="kubernetes-kdekoliv"
      aria-label="Features for simplifying everyday business tasks"
      className="pt-20 pb-14 sm:pb-20 sm:pt-32 lg:pb-32"
    >
      <Container>
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-3xl tracking-tight text-black sm:text-4xl">
            Kubernetes, jedna platforma, kdekoliv
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700">
            Se vším Vám poradím, od veřejného cloudu přes on-premise a serverless, až po edge.
          </p>
        </div>
        <Mobile />
        <Desktop />
      </Container>
    </section>
  );
}
