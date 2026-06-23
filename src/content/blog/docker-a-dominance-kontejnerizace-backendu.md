---
title: Docker a dominance kontejnerizace backendu
description: V tomhle článku se budu věnovat historii kontejnerů, kontejnerizaci aplikací a historii orchestrace kontejnerů.
keywords:
  ["docker", "kontejner", "backend", "kubernetes", "docker swarm", "apache mesos", "hashicop nomad", "12factor app"]
tags: ["kontejnery", "kubernetes"]
trainingAd: docker
draft: false
publish_time: 2024-09-10
redirectFrom: ["docker-and-backend-containerization-dominance"]
alternate: "docker-and-backend-containerization-dominance"
---

V tomhle článku se budu věnovat historii kontejnerů, kontejnerizaci aplikací a historii orchestrace kontejnerů.

## Co je to kontejner?

Než se můžeme vůbec bavit o čemkoliv, pojďme si připomenout, co je vlastně kontejner.

Kontejner je balík, který obsahuje aplikaci a všechny její závislosti.
Když spustíme takovou kontejnerizovanou aplikaci, engine nebo runtime (například Docker),
ta zajistí že proces aplikace běží izolovaně od ostatních procesů na hostitelském stroji.
Izolací se myslí oddělení souborového systému, síťových rozhraní (každý kontejner má svůj vlastní `localhost`), procesů.
A také nám umožňuje limitovat, kolik zdrojů (CPU, RAM, disk) může kontejner využít.

### Slovník

V článku budu používat několik českých i anglických výrazů. A protože se tyto pojmy často přetěžují
a mývají mnoho významů, chtěl bych je zde definovat, jak je budu používat já:

- **container** - kontejner, tedy instance kontejneru (běžící aplikace)
- **image** - obraz kontejneru, tedy šablona, ze které se vytvoří kontejner nebo také artefakt
- **build** - proces vytvoření obrazu kontejneru (jak ze zdrojového kódu aplikace vytvořím image)
- **runtime** nebo **engine** - proces, který běží na hostitelském stroji a stará se o spouštění, vypínání, restarty, konfiguraci apod. kontejnerů (běžící procesy)
- **registry** - místo, kde se ukládají image (obrazy) kontejnerů, veřejné i soukromé
- **Open Container Initiative (OCI)** - standardizace kontejnerů, kterou vytvořili Docker, CoreOS a další, aby bylo možné kontejnery snadno přenášet mezi různými runtime (enginy)
- **OCI specifikace** - specifikace, tj. definovaný formát image
- **CRI specifikace** (Container Runtime Interface) - specifikace, jakým způsobem může orchestrátor (např. Kubernetes) komunikovat s runtime (enginem)
- **orchestrace** - správa a spouštění kontejnerů na více hostitelích, tedy nástroj pro správu a spouštění kontejnerů na více hostitelích

## Síla kontejnerů

Jak jsem psal, kontejnery řeší izolaci aplikace od hostitelského stroje, ale to není všechno.

Díky kontejnerům a jejich build procesu, který se dá spustit znovu a znovu kdekoliv a výsledek je vždy stejný,
se kontejnery staly univerzálním řešením problému "It works on my machine".

