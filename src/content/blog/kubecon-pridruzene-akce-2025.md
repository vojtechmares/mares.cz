---
title: KubeCon přidružené akce 2025 v Londýně
description: "Poznámky z přidružených akcí KubeConu 2025 v Londýně: ArgoCon, CiliumCon, Platform Engineering Day, Data on Kubernetes a další."
keywords: ["kubecon", "kubecon europe", "kubecon london", "2025", "london", "kubecon 2025"]
tags: ["konference"]
draft: false
publish_time: 2025-04-02
redirectFrom: ["kubecon-co-located-events-2025"]
alternate: "kubecon-co-located-events-2025"
---

Jsem v Londýně na šestidenním "maratonu" konferencí: Cloud Native Rejekts (30.–31. 3.), KubeCon co-located events (1. 4.) a KubeCon samotný (2.–4. 4.). Co-located events jsou za námi a tady jsou moje poznámky a objevy.

## Co jsou KubeCon co-located events

KubeCon, plným názvem [KubeCon + CloudNativeCon](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/), je akce pořádaná [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/) několikrát do roka – v Evropě, ve Spojených státech, v Indii a v Číně. A v rámci dnešního formátu KubeConu probíhají v úterý přidružené akce (tzv. co-located events). Letošními co-located events byly: ArgoCon, BackstageCon, CiliumCon, Cloud Native + Kubernetes AI Day, Cloud Native Telco Day, Cloud Native University, Data on Kubernetes Day, EnvoyCon, Istio Day, Kubeflow Summit, Kubernetes on Edge Day, Linkerd Day, Observability Day, OpenFeature Summit, OpenTofu Day, Platform Engineering Day. Wow! Je toho opravdu hodně – naštěstí některé jsou třeba jen na půl dne, ale není v lidských silách stihnout všechno. Typicky probíhá několik přednášek paralelně a člověk si prostě musí vybrat...

Já jsem primárně šel po tématech GitOps, multi-cluster, networking a observability. Takže jsem byl na přednáškách v rámci ArgoConu, CiliumConu, Observability Day a Platform Engineering Day.

To by byly formality a krátké seznámení – pro ty z vás, kteří na KubeConu ještě nebyli.

## Co jsem se dozvěděl

Jako předchozí dny, chodil jsem hodně po přednáškách, ale zastavil jsem se i u stánků Isovalentu (Cilium) a Akuity (Argo).

Takže nejdřív pár obecných novinek – o některých už třeba víte...

