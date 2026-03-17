---
title: KubeCon Co-located Events 2025 in London
description: "Notes from KubeCon 2025 co-located events in London: ArgoCon, CiliumCon, Platform Engineering Day, Data on Kubernetes, and more."
keywords: ["kubecon", "kubecon europe", "kubecon london", "2025", "london", "kubecon 2025"]
tags: ["konference"]
draft: false
publish_time: 2025-04-02
---

I'm in London for a six-day conference "marathon": Cloud Native Rejekts (March 30–31), KubeCon co-located events (April 1), and KubeCon itself (April 2–4). The co-located events are behind us, and here are my notes and discoveries.

## What are KubeCon co-located events

KubeCon, full name [KubeCon + CloudNativeCon](https://events.linuxfoundation.org/kubecon-cloudnativecon-europe/), is an event organized by the [Cloud Native Computing Foundation (CNCF)](https://www.cncf.io/) several times a year — in Europe, the United States, India, and China. As part of the current KubeCon format, co-located events take place on Tuesday. This year's co-located events were: ArgoCon, BackstageCon, CiliumCon, Cloud Native + Kubernetes AI Day, Cloud Native Telco Day, Cloud Native University, Data on Kubernetes Day, EnvoyCon, Istio Day, Kubeflow Summit, Kubernetes on Edge Day, Linkerd Day, Observability Day, OpenFeature Summit, OpenTofu Day, Platform Engineering Day. Wow! That's really a lot — fortunately some are only half a day, but it's humanly impossible to attend everything. Typically several talks run in parallel and you simply have to choose...

I primarily went after topics like GitOps, multi-cluster, networking, and observability. So I attended talks at ArgoCon, CiliumCon, Observability Day, and Platform Engineering Day.

That covers the formalities and a brief introduction — for those of you who haven't been to KubeCon yet.

## What I Learned

Like the previous days, I went to a lot of talks, but I also stopped by the Isovalent (Cilium) and Akuity (Argo) booths.

So first, a few general news items — you may already know about some of them...

- Argo CD v3.0 will be released on May 6th (a [Release Candidate](https://github.com/argoproj/argo-cd/releases) is currently available)
- OCI artifact support in Argo CD will come in version 3.1, expected around August
- Cilium from version 1.17 supports [Multi-Cluster Services API](https://github.com/kubernetes-sigs/mcs-api), see [KEP-1645](https://github.com/kubernetes/enhancements/tree/master/keps/sig-multicluster/1645-multi-cluster-services-api)
- Multi-Cluster Services API should release the `v1alpha2` API this year, and hopefully we'll see the first beta version next year
- Google Cloud Console will support **dark mode**

### Simplifying Multi-Cluster Networking with Cilium and MCS-API

Cilium has supported so-called Cluster Mesh and connecting _Services_ across clusters for a while now. Currently, this is handled through annotations, which is easy and functional, but doesn't integrate well with other tools...

But Cilium from version 1.17 (released February 4, 2025) supports [Multi-Cluster Services API](https://github.com/kubernetes-sigs/mcs-api) — an official Kubernetes project aimed at standardizing multi-cluster connectivity and the use of _Service_ objects.

MCS-API first appeared back in 2020, but it's one of those slowly evolving projects and only `v1alpha1` is available so far. That doesn't mean you can't start using it, though. And that's exactly what Isovalent (the company behind Cilium, acquired by Cisco in 2024) did — they added MCS-API support to Cilium. Super cool!

I won't go into all the details, but in short, here's what it does and how it works:

- Using Cilium Cluster Mesh, you connect clusters via a private network (you don't need _Ingress_ everywhere) — ideally with non-overlapping IP blocks
- Instead of Cilium annotations, you use the _ServiceExport_ CRD (created manually) and the _ServiceImport_ CRD (created automatically by Cilium)
- In all clusters where a _Service_ is imported, you can use it exactly like a regular _Service_
- The only change is the _Service_ domain — instead of `<service-name>.<namespace>.svc.cluster.local`, it's `<service-name>.<namespace>.svc.clusterset.local` (ending in `.clusterset.local` instead of `.cluster.local`) — and otherwise you don't need to worry about anything, nice!

If you're interested in the details, check out the [MCS-API](https://github.com/kubernetes-sigs/mcs-api) repository, [KEP-1645](https://github.com/kubernetes/enhancements/tree/master/keps/sig-multicluster/1645-multi-cluster-services-api), and the Cilium [documentation](https://docs.cilium.io/en/stable/network/clustermesh/mcsapi/#deploying-a-simple-example-service-using-mcs-api).

### Multi-Cluster Magics with Argo CD and Cluster Inventory

Where to even begin... Argo CD was deploying applications to **different clusters** based on metrics — a kind of cross-cluster scaling. That demo was pure black magic!

It was quite a ride, so I don't have many notes, but it was about Cluster Inventory, integration into a hub/spoke model, and how to wrap it all together with Argo CD.

I managed to find the [slides](https://static.sched.com/hosted_files/colocatedeventseu2025/81/ArgoCon-%20Multi%20Cluster%20Magics%20with%20Argo%20CD%20and%20Cluster%20Inventory.pdf), and once the recording is available, I'll watch it again.

### Platform Engineering for Architects – Crafting Platforms as a Product

A really nice talk about platforms and platform engineering. A platform that exists just for the sake of existing is useless. A platform needs a vision, it needs to solve a problem, and it needs to provide developers with a solution. And how people fit into all of this...

An absolutely great term: **randomeering** — engineering where you just keep adding tools to your cart based on whatever comes your way — with no vision, no direction, no real problem to solve.

I noted down several quotes:

> Platform without usage is just infrastructure.
> Solve problems you have, not the ones you **may** have.
> Products have longevity. Products have deadlines.
> Convince management not to set deadlines and budgets. Platform should show its value.
> Get feedback from end-users [developers].
> Platform should be changeable and needs to change over time.

Three pillars of change: _people, culture, purpose_.

In short: a platform is an internal product — not a one-off project.

If you have a better way of gathering feedback from developers, let me know — for example on Twitter, just tag me [@vojtechmares\_](https://x.com/vojtechmares_).

### Argo at Scale: Navigating Complex Multi-Dimensional Deployments Across Hundreds of Clusters

First, Adobe in numbers: 430+ clusters, 250+ Helm charts, 550+ deployments per month (nearly 20 per day).

How do they handle it? Phew...

- Argo CD _ApplicationSet_ + merge generators
- Expect the unexpected (outages of all kinds and don't expect 100% uptime)
- Filter alerting/events to only show failing deployments (otherwise you'll go crazy)
- Monitoring and Grafana dashboards for your Argo CD instance, applications, and anything else you need

### Scale GitOps with the Argo CD Agent and Open Cluster Management

The talk was essentially an introduction to Open Cluster Management, the Argo CD Agent, and how they work together.

[Open Cluster Management (OCM)](https://open-cluster-management.io/) is an open-source tool for managing multi-cluster solutions. It can not only manage clusters (for example using [Cluster API](https://cluster-api.sigs.k8s.io/)) but also deploy applications via Helm charts. It's been around for five years (and I'm only finding out about it now?!), and today it supports both Argo CD and SIG-Multicluster.

[Argo CD Agent](https://argocd-agent.readthedocs.io/latest/) is an open-source solution primarily developed by Red Hat — essentially an alternative to the Akuity Cloud Platform (managed Argo CD, Kargo, and agent). It's a free version, but still relatively in its early stages. A stable-ish version is expected by the end of the year. The agent doesn't yet support [Kargo](https://kargo.io/) or other tools from the Argo ecosystem — so we'll see what time brings.

Interesting, but it needs a bit more time.

## More Articles

_I'll be adding more articles from each day of the conferences throughout the week._

- [Rejekts 2025 in London – Day One](/en/blog/rejekts-2025-prvni-den)
- [Rejekts 2025 in London – Day Two](/en/blog/rejekts-2025-druhy-den)
- [KubeCon Co-located Events 2025 in London](/en/blog/kubecon-pridruzene-akce-2025) _(this article)_
