---
title: "Jak se agenti starají o Kubernetes za mě"
date: 2026-03-28
event:
  name: "Installfest 2026"
  url: "https://installfest.cz/if26/"
draft: false
---

Poprvé jsem přednášel na Installfestu a pustil jsem se do toho z ostra. Přednášel jsem, jak se AI agenti (hlavně Claude Code) starají o Kubernetes cluster za mě. Jaké mám zkušenosti, co mi fungovalo a co zase ne. Za mě tři nejdůležitější body pro agenty a infrastrukturu:

- Deklarativní konfigurace – agent si vše může přečíst
- CLI nástroje – agent sám může validovat přímo v terminálu
- Objektivní validace – agentům je třeba dát nástroje (CLI, viz předchozí bod) a podmínku, jak si ověří, že dokončil práci úspěšně

Záznam z přednášky je dostupný na [YouTube](https://www.youtube.com/watch?v=_Zw-BkXwSU4).
