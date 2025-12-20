---
title: Verzování, releasy a stabilita
description: Verzování. Časté téma, a další problém k "naming things, cache invalidation, off by one errors", tak čtvrtý IT problém je verzování. Jaké verzovací schémata existují, jak je používám a proč a jaké jsou naopak nevhodné. Verzování zároveň není jen o jedné věci, dnes verzujeme zdrojový kód služby, máme verzi produktu/aplikace jako celku a pak do toho verzujeme ještě třeba machine learning modely. No prostě, s verzováním je sranda.
keywords:
  ["verzování", "aplikace", "api", "produkt", "breaking changes", "stabilita"]
tags: [""]
draft: true
publish_time: 2020-01-01
---

Původně tenhle článek měl mít téma 'Verzovací schémata', ale jak jsem tak psal, tak se mi to vymklo z rukou a tak jsme teď tady 😃

## Verzování

Verzování je nekonečné téma, jaké schéma zvolit, kdy aktualizovat jakou část verze (např. MAJOR, MINOR, PATCH u Sémantického Verzování). Zároveň verzí oznamujeme změnit a dle schématu, garantujeme prakticky kontrakt, že když aktualizujete, tak se vám nic nerozbije nebo naopak bude potřeba udělat větší nebo menší změny na straně vašeho kódu.

### Verzovací schémata

Verzovací schémata nám dávají větší flexibilitu, abychom neměli jen jedno číslo, které inkrementujeme a vše se musí vždy kontrolovat (teda automatické testy v pipeline by měly běžet vždy) a říkáme, jak se mění chování našeho software a co za změny lze mezi verzemi očekávat. Takže vlastně kolem a kolem, schéma sloužší ke snažšímu informování o tom, co se změnilo. A zároveň strojově čitelné verze umožňují stavět automatizace pro aktualizace, kde nemusíme jednotlivé závislosti aktualizovat sami ručně.

Tohle je seznam nečastějíších verzovacích schémat, které jsem v posledních letech potkal:

