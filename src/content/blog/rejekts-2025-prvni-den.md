---
title: Rejekts 2025 v Londýně – první den
description: Jaký byl první den (neděle) na Cloud Native Rejecks 2025 v Londýně? Co jsou Rejekts? A co jsem se dozvěděl?
keywords: ["cncf rejekts", "rejekts", "kubecon", "2025", "london", "rejektsio"]
tags: ["konference"]
draft: false
publish_time: 2025-03-31
redirectFrom: ["rejeckts-2025-prvni-den"]
---

Jsem v Londýně na šestidenním "maratonu" konferencí: Cloud Native Rejekts (30.–31. 3.), KubeCon co-located events (1. 4.) a KubeCon samotný (2.–4. 4.). Rejekts jsou první – a já mám za sebou první den. Jaký byl?

## Co jsou Cloud Native Rejekts

Rejekts je malá dvoudenní konference pro přednášky, které se nedostaly na KubeCon.

Jejich vlastními slovy:

> Cloud Native Rejekts is the b-side conference giving a second chance to the many wonderful, but rejected talks leading to KubeCon + CloudNativeCon.

Rejekts jsou díky sponzorům zdarma a konají se na zajímavém místě, ale s velmi omezenou kapacitou – je tedy těžké se sem dostat. Sám jsem se dostal až z čekací listiny přetlaku.

