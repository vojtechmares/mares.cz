---
title: S3 jako FTP cloudu
description: V článku se podíváme zblízka na AWS S3, neboli object storage a jak se stalo prakticky standardem pro cloudová úložiště. Mimo to se podíváme na cloudová a i self-hosted řešení.
keywords: ["s3", "aws", "object storage", "cloud", "cloud native"]
tags: ["object-storage"]
draft: false
publish_time: 2024-10-28
---

V článku se podíváme zblízka na AWS S3, neboli object storage a jak se stalo
prakticky standardem pro cloudová úložiště. Mimo to se podíváme na cloudová a i
self-hosted řešení.

## Co je S3

S3 neboli Simple Storage Service je cloudové úložiště (popř. object storage) od
Amazonu (AWS), které vám umožňuje s pomocí velmi jednoduchého API ukládat a
spravovat neomezené množství dat (objektů).

Úložiště je tzv. "bucket" (kýbl), do kterého můžete ukládat soubory (objekty).

Díky standardizovanému API a SDK snad pro každý programovací jazyk, je S3 velmi
snadné použít a integrovat.

S3 zároveň nabízí i mnoho dalších funkcnionality, jako například:

- šifrování dat
- verzování - podobně jako Git, ukládá S3 všechny verze souborů
- lifecycle management - automatické přesunutí souborů do jiných storage class,
  mazání starých souborů nebo verzí
- storage classes - různé typy úložiště s různými cenami a dostupností

### Vznik S3

S3 vzniklo v Amazonu v roce 2006. Jak Amazon rostl a potřeboval stále víc a víc
infrastruktury, interně tvořili různé nástroje, API a služby, které jim
usnaňovaly práci s infrastrukturou (hardwarem) a daty. A zároveň jim došlo,
že taková řešení by se mohly hodit i dalším firmám a tak vzniklo AWS: Amazon Web
Services.

S3 bylo jednou z prvních služeb, které Amazon nabídl a bylo to úplně první
cloudové úložiště.

Díky vysokým S3 limitům (max. 5TB na objekt a max. 5GB na požadavek na nahrání,
jinak se nahrávání musí rozdělit přes multipart upload), dostupnosti, snadnému
API, ceně a hlavně obrovské spolehlivosti (AWS dnes garantuje 99.999999999%
spolehlivost) se tedy S3 stalo rychle extrémně populární.

Zároveň AWS přišlo s SDK (Software Development Kit) pro mnoho jazyků, což také
velmi usnadnilo a pomohlo adopci S3.

## Object Storage FTW!

Object storage je sjednocující název nad všemi různými implementacemi cloudového
úložiště.

Postupem času se všichni cloudoví poskytovatelé, ale i projekty pro self-hosted
řešení pustili do implementace vlastního object storage řešení.

A dnes tedy máme následující možnosti:

| **Název**                          | **API**      | **Infrastruktura** |
| ---------------------------------- | ------------ | ------------------ |
| AWS S3                             | S3           | Cloud              |
| GCP Cloud Storage<sup>1</sup>      | vlastní + S3 | Cloud              |
| Azure Blob Storage<sup>1</sup>     | vlastní + S3 | Cloud              |
| Cloudflare R2                      | S3           | Cloud              |
| Digital Ocean Spaces               | S3           | Cloud              |
| Hetzner Object Storage<sup>2</sup> | S3           | Cloud              |
| Ceph Object Gateway                | S3           | Self-hosted        |
| OpenStack Swift                    | S3           | Self-hosted        |
| MinIO                              | S3           | Self-hosted        |
| Garage                             | S3           | Self-hosted        |

1. Google Cloud Storage a Azure Blob Storage mají vlastní API, ale podporují
   také S3 bez nutnosti jakékoliv změny v kódu a usnadňují tak adopci jejich
   object storage řešení.
2. Hetzner Object Storage je dostupný od listopadu 2024 a je tedy nejnovější
   člen rodiny poskytovatelů object storage.

