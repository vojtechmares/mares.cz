---
title: KubeCon 2025 in London – Day One
description: KubeCon in London has officially begun and I dove right into the action, gathering all the insights and news I could.
keywords: ["kubecon", "kubecon eu", "kubecon europe", "kubecon 2025", "konference", "cloudnative", "cloudnativecon"]
tags: ["konference"]
draft: false
publish_time: 2025-04-03
redirectFrom: ["kubecon-2025-prvni-den"]
alternate: "kubecon-2025-prvni-den"
---

KubeCon is finally here and with it an endless stream of news — not just from the world of Kubernetes and Cloud Native.

I'm in London for a six-day conference "marathon": Cloud Native Rejekts (March 30–31), KubeCon co-located events (April 1), and KubeCon itself (April 2–4). The co-located events are behind us, and here are my notes and discoveries.

## What I Learned

I spent most of Wednesday morning networking in the Showcase pavilion — wading through a countless array of vendor booths. From the well-known big three clouds (AWS, GCP, Azure), through GitHub, Grafana, Dynatrace, and plenty of smaller companies — whether cloud providers or startups from the world of security, pipelines, and who knows what else. There's simply a lot.

I stopped by Akuity (the company behind the Argo project — Argo CD, Workflows, Rollouts, etc.), where I asked about upcoming news. I already revealed some of it yesterday. For example, Argo CD v3.0 will be released on May 6th, and version 3.1, which will fully support OCI, should come out in August.

Who surprised me was Dynatrace. I had the impression that their product had sort of frozen in the proprietary world and wasn't moving forward — but the opposite is true. A nice, clean UI, AI for detecting security events (which didn't look bad at all), and integration with OpenTelemetry. They have a modified OTel collector — yes — but there's no problem sending anything that OTel supports (logs, metrics, and traces) into it. And one more pleasant surprise: a Czech footprint at Dynatrace. At first, we chatted in English for a bit and then came the question: "I have to ask, are you from Czechia?" — a huge icebreaker and we had a great conversation.

### The State of Backstage in 2025

For those who don't know [Backstage](https://backstage.io) — it's a tool/framework for building internal developer portals that originated at Spotify five years ago. A developer portal is a place where you find documentation, API documentation (OpenAPI and more), a map of how services are interconnected (service catalog) — all under one roof.

Since it's a framework, the main idea is that the community can easily write their own plugins — and that's exactly what happened. Backstage now has a [monorepo](https://github.com/backstage/community-plugins) on GitHub with tons of community plugins.

At the talk, maintainers discussed the state of Backstage and what they're planning for the future. Here are a few things I'd like to highlight:

Backstage in numbers:

- Happy 5th birthday!
- Over 3400 Backstage users
- More than 230 plugins
- Nearly thirty thousand stars on GitHub

Scaffolder (automation for bootstrapping repositories, APIs — basically anything you can think of):

- Checkpoints and support for action retries
- Autocomplete

OpenAPI:

- Embedded OpenAPI documentation into microsites
- Schema testing via the Jest framework
- Coming soon: Scaffolder for OpenAPI

Upcoming changes:

- Transition to a new, custom [design system](https://canon.backstage.io) and moving away from Material UI

Documentation in Backstage:

- Redesigned navigation
- Versioned documentation (stable/next)

Backstage updates:

_If you use Backstage, you know that working with it can sometimes be quite cumbersome and updates are tedious and annoying, so..._

A Yarn plugin is coming that will simplify Backstage updates and will maintain metadata in `backstage.json`. Hooray!

### How to Gateway with Ingress — 140 Days InGate

> The king is dead, long live the king!

That's roughly how I'd describe what the Ingress-NGINX project maintainer team announced yesterday.

**Ingress-NGINX is transitioning to maintenance mode and version 1.13 will be the last to contain new features.**

But there's no need to panic — it will be a long process and the team is already working on a replacement called InGate.

The crux of the matter lies in Gateway API support. The Kubernetes Ingress API is frozen and nothing new has been added to it for years — everything is now happening in Gateway API. Moreover, Ingress-NGINX is fairly complex — especially when it comes to testing and maintenance (see the recent CVE with a score of 9.8).

A few important dates to note:

- End of 2025 — InGate version 0.1
- Mid-2026 — InGate is stable (version 1.0)
- 2027 — Ingress-NGINX repository will be archived on GitHub

This is quite a big and long story — but I'll write about it in a separate article sometime later.

### Supply Chain Security

These aren't strictly notes from a single talk, but rather from several talks and from conversations with various people.

**Supply chain security** is simply a big topic — and even though there are plenty of tools available today, it's still an area that even the most experienced engineers often struggle with.

What's positive: almost everyone is aware of the problem and integrations and support are starting to appear across the entire spectrum of platforms and tools. For example, GitHub supports so-called **attestations** for all GitHub Packages. The OCI specification accounts for this too (not just attestations, but also SBOMs, signatures...).

And even governments have realized this is a problem — and are starting to require things like SBOMs for their projects. Which, in my opinion, is a good thing.

Probably the most popular tool today is [Sigstore](https://www.sigstore.dev), which handles signatures, authenticity — and even what to do when a signing key is compromised.

On the other hand, hand on heart — who thinks about supply chain security from the start of a project? For many people and projects, it's the N-th thing they start addressing when circumstances force them to — like legislation. And I'll go so far as to say this needs to change. Supply chain security for libraries should be a **high priority**, not just an afterthought.

## More Articles

_I'll be adding more articles from each day of the conferences throughout the week._

- [Rejekts 2025 in London – Day One](/en/blog/rejekts-2025-day-one)
- [Rejekts 2025 in London – Day Two](/en/blog/rejekts-2025-day-two)
- [KubeCon Co-located Events 2025 in London](/en/blog/kubecon-co-located-events-2025)
- [KubeCon 2025 in London – Day One](/en/blog/kubecon-2025-day-one) _(this article)_
