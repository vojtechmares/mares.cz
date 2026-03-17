---
title: "Upgrading k3s cluster with System Upgrade Controller and Argo CD"
description: "How to automate k3s cluster upgrades using System Upgrade Controller and Argo CD with a GitOps approach."
keywords: []
tags: ["kubernetes", "hetzner", "argocd", "gitops"]
draft: false
publish_time: 2022-11-17
---

I've recently migrated my k3s cluster on Hetzner from bare metal to VMs. I do not need that many compute resources and I do not want to maintain storage on Longhorn.

About that migration, maybe some other time. In this article, I want to focus how I upgraded my k3s cluster without Ansible, automatically, with just a simple Plan.

## What is k3s

For those who do not know what [k3s](https://k3s.io) is, it is a lightweight distribution of Kubernetes not just for edge. You can run anything. It is a fully-featured Kubernetes distribution.

Currently k3s is the distribution of Kubernetes used by Rancher-provisioned clusters on VMs. E.g. in environments where managed solutions are unavailable, such as AWS EKS.

### A bit of history

k3s was originally made by [Rancher Labs](https://www.rancher.com/) and the k3s project was later donated to [CNCF](https://www.cncf.io/) along other Rancher Labs' projects such as [Longhorn](https://longhorn.io/).

### Is k3s stable?

Are you saying that k3s is not stable/suitable for production?

Just ask the [CIVO](https://www.civo.com/) folks. All their clusters are running on k3s!

# System Upgrade Controller

[System Upgrade Controller](https://github.com/rancher/system-upgrade-controller) is a Rancher made component focusing on upgrading the Kubernetes nodes. It does not depend on k3s/rke/rke2/Rancher, it can be used anywhere.

In my case, I am currently using it to upgrade the version of k3s and I am planning to use to upgrade node's Kernel. Nodes' host OS is Ubuntu 22.04 LTS.

At the time of writing, the System Upgrade Controller has **424 GitHub stars**.

**NOTE**: the Job container is a very privileged one, read more here: https://github.com/rancher/system-upgrade-controller#considerations

### Concepts

> The **Controller** manages **Plans** by selecting **Nodes** to run **Jobs** on. A **Plan** defines which **Nodes** are eligible for upgrade by specifying a label selector. When a **Job** has run to completion successfully the **Controller** will label the **Node** on which it ran according to the **Plan** that was applied by the **Job**.

That is the official description of the SUC at it's GitHub page.

### Plan

I would like to talk a bit more about the plan.

In it, you can configure what you want to upgrade - k3s itself, kernel, apt packages or more...

For k3s, you can choose a specific version to upgrade to or a "channel", so you automatically upgrade to latest patch version when is available or even to latest minor.

You can also configure the node behavior before the upgrade itself. If you want to cordon the node or drain it. By default the drain ignores `DaemonSet`s.

## The Upgrade

In my cluster, I am using Argo CD to managed the Kubernetes resources in a GitOps way.

So I started by adding the System Upgrade Controller's repository to Argo and created an Application for it.

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

After, I created one more stand alone application for the plans itself, so they can be managed separately from the controller.

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

After that, I created Plans for k3s-server (control-plane) and k3s-agent (worker).

The Plans are using `channel` to target a certain minor release of Kubernetes, so I get upgrades for patches automatically. If you do not want this behavior and want to target a specific version, use `version` within `spec`. For more information, read the [docs](https://docs.k3s.io/upgrades/automated) and I highly recommend looking into the [k3s-upgrade](https://github.com/k3s-io/k3s-upgrade) repository.

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

I could not find a list of all channels available, but there is a JSON list provided by the [channelserver](https://github.com/rancher/channelserver).

JSON channel list: [`https://update.k3s.io/v1-release/channels`](https://update.k3s.io/v1-release/channels).

After doing all that, you need to add the `k3s-upgrade` label to your nodes, you can change the labels to your own in the `spec.nodeSelector.matchExpressions`.

To add such a label, it is really easy with just a single kubectl call.

```bash
kubectl label node <node name> k3s-upgrade=true
```

It should be ok to label all nodes at once, but just to be sure, I first upgraded my control-plane and then worker nodes.

After that, you should see a new job created within the `system-upgrade` namespace. The job in it's name has which node is being upgraded by this job.

After the job finishes, you have an upgraded node. If you have more then one, the controller will automatically start upgrading next node.

After a few minutes, the k3s control plane was upgraded and I moved to agents (workers).

## Afterthoughts

I must say the setup and upgrade is incredibly easy, much more then I expected.

The controller does not need anything special to install or change in the cluster. Plans are well documented and with the [k3s-upgrade](https://github.com/k3s-io/k3s-upgrade) repository which is full of examples and more docs, it was a breeze.

Only thing I found a bit difficult was to get the list of channels, but with some experience and educated guess, I found the list as well.

I am looking forward to add more plans to upgrade the node's kernel and more.

## Links

- k3s: https://k3s.io/
- System Upgrade Controller: https://github.com/rancher/system-upgrade-controller
- k3s-upgrade repository: https://github.com/k3s-io/k3s-upgrade