### AWS S3

https://aws.amazon.com/s3/

Jako první se zblízka podíváme na AWS S3. Tedy na průkopníka a vlastně
originál.

AWS dnes nabízí S3 snad ve všech regionech a nabízí všechny funkcionality
dostupné v rámci S3 API (ještě aby ne, když S3 vytvořili 😄).

- šifrování dat
- verzování
- lifecycle management
- storage classes
- hostování statického obsahu přes HTTP
- ACL (Access Control List)
- _a mnoho dalšího_

### Cloudflare R2

https://www.cloudflare.com/en-gb/developer-platform/r2/

Cloudflare na konci září 2021 oznámilo své object storage řešení R2, které
je postavené na S3 API, sice nepodporuje všechny S3 API funkce. Ale obrovským
tahákem je, že má nulovou cenu za egress (tj. přenos dat z úložiště ven).

Zároveň je dnes R2 velmi pěkně integrované do dalších Cloudflare služeb, jako
například [Cloudflare Cache Reserve](https://developers.cloudflare.com/cache/advanced-configuration/cache-reserve/#cache-reserve).

Zároveň díky "zero egress fees" je velmi zajímavé řešení pro distribuci
statického obsahu, jako třeba instalaci softwaru, sdílení obrázků nebo obecně
souborů.

Cloudflare R2 má poměrně jednoduchý cenový model:

- $0.015 / GB / měsíc, prvních 10 GB je zdarma
- $4.50 / milion požadavků typu A, první milion je zdarma
- $0.36 / milion požadavků typu B, prvních deset milionů je zdarma

> Požadavek **typu A** je například nahrávání objektů, listování obsahu bucketu
> nebo listování bucketů jako takových. Požadavek **typu B** je stahování
> objektů. Platíte tedy za to, že chcete objekt stáhnout, ale ne za přesnos dat
> do internetu.

### OpenStack Swift

https://wiki.openstack.org/wiki/Swift

[OpenStack](https://www.openstack.org/) je open-source cloudová platforma, která
vznikla v roce 2010 a je dnes velmi populární pro self-hosted cloudová řešení.
OpenStack nabízí řadu komponent, které můžete kombinovat a vytvořit si tak
vlastní cloud na míru, dle toho co potřebujete vy.

OpenStack Swift je tedy právě komponentou pro object storage. Swift je postavený
nad S3 API, ale nenabízí všechny S3 API funkce.

### MinIO

https://min.io/

[MinIO](https://min.io/) je open-source object storage řešení, které je
postavené na S3 API a umožňuje vám tak snadno self-hostovat vlastní object
storage.

MinIO je samostatný projekt, který můžete nasadit mnoha různými způsoby, od
instalace přes systémové balíčky, Docker až po Kubernetes operator. Díky tomu je
MinIO velmi flexibilní.

Pokud vám nestačí funkce dostupné v rámci open-source varianty, můžete zakoupit
komerční verzi MinIO Enterprise. Nutno však dodat, že enterprise verze je dost
drahá a je tedy na zvážení, jestli se vám enterprise vyplatí.

## S3 je tedy nové FTP?

**TL;DR: Ano a ne.**

S3 jako technologie dnes umožňuje spoustu věcí, od ukládání snad neomezeného
množství souborů (a složek) přes šifrování, verzování a různé "storage classes"
až po hostování statického obsahu na webu.

Některé z těchto věcí už umělo FTP, ale to má své limity. Zatímco S3 se zdá být
neporazitelné. Jediné, co je do jisté míry s S3 stále dnes komplikované, je
self-hosting z mé zkušenosti, ale MinIO se toto daří změnit.

Takže S3/object-storage se stal prakticky univezráním API pro cloudové a i
serverless aplikace, těší se obrovské popularitě a podpoře napříč mnoha
projekty. Pokud tedy hledáte řešení pro ukládání dat jinak než přímo na
souborový systém, s S3 neuděláte chybu.
