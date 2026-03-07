---
title: Rejekts 2025 v Londýně – druhý den
description: Jaké bylo pondělí aka druhý den na Cloud Native Rejecks 2025 v Londýně? Co jsou Rejekts? A co jsem se dozvěděl?
keywords: ["cncf rejekts", "rejekts", "kubecon", "2025", "london", "rejektsio"]
tags: ["konference"]
draft: false
publish_time: 2025-04-01
redirectFrom: ["rejeckts-2025-druhy-den"]
---

Jsem v Londýně na šestidenním "maratonu" konferencí: Cloud Native Rejekts (30.–31. 3.), KubeCon co-located events (1. 4.) a KubeCon samotný (2.–4. 4.). Rejekts jsou první – a já mám za sebou druhý den. Jaký byl?

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

V pondělí jsem byl opět na několika přednáškách – některé lepší, jiné slabší. Tady jsou moje postřehy.

### Evaluating Global Load Balancing Options for Kubernetes in Practice

_Za mě asi nejzajímavější přednáška dne._

Přednášeli Tobias Schneck a Nicolai Ort.

Jak na load balancing v Kubernetes?

Můžu si koupit hotové HA řešení například od Google Cloudu (GSLB), Cloudflare, Fastly, Akamai… ale pokud nechci kupovat hotovou věc, můžu si to postavit sám.

