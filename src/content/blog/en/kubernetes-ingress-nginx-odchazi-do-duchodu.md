---
title: Kubernetes Ingress-NGINX Is Retiring
description: Ingress-NGINX is ending and will transition to minimal maintenance mode starting March 2026. The InGate project, which was supposed to be its successor, never took off and is also heading to the archive. What does this mean for your Kubernetes clusters, what are the realistic alternatives, and what should you watch out for during migration? I've prepared an overview of options and recommendations based on practical experience.
keywords:
  [
    "kubernetes",
    "ingress-nginx",
    "ingress",
    "ingress nginx retirement",
    "gateway api",
    "envoy gateway",
    "istio",
    "haproxy",
    "traefik",
  ]
tags: ["kubernetes"]
trainingAd: kubernetes
draft: false
publish_time: 2025-11-19
---

This year (2025) at KubeCon in London, the maintainers of the Kubernetes Ingress-NGINX project (an open-source [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/) controller, directly from the Kubernetes project) announced that its development would be discontinued and its support eventually ended. The replacement for Ingress-NGINX was supposed to be the [InGate](https://github.com/kubernetes-sigs/ingate) project.

The original timeline looked like this:

- End of 2025 -- InGate first version v0.1 is released
- Mid 2026 -- InGate is stable (v1.0 is released)
- 2027 -- Ingress-NGINX repository will be archived on GitHub

InGate was meant to be a replacement that doesn't carry technical debt and isn't a "maintenance hell" like Ingress-NGINX. At the same time, InGate was supposed to support not only the Ingress API, whose development has been frozen since Kubernetes v1.19 released in August 2020, but also the new [Gateway API](https://gateway-api.sigs.k8s.io/). NGINX was to remain as the HTTP proxy, with a Go controller running alongside it, watching for changes in the Kubernetes cluster.

But InGate looks dead. More precisely, it never came to life. The project has 39 commits for the entire year and the last few are just from Dependabot.

## Everything Has Changed

In the end, as often happens, everything turned out differently. Ingress-NGINX is transitioning to maintenance mode as early as March 2026. This was recently [announced](https://kubernetes.io/blog/2025/11/11/ingress-nginx-retirement/) on the Kubernetes Blog. Along with Ingress-NGINX, InGate is also ending -- the team couldn't get the project off the ground while simultaneously maintaining Ingress-NGINX during the transition period.

This puts everyone who uses Ingress-NGINX in a rather unpleasant situation.

### Next Steps

What the Kubernetes project recommends (and so do I) is to migrate to a different solution as soon as possible, because Ingress-NGINX will end and there will be no bug fixes or new releases. And all of this is happening as early as March 2026, which is just five months from now!

## Suitable Replacement for Ingress-NGINX

There is no universal one-size-fits-all replacement. It really depends on what you use, what you need -- what your use case is. If Ingress is sufficient for you and you want to change as little as possible, swapping in a different Ingress controller is the best option. The Kubernetes website has a [list of Ingress controllers](https://kubernetes.io/docs/concepts/services-networking/ingress-controllers/).

I plan to test several Ingress controllers that are similar or offer similar features to what Ingress-NGINX had and what my clients and I use (redirects, URL rewrite, rate limiting, proxy body size for file uploads, timeouts, Cert-Manager integration, Prometheus metrics, WAF protection via ModSecurity or Coraza). All of this ideally in an open-source version.

After researching existing controllers, I narrowed it down to the following options:

- [HAProxy Ingress controller](https://www.haproxy.com/documentation/kubernetes-ingress/) (I mean the official one, not the small open-source project)
- [Traefik](https://doc.traefik.io/traefik/reference/install-configuration/providers/kubernetes/kubernetes-ingress/)
- [Contour](https://projectcontour.io/)
- [F5 NGINX Ingress controller](https://docs.nginx.com/nginx-ingress-controller/) -- a project directly from F5
- [Istio](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/) -- rather than Ingress, consider direct integration and using something like _VirtualService_.

If you want to use Gateway API, check out the following implementations:

- [Envoy Gateway](https://gateway.envoyproxy.io/)
- [Istio](https://istio.io/latest/docs/tasks/traffic-management/ingress/gateway-api/)
- [NGINX Gateway Fabric](https://github.com/nginx/nginx-gateway-fabric) -- a project directly from F5
- [Contour](https://projectcontour.io/docs/1.33/config/gateway-api/)

In my view, Gateway API is designed more for SaaS services and microservices. It assumes a _Gateway_ to which all routes are connected and deployed alongside the application.

A list of all Gateway API implementations can be found [here](https://gateway-api.sigs.k8s.io/implementations/#gateway-controller-implementation-status) on their website.

### Recommendations for Replacing Ingress-NGINX

In my opinion, the best/easiest replacement if you want to stay with Ingress API is:

1. **Traefik** -- simple, has its own dashboard, can handle HTTPS automatically (no need for Cert-Manager)
2. **HAProxy Ingress** -- easy migration, supports almost everything Ingress-NGINX did, so it shouldn't be a major headache

If you want to go with Gateway API, check out:

1. **Envoy Gateway** -- in my opinion clearly the most features out of the box (global rate limiting across the entire gateway, local rate limiting per specific Route -- HTTPRoute, GRPCRoute, etc., retry, circuit breaking, authentication -- Basic Auth, JWT, OIDC, traffic management: traffic splitting, request mirroring, and more). Plus it's fully open-source under CNCF without an enterprise edition (and therefore no paid features)
2. **Istio** -- also very capable, and if you're considering a Service Mesh, you can kill two birds with one stone

Be careful: if you're using Gateway API and need multiple domains with HTTPS without wanting a single certificate for all domains -- where anyone could easily see which domains are valid for the certificate and discover information about your application that you might not want to make public.

To avoid this problem, you need to have multiple listeners on port `443` on the _Gateway_, each with a dedicated certificate, and then map everything to the correct routes. This effectively eliminates the flexibility of separating ownership between the _Gateway_ and routes -- the _Gateway_ is owned by the platform team and routes by application teams. And it's actually more of a use case for regular Ingress. Plus, for fifty domains this would be very labor-intensive, or for multi-tenant applications on different domains, quite unsuitable.

Gateway API is not a 1:1 replacement for Ingress -- changes are needed:

- On infrastructure: add CRDs to the cluster -- they aren't in Kubernetes automatically, choose an implementation like Envoy Gateway and install _GatewayClass_, _Gateway_, and modify the application to use _HTTPRoute_ instead of _Ingress_
- If you use Cert-Manager, you need to enable Gateway API support...
- external-dns needs to be configured to watch Route and _Gateway_ resource types

To help with migrating from Ingress to Gateway API, there's a tool called [ingress2gateway](https://github.com/kubernetes-sigs/ingress2gateway), and Gateway API has a [migration page](https://gateway-api.sigs.k8s.io/guides/getting-started/migrating-from-ingress/) in their documentation.

What I would avoid is the Cilium solution, both for Ingress and Gateway API. It pains me to say this because I really like [Cilium](https://cilium.io/) and it has many great features. But the Ingress and Gateway API support is terrible -- tested so you don't have to. It's practically incomparable to Ingress-NGINX in terms of features: it can't do URL rewrite, redirect, proxy body size, and other useful -- I'd even say basic -- things.

## Envoy as the Successor to NGINX

A small observation to wrap up.

Practically everyone today uses Envoy instead of NGINX. The exceptions are HAProxy Ingress (which unsurprisingly uses HAProxy), NGINX Gateway Fabric & NGINX Ingress controller (which use NGINX), and Traefik.

Everyone else uses Envoy. For example, Istio uses Envoy both in sidecar and in ambient (DaemonSet proxy mode) mode, where Envoy connects services and applies L7 (HTTP) policies. Or Cilium, where you can enable Envoy as a proxy -- which is a prerequisite for using Ingress and Gateway API -- but you can also use it to manage L7 _CiliumNetworkPolicy_. Cool.

[Envoy](https://www.envoyproxy.io/) is an open-source HTTP (L7) proxy that today falls under CNCF as a "Graduated project".
