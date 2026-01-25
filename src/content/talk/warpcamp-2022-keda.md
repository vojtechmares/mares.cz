---
title: "Event-driven autoscaling na Kubernetes s KEDA"
date: 2022-09-17
event:
  name: "WarpCamp 2022"
  url: "https://www.warpcamp.cz/"
draft: false
---

Menší přednáška včetně dema, jak se dá na Kubernetes škálovat i jinak, než klasicky pomocí HPA. KEDA je skvělý nástroj, který vám pomůže škálovat díky zpoustě tzv. Scalers ("škálovačů"). Například zpráv ve frontě v RabbitMQ nebo Kafka. Ale i třeba eventů v AWS Event Hubu nebo čistě pomocí cronu (v osm ráno chci 8 podů a na noc jen tři pody) a mnoho dalších. KEDA dnes nabízí přes šedesát škálovačů plus možnost si napsat vlastní.
