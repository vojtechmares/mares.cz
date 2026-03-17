---
title: Helm vs Kustomize vs YAML
description: Nasazování aplikací do Kubernetes clusteru má několik způsobů, na tři velké se podíváme v tomhle článku.
keywords: ["kubernetes", "deployment", "helm", "kustomize", "yaml"]
tags: ["kubernetes"]
trainingAd: kubernetes
draft: false
publish_time: 2024-10-01
alternate: "helm-vs-kustomize-vs-yaml"
---

Nasazování aplikací do Kubernetes clusteru má několik způsobů, na tři velké se podíváme v tomhle článku.

## YAML

> YAML is a human-friendly data serialization
> language for all programming languages.

[YAML](https://yaml.org/) je lidmi čitelný formát pro serializaci dat pro všechny programovací jazyky.

V Kubernetes je YAML snad úplně všude, od konfigurace clusteru až po nasazení aplikací.
Ale to není jediné místo, kde je YAML populární, rozšířil se i jinde. Například v definicích CI/CD pipeline

Zde je příklad deploymentu v YAML:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80
```

YAML jako takový je poměrně čistou a čitelnou variantou, jak do Kubernetes dostat nějaké aplikace,
ale protože jde jen o textový soubor, postrádá tedy jakoukoliv flexibilitu.
Pokud tedy chceme nasazovat pomocí YAMLu, potřebujeme buď YAML generovat, přepisovat na základě hiearachie nebo YAML soubory šablonovat.
A tím se dostáváme právě ke Kustomize a Helmu.

Co se vám občas může hodit vědět, je že JSON je podmnožinou YAMLu. Tedy jakýkoliv JSON text,
vložený do YAML souboru, je validní YAML soubor.

V YAML si ale dávejte pozor na odsazení. YAML je až přecitlivělý na mezery a odsazení.
Při špatné struktuře tedy dokáže velice potrápit. Pokud nemáte rádi Python kvůli odsazení,
tak YAML pravděpodobně také nebude vaším oblíbencem.

Při práci s YAMLem, se také může hodit nástroj [yq](https://mikefarah.gitbook.io/yq/), který umožňuje
pracovat s YAML objekty v příkazové řádce.

Například získání hodnoty z YAML souboru:

```bash
yq eval '.spec.replicas' deployment.yaml
```

Pokud jako `deployment.yaml` použijeme předchozí příklad, dostaneme hodnotu `3`.

`yq` je alternativou k `jq`, který pracuje s JSONem, ten se vám také může někdy hodit 😉.

K nasazení obyčejných YAML manifestů pak použijeme `kubectl`:

```bash
kubectl apply -f deployment.yaml
```

## Kustomize

[Kustomize](https://kustomize.io/) je nástroj, který umožňuje deklarativně upravovat YAML soubory.
Stále tedy máme statické YAML soubory, ale už dokážeme vytvářet různé varianty aplikací pomocí jednoho zdroje.

Kustomize je součástí `kubectl` od verze **1.14**, ale je možné ho používat i samostatně.

Kustomize pracuje s adresářovou strukturou, kde v kořenovém adresáři máme `kustomization.yaml` soubor,
který obsahuje informace o tom, jaké soubory a jak upravit/přepisovat.

Kustomize jako takový nedělá nic jiného, než že přepisuje YAML, tedy mapu dle klíče a hodnot díky postupnému (hierarchickému) načítání souborů.

Příklad `kustomization.yaml` souboru v `base` adresáři:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - configmap.yaml
  - deployment.yaml
  - ingress.yaml
  - service.yaml
```

Příklad `kustomization.yaml` souboru v `overlays/production` adresáři:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
bases:
  - ../../base
patchesStrategicMerge:
  - ingress.yaml
```

Při používání Kustomize se typicky dodržuje následující struktura:

```tree
.
├── base
|   ├── configmap.yaml
│   ├── deployment.yaml
|   ├── ingress.yaml
│   ├── service.yaml
│   └── kustomization.yaml
└── overlays
    ├── production
    |   ├── ingress.yaml
    │   └── kustomization.yaml
    └── staging
        ├── ingress.yaml
        └── kustomization.yaml
```

- `base` adresář obsahuje základní konfiguraci aplikace, kterou chceme nasadit.
  Tedy všechny manifesty, které tvoří aplikaci.

- `overlays` adresář obsahuje různé varianty buď všech a nebo jen některých souborů, manifestů,
  které chceme upravit nebo přidat.

Pokud si chcete zkontrolovat výsledný YAML manifest, ale zatím jej nechcete aplikovat do clusteru,
můžete použít následující příkaz:

```bash
kustomize build overlays/production
```

Výstup můžete ručně zkontrolovat v příkazovém řádku nebo uložit do souboru a zkontrolovat v editoru nebo automaticky
například v CI/CD pipeline pomocí nástroje jako je [`kubeconform`](https://github.com/yannh/kubeconform) nebo [Kyverno](https://kyverno.io/).

Následně se pomocí `kubectl apply` a přepínače `-k` můžeme Kustomize soubory aplikovat:

```bash
kubectl apply -k overlays/production
```

## Helm

[Helm](https://helm.sh/) se staví k YAML souborům jiným způsobem.
Protože Helm je napsaný v [Go](https://go.dev/), používá tedy Go šablony, aby do YAMLu vložil hodnoty,
které mu poskytneme a následně vyrenderuje výsledný YAML manifest, který pošle do Kubernetes clusteru,
na základě kontextu v našem kubeconfigu.

Protože YAML je citlivý na odsazení a netisknutelné znaky obecně (_whitespaces_),
řada lidí Helm nemá ráda nebo jej přímo nesnáší (stačí se podívat na Twitter/X).
Podle mě je to o zvyku, ale při složitějších Helm chartech (tedy balíčcích) a hlavně YAML templatingu,
to není tak přehledné jako čistý YAML.

Na druhou stranu, Helm je za mě skvělý nástroj, jak dodávat aplikace zákazníkům třetích stran.
Helm je v tomto ohledu mnohem snažší na distribuci a použití, než Kustomize nebo čistý YAML.
A díky integraci Helmu do snad všech [GitOps](/blog/gitops-a-argocd) nástrojů (například [Argo CD](https://argoproj.github.io/cd/) nebo [FluxCD](https://fluxcd.io/)),
není problém použít ani ty.

Co je trochu problematické u Helmu, je práce s Custom Resource Definitions (CRD),
které Helm sice umí spravovat, ale to řešení není ideální.
Helm nabízí podporu pro CRD skrze složku `crds`, ale tam nastává problém při aktualizaci nebo odinstalaci Helm chartu,
kdy se CRD neaktualizují a neodinstalují. Hack/workaround je vložit je do složky `templates`,
ale to není úplně ideální řešení vzhledem k povaze CRD.

Helm je nástroj do příkazové řádky (pokud nepoužíváte GitOps), takže běžné použití vypadá následovně:

```bash
# pokud instalujete Helm chart z adresáře, lokálně:
# helm install <název instalace chartu> <cesta>
helm install mychart ./mychart

# pokud instalujete Helm chart z Helm registry:
# 1. přidání Helm registry
# helm repo add <název repozitáře> <URL repozitáře>
helm repo add myrepo https://myrepo.com/charts
# 2. aktualizace repozitáře
helm repo update
# 3. instalace Helm chartu
# helm install <název instalace chartu> <název chartu>
helm install mychart myrepo/mychart

# případně je možné (a ze zkušenosti lepší) používat
# helm upgrade --install <název instalace chartu> <název chartu>
helm upgrade --install mychart myrepo/mychart

# odinstalace Helm chartu
helm uninstall mychart
```

Pokud byste si googlili informace o Helmu, tak hledejte pouze Helm 3.x, který je aktuální a podporovanou verzí.

### Helm chart

Helm chart je balíček, který v sobě drží všechny manifesty a zároveň obsahuje tzv. `values.yaml` soubor,
který popisuje, jaké hodnoty je možné do Helm chartu vložit.

Protože YAML nemá nijak definované schéma, jak má soubor vypadat (jaké mají být hodnoty a klíče atd.),
začala komunita vytvářet [JSON schémata](https://json-schema.org/) pro YAML soubory, aby bylo možné validovat, jaké hodnoty můžeme do souboru vložit.
Zároveň je možné tyto JSON schémata využít pro IDE, které podporují schémata, jako je například [Visual Studio Code](https://code.visualstudio.com/).

Helm chart se skládá z několika částí:

- `charts` - složka, kde můžeme vložit další Helm charty, které naše aplikace potřebuje, nepovinná.
- `templates` - složka, kde jsou uloženy Go šablony, které vyrenderují výsledný YAML manifest.
- `values.yaml` - soubor, který obsahuje výchozí hodnoty pro Helm chart.
- `Chart.yaml` - soubor, který obsahuje metadata o Helm chartu, jako je verze, název, popis, atd.
- `Chart.lock` - soubor, který obsahuje závislosti na dalších Helm charty, nepovinný a "zamyká" konkrétní verze pro kompabilitu a immutabilitu buildu.

JSON schéma pro `values.yaml` je pouze komunitní zvyklostí a nemá jasně definovaný název, ale obvykle se jmenuje `values.schema.json`.

A Helm chart adresářová struktura může vypadat následovně:

```tree
.
├── charts
├── templates
│   ├── _helpers.tpl
│   ├── configmap.yaml
│   ├── deployment.yaml
│   ├── ingress.yaml
│   └── service.yaml
├── values.yaml
├── Chart.yaml
└── Chart.lock
```

### Helm registry

Aby bylo možné Helm charty sdílet a instalovat, existuje [Helm registry](https://artifacthub.io/) nebo můžete provozovat vlastní,
popř. dnes je možné využít i [OCI registries](https://helm.sh/docs/topics/registries/).

Helm registry je tedy adresář s Helm charty, který drží jednak index a také všechny verze Helm chartu.

Pokud Helm chart nahráváte do registry, Helm chart se zabalí do tarballu a následně se nahraje do registru.
V závislosti na registry serveru, se pak tvoří index (`index.yaml`), který obsahuje informace o všech Helm charty automaticky,
nebo je třeba jej generovat ručně.

Pokud byste chtěli vlastní self-hosted registry, je možné využít například [Harbor](https://goharbor.io/) nebo **GitHub Pages**.

### Helm templating

Jak jsem psal výše, Helm používá Go šablony, které umožňují vkládat hodnoty do YAML manifestů.

Příklad `deployment.yaml` souboru s Helm templatingem:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-deployment
spec:
  replicas: {{ .Values.replicas }}
  selector:
    matchLabels:
      app: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app: {{ .Release.Name }}
    spec:
      containers:
      - name: {{ .Release.Name }}
        image: {{ .Values.image }}
        ports:
        - containerPort: {{ .Values.port }}
```

Helm má několik "globálních" proměnných, `Chart`, `Release` a `Values`, které umožňují přístup k různým hodnotám.
V šabolnách je dále možné využít řadu funkcní jako je `trim`, `toYaml` a další (viz [dokumentace](https://helm.sh/docs/chart_template_guide/getting_started/)).
Nebo podmiňovat některé části manifestu pomocí `if` a `else` bloků.

Další důležitou součástí Helmu, jsou `define` bloky, které umožňují vytvářet vlastní funkce a tedy zjednodušit šablony.
Tyto šablony jsou typicky v souboru `templates/_helpers.tpl`.

Příklad `_helpers.tpl` souboru:

```go
{{- define "mychart.labels" -}}
labels:
  app: {{ .Release.Name }}
{{- end -}}
```

A následně v `deployment.yaml` souboru:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-deployment
spec:
  replicas: {{ .Values.replicas }}
  selector:
    matchLabels:
      app: {{ .Release.Name }}
  template:
    metadata:
      {{ include "mychart.labels" . }}
    spec:
      containers:
      - name: {{ .Release.Name }}
        image: {{ .Values.image }}
        ports:
        - containerPort: {{ .Values.port }}
```

## Další cesty

YAML, Helm a Kustomize ale nejsou jediné způsoby, jak nasazovat aplikace do Kubernetes.

### jsonnet

[Jsonnet](https://jsonnet.org/) je další templating jazyk, který umožňuje generovat JSON a YAML soubory.
Osobně s ním nemám mnoho zkušeností, ale jedná se o další velmi oblíbený nástroj pro práci s Kubernetes manifesty.

### Terraform

[Terraform](https://www.terraform.io/) o kterém jsem psal v [tomto článku](/blog/terraform-infrastruktura-jako-kod) je také možností pro nasazení aplikací do Kubernetes clusteru.

Konkrétně s pomocí [Kubernetes provideru](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs) můžeme vytvářet a upravovat zdroje v Kubernetes clusteru.
Jednotlivé _resources_ jsou pak nativní _Terraform resources_ v HCL (HashiCorp Configuration Language).

Příklad deploymentu NGINXu v Terraformu:

```hcl
resource "kubernetes_deployment" "nginx" {
  metadata {
    name = "nginx-deployment"
  }

  spec {
    replicas = 3

    selector {
      match_labels = {
        app = "nginx"
      }
    }

    template {
      metadata {
        labels = {
          app = "nginx"
        }
      }

      spec {
        container {
          image = "nginx:1.14.2"
          name  = "nginx"

          port {
            container_port = 80
          }
        }
      }
    }
  }
}
```

Nebo využít komunitní [kubectl provider](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs), ten ale nespravuje resources v HCL, ale aplikuje přímo YAML soubory.
Dalším užitečným providerem je [Helm provider](https://registry.terraform.io/providers/hashicorp/helm/latest/docs), který umožňuje spravovat Helm charty,
pomocí Terraformu.

```hcl
resource "helm_release" "nginx" {
  name       = "nginx"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "nginx"
  version    = "8.9.0"

  set {
    name  = "replicaCount"
    value = "3"
  }
}
```

### Operátory

[Kubernetes Operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) je technicky aplikace,
která ve svém kódu staví na existujících Kubernetes API a resources a vytváří abstrakce nad nimi.
Obecně tedy rozšiřují možnosti Kubernetes a umožňují automatizovat operace, které by jinak byly manuální.

Operátor, aby vytvořil svoje resources, tzv. Custom Resources (CR), používá Custom Resource Definitions (CRD),
tj. popisují Kubernetes, jak resourcy které operátor spravuje vypadají. V operátoru následně běží controller,
který spravuje tyto resources.

Ale všechny definice CRD a CR, jsou opět typicky v YAMLu nebo je můžeme spravovat přes Kustomize popř. Helm.
Takže si zas tolik nepomůžeme.
