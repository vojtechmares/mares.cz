---
title: GitLab CI vs GitHub Actions
description: V tomhle článku se rozepíšu o velice populárních CI/CD nástrojích GitLab CI a GitHub Actions. A to nejen z hlediska pipeliny, ale i runnerů a dalších funkcí.
keywords:
  ["git", "ci", "runner", "gitlab ci", "github actions", "gitlab", "github"]
tags: ["continuous-integration"]
trainingAd: github-actions
draft: false
publish_time: 2024-09-16
---

V tomhle článku se rozepíšu o velice populárních CI/CD nástrojích GitLab CI a GitHub Actions.
A to nejen z hlediska pipeliny, ale i runnerů a dalších funkcí.

## GitLab vs GitHub

[GitHub](https://github.com/) i [GitLab](https://gitlab.com/) jsou nástroje a plaformy pro hostování Git repozitářů a dnes nabízí řešení pro automatizování
testování a nasazování aplikace neboli CI/CD. GitHub je dnes nejznámější a nejpopulárnější platformou a stal se prakticky domovem pro téměř všechny open-source projekty.

Asi největším rozdílem je, že GitHub je closed-source a vlastní instanci je možné získat pouze skrze GitHub Enterprise,
zatímco GitLab je open-source a je možné si jej hotovat na vlastním serveru a není třeba licence, ale je možné si ji zakoupit
a získat tak další funkce.

GitHub nabízí placené funkce pro jednotlivce i firmy (týmy).
Zatímco placené licence GitLabu míří pouze na firmy (nic vám ale nebrání si pořídit licenci pro sebe).

To ale není všechno co nám dnes tyto platformy nabízí. GitHub i GitLab nabízí služby pro hostování jak balíčků
(NPM, Maven, Pip, Nuget,...) tak i OCI images (Docker image). A další DevOps nástroje/integrace. Ale tyto funkce zmíňím buď pouze okrajově,
nebo vůbec a budu se jim věnovat v budoucnu, v dalším článku.

Dnes další velice populární GitHub služnou je GitHub Copilot, AI nástroj, který vám pomáhá psát kód. Je to takový váš parťák.
Občas si trochu vymýšlí, ale dokáže ušetřit práci. GitLab cca po roce přichází s podobným nástrojem, GitLab Duo Chat.

Poslední pro někoho důležitou informací, je že GitHub je vlastněn firmou Microsoft, zatímco GitLab je nezávislá firma, obchodovaná na burze ([Nasdaq: GTLB](https://www.nasdaq.com/market-activity/stocks/gtlb)).

## Co je to CI/CD?

CI/CD je zkratka pro Continuous Integration/Continuous Deployment (nebo Continuous Delivery),
volně přeloženo jako kontinuální/nepřetržitá integrace/nasazování.
Jedná se o proces, kdy se automaticky testuje a nasazuje kód do produkce.
CI/CD je důležité pro rychlý vývoj a nasazování aplikací.

CI je nezbytnou součástí DevOps mindsetu, jednak nám automatizuje a zajišťuje kvalitu kódu nad každou změnou,
kterou pošleme do repozitáře. A zároveň nám dává téměř okamžitou zpětnou vazbu o stavu kódu.

CI dnes typicky zahrnuje:

- spuštění testů
- kontrolu kvality kódu
- build aplikace

CD se pak stará o:

- nasazení aplikace do prostředí (development, test, staging, production,...)

### Continuous Deployment vs Continuous Delivery

Jedná se o dva velice podobné pojmy, často zaměňované. Občas ale se jimi myslí něco jiného.

Upřímně je to jedno, důležité je si říct, jestli pro vás oba pojmy znamenají to samé nebo ne.
V případě, že znamenají něco jiného, nejčastější dělení, které potkávám, je že jedno znamená plně automatické nasazování
a druhé, že je třeba ručně schválit (například kliknout na tlačítko) a nasazení se děje až potom.

## GitLab CI

Základními kameny GitLab CI jsou:

- **pipeline** - pipeline, definuje kdy se spouští a jaké jsou výchozí hodnoty (`defaults`)
- **stage** - fáze, ve které se spouští joby
- **job** - jeden úkol v rámci stage
- **include** (šablony) - znovupoužitelné části pipeline, v různých souborech, repozitářích nebo i GitLab instancích

Pipeline je vždy definována v souboru `.gitlab-ci.yml` v kořenovém adresáři repozitáře. Ale je možné následně se odkazovat na další soubory ať v tomto repozitáři nebo jiném.
Popřípadě i na jiné GitLab instanci.

### Příklady GitLab CI

Pojďme si ukázat úplně jednoduchý příklad, například pro JavaScript aplikaci:

```yaml
# .gitlab-ci.yml

defaults:
  image: node:lts

stages:
  - install
  - test
  - build
  - deploy

install:
  stage: install
  script:
    - npm ci
  # zacachujeme node_modules slozku pro dalsi joby v teto pipeline
  cache:
    paths:
      - node_modules/
    # cache se invaliduje pri zmene package-lock.json souboru
    key:
      files:
        - package-lock.json

test:
  stage: test
  script:
    - npm run test

build:
  stage: build
  script:
    - npm run build

deploy:
  stage: deploy
  script:
    - ./scripts/deploy.sh
```

Taková pipeline je krásně jednoduchá, ale v reálném světě nám taková pipeline stačit nebude. Například deployment do různých prostředí,
třeba do staging prostředí z main větve a do produkce z release větve.

K podmíněnému spuštění jobů můžeme použít `rules`:

```yaml
# .gitlab-ci.yml
# ...

deploy-staging:
  stage: deploy
  script:
    - ./scripts/deploy.sh staging
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy-production:
  stage: deploy
  script:
    - ./scripts/deploy.sh production
  rules:
    - if: $CI_COMMIT_BRANCH == "release"
```

Další užitečností je `before_script`:

```yaml
# .gitlab-ci.yml
# ...

before_script:
  - echo "Hello, world!"

test:
  stage: test
  script:
    - npm run test
```

`before_script` se spustí před každým jobem v pipeline, pokud je definován globálně. Ale je možné jej definovat jen některým jobům.
Pokud je definován jak globálně, tak i lokálně, bere se v potaz pouze lokální.

Poslední věc, kterou si ukážeme, je práce s Dockerem:

```yaml
# .gitlab-ci.yml

defaults:
  image: docker:20.10

services:
  - docker:20.10-dind

stages:
  - build

build:
  stage: build
  variables:
    DOCKER_HOST: tcp://docker:2375/
    IMAGE: $CI_REGISTRY_IMAGE
    IMAGE_TAG: $CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
    - docker info
  script:
    - docker buildx create --name $CI_PROJECT_NAME-builder --use
    - docker buildx build --provenance=false --platform linux/amd64,linux/arm64 -t $IMAGE:$IMAGE_TAG --push .
    - docker manifest inspect $IMAGE:$IMAGE_TAG
```

Nebo můžete Runner nakonfigurovat, aby měl přístup k Docker socketu přímo, to je ale z hlediska bezpečnosti rizikové.

V rámci tohoto článku se víc rozepisovat nebudu, popsat vše by totiž bylo na sérii článků asi až do Vánoc 😄.

Pokud vás zajámá GitLab CI více a nechcete číst hodiny dokumentaci, přijďte na moje [GitLab CI školení](/skoleni/gitlab-ci). Pozor, zatím jej teprve připravuji.

### Šablony

GitLab nabízí seznam [předpřipravených pipeline](https://gitlab.com/gitlab-org/gitlab-foss/tree/master/lib/gitlab/ci/templates) (šablon, templates),
tento způsob znovupoužívání kódu, je ale zastaralý a přechází se na tzv. [CI/CD Catalog](https://docs.gitlab.com/ee/ci/components/)

CI/CD Catalog najdete na jakémkoliv GitLabu verze **17.0.0** a vyšší v sekci **Explore** -> **CI/CD Catalog**. Nebo na URL `vas-gitlab.cz/explore/catalog`

Následně pak komponentu z katalogu můžete přidat do vaší pipeline:

```yaml
include:
  - component: $CI_SERVER_FQDN/my-org/security-components/secret-detection@1.0.0
    inputs:
      stage: build
```

Díky `inputs` se tedy GitLab více přibližuje k GitHub Actions a znovupoužitelnosti kódu napříč projekty.

Pokud vás zajímá CI/CD Catalog víc, koukněte na interaktivní [beta demo](https://gitlab.navattic.com/cicd-catalog).

### GitLab Runner

[GitLab Runner](https://docs.gitlab.com/runner/) je open-source projekt napsaný v Go, který je možné provozovat na Linuxu, Windows a macOS.

Asi nejsnažší způsob jak provozovat Runner je v Dockeru. GitLab Runner lze v Dockeru spustit jedním příkazem:

```bash
docker run -d \
    --name gitlab-runner \
    --restart always \
    -v /etc/gitlab-runner:/etc/gitlab-runner \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /builds:/builds \
    -v /etc/hosts:/etc/hosts \
    gitlab/gitlab-runner:latest
```

Pak je třeba Runner zaregistrovat na GitLabu (ať GitLab.com nebo vlastní GitLab instanci), já používám takovýhle shell skript (`register-runner.sh`).

Jsou potřeba 2 argumenty, případně třetí, kterým je jméno runneru, například `./register-runner.sh https://gitlab.com/ my-runner-token blog-runner-01`:

```bash
#!/usr/bin/env bash

if [ $# -z 2 ]; then
  echo "[ERROR] At least two arguments must be supplied, #1 is GitLab URl, #2 is GitLab Runner Token, #3 and optional is GitLab Runner Name"
  exit 1
fi

GITLAB_URL=$1
GITLAB_RUNNER_TOKEN=$2
GITLAB_RUNNER_NAME=${3:-$(hostname)}

docker exec gitlab-runner gitlab-runner register \
   --non-interactive \
   --url ${GITLAB_URL} \
   --registration-token ${GITLAB_RUNNER_TOKEN} \
   --name ${GITLAB_RUNNER_NAME} \
   --executor docker \
   --docker-pull-policy if-not-present \
   --docker-image docker:git \
   --docker-volumes '/var/run/docker.sock:/var/run/docker.sock' \
   --docker-volumes '/builds:/builds' \
   --docker-volumes '/etc/hosts:/etc/hosts'
```

Config Runneru bude uložený v `/etc/gitlab-runner/config.toml` a vypadá nějak takto:

```toml
concurrent = 2
check_interval = 0
user = "gitlab-runner"
shutdown_timeout = 0

[session_server]
  session_timeout = 1800

[[runners]]
  name = "blog-runner-01"
  url = "https://gitlab.com"
  id = 0
  token = "my-runner-token"
  token_obtained_at = 0001-01-01T00:00:00Z
  token_expires_at = 0001-01-01T00:00:00Z
  executor = "docker"
  [runners.docker]
    tls_verify = false
    image = "docker:git"
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    cache_dir = "/cache"
    volumes = ["/var/run/docker.sock:/var/run/docker.sock", "/builds:/builds", "/etc/hosts:/etc/hosts", "/cache:/cache"]
    pull_policy = ["if-not-present"]
    shm_size = 0
```

Zdůraznil bych pár věcí:

- `concurrent` - kolik jobů může běžet současně
- `executor` - jaký exekutor používáme, v tomto případě Docker
- `volumes` - jaké volume máme připojené do Dockeru, v mém případě `/var/run/docker.sock`, `/builds`, `/etc/hosts` a `/cache`. Jak jsem psal výše, pozor na Docker socket, je to přecijen bezpečnostní riziko. Protože Docker běží jako **root** a tedy dáváte přístup na root uživatele třetím stranám.

Více o konfiguraci GitLab Runneru najdete v [dokumentaci](https://docs.gitlab.com/runner/configuration/).

### Škálování runnerů

Dříve GitLab Runner podporoval exekutor Docker Machine, který uměl automaticky tvořit (a zahazovat) virtuální stroje v cloudu.
GitLab Runner jako takový režii neřešil, vše řešila Docker Machine. Ale [Docker Machine](https://github.com/docker/machine) byl na konci září 2021 archivován a není dále podporován.
GitLab nějakou dobu udržoval [fork Docker Machine](https://gitlab.com/gitlab-org/ci-cd/docker-machine). Ale od verze GitLabu [**17.1.0**](https://about.gitlab.com/releases/2024/06/20/gitlab-17-1-released/) (červen 2024) je k dispozici náhrada,
v podobě tzv. [Fleeting](https://gitlab.com/gitlab-org/fleeting/fleeting) pluginu pro GitLab Runner, který řeší škálování strojů s runnery v cloudu.

Fleeting open-source a je tedy velmi snadné, si napsat vlastní plugin pro váší infrastrukturu, zároveň existuje už několik ať oficiálních nebo komunitních
pluginů pro různé cloudové poskytovatele. Aktuálně podporované jsou [AWS](https://gitlab.com/gitlab-org/fleeting/plugins/aws), [Azure](https://gitlab.com/gitlab-org/fleeting/plugins/azure), [GCP](https://gitlab.com/gitlab-org/fleeting/plugins/googlecloud), [Kubernetes](https://gitlab.com/gitlab-org/fleeting/fleeting-plugin-kubernetes), [Hetzner Cloud](https://gitlab.com/hetznercloud/fleeting-plugin-hetzner) a [OpenStack](https://github.com/sardinasystems/fleeting-plugin-openstack). Pro vmware vSphere [GitLab hledá kontributory](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/36931).

Dalším exekutorem je Kubernetes, tedy můžete nasadit Runner přímo do Kubernetes clusteru a škálovat dle potřeby a s pomocí Cluster Autoscaleru škálovat i cluster a tedy teoreticky až do nekonečna.

Seznam všech exekutorů a jejich konfiguraci najdete v [dokumentaci](https://docs.gitlab.com/runner/executors/).

## GitHub Actions

Základními kameny GitHub Actions jsou:

- **workflow** (pipeline) - workflow, neboli pipeline popisuje kdy se spouští workflow, jak se jmenuje, může být nezávislá, a nebo naopak čekat na jinou workflow
- **job** - jeden úkol v rámci workflow
- **step** - jeden úkol (krok) v rámci jobu
- **action** - znovupoužitelný krok

Workflow je definována v souboru `.github/workflows/*.yml`. V jednom repozitáři může být více workflow souborů. Ale vždy musí být ve složce `.github/workflows/`.

### Příklady GitHub Actions

Pojďme si ukázat úplně jednoduchý příklad, například pro JavaScript aplikaci:

```yaml
# .github/workflows/nodejs.yml

name: Node.js CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - run: npm run test
```

Opět se jedná až o triviální pipeline, ale nějak se začít musí.

Docker build a push do GitHub Container Registry:

```yaml
# .github/workflows/docker-build.yml

name: Docker build

on:
  push:
    branches:
      - '*'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
- name: checkout
        uses: actions/checkout@v4
        with:
          ref: ${{ github.head_ref }} # checkout the correct branch name
          fetch-tags: true

      - name: setup qemu
        uses: docker/setup-qemu-action@v3

      - name: setup docker
        uses: docker/setup-buildx-action@v3

      - name: login to ghcr.io
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: docker metadata
        uses: docker/metadata-action@v5
        id: meta
        with:
          images: |
            ghcr.io/${{ github.repository }}
          tags: |
            type=ref,event=branch,suffix=-${{ github.sha }}
            type=sha,format=long
            type=raw,value=latest,enable=${{ github.ref == format('refs/heads/{0}', 'main') }}

      - name: build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

Pozor, opět jde o build multi-platformního Docker image, pro `linux/amd64` a `linux/arm64`.

Pokud byste chtěli využít sofistikovanějších řešení, než jen bash skriptů nebo existujících actions, které vám třeba nemusí vyhovovat,
můžete využít tzv. "GitHub script" akci, která vám umožňuje psát JavaScript a pracovat s GitHub API skrze SDK:

```yaml
# .github/workflows/github-script.yml

name: GitHub Script

on:
  push:
    branches:
      - "*"

jobs:
  script:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run a script
        uses: actions/github-script@v5
        with:
          script: |
            const { data: issues } = await github.issues.listForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
            });
            core.setOutput('issues', JSON.stringify(issues));
```

Příklad výše vypíše všechny issues v repozitáři v JSON formátu.

Pokud vás zajímají GitHub Actions a chtěli byste se dozvědět víc nebo vylepšit vaše stávájící workflows,
i pro GitHub Actions připravuji [školení](/skoleni/github-actions).

### Vlastní akce

Pokud byste ale nechtěli "hackovat" v pipeline v JavaScriptu, můžete si vytvořit vlastní akci, kterou pak můžete použít kdekoliv v rámci vašich workflows.
Akce se píšou v JavaScriptu/TypeScriptu a jsou zabaleny do Docker image nebo pouze v `Dockerfile` (pouze pro linux) popř. je možné skládat akce a tvořit tak tzv. kompozitní akce.

Více o vlastních akcích najdete v [dokumentaci](https://docs.github.com/en/actions/creating-actions).

### GitHub Actions Runner

[GitHub Actions Runner](https://github.com/actions/runner) je open-source projekt napsaný v C# a je možné jej provozovat jak na Linuxu, tak i na Windows a macOS.

Runner můžete přiřadit k repozitáři nebo k organizaci.

Pro repozitář je postup následující:

1. Přejděte do vašeho repozitáře
2. Otevřete záložku **Settings**
3. V menu vlevo vyberte **Actions**
4. V menu v rozbalené záložce **Runners**
5. Klikněte na tlačítko **New self-hosted runner**
6. Postupujte dle instrukcí, jde o několik shell příkazů, které provedete na cílovém stroji

Takovýto Runner odbavuje jen jeden job v jednu chvíli. Runner je možné škálovat pomocí GitHub webhooků, když dostanete event `workflow_job` s aktivitou `queued`.

Nebo můžete využít GitHub [Actions Runner Controller](https://github.com/actions/actions-runner-controller), což je Kubernetes operator, díky kterému můžete provozovat (a škálovat) Runnery na Kubernetes clusteru.

Více o konfiguraci GitHub Actions Runneru najdete v [dokumentaci](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners).

### Škálování runnerů

Oficiální GitHub runner umí odbavovat pouze jeden job v jednu chvíli.
To znamená, pokud máte několik workflow, které mohou běžet vedle sebe, ale jen jeden runner,
tak poběží postupně za sebou. Protože GitHub Actions runner spouští postupně joby z jedné workflow a až po jejím dokončení,
pokračuje na další workflow.

Takže abychom mohli škálovat runnery, musíme spustit více instancí GitHub runneru. A to buď na jednom stroji (ať virtuálním nebo fyzickém),
nebo na více strojích. Na vlastním železe se tedy GitHub runnery škálují špatně, ale zato v cloudu to jde velmi snadno,
kdy jen spouštíte a zahazujete jednotlivé stroje, jak potřebujete.

Případně pokud provozujete runnery v Kubernetes, tam škálování probíhá snadněji do nastavené maximální hodnoty a [actions-runner-controller](https://github.com/actions/actions-runner-controller),
se stará o počet runnerů automaticky. A pokud mu dochází zdroje a máte ve vašem clusteru [Cluster Autoscaler](https://github.com/kubernetes/autoscaler), tak můžete automaticky škálovat nody v clusteru,
a tedy i runnery.

## Srovnání nakonec

|                            | GitLab CI             | GitHub Actions      |
| -------------------------- | --------------------- | ------------------- |
| Open-source platforma      | Ano                   | Ne                  |
| Open-source runner         | Ano                   | Ano                 |
| Škálování runnerů          | Ano                   | Ano                 |
| Rozšiřitelnost             | Ano                   | Ano                 |
| Více pipeline              | Ne<sup>1</sup>        | Ano                 |
| Prostředí                  | Docker, Shell         | OS                  |
| Paralelizace runneru       | Ano, konfigurovatelná | Ne                  |
| Škálování runnerů          | Ano<sup>2</sup>       | Ano<sup>3</sup>     |
| Znovupoužitelnost, šablony | Ano, vkládání souborů | Ano, akce (actions) |

1. GitLab CI umožňuje mít více pipeline, ale konfigurace je poněkud kostrbatá a jedná se o tzv. parent-child pipeline.
2. GitLab Runner je možné škálovat pomocí [Fleeting](https://docs.gitlab.com/runner/fleet_scaling/fleeting.html) systému nebo nasadit Runner do Kubernetes clusteru a škálovat tam.
3. GitHub Actions Runner je možné škálovat pomocí webhooků a spouštět nové runnery nebo pomocí [actions-runner-controller](https://github.com/actions/actions-runner-controller) též na Kubernetes clusteru.

### Rok s GitHub Actions

_Následuje osobní zkušenost s GitHubem a GitHub Actions, vaše zkušenost se může lišit._

V [cybroslabs](https://www.cybroslabs.com/) jsme se rozhodli použít GitHub, protože je v plánu několik projektů v budoucnu publikovat jako open-source,
a ať nemusíme přepisovat všechny pipeliny z GitLab CI na GitHub Actions, rozhodli jsme se rovnou začít na GitHubu a využít Actions rovnou.

Pokud GitHub funguje jak má, je všechno v pohodě, ale...

Za ten rok se nám několikrát stalo, že velmi dlouho (třeba i desítky minut), než se workflow spustila...
Což při cca čtyřech workflow per repozitář, je dost na 💩 situace. Situaci s runnery jsme vyřešili rozběhnutím vlastního self-hosted runneru.

Dále jsme měli několikrát problém s GitHub CodeSearch jak v rámci repozitáře tak i v rámci organizace. Což rozhodně nepřidalo.

Protože naše aplikace běží na Kubernetes, využíváme tedy [GitHub Container Registry (ghcr.io)](https://github.com/features/packages),
ale k privátním balíčkům se dá dostat pouze pomocí GitHub Personal Access Token (PAT), takže vše je závislé na uživateli a není možné si vytvořit token v organizaci nebo repozitáři.
Což je fakt na nic.

Takže interní projekty se časem budou migrovat na vlastní GitLab, jen open-source zůstane na GitHubu.

Takže moje osobní zkušenost nic moc, viděl bych to na 6/10. Osobně preferuju GitLab a jeho CI řešení.
