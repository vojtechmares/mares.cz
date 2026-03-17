---
title: Emaily z GitLabu přes AWS SES pomocí Terraformu
description: Konfigurace SMTP v GitLabu pro AWS SES s ověřením domény a DNS záznamy spravovanými přes Terraform.
keywords: ["gitlab", "terraform", "aws", "ses", "smtp", "emaily", "dns"]
tags: ["gitlab", "terraform", "aws-ses", "emails"]
draft: false
publish_time: 2022-04-12
alternate: "gitlab-emails-with-aws-ses-via-terraform"
---

> **POZNÁMKA**: SES pro svůj GitLab jsem nastavoval před dvěma lety, ale k sepsání článku se dostávám až teď.

## Motivace

V dokumentaci GitLabu se doporučuje nainstalovat [Postfix](https://www.postfix.org/) pro odchozí poštu, jako jsou resetování hesla, notifikace o neúspěšných CI pipeline nebo udělení přístupu ke skupinám a projektům.

Z mé zkušenosti trvá doručení e-mailu opravdu dlouho, pokud se vůbec doručí. U notifikací mi to nevadí, ale u resetování hesla je to naprosto k ničemu.

A toto chování je pro produkci zcela nepřijatelné. Na mé osobní instanci GitLabu je to v pořádku, ale přesto...

Kvůli tomu jsem prozkoumal další možnosti odesílání e-mailů. Věděl jsem, že chci spravované řešení za rozumnou cenu. Za virtuální stroj, na kterém běží GitLab (bez CI runneru), platím 15 € měsíčně. Nechtěl jsem platit dalších 10 € měsíčně za e-maily.

Mailgun by byl hezká volba, ale jejich bezplatná úroveň je pouze trial, který je zdarma první tři měsíce, než se přejde na placený plán.

Pokud vím, Google SMTP servery nelze pro odesílání pošty použít, takže i tato možnost odpadá.

Rozhodl jsem se nehledat dál, protože model platby za spotřebu od AWS mi vyhovuje. Budu posílat maximálně pár desítek e-mailů měsíčně, takže jsem se o účet vůbec nebál.

## AWS SES to bude, jak ho nakonfigurovat?

Šel jsem přímo do dokumentace AWS pro návod, jak SES nastavit. V té době jsem se učil Terraform, a tak mě napadlo, že by bylo fajn si to napsat v Terraformu a přitom se něco nového naučit.

Aby byla doména připravena k odesílání e-mailů přes SES, je potřeba nejdříve udělat pár věcí:

- ověřit doménu (důkaz vlastnictví) přes DNS
- nastavit DNS DKIM záznamy
- nastavit DNS SPF (TXT) záznamy

Doporučuje se také nastavit DNS DMARC (TXT) záznam.

### Terraform je jednoduchý

Začnu tím, že sdílím Terraform kód a poté ho vysvětlím. I když si myslím, že je celkem přímočarý.

```terraform
##
# Cloudflare
##

data "cloudflare_zone" "zone" {
  name = "example.com"
}

# DNS
resource "cloudflare_record" "gitlab" {
  zone_id = data.cloudflare_zone.zone.zone_id
  name    = "gitlab"
  value   = "__REDACTED__"
  type    = "A"
  proxied = true
}

resource "cloudflare_record" "ses_verification_gitlab" {
  zone_id = data.cloudflare_zone.zone.zone_id
  name    = "_amazonses.${aws_ses_domain_identity.gitlab.id}"
  type    = "TXT"
  value   = aws_ses_domain_identity.gitlab.verification_token
}

resource "cloudflare_record" "txt_dkim_gitlab" {
  zone_id = data.cloudflare_zone.zone.zone_id
  count   = 3
  name = format(
    "%s._domainkey.%s",
    element(aws_ses_domain_dkim.gitlab.dkim_tokens, count.index),
    cloudflare_record.gitlab.hostname,
  )
  type  = "CNAME"
  value = "${element(aws_ses_domain_dkim.gitlab.dkim_tokens, count.index)}.dkim.amazonses.com"
}

resource "cloudflare_record" "txt_spf_gitlab" {
  zone_id = data.cloudflare_zone.zone.zone_id
  count   = 1
  name    = "gitlab"
  type    = "TXT"
  value   = "v=spf1 include:amazonses.com -all"
}

##
# AWS
##

# IAM user & policy for sending emails
resource "aws_iam_user" "ses_gitlab_user" {
  name = "gitlab-emails"
}

data "aws_iam_policy_document" "ses_gitlab_user" {
  statement {
    effect    = "Allow"
    actions   = ["ses:SendRawEmail"]
    resources = ["*"]
  }
}

resource "aws_iam_user_policy" "ses_gitlab_user_policy" {
  user   = aws_iam_user.ses_gitlab_user.name
  policy = data.aws_iam_policy_document.ses_gitlab_user.json
}

resource "aws_iam_access_key" "ses_gitlab_user" {
  user = aws_iam_user.ses_gitlab_user.name
}

output "gitlab_ses_access_key" {
  value       = aws_iam_access_key.ses_gitlab_user.id
  description = "Access key for SES for GitLab"
  sensitive   = true
}

output "gitlab_ses_smtp_password_v4" {
  value       = aws_iam_access_key.ses_gitlab_user.ses_smtp_password_v4
  description = "SES SMTP password for SES for GitLab"
  sensitive   = true
}

# Domain identity & verification
resource "aws_ses_domain_identity" "gitlab" {
  domain = cloudflare_record.gitlab.hostname
}

resource "aws_ses_domain_identity_verification" "gitlab" {
  domain     = aws_ses_domain_identity.gitlab.id
  depends_on = [cloudflare_record.ses_verification_gitlab]
}

# DKIM
resource "aws_ses_domain_dkim" "gitlab" {
  domain = cloudflare_record.gitlab.hostname
}
```

Jak jsem již zmínil, není toho moc. Pár DNS záznamů... a nastavení ověření domény.

U resource `aws_ses_domain_identity_verification.gitlab` je Terraformová klauzule `depends_on`, která říká Terraformu, aby nejprve vytvořil DNS záznam a teprve potom se pokusil vytvořit verifikační resource.

Resource `cloudflare_record.txt_dkim_gitlab` používá count k vytvoření tří DKIM záznamů, pseudo-iterací přes `aws_ses_domain_dkim.gitlab.dkim_tokens`.

Součástí Terraform deklarace je IAM uživatel s jeho přístupovým klíčem a výstupem SES SMTP Password v4. To jsou přihlašovací údaje SMTP serveru pro autentizaci.

## AWS SES sandbox

Aby bylo možné odesílat e-maily na jiné domény než tu, ze které odesíláte, je potřeba vypnout SES sandbox režim, který lze zatím vypnout pouze přes AWS podporu.

Vytvořil jsem tedy tiket, vysvětlil svou situaci, že je to pro můj GitLab (a případně v budoucnu pro další služby). Požádal jsem o velkorysých 5000 odchozích e-mailů měsíčně a doufal v nejlepší.

Bylo to schváleno na první pokus, bez dalších dotazů. Konečně byly e-maily volné a mohl jsem pokračovat v odesílání!

## Konfigurace GitLabu

Pro GitLab Omnibus instanci je konfigurace uložena v `/etc/gitlab/gitlab.rb` a je potřeba změnit konfiguraci na tuto.

```ruby
# Emails (SMTP)
gitlab_rails['smtp_enable'] = true
gitlab_rails['smtp_address'] = "email-smtp.<your target AWS region>.amazonaws.com"
gitlab_rails['smtp_port'] = 587
gitlab_rails['smtp_user_name'] = "<AWS Access Key ID>"
gitlab_rails['smtp_password'] = "<AWS SES SMTP Password v4>"
gitlab_rails['smtp_domain'] = "<SMTP domain, e.g. gitlab.example.com>"
gitlab_rails['smtp_authentication'] = "login"
gitlab_rails['smtp_enable_starttls_auto'] = true
gitlab_rails['gitlab_email_from'] = '<email address to send mail from, e.g. no-reply@gitlab.example.com>'
```

Pokud používáte port `587` jako já, nezapomeňte povolit `STARTTLS`!

## Shrnutí

Celkově věřím, že tato konfigurace je poměrně přímočará a bez komplikací. Zabral mi asi 15 minut nastavení a od té doby jsem konfiguraci nemusel měnit.

### Cena

Jak jsem zmínil na začátku článku, cena je důležitým faktorem. Rád bych se o to podělil.

Protože SES používám pouze pro self-hosted GitLab a Sentry, kde odchozí pošta je něco jako 10-50 e-mailů měsíčně, cena vůbec není problém.

Ve skutečnosti platím jen pár centů měsíčně, a to převážně kvůli S3 provozu, ale to patří k něčemu jinému.
