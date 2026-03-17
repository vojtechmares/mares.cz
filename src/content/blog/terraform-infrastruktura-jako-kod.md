---
title: "Terraform: Infrastruktura jako kód"
description: "Terraform umožňuje spravovat infrastrukturu jako kód – verzovaně, opakovatelně a bez klikání v konzoli. Co to znamená a proč je to důležité."
keywords: ["infrastruktura", "terraform", "infrastructure-as-code", "devops", "cloud", "hashicorp"]
tags: ["infrastructure-as-code", "terraform"]
trainingAd: terraform
draft: false
publish_time: 2024-09-02
alternate: "terraform-infrastructure-as-code"
---

[Terraform](https://www.terraform.io/) je nástroj, kterým můžeme spravovat infrastrukturu jako kód. Co to znamená a proč je to důležité?
Aneb konec klikání v konzoli a hledání, jak jsme vlastně ten server před rokem nastavili.

## Předchůdci

Než se podíváme na Terraform, chtěl bych zmínit jeho předchůdce. [Ansible](https://www.ansible.com/), [Puppet](https://puppet.com/) a [Chef](https://www.chef.io/).

Níže v článku srovnám Terraform s Ansible. Jednak proto, že Ansible je velmi známý a rozšířený v Česku.
A také proto, že na rozdíl od ostatních alternativ, Ansible nepotřebuje agenta (program, klienta), který běží na cílových serverech. Stejně jako Terraform.

Puppetu a Chefu se věnovat nebudu, jednak z mé zkušenosti v Česku nejsou ani zdaleka tak populární a zároveň jsou podobné Ansible.

## Terraform

![HashiCorp Terraform logo](https://cdn.mares.cz/hashicorp_terraform_dfa1f73e9a.png)

Myšlenka Terraformu se zrodila už v roce 2011, kdy [Mitchell Hashimoto](https://mitchellh.com/) psal na svém blogu o [AWS CloudFormation](https://aws.amazon.com/cloudformation/),
a že na trhu chybí open-source alternativa, nezávislá na AWS.
Když se k jeho nespokojenosti tohoto nápadu nikdo pár let neujal, začal s tím sám a v roce 2014 vyšla první verze Terraformu, v0.1.

Dnes je Terraform (asi) nejznámější a nejúspěšnější DevOps nástroj pro správu infrastruktury a to nejen ve veřejném cloudu.
Aktuálně je poslední verzí verze **1.9.5** a už se pracuje na další verzi **1.10**.

Díky Terraformu můžeme popsat infrastrukturu jako kód (Infrastructure as Code, IaC) a tím získat mnoho výhod:

- Znovupoužitelnost kódu
- Možnost verzování (Git)
- Jednotnou formu zápisu

### Jiný pohled

Terraform staví na deklarativním modelu tvorby a správy zdrojů (_resources_) napříč různými poskytovateli (_providers_), jako je AWS, Azure, GCP a další.

Co znamená deklarativní? To znamená, že v Terraformu popisujete co chcete a jak má vypadat výsledný stav.
Opakem je imperativní model, kde popisujete jednotlivé kroky, jak se dostat z bodu A do bodu B. Pro přestavu imperativní jsou například skripty v Bashi, Pythonu nebo třeba Ansible.

### Základní koncepty

V Terraformu se potkáte s řadou pojmů, které byste měli znát nebo alespoň tušit, že existují.

- **Provider** - poskytovatel, platforma, software, ke kterému se chceme připojit a jeho zdroje spravovat (AWS, Azure, GCP, Cloudflare, Keycloak, Unifi,...).

  Konfigurace providera v Terraformu:

  ```hcl versions.tf
  # AWS provider
  provider "aws" {
    version = "~> 5.0"
    region  = "us-east-1"
  }

  # Cloudflare provider
  provider "cloudflare" {
    version = "~> 4.0"
    email   = var.cloudflare_email
    api_key = var.cloudflare_api_key
  }
  ```

  Výsledkem bude DNS záznam v Cloudflare. Záznam typu `A`, s názvem `www` a hodnotou `var.server_ip` (proměnná).

- **Resource** - zdroj, reprezentující něco, co jsme vytvořili nebo chceme vytvořit (EC2 instance, S3 bucket, DNS záznam).

  Příklad resource, DNS záznam v Cloudflare:

  ```hcl
  resource "cloudflare_record" "www_mares_cz" {
    zone_id = "xxx" # prave zone ID najdete v Cloudflare, xxx je pouze ilustrativni
    name    = "www"
    value   = var.server_ip
    type    = "A"
    proxied = true
  }
  ```

  Nebo EC2 instance (virtuální server) v AWS:

  ```hcl
  resource "aws_instance" "web" {
    count = 10 # nemusime vse kopirovat, muzeme udat pocet :)

    ami           = "ami-0c55b159cbfafe1f0" # nebo data.aws_ami.ubuntu.id
    instance_type = "t2.micro"
  }
  ```

- **Datasource** - zdroj, který nebyl vytvořen Terraformem, ale chceme ho použít nebo se na něj odkázat.

  Příklad datasource, pro nejnovější verzi Ubuntu 24.04 AMI (Amazon Machine Image) v AWS:

  ```hcl
  data "aws_ami" "ubuntu" {
    most_recent = true

    filter {
        name   = "name"
        values = ["ubuntu/images/hvm-ssd/ubuntu-numbat-24.04-amd64-server-*"]
    }

    filter {
        name   = "virtualization-type"
        values = ["hvm"]
    }

    owners = ["099720109477"] # Canonical - dá se dohledat na internetu
  }
  ```

- **Variable** - proměnná, kterou můžeme použít v konfiguraci Terraformu. Může být definována v souboru, při spuštění nebo jako environment proměnná.

  Definice proměnné v Terraformu:

  ```hcl
  variable "server_ip" {
    description = "IP adresa serveru"
    type        = string
  }
  ```

- **Module** - opakovaně použitelný blok Terraformu, který může obsahovat resources nebo data sources a zároveň nám ušetří spoustu psaní kódu.

  Příklad modulu:

  ```hcl
  module "web" {
    source = "./modules/webserver"

    server_ip = var.server_ip
  }
  ```

  Jako `source` můžeme použít cestu k lokálnímu adresáři nebo URL adresu k modulu na [Terraform Registry](https://registry.terraform.io/).

- **State** - stav infrastruktury, který Terraform udržuje v souboru nebo v backendu. Lokálně se jedná o soubor `terraform.tfstate` (JSON).

- **Backend** - cíl, kam Terraform ukládá stav infrastruktury. Může to být soubor, S3 bucket, Consul, Terraform Cloud.

  Konfigurace backendu v AWS S3:

  ```hcl
  terraform {
    backend "s3" {
      bucket = "my-tf-state"
      key    = "terraform.tfstate"
      region = "us-east-1"
    }
  }
  ```

- [**Registry** (`registry.terraform.io`)](https://registry.terraform.io/) - oficiální místo, kde najdete moduly a providery pro Terraform.

### Práce s Terraformem

Práce s Terraformem probíhá v příkazové řádce, teď se podíváme na nejdůležitější příkazy.

- **Init** - inicializace workspace, stáhne potřebné providery a moduly. Případně vygeneruje lockfile, pokud neexistuje.

  ```shell
  terraform init
  ```

- **Plan** - Terraform pracuje dvoufázově. Nejdříve vytvoří plán, co se má změnit a dá je ke schválení (dá se vynutit, aby se změny provedly automaticky).

  Plán se případně dá uložit do souboru a použít jej později, to se hodí při automatickém použití Terraformu v CI/CD pipeline.

  **Poznámka**:
  Aby mohl vytvořit plán, provádí operaci **refresh**, kde se podívá na aktuální stav (zavolá na API), srovná jej se stavem uloženým ve statefilu a s konfigurací,
  kterou máme v našich `.tf` souborech a na základě toho, vytvoří plán.

  ```shell
  terraform plan
  ```

- **Apply** - krok číslo dva, provede změny dle plánu (třeba ze souboru), pokud použijeme pouze `terraform apply`, Terraform vytvoří plán i tak a dá jej ke schválení.

  ```shell
  terraform apply
  ```

- **Destroy** - nebezpečná operace, která zničí všechny zdroje. Ideální pro práci s testovacím prostředím, když jej již nepotřebujete.

  Pro běžné mazání nepotřebných zdrojů je stačí smazat ze souborů a Terraform je smaže při příštím spuštění `terraform apply`.

  ```shell
  terraform destroy
  ```

- **State** - Terraform jako program v příkazové řádce nemá přehled o tom, jak vypadá stav, proto si jej ukládá do tzv. statefile (`terraform.tfstate`).

  Standardně, bez jakékoliv konfigurace je statefile uložen do lokálního adresáře, kde Terraform spouštítě. Což ale pro reálné použití není moc praktické,
  protože bychom si museli například statefile posílat emailem 😅 nebo by statefile měl pouze jeden člověk, který by se o všechno staral. Což také není zrovna fajn.

  Proto má Terraform podporu ukládat statefile do různých backendů (úložišť chcete-li). Mezi nejběžnější patří objektové úložiště velkých cloud poskytovatelů,
  AWS S3, Azure Blob Storage, Google Cloud Storage. Nebo v případě HashiCorp produktů lze použít například [Consul](https://www.consul.io/) nebo [HCP Terraform](https://app.terraform.io/) (HashiCorp Platform Terraform, dříve Terraform Cloud).

  S [velikce pěkným řešením](https://docs.gitlab.com/ee/user/infrastructure/iac/terraform_state.html) přišel [GitLab](https://about.gitlab.com/), který integruje HTTP rozhraní pro Terraform a lze tedy backend uložit do GitLabu a nepotřebujete žádnou další službu.
  To lze jak ve veřejném ([GitLab.com](https://gitlab.com)), tak v soukromém (GitLab Self-Managed) GitLabu.

- **Lockfile** (`terraform.lock.hcl`) - protože Terraform si stahuje verze providerů a modulů do lokální složky, je třeba zajistit, že se nám stáhne správná verze,
  se kterou počítáme. A to na jakémkoliv počítači nebo v CI/CD pipeline.

  K tomu slouží lockfile, stejně jako u nástrojů pro správu balíčků u programovacích jazyků (NPM pro JavaScript, Pip pro Python, Cargo pro Rust, Nuget pro C# atd.).

  Terraform do lockfile zapisuje kontrolní hashe, které vygeneroval při stahování providerů a modulů z Terraform Registry.
  Pokud lockfile neexistuje, Terraform jej vytvoří při spuštění příkazu `terraform init` a stáhne dostupnou verzi, která splňuje podmínky pro verzi provider/modulu.

## Terraform a GitLab CI

Ukážeme si, jak jednoduše spojit Terraform a GitLab CI. Takže Terraform nemusíme spoutět my, ale postará se o to GitLab CI pipeline.

1. Vytvoříme soubor `.gitlab-ci.yml` v kořenovém adresáři repozitáře.

2. Do souboru přidáme následující obsah:

   ```yaml
   include:
   - template: Terraform/Base.gitlab-ci.yml
   - template: Jobs/SAST-IaC.gitlab-ci.yml

   stages:
   - validate
   - test
   - build
   - deploy
   - cleanup

   fmt:
   extends: .terraform:fmt
   needs: []

   validate:
   extends: .terraform:validate
   needs: []

   build:
   extends: .terraform:build

   deploy:
   extends: .terraform:deploy
   dependencies:
     - build
   environment:
     name: $TF_STATE_NAME
   ```

   Všiměte si, že většinu konfigurace CI pipeline prakticky vůbec nepíšeme, ale používáme šablony od GitLabu.
   Pokud Vás zajímá, co šablona přesně dělá, můžete se podívat: https://gitlab.com/gitlab-org/gitlab-foss/tree/master/lib/gitlab/ci/templates

3. Nakonfigurujeme Terraform, aby použil GitLab jako backend.

   ```hcl
   terraform {
     backend "http" {
       address = "https://gitlab.com/api/v4/projects/1234/terraform/state"
       lock_address = "https://gitlab.com/api/v4/projects/1234/terraform/lock"
       unlock_address = "https://gitlab.com/api/v4/projects/1234/terraform/lock"
       username = "gitlab-ci-token"
       password = "CI_JOB_TOKEN"
     }
   }
   ```

4. Přidáme `.tf` soubory do repozitářeme a provedem push, GitLab se postará o zbytek
   (samozřejmě je třeba nastavit GitLab CI environment proměnné, pokud jsou třeba.
   Například token pro přístup do Cloudflare apod.).

Pro lokální práci s Terraformem, pokud je backend nastavený na GitLab, je třeba jej lokálně nakonfigurovat:

```sh
export GITLAB_USERNAME="gitlab-username"
export GITLAB_ACCESS_TOKEN="xxx"

terraform init -reconfigure \
  -backend-config=username=$GITLAB_USERNAME \
  -backend-config=password=$GITLAB_ACCESS_TOKEN \
  -backend-config=lock_method=POST \
  -backend-config=unlock_method=DELETE \
  -backend-config=retry_wait_min=5
```

Pokud bychom chtěli i automatickou destroy operaci, například pro demo prostředí apod. Můžeme upravit `.gitlab-ci.yml` soubor:

```yaml
deploy:
  extends: .terraform:deploy
  rules:
    - if: $CI_COMMIT_TITLE != "destroy"
      when: on_success
  dependencies:
    - build
  environment:
    name: $TF_STATE_NAME

cleanup:
  extends: .terraform:destroy
  environment:
    name: $TF_STATE_NAME
  rules:
    - if: $CI_COMMIT_TITLE == "destroy"
      when: on_success
```

## Terraform vs Ansible

|                     | Terraform                               | Ansible                       |
| ------------------- | --------------------------------------- | ----------------------------- |
| **Model**           | Deklarativní                            | Imperativní                   |
| **Vyvíjí**          | HashiCorp                               | RedHat                        |
| **Licence**         | BUSL (bussiness, pouze public-source)\* | GPL-3 (open-source, copyleft) |
| **Formát**          | HCL (HashiCorp Configuration Language)  | YAML                          |
| **Rozšiřitelnost**  | Ano, moduly a Golang                    | Ano, role a Python            |
| **Dokumentace\*\*** | 9/10                                    | 7/10                          |

**\*BUSL licence**: je podobná běžným open-source licencím a nezakazuje použití Terraformu ve firmách. Ale zakazuje komerční distribuci nebo přímou integraci Terraformu do produktu,
v tom případě je třeba kontaktovat HashiCorp a uzavřít smlouvu. Pokud je pro vás licence problém, podívejte se na open-source projekt [OpenTofu](https://opentofu.org/), který je kompatibilní s Terraformem jedná se totiž o fork.

\***\*Dokumentace**: beru v potaz oficiální dokumentaci, ne dokumentaci pro komunitní projekty nebo třetí strany. A je to samozřejmě moje subjektivní hodnocení.

Jak jsem již psal, největší rozdíl je v tom, jaký model jednotlivé nástroje využívají. Terraform je deklarativní, tj. popisujeme výsledný stav který chceme.
Zatímco Ansible je imperativní a popisujeme jak se dostat ze stavu A do stavu B.

Terraform je dnes velice populární v cloudovém světě, hlavně díky tomu, že deklarativní model jde s cloudem ruku v ruce.
Můžu si server vytvořit jak chci, kolik serverů chci a pak je zase zahodit. To dříve, kdy se servery nakupovaly nešlo.

To ale neznamená, že Ansible ztratil své místo, stále je spousta datacenter která je třeba spravovat. A stále je spousta firem,
které veřejnému cloudu prostě nevěří, a nebo jej nemohou využívat kvůli legislativě. Pro ty je Ansible stále velmi často nepostradatelným nástrojem,
který využívají ke správě serverů.

Zároveň je třeba podoknout, že Terraform a Ansible nejsou přímými konkurenty. Terraform se stará o tvorbu a správu zdrojů (serverů, DNS záznamů, certifikátů apod.),
zatímco Ansible je zaměřen na konfiguraci existujícího serveru a jeho dlouhodobou údržbu.
V triviálním přirovnání se Ansible stará o vnitřek krabice, zatímco Terraform o to, kolik a jakých krabic chceme.

## Nejen pro public cloud

Terraform provider dnes může vytvořit úplně každý, kdo umí trochu psát [Golang](https://go.dev/). A proto existuje provider prakticky pro cokoliv. Od AWS, Azure, GCP, Cloudflare, přes OpenStack, GitLab a GitHub až po Keycloak nebo Google Workspace nebo i Unifi (Ubiquiti) routery.

## Terraform a DevOps

Terraform se stal klíčovým a pratikcy nepostradatelným DevOps nástrojem při správě infrastruktury.
Nejen díky jeho schopnostem a možnostem, ale i díky integraci s dalšími DevOps nástroji, jako je třeba GitLab.

Zároveň se Terraform těší velké oblibě v DevOps komunitě, i když nedává změna licence vyvolala řadu otázek a diskuzí o budoucnosti projektu, přesto je Terraform stále nesmírně populární.

## HashiCorp

![HashiCorp logo](https://cdn.mares.cz/hashicorp_horizontal_4d2ee169f4.png)

Jak jsem psal v úvodu, Terraform vytvořil Mitchell Hashimoto, který je spoluzakladatelem firmy [HashiCorp](https://www.hashicorp.com/). Dnes už však firmu definitivně opustil a věnuje se dalším projektům.

HashiCorp je dominantním hráčem na poli DevOps nástrojů a správy infrastruktry. Ale Terraform není jejich jediným produktem, naopak, mají jich celou řadu:

- [Vault](https://www.vaultproject.io/) - secrety, šifrování, certifikáty a automatická rotace (obnova)

- [Consul](https://www.consul.io/) - service discovery, monitoring a service mesh

- [Nomad](https://www.nomadproject.io/) - orchestrace kontejnerů, podobně jako [Kubernetes](https://kubernetes.io/)

- [Packer](https://www.packer.io/) - tvorba obrazů (images) pro virtuální servery, operační systém a konfigurace, vše v jednom

- [Vagrant](https://www.vagrantup.com/) - tvorba a správa virtuálních prostředí, dnes prakticky nahrazen [Dockerem](https://www.docker.com/)

- [Waypoint](https://www.waypointproject.io/) - nástroj pro vývojáře pro trovrbu nových aplikací/projektů, nasazování, automaitckých pipeline a jejich spuštění

- [Boundary](https://www.boundaryproject.io/) - správa přístupů odkudkoliv kamkoliv, na základě identity uživatele

## Terraform v praxi

- Pro příklad nemusím chodit daleko, třeba já osobně mám 95% svojí infrastruktury v Terraformu, veřejně na GitHubu: [github.com/vojtechmares/infrastructure](https://github.com/vojtechmares/infrastructure).

- Terraform byl nástroj, který jsme zvolili v [GLAMI](https://www.glami.cz/) pro správu infrastruktury v [AWS](https://aws.amazon.com/),
  kde jsme provozovali všechny Machine Learning služby. A to včetně tréninku modelů a inference. Jak na GPU, tak na CPU, primárně na Kubernetes.

  Zatímco backend (web) byl na fyzických serverech, spravovaných Ansible.

Jako konzultant, ale i jako vývojář mám Terraform nesmírně rád. Umožňuje mi popsat infrastrukturu jako kód a v Gitu ji sdílet s kolegy a s budoucími kolegy. Je to jednotný, standardizovaný zápis (Terraform má vlastní integrovaný formater, který vám kód zformátuje `terraform fmt`).
Je v něm vše pohromadě a není třeba nic dohledávat v konzoli nebo se ptát kolegů, kde jsme k takovému kusu infrastruktury přišli a jak je to vlasně nastavené.
