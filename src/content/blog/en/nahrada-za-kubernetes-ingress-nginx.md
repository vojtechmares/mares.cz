---
title: Replacing Kubernetes Ingress-NGINX
description: Searching for a replacement for Kubernetes Ingress-NGINX, which is ending. Ingress controllers are daunting and everything is terribly complicated... Ingress-NGINX was simple, and finding a simple replacement is a real pain.
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
publish_time: 2026-03-05
---

I recently wrote an article [Kubernetes Ingress-NGINX Is Retiring](/en/blog/kubernetes-ingress-nginx-odchazi-do-duchodu) and mentioned that I would be looking for a replacement.

So I've been searching and searching, and I want to share what I found and how things worked and didn't work.

I tried:

- [Traefik](https://traefik.io/)
- [NGINX-Ingress](https://docs.nginx.com/nginx-ingress-controller/)
- [HAProxy Kubernetes Ingress Controller](https://www.haproxy.com/documentation/kubernetes-ingress/)

## Traefik

Ugh. It started out simply, no problems, but...

Ingress-NGINX had tons of annotations and Traefik doesn't handle anything through annotations -- instead it uses CRDs (_IngressRoute_, _Middleware_, and others). Finding which CRD you need and how to configure it is a real pain.

That was tedious but still manageable (Claude Code helped quite a bit), but the breaking point came when I wanted to reconfigure Ingress for Argo CD. I want to have Argo CD deployed securely, meaning HTTPS even within the cluster, and I just couldn't get it to work.

I tried a combination of several _IngressRoute_ and _Middleware_ objects, but I didn't win. It was definitely not trivial.

So overall, I find the solution pretty useless. Maybe if I were using only Traefik and leveraging its native CRDs from the start, perhaps with Gateway API integration, it would be better. But when I just want a straightforward replacement for Ingress-NGINX, it's just bad.

What I do appreciate is the native OpenTelemetry support. Traefik offers logging in various formats (text, JSON, etc.), the ability to enable/disable access logs and standard Prometheus `/metrics` endpoint, but on top of that it has native OpenTelemetry integration to send both logs and metrics directly to an OTEL collector.

My rating of Traefik as an Ingress-NGINX replacement: **3/10**.

## NGINX-Ingress

I tried NGINX-Ingress, the open-source version from F5.

It works, but the annotations are slightly different and not all of them are available, so you can't rewrite things 1:1.

It worked fine, but recently F5 has been making some controversial decisions, so in the interest of independence I decided to try yet another Ingress controller.

Where I would recommend NGINX-Ingress is if you already use F5 products and are perhaps considering the enterprise/paid version of NGINX-Ingress as well. F5 is investing heavily there and today offers integration of the Ingress controller with WAF and other F5 products that run outside the Kubernetes cluster. Because they communicate directly via API, routing is better, and you can leverage features like WAF with first-class integration. In that case, it's a "no brainer."

My rating of NGINX-Ingress: **7/10**

## HAProxy Kubernetes Ingress Controller

**WARNING**: Don't confuse this with [HAProxy Ingress](https://haproxy-ingress.github.io/) ([github.com/jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress)). I used the official one from HAProxy Technologies, [HAProxy Kubernetes Ingress Controller](https://www.haproxy.com/documentation/kubernetes-ingress/).

HAProxy Kubernetes Ingress Controller simply won, hands down.

Simple installation, simple migration, a few annotations and everything just works.

I was probably somewhat biased in my testing, but after the experience with Traefik and its pile of CRD objects (Middleware etc.), where it was a verbose nightmare, the simplicity is just great.

My rating of HAProxy Kubernetes Ingress Controller: **8/10**

### Ingress Annotations

| **Ingress-NGINX annotation**                             | **HAProxy Ingress annotation**        | **Note**                                                              |
| -------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| `nginx.ingress.kubernetes.io/ssl-passthrough: "true"`    | `haproxy.org/ssl-passthrough: "true"` |                                                                       |
| `nginx.ingress.kubernetes.io/force-ssl-redirect: "true"` | `haproxy.org/ssl-redirect: "true"`    | And `haproxy.org/ssl-redirect-code: "302"`, options are 301, 302, 303 |

## Other Options

I didn't try other options -- it takes quite a lot of time to redo several different ingresses to see how the ingress controller behaves in various configurations, and I didn't want to spend more time testing.

What I will still explore is Gateway API. I was pleasantly surprised by the Gateway API support across existing ingress controllers, although it varies quite a bit in terms of who supports what. For Gateway API, I plan to look at Envoy Gateway and I'm also considering Istio. But for my personal cluster, where I only run a few things, Istio is a massive overkill, so maybe it will just be something smaller for testing.

If you want a broad feature comparison, I recommend [this Google Sheet](https://docs.google.com/spreadsheets/d/191WWNpjJ2za6-nbG4ZoUMXMpUK8KlCIosvQB0f-oq3k/edit?gid=907731238#gid=907731238) that I found, which has practically everything.

### Gateway API

For Gateway API implementations, I tried [Envoy Gateway](https://gateway.envoyproxy.io/) and honestly, I was a bit disappointed.

I ran into two problems:

- Deploying Envoy Gateway is not entirely trivial and support for _Gateway Service_ with type _NodePort_ is non-trivial (I must praise their 'Ask AI' feature in the documentation though!)
- Gateway API and Gateway specification with support for many domains when you want separate certificates per domain rather than one big certificate for many domains

Let me elaborate a bit...

Envoy Gateway is great, and if you can have _Service_ with type _LoadBalancer_ in your Kubernetes clusters, you won't have any problems. In the on-prem world without magical load balancers integrated with Kubernetes, I needed to create a _Service_ of type _NodePort_ with a specific port so I could map it to an external load balancer with static configuration (HAProxy as an L4 proxy). And that's where I hit a wall. The configuration is non-trivial -- you need to configure the Envoy instance, which is essentially the _Gateway_, and while it can be written in YAML, the documentation doesn't describe it very well. Without the 'Ask AI' feature, I never would have figured it out. I eventually got it working, but it felt incredibly complicated, and then I hit the second problem...

Gateway API, or more precisely the _Gateway_ instance and support for multiple domains with per-domain certificates. Ugh.

Example:

```yaml
# gateway.yaml
apiVersion: gateway.networking.k8s.io/v1
kind: Gateway
metadata:
  name: example-gateway
  namespace: example-product-gw
spec:
  gatewayClassName: envoy-gateway
  infrastructure:
    annotations:
      external-dns.alpha.kubernetes.io/hostname: lb.example.com
      external-dns.alpha.kubernetes.io/ttl: "86400"
      external-dns.alpha.kubernetes.io/cloudflare-proxied: "false"
  listeners:
    # HTTP listener so I can have an HTTPRoute that only does HTTP -> HTTPS redirect
    - name: http
      protocol: HTTP
      port: 80
    - name: app-https
      protocol: HTTPS
      port: 443
      hostname: "app.example.com"
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: app-tls
    - name: dashboard-https
      protocol: HTTPS
      port: 443
      hostname: "dash.acme.com"
      tls:
        mode: Terminate
        certificateRefs:
          - kind: Secret
            name: dashboard-tls
```

And then you also need (if you use Cert-Manager) _Certificate_ objects in the same namespace as the _Gateway_.

```yaml
# certificates.yaml
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: app-tls
  namespace: example-product-gw
spec:
  secretName: app-tls

  issuerRef:
    group: cert-manager.io
    kind: Issuer
    name: letsencrypt-prod

  # Certificate validity duration (730 hours ≈ 30.4 days)
  duration: 730h

  # Renew 7 days (168 hours) before expiration
  renewBefore: 168h

  dnsNames:
    - app.example.com

  privateKey:
    algorithm: ECDSA
    size: 256
    rotationPolicy: Always

  secretTemplate:
    labels:
      app.kubernetes.io/managed-by: cert-manager
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: dashboard-tls
  namespace: example-product-gw
spec:
  secretName: dashboard-tls

  issuerRef:
    group: cert-manager.io
    kind: Issuer
    name: letsencrypt-prod

  # Certificate validity duration (730 hours ≈ 30.4 days)
  duration: 730h

  # Renew 7 days (168 hours) before expiration
  renewBefore: 168h

  dnsNames:
    - dash.acme.com

  privateKey:
    algorithm: ECDSA
    size: 256
    rotationPolicy: Always

  secretTemplate:
    labels:
      app.kubernetes.io/managed-by: cert-manager
```

With GitOps and perhaps with help from AI, it's manageable, but I don't really like it. The UX here is pretty meh. And when I imagine having a multi-tenant application, it's downright ugly.

What could possibly be done is use something like Kyverno with a mutating policy that modifies the _Gateway_ object based on some objects, adding listeners and generating certificates. Or handle it with a custom controller that manages the webhooks directly. Or even better, have a custom operator that handles infrastructure configuration for tenants and generates objects dynamically. But everything is still pretty silly if I want to go the GitOps route rather than "magical" webhooks creating objects in the cluster dynamically.

I haven't cracked this nut yet. If anyone has an idea or has already solved this, I'd love to hear the solution!
