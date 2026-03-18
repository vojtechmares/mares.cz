---
title: Proč Kubernetes?
description: V tomhle článku píšu o tom, proč je Kubernetes tak rozšířené, a proč tu s námi bude ještě dlouho.
keywords: ["kubernetes", "infrastructure", "containers", "docker", "devops", "cloud"]
tags: ["kubernetes"]
trainingAd: kubernetes
draft: false
publish_time: 2024-08-26
redirectFrom: ["why-kubernetes"]
alternate: "why-kubernetes"
---

Letos v červnu oslavilo Kubernetes deset let 🎂. Za tu dobu se projektu dostalo obrovské popularity a
rozšířily se úplně všude (od datacenter, přes edge až po AI vč. "homelab") a kolem Kubernetes vznikl obrovský
ekosystém, hlavně díky CNCF ([Cloud Native Computing Foundation](https://www.cncf.io/)).

## Co je to Kubernetes?

Kubernetes je nejrozšířenější orchestrátor kontejnerů. Tedy nástroj, kterému řeknete: "tady máš kontejner, nějakou konfiguraci a spusť jej 5x".
A Kubernetes se postará, aby všechny kontejnery (v Kubernetes názvosloví _Pody_) běžely a v případě chyby je restartoval.

To je hodně ve zkratce. Kubernetes toho umí mnohem více, například automatické škálování aplikací, ale i clusteru jako takového.
A s pomocí ekosystému monitoring aplikací a sebe sama, logování, zálohy, bezpečnost aplikací a dat, CI/CD a mnoho dalšího.

### Trochu (víc) historie

Původní koncept Kubernetes (alespoň jeho předchůdce) vznikl v Googlu pod názvem **Borg** v roce **2003** (wow, 21 let 🤯!).

Borg byl interní nástroj, který spouštěl tisíce jobů (_Job_ byl všechno, od klasického jobu, ale i třeba HTTP server) ve velikých clusterech v mnoha datacentrech.

**2013**: vznikl nový systém, **Omega**, který nahradil Borg. Omega zvládá větší clustery, více jobů a zároveň je flexibilnější.

**2014**: Google oznámil nový projekt **Kubernetes**, který je open-source verzí Borgu. 7. června se objevuje [první commit](https://github.com/kubernetes/kubernetes/commit/2c4b3a562ce34cddc3f8218a2c4d11c7310e6d56) a 10. června se Microsoft, RedHat, IBM a Docker přidávají do [Kubernetes komunity](https://cloudplatform.googleblog.com/2014/07/welcome-microsoft-redhat-ibm-docker-and-more-to-the-kubernetes-community.html).

**2015**: Kubernetes vychází ve verzi v1.0 a Google ve spolupráci s [Linux Foundation](https://www.linuxfoundation.org/) zakládá [CNCF](https://www.cncf.io/).
Cílem CNCF je stavět stabilní ekosystém nejen kolem Kubernetes, ale kolem orchestrace kontejnerů jako takových a s tím spojeného světa mikroslužeb. Na podzim vychází Kubernetes v1.1.

**2016**: První release [Helmu](https://helm.sh/), což je package manager pro Kubernetes. Úplně první KubeCon, v Evropě. V průběhu roku vychází další verze, v1.2, v1.3, v1.4 a v1.5.
Vzniká projekt [Minikube](https://minikube.sigs.k8s.io/), který umožňuje spustit Kubernetes lokálně na Vašem počítači.
Vychází velká případová studie o [Pokémon GO!](https://cloud.google.com/blog/products/containers-kubernetes/bringing-pokemon-go-to-life-on-google-cloud), "Pokémon GO byl úplně největší deployment na Google Container Engine".

**2017**: Vychází další nové verze: v1.6, v1.7, v1.8 a v1.9.
Přidávají se další firmy do CNCF. GitHub oznámil, že [přechází na Kubernetes](https://github.blog/engineering/kubernetes-at-github/).
Amazaon představuje [Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/). A Microsoft představil preview verzi [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/).

**2018**: Vychází verze: v1.10, v1.11, v1.12 a v1.13. Vzniká projekt [KubeFlow](https://www.kubeflow.org/), což je projekt pro strojové učení na Kubernetes.
EKS a AKS jsou stabilní a production-ready.
[DigitalOcean "skáče na vlak Kubernetes"](https://thenewstack.io/digitalocean-dives-into-kubernetes/) a buduje Kubernetes jako službu.

**2019**: Vychází verze: v1.14, v1.15, v1.16 a v1.17.

**2020**: Vychází verze: v1.18, v1.19 a v1.20.

**2021**: Vychází verze: v1.21, v1.22, v1.23. Kubernetes projekt oficiálně zpomaluje na vydání tří verzí za rok a podpora jednotlivých verzí se protahuje na 1 rok, místo předchozích 9 měsíců.

**2022**: Vychází verze: v1.24, v1.25 a v1.26.

**2023**: Vychází verze: v1.27, v1.28 a v1.29. [Gateway API](https://gateway-api.sigs.k8s.io/) vychází ve stabilní verzi v1.0, Gateway API je nástupce Ingressu, který je "zamrazené" a nové funkcionality přichází právě do Gateway API.

**2024**: Vychází verze v1.30, v1.31 a koncem roku by měla vyjít verze v1.32.

## Kubernetes dnes

Za těch deset let se Kubernetes dostal do všech koutů softwaru a firem všech velikostí. Zároveň běží v obrovských datacenter, přes edge lokaliy až po homelaby. A běží na něm webové servery, datová analýza, AI a kdo ví, co ještě. Od obrovského Googlu, přes střední firmy až po startupy.

Kubernetes se stalo dnes prakticky standardem pro provozování kontejnerizovaných aplikací. Jednak CNCF dělá kolem Kubernetes obrovský marketing a jako nezisková organizace má obrat $150M ročně, což je naprosto šílené.
Díky CNCF, vznikl kolem Kubernetes a celého "cloud-native" světa obrovský ekosystém. Monitoring, logy, storage, zálohy, databáze, networking, bezpečnost, CI/CD, GitOps, správa clusterů, API Gateway a mnoho dalšího.

Pokud vás zajímá co vše se dá najít v ekosystému, podívejte se na [CNCF Landscape](https://landscape.cncf.io/).

## Proč Kubernetes?

Zpátky k původní otázce: "Proč Kubernetes?". Za dobu co s Kubernetes pracuji, jsem řešil implementaci Kubernetes v mnoha firmách.
Vidím růst ten obrovský ekosystém a byl jsem na několika evropských KubeConech (aktuálně jsou 3 za rok, Evropský, Asijský a Severoamerický).

Ale hlavně, Kubernetes je tady deset let, je to obrovský projekt u kterého mám jistotu, že tady minimálně dalších deset let bude (počítám spíš 20-30 let).
Je stabilní, jednak provoz clusteru jako takového, Kubernetes API se mění pomalu a včechny změny jsou komunikovány předem a při odstraňování API je dost času zmigrovat na nové API.
Ale i projekt jako takový je stabilní, má dost financí, obrovskou komunitu, nové verze vychází pravidelně. Ale hlavně, je kolem obrovský ekosystém, občas je na výběr až moc 😅.
A díky tomu jak je Kubernetes obrovské, není problém ani hledat lidi a to i v České republice. Nehledáte náhodou někoho 🤔? Napište mi na vojtech@mares.cz.

Pokud máte více aplikací nebo rostete nebo hledáte stabilní platformu nebo se nechcete zamknout u nějakého postkytovatele (vendor lock-in), Kubernetes je nejlepší volba. Nebo pokud hledáte platformu,
na které dodávat enterprise aplikace k Vašim zákazníkům a už máte plné zuby instalací na Windows. Zkuste posunout Vaše zákazníky na Kubernetes. Budete mít jednotnou platformu všude.

Přesně poslední případ (enterprise) jsem měl možnost v posledních dvou letech řešit hned dvakrát a pokaždé jsme skončili u toho, že prostě chceme Kubernetes. Je jedno, jestli on-premise nebo cloud,
zvládneme i instalaci a správu Kubernetes na infrastruktuře zákazníka. Ale pro aplikaci je to prostě obrovská výhra. Obecně, ušetří to spoustu času a peněz.
Dá se využít Kubernetes distribucí které se velmi snadno instalují jako [k0s](https://k0sproject.io/) a [k3s](https://k3s.io/), popř. [RKE2](https://docs.rke2.io/) které splňuje řadu bezpečnostních standardů.

S pár skripty nebo třeba s [Ansible](https://www.ansible.com/), se dá cluster postavit za pár minut a může se rovnou nasazovat aplikace. A řešit potřeby na míru zákazníka a ne týdny řešit konfiguraci serverů.

## Rozšiřitelnost

I když Kubernetes umí spoustu věcí, nemůže umět všechno a ne každý potřebuje všechno. Spousta funkcionalit se dá dodat skrz nějakou aplikaci z ekosystému, ne vždy je ale zdarma, a nebo to prostě neexistuje.

Pokud potřebujete něco specifického pro vás, můžete využít rozšiřitelnosti v Kubernetes a celkem snadno si napsat vlastní operator, kterým si snadno rozšíříte možnosti Vašeho clusteru
a zaintegrujete jej do Vaší infrastruktury na míru. A díky [KubeBuilderu](https://book.kubebuilder.io/) (nástroj pro psaní operatorů) je to snadné a nemusíte vymýšlet kolo.

## Kubernetes není pro každého

I když Kubernetes je super projekt a dokážete s ním prakticky všechno, myslím si, že není vhodné pro každého. Lépe řečeno není vhodné pro každý projekt.

Pokud jste třeba startup a nepotřebujete nic složitého (co se infrastruktury týče) nebo si prostě vystačíte s jedním, dvěma servery, Kubernetes vás akorát zpomalí a celkem se i prodraží.
Svět kolem Kubernetes je komplikovaný, komplexní a pravděpodobně skončíte u toho, že potřebujete někoho, kdo se v tom vyzná a bude to spravovat za vás. A protože to je celkem specifická
znalost, tak to nebude levné.

Spousta projektů si totiž opravdu vystačí s jedním serverem na velmi dlouhou dobu. A pokud potřebujete škálovat, tak stačí kolikrát jen zvednou počet jader procesoru a přidat paměť.

Až když toho bude moc nebo budete muset garantovat dostupnost (SLA) apod., stojí za to přemýšlet o Kubernetes.

Aneb: když máte blog na WordPressu s návštěvností 10 lidí za měsíc, tak fakt Kubernetes nepotřebujete. Ale když máte e-shop s návštěvností 1000 lidí za den, tak pořád ne,
při návštěvnosti 10 000 lidí za den to stojí za zvážení s ohledem na růst do budoucna a při 100 000 lidech za den to potřeba pravděpodobně bude a zároveň můžete z těžit s mnoha jeho fukcí,
které by bylo neskutečně nákladné dělat vlastní. Kubernetes nejsou samospásné a dokáží pěkně potrápit nebo prodražit.
