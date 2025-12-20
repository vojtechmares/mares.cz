---
title: Přednášky
description: Přehled přednášek a workshopů, které jsem měl možnost dělat.
keywords: ["přednášky", "talks", "workshop"]
featured: true
draft: false
---

## Attestations & supply chain security from Git to Kubernetes

6\. června 2025 · [KCD Czech & Slovak - Bratislava 2025](https://community.cncf.io/events/details/cncf-kcd-czech-slovak-presents-kcd-czech-amp-slovak-bratislava-2025/)

Na KCD jsem po roce (tentokrát v Bratislavě) přednášel o attestations a podpisech OCI images, jak to použít a jak validovat podpisy images a whitelistovat registry, ze kterých se image v Kubernetes může pustit, slajdy (power point prezentace) ke stažení [zde](https://github.com/vojtechmares-examples/kcd-bratislava-2025-oci-attestations/raw/refs/heads/main/docs/slides.pptx).

Pokud hledáte jak na to sami, koukněte na [demo projekt na GitHubu](https://github.com/vojtechmares-examples/kcd-bratislava-2025-oci-attestations) na [záznam na YouTube](https://www.youtube.com/watch?v=7mFHxt7nlE4) nebo se do toho pusťte sami se [Sigstore](https://www.sigstore.dev/) a [Cosgin](https://github.com/sigstore/cosign)!

![KCD2025 157.jpg](https://cdn.mares.cz//KCD_2025_157_b89caf4f63.jpg)
![KCD2025 204.jpg](https://cdn.mares.cz//KCD_2025_204_6d911fc7a6.jpg)

## Panel discussion - AI/ML Meets Cloud Native: Real-World Challenges and Opportunities

5\. června 2025 · [KCD Czech & Slovak - Bratislava 2025](https://community.cncf.io/events/details/cncf-kcd-czech-slovak-presents-kcd-czech-amp-slovak-bratislava-2025/)

Na letošních KCD v Bratislavě jsem se účastnil i panelové diskuze na téma AI/ML Meets Cloud Native. Kde jsem přispěl pár svými postřehy a zkušenostmi třeba z GLAMI, kde jsem dělal MLOps a provozoval doporučovací systémy do 14 zemí, kde tehdy GLAMI působilo. K dispozici je [záznam na YouTube](https://www.youtube.com/live/0KRR_Jg1qco?si=nlQl0woiS-U6M4L1&t=19220).

![KCD2025 111.jpg](https://cdn.mares.cz//KCD_2025_111_39c87afdca.jpg)

## CloudNativePG: Postgres na Kubernetes

28\. ledna 2025 · [Prague PostgreSQL Developer Day 2025](https://p2d2.cz/2025)

Na P2D2 jsem si dal repete přednášky z KCD Prague 2024 s pár úpravami pro lidi kteří se nevyznají tolik v Kubernetes.
Přednáška byla o provozování HA Postgres clusteru na Kubernetes s pomocí **CloudNativePG** - Kubernetes operatoru.

## CloudNativePG - PostgreSQL on Kubernetes the right way

7\. června 2024 · [KCD Prague 2024](https://community.cncf.io/events/details/cncf-kcd-czech-slovak-presents-kcd-czech-slovak-2024/)

![Vojtěch Mareš přednáší na KCD Prague 2024](https://cdn.mares.cz/kcd_vm_talk_cnpg_1f9af4db2a.jpg)

Na Kubernetes Community Days Prague 2024 jsem přednášel o provozování PostgreSQL clusteru na Kubernetes. Jak to dělat správně a s klidným spaním, aby vás nebudil PagerDuty, pomocí CloudNativePG Kubernetes Operátoru.

O KCD jsem sepsal krátký [článek](/blog/kcd-prague-2024).

## Self-hosted vs managed řešení

23\. května 2022 · [Cloud Computing Conference 2023](https://cloud.konference.cz/ccc-2023)

Přednáška na téma self-hosted vs managed řešení. Jaké jsou rozdíly, jaké jsou jednotlivé výhody, hrozby a jak si vlastně vybrat.

## Event-driven autoscaling na Kubernetes s KEDA

17\. září 2022 · [WarpCamp](https://www.warpcamp.cz/), ročník 2022

Menší přednáška včetně dema, jak se dá na Kubernetes škálovat i jinak, než klasicky pomocí HPA. KEDA je skvělý nástroj, který vám pomůže škálovat díky zpoustě tzv. Scalers ("škálovačů"). Například zpráv ve frontě v RabbitMQ nebo Kafka. Ale i třeba eventů v AWS Event Hubu nebo čistě pomocí cronu (v osm ráno chci 8 podů a na noc jen tři pody) a mnoho dalších. KEDA dnes nabízí přes šedesát škálovačů plus možnost si napsat vlastní.
