---
title: Co je to Git?
description: Co je to Git? Možná pro někoho banální otázka, ale pro některé je to stále záhada. Krátké shrnutí, co Git je a jak se používá.
keywords: ["git", "version control", "vcs", "zdrojový kód", "gitlab", "github"]
tags: ["git"]
trainingAd: git
draft: false
publish_time: 2024-08-19
alternate: "what-is-git"
---

Co je to Git? Možná pro někoho banální otázka, ale pro některé je to stále záhada. Krátké shrnutí, co Git je a jak se používá.

## TL;DR

Git je systém pro verzování souborů, primárně textových, takže je vhodný pro zdrojový kód. Ale je možné jím spravovat všechny typy souborů.

Git umožňuje ukládání změn v čase, takže můžete vidět, co bylo změněno, kdy a kým. Dále tvorbu větví, takže můžete pracovat na více věcech najednou a následně je sloučit dohromady.
A v neposlední řadě také sdílet takovýto repozitář s dalšími lidmi (v týmu) a společně pracovat na jednom projektu. Daný repozitář je uložen na Gitovém serveru, odkud si všichni stahují nejnovější změny.

## Trocha historie

Git vytvořil v roce 2005 [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds), tvůrce Linuxového jádra. Linus k tomuto kroku přistoupil, potom co předcházející systém BitKeeper (hlavně společnost vyvíjející BitKeeper) zrušila bezplatnou licenci, kterou vývojáři využívali pro vývoj jádra Linuxu.

Linus, poučený ze zkušeností s BitKeeper, se rozhodl napsat vlastní systém pro verzování kódu. Hlavními požadavky byla:

- rychlost
- jednoduchost
- silná podpora paralelního vývoje (tj. používání větví)
- kompletně distribuovaný (tj. vzdálený server)
- podpora velkých projektů (jako je jádro Linuxu) efektivně, rychlost a velikost dat na disku

## Základní stavební kameny

### Repozitář

Repozitář (anglicky _repository_), je místo, kde jsou soubory uloženy. Na Vašem počítači to bude složka, ve které Git bude sledovat všechny soubory napříč všemi podsložkami.

Pokud nechcete, aby Git sledoval některé soubory nebo složky, můžete využít souboru `.gitignore` a specifikovat, které soubory nechcete sledovat.

### Commit

Commit je základní element v Gitu. Jedná se o "bod v čase" ve vašem projektu. Commit obsahuje informace o tom, co bylo změněno, kdo to změnil a kdy. Commit je také označený unikátním identifikátorem (hashem). Commit patří do větve.

### Větev

Větev (anglicky _branch_) je odnož od hlavní větve (dříve `master`, dnes `main`). Větev umožňuje pracovat na různých funkcích nezávisle na sobě. Po dokončení práce na větvi můžete tuto větev sloučit zpět do hlavní větve.

Sloučení jde dělat pomocí **merge** nebo **rebase**. Rozdíl je, že merge zanechává historii větví, zatímco rebase "přepíše" historii a vytvoří lineární historii (větve v historii nejsou vidět).

## Práce s Gitem

### Clone

Clone je první krok, kdy si stáhnete repozitář z Git serveru na svůj počítač. Tím vytvoříte lokální kopii repozitáře, se kterou můžete pracovat.

```shell
git clone $URL
```

### Add

Add je krok, kdy přidáte soubory, které chcete commitnout, do tzv. _stage_.

```shell
git add .
# nebo
git add cesta/k/souboru.txt
```

### Commit

Commit je krok, kdy uložíte změny do repozitáře. Musíte nejprve přidat soubory, které chcete commitnout, do tzv. _stage_ a poté commitnout.

```shell
git commit
```

### Push

Push je krok, kdy commit z lokálního repozitáře odešlete na Git server.

```shell
git push
```

### Pull

Pull, slouží ke stažení změn z Git serveru do lokálního repozitáře.

```shell
git pull
```

### Switch/checkout

Switch/checkout je krok, kdy přepnete mezi větvemi.

```shell
git switch $BRANCH
# nebo
git checkout $BRANCH

# vytvoření nové větve
git checkout -b $BRANCH
# nebo
git switch -c $BRANCH
```

### Status

Status v příkazové řádce vypíše, v jakém stavu se Váš lokální repozitář nachází. Jestli jsou nějaké změny a zda jsou tzv. _staged_ nebo ne.

```shell
git status
```

### Merge

Merge slouží ke sloučení dvou větví dohromady. Merge připojuje specifikovanou větev, do aktuální (`git status`).

```shell
git merge $BRANCH
```

### Rebase

Rebase umí slučovat commit historii dvou větví dohromady. Rebase přepisuje historii a vytváří lineární historii.

```shell
git rebase $BRANCH
```

### Cherry pick

Cherry pick umožňuje vybrat jeden commit z jiné větve a aplikovat ho na aktuální větev.

Pozor, cherry pick tvoří nový commit s novým hashem, nekopíruje jej!

```shell
git cherry-pick $COMMIT_HASH
```

### Pull/merge request

