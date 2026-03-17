---
title: Why Kubernetes?
description: In this article, I write about why Kubernetes is so widespread and why it will be with us for a long time to come.
keywords: ["kubernetes", "infrastructure", "containers", "docker", "devops", "cloud"]
tags: ["kubernetes"]
trainingAd: kubernetes
draft: false
publish_time: 2024-08-26
redirectFrom: ["proc-kubernetes"]
alternate: "proc-kubernetes"
---

This year in June, Kubernetes celebrated its tenth anniversary. Over that time, the project has gained enormous popularity and spread absolutely everywhere (from data centers, through edge to AI including "homelab"), and a huge ecosystem has formed around Kubernetes, mainly thanks to CNCF ([Cloud Native Computing Foundation](https://www.cncf.io/)).

## What Is Kubernetes?

Kubernetes is the most widespread container orchestrator. A tool you tell: "here's a container, some configuration, and run it 5 times."
And Kubernetes ensures that all containers (in Kubernetes terminology _Pods_) are running and restarts them in case of failure.

That's the very short version. Kubernetes can do much more, such as automatic scaling of applications, but also of the cluster itself.
And with the help of the ecosystem: application and self-monitoring, logging, backups, application and data security, CI/CD, and much more.

### A Bit (More) of History

The original concept of Kubernetes (at least its predecessor) was created at Google under the name **Borg** in **2003** (wow, 21 years!).

Borg was an internal tool that ran thousands of jobs (_Job_ meant everything, from a classical job to something like an HTTP server) in large clusters across many data centers.

**2013**: A new system, **Omega**, was created to replace Borg. Omega handles larger clusters, more jobs, and is more flexible.

**2014**: Google announced a new project, **Kubernetes**, which is an open-source version of Borg. On June 7th, the [first commit](https://github.com/kubernetes/kubernetes/commit/2c4b3a562ce34cddc3f8218a2c4d11c7310e6d56) appeared, and on June 10th, Microsoft, Red Hat, IBM, and Docker joined the [Kubernetes community](https://cloudplatform.googleblog.com/2014/07/welcome-microsoft-redhat-ibm-docker-and-more-to-the-kubernetes-community.html).

**2015**: Kubernetes was released as version v1.0, and Google, in collaboration with the [Linux Foundation](https://www.linuxfoundation.org/), founded [CNCF](https://www.cncf.io/).
The goal of CNCF is to build a stable ecosystem not only around Kubernetes, but around container orchestration as a whole and the related world of microservices. In autumn, Kubernetes v1.1 was released.

**2016**: First release of [Helm](https://helm.sh/), the package manager for Kubernetes. The very first KubeCon in Europe. During the year, more versions were released: v1.2, v1.3, v1.4, and v1.5.
The [Minikube](https://minikube.sigs.k8s.io/) project was created, allowing you to run Kubernetes locally on your computer.
A major case study about [Pokemon GO!](https://cloud.google.com/blog/products/containers-kubernetes/bringing-pokemon-go-to-life-on-google-cloud) was published -- "Pokemon GO was the biggest deployment on Google Container Engine."

**2017**: More new versions were released: v1.6, v1.7, v1.8, and v1.9.
More companies joined CNCF. GitHub announced it was [migrating to Kubernetes](https://github.blog/engineering/kubernetes-at-github/).
Amazon introduced [Elastic Kubernetes Service (EKS)](https://aws.amazon.com/eks/). And Microsoft introduced a preview version of [Azure Kubernetes Service (AKS)](https://azure.microsoft.com/en-us/services/kubernetes-service/).

**2018**: Versions released: v1.10, v1.11, v1.12, and v1.13. The [KubeFlow](https://www.kubeflow.org/) project was created for machine learning on Kubernetes.
EKS and AKS became stable and production-ready.
[DigitalOcean "jumped on the Kubernetes train"](https://thenewstack.io/digitalocean-dives-into-kubernetes/) and built Kubernetes as a service.

**2019**: Versions released: v1.14, v1.15, v1.16, and v1.17.

**2020**: Versions released: v1.18, v1.19, and v1.20.

**2021**: Versions released: v1.21, v1.22, v1.23. The Kubernetes project officially slowed down to three releases per year and support for individual versions was extended to 1 year, instead of the previous 9 months.

**2022**: Versions released: v1.24, v1.25, and v1.26.

**2023**: Versions released: v1.27, v1.28, and v1.29. [Gateway API](https://gateway-api.sigs.k8s.io/) was released in stable version v1.0. Gateway API is the successor to Ingress, which is "frozen," and new functionality is going into Gateway API.

**2024**: Versions v1.30, v1.31 were released, and v1.32 should be released by the end of the year.

## Kubernetes Today

Over those ten years, Kubernetes has made its way into every corner of software and companies of all sizes. It runs in massive data centers, through edge locations, all the way to homelabs. And it powers web servers, data analytics, AI, and who knows what else. From the enormous Google, through mid-size companies, all the way to startups.

Kubernetes has become practically the standard for running containerized applications today. CNCF does enormous marketing around Kubernetes and as a non-profit organization has an annual revenue of $150M, which is absolutely insane.
Thanks to CNCF, a huge ecosystem has formed around Kubernetes and the entire "cloud-native" world. Monitoring, logs, storage, backups, databases, networking, security, CI/CD, GitOps, cluster management, API Gateway, and much more.

If you're interested in what can be found in the ecosystem, check out the [CNCF Landscape](https://landscape.cncf.io/).

## Why Kubernetes?

Back to the original question: "Why Kubernetes?" Over the time I've worked with Kubernetes, I've implemented Kubernetes at many companies.
I've watched the massive ecosystem grow and attended several European KubeCons (currently there are 3 per year: European, Asian, and North American).

But most importantly, Kubernetes has been here for ten years, it's a massive project and I'm confident it will be here for at least another ten years (I'm counting more like 20-30 years).
It's stable -- both cluster operations as such, and the Kubernetes API changes slowly with all changes communicated in advance. When APIs are removed, there's plenty of time to migrate to the new API.
But the project itself is also stable -- it has enough funding, a huge community, new versions are released regularly. And most importantly, there's a massive ecosystem around it, sometimes with almost too many options.
And because Kubernetes is so large, finding people is not a problem, even in the Czech Republic. Are you looking for someone by any chance? Write to me at vojtech@mares.cz.

If you have multiple applications, or you're growing, or you're looking for a stable platform, or you don't want vendor lock-in, Kubernetes is the best choice. Or if you're looking for a platform
to deliver enterprise applications to your customers and you're fed up with Windows installations. Try moving your customers to Kubernetes. You'll have a unified platform everywhere.

The last case (enterprise) is exactly what I've had the opportunity to work on twice in the last two years, and both times we ended up concluding that we simply want Kubernetes. It doesn't matter whether it's on-premise or cloud --
we can handle installation and management of Kubernetes on the customer's infrastructure. But for the application, it's a huge win. In general, it saves a lot of time and money.
You can use Kubernetes distributions that are very easy to install, like [k0s](https://k0sproject.io/) and [k3s](https://k3s.io/), or [RKE2](https://docs.rke2.io/) which meets a number of security standards.

With a few scripts or something like [Ansible](https://www.ansible.com/), you can build a cluster in a few minutes and start deploying applications right away. And focus on customer-specific needs rather than spending weeks configuring servers.

## Extensibility

Even though Kubernetes can do many things, it can't do everything, and not everyone needs everything. A lot of functionality can be added through an ecosystem application, though not always for free, or it simply doesn't exist.

If you need something specific to you, you can leverage Kubernetes extensibility and fairly easily write your own operator to extend your cluster's capabilities
and integrate it into your infrastructure in a tailored way. And thanks to [KubeBuilder](https://book.kubebuilder.io/) (a tool for writing operators), it's easy and you don't have to reinvent the wheel.

## Kubernetes Isn't for Everyone

Even though Kubernetes is a great project and you can do practically anything with it, I believe it's not suitable for everyone. More precisely, it's not suitable for every project.

If you're a startup, for example, and don't need anything complex (infrastructure-wise) or you can get by with one or two servers, Kubernetes will only slow you down and become quite expensive.
The world around Kubernetes is complicated, complex, and you'll probably end up needing someone who understands it and can manage it for you. And because it's a fairly specialized
skill set, it won't be cheap.

Many projects can indeed get by with a single server for a very long time. And if you need to scale, sometimes it's enough to just increase the number of CPU cores and add memory.

Only when it gets too much, or when you need to guarantee availability (SLA) and so on, is it worth thinking about Kubernetes.

In other words: if you have a WordPress blog with 10 visitors a month, you really don't need Kubernetes. But if you have an e-shop with 1,000 visitors a day, still no.
At 10,000 visitors a day, it's worth considering with an eye towards future growth. And at 100,000 visitors a day, you'll probably need it, and you can also benefit from its many features
that would be incredibly expensive to build yourself. Kubernetes is not a silver bullet and can cause real headaches or get expensive.
