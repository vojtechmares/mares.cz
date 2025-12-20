---
title: KubeCon 2025 v Londýně – první den
description: KubeCon v Londýně konečně oficiálně začal a já se vrhnul do víru dění a začal jsem sbírat všechny možná moudra a novinky.
keywords:
  [
    "kubecon",
    "kubecon eu",
    "kubecon europe",
    "kubecon 2025",
    "konference",
    "cloudnative",
    "cloudnativecon",
  ]
tags: ["konference"]
draft: false
publish_time: 2025-04-03
---

KubeCon je konečně tady a s ním nekonečno novinek – nejen ze světa Kubernetes a Cloud Native.

Jsem v Londýně na šestidenním "maratonu" konferencí: Cloud Native Rejekts (30.–31. 3.), KubeCon co-located events (1. 4.) a KubeCon samotný (2.–4. 4.). Co-located events jsou za námi a tady jsou moje poznámky a objevy.

## Co jsem se dozvěděl

Většinu středečního dopoledne jsem strávil networkingem v Showcase pavilonu, aneb brodil jsem se nepřebernou změtí stánků různých vendorů. Od nejznámější velké trojky cloudů (AWS, GCP, Azure), přes GitHub, Grafanu, Dynatrace a spousty menších firem – ať už cloud providerů, nebo startupů ze světa security, pipeline a kdo ví čeho ještě. Je toho prostě spousta.

Zastavil jsem se mimo jiné u Akuity (firma, která vytvořila Argo projekt – ArgoCD, Workflows, Rollouts atd.), kde jsem zjišťoval, co za novinky nás čeká. Část jsem už prozradil včera. Třeba že ArgoCD v3.0 vyjde 6. května a verze 3.1, která bude plně podporovat OCI, by měla vyjít v srpnu.

Kdo mě překvapil, byla Dynatrace. Měl jsem pocit, že jejich produkt tak nějak zamrznul v proprietárním světě a nikam dál se neposouvá – ale opak je pravdou. Pěkné, přehledné UI, AI pro detekci security eventů (což nevypadalo špatně) a integrace s OpenTelemetry. Mají upravený OTel collector – sice ano – ale není problém do toho posílat cokoliv, co OTel umí (logy, metriky a traces). A ještě jedno příjemné překvapení: česká stopa v Dynatrace. Na začátku jsme se bavili chvíli anglicky a pak přišla otázka: "Musím se zeptat, jste z Česka?" – obrovský icebreaker a pěkně jsme se pobavili.

### The State of Backstage in 2025

Kdo neznáte [Backstage](https://backstage.io) – je to nástroj/framework pro tvorbu interních developer portálů, který před pěti lety vznikl ve Spotify. Developer portal je tedy místo, kde najdete dokumentaci, API dokumentaci (OpenAPI a další), mapu, jak jsou služby provázané (service catalog) – všechno pod jednou střechou.

Protože je to framework, hlavní myšlenkou je, že komunita si má snadno psát vlastní pluginy – a taky že jo. Backstage má dnes na GitHubu [monorepo](https://github.com/backstage/community-plugins) se spoustou komunitních pluginů.

Na přednášce mluvili maintaineři o stavu Backstage a co chystají do budoucna. Tady bych chtěl vypíchnout pár věcí:

Backstage v číslech:

- Všechno nejlepší k 5. narozeninám!
- Přes 3400 uživatelů Backstage
- Více než 230 pluginů
- Skoro třicet tisíc hvězdiček na GitHubu

Scaffolder (automatizace pro bootstrapování repozitářů, API – prostě na co si vzpomenete):

- Checkpointy a podpora pro retry akcí
- Autocomplete

OpenAPI:

- Embedovaná OpenAPI dokumentace do microsite
- Testy schématu pomocí Jest frameworku
- Připravují: Scaffolder pro OpenAPI

Chystané změny:

- Přechod na nový, vlastní [design systém](https://canon.backstage.io) a opuštění Material UI

Dokumentace v Backstage:

- Předělaná navigace
- Verzovaná dokumentace (stable/next)

Aktualizace Backstage:

_Kdo Backstage používáte, víte, že práce s ní je občas celkem těžkopádná a aktualizace jsou pracné a otravné, proto..._

Přichází Yarn plugin, který usnadní aktualizace Backstage a bude si držet metadata v `backstage.json`. Hurá!

### How to Gateway with Ingress — 140 Days InGate

> Král bude mrtev, ať žije král!

Asi takhle bych popsal, co včera oznámil maintainer tým Ingress-NGINX projektu.

**Ingress-NGINX přechází do maintenance módu a verze 1.13 bude poslední, která bude obsahovat nové funkce.**

Ale není třeba panikařit – bude to dlouhý proces a tým už pracuje na náhradě s názvem InGate.

Celé jádro pudla totiž tkví v podpoře Gateway API. Kubernetes Ingress API je zmražené a už roky se do něj nic nového nepřidává – vše se teď děje v Gateway API. Navíc Ingress-NGINX je poměrně komplikovaný – hlavně co se týče testování a údržby (viz nedávné CVE se skóre 9.8).

Pár důležitých datumů k poznamenání:

- Konec roku 2025 – InGate verze 0.1
- Polovina roku 2026 – InGate je stabilní (verze 1.0)
- 2027 – Ingress-NGINX repozitář bude archivován na GitHubu

Celé tohle je docela velký a dlouhý příběh – ale o tom se rozepíšu v samostatném článku někdy příště.

### Supply Chain Security

Tohle nejsou vyloženě zápisky z jedné přednášky, spíš z několika a taky z toho, jak jsem se bavil s různými lidmi.

**Supply chain security** je prostě velké téma – a i když je dnes nástrojů k dispozici spousta, pořád je to oblast, se kterou si často neví rady ani ti nejzkušenější.

Co je pozitivní: problém si uvědomuje téměř každý a začínají se objevovat integrace a podpora napříč celým spektrem platforem a nástrojů. Například GitHub podporuje tzv. **attestations** pro všechny GitHub Packages. OCI specifikace na to taky pamatuje (nejen attestations, ale i SBOMy, podpisy…).

A dokonce i vlády už zjistily, že tohle je problém – a začínají vyžadovat např. SBOMy pro své projekty. Což je podle mě jen dobře.

Asi nejpopulárnější nástroj dnes je [Sigstore](https://www.sigstore.dev), který řeší podpisy, autenticitu – a i co dělat, když je kompromitován podpisový klíč.

Na druhou stranu, ruku na srdce – kdo na supply chain security myslí od začátku projektu? Pro spoustu lidí a projektů je to až N-tá věc, kterou začnou řešit, když je k tomu donutí okolnosti – třeba právě legislativa. A tady si dovolím tvrdit, že tohle se musí změnit. Supply chain security u knihoven by měla být **velká priorita**, ne až „afterthought“.

## Další články

_Sem budu v průběhu týdne doplňovat další články z každého dne konferencí._

- [Rejekts 2025 v Londýně – první den](/blog/rejeckts-2025-prvni-den)
- [Rejekts 2025 v Londýně – druhý den](/blog/rejeckts-2025-druhy-den)
- [KubeCon přidružené akce 2025 v Londýně](/blog/kubecon-pridruzene-akce-2025)
- [KubeCon 2025 v Londýně – první den](/blog/kubecon-2025-prvni-den) _(tento článek)_