![Vojta Mareš na Rejekts](https://cdn.mares.cz/80_EE_95_FB_007_E_44_C0_A6_FD_609_C35_A90_FCE_7a9bf1f1a5.PNG)

_Ano, také se přidávám k trendu ChatGPT a obrázků předělaných do stylu studia Ghibli._

### Co mají společného Rejekts a KubeCon

Jak jsem psal výše – Rejekts jsou přednášky, se kterými se lidé hlásili na KubeCon (a CloudNativeCon), ale nedostali se. Jejich druhou šancí, jak přednášet, se tedy stává Rejekts.

## Co zajímavého jsem se dozvěděl

V neděli jsem byl na osmi přednáškách. Tady vypíchnu to nejzajímavější, s čím jsem se potkal.

### Immutable Turtles All the Way Down – Image-Based Kubernetes to Power In-Place Updates

Asi nejlepší přednáška, na které jsem v neděli byl!

Přednášel Thilo Fromm.

Jak využít Flatcar Linux a systemd extensions pro aktualizace komponent.

Nejdřív malé představení Flatcar Linuxu:

> A community Linux distribution designed for container workloads, with high security and low maintenance.

PS: Flatcar je aktuálně v procesu onboardingu pod CNCF.

Flatcar využívá systemd, aby spravoval běžící procesy v rámci systému, které nastavíte pomocí _ignition_ souboru.

Díky [systemd-sysext](https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html) je možné automatizovat jejich aktualizace – nová verze se stáhne jako filesystem image, který se následně připojí k disku, a po restartu se spustí nová verze. Image se stahují ze vzdáleného serveru – ať už oficiálního, nebo si můžete provozovat vlastní.

systemd-sysext podporuje tzv. _staged updates_, kde je aktualizace rozdělena do fází, které se musí odehrát po sobě, ale je možné je spouštět odděleně – tedy nejdřív stáhnout a připravit, a později nezávisle provést samotný restart a aktivovat změny.

Pro správu restartů Kubernetes nodů je fajn třeba [Kured](https://kured.dev/), nebo Flatcar nabízí [operátor](https://github.com/flatcar/flatcar-linux-update-operator).

Flatcar nabízí [sysext-bakery](https://flatcar.github.io/sysext-bakery/) – kolekci již připravených řešení, která si stačí přidat do ignition souboru.

Co si odnáším: Flatcar je ještě lepší než dřív! sysext je skvělý způsob, jak s trochou konfigurace automaticky aktualizovat Kubernetes nody (ale Flatcar je nezávislý na Kubernetes a dá se použít kdekoliv). Snadné in-place aktualizace, podpora pro libovolnou Kubernetes distribuci (vanilla kubeadm, k3s, rke2…), otevřenost novým nástrojům, nezávislost (nepotřebuju oficiální Flatcar servery).

Tohle mě opravdu nadchlo a těším se, až budu dělat všechny clustery na Flatcar Linuxu – třeba na [k0s](https://k0sproject.io/) – a nebudu muset řešit aktualizace. Všechno se udělá samo!

### Building Air-Gapped Control Planes for a Global Pharma Leader Using Crossplane and ArgoCD

Přednášeli Antonela Cukurin a Yury Tsarev.

Jak vypadá stavění infrastruktury pro regulované prostředí (farmacie, zdravotnictví), kde kube-apiserver nemá veřejný přístup na internet – a jak takové prostředí stavět a spravovat pomocí Crossplane.

V první řadě opět narážíme na problém slepice/vejce: Jak postavit první hub cluster, když žádný nemám?

Řešením je spustit [Crossplane](https://www.crossplane.io/) v CI pipeline pomocí GitHub Actions na GitHub-managed runneru. Tím se vytvoří první Bastion VM, síť, resource group v Azure… Bastion se pak sám zaregistruje jako self-hosted runner pro GitHub Actions, kde se následně spustí další pipeline, která vytvoří cluster – a z něj se dále tvoří cokoliv dalšího (databáze, clustery, load balancery…).

Co si odnáším: Crossplane jde spustit v pipeline – a je to fajn způsob, jak řešit slepici/vejce.

### CRD Data Architecture for Multi-Cluster Kubernetes

Přednášel Clay Baenziger.

Multi-cluster není sranda. Postavit dnes víc clusterů už není takový problém díky nástrojům jako [Cluster API](https://cluster-api.sigs.k8s.io/) nebo [Karmada](https://karmada.io/). Ale _day-two operations_ jsou stále takový divoký západ. Všichni v zásadě potřebují to samé a už existuje několik open-source projektů, které to řeší – například Azure Fleet.

Clay mluvil mimo jiné o tom, jak to řeší v Bloombergu. Protože jejich multi-cluster řešení je celkem staré, používají nástroj [Karmada](https://karmada.io/).

Zmínil také Kubernetes Enhancement Proposal (KEP) [KEP-4322: Cluster Inventory](https://github.com/kubernetes/enhancements/blob/master/keps/sig-multicluster/4322-cluster-inventory/README.md) a jak to zapadá do správy multi-cluster řešení – a že vlastně trochu čekáme na SIG-Multicluster…

Další KEP – [KEP-1645: Multicluster Services API](https://github.com/kubernetes/enhancements/blob/master/keps/sig-multicluster/1645-multi-cluster-services-api/README.md) – poukazuje na to, že stále chybí standard pro propojení služeb mezi clustery.

Dále zmínil tzv. _Tier_, kterými řeší podobnou/stejnou konfiguraci clusterů. Protože clusterů mají tolik, neřeší už jednotlivé clustery, ale přidali si koncept _Tier_. To vychází z konceptu _Cluster Sameness_, který zase vychází z _Namespace Sameness_ (viz [dokument](https://github.com/kubernetes/community/blob/master/sig-multicluster/namespace-sameness-position-statement.md) od SIG-Multicluster).

Při správě několika clusterů a využívání "hub" Kubernetes clusteru jako databáze pro metadata o clusterech, často etcd (mozek Kubernetes) není dostatečně rychlý – doporučuji využít projekt jako [Kine](https://github.com/k3s-io/kine), který vznikl v rámci [k3s](https://k3s.io/).

Nakonec zmínil, jak komplexním problémem je autentizace a autorizace v multi-cluster světě – a to jak u uživatelů, tak u workloadu.

Co si odnáším: Je to komplikované a chce to zkušené lidi. Cluster API řeší _day zero/one operations_, ale _day two operations_ jsou stále divoký západ. Doporučuji podívat se na [Open Cluster Management](https://open-cluster-management.io/) a zvážit nahrazení etcd jinou databází pro _hub_ clustery – třeba PostgreSQL pomocí Kine.

### OCI Registry as a Secure and Single Source of Distribution for Your Container Images & Artifacts

Přednášel Stéphane Este-Gracias.

Jak se OCI registry stává prakticky standardem a jediným registry pro všechny artefakty.

OCI registry dneska podporuje snad všechno:

- container images
- manifesty pro Kubernetes
- modely pro ML
- attestations (důkaz o původu, Git metadata, autor…)
- signatures (podpisy)

Zajímavost: [CloudNativePG](/blog/cloudnativepg-postgresql-na-kubernetes) plánuje používat OCI artefakty pro distribuci PostgreSQL rozšíření – díky Kubernetes 1.33+, od kterého je možné připojit OCI artefakt jako volume mount do běžícího kontejneru. 😲

Užitečné nástroje nejen pro práci s OCI:

- [Oras](https://oras.land/) – nástroj pro práci s OCI artefakty
- [Cosign](https://github.com/sigstore/cosign) – podepisování (primárně container imagů)
- [Trivy](https://trivy.dev/latest/) – skenování bezpečnostních zranitelností
- [Skopeo](https://github.com/containers/skopeo) – nástroj pro práci se vzdálenými container imagi

Co si odnáším: OCI je prakticky repozitář pro všechny artefakty, vše se dá podepsat a připojit SBOM – bezpečnost bez kompromisů. Kubernetes (1.33, beta feature) plánuje podporu pro OCI volume mount do kontejneru.

### End to End Message Authenticity in Cloud Native Systems

Přednášeli Lucas Käldström a Micah Hausler.

mTLS a OIDC nejsou silver bullet – jak tedy zabezpečit důvěryhodnost a autenticitu zpráv přes HTTP?

Lucas a Micah mluvili o novém [IETF RFC 9421: HTTP Message Signatures](https://datatracker.ietf.org/doc/rfc9421/), které přidává podporu HTTP hlaviček, kam je možné přidat podpis a tím validovat jednotlivé požadavky. RFC myslí i na proxy a gatewaye – je možné přidávat hlavičky, které nejsou podepsané, ale nerozbijí kompatibilitu zprávy a podpisu.

Stále ale zůstává problém s bezpečnou distribucí klíčů (jak bezpečně předat symetrické/asymetrické klíče…).

Dnes podobně funguje AWS sigv4 a existuje proposal na rozšíření podpory [SPIFFE](https://spiffe.io/) o toto RFC.

Co si odnáším: HTTP se rozvíjí nejen na úrovni protokolů (HTTP/2, HTTP/3), ale i v oblasti bezpečnosti a autentizace požadavků.

### Geographically Distributed Clusters: Resilient Distributed Compute on the Edge

Přednášel Alex Bissessur.

Příběh o tom, jak na ostrově Mauricius řeší cloud pro startup bez jakékoliv dostupnosti běžných cloudů (AWS, GCP, Azure…). A taky o tom, že vláda dlouhou dobu považovala cloud za nebezpečný ("cloud = bad"). Ping do Jihoafrické republiky je 60 ms, do Evropy 600 ms – uf!

Řešení? "Embrace the homelab!"

Skutečně vytvořili soustavu homelabů.

Jde o jeden k3s cluster roztažený přes 3 domy napříč ostrovem (latence 1–2 ms), v každém domě alespoň tři nody (celkem devět).

Jako storage řešení používá Longhorn – a překvapivě nemá žádné problémy, což nás všechny překvapilo. 😃

Největším problémem byla síť – propustnost a propojení. Aktuálně používají Tailscale a mají všechny nody v jedné Tailscale síti. Do budoucna plánují migraci na [Headscale](https://headscale.net/). Ingress řeší také přes Tailscale.

Co si odnáším: I malé a punkové prostředí dokáže provozovat úplně v pohodě produkční workload – takhle na ostrově, s minimem a na starých mini-PC z druhé ruky.

Tuhle přednášku bych shrnul slovy: „Kde je vůle, tam je cesta.“

## Záznam

Pro vás, kdo nejste v Londýně a chcete se podívat na přednášky alespoň ze záznamu – Rejekts mají veřejný [playlist na YouTube](https://www.youtube.com/watch?v=uvoygNU35h0&list=PLnfCaIV4aZe8-XjMQ84xxOW_0PWpAN50n) se záznamem všech přednášek.

## Další články

_Sem budu v průběhu týdne doplňovat další články z každého dne konferencí._

- [Rejekts 2025 v Londýně – první den](/blog/rejekts-2025-prvni-den) (tento článek)
- [Rejekts 2025 v Londýně – druhý den](/blog/rejekts-2025-druhy-den)
- [KubeCon přidružené akce 2025 v Londýně](/blog/kubecon-pridruzene-akce-2025)
