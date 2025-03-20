import Image, { StaticImageData } from "next/image";

import logoGLAMI from "@/public/images/logos/glami.svg";
import logoFakturoid from "@/public/images/logos/fakturoid.svg";
import logoCybroslabs from "@/public/images/logos/cybroslabs-black.jpeg";

type Client = {
  name: string;
  logo: StaticImageData;
};

const clients: Client[] = [
  { name: "GLAMI", logo: logoGLAMI },
  { name: "Fakturoid", logo: logoFakturoid },
  { name: "Cybros Labs", logo: logoCybroslabs },
];

function Clients() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="font-display text-3xl font-bold tracking-tight text-black sm:text-4xl md:text-center">
          {" "}
          {/* text-center text-lg/8 font-semibold text-gray-900 */}
          Moji klienti
        </h2>
        <p className="mt-4 text-lg tracking-tight text-slate-400 md:text-center">
          Společnosti, které mi důvěřují a se kterými jsem měl tu čest
          spolupracovat.
        </p>
        <div className="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">
          {clients.map((client) => (
            <Image
              key={client.name}
              alt={client.name}
              src={client.logo.src}
              width={client.logo.width} // 158
              height={client.logo.height} // 48
              className="w-full object-contain" // w-full object-contain // col-span-2 max-h-12 w-full object-contain lg:col-span-1
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export { Clients };
