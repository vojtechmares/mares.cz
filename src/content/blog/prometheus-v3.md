---
title: Prometheus v3.0!
description: Po více jak 7 letech vychází nová major verze Promethea 3.0! Co je nového, co se mění a co bylo odstraněno najdete v článku.
keywords: ["prometheus", "upgrade", "opentelemetry", "otel", "monitoring"]
tags: ["prometheus"]
draft: false
publish_time: 2024-11-18
---

![Prometheus logo](https://cdn.mares.cz/prometheus_logo_small_342fd1fef1.png)

Po více jak 7 letech vychází nová velká verze Promethea 3.0! Mimo odstranění nepodporovaných funkcí, přichází nativní podpora Open Telemetry, nové UI a další...

## Novinky

Vše, co je nového v Prometheovi 3.0.

### Nové UI

![prom3_new_ui_1.png](https://cdn.mares.cz/prom3_new_ui_1_934d5fa252.png)
![prom3_new_ui_2.png](https://cdn.mares.cz/prom3_new_ui_2_62d734851d.png)

Nové UI je inspirované PromLens, je čistější a víc "uhlazené".

Dočasně se dá přepnout na staré UI pomocí feature flagu old-ui, kdyby někdo opravdu hodně chtěl.

Protože nové UI zatím není tak otestované, je možné že se objeví nějaká ta chybka a autoři proto prosí, abyste takové bugy nahlásili na GitHubu.

### Remote Write 2.0

Remote-Write 2.0 je další iterací Prometheus remote-write protokolu, která přidává nativní podporu pro nové elementy jako metadata, timestampy a nativní historgramy. Zároveň díky chytré práci s řetězci (string interning) zmenšují množství dat přesouvaných po síti a zatížení CPU. Dále je zlepšená podpora částečného zápisu a poskytnutí klientům více informací, pokud se to stane. Více informací najdete ve specifikaci remote-write 2.0.

### UTF-8

Prometheus nyní podporuje všechny validní UTF-8 znaky v metrikách a labelech. V hodnotách je UTF-8 podporováno už ve verzích 2.x.

Pokud by bylo něco špatně nakonfigurováno na straně klienta nebo serveru, pak se automaticky vrací Prometheus k původnímu chování: escapování pomocí podtržítka (\_). PromQL query mohou být nyní psány v úvozovkách, aby podporovaly UTF-8 kódování. Nebo uživatelé mohou specifikovat **name** label ručně.

Aktuálně UTF-8 plně podporuje pouze Prometheus knihovna pro Go (Golang). Ale podpora dalších jazyků je přislíbená co nejdřív.

### Open Telemetry

Prometheus letos na jaře oznámil podporu Open Telemetry a že na ní pracují. První část už přišla dříve do verze 2.x, ale nyní s verzí 3.0 jsme se dočkali rozšířené podpory Open Telemetry.

### OTLP Ingestion

Prometheus nyní podporuje konfiguraci aby fungoval jako nativní přijímač metrik v OTel formátu a to pomocí /api/v1/otlp/v1/metrics endpointu.

Více v dokumentaci.

### UTF-8 Normalizace

S Prometheem 3.0 a podporou UTF-8 je nyní možné ukládat a dotazovat se na OpenTelemetry metriky bez nutnosti upravovat query do podtržítkové notace (escaping).

## Breaking changes

Seznam aktuálně podporovaných API ve verzi 3.0 je tady a návod jak zmigrovat na Prometheus 3.0 tady.

## Výkon a optimalizace

Následující obrázky jsou z Prometheus instance s 8 CPU a 49 GB RAM.

- 2.0.0 (před 7 lety)
- 2.18.0 (před 4 lety)
- 3.0.0 (dnes)

![prom3_perf_1.png](https://cdn.mares.cz/prom3_perf_1_492e37be45.png)
![prom3_perf_2.png](https://cdn.mares.cz/prom3_perf_2_b08d0c6477.png)

## Prometheus Operator

V době psaná článku (11. listopadu 2024) zatím Prometheus 3.0 nepodporuje Prometheus Operator (pro Kubernetes), ale už od prvního RC releasu usilovně testují kompatibilitu a pracují na podpoře nové verze 👍

Pokud vás zajímá co vše dalšího se změnilo, koukněte na oznámení o vydání Promethea 3.0 přímo na webu Promethea.