Na Git serverech (GitHub, GitLab, Bitbucket,...) je možné vytvořit tzv. pull request (GitHub, Bitbucket) nebo merge request (GitLab). Tímto způsobem můžete požádat o sloučení Vaší větve do hlavní větve. Merge/rebase (záleží na strategii pro daný repozitář) pak probíhá na straně Gitového serveru a nikoliv Vašeho lokálního reppozitáře.

### Fork

Na Git serveru je také možné vytvořit tzv. _fork_, tj. kopii repozitáře do Vašeho účtu. Tímto způsobem můžete pracovat na projektu, který není Váš, a následně vytvořit pull/merge request.

## Git klient

S Gitem je možná pracovat skrze příkazovou řádku, ale i s grafickými klienty.

### Git do příkazové řádky

Git je možné používat z příkazové řádky. Stačí mít nainstalovaný Git a můžete začít používat příkazy jako `git clone`, `git commit`, `git push`, `git pull`, `git merge`, `git rebase`, `git cherry-pick`, `git branch`, `git checkout`, `git log`, `git status`, `git diff`, `git blame`, `git tag`, `git fetch`, `git remote`, `git config`, `git stash`, `git revert`, `git reset`, `git show`, `git grep`, `git bisect`, `git reflog`, `git submodule`, `git worktree`, `git clean`, `git help`, `git version`,...

### Git, klienti s grafickým rozhraním

[GitHub Desktop](https://github.com/apps/desktop), [GitKraken Desktop](https://www.gitkraken.com/git-client), [SourceTree](https://www.sourcetreeapp.com/), [Fork](https://git-fork.com/) (pouze macOS), [Tower](https://www.git-tower.com/) a další...

## Git server

Git server je nepostradatelnou součástí Git ekosystému. Je to centrální bod, kde se ukládají změny a odkud si mohou ostatní stahovat změny. Dnes existuje několik serverů, kteří Vám umožní hostovat Vaše repozitáře zdarma a za rozšířené funkce si můžete zaplatit. Nebo můžete některé provozovat na vlastním serveru.

### GitHub

[`github.com`](https://github.com)

GitHub je dnes jednoznačně nejpopulárnější Git server. GitHub nabízí zdarma hostování veřejných repozitářů a za poplatek i soukromých. GitHub je vlastněn firmou Microsoft.

Github dominuje v open-source světě a je také oblíbený mezi programátory, kteří chtějí mít svůj kód veřejně dostupný.

GitHub nabízí i CI/CD pomocí GitHub Actions, které jsou zdarma pro veřejné i soukromé repozitáře.

### GitLab

[`gitlab.com`](https://gitlab.com)

GitLab je číslo dva na poli Gitových serverů. Je open-source s dvojtou licencí (za některé funkce je třeba zaplatit). GitLab je možné velmi snadno provozovat na vlastním serveru.

GitLab je velmi populární mezi firmami, které chtějí mít svůj kód na svých serverech a ne v cloudu.

Zároveň GitLab už dlouho nabízí CI/CD řešení, které je velmi snadné a velmi populární.

GitLab se zároveň stal velice populární mezi vývojáři.

### Bitbucket

[`bitbucket.org`](https://bitbucket.org)

Bitbucket je Git server vlastněn firmou Atlassian. Bitbucket je oblíbený mezi firmami, které používají další produkty od Atlassianu, jako je Jira, Confluence, Trello,...

Bitbucket nabízí CI/CD pomocí Bitbucket Pipelines, které jsou zdarma pro veřejné i soukromé repozitáře.

V dnešní době se netěší takové popularitě jako dříve, ale ve velkých korporátech má stále velké zastání, právě kvůli integraci s ostatními produkty od Atlassianu.

### Další

[Gogs](https://gogs.io/), [Gitea](https://about.gitea.com/), [Forgejo](https://forgejo.org/), [cgit](https://git.zx2c4.com/cgit/about/),...

To jsou jména některých z mnoha alternativních Git serverů, které si můžete provozovat sami nebo u některých (např. Gitea) můžete využít hostované verze. Jedná se o menší, často komunitou řízené projekty. V posledních letech se však těší stále větší popularitě.

Forgejo je fork Gitea, kde komunita udržuje kompatibilitu s Gitea, ale projekt jako takový je řízen komunitou a ne firmou, jako tomu je u Gitea.

Gitea a Forgejo dnes podporují CI/CD, jejichž definice je syntakticky identická s GitHub Actions, díky čemu je snadné migrovat mezi nimi.

## Alternativy ke Gitu

Protože Git je dnes dominantní verzovací systém, je těžké najít alternativu, která by byla tak populární. Ale existují.

Primárně jde o starší systémy nebo některé obrovské firmy jako Google nebo Meta využívají vlastní systémy, protože svou velikostí a tím, že mají vše v jednom repozitáři (tzv. monorepo) je velice náročné takový verzovací systém škálovat.

Mezi stále aktivně používané alternativy patří:

- [Mercurial](https://www.mercurial-scm.org/), mezi známé uživatele patří například NGINX.
- [Subversion (SVN)](https://subversion.apache.org/), mezi známé uživatele patří například Apache Software Foundation.

## Závěr

Git je skvělý a prakticky nepostradatelný nástroj při vývoj softwaru. Bez něj je práce na větším projektu prakticky procházka peklem.

Díky serverům jako GitHub a GitLab se stal Git nejpopulárnějším verzovacím systémem na světě.