- [**Semantic Versioning**](https://semver.org/) (SemVer) – dnes asi nejpoužívanější schéma ve formátu MAJOR.MINOR.PATCH a změna MAJOR čísla, indikuje zpětně-nekompatibilní změny. Dneska je to prakticky standardem ve světě sdílených knihoven, nejvíc v JavaScript světě.
- [**ZeroVer**](https://0ver.org/) – velmi podobné schéma Sématickému Verzování, s rozdílem, že první číslo je navždy nula. A zpětně-nekompatibilní změny se ohlásí předem (deprecated) a po čase se prostě odstraní. Dlouhou dobu na ZeroVer byl například React, který až před pár lety přešel na Sémantické Verzování.
- [**CalVer**](https://calver.org/) – verzovací schéma spojené s kalendářem, tj. číslo verze odpovídá vlastně datumu v kalendář, zpětně-nekompatibilní změny se řeší podobně jako u ZeroVer, oznámím konec podpory a datum odstranění. Nejznámějším příkladem v IT světě je asi linuxová distribuce Ubuntu, která každý sudý rok v dubnu vydává novou verzi s dlouhodobou podporou (LTS), např. 22.04, 24.04,...
- **Simplified SemVer** – SemVer, ale bez PATCH verze, takže jen MAJOR.MINOR.
- **Majors only** – Pouze čísla MAJOR verzí, tj. signalizuju pouze zpětně-nekompatibilní změny. Nejznámějším uživatelem je asi Google, který tohle používá interně ve svém monorepu a vše neustále testují. Zároveň se takto velmi často verzují API.

### Breaking changes (zpětně-nekompatibilní změny)

Při vydání nové verze, když dbáme (a že bychom měli) na zpětnou kompatibilitu, je důležité jednoznačně identifikovat takovou verzi, která obsahuje právě zpětně-nekompatibilní změny (backward compatibility breaking changes).

Typicky takové číslo je první číslo ve verzovacím schématu a nebo v changelogu je zdrůzaněno, že se něco nebude fungovat.

Na co je důležité nezapomínat, je, co všechno je vlastně zpětně-nekompatibilní změna:

- přejmenování pole
- změna výchozího chování
- přidání nového povinného pole
- změny (přidání/odebrání) hodnoty v pro enumerate (enum)
- pokud typ pole je "oneOf", nesmí se měnit možnosti (přidat/odebrat), jaké typy jsou dovolené (vlastně enum, ale pro objekty?)
- změna výchozí hodnoty
- změna nulové hodnoty (`0` vs `null`)
- změna délky řetězce (string)

Pro referenci pro API se odkážu na Google [AIP-180: Backwards compatibility](https://google.aip.dev/180)

### Jak na verzování teda

A jak teda verzovat? Podle mě to nemá univerzální odpověď, protože na různých místech potřebuju komunikovat různé informace a v některých případech moc verzí způsobí akorát šum (třeba koncového uživatele nepotřebuju informovat o nějaké interní změně v systému).

- **Verzování knihoven**

  Pro knihovny dnes vždy volím **SemVer**. Jednak je to standard a prakticky všichni vývojáři SemVer známe a dává dostatečnou kontrolu nad jednotlivými verzemi:
  - Major: jasně indikuji zpětně-nekompatibilní změny
  - Minor: přidávám nové funkce
  - Patch: opravuji chyby

  Výjimkou je, když vytvářím novou knihovnu/prototyp, tak bych použil **ZeroVer** a prostě dělal vývoj tak rychle jak je potřeba a stabilitu v ten moment upozadil ("move fast, break things, fix them later"). Takový přístup ale nemůže trvat věčně a je potřeba si stanovit deadline, kdy buď projekt zanikne nebo vyjde stabilní verze 1.0.

  Alternativní přístup je mít všude **ZeroVer** a mít definovanou periodu, po kterou se garantuje podpora/kompatibilita, než se něco odstraní. V ten moment tak může fungovat celý váš ekosystém, což vyžaduje disciplínu, čas a taky "hygienu" kódu.

- **Verzování komponent**

  Komponentou myslím třeba službu ve světě mikroslužeb například.

  Verze takové komponenty pro mě není tak důležitá, jako její API, přes které služby spolu komunikují. Je jedno, jestli je API synchronní (třeba REST) nebo asynchronní (třeba fronty).

- **Verzování API**

  API, rozhraní, skrze které spolu služby nebo celé systémy komunikují. Ve výsledku je jedno, jestli používáte moderní gRPC, REST, JSON-RPC, GraphQL, nebo starší API jako je třeba SOAP. Verzovat byste je měly vždy.

- **Verzování produktů**

  Tohle je **ta verze**, kterou uvidí koncový uživatel, běžný člověk. Jeho vlastně nezajímá, co se technicky změnilo. Jde mu vlastně o nové věci, vylepšení stávajících a případné opravy chyb. Opravou chyb ale myslím, že uživateli něco
  nefunguje, ne, že tlačítko mělo špatný rádius zaoblení, který neodpovídal vašemu design systému.

### Lidský pocit z vysoké verze

Poslední věc, které se v článku chci věnovat, je psychologický efekt verzí na lidi. I když o verzi nic nevíme, ze zkušenosti, víc se lidem líbí nízké verze např. 2.4.9 než "vysoké" např. 49.143.77, přitom technicky je to naprosto stejné.

Lidsky si myslím, že nižší verze nám je sympatičtější, protože to ukazuje nějakou stabilitu a "dospělost", ale vlastně už nebere v potaz, kdy taková verze vyšla, to je, když už, druhý krok.

Trochu tím vlastně trestáme, někoho, kdo se poctivě drží nějakého schématu a transparentně dělá změny.

Co bychom neměli opomenout, je za jakou dobu projekt/aplikace/knihovna, vyprodukovala tolik verzí. V příkladu 49.143.77, u softwaru který používám a očekávám stabilitu, mi nevadí minor a patch verze klidně denně, ale u major verzí si nemyslím, že release častěji jak čtvrt roku je akceptovatelné. Jasně, ne každá major verze vyloženě implikuje celý přepis. Ideáně, s ohledem na stabilitu, nemusím řešit nekompatibilitu nikdy, ale v reálném světě mi přijde OK třeba jednou za rok nebo dva. Ale ono zase záleží na aplikaci.

## Releasy

## Stabilita

Stabilita je vlastně takový opak ke zpětně-nekompatibilním změnám. Verzí podle verzovacího schématu, jasně říkám, jaké verze budou obsahovat nekompatibilní změny a naopak jaké verze by měly fungovat bez problému, když aktualizuju třeba nějakou knihovnu.

Zároveň existuje několik způsobů, jak stabilitu garantovat a třeba postupně přidávat funkcionality, které potenciálně můžou být nekompatibilní, ale jsou třeba "opt-in" a tedy nerozbijí výchozí chování.

Mně dávají smysl dva přístupy:

- stabilita pomocí kanálů: alfa, beta, stable. Nové funkce prochází jednotlivými kanály a postupně "bublají" do stable, tohle třeba používá Kubernetes, silnou stránkou je, že můžete dělat v alfa/beta verzích nekompatibilní změny a doiterovat do stabilního řešení postupem času, bez rozbití stabilního API. Cenou za tenhle přístup je jeho pracnost a kolik kódu je třeba udržovat
- navázanost na release: s každou verzí (major/minor, ne patch) přichází něco nového, ne vždy to ale musí být hotové a následně změny chování můžou vynutit novou major verzi

Zároveň, jakmile vydám nějakou verzi, tak bych ji už nikdy neměl smazat. Občas se může stát, že omylem vydám novou verzi, když jsem nechtěl nebo obsahuje změny, které ještě neměla. To je nepříjemné, ano, ale vydanou verzi bych stejně nemazal a prostě šel dál, inkrementálně. Co mi líbí ze světa Rustu/Pythonu jsou tzv. "yanked versions". Když vydáte verzi, která buď neměla vyjít nebo je něco špatně nebo obsahuje velkou bezpečnostní zranitelnost, prostě tu verzi označíte jako "yanked" a package registry (společně s package managerem) se pak verzi vyhne a nebude ji ani zobrazovat na webu (nebo třeba RSS feedu). To ale neznamená, že si tu verzi nemůžete nainstalovat, když si o ní explicitně řeknete, tam by pak mělo vyskočit varování.
