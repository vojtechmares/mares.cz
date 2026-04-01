---
title: "How agents take care of Kubernetes for me"
date: 2026-03-28
event:
  name: "Installfest 2026"
  url: "https://installfest.cz/if26/"
draft: false
---

This was my first time speaking at Installfest and I did not hold back. I gave a talk about how AI agents (primarly Claude Code) take care of Kubernetes cluster for me. I shared my experience, what worked and what did not. There are three main takeaways:

- Declarative configuration – agent can read all configuration for its context
- CLI tools – agents can investigate and validate the real state on it's own
- Objective validation – agents need tools (CLIs, MCPs, see previous point) to verify, you also need to provide the verification criteria in your prompt

A recording of my talk is available on [YouTube](https://www.youtube.com/watch?v=_Zw-BkXwSU4), but in Czech.
