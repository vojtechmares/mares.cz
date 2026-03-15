---
title: Rejekts 2025 in London -- Day Two
description: What was Monday aka the second day at Cloud Native Rejekts 2025 in London like? What are Rejekts? And what did I learn?
keywords: ["cncf rejekts", "rejekts", "kubecon", "2025", "london", "rejektsio"]
tags: ["konference"]
draft: false
publish_time: 2025-04-01
redirectFrom: ["rejeckts-2025-druhy-den"]
---

I'm in London for a six-day "marathon" of conferences: Cloud Native Rejekts (March 30--31), KubeCon co-located events (April 1), and KubeCon itself (April 2--4). Rejekts are first -- and I've finished the second day. How was it?

## What Are Cloud Native Rejekts

Rejekts is a small two-day conference for talks that didn't make it to KubeCon.

In their own words:

> Cloud Native Rejekts is the b-side conference giving a second chance to the many wonderful, but rejected talks leading to KubeCon + CloudNativeCon.

Thanks to sponsors, Rejekts is free, and it takes place at an interesting venue with very limited capacity -- so it's hard to get in. I got in from the waitlist overflow myself.

![Vojta Mares at Rejekts](https://cdn.mares.cz/80_EE_95_FB_007_E_44_C0_A6_FD_609_C35_A90_FCE_7a9bf1f1a5.PNG)

_Yes, I'm also joining the trend of ChatGPT images remade in Studio Ghibli style._

### What Rejekts and KubeCon Have in Common

As I wrote above -- Rejekts features talks that people submitted to KubeCon (and CloudNativeCon) but didn't get accepted. Rejekts becomes their second chance to present.

## What Interesting Things I Learned

On Monday, I attended several talks again -- some better, others weaker. Here are my takeaways.

### Evaluating Global Load Balancing Options for Kubernetes in Practice

_For me, probably the most interesting talk of the day._

Presented by Tobias Schneck and Nicolai Ort.

How to do load balancing in Kubernetes?

You can buy a ready-made HA solution, for example from Google Cloud (GSLB), Cloudflare, Fastly, Akamai... but if you don't want to buy an off-the-shelf product, you can build it yourself.

Multiple clusters and connecting them: [Cilium Cluster Mesh](https://docs.cilium.io/en/latest/network/clustermesh/intro/). You get internal endpoints and interconnected clusters, it works well, but it doesn't solve ingress when one cluster goes down. Also, the clusters need to see each other and their IP ranges must not overlap.

Ingress solution: [K8GB -- Kubernetes native Global Load Balancer](https://www.k8gb.io/). K8GB works by running its own CoreDNS instance in the cluster, which manages DNS A records for ingress domains, and uses external-dns to configure something like Cloudflare, adding DNS NS records for the new CoreDNS instances. Those then resolve DNS.

It's a very nice solution. Of course, in a multi-cluster setup, you need to connect K8GB across clusters so they don't interfere with each other's configuration. And since DNS is the source of all problems (it's always DNS...) and heavily cached, a brief outage can occur during failover. In the live demo, it was under one minute.

**My takeaway**: Failover/HA can be solved through multiple clusters and Cilium Cluster Mesh for internal services. For public services (APIs, etc.), either use a ready-made solution or K8GB.

### Simplifying Cross-Cloud, Cross-Cluster Connectivity with Dapr & Cilium

Presented by Alice Gibbons and Manuel Zapf.

This talk was essentially one big feature showcase -- and what I'm taking away is that [Dapr](https://dapr.io/) gets better every year. Using its SDK, I can make developers' lives incredibly easier while the platform team manages the individual services (Redis, Kafka...). Developers don't actually care about any of it and everything works very nicely. And combined with Cilium -- back to Cluster Mesh and connecting multiple clusters -- Dapr doesn't care where things run. Just awesome!

### The Service Mesh Wars: A New Hope for Kubernetes

Presented by Henrik Rexed.

The talk was a big comparison of various Service Mesh solutions: Kuma, Linkerd, Cilium, Istio, Ambient, and their connection with Gateway API.

There's no clear winner here -- it depends on what you're looking for your use case. For me, the important decision points are:

- [**Kuma**](https://kuma.io/) is easy to deploy and configure
- [**Linkerd**](https://linkerd.io/) is laborious to configure but quite fast -- however, it has minimal observability
- [**Cilium**](https://cilium.io/) is primarily a network plugin and lacks Service Mesh functionality (retries, circuit breaker, rate limiting) -- but it's super fast and adds no latency
- [**Istio**](https://istio.io/) is decent, but adds latency (on the OTel demo it was about 15 ms)
- [**Ambient (Istio without sidecar)**](https://istio.io/latest/blog/2022/introducing-ambient-mesh/) can't do some things yet, but once it can, it will probably be the best path

And what about Gateway API? The specification doesn't support retries, circuit breaking, or rate limiting yet, but for example Envoy Gateway handles that through its own CRD. The Gateway API GAMMA initiative (Gateway API for Service Mesh) is getting started and maybe in two years it will solve all our problems...

**My takeaway**: Ehhh, it depends on what I want -- and I have to choose accordingly. There's no clear winner yet.

### The Kubernetes Guardians: A Deep Dive Into Your Security Avengers

Presented by Henrik Rexed and Ben Hirschberg.

Again, this was mainly a comparison of security tools: Falco, KubeArmor, Tetragon, Kubescape. But this time there is a winner.

Not all tools are created equal. Some function as a runtime policy engine -- enforcing rules at runtime -- while others mainly just report events. Everyone handles configuration differently, and deployment models vary too -- from DaemonSet to solutions with an operator, several CRDs, deployments, and a DaemonSet on top.

**My takeaway**: Kubescape is the easiest, has sensible smart defaults, and you just deploy it to the cluster -- and immediately get meaningful information. All solutions add latency though, potentially even 10 ms in a microservices callstack.

### Scaling PDBs: Introducing Multi-Cluster Resilience with x-pdb

Presented by Moritz Johner.

How to handle [_PodDisruptionBudget_](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) in a multi-cluster world and maintain pod counts across clusters.

Use case: Form3 runs clusters across cloud providers and on-prem solutions and needs to ensure high availability of CockroachDB (a distributed SQL database). Because CockroachDB uses Raft (a distributed consensus algorithm), a majority of nodes in the Raft cluster is always needed. The classic _PodDisruptionBudget_ handles this and allows defining how many pods can be lost through regular eviction ([Evictions](https://kubernetes.io/docs/concepts/scheduling-eviction/)), but doesn't handle forced evictions (node pressure -- RAM, disk, CPU, network).

That's why Form3 created the open-source project [x-pdb](https://github.com/form3tech-oss/x-pdb), which handles PDB across clusters. x-pdb works based on an admission webhook and Eviction API call hijacking, so it's independent of the Kubernetes provider. Individual controllers are connected and use the native Kubernetes _lease_ object to acquire a lock in each cluster before manipulating pods. The solution isn't perfect and race conditions can occur in edge cases -- but in a year, it hasn't happened to them even once. If the controller can't acquire a lock in other clusters, the default behavior is to not allow any pod manipulation.

**My takeaway**: Multi-cluster is no joke -- especially with stateful applications (e.g., databases) that are spread across clusters. With stateless applications (e.g., an API backend), it's more manageable -- the application might briefly run in a degraded state, which isn't possible with Raft -- the cluster would fall apart.

### The Infinite Hotel: Scaling Multi-Tenant Platforms through a Unified API

Presented by Carlos Mestre del Pino and Christopher Haar.

A fun talk with an analogy of an infinite hotel, with infinite floors, rooms, services... or how not to lose your mind around infinity and how this maps to multi-tenant solutions.

It wasn't a technical deep dive, but it summarized the challenges of scaling "to infinity" very nicely -- and that it just doesn't work that easily. You need to prepare for scaling. I recommend the recording if multi-tenancy is something you deal with.

**My takeaway**: Multi-tenancy is no joke. It's worth investing time into thinking through the solution rather than diving in head first. Loft [vCluster](https://www.vcluster.com/) is great for running tenants in their own Kubernetes cluster -- without having to maintain hundreds of separate clusters in the cloud.

### Wasm, Envoy, and Hyperlight Walk Into a Pod: No Vulnerabilities Allowed

Presented by Danilo (Dan) Chiarlone and Mikhail Krinkin.

Introduction of the project [Hyperlight -- Virtual Machine Manager (VMM)](https://github.com/hyperlight-dev/hyperlight) in Rust for WASM applications -- and how Hyperlight implements Envoy for filters. Important note: the Hyperlight sandbox is destroyed after each filter call and has no persistent data.

In general, Hyperlight can be used for securely executing third-party code -- because it doesn't allow direct calls to any SYSCALLs. Everything goes through Hyperlight, and specific functions must be explicitly provided to the WASM program, which calls them through Hyperlight.

### Lightning Talks

At the end of Rejekts, there was a series of so-called lightning talks -- 5-minute presentations.

Since these were five-minute talks, here's the brief version:

- [Gateway API](https://gateway-api.sigs.k8s.io/) and `BackendTLSPolicy` -- a path to end-to-end TLS (i.e., TLS internet-gateway-backend)
- Podman and [Kind](https://kind.sigs.k8s.io/) -- [Podman Desktop](https://podman-desktop.io/) has first-class integration for KinD (Kubernetes in Docker) and local cluster management
- OpenTelemetry auto-instrumentation -- startup overhead is small (comparable to manual instrumentation), it's easy, don't be afraid of it
- [Headlamp -- GUI for Kubernetes](https://headlamp.dev/) -- as a local application or web interface
- [YAML v1.3](https://www.yaml.io/spec/1-3/) -- YAMLScript, writing code in YAML -- and note, YAML v1.3 was presented by the creator of YAML himself, Ingy dot Net

## Recording

For those of you not in London who want to watch the talks at least from a recording -- Rejekts has a public [YouTube playlist](https://www.youtube.com/watch?v=uvoygNU35h0&list=PLnfCaIV4aZe8-XjMQ84xxOW_0PWpAN50n) with recordings of all talks.

## More Articles

_I'll be adding more articles from each day of the conferences throughout the week._

- [Rejekts 2025 in London -- Day One](/en/blog/rejekts-2025-prvni-den)
- [Rejekts 2025 in London -- Day Two](/en/blog/rejekts-2025-druhy-den) _(this article)_
- [KubeCon Co-located Events 2025 in London](/en/blog/kubecon-pridruzene-akce-2025)
