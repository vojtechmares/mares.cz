---
title: Náhrada za Kubernetes Ingress-NGINX
description: Hledání náhrady za Kubernetes Ingress-NGINX, který končí. Ingress controllery jsou hrozivý a všechno je strašně komplikované... Ingress-NGINX byl jednoduchý a hledání jednoduché náhrady stojí za bačkoru.
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
draft: true
publish_time: 2020-01-01
---

Nedávno jsem napsal článek [Kubernetes Ingress-NGINX odchází do důchodu](https://www.mares.cz/blog/kubernetes-ingress-nginx-odchazi-do-duchodu) a zmínil jsem, že budu hledat náhradu.

Tak hledám hledám a chci se podělit o to, co jsem našel a jak to různě fungovalo a nefungovalo.

Zkoušel jsem:

- Traefik
- NGINX-Ingress
- [HAProxy Kubernetes Ingress Controller](https://www.haproxy.com/documentation/kubernetes-ingress/)

## Traefik

Uf. Začalo to jednoduše, pohoda, ale...

Ingress-NGINX měl spoustu anotací a Traefik nic neřeší přes anotace, ale přes CRD (_IngressRoute_, _Middleware_, a další) a najít, kterou CRD potřebujete a jak ji naconfigurovat, je fakt pain.

To bylo sice pracné, ale ještě se to dalo (Claude Code docela pomáhal), ale konec nastal, když jsem chtěl předělat Ingress pro ArgoCD. Chci mít nasazené ArgoCD bezpečně, tj. i v clusteru mám HTTPS a to mi prostě nešlo.

Zkusil jsem kombinaci několika _IngressRoute_ a _Middleware_, ale nezvítězil jsem. Triviální to rozhodně nebylo.

Takže vlastně řešení docela na nic mi v celku přijde. Asi, když bych měl jen Traefik a těžil z jeho nativních CRD rovnou a třeba propojení s Gateway API, asi by to bylo lepší, ale takhle, když chci jen prostou náhradu za Ingress-NGINX je to akorát na pytel.

Čeho si cenním, je nativní podpora OpenTelemetry. Traefik nabízí jak logování v různých formátech (test, JSON,...), možnost vypnout/zapnout access log a standardní Prometheus `/metrics` endpoint, ale k tomu ještě nativní integrace s OpenTelemetry a posílat jak logy tak metriky, přímo do OTEL collectoru.

Moje hodnocení Traefiku jako náhrady za Ingress-NGINX: **3/10**.

## NGINX-Ingress

-- TODO

## HAProxy Kubernetes Ingress Controller

**⚠️ POZOR ⚠️**: Neplést si s [HAProxy Ingress](https://haproxy-ingress.github.io/) ([github.com/jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress)), použil jsem oficiální od HAProxy Technologies, [HAProxy Kubernetes Ingress Controller](https://www.haproxy.com/documentation/kubernetes-ingress/).

-- TODO

### Ingress anotace

| **Ingress-NGINX anotace**                                | **HAProxy Ingress anotace**           | **Poznámka**                                                          |
| -------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| `nginx.ingress.kubernetes.io/ssl-passthrough: "true"`    | `haproxy.org/ssl-passthrough: "true"` |                                                                       |
| `nginx.ingress.kubernetes.io/force-ssl-redirect: "true"` | `haproxy.org/ssl-redirect: "true"`    | A `haproxy.org/ssl-redirect-code: "302"`, možnosti jsou 301, 302, 303 |

## Další možnosti

Další možnosti jsem nezkoušel, přecijen to chce dost času předělat několik různých ingresů, abych viděl jak se ingress controller chová v různých nastaveních a dál jsem se testování věnovat nechtěl.

Čemu se ještě budu věnovat, je Gateway API. Příjemě mě překvapila podpora Gateway API napříč existujícími ingress controllery, bohužel je to docela různé, kdo podporuje co apod. U Gateway API mám v plánu se podívat na Envoy Gateway a zvažuju ještě Istio. Ale pro můj osobní cluster, kde mi běží jen pár věcí je Istio strašlivý overkill, takže možná bude jen třeba něco menšího-testovacího.

Pokud byste chtěli třeba celý repozitář, tak mě označte třeba na Twitteru/X [@vojtechmares\_](https://x.com/vojtechmares_), na Blue Sky [@mares.cz](https://bsky.app/profile/mares.cz) nebo na Linked Inu ([Vojtěch Mareš](https://www.linkedin.com/in/vojtech-mares/)) a pošlu odkaz (až teda ten test budu mít hotový...).

Pokud se ale chcete podívat na široké srovnání fičur, doporučuju [tento Google Sheet](https://docs.google.com/spreadsheets/d/191WWNpjJ2za6-nbG4ZoUMXMpUK8KlCIosvQB0f-oq3k/edit?gid=907731238#gid=907731238), který jsem našel, kde je snad úplně všechno.
