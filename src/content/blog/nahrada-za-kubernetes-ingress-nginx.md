---
title: Náhrada za Kubernetes Ingress-NGINX
description: "Hledání jednoduché náhrady za Kubernetes Ingress-NGINX. Ingress controllery jsou složité a najít prostou alternativu není snadné."
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

Nedávno jsem napsal článek [Kubernetes Ingress-NGINX odchází do důchodu](https://www.mares.cz/blog/kubernetes-ingress-nginx-odchazi-do-duchodu) a zmínil jsem, že budu hledat náhradu.

Tak hledám hledám a chci se podělit o to, co jsem našel a jak to různě fungovalo a nefungovalo.

Zkoušel jsem:

- [Traefik](https://traefik.io/)
- [NGINX-Ingress](https://docs.nginx.com/nginx-ingress-controller/)
- [HAProxy Kubernetes Ingress Controller](https://www.haproxy.com/documentation/kubernetes-ingress/)

## Traefik

Uf. Začalo to jednoduše, pohoda, ale...

Ingress-NGINX měl spoustu anotací a Traefik nic neřeší přes anotace, ale přes CRD (_IngressRoute_, _Middleware_, a další) a najít, kterou CRD potřebujete a jak ji naconfigurovat, je fakt pain.

To bylo sice pracné, ale ještě se to dalo (Claude Code docela pomáhal), ale konec nastal, když jsem chtěl předělat Ingress pro Argo CD. Chci mít nasazené Argo CD bezpečně, tj. i v clusteru mám HTTPS a to mi prostě nešlo.

Zkusil jsem kombinaci několika _IngressRoute_ a _Middleware_, ale nezvítězil jsem. Triviální to rozhodně nebylo.

Takže vlastně řešení docela na nic mi v celku přijde. Asi, když bych měl jen Traefik a těžil z jeho nativních CRD rovnou a třeba propojení s Gateway API, bylo by to lepší lepší. Ale takhle, když chci jen prostou náhradu za Ingress-NGINX, je to akorát na pytel.

Čeho si cenním, je nativní podpora OpenTelemetry. Traefik nabízí jak logování v různých formátech (test, JSON,...), možnost vypnout/zapnout access log a standardní Prometheus `/metrics` endpoint, ale k tomu ještě nativní integrace s OpenTelemetry a posílat jak logy tak metriky, přímo do OTEL collectoru.

Moje hodnocení Traefiku jako náhrady za Ingress-NGINX: **3/10**.

## NGINX-Ingress

Zkusil jsem NGINX-Ingress, open-source verzi od F5.

Funguje to, ale anotace jsou trochu jiný, nejsou všechny, takže to nejde přepsat 1:1.

Fungovalo to v pohodě, ale v poslední době F5 dělá občas kontroverzní rozhodnutí, tak v rámci nezávislosti jsem raději šel zkusit ještě jiný Ingress controller.

Kde bych NGINX-Ingress doporučil, je pokud máte produkty od F5 a třeba uvažujete o enterprise/placené verzi i NGINX-Ingressu. Tam do toho F5 hodně šlape a dnes nabízí integrace Ingress controlleru s WAF a dalšími F5 produkty, které běží mimo Kubernetes cluster, ale tím, že spolu komunikují přímo přes API, routing je na tom líp a zároveň je možné využívat fičury jako WAF apod. a mít prostě first-class integraci. V takovém případě je to "no brainer".

Moje hodnocení NGINX-Ingressu: **7/10**

## HAProxy Kubernetes Ingress Controller

**⚠️ POZOR ⚠️**: Neplést si s [HAProxy Ingress](https://haproxy-ingress.github.io/) ([github.com/jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress)), použil jsem oficiální od HAProxy Technologies, [HAProxy Kubernetes Ingress Controller](https://www.haproxy.com/documentation/kubernetes-ingress/).

HAProxy Kubernetes Ingress Controller prostě vyhrál, na plné čáře.

Jednoduchá instalace, jednoduchá migrace, pár anotací a všechno v pohodě běží.

Asi jsem byl v mém testování poněkud biased, ale po zkušenosti s Traefikem a spoustou jeho CRD objektů (Middleware apod.), kde to bylo docela ukecané peklo, prostě ta jednoduchost je super.

Moje hodnocení HAProxy Kubernetes Ingress Controlleru: **8/10**

### Ingress anotace

| **Ingress-NGINX anotace**                                | **HAProxy Ingress anotace**           | **Poznámka**                                                          |
| -------------------------------------------------------- | ------------------------------------- | --------------------------------------------------------------------- |
| `nginx.ingress.kubernetes.io/ssl-passthrough: "true"`    | `haproxy.org/ssl-passthrough: "true"` |                                                                       |
| `nginx.ingress.kubernetes.io/force-ssl-redirect: "true"` | `haproxy.org/ssl-redirect: "true"`    | A `haproxy.org/ssl-redirect-code: "302"`, možnosti jsou 301, 302, 303 |

## Další možnosti

Další možnosti jsem nezkoušel, přeci jen to chce dost času předělat několik různých ingresů, abych viděl jak se ingress controller chová v různých nastaveních a dál jsem se testování věnovat nechtěl.

Čemu se ještě budu věnovat, je Gateway API. Příjemně mě překvapila podpora Gateway API napříč existujícími ingress controllery, bohužel je to docela různé, kdo podporuje co apod. U Gateway API mám v plánu se podívat na Envoy Gateway a zvažuju ještě Istio. Ale pro můj osobní cluster, kde mi běží jen pár věcí je Istio strašlivý overkill, takže možná bude jen třeba něco menšího-testovacího.

Pokud se ale chcete podívat na široké srovnání fičur, doporučuju [tento Google Sheet](https://docs.google.com/spreadsheets/d/191WWNpjJ2za6-nbG4ZoUMXMpUK8KlCIosvQB0f-oq3k/edit?gid=907731238#gid=907731238), který jsem našel, kde je snad úplně všechno.

### Gateway API

Za Gateway API implementace jsem zkoušel [Envoy Gateway](https://gateway.envoyproxy.io/) a vlastně mě to trochu zklamalo.

Narazil jsem na dva problémy:

- implementace Envoy Gateway není úplně triviální a podpora pro _Gateway Service_ s typem _NodePort_ je netriviální (musím ale pochválit jejich 'Ask AI' fičuru v dokumentaci!)
- Gateway API a Gateway specifikace s podporou mnoha domén, když chci mít rozdělené certifikáty per doména a nemít jeden velký certifikát pro mnoho domén

Abych to trochu rozepsal...

Envoy Gateway je super a pokud máte možnost v Kubernetes clusterech mít _Service_ s typem _LoadBalancer_, tak nebudete mít problém. V on-prem světě bez magických load balancerů integrovaných s Kubernetes, jsem potřeboval vytvořit _Service_ typu _NodePort_ a s konkrétním portem, abych to mohl namapovat na externí load balancer se stacikou konfigurací (HAProxy jako L4 proxy). A tam jsem narazil. Konfigurace je netriviální, je třeba konfigurovat Envoy instanci, která je vlastně ta _Gateway_, což se v YAMLu dá napsat, ale dokumentace to moc dobře nepopisuje a nebýt 'Ask AI' fičury, nikdy bych na to nepřišel. Nakonec se mi podařilo to rozchodit, ale přišlo mi to strašně komplikované a pak jsem narazil na druhý problém...

Gateway API, lépe řečeno _Gateway_ instance a podpora více domén s certifikáty per doména. Uf.

Příklad:

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
    # HTTP listener, abych mohl mít HTTPRoute, která dělá jen HTTP -> HTTPS redirect
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

A následně je třeba (pokud používáte Cert-Manager) i _Certificate_ objekty ve stejném namespace jako je _Gateway_.

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

S GitOps a třeba pomocí AI se to dá spravovat, ale moc se mi to nelíbí. UX tohle je docela meh. A když si představím, že bych třeba měl mít multi-tenantní aplikaci, tak to je vyloženě hnus.

Co by se asi dalo udělat, je použít třeba Kyverno a mutating policy a podle nějakých objektů modifikovat objekt _Gateway_ a přidávat listenery a generovat certifikáty. Nebo to řešit vlastním controllerem, který se stará sám o ty webhooky rovnou. Nebo ještě líp, mít vlastní operátor, který řeší konfiguraci infrastruktury pro tenanty a bude generovat objekty dynamicky. Ale všechno je furt docela pitomé, kdybych chtěl jít GitOps cestou a ne "magickými" webhooky, které mi tvoří objekty v clusteru dynamicky.

Tenhle oříšek jsem ještě nerozlouskl. Pokud má někdo nějaký nápad nebo to už vyřešil, budu rád za řešení!
