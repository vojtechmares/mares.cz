---
title: KCD Prague 2024
description: What was this year's Kubernetes Community Days Prague 2024 by the CNCF CZ/SK community like? Read about the experience and check out photos from the conference.
keywords: []
tags: ["konference"]
trainingAd:
draft: false
publish_time: 2024-06-08
alternate: "kcd-prague-2024"
---

On June 6th and 7th, 2024, the [Kubernetes Community Days Prague 2024](https://community.cncf.io/events/details/cncf-kcd-czech-slovak-presents-kcd-czech-slovak-2024/) conference took place in Prague at the FIT CTU building, organized by the [Czech-Slovak CNCF community](https://community.cncf.io/kcd-czech-slovak/).

Thanks to everyone who helped prepare the conference and to everyone who attended. You were amazing!

This year, the organizers picked a great date, because June 6th is Kubernetes' birthday. And this year, it was a milestone 10th birthday!

![Happy 10th birthday Kubernetes](https://cdn.mares.cz/hbd_k8s_10_d716d0b4be.png)

## What is KCD?

KCD stands for Kubernetes Community Days. It's a local event focused on Kubernetes (with [CNCF](https://www.cncf.io/) support) and related technologies. The event is aimed at developers, DevOps engineers, SREs, administrators, and anyone interested in Kubernetes. At KCD, you can look forward to interesting talks, workshops, and networking.

## Workshop with cybroslabs

On Thursday, June 6th, together with [cybroslabs](https://www.cybroslabs.com/) (a proud sponsor of this year's KCD in Prague), we held a workshop on **Deploying a cloud-native application into a regulated energy environment**.

> We'll show how we at cybroslabs handle deployment of a cloud-native application into a heavily regulated energy environment (read: not a cloud-native environment). From the ground up with Kubernetes, environment configuration, high-availability Kubernetes cluster with RKE2, a demo of deploying application components and testing high availability, disaster recovery, database failover, and backup restoration.

The workshop had great attendance. We demonstrated the deployment on our [Turing Pi](https://turingpi.com/) cluster that we brought along.
We showed how we handle deployment for our customers, how we tackle challenges around Kubernetes, cluster deployment, management, and all the way to deploying the application itself, including a brief demo of what we're working on.

I'd also like to mention our open-source ingress controller [Cloudflare Tunnel Ingress Controller](https://github.com/clbs-io/cloudflare-tunnel-ingress-controller), available on GitHub under the [clbs-io](https://github.com/clbs-io) organization. For IoT, edge, demos, or a home lab, it's a great tool for getting your applications on the internet without needing a static IP address or port forwarding.
Using standard Kubernetes Ingress and [Cloudflare Tunnel](https://www.cloudflare.com/en-gb/products/tunnel/).

_Unfortunately, the workshop was not recorded — at least we have a few photos._

![Vojtech Mares presenting a workshop and pointing at the projection screen](https://cdn.mares.cz/kcd_cybroslabs_workshop_1_cd6db5163d.jpg)
![An open computer case with stickers on the open lid and a Gopher plush (Golang mascot) next to it](https://cdn.mares.cz/kcd_cybroslabs_workshop_2_f057e1980f.jpg)
![Vojtech Mares and Ladislav Capka presenting a workshop](https://cdn.mares.cz/kcd_cybroslabs_workshop_3_247d9467be.jpg)

## Talk about CloudNativePG

On Friday, June 7th, I gave a talk on **CloudNativePG - PostgreSQL on Kubernetes the right way**.

During the talk, I introduced the open-source Kubernetes Operator for PostgreSQL, [CloudNativePG](https://cloudnative-pg.io/), its capabilities, and shared my/our (with cybroslabs) experience running PostgreSQL on Kubernetes in a production environment.
Among the most important CNPG features are HA Postgres cluster management, backups and recovery, streaming replication, monitoring integration with Prometheus, and cluster-level replication.

If you're interested in running a PostgreSQL cluster on Kubernetes, come to my training [Postgres on Kubernetes](/en/training/postgres-on-k8s).

![Vojtech Mares with a microphone, presenting about CloudNativePG](https://cdn.mares.cz/kcd_vm_talk_cnpg_1f9af4db2a.jpg)

I think the talk went well, but there's still room for improvement. I'd give myself a 7/10.

_The full presentation is available [here](https://docs.google.com/presentation/d/1LtF5K7xuTqlAOUQaW2XcFqQbO6HRTuld/edit?usp=sharing&ouid=115084391547465813704&rtpof=true&sd=true). The [recording](https://www.youtube.com/watch?v=g6sPL-DXHvg) is also on YouTube._

## My highlights from KCD

These are just my observations, of course. If you're interested in other talks, here's the YouTube [playlist](https://www.youtube.com/watch?v=6u2SxjHeKHo&list=PLzO-esMdGBjf7JDrkw9jYTvxg9X5iYmD7) of the presentations.

### KEDA supports Gateway API!

[KEDA (Kubernetes Event-Driven Autoscaler)](https://keda.sh/) now supports and continues to expand support for Kubernetes [Gateway API](https://gateway-api.sigs.k8s.io/) (the future of Kubernetes Ingress).

And that's not all — KEDA enables scaling down to zero. And without tools like Knative. The trade-off is that a KEDA Interceptor (proxy) sits in front of your workload and handles scaling decisions. There was a demo too, and it worked really nicely.
The speed at which KEDA scaled pods was truly impressive. Unlike regular HPA (Horizontal Pod Autoscaler), which scales based on CPU/RAM usage, scaling based on request count was much faster — both scale up and scale down.

When I asked about the performance overhead, the answer was that according to benchmarks, response time is about 10ms longer and the number of requests handled per second dropped from 2000 to 1600, which is a 20% decrease.
That's not negligible, but if your application doesn't need to be strictly real-time, it's livable and you benefit from more efficient scaling. WebSockets are not yet supported, but there's an open pull request on GitHub.

### Event mesh

As if we didn't have enough meshes in the Kubernetes world, let's add an event mesh on top of the service mesh!

Event mesh is integrated into [Knative](https://knative.dev/docs/). And yet for a quick demo, Kafka wasn't even needed.

Event mesh builds on separating data reads (synchronous operations) from writes (asynchronous operations). This goes hand in hand with the CQRS principle ([Command Query Responsibility Segregation](https://en.wikipedia.org/wiki/Command_Query_Responsibility_Segregation)).

Up to this point, event mesh isn't really different from event sourcing. For me, the breakthrough was
how easily it could be integrated into a legacy application (in this case, a Java application demo) while also having new (micro)services alongside it, for example in Rust.

The downside of event mesh is that data isn't always consistent ([eventual consistency](https://en.wikipedia.org/wiki/Eventual_consistency)), but that's the price of asynchronous processing.

### Comparing Kubernetes PostgreSQL operators

Coincidentally, right before my talk, there was a presentation about various Kubernetes PostgreSQL operators. I had done this comparison myself a few months back,
before we at cybroslabs settled on CNPG.

Operators mentioned included Zalando, CrunchyData PGO, CloudNativePG, StackGres, and briefly the bitnami/postgresql Helm Chart.

David Pech not only talked about the differences between the individual operators but also showed benchmark results for each.

In conclusion: **CloudNativePG is great!** I was naturally pleased by this, as I could follow up directly with my own talk.
But if you're not PostgreSQL experts and have the option to use a managed database, that's a better choice.

## Thanks and see you next year!

In two packed days, I attended a lot of great talks, gave a presentation and led a workshop, met old friends and made new connections...

Thanks for an amazing event in Prague and looking forward to next year in Bratislava!

![Group photo of KCD Prague 2024 attendees](https://cdn.mares.cz/kcd_group_photo_86f48b7899.jpg)
