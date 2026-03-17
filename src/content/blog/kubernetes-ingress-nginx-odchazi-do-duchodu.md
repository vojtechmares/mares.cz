---
title: Kubernetes Ingress-NGINX odchází do důchodu
description: "Ingress-NGINX od března 2026 přechází do režimu minimální údržby. Co to znamená, jaké jsou alternativy a na co si dát pozor při migraci."
keywords:
  [
    "kubernetes",
    "ingress-nginx",
    "ingress",
    "ingress nginx retirement",
    "gateway api",
    "envoy gateway",
    "istio",
    "haproxy",
    "traefik",
  ]
tags: ["kubernetes"]
trainingAd: kubernetes
draft: false
publish_time: 2025-11-19
---

Letos (v roce 2025) na KubeConu v Londýně, maintaineři Kubernetes projektu Ingress-NGINX (open-source [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller, přímo od Kubernetes projektu) oznámili, že bude ukončen jeho vývoj a následně i jeho podpora. Náhradou za Ingress-NGINX měl být projekt [InGate](https://github.com/kubernetes-sigs/ingate).

Původní časový plán vypadal takhle:

- Konec roku 2025 – vychází InGate první verze v0.1
- Polovina roku 2026 – InGate je stabilní (vychází verze v1.0)
- 2027 – Ingress-NGINX repozitář bude archivován na GitHubu

InGate měl být náhradou, která s sebou nenese technický dluh a není to "maintenance hell", jak tomu je u Ingress-NGINXu. Zároveň měl InGate podporovat nejen Ingress API, jehož vývoj je zastavený od Kubernetes v1.19, které vyšlo v srpnu 2020, ale i nové [Gateway API](https://gateway-api.sigs.k8s.io/). Jako HTTP proxy měl zůstat NGINX, vedle kterého by paralelně běžel controller v Go, sledující změny v Kubernetes clusteru.

InGate ale vypadá mrtvě. Lépe řečeno nikdy neoživnul. Projekt má 39 commitů za celý rok a několik posledních je jen od Dependabota.

## Všechno je jinak

Nakonec, jak tomu bývá, je všechno jinak. Ingress-NGINX přechází do maintenance režimu už v březnu 2026. To bylo nedeávno [oznámeno](https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/) Kubernetes Blogu. Společně s Ingress-NGINXem končí i InGate u kterého se nepodařilo projekt nakopnout a zároveň udržet Ingress-NGINX na přechodnou dobu.

Tím se tedy všichni, kdo používáme Ingress-NGINX dostáváme do dost nepříjemné situace.

### Další kroky

Co Kubernetes projekt doporučuje (a já taky), je zmigrovat na jiné řešení, a to co nejdříve, protože Ingress-NGINX skončí a žádné opravy chyb nebo nové verze nebudou. A to všechno nastane už v březnu 2026, což je odteď za pět měsíců!

## Vhodná náhrada za Ingress-NGINX

Obecně univerzální náhradní řešení není. Ono totiž záleží, co používáte, co potřebujete. Co je váš use-case. Pokud vám stačí Ingress a chcete toho co nejméně měnit, tak výměna za jiný Ingress controller je ta nejlepší možnost. Na webu Kubernetes je [seznam Ingress controllerů](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/).

Mám v plánu vyzkoušet několik Ingress controllerů, které jsou podobné nebo nabízejí podobné funkce jako měl Ingress-NGINX a které já a moji klienti využíváme (redirecty, rewrite URL, rate limiting, proxy body size (pro nahrávání souborů na server), timeouty, integrace s Cert-Managerem, metriky pro Prometheus, WAF ochranu (třeba přes ModSecurity nebo Coraza). A to vše ideálně v open-source verzi.

Po průzkumu existujících controllerů jsem skončil u následujících možností:

- [HAProxy Ingress controller](https://www.haproxy.com/documentation/kubernetes-ingress/) (myslím ten oficiální, ne malý open-source projekt)
- [Traefik](https://doc.traefik.io/traefik/reference/install-configuration/providers/kubernetes/kubernetes-ingress/)
- [Contour](https://projectcontour.io/)
- [F5 NGINX Ingress controller](https://docs.nginx.com/nginx-ingress-controller/) – projekt přímo od F5
- [Istio](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/) – než Ingress zvažte přímou integraci a využití třeba _VirtualService_.

Pokud chcete použít Gateway API, koukněte se na následující implementace:

- [Envoy Gateway](https://gateway.envoyproxy.io/)
- [Istio](https://istio.io/latest/docs/tasks/traffic-management/ingress/gateway-api/)
- [NGINX Gateway Fabric](https://github.com/nginx/nginx-gateway-fabric) – projekt přímo od F5
- [Contour](https://projectcontour.io/docs/1.33/config/gateway-api/)

Za mě je Gateway API dělané spíš pro SaaS služby a mikroslužby. Prostě počítá s _Gateway_, na které jsou napojené všechny routy, které se nasazují společně s aplikací.

Seznam všech Gataway API implementací mají [zde](https://gateway-api.sigs.k8s.io/implementations/#gateway-controller-implementation-status) na webu.

### Doporučení, čím Ingress-NGINX nahradit

Za nejlepší/nejsnažší náhradu, pokud chci zůstat u Ingress API považuju:

1. **Traefik** – jednodychý, má vlastní dashboard, umí řešit HTTPS automaticky (nepotřebuju Cert-Manager)
2. **HAProxy Ingress** – snadná migrace, umí skoro všechno co Ingress-NGINX, tak by to neměl být extra bolehlav

Pokud chcete jít do Gateway API, podívejte se na:

1. **Envoy Gateway** – za mě jednoznačně nejvíc funkcí snadno a rychle (globální (na celou gateway) rate limiting, lokální (na konkrétní Route – HTTPRoute, GRPCRoute,...) rate limiting, retry, circuit breaking, autentizace – Basic Auth, JWT, OIDC, traffic management: traffic spliting, request mirroring,...), navíc je plně open-source pod CNCF bez enterprise edice (a tedy placených funkcionalit)
2. **Istio** – umí toho také spoustu a pokud uvažujete o Service Mesh, dokážete zabít dvě mouchy jednou ranou

Pozor, pokud u Gateway API, potřebujete několik domén s HTTPS a nechcete jeden certifikát pro všechny domény, kde je pak možné se velmi snadno podívat, jaké domény jsou pro certifikát platné a zjistit tak informace o vaší aplikaci, které třeba nechcete zveřejňovat.

Pokud se chcete tomto problému vyhnout, musíte na _Gateway_ mít několik listenerů na portu `443` a pro každý zvlášť mít dedikovaný certifikát a to vše pak mapovat na správné routy. Tím přicházíte prakticky o veškerou flexibilitu z hlediska rozdělení vlastnictví _Gateway_ a rout – _Gateway_ vlastní platformní tým a routy teamy vlastnící aplikace. A vlastně je to spíš use-case pro běžný Ingress. Plus, pro padesát domén by tohle už bylo třeba hodně pracné nebo třeba pro multi-tenantní aplikace na různých doménách nevhodné.

Gateway API není náhrada za Ingress ve smyslu "1:1", je potřeba udělat změny.

- Na infrastruktuře: přidat CRD do clusteru – nejsou v Kubernetes automaticky, zvolit implementaci – třeba Envoy Gateway a nainstalovat _GatewayClass_, _Gateway_ a upravit aplikaci aby místo _Ingress_-u měla _HTTPRoute_
- Pokud používáte Cert-Manager, je třeba zapnout podporu Gateway API…
- external-dns potřebuje zapnout podporu, aby sledovalo resource typu Route a _Gateway_

Na pomoc s migrací z Ingressu na Gateway API existuje nástroj [ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway) a Gateway API má o migraci i [stránku](https://gateway-api.sigs.k8s.io/guides/getting-started/migrating-from-ingress/) v dokumentaci.

Čemu bych se naopak vyhnul, je Cilium řešení, jak pro Ingress tak pro Gateway API. Mrzí mě to, protože [Cilium](https://cilium.io/) mám moc rád a má spoustu skvělých fičur. Ale Ingress a Gateway API je hrozné – vyzkoušeno za vás. Je to prakticky nesrovnatelné s Ingress-NGINXem co se fičur týče, neumí to URL rewrite, redirect, proxy body size a další užitečné a skoro bych i řekl základní věci.

## Envoy jako nástupce NGINXu

Na závěr malý postřeh.

Prakticky všichni dnes používají Envoy místo NGINXu. Výjimkou je HAProxy Ingress, používá (nečekaně) HAProxy, NGINX Gateway Fabric & NGINX Ingress controller, které používají NGINX a Traefik.

Jinak všichni ostatní používají Envoy. I třeba Istio používá Envoy jak v sidecar, tak v ambient (DaemonSet režim pro proxy) režimu, kde Envoy propojuje služby a aplikuje L7 (HTTP) politiky. Nebo Cilium, u kterého je možné zapnout Envoy jako proxy, což je podmínka pro používání Ingressu a Gateway API, ale lze tím spravovat L7 _CiliumNetworkPolicy_. Cool.

[Envoy](https://www.envoyproxy.io/) je open-source HTTP (L7) proxy, která dnes patří pod CNCF a je "Graduated project".
