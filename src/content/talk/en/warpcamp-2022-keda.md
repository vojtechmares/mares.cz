---
title: "Event-driven autoscaling na Kubernetes s KEDA"
date: 2022-09-17
event:
  name: "WarpCamp 2022"
  url: "https://www.warpcamp.cz/"
draft: false
---

A short talk with a live demo on how you can scale on Kubernetes beyond the classic HPA approach. KEDA is a great tool that helps you scale using a wide range of so-called Scalers. For example, based on messages in a RabbitMQ or Kafka queue, events in AWS Event Hub, or simply using a cron schedule (eight pods at 8 AM, only three pods at night), and many more. Today, KEDA offers over sixty scalers plus the option to write your own.
