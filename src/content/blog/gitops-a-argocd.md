---
title: GitOps a Argo CD
description: V tomto článku se podíváme na GitOps a nástroj Argo CD, který je jedním z nástrojů pro GitOps.
keywords: ["git", "gitlab", "github", "argocd", "gitops", "kargo", "argocd autopilot"]
tags: ["kubernetes", "gitops"]
trainingAd: argo-cd
draft: false
publish_time: 2024-09-24
redirectFrom: ["gitops-and-argocd"]
alternate: "gitops-and-argocd"
---

V tomto článku se podíváme na GitOps a nástroj Argo CD, který je jedním z nástrojů pro GitOps.

## Co je to GitOps

GitOps je způsob, jak nasazovat změny do prostředí pomocí Gitu, kde jsou všechny změny zaznamenány jako commity v Git repozitáři.

GitOps se začal hodně rozšiřovat až v posledních letech, společně s [Kubernetes](https://kubernetes.io).
Protože vše v Kubernetes je deklarativní a je možné popsat v konfiguračních souborech (YAML, jsonnet,...) a to i s nástroji jako [Kustomize](https://kustomize.io/) nebo [Helm](https://helm.sh/).

Kustomize prakticky pouze přepisuje YAML na základě hierarchie. A i Helm, který funguje jako šablonovací systém YAML souborů potřebuje odněkud brát hodnoty (_values_),
které je možné uložit do souboru, opět se dostáváme k deklarativnímu zápisu.

Dál se tedy budu věnovat GitOps a Kubernetes, ale GitOps je možné potkat i jinde.

GitOps je založen na několika principech:

- **Deklarativní konfigurace**: Všechny změny jsou popsány v konfiguračních souborech (např. YAML) a aplikace je nasazena na základě těchto souborů.
- **Automatizace**: Nasazení je plně automatizované a probíhá bez manuálního zásahu.
- **Kontinuální dodávání**: Změny jsou nasazovány kontinuálně, jakmile jsou schváleny a otestovány.
- **Obnovitelnost**: Protože vše je uloženo v Gitu, je možné prakticky cokoliv obnovit, bez potřeby speciálních nástrojů a zároveň obnova netrvá příliš dlouho.

Hlavní výhodou GitOps oproti jiným metodám, je že GitOps jednak zaručuje korektnost nastavení v Kubernetes clusteru,
protože jakmile se změna dostane do repozitáře, automaticky se aplikuje. Nebo když se stav clusteru změní a je jiný, než má být,
GitOps automaticky znovu-aplikuje konfiguraci a vrátí se do správného stavu, brání tedy tzv. config-driftu. Například Argo CD kontroluje změny každé dvě minuty (ve výchozím nastavení).
Druhým velkým plusem je, že vše je uloženo v repozitáři a je možné tedy repozitář s konfigurací považovat i za zálohu a stejně jako běžnou aplikaci,
je možné obnovit prostředí z repozitáře.

Protože vše je uloženo v repozitáři a "aktivní část" systému funguje jako agent v clusteru,
kde si pravidelně stahuje repozitář a hledá změny v repozitáři vůči aktuálnímu stavu clusteru.
A pokud nějakou změnu najde, automaticky ji aplikuje.

## GitOps vs CI/CD

GitOps nám tedy řeší automatizaci nasazování aplikace do clusteru (když se bavíme o Kubernetes),
což je často stejný cíl jako u CI/CD.

**Proč tedy další paradigma, které řeší to samé?**

CI/CD pipeliny fungují na push principu. Tj. jakmile vyjde nová verze nebo se změní konfigurace,
spustí se pipeline, které spouští testy atd. A pokud je vše v pořádku, na konci pipeline dochází k nasazení změn.

To je velice přímočarý postup, ale pokud se rozbije cluster jako takový, pravděpodobně nebude možné
beze změny nasadit novou verzi. Pravděpodobně budete potřebovat upravit nějakou konfiguraci CI/CD pipeline.
Což nás blokuje a tvoří manuální úkol, který **někdo** musí udělat.

Dalším rozdílem je případ, kdy máte více Kubernetes clusterů.
V CI/CD pipeline je to celkem snadné pro dva, tři clustery, ale pokud jich máte desítky nebo stovky,
je to extrémě obtížné spravovat.

V případě GitOps/Argo CD máme stále jeden identický repozitář ze kterého může dělat pull libovolný počet Argo CD instancí napříč různými clustery i napříč cloudy.
Pokud bychom případně chtěli nebo potřebovali vytvořit nějak specifickou konfiguraci pro cluster,
region nebo třeba dle země, stačí vytvořit konfigurační soubor a načítat takovou konfiguraci například pomocí **ApplicationSetu**.
Ale takové řešení se lépe dělá s jednou instancí Argo CD nebo alespoň ne s Argo CD instancí v každém clusteru.

## Slepice a vejce problém

Jeden zatím neuniverzálě vyřešený problém s GitOps:

> Co bylo dřív slepice, nebo vejce?

Tedy s GitOps postupy a nástroji, je vlastně nemožné dostat ty samé GitOps nástroje do clusteru, než je tam nainstalujeme.

Dnes je mnoho různých postupů a nástrojů, které se snaží tento problém řešit.
Typicky se jedná o "bootstrap skript" nebo nástroj do příkazové řádky, kterým můžeme nainstalovat GitOps nástroje do clusteru.
Případně pokud vaše Kubernetes clustery spravujete [Terraformem](/blog/terraform-infrastruktura-jako-kod), můžete využít například
[Helm provideru](https://registry.terraform.io/providers/hashicorp/helm/latest) a nainstalovat Argo CD do každého clusteru právě Terraformem. Což je vcelku elegantní řešení:

```hcl
provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  namespace        = "argocd"
  create_namespace = true
  version          = "7.6.1"  # Verze Helm chartu

  # pro konfiguraci Helm chartu pak vyuzijte
  # values = [] pole, kam muzete vlozit YAML snippety
  # values = [
  #   file("${path.module}/values.yaml"),
  # ]
  # nebo set {} objekt, kde muzete nastavit hodnoty
  # set {
  #   name  = "server.service.type"
  #   value = "LoadBalancer"
  # }
}
```

## Argo CD

![argo.png](https://cdn.mares.cz/argo_2ee95661b5.png)

[Argo CD](https://argoproj.github.io/cd/) je open-source nástroj, který právě staví nad GitOps paradigmem.
Jedná se o jeden z nejoblíbenějších nástrojů pro GitOps v Kubernetes ekosystému.
Je primárně vyvíjený firmou [Akuity](https://akuity.io/), i když dnes už patří pod [CNCF](https://www.cncf.io/) a [projekt](https://landscape.cncf.io/?item=app-definition-and-development--continuous-integration-delivery--argo) je ve stavu _Graduated_.

Argo je dokonce celá rodina nástrojů, které se integrují a rozšiřují Kubernetes.

- **Argo CD** - GitOps nástroj pro Kubernetes
- [Argo Workflows](https://argoproj.github.io/workflows/) - Workflow engine pro Kubernetes (Job na steroidech: pipeline, obyčejné i periodické s cronem), interně jej například využívá [KubeFlow](https://www.kubeflow.org/).
- [Argo Events](https://argoproj.github.io/events/) - Eventing systém pro Kubernetes, zároveň má řadu integrací (AWS, kalendář, Slack, PubSub, webhooky a další...)
- [Argo Rollouts](https://argoproj.github.io/rollouts/) - Pokročilé nasazování aplikací do Kubernetes (blue/green, canary,...)

Argo CD podporuje jednak obyčejné YAML manifesty, ale i zmiňovaný Kustomize, jsonnet a Helm.
Zároveň je bezpotíží možné používat Kuberentes operátory a _custom resources_, které přinášejí.

Argo CD má několik svých vlastních _resources_, kterými popisuje aplikace, ale i projekty a jejich dělení.

- **Application** - resource popisující aplikaci, zdrojový repozitář, verzi a případně Helm values apod.

  Příklad Argo CD aplikace, která se stará o instanci mého Argo CD:

  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: Application
  metadata:
    name: argo-cd
    namespace: argocd
    annotations:
      argocd.argoproj.io/sync-wave: "1"
    # finalizery na aplikaci,
    # pokud je pritomen finalizer `resources-finalizer.argocd.argoproj.io`
    # pak pri smazani Argo CD aplikace se automaticky (kaskadove)
    # mazou i vsechny resources, ktere tato aplikace vytvorila
    finalizers:
      - resources-finalizer.argocd.argoproj.io
  spec:
    project: argo
    syncPolicy:
      automated:
        # automaticky maz pokud je smazano
        prune: true
        # automaticky obnovit pokud je zmena
        selfHeal: true
      syncOptions:
        - CreateNamespace=true
    # do jakeho Kubernetes clusteru se ma aplikace nasadit
    # v tomto pripade stejny cluster, kde bezi Argo CD
    # ale je mozne zvolit i dalsi cluster(y), ktere Argo CD instance zna (viz config)
    destination:
      server: "https://kubernetes.default.svc"
      namespace: argocd
    source:
      # nazev Helm chartu
      chart: argo-cd
      # URL Helm repozitare
      repoURL: https://argoproj.github.io/argo-helm
      # verze Helm chartu
      targetRevision: 7.4.7
      helm:
        # nazev Helm releasu
        releaseName: argocd
        # helm values primo v manifestu aplikace,
        # take je mozne mit ulozene v jinem souboru ve stejnem repozitari
        valuesObject:
          global:
            domain: argocd.example.com # priklad, svoje Argo CD nechci verejne publikovat :P
          server:
            ingress:
              enabled: true
              ingressClassName: nginx
              annotations:
                nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
                nginx.ingress.kubernetes.io/ssl-passthrough: "true"
                nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
              tls: true

            # interni certifikat pro HTTPS uz na *Podu*
            # nez az na *Ingressu*
            certificate:
              enabled: true
              issuer:
                group: "cert-manager.io"
                kind: "ClusterIssuer"
                name: "letsencrypt-dns-production"
  ```

- **Project** - projekt, do kterého patří různé aplikace, zároveň určuje, jaké typy resources je možné v rámci projektu spravovat a v jakých namespace.

  Příklad Argo CD projektu, pod který spadají všechny Argo komponenty:

  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: AppProject
  metadata:
    annotations:
      argocd.argoproj.io/sync-options: PruneLast=true
      argocd.argoproj.io/sync-wave: "1"
    name: argo
    namespace: argocd
  spec:
    clusterResourceWhitelist:
      - group: "*"
        kind: "*"
    description: argo project
    destinations:
      - namespace: "*"
        server: "*"
    namespaceResourceWhitelist:
      - group: "*"
        kind: "*"
    sourceRepos:
      - "*"
  ```

- **ApplicationSet** - kolekce aplikace, tj. jedna aplikace nainstalovaná vícekrát. Například pro jednotlivé tenanty nebo do několika clusterů.

  Příklad Argo CD ApplicationSetu, který nasadí Guestbook aplikaci do tří clusterů:

  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: ApplicationSet
  metadata:
    name: guestbook
  spec:
    goTemplate: true
    goTemplateOptions: ["missingkey=error"]
    generators:
      - list:
          elements:
            - cluster: engineering-dev
              url: https://1.2.3.4
            - cluster: engineering-prod
              url: https://2.4.6.8
            - cluster: finance-preprod
              url: https://9.8.7.6
    template:
      metadata:
        name: "{{.cluster}}-guestbook"
      spec:
        project: my-project
        source:
          repoURL: https://git.example.com/infra-team/cluster-deployments.git
          targetRevision: HEAD
          path: guestbook/{{.cluster}}
        destination:
          server: "{{.url}}"
          namespace: guestbook
  ```

  Seznam všech generátorů a jak je použít najdete v [dokumentaci](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Generators/).

Populární alternativou k Argo CD je [FluxCD](https://fluxcd.io/).

### Jak začít s Argo CD?

V první řadě je třeba Argo CD nainstalovat do clusteru 😄

K tomu máme několik možností, [Kustomize](https://kustomize.sigs.k8s.io/), [Helm](https://helm.sh/) nebo [Argo CD Autopilot](#argocd-autopilot) (o tom píšu později), který nástroj si vyberete nechám na vaší preferenci.

**Kustomize**:

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: argocd
resources:
  - https://raw.githubusercontent.com/argoproj/argo-cd/v2.7.2/manifests/install.yaml
```

**Helm**:

```yaml
# argocd-values.yaml
global:
  domain: argocd.example.com

certificate:
  enabled: true

server:
  ingress:
    enabled: true
    ingressClassName: nginx
    annotations:
      nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
      nginx.ingress.kubernetes.io/ssl-passthrough: "true"
    tls: true
```

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
helm install argocd argo/argo-cd --namespace argocd --create-namespace --values ./argocd-values.yaml
```

Tím máme Argo CD v clusteru a můžeme přidat první repozitář, vytvořit první aplikaci
a začít nasazovat aplikace s Argo CD a pomužívat GitOps.

Repozitář můžeme přidat přes `argocd` CLI, o tom později, nebo v UI.
Repozitář v UI přidáme v Settings > Repositories > +Connect Repository.

Tam potom vyplníme URL, uživatele a heslo (nebo token místo hesla), popř. můžeme použít SSH.

Po přidání repozitáře potom vytvoříme první aplikaci, která bude koukat právě do našeho repozitáře.

```yaml
# hello-world-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: hello-world
  namespace: argocd
spec:
  destination:
    namespace: default
    server: https://kubernetes.default.svc
  project: testing
  source:
    repoURL: https://git.example.com/nase/repo
    targetRevision: HEAD
    path: hello-world
```

Protože aplikace je Kubernetes resource, musíme ji dostat do clusteru, což uděláme pomocí `kubectl`.

```bash
kubectl apply -f hello-world-app.yaml
```

A v Argo CD UI bychom nyní měli vidět naši **hello-world** aplikaci!

Abychom nemuseli přidávat každou aplikaci zvlášť ručně do clusteru přes `kubectl`,
používá se tzv. **app-of-apps**, tedy aplikace aplikací.

Jedná se o Argo CD aplikaci, která ukazuje do repozitáře a do složky, kde jsou uloženy všechny manifesty všech aplikací.

Pak je ale potřeba používat finalizery, aby když nějakou aplikaci odstraníme, aby se smazala z clusteru. A nebo naopak ne,
abychom nic automaticky nemazali a zabránili tak případné chybě a problémům.

Taková **app-of-apps** typicky vypadá třeba takto:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: app-of-apps
  namespace: argocd
  annotations:
    argocd.argoproj.io/sync-wave: "-1"
spec:
  project: cd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
  source:
    path: apps/
    directory:
      # recurse=true, jak název naznačuje, znamená, že Argo CD hledá manifesty ve všech podsložkách
      # což se občas může hodit
      recurse: true
    repoURL: git@gitlab.example.com:infra/gitops.git
    targetRevision: HEAD
  destination:
    server: "https://kubernetes.default.svc"
    namespace: default
```

Pokud bychom chtěli si v Argo CD UI udělat větší pořádek, což třeba při větším počtu aplikací je dobrý nápad.
A nebo pokud nasazujete dedikované instance aplikace pro jednotlivé tenanty například, je dobré používat projekty.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: testing
  namespace: argocd
spec:
  description: Testing project
  destinations:
    - namespace: "*"
      server: "*"
  sourceRepos:
    - "*"
  clusterResourceWhitelist:
    - group: "*"
      kind: "*"
  namespaceResourceWhitelist:
    - group: "*"
      kind: "*"
```

V projektu mimo jiné definujeme, do jakých clusterů, _namespace_ a jaké druhy _resources_ můžou aplikace v projektu spravovat.
Čímž můžeme například globálně zakazovat _ClusterRole_ resources apod.
A díky [Kyvernu](https://kyverno.io/) do každého _namespace_ vkládat _ResourceQuota_ a _NetworkPolicy_
a omezovat tak oprávnění a zamezovat jednotlivým instancím interagovat s jinými.

### Argo CD CLI

[`argocd`](https://argo-cd.readthedocs.io/en/stable/cli_installation/) je CLI (program pro příkazovou řádku) nástroj, který vám usnadní práci s Argo CD. Můžete s ním vytvářet aplikace, projekty, získávat informace o aplikacích, spravovat v Argo CD clustery, spravovat repozitáře (Git, Helm,...) a další věci.

Pokud jste příznivci terminálu, určitě se na `argocd` podívejte. Je to super nástroj, díky kterému můžete začít s Argo CD během pár minut a nemusíte se učit CRD a psát je ručně,
i když s tím vám dnes hbitě poradí ChatGPT nebo GitHub Copilot.

1. port-forwarding na Argo CD _Service_

   ```bash
   kubectl port-forward svc/argocd-server -n argocd 8080:443
   ```

2. získání výchozího hesla pro uživatele `admin`

   ```bash
   argocd admin initial-password -n argocd
   ```

3. otevřete svůj webový prohlížeč a jděte na adresu
   `http://localhost:8080` a přihlaste se

### Argo CD Autopilot

[Argo CD Autopilot](https://argocd-autopilot.readthedocs.io/en/stable/) je CLI nástroj,
který vám pomůže jednat nasadit Argo CD do clusteru a dále spravovat všechny aplikace, projekty apod.
Argo CD Autopilot má vybraný pohled (opinionated) jak by měl vypadat Gitový repozitář, kam Argo CD kouká
a řeší jak má takový repozitář vypadat a jak má být uspořádaný (složky, soubory, aplikace, projekty,...).

Takže vám dokáže velmi usnadnit práci a nemusíte přemýšlet, kam daná věc patří, Argo CD Autopilot to vyřeší za vás.
Na druhou stranu, jako každý _opinionated_ nástroj není moc flexibilní a je možné, že vám jeho přístup nebude vyhovovat. 🤷‍♂️

```bash
# Git token je třeba pro přístup do repozitáře
# kde token získáte, záleží na vašem Git serveru
# GitHub - Personal Access Token pod vaším účtem: Settings > Developer Settings > Classic Token
# GitLab - Personal Access Token nebo Deploy Token skupiny
export GIT_TOKEN="xxx"

# HTTPS cesta k repozitáři
export GIT_REPO=https://gitlab.example.com/<group>/<repo>

# Bootstrap Argo CD do clusteru a setup repozitáře
# Poznámka: argocd-autopilot automaticky udělá push do repozitáře
argocd-autopilot repo bootstrap
```

V Argo CD pak uvidíte tři aplikace:

- **autopilot-bootstrap** - tedy bootstrap celého Autopilota a Argo CD
- **argo-cd** - deployment Argo CD přes Kustomize ze složky `bootstrap/argo-cd/`
- **root** - aplikace, která zastřešuje všechny projekty,
  ve výchozím stavu žádné projekty nejsou a ve složce `projects/` je pouze prázdný "dummy" soubor

```bash
# vytvoření nového projektu
argocd-autopilot project create testing

# vytvoření nové aplikace
argocd-autopilot app create hello-world \
  --app github.com/argoproj-labs/argocd-autopilot/examples/demo-app/ \
  -p testing \
  --wait-timeout 2m
```

### Argo CD Image Updater plugin

[Argo CD Image Updater](https://argocd-image-updater.readthedocs.io/en/stable/) řeší automatické sledování (_watch_) Docker/OCI registrů,
zda není k dispozici nová verze obrazu (_image_) odpovídající například regulárnímu výrazu.

Pokud je nový _image_ k dispozici, automaticky upraví manifest Argo CD aplikace, čímž dojde k automatickému nasazení nové verze.
A také udělá _commit_ do Git repozitáře, abychom měli vše aktuální.

Je to tedy jednoduché a přímočaré řešení, ale vlastně je až příliž jednoduché a nejde s ním dělat složitější věci.
Pokud chcete něco sofistikovanjšího, podívete se na [Kargo](#kargo).

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  annotations:
    # Jediné co potřebujete, je tato anotace na Argo CD aplikaci
    # a nainstalovaný a nastavený Image Updater plugin, vše pak funguje automaticky (automagicky :D)
    argocd-image-updater.argoproj.io/image-list: gcr.io/heptio-images/ks-guestbook-demo:^0.1
    # pro aktualizaci Git repozitáře je třeba ale přidat ještě jednu anotaci:
    argocd-image-updater.argoproj.io/write-back-method: git
    # případně je k dispozici ještě hodnota `arogcd`, v ten moment se nedělá push (write-back) do repozitáře
    # a změny se drží pouze v Argo CD, což jde ale proti GitOps principu: co je v repozitáři je nasazené
  name: guestbook
  namespace: argocd
spec:
  destination:
    namespace: guestbook
    server: https://kubernetes.default.svc
  project: default
  source:
    path: helm-guestbook
    repoURL: https://github.com/argocd-example-apps/argocd-example-apps
    targetRevision: HEAD
```

### Kargo

![kargo-guestbook-screenshot.png](https://cdn.mares.cz/kargo_guestbook_screenshot_6a67ec4003.png)
_Kargo screenshot pro demo "guestbook" aplikaci_

[Kargo](https://kargo.akuity.io/) je open-source projekt od Akuity, který staví nad Argo CD a Rollouts a snaží se vyplnit chybějící článek
řetězu, jak se dodává souftware z Gitu do produkce.

Kargo staví vlastní "pipeline", které řeší nasazení aplikace do prostředí (_stage_) a zároveň i progresivní postup jednotlivých verzí (_freight_)
napříč prostředímy.

Díky Kargu zároveň získáváme velice pěknou vizualizaci, kde se právě nachází jaká verze aplikace a v jakém prostředí.

Pojďme si rozebrat jednotlivé Kargo pojmy:

- **Project** - Projekt je soubor souvisejících _resources_ v rámci Karga, které popisují jednu nebo více pipeline a je základní jednoutkou v Kargu

- **Stage** - Často je to prostředí (_environment_), ale aby nedocházelo k záměně, Kargo definuje raději pojem _Stage_, které souvisí primárně s účelem, nikoliv místem/lokalitou.
  _Stage_ je nedůležitějším konceptem v Kargu, jednotlivé _Stages_ se spojují dohromady (nesmí však tvořit cyklus!). Typicky je na začátku **test** nebo **dev** a končí se na **prod**-u.

- **Freight** - Jde o druhý nejdůležitější koncept v Kargu, "jeden kus freightu" (a single piece of freight) je množina referencí jednoho nebo více verzovaných artefaktů.

  Takovými artefakty jsou:
  - Obrazy (_images_) v repozitáři (třeba Docker Hub)
  - Kubernetes manifesty (v Git repozitář)
  - Helm chart (v Helm chart nebo OCI repozitář)

  _Freight_ je tedy množina referencí na tyto artefakty, které tvoří jednu verzi aplikace.
  Která postupuje skrz jednotlivé _Stages_.

- **Warehouse** - Je to zdroj (_source_) _Freight_-ů. _Warehouse_ kouká do jednoho nebo více repozitářů obrazů, Git repozitářů nebo Helm repozitáře. A když najde novou verzi, vzniká tak nový _Freight_.

- **Promotion** - Jde o požadavek na přesunutí _Freight_-u z jednoho _Stage_ do druhého. _Promotion_ může být automatická nebo manuální.

Kargo pak využívá Argo CD **ApplicationSet**, kterým tvoří aplikace pro jednotlivé _Stages_:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: kargo-demo
  namespace: argocd
spec:
  generators:
    - list:
        elements:
          - stage: test
          - stage: uat
          - stage: prod
  template:
    metadata:
      name: kargo-demo-{{stage}}
      annotations:
        kargo.akuity.io/authorized-stage: kargo-demo:{{stage}}
    spec:
      project: default
      source:
        repoURL: ${GITOPS_REPO_URL}
        targetRevision: stage/{{stage}}
        path: stages/{{stage}}
      destination:
        server: https://kubernetes.default.svc
        namespace: kargo-demo-{{stage}}
      syncPolicy:
        syncOptions:
          - CreateNamespace=true
```

Pak vytvoříme všechny potřebné _resources_, tedy _Stages_, _Project_ a _Warehouse_:

```yaml
# kargo-demo.yaml
apiVersion: kargo.akuity.io/v1alpha1
kind: Project
metadata:
  name: kargo-demo
---
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: kargo-demo-repo
  namespace: kargo-demo
  labels:
    kargo.akuity.io/cred-type: git
stringData:
  repoURL: ${GITOPS_REPO_URL}
  username: ${GITHUB_USERNAME}
  password: ${GITHUB_PAT}
---
apiVersion: kargo.akuity.io/v1alpha1
kind: Warehouse
metadata:
  name: kargo-demo
  namespace: kargo-demo
spec:
  subscriptions:
    - image:
        repoURL: public.ecr.aws/nginx/nginx
        semverConstraint: ^1.26.0
        discoveryLimit: 5
---
apiVersion: kargo.akuity.io/v1alpha1
kind: Stage
metadata:
  name: test
  namespace: kargo-demo
spec:
  requestedFreight:
    - origin:
        kind: Warehouse
        name: kargo-demo
      sources:
        direct: true
  promotionMechanisms:
    gitRepoUpdates:
      - repoURL: ${GITOPS_REPO_URL}
        writeBranch: stage/test
        kustomize:
          images:
            - image: public.ecr.aws/nginx/nginx
              path: stages/test
    argoCDAppUpdates:
      - appName: kargo-demo-test
        appNamespace: argocd
---
apiVersion: kargo.akuity.io/v1alpha1
kind: Stage
metadata:
  name: uat
  namespace: kargo-demo
spec:
  requestedFreight:
    - origin:
        kind: Warehouse
        name: kargo-demo
      sources:
        stages:
          - test
  promotionMechanisms:
    gitRepoUpdates:
      - repoURL: ${GITOPS_REPO_URL}
        writeBranch: stage/uat
        kustomize:
          images:
            - image: public.ecr.aws/nginx/nginx
              path: stages/uat
    argoCDAppUpdates:
      - appName: kargo-demo-uat
        appNamespace: argocd
---
apiVersion: kargo.akuity.io/v1alpha1
kind: Stage
metadata:
  name: prod
  namespace: kargo-demo
spec:
  requestedFreight:
    - origin:
        kind: Warehouse
        name: kargo-demo
      sources:
        stages:
          - uat
  promotionMechanisms:
    gitRepoUpdates:
      - repoURL: ${GITOPS_REPO_URL}
        writeBranch: stage/prod
        kustomize:
          images:
            - image: public.ecr.aws/nginx/nginx
              path: stages/prod
    argoCDAppUpdates:
      - appName: kargo-demo-prod
        appNamespace: argocd
```

Abychom tyto _resoureces_ dostali do clusteru, použijeme `kargo` CLI, ne kubectl!:

```bash
kargo apply -f kargo-demo.yaml
```

Potom bychom měli v Kargo dashboardu vidět něco podobného jako na screenshotu výše.

Kargo je mocný, ale komplexní nástroj. Pokud vás zajímá víc, doporučuji si vyzkoušet jejich dema [kargo-simple](https://github.com/akuity/kargo-simple) a [kargo-advanced](https://github.com/akuity/kargo-advanced) na GitHubu, tady by to vydalo na samotný blog post nebo i víc.
Pokud byste o to stáli, tak tweetněte na Twitteru/Xku na [@vojtechmares\_](https://x.com/vojtechmares_) 😉.
