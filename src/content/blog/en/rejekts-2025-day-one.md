---
title: Rejekts 2025 in London – Day One
description: What was the first day (Sunday) at Cloud Native Rejekts 2025 in London like? What are Rejekts? And what did I learn?
keywords: ["cncf rejekts", "rejekts", "kubecon", "2025", "london", "rejektsio"]
tags: ["konference"]
draft: false
publish_time: 2025-03-31
redirectFrom: ["rejeckts-2025-prvni-den", "rejekts-2025-prvni-den"]
alternate: "rejekts-2025-prvni-den"
---

I'm in London for a six-day conference "marathon": Cloud Native Rejekts (March 30–31), KubeCon co-located events (April 1), and KubeCon itself (April 2–4). Rejekts comes first – and I've just wrapped up day one. How was it?

## What Are Cloud Native Rejekts

Rejekts is a small two-day conference for talks that didn't make it into KubeCon.

In their own words:

> Cloud Native Rejekts is the b-side conference giving a second chance to the many wonderful, but rejected talks leading to KubeCon + CloudNativeCon.

Thanks to sponsors, Rejekts is free of charge and takes place in an interesting venue, but with very limited capacity – so it's hard to get in. I personally only got in from the overflow waitlist.

![Vojta Mareš at Rejekts](https://cdn.mares.cz/80_EE_95_FB_007_E_44_C0_A6_FD_609_C35_A90_FCE_7a9bf1f1a5.PNG)

_Yes, I'm also joining the ChatGPT trend of images remade in Studio Ghibli style._

### What Do Rejekts and KubeCon Have in Common

As I mentioned above – Rejekts features talks that people submitted to KubeCon (and CloudNativeCon) but didn't get accepted. Rejekts becomes their second chance to present.

## What Interesting Things I Learned

On Sunday I attended eight talks. Here are the highlights of what I encountered.

### Immutable Turtles All the Way Down – Image-Based Kubernetes to Power In-Place Updates

Probably the best talk I attended on Sunday!

Presented by Thilo Fromm.

How to leverage Flatcar Linux and systemd extensions for component updates.

First, a brief introduction to Flatcar Linux:

> A community Linux distribution designed for container workloads, with high security and low maintenance.

PS: Flatcar is currently in the process of onboarding under CNCF.

Flatcar uses systemd to manage running processes within the system, which you configure using an _ignition_ file.

Thanks to [systemd-sysext](https://www.freedesktop.org/software/systemd/man/latest/systemd-sysext.html), it's possible to automate their updates – a new version is downloaded as a filesystem image, which is then mounted to the disk, and after a restart the new version starts running. Images are downloaded from a remote server – either the official one, or you can run your own.

systemd-sysext supports so-called _staged updates_, where the update is split into phases that must happen sequentially but can be triggered separately – first download and prepare, then independently perform the actual restart and activate the changes.

For managing Kubernetes node restarts, tools like [Kured](https://kured.dev/) work well, or Flatcar offers its own [operator](https://github.com/flatcar/flatcar-linux-update-operator).

Flatcar offers [sysext-bakery](https://flatcar.github.io/sysext-bakery/) – a collection of ready-made solutions that you just need to add to your ignition file.

My takeaway: Flatcar is even better than before! sysext is a great way to automatically update Kubernetes nodes with a bit of configuration (though Flatcar is independent of Kubernetes and can be used anywhere). Easy in-place updates, support for any Kubernetes distribution (vanilla kubeadm, k3s, rke2...), openness to new tools, independence (no need for official Flatcar servers).

This really excited me and I'm looking forward to running all clusters on Flatcar Linux – for example on [k0s](https://k0sproject.io/) – without having to worry about updates. Everything just takes care of itself!

### Building Air-Gapped Control Planes for a Global Pharma Leader Using Crossplane and Argo CD

Presented by Antonela Cukurin and Yury Tsarev.

What does building infrastructure look like for a regulated environment (pharma, healthcare), where the kube-apiserver has no public internet access – and how to build and manage such an environment using Crossplane.

First and foremost, we once again run into the chicken-and-egg problem: How do you build the first hub cluster when you don't have one?

The solution is to run [Crossplane](https://www.crossplane.io/) in a CI pipeline using GitHub Actions on a GitHub-managed runner. This creates the first Bastion VM, network, resource group in Azure... The Bastion then registers itself as a self-hosted runner for GitHub Actions, where another pipeline runs to create the cluster – and from there, anything else can be created (databases, clusters, load balancers...).

My takeaway: Crossplane can be run in a pipeline – and it's a nice way to solve the chicken-and-egg problem.

### CRD Data Architecture for Multi-Cluster Kubernetes

Presented by Clay Baenziger.

Multi-cluster is no joke. Building multiple clusters today isn't such a big problem thanks to tools like [Cluster API](https://cluster-api.sigs.k8s.io/) or [Karmada](https://karmada.io/). But _day-two operations_ are still the wild west. Everyone essentially needs the same thing and there are already several open-source projects tackling this – for example Azure Fleet.

Clay talked, among other things, about how they solve this at Bloomberg. Because their multi-cluster solution is fairly old, they use the tool [Karmada](https://karmada.io/).

He also mentioned the Kubernetes Enhancement Proposal (KEP) [KEP-4322: Cluster Inventory](https://github.com/kubernetes/enhancements/blob/master/keps/sig-multicluster/4322-cluster-inventory/README.md) and how it fits into multi-cluster management – and that we're essentially waiting on SIG-Multicluster...

Another KEP – [KEP-1645: Multicluster Services API](https://github.com/kubernetes/enhancements/blob/master/keps/sig-multicluster/1645-multi-cluster-services-api/README.md) – highlights that there is still no standard for connecting services across clusters.

He further mentioned so-called _Tiers_, which they use to handle similar/identical cluster configurations. Because they have so many clusters, they no longer manage individual clusters but added the concept of _Tiers_. This builds on the concept of _Cluster Sameness_, which in turn builds on _Namespace Sameness_ (see the [document](https://github.com/kubernetes/community/blob/master/sig-multicluster/namespace-sameness-position-statement.md) from SIG-Multicluster).

When managing several clusters and using a "hub" Kubernetes cluster as a metadata database for clusters, etcd (the brain of Kubernetes) is often not fast enough – I recommend using a project like [Kine](https://github.com/k3s-io/kine), which was created as part of [k3s](https://k3s.io/).

Finally, he mentioned how complex authentication and authorization are in the multi-cluster world – both for users and workloads.

My takeaway: It's complicated and requires experienced people. Cluster API handles _day zero/one operations_, but _day two operations_ are still the wild west. I recommend looking at [Open Cluster Management](https://open-cluster-management.io/) and considering replacing etcd with another database for _hub_ clusters – for example PostgreSQL via Kine.

### OCI Registry as a Secure and Single Source of Distribution for Your Container Images & Artifacts

Presented by Stephane Este-Gracias.

How the OCI registry is becoming practically the standard and the single registry for all artifacts.

OCI registry today supports practically everything:

- container images
- Kubernetes manifests
- ML models
- attestations (provenance proof, Git metadata, author...)
- signatures

Interesting fact: [CloudNativePG](/en/blog/cloudnativepg-postgresql-on-kubernetes) plans to use OCI artifacts for distributing PostgreSQL extensions – thanks to Kubernetes 1.33+, which makes it possible to mount an OCI artifact as a volume mount into a running container.

Useful tools, not just for working with OCI:

- [Oras](https://oras.land/) – a tool for working with OCI artifacts
- [Cosign](https://github.com/sigstore/cosign) – signing (primarily container images)
- [Trivy](https://trivy.dev/) – security vulnerability scanning
- [Skopeo](https://github.com/containers/skopeo) – a tool for working with remote container images

My takeaway: OCI is practically a repository for all artifacts, everything can be signed and have an SBOM attached – security without compromise. Kubernetes (1.33, beta feature) plans support for OCI volume mounts into containers.

### End to End Message Authenticity in Cloud Native Systems

Presented by Lucas Kaldstrom and Micah Hausler.

mTLS and OIDC are not a silver bullet – so how do we secure the trustworthiness and authenticity of messages over HTTP?

Lucas and Micah talked about the new [IETF RFC 9421: HTTP Message Signatures](https://datatracker.ietf.org/doc/rfc9421/), which adds support for HTTP headers where you can add a signature and thus validate individual requests. The RFC also accounts for proxies and gateways – it's possible to add headers that aren't signed but won't break the message and signature compatibility.

However, the problem of secure key distribution remains (how to securely distribute symmetric/asymmetric keys...).

Today, AWS sigv4 works similarly, and there's a proposal to extend [SPIFFE](https://spiffe.io/) support with this RFC.

My takeaway: HTTP is evolving not only at the protocol level (HTTP/2, HTTP/3) but also in the area of security and request authentication.

### Geographically Distributed Clusters: Resilient Distributed Compute on the Edge

Presented by Alex Bissessur.

A story about how on the island of Mauritius they're solving cloud for a startup without any availability of common clouds (AWS, GCP, Azure...). And also about how the government long considered cloud to be dangerous ("cloud = bad"). Ping to South Africa is 60 ms, to Europe 600 ms – ouch!

The solution? "Embrace the homelab!"

They literally created a network of homelabs.

It's a single k3s cluster stretched across 3 houses on the island (latency 1–2 ms), with at least three nodes in each house (nine total).

For storage they use Longhorn – and surprisingly have no issues, which surprised everyone.

The biggest challenge was networking – throughput and connectivity. They currently use Tailscale and have all nodes in a single Tailscale network. In the future, they plan to migrate to [Headscale](https://headscale.net/). Ingress is also handled through Tailscale.

My takeaway: Even a small and punk-style environment can comfortably run production workloads – right there on an island, with minimal resources and second-hand mini-PCs.

I'd sum up this talk with: "Where there's a will, there's a way."

## Recording

For those of you who aren't in London and want to watch the talks at least from a recording – Rejekts has a public [YouTube playlist](https://www.youtube.com/watch?v=uvoygNU35h0&list=PLnfCaIV4aZe8-XjMQ84xxOW_0PWpAN50n) with recordings of all talks.

## More Articles

_I'll be adding more articles from each day of the conferences throughout the week._

- [Rejekts 2025 in London – Day One](/en/blog/rejekts-2025-day-one) (this article)
- [Rejekts 2025 in London – Day Two](/en/blog/rejekts-2025-day-two)
- [KubeCon Co-located Events 2025 in London](/en/blog/kubecon-co-located-events-2025)