![docker-was-born.jpeg](https://cdn.mares.cz/docker_was_born_0a36fc3f36.jpeg)

### Cože jsou tedy ty výhody?

- build se dá dělat opakovaně se stejným výsledkem (deterministický build)
- kontejner je izolovaný, tedy nemůže ovlivnit ostatní kontejnery nebo hostitelský stroj
- znovupoužitelnost: kontejner si můžu spustit kolikrát chci a kde chci (pokud mám dostatek zdrojů)
- rozšířenost: jedná se dnes o velmi známý koncept a stal se de-facto standardem jak buildit aplikace (samozřejmě jsou výjimky)
- distribuce: díky specifikaci, jak má image vypadat (například OCI), je snadné image nahrát, uložit a stáhnout prakticky kdekoliv, stačí nám přístup na internet

## Docker

![Docker Inc. logo](https://cdn.mares.cz/docker_logo_blue_c2bfc3ed50.png)

[Docker](https://www.docker.com/) je: projekt, společnost, container runtime (engine), build tool, image registry a nástroj pro orchestraci.

To je na jedno slovo moc, pojďme si to rozepsat:

- Docker container & image - to základní, co typicky myslíme, když se bavíme o Dockeru a kontejnerech. Tedy image a kontejner, jak jsem popsal výše, běžící proces

- Docker Inc. - společnost, který stojí za projektem Docker.

- [Docker Hub](https://hub.docker.com/) - největší veřejné registry images (obrazů), typické místo kam open-source projekty publikují svoje image (obrazy)

- [Docker Engine](https://docs.docker.com/engine/) - runtime, který běží na hostitelském stroji a stará se o spouštění, vypínání, restarty, konfiguraci apod. kontejnerů (běžící procesy), zároveň umí ale i vytvářet image (obrazy) kontejnerů, tj. build

- [Docker Compose](https://docs.docker.com/compose/) - nástroj pro definici a spouštění multi-container aplikací, tedy aplikací, které se skládají z více kontejnerů

- [Docker Swarm](https://docs.docker.com/engine/swarm/) - orchestrace kontejnerů, tedy nástroj pro správu a spouštění kontejnerů na více hostitelích, dnes vcelku upadá a byl prakticky převálcován [Kubernetes](https://kubernetes.io/)

## Alternativy k Dockeru

- [Podman](https://podman.io/) - náhrada Dockeru, ale bez potřeby běžet jako daemon, tedy bez nutnosti být rootem

- [Orbstack](https://orbstack.dev/) (pouze macOS) - náhrada Dockeru, ale s lepší integrací do macOS

- [Linux Containers (LXC)](https://linuxcontainers.org/) (a LXD) - virtualizace na úrovni OS, tedy kontejnery, ale bez Dockeru, dnes již podporují OCI, nativní podporu mají například v [Proxmoxu](https://www.proxmox.com/en/proxmox-virtual-environment/overview) nebo [OpenStacku](https://www.openstack.org/)

## Jméno image a tag

Každý image má vlastní jméno, které slouží k například k zvolení registry, kam image cheme uložit pomocí push operace.
A tag je identifikátor konkrétního buildu. Může se jednat například o git commit hash, git tag nebo něco jiného.

Image které nemají registry, se automaticky berou z [Docker Hubu](https://hub.docker.com), které je brané jako výchozí registry.

Dalšími veřejným registry jsou například [Quay.io](https://quay.io/) nebo [GitHub Container Registry (ghcr.io)](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

Abychom mohli udělat push například do GHCR, musí název imagu obsahovat jeho URL `ghcr.io/vojtechmares/container-images/cikit`.

Build a push by pak vypadal takto:

```sh
export TAG="some-tag"

docker build -t ghcr.io/vojtechmares/container-images/cikit:$TAG .
docker push ghcr.io/vojtechmares/container-images/cikit:$TAG
```

### Tag

Tag slouží k verzování jednotlivých buildů. Pokud nezvolíme tag, použije se automaticky `latest`.

Na vývojářské verze stačí typicky git commit hash, ale pro produkční verze doporučuji použít verzi, například git tag,
aby bylo vidět, ke které verzi zdrojového kódu konkrétní image patří. Což sice commit hash splňuje taky,
ale lidé si je typicky moc nepamatují 😄.

Pro větší přehlednost používám pro vývojové verze tag ve formátu `$BRANCH-$SHORT_COMMIT_HASH`, tedy například `main-09a682bf`.
A pro release verzi s prefixem `v` a tagem, tedy například `v1.17.4`.

Díky tomu snadno nastavím v GitLabu pravidla pro mazání starých tagů, aby mi nezabírali místo, ale nechávám všechny release verze.

A pro build a push v GitLab CI vypadá moje pipeline takto:

```yaml
stages:
  - build
  # ...

build:docker:
  stage: build
  image: docker:git
  services:
    - docker:dind
  variables:
    IMAGE: $CI_REGISTRY_IMAGE
    TAG: $CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
    - docker info
  script:
    - docker buildx create --name website --use
    - docker buildx build --provenance=false --platform linux/amd64,linux/arm64 -t $IMAGE:$TAG --push .
    - docker manifest inspect $IMAGE:$TAG
# ...
```

Pokud nechcete používat `services`, můžete nakonfigurovat runner aby rovnou měl v sobě Docker socket.
Což s sebou ale nese bezpečností riziko a je třeba tedy takovou konfiguraci dobře zvážit.
Víc se o GitLab CI rozepíšu někdy příště. Pokud vás ale zajímá taková konfigurace, koukněte do [dokumentace GitLabu](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html).

## Efektivní build kontejneru

Kontejnery jsou sice fajn a všechno se dá nacpat do jednoho `Dockerfile` a hotovo, nic extra.
To je sice cesta, ale ne moc optimální. s `Dockerfile` se dá pracovat nebo využít jiných nástrojů,
pro build imagů, tak aby byl výsledek co nejmenší.

- `Dockerfile` - soubor, ve kterém popíšeme, jak má být kontejner vytvořen
  Příklad pro Node.js:

  ```dockerfile
  # syntax=docker/dockerfile:1
  FROM node:lts

  WORKDIR /app

  COPY package*.json ./

  RUN npm install

  COPY . .

  RUN npm run build

  CMD ["node", "index.js"]
  ```

  A build:

  ```sh
  # v aktuální složce se musí nacházet `Dockerfile`
  docker build -t $IMAGE:$TAG .
  ```

- **multi-stage `Dockerfile`** - technika, kdy vytvoříme několik obrazů, kde každý obraz je určený pro jednu část aplikace (např. build, test, runtime)

  Příklad multi-stage `Dockerfile` pro Node.js, který využívám pro build tohoto 😉 webu:

  ```dockerfile
  # syntax=docker/dockerfile:1
  FROM node:20-alpine AS base

  # 1. Install dependencies only when needed
  FROM base AS deps
  # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
  RUN apk add --no-cache libc6-compat

  WORKDIR /app

  # Install dependencies based on the preferred package manager
  COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
  RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

  # 2. Rebuild the source code only when needed
  FROM base AS builder
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  # This will do the trick, use the corresponding env file for each environment.
  # COPY .env.production.sample .env.production
  RUN npm run build

  # 3. Production image, copy all the files and run next
  FROM base AS runner
  WORKDIR /app

  ENV NODE_ENV=production

  RUN addgroup -g 1001 -S nodejs
  RUN adduser -u 1001 -S nextjs

  COPY --from=builder /app/public ./public

  # Automatically leverage output traces to reduce image size
  # https://nextjs.org/docs/advanced-features/output-file-tracing
  COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
  COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
  COPY --from=builder --chown=nextjs:nodejs /app/images ./images

  USER nextjs

  EXPOSE 3000

  ENV PORT=3000
  # ENV HOSTNAME=0.0.0.0

  CMD node server.js
  ```

  Díky rozdělení do mnoha stage a kopírování jen toho nezbytného, má výsledný image necelých 90MB vč. obrázků, na rozdíl od původních 500MB když jsem začínal na čistém `node:lts` image.

### Optimalizace výsledného obrazu

- **multi-stage build** - výsledný image obsahuje pouze build aplikace a nezbytné závislosti, ale třeba testy můžeme vypustit

- **Alpine vs Debian** - změnou základního image můžeme ušeitřit i destíky MB, například Alpine je skvělou volbou, pozor ale na kompatibilitu: Alpine stojí nad Musl, zatímco Debian používá glibc, pokud potřebujeme glibc, zvažte `debian-slim`

- **distroless** - naprosto minimalistický image, bez shellu (bash, sh,...) a dalších systémových nástrojů, obsahuje pouze konfiguraci DNS resolveru a glibc, ale je potřeba aby aplikace byla soběstačné nebo využít distroless base pro Node.js nebo JVM zvlášť

- **alternativy** - alias, specifické nástroje pro jazyky (ko.build, Jib,...) - nástroje, které vytvoří image na ze zdrojového kódu a starají se jak o build aplikace tak image jako takové a není třeba se starat o `Dockerfile`, což je velice snadné, ale ztrácíme tak část kontroly nad build procesem

### Docker buildx

[Docker buildx](https://docs.docker.com/buildx/working-with-buildx/) je nástroj, který umožňuje vytvářet image pro různé platformy (amd64, arm64, armv7, ppc64le, s390x, ...), tedy například pro Raspberry Pi, ale i pro cloudové prostředí, kde běží jiná architektura než na vývojovém stroji.

Je to skvělý způsob, jak buildit tzv. multi-platformní image, pro vícero architektur bez nutnosti dělat build na cílových strojích.

Příklad buildu pomocí `docker buildx`:

```sh
# vytvoříme instanci buildx builderu
docker buildx create --name website --use

# build jako takový s --platform flagem
docker buildx build --platform linux/amd64,linux/arm64 -t $IMAGE:$TAG --push .
```

## Build nástroje

Protože ekosystém světa kontejnerů zažívá už několik let obrovský boom, rozrůstá se i množství nástrojů,
které nám pomáhají vytvářet image (obrazy) kontejnerů.

- Docker & Dockerfile - nejběžnější způsob jak vytvořit image, bohužel Docker není úplně nejrychlejší (hlavně na macOS), pro build je potřeba aby Docker daemon běžel jako root a uživatel kterým děláme build měl přístup k Docker socketu (tedy široká oprávnění), což z hlediska bezpečnosti je celkem riziko

- [Kaniko](https://github.com/GoogleContainerTools/kaniko) - open-source nástroj od Googlu, kterým je možná buildit image na Kubernetes, bez nutnosti provádět build v privilegovaném kontejneru, výsledný image je OCI-kompatibilní, avšak stále mívá o něco více MB, než při použití Dockeru

- [Buildah](https://buildah.io/) - nástroj pro build OCI image, je to nezávislý open-source nástroj a zajímá alternativa k Dockeru

- [Podman](https://podman.io/) - jedná se open-source alternativu k Dockeru, který je plně kompatibilní a můžete použít alias `docker` místo `podman`, ale bez nutnosti běžet jako root a jakýchkoliv změn, což je super pro bezpečnost, Podman silně podporuje RedHat a proto je často vidět v jeho prostředí od Fedory, přes RHEL až po Fedora CoreOS

- [Buildpacks](https://buildpacks.io/) - jsou open-source projekt [CNCF](https://www.cncf.io/), který vznikl z Heroku Buildpacks, a umožňuje vytvořit image z kódu, tedy zdrojového kódu aplikace, a ne z Dockerfile, což je skvělé pro vývojáře, kteří nechtějí řešit Dockerfile, ale chtějí mít image, který je co nejmenší a nejefektivnější, na druhou stranu Buildpacks přináší jisté limitace a nejsou tak flexibilní jako `Dockerfile`

- Specifické nástroje pro jazyky
  - [ko.build](https://ko.build/) (Golang) - jednoduchá open-source aplikace, které vytvoří image z Golang aplikace, stačí říct, kde najde `main.go` a o zbytek se postará, konfigurace je pouze přes environment proměnné a je tedy při práci v terminálu trochu kostrbatá, v CI ale skvělý nástroj

  - [Jib](https://github.com/GoogleContainerTools/jib) (Java) - v zásadě Ko ale pro Javu 😄

## 12-factor app

[12-factor app](https://12factor.net/) je metodologie, jak psát moderní aplikace, které jsou snadno škálovatelné a nasaditelné do cloudu.

Dvanáct bodů, které tvoří "12-factor app":

> 1. Codebase - One codebase tracked in revision control, many deploys
> 2. Dependencies - Explicitly declare and isolate dependencies
> 3. Config - Store config in the environment
> 4. Backing services - Treat backing services as attached resources
> 5. Build, release, run - Strictly separate build and run stages
> 6. Processes - Execute the app as one or more stateless processes
> 7. Port binding - Export services via port binding
> 8. Concurrency - Scale out via the process model
> 9. Disposability - Maximize robustness with fast startup and graceful shutdown
> 10. Dev/prod parity - Keep development, staging, and production as similar as possible
> 11. Logs - Treat logs as event streams
> 12. Admin processes - Run admin/management tasks as one-off processes

Proč o 12-factor píšu? Díky kontejnerům se stalo neskutečně snadné používat tuto metodologii.
A díky její přímočarosti platí totéž i pro kontejnerizaci, jde to prakticky ruku v ruce. A zároveň dnešní nástroje pro provoz
kontejnerů, jako Kubernetes, umožňují přesně takto aplikace provozovat.

## Orchestrace

Síla kontejnerů ale není jen v jejich přenositelnosti a univerzálnosti. Kontejnery se neskutečně rozmohly díky rozvoji nástrojů pro jejich orchestraci.
Neboli softwaru, který se stará o provoz kontejnerů napříč několika stroji. A to i v řádu tisíců strojů v clusteru!

Jedním z průkopníků orchestrace kontejnerů byl Google, který v roce 2003 začal tvořit interní nástroj Borg, kterým spravovali všechny své clustery a provozovali v něm všechny aplikace.
Z Borgu následně vychází open-source projekt Kubernetes, který založili v Googlu v roce 2014. Více o historii Kubernetes jsem psal v čláku [Proč Kubernetes?](/blog/proc-kubernetes#trochu-v%C3%ADc-historie).

Níže jsem se rozepsal o populárních nástrojích pro orchestraci, od managovaných služeb až po řešení, které si můžete provozovat sami.

### Docker Swarm

Swarm byl jedním z prvních veřejně dostupných řešeních pro provoz kontejnerizovaných apliací na více strojích zároveň.

Je to velice jednoduchý nástroj, ale nikdy se úplně neprosadil. Pokud chcete provozovat více kontejnerů, pro jeden stroj si vystačíte s Docker Compose.
A pro více strojů, je lepší zvolit něco jiného, například Kubernetes které je flexibilnější a umožňuje větší kontrolu a snadnou škálovatelnost.

### Apache Mesos

Mesos není úplně nástroj pro orchestraci, spíše by se dal přirovnat k "operačnímu systému pro datacentrum", který umožňuje spouštět různé aplikace, včetně kontejnerů, na více strojích zároveň.

Mesos je letitý projekt, který vznikl v roce 2009 a první release měl v roce 2010. Projekt v byl v roce 2021 málem opuštěn, ale nakonec se tak nestalo,
kvůli jeho rozšířenosti u legacy řešení.

Dnes je ale spíš otázkou času, než Mesos zmizí z produkčních prostředí úplně. Například Apache Spark označil podporu pro Mesos jako _deprecated_ ve verzi 3.2 (2021) a podpora bude kompletně ukončena v blízké budoucnosti.

### HashiCorp Nomad

Nomad je nástroj od HashiCorpu, který se snaží být jednoduchý, ale zároveň dostatečně flexibilní pro běh kontejnerizovaných ale i nekontejnerizovaných aplikací.
A to ať na vlastním železe nebo v cloudu.

Nomad je celkem oblíbený pro jeho jednoduchost, ale jako všechny nástroje pro orchestraci kontejnerů, byl převálcován Kubernetes.

### Kubernetes

Nejznámější, nejrozšířenější a prakticky standard pro orchestraci a provoz kontejnerů. Jak v cloudu tak na vlastních strojích.

Jak jsem psal, Kubernetes vychází z interního nástroje Googlu Borg, který byl vyvíjen od roku 2003 a v roce 2014 se zrodilo Kubernetes jako open-source projekt,
který umožňuje komukoliv provozovat aplikace na více strojích zároveň v kontejnerech.

Díky CNCF (Cloud Native Computing Foundation) vznikl kolem Kubernetes a cloud-native aplikací a nástrojů obrovský ekosystém,
který celý tento kolotoč posouvá kupředu.

**CNCF** je nezisková organizace spadající pod [Linux Foundation](https://www.linuxfoundation.org/), která se stará o rozvoj cloud-native technologií a nástrojů.
Aktuálně její roční rozpočet je přes $150M ročně a díky široké členské základně mnoha firem, je celkem imuní vůči zániku jednotlivých firem.
A tedy její projekty jsou dlouhodobě v bezpečí a dá se na ně spolehnout, že ze dne na den nezaniknou. A zároveň všechny CNCF projekty jsou open-source pod licencí Apache 2.0.

### Kamal

[Kamal](https://kamal-deploy.org/) (původně MRSK), který vytvořil [David Heinemeier Hansson](https://dhh.dk/), autor frameworku Ruby on Rails a CTO [37signals](https://37signals.com/).

Hansson založil Kamal, který staví nad Dockerem a několika bash skripty, napříč několika stroji. Vadilo mu, že všechny ostatní nástroje jsou neskutečně komplikované a vyžadují celé týmy lidí,
kteří se o ně budou starat, jako třeba Kubernetes. Zároveň s odchodem 37signals z cloudu na vlastní železo, nechtěl žádné šílené řešení a tak vzniknul Kamal.

Více o příběhu Kamalu na blogu Hey [Kamal 1.0](https://world.hey.com/dhh/kamal-1-0-5304ff9e).

V Českých končinách na Kamalu běží například [Fakturoid](https://www.fakturoid.cz/).

### Google Cloud Run

[Google Cloud Run](https://cloud.google.com/run) je služba od Googlu, která umožňuje spouštět kontejnerizované aplikace na Google Cloud Platform.

Cloud Run je dnes postavený nad Kubernetes a [Knative](https://knative.dev/docs/), takže si jej teoreticky můžete postavit sami na vlastním železe, ale to není myšlena Cloud Run.
Cloud Run naopak řeší všechny problémy s provozováním kontejnerů za vás. Takže akorát je třeba říct jaký image a kolik replik popř. škálovací pravidla.

Cloud Run je velmi pohodlná služba pro provozování kontejnerizovaných aplikací, ale za takový komfort si také připlatíte.

### AWS Fargate

[Fargate](https://aws.amazon.com/fargate/) je služba od Amazonu, která umožňuje spouštět kontejnerizované aplikace na AWS.
Prakticky se jedná o alternativu ke Google Cloud Run, ale od Amazonu.

Na rozdíl od Cloud Run ale Fargate stojí na [Firecrackeru](https://firecracker-microvm.github.io/), což je Amazon technologie pro spouštění takzvaných microVM.
Jedná se tedy o kompletní virtualizaci operačního systému, ale extrémě optimalizovanou na rychlost. Firecracker je dnes backendem nejen pro Fargate, ale i pro AWS Lambda.

### Fly.io

[Fly.io](https://fly.io/) je nový hráč na poli provozování kontejnerizovaných apliakcí.
Nabízí jednoduché rozhraní a celkově se jedná o velice pohodlnou službu, na které snadno spustíte i databázi, kterou potřebujete,
připojíte storage apod. to vše v kontejnerech.

Fly.io nesází na Kubernetes, ale na vlastní systém, který je komplet postavený od nuly v [Rustu](https://www.rust-lang.org/) a sítě jsou postavené nad [WireGuardem](https://www.wireguard.com/).
