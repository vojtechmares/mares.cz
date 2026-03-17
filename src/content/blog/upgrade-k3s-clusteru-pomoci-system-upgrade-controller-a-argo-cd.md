---
title: "Upgrade k3s clusteru pomocí System Upgrade Controller a Argo CD"
description: "Jak automatizovat upgrady k3s clusteru pomocí System Upgrade Controller a Argo CD s přístupem GitOps."
keywords: ["kubernetes", "k3s", "upgrade", "system upgrade controller", "argocd", "gitops", "hetzner"]
tags: ["kubernetes", "hetzner", "argocd", "gitops"]
draft: false
publish_time: 2022-11-17
alternate: "upgrading-k3s-with-system-upgrade-controller-and-argo-cd"
---

Nedávno jsem migroval svůj k3s cluster na Hetzneru z bare metalu na VM. Nepotřebuji tolik výpočetních zdrojů a nechci spravovat úložiště na Longhornu.

O této migraci možná někdy jindy. V tomto článku se chci zaměřit na to, jak jsem upgradoval svůj k3s cluster bez Ansible, automaticky, pomocí jednoduchého Plánu.

## Co je k3s

Pro ty, kdo nevědí, co je [k3s](https://k3s.io) - jedná se o odlehčenou distribuci Kubernetes nejen pro edge. Můžete na ní provozovat cokoliv. Je to plnohodnotná distribuce Kubernetes.

V současné době je k3s distribucí Kubernetes používanou clustery nasazenými přes Rancher na VM. Např. v prostředích, kde nejsou k dispozici spravovaná řešení jako AWS EKS.

### Trocha historie

k3s původně vytvořila společnost [Rancher Labs](https://www.rancher.com/) a projekt k3s byl později darován [CNCF](https://www.cncf.io/) spolu s dalšími projekty Rancher Labs, jako je [Longhorn](https://longhorn.io/).

### Je k3s stabilní?

Říkáte, že k3s není stabilní/vhodný pro produkci?

Zeptejte se lidí z [CIVO](https://www.civo.com/). Všechny jejich clustery běží na k3s!

# System Upgrade Controller

[System Upgrade Controller](https://github.com/rancher/system-upgrade-controller) je komponenta od Rancheru zaměřená na upgrade Kubernetes nodů. Nezávisí na k3s/rke/rke2/Rancher, lze ji použít kdekoliv.

V mém případě ji momentálně používám k upgradu verze k3s a plánuji ji použít i k upgradu kernelu nodů. Hostitelský OS nodů je Ubuntu 22.04 LTS.

V době psaní má System Upgrade Controller **424 GitHub hvězdiček**.

**POZNÁMKA**: Job kontejner je velmi privilegovaný, více si přečtěte zde: https://github.com/rancher/system-upgrade-controller#considerations

### Koncepty

> **Controller** spravuje **Plány** tím, že vybírá **Nody**, na kterých spouští **Joby**. **Plán** definuje, které **Nody** jsou způsobilé pro upgrade, pomocí selektoru labelů. Když **Job** úspěšně doběhne, **Controller** označí **Nod**, na kterém běžel, podle **Plánu**, který byl aplikován **Jobem**.

To je oficiální popis SUC na jeho GitHub stránce.

### Plán

Rád bych se trochu více zmínil o plánu.

V něm můžete nakonfigurovat, co chcete upgradovat - samotné k3s, kernel, apt balíčky a další...

Pro k3s si můžete zvolit konkrétní verzi pro upgrade nebo "channel", takže automaticky upgradujete na nejnovější patch verzi, když je k dispozici, nebo dokonce na nejnovější minor verzi.

Můžete také nakonfigurovat chování nodu před samotným upgradem. Jestli chcete nod cordonovat nebo drainovat. Ve výchozím nastavení drain ignoruje `DaemonSet`y.

## Upgrade

V mém clusteru používám Argo CD ke správě Kubernetes resources způsobem GitOps.

Začal jsem tedy přidáním repozitáře System Upgrade Controller do Arga a vytvořil pro něj Application.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: system-upgrade-controller
  namespace: argocd
spec:
  destination:
    namespace: system-upgrade
    server: https://kubernetes.default.svc
  project: default
  source:
    path: manifests
    repoURL: https://github.com/rancher/system-upgrade-controller.git
    targetRevision: v0.10.0
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

Poté jsem vytvořil další samostatnou aplikaci pro samotné plány, aby mohly být spravovány odděleně od controlleru.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: upgrade-plans
  namespace: argocd
spec:
  destination:
    namespace: system-upgrade
    server: https://kubernetes.default.svc
  project: default
  source:
    path: cluster-components/upgrade-plans
    repoURL: https://gitlab.example.com/gitops/mareshq/bee.git
    targetRevision: HEAD
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

Poté jsem vytvořil Plány pro k3s-server (control-plane) a k3s-agent (worker).

Plány používají `channel` k zacílení na určitou minor verzi Kubernetes, takže upgrady patchů dostávám automaticky. Pokud toto chování nechcete a chcete zacílit na konkrétní verzi, použijte `version` v rámci `spec`. Pro více informací si přečtěte [dokumentaci](https://docs.k3s.io/upgrades/automated) a vřele doporučuji nahlédnout do repozitáře [k3s-upgrade](https://github.com/k3s-io/k3s-upgrade).

```yaml
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: k3s-server-v1.25
  namespace: system-upgrade
  labels:
    k3s-upgrade: server
spec:
  concurrency: 1 # Batch size (roughly maps to maximum number of unschedulable nodes)
  channel: https://update.k3s.io/v1-release/channels/v1.25
  nodeSelector:
    matchExpressions:
      - { key: k3s-upgrade, operator: Exists }
      - { key: k3s-upgrade, operator: NotIn, values: ["disabled", "false"] }
      - { key: k3os.io/mode, operator: DoesNotExist }
      - { key: node-role.kubernetes.io/control-plane, operator: Exists }
  serviceAccountName: system-upgrade
  cordon: true
  upgrade:
    image: rancher/k3s-upgrade
---
apiVersion: upgrade.cattle.io/v1
kind: Plan
metadata:
  name: k3s-agent-v1.25
  namespace: system-upgrade
  labels:
    k3s-upgrade: agent
spec:
  concurrency: 1 # Batch size (roughly maps to maximum number of unschedulable nodes)
  channel: https://update.k3s.io/v1-release/channels/v1.25
  nodeSelector:
    matchExpressions:
      - { key: k3s-upgrade, operator: Exists }
      - { key: k3s-upgrade, operator: NotIn, values: ["disabled", "false"] }
      - { key: k3os.io/mode, operator: DoesNotExist }
      - { key: node-role.kubernetes.io/control-plane, operator: DoesNotExist }
  serviceAccountName: system-upgrade
  prepare:
    # Defaults to the same "resolved" tag that is used for the `upgrade` container, NOT `latest`
    image: rancher/k3s-upgrade
    args: ["prepare", "k3s-server-v1.25"]
  drain:
    force: true
    skipWaitForDeleteTimeout: 60 # 1.18+ (honor pod disruption budgets up to 60 seconds per pod then moves on)
  upgrade:
    image: rancher/k3s-upgrade
```

Nemohl jsem najít seznam všech dostupných channels, ale existuje JSON seznam poskytovaný [channelserverem](https://github.com/rancher/channelserver).

JSON seznam channels: [`https://update.k3s.io/v1-release/channels`](https://update.k3s.io/v1-release/channels).

Po tom všem je potřeba přidat label `k3s-upgrade` k vašim nodům. Labely můžete změnit na vlastní v `spec.nodeSelector.matchExpressions`.

Přidání takového labelu je opravdu jednoduché pomocí jediného kubectl příkazu.

```bash
kubectl label node <node name> k3s-upgrade=true
```

Mělo by být v pořádku označit všechny nody najednou, ale pro jistotu jsem nejprve upgradoval control-plane a poté worker nody.

Poté byste měli vidět nový job vytvořený v namespace `system-upgrade`. Job má ve svém názvu, který nod je tímto jobem upgradován.

Po dokončení jobu máte upgradovaný nod. Pokud jich máte více, controller automaticky začne upgradovat další nod.

Po pár minutách byl k3s control plane upgradovaný a přešel jsem k agentům (workerům).

## Závěrečné myšlenky

Musím říct, že nastavení a upgrade jsou neuvěřitelně jednoduché, mnohem více, než jsem čekal.

Controller nepotřebuje nic speciálního k instalaci ani ke změně v clusteru. Plány jsou dobře zdokumentované a s repozitářem [k3s-upgrade](https://github.com/k3s-io/k3s-upgrade), který je plný příkladů a další dokumentace, to byl hračka.

Jediné, co mi přišlo trochu obtížné, bylo získat seznam channels, ale s trochou zkušeností a odhadem jsem seznam také našel.

Těším se, až přidám další plány pro upgrade kernelu nodů a dalších věcí.

## Odkazy

- k3s: https://k3s.io/
- System Upgrade Controller: https://github.com/rancher/system-upgrade-controller
- Repozitář k3s-upgrade: https://github.com/k3s-io/k3s-upgrade