- Argo CD v3.0 vyjde 6. května (aktuálně je k dispozici [Release Candidate](https://github.com/argoproj/argo-cd/releases))
- Podpora OCI artefaktů v Argo CD bude až ve verzi 3.1, která by měla vyjít cca v srpnu
- Cilium od verze 1.17 podporuje [Multi-Cluster Services API](https://github.com/kubernetes-sigs/mcs-api), viz [KEP-1645](https://github.com/kubernetes/enhancements/tree/master/keps/sig-multicluster/1645-multi-cluster-services-api)
- Multi-Cluster Services API by mělo letos vydat `v1alpha2` API a snad se příští rok dočkáme první beta verze
- Google Cloud Console bude podporovat **dark mode**

### Simplifying Multi-Cluster Networking with Cilium and MCS-API

Cilium už nějakou dobu podporuje tzv. Cluster Mesh a propojování _Services_ napříč clustery. Aktuálně se to řeší pomocí anotací, což je sice snadné a funkční, ale nedá se to moc dobře integrovat s dalšími nástroji...

Ale Cilium od verze 1.17 (vyšla 4. února 2025) podporuje [Multi-Cluster Services API](https://github.com/kubernetes-sigs/mcs-api) – což je oficiální projekt Kubernetes, který má za úkol standardizovat propojování více clusterů a využívání _Service_ objektů.

MCS-API se poprvé objevilo už v roce 2020, ale je to jeden z těch pomalu se rozvíjejících projektů a zatím je k dispozici pouze `v1alpha1`. To ale neznamená, že nejde začít používat. A přesně to Isovalent (firma stojící za Ciliumem, kterou v roce 2024 koupilo Cisco) udělal – přidal podporu MCS-API do Cilium. Mega cool!

Nebudu zabíhat úplně do podrobností, ale ve zkratce, co to dělá a jak to funguje:

- pomocí Cilium Cluster Mesh propojíte clustery privátní sítí (nemusíte mít _Ingress_ všude) – ideálně s IP bloky, které se nepřekrývají
- místo Cilium anotací použijete CRD _ServiceExport_ (vytváříte ručně) a CRD _ServiceImport_ (tvoří Cilium automaticky)
- ve všech clusterech, kde je _Service_ importovaná, ji můžete používat naprosto stejně jako běžnou _Service_
- jediná změna je doména _Service_ – místo `<service-name>.<namespace>.svc.cluster.local` je to `<service-name>.<namespace>.svc.clusterset.local` (na konci `.clusterset.local`, ne `.cluster.local`) – a jinak nic nemusíte řešit, najs!

Pokud vás zajímají podrobnosti, mrkněte do repozitáře [MCS-API](https://github.com/kubernetes-sigs/mcs-api), na [KEP-1645](https://github.com/kubernetes/enhancements/tree/master/keps/sig-multicluster/1645-multi-cluster-services-api) a [dokumentaci](https://docs.cilium.io/en/stable/network/clustermesh/mcsapi/#deploying-a-simple-example-service-using-mcs-api) Cilium.

### Multi-Cluster Magics with Argo CD and Cluster Inventory

Jak začít… no prostě Argo CD nasazovalo aplikace do **různých clusterů** na základě metrik – takové cross-cluster škálování. To demo bylo fakt černá magie!

Byl to docela fičák, takže nemám moc poznámek, ale šlo o Cluster Inventory, integraci do hub/spoke modelu a jak to celé zabalit s pomocí Argo CD.

Podařilo se mi najít [slajdy](https://static.sched.com/hosted_files/colocatedeventseu2025/81/ArgoCon-%20Multi%20Cluster%20Magics%20with%20Argo%20CD%20and%20Cluster%20Inventory.pdf) a až bude záznam, tak si to pustím ještě jednou 😄

### Platform Engineering for Architects – Crafting Platforms as a Product

Moc pěkná přednáška o platformách a platform engineeringu. Platforma, která existuje jen proto, aby existovala, je na nic. Platforma potřebuje vizi, řešit problém a poskytnout vývojářům řešení. A jak do toho celého zapadají lidé...

Absolutně skvělý pojem **randomeering** – engineering, kde prostě přidávám nástroje do pomyslného košíku podle toho, co mi přijde pod ruku – bez vize, bez směru, bez skutečného problému.

Poznamenal jsem si několik citací:

> Platform without usage is just infrastructure.
> Solve problems you have, not the ones you **may** have.
> Products have longevity. Products have deadlines.
> Convince management not to set deadlines and budgets. Platform should show its value.
> Get feedback from end-users [developers].
> Platform should be changeable and needs to change over time.

Tři pilíře změny: _people, culture, purpose_.

Zkrátka: platforma je interní produkt – ne jednorázový projekt.

Pokud máte lepší způsob, jak získáváte zpětnou vazbu od vývojářů, dejte vědět – třeba na Twitteru, stačí mě označit [@vojtechmares\_](https://x.com/vojtechmares_).

### Argo at Scale: Navigating Complex Multi-Dimensional Deployments Across Hundreds of Clusters

Nejprve Adobe v číslech: 430+ clusterů, 250+ Helm chartů, 550+ deploymentů za měsíc (skoro 20 denně).

Jak na to? Uf...

- Argo CD _ApplicationSet_ + merge generátory 💪
- Očekávat neočekávané (výpadky všeho druhu a neočekávat uptime 100 %)
- Filtrovat v alertingu/eventech pouze failing deploymenty (jinak se zblázníte)
- Monitoring a Grafana dashboardy pro Argo CD instanci, aplikace a cokoliv, co potřebujete

### Scale GitOps with the Argo CD Agent and Open Cluster Management

Přednáška byla vlastně představení Open Cluster Managementu, Argo CD Agenta a toho, jak spolu fungují.

[Open Cluster Management (OCM)](https://open-cluster-management.io/) je open-source nástroj pro správu multi-cluster řešení. Umí nejen spravovat clustery (třeba pomocí [Cluster API](https://cluster-api.sigs.k8s.io/)), ale i nasazovat aplikace přes Helm charty. Existuje už pět let (a já se o něm dozvídám až teď?!), dnes podporuje jak Argo CD, tak SIG-Multicluster.

[Argo CD Agent](https://argocd-agent.readthedocs.io/latest/) je open-source řešení, které primárně vyvíjí Red Hat – v podstatě alternativa k Akuity Cloud Platformě (managed Argo CD, Kargo a agent). Je to verze zdarma, ale zatím relativně v plenkách. Stable-ish verze se očekává ke konci roku. Agent zatím nepodporuje [Kargo](https://kargo.io/) ani další nástroje z Argo světa – tak uvidíme, co čas přinese.

Zajímavé, ale chce to ještě trochu času.

## Další články

_Sem budu v průběhu týdne doplňovat další články z každého dne konferencí._

- [Rejekts 2025 v Londýně – první den](/blog/rejekts-2025-prvni-den)
- [Rejekts 2025 v Londýně – druhý den](/blog/rejekts-2025-druhy-den)
- [KubeCon přidružené akce 2025 v Londýně](/blog/kubecon-pridruzene-akce-2025) _(tento článek)_