Více clusterů a jejich propojení: [Cilium Cluster Mesh](https://docs.cilium.io/en/latest/network/clustermesh/intro/). Mám k dispozici interní endpointy a prosíťované clustery, funguje to dobře, ale neřeší to ingress, když jeden cluster vypadne. Zároveň se clustery musí vzájemně vidět a nesmí si překrývat IP rozsahy.

Ingress řešení: [K8GB – Kubernetes native Global Load Balancer](https://www.k8gb.io/). K8GB funguje tak, že v clusteru spustí vlastní CoreDNS instanci, která se stará o DNS A záznamy pro ingress domény, a pomocí external-dns konfiguruje třeba Cloudflare, kde přidává DNS NS záznamy pro nové CoreDNS instance. Ty pak resolvují DNS.

Je to velice pěkné řešení. Samozřejmě, v případě multi-clusteru je třeba propojit K8GB mezi clustery, aby si navzájem nesahaly do konfigurace. A protože DNS je zdrojem všech problémů (vždycky je to DNS…) a hlavně se cachuje, může v případě failoveru nastat krátkodobý výpadek. Na live demu byl kratší než jedna minuta.

**Co jsem si odnesl**: Failover/HA jde řešit přes více clusterů a Cilium Cluster Mesh pro interní služby. Pro public služby (API apod.) buď použít hotové řešení, nebo K8GB.

### Simplifying Cross-Cloud, Cross-Cluster Connectivity with Dapr & Cilium

Přednášeli Alice Gibbons a Manuel Zapf.

Tahle přednáška byla vlastně jeden velký fičák – a to, co si odnáším, je, že [Dapr](https://dapr.io/) je každý rok lepší a lepší. Pomocí jeho SDK dokážu vývojářům neskutečně usnadnit život, a platform tým se stará o jednotlivé služby (Redis, Kafka…). Vývojáře to vlastně vůbec nezajímá a všechno funguje velmi pěkně. No a v kombinaci s Cilium – zpátky u Cluster Meshe a propojení více clusterů – je Dapru úplně jedno, kde co běží. Prostě paráda 🎉!

### The Service Mesh Wars: A New Hope for Kubernetes

Přednášel Henrik Rexed.

Přednáška byla velké srovnání různých Service Mesh řešení: Kuma, Linkerd, Cilium, Istio, Ambient a spojení s Gateway API.

V tomhle není žádný jednoznačný vítěz – záleží na tom, co hledáte pro svůj use case. Za mě důležité rozhodovací body jsou:

- [**Kuma**](https://kuma.io/) je snadná na nasazení a konfiguraci
- [**Linkerd**](https://linkerd.io/) je pracný na konfiguraci, ale dost rychlý – ovšem má minimální observabilitu
- [**Cilium**](https://cilium.io/) je hlavně network plugin a chybí mu funkcionalita Service Meshe (retries, circuit breaker, rate limiting) – ale je super rychlý a nepřidává žádnou latenci
- [**Istio**](https://istio.io/) je celkem fajn, ale přidává latenci (na OTel demu to bylo cca 15 ms)
- [**Ambient (Istio bez sidecar)**](https://istio.io/latest/blog/2022/introducing-ambient-mesh/) zatím některé věci neumí, ale až to zvládne, bude to asi nejlepší cesta

A co Gateway API? Specifikace zatím neumí retries, circuit breaking nebo rate limiting, ale třeba Envoy Gateway to zvládá pomocí vlastního CRD. Iniciativa Gateway API GAMMA (Gateway API for Service Mesh) se rozjíždí a třeba za dva roky to vyřeší všechny naše problémy…

**Co jsem si odnesl**: Eeeeh, záleží, co chci – a podle toho si musím vybrat. Zatím není jednoznačný vítěz.

### The Kubernetes Guardians: A Deep Dive Into Your Security Avengers

Přednášeli Henrik Rexed a Ben Hirschberg.

Opět šlo hlavně o srovnání nástrojů pro security: Falco, KubeArmor, Tetragon, Kubescape. Ale tentokrát tu je vítěz.

Ne všechny nástroje jsou si rovné. Některé fungují jako runtime policy engine – tedy vymáhají pravidla za běhu, jiné spíše jen reportují události. Konfiguraci každý řeší po svém a i deployment model se liší – od DaemonSetu po řešení s operátorem, několika CRD, deploymenty a DaemonSetem k tomu.

**Co jsem si odnesl**: Kubescape je nejsnadnější, má rozumné smart defaults a stačí ho nasadit do clusteru – a hned dostávám smysluplné informace. Všechna řešení ale přidávají latenci, klidně i 10 ms v callstacku mikroslužeb.

### Scaling PDBs: Introducing Multi-Cluster Resilience with x-pdb

Přednášel Moritz Johner.

Jak řešit [_PodDisruptionBudget_](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) ve světě multi-clusteru a udržet počet podů i napříč clustery.

Use case: Form3 provozuje clustery napříč cloud providery a on-prem řešením a potřebují zajistit vysokou dostupnost CockroachDB (distribuovaná SQL databáze). A protože CockroachDB využívá Raft (algoritmus pro distribuovaný consensus), je vždy potřeba nadpoloviční většina nodů v Raft clusteru. Klasický _PodDisruptionBudget_ tohle řeší a umožňuje definovat, o kolik podů můžeme přijít skrz běžnou evikci ([Evictions](https://kubernetes.io/docs/concepts/scheduling-eviction/)), ale neřeší vynucené evikce (node pressure – RAM, disk, CPU, síť).

Proto ve Form3 vytvořili open source projekt [x-pdb](https://github.com/form3tech-oss/x-pdb), který řeší PDB napříč clustery 😲. x-pdb funguje na bázi admission webhooku a hijackingu Eviction API volání, takže je nezávislý na Kubernetes providerovi. Jednotlivé controllery jsou propojené a využívají nativní Kubernetes objekt _lease_ pro získání zámku v každém clusteru, než začnou manipulovat s pody. Řešení není dokonalé a mohou nastat race conditions v okrajových případech – ale za rok se jim to nestalo ani jednou. Pokud controller nezíská zámek v ostatních clusterech, výchozí chování je, že neumožní žádnou manipulaci s pody.

**Co jsem si odnesl**: Multi-cluster není sranda – hlavně u stateful aplikací (např. databáze), které jsou rozprostřené napříč clustery. U stateless aplikací (např. backend k API) se to dá zvládnout lépe – a případně aplikace chvilku běží v degraded stavu, což ale u Raftu nejde – cluster by se rozpadl.

### The Infinite Hotel: Scaling Multi-Tenant Platforms through a Unified API

Přednášeli Carlos Mestre del Pino a Christopher Haar.

Zábavná přednáška s analogií nekonečného hotelu, s nekonečnými patry, místnostmi, službami… aneb jak si nezamotat hlavu kolem nekonečna a jak se tohle promítá do multi-tenantních řešení.

Nešlo o technický deep dive, ale velmi pěkně to shrnulo problematiku škálování „do nekonečna“ – a že to jen tak nejde. Je potřeba se na škálování připravit. Doporučuji záznam, pokud je multi-tenance něco, co řešíte.

**Co jsem si odnesl**: Multi-tenance není sranda. Je dobré investovat čas do promyšlení řešení a neskočit do toho po hlavě. Loft [vCluster](https://www.vcluster.com/) je super pro provozování tenantů ve vlastním Kubernetes clusteru – a přitom nemusím mít stovky samostatných clusterů v cloudu.

### Wasm, Envoy, and Hyperlight Walk Into a Pod: No Vulnerabilities Allowed

Přednášeli Danilo (Dan) Chiarlone a Mikhail Krinkin.

Představení projektu [Hyperlight – Virtual Machine Manager (VMM)](https://github.com/hyperlight-dev/hyperlight) v Rustu pro WASM aplikace – a jak Hyperlight implementuje Envoy pro filtry. Důležitá poznámka: Hyperlight sandbox zaniká po každém volání filtru a nemá žádná perzistentní data.

Obecně je možné Hyperlight použít pro bezpečné spouštění kódu třetích stran – protože neumožňuje přímé volání žádných SYSCALLs. Vše jde přes Hyperlight a konkrétní funkce musí být přímo poskytnuty WASM programu, který je volá přes Hyperlight.

### Lightning talks

Na závěr Rejekts následoval sled několika tzv. lightning talků, tedy přednášek na 5 minut.

Protože to byly pětiminutovky, vezmu to ve zkratce:

- [Gateway API](https://gateway-api.sigs.k8s.io/) a `BackendTLSPolicy` – cesta, jak mít end-to-end TLS (tj. TLS internet–gateway–backend) 👀
- Podman a [Kind](https://kind.sigs.k8s.io/) – [Podman Desktop](https://podman-desktop.io/) má first-class integraci pro KinD (Kubernetes in Docker) a správu lokálních clusterů 👍
- OpenTelemetry auto-instrumentace – startup overhead je malý (srovnatelný s vlastní instrumentací), je to snadné, nebát se toho 😄
- [Headlamp – GUI pro Kubernetes](https://headlamp.dev/) – jako lokální program nebo webové rozhraní
- [YAML v1.3](https://www.yaml.io/spec/1-3/) – YAMLScript, aneb píšeme kód v YAML 👀 – a bacha, o YAML v1.3 přednášel samotný tvůrce YAMLu, Ingy döt Net 😲

## Záznam

Pro vás, kdo nejste v Londýně a chcete se podívat na přednášky alespoň ze záznamu – Rejekts mají veřejný [playlist na YouTube](https://www.youtube.com/watch?v=uvoygNU35h0&list=PLnfCaIV4aZe8-XjMQ84xxOW_0PWpAN50n) se záznamem všech přednášek.

## Další články

_Sem budu v průběhu týdne doplňovat další články z každého dne konferencí._

- [Rejekts 2025 v Londýně – první den](/blog/rejekts-2025-prvni-den)
- [Rejekts 2025 v Londýně – druhý den](/blog/rejekts-2025-druhy-den) _(tento článek)_
- [KubeCon přidružené akce 2025 v Londýně](/blog/kubecon-pridruzene-akce-2025)
