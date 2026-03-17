---
title: "Terraform: Infrastructure as Code"
description: "Terraform lets you manage infrastructure as code — versioned, repeatable, and no more clicking through consoles or guessing server configs."
keywords: ["infrastructure", "terraform", "infrastructure-as-code", "devops", "cloud", "hashicorp"]
tags: ["infrastructure-as-code", "terraform"]
trainingAd: terraform
draft: false
publish_time: 2024-09-02
---

[Terraform](https://www.terraform.io/) is a tool for managing infrastructure as code. What does that mean and why does it matter? No more clicking through consoles and trying to figure out how we actually configured that server a year ago.

## Predecessors

Before we dive into Terraform, I'd like to mention its predecessors: [Ansible](https://www.ansible.com/), [Puppet](https://puppet.com/), and [Chef](https://www.chef.io/).

Later in the article, I'll compare Terraform with Ansible – partly because Ansible is very well-known and widely used in the Czech Republic, and also because, unlike other alternatives, Ansible doesn't require an agent (a program, a client) running on target servers. Just like Terraform.

I won't cover Puppet and Chef, as in my experience they're nowhere near as popular in the Czech Republic, and they're similar to Ansible.

## Terraform

![HashiCorp Terraform logo](https://cdn.mares.cz/hashicorp_terraform_dfa1f73e9a.png)

The idea for Terraform was born back in 2011, when [Mitchell Hashimoto](https://mitchellh.com/) wrote on his blog about [AWS CloudFormation](https://aws.amazon.com/cloudformation/) and how the market was missing an open-source alternative independent of AWS. When nobody picked up on this idea for a few years (to his frustration), he started building it himself, and in 2014 the first version of Terraform was released: v0.1.

Today, Terraform is (arguably) the most well-known and successful DevOps tool for infrastructure management – and not just in the public cloud. The current latest version is **1.9.5**, with **1.10** already in the works.

Thanks to Terraform, we can describe infrastructure as code (Infrastructure as Code, IaC) and gain many benefits:

- Code reusability
- Version control (Git)
- A unified way of writing configurations

### A Different Perspective

Terraform is built on a declarative model for creating and managing resources across various providers, such as AWS, Azure, GCP, and more.

What does declarative mean? It means that in Terraform you describe what you want and what the desired end state should look like. The opposite is the imperative model, where you describe the individual steps to get from point A to point B. Examples of imperative approaches include scripts in Bash, Python, or Ansible.

### Core Concepts

In Terraform, you'll encounter a number of terms you should know or at least be aware of.

- **Provider** – the platform, software, or service you want to connect to and manage its resources (AWS, Azure, GCP, Cloudflare, Keycloak, Unifi,...).

  Provider configuration in Terraform:

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

  The result will be a DNS record in Cloudflare – an `A` record with the name `www` and the value `var.server_ip` (a variable).

- **Resource** – something you've created or want to create (EC2 instance, S3 bucket, DNS record).

  Example resource – a DNS record in Cloudflare:

  ```hcl
  resource "cloudflare_record" "www_mares_cz" {
    zone_id = "xxx" # your zone ID can be found in Cloudflare, xxx is just illustrative
    name    = "www"
    value   = var.server_ip
    type    = "A"
    proxied = true
  }
  ```

  Or an EC2 instance (virtual server) in AWS:

  ```hcl
  resource "aws_instance" "web" {
    count = 10 # no need to copy everything, we can specify the count :)

    ami           = "ami-0c55b159cbfafe1f0" # or data.aws_ami.ubuntu.id
    instance_type = "t2.micro"
  }
  ```

- **Datasource** – a resource that wasn't created by Terraform, but you want to use or reference it.

  Example datasource for the latest Ubuntu 24.04 AMI (Amazon Machine Image) in AWS:

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

    owners = ["099720109477"] # Canonical - can be looked up online
  }
  ```

- **Variable** – a variable you can use in your Terraform configuration. It can be defined in a file, at runtime, or as an environment variable.

  Variable definition in Terraform:

  ```hcl
  variable "server_ip" {
    description = "Server IP address"
    type        = string
  }
  ```

- **Module** – a reusable block of Terraform that can contain resources or data sources and saves you a lot of code.

  Module example:

  ```hcl
  module "web" {
    source = "./modules/webserver"

    server_ip = var.server_ip
  }
  ```

  As the `source`, you can use a path to a local directory or a URL to a module on the [Terraform Registry](https://registry.terraform.io/).

- **State** – the state of infrastructure that Terraform maintains in a file or a backend. Locally, this is the `terraform.tfstate` file (JSON).

- **Backend** – the target where Terraform stores the infrastructure state. It can be a file, an S3 bucket, Consul, or Terraform Cloud.

  Backend configuration in AWS S3:

  ```hcl
  terraform {
    backend "s3" {
      bucket = "my-tf-state"
      key    = "terraform.tfstate"
      region = "us-east-1"
    }
  }
  ```

- [**Registry** (`registry.terraform.io`)](https://registry.terraform.io/) – the official place to find modules and providers for Terraform.

### Working with Terraform

Working with Terraform happens on the command line. Let's look at the most important commands.

- **Init** – initializes the workspace, downloads required providers and modules. Generates a lockfile if one doesn't exist.

  ```shell
  terraform init
  ```

- **Plan** – Terraform works in two phases. First it creates a plan of what needs to change and presents it for approval (you can force changes to be applied automatically).

  The plan can optionally be saved to a file and used later, which is useful for automated Terraform usage in CI/CD pipelines.

  **Note**:
  To create a plan, Terraform performs a **refresh** operation, where it checks the current state (calls the API), compares it with the state stored in the state file and the configuration in our `.tf` files, and based on that, creates the plan.

  ```shell
  terraform plan
  ```

- **Apply** – step two, executes changes according to the plan (e.g., from a file). If you just run `terraform apply`, Terraform creates the plan anyway and presents it for approval.

  ```shell
  terraform apply
  ```

- **Destroy** – a dangerous operation that destroys all resources. Ideal for working with test environments when you no longer need them.

  For regular deletion of unneeded resources, you just remove them from the files and Terraform will delete them on the next `terraform apply`.

  ```shell
  terraform destroy
  ```

- **State** – Terraform as a CLI tool has no inherent awareness of the infrastructure's state, so it stores it in a so-called state file (`terraform.tfstate`).

  By default, without any configuration, the state file is stored in the local directory where you run Terraform. But for real-world use, this isn't very practical, because you'd have to send the state file around by email, or only one person would have the state file and be responsible for everything. Neither is great.

  That's why Terraform supports storing the state file in various backends (storage destinations, if you will). The most common ones are object storage from major cloud providers: AWS S3, Azure Blob Storage, Google Cloud Storage. For HashiCorp products, you can also use [Consul](https://www.consul.io/) or [HCP Terraform](https://app.terraform.io/) (HashiCorp Platform Terraform, formerly Terraform Cloud).

  [GitLab](https://about.gitlab.com/) came up with a [very nice solution](https://docs.gitlab.com/ee/user/infrastructure/iac/terraform_state.html) – it integrates an HTTP interface for Terraform, so you can store the backend in GitLab without needing any additional service. This works both on public ([GitLab.com](https://gitlab.com)) and private (GitLab Self-Managed) GitLab instances.

- **Lockfile** (`terraform.lock.hcl`) – since Terraform downloads provider and module versions to a local directory, you need to ensure the correct version is downloaded – the one you're expecting – on any machine or in a CI/CD pipeline.

  That's what the lockfile is for, just like package manager lock files in programming languages (NPM for JavaScript, Pip for Python, Cargo for Rust, NuGet for C#, etc.).

  Terraform writes checksums into the lockfile, generated when downloading providers and modules from the Terraform Registry. If the lockfile doesn't exist, Terraform creates it when running `terraform init` and downloads an available version that meets the provider/module version constraints.

## Terraform and GitLab CI

Let's see how to simply combine Terraform with GitLab CI. This way, we don't have to run Terraform ourselves – GitLab CI pipeline takes care of it.

1. Create a `.gitlab-ci.yml` file in the repository root.

2. Add the following content to the file:

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

   Notice that we barely write any CI pipeline configuration ourselves – we use GitLab's templates instead.
   If you're curious about what the template actually does, you can check: https://gitlab.com/gitlab-org/gitlab-foss/tree/master/lib/gitlab/ci/templates

3. Configure Terraform to use GitLab as the backend.

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

4. Add your `.tf` files to the repository and push. GitLab takes care of the rest (of course, you need to set up GitLab CI environment variables if needed – for example, a token for accessing Cloudflare, etc.).

For local work with Terraform when the backend is set to GitLab, you need to configure it locally:

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

If we also want an automatic destroy operation, for example for demo environments, we can modify the `.gitlab-ci.yml` file:

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

|                       | Terraform                              | Ansible                       |
| --------------------- | -------------------------------------- | ----------------------------- |
| **Model**             | Declarative                            | Imperative                    |
| **Developed by**      | HashiCorp                              | Red Hat                       |
| **License**           | BUSL (business, public-source only)\*  | GPL-3 (open-source, copyleft) |
| **Format**            | HCL (HashiCorp Configuration Language) | YAML                          |
| **Extensibility**     | Yes, modules and Golang                | Yes, roles and Python         |
| **Documentation\*\*** | 9/10                                   | 7/10                          |

**\*BUSL license**: similar to common open-source licenses and doesn't prohibit using Terraform in companies. However, it prohibits commercial distribution or direct integration of Terraform into a product – in that case, you need to contact HashiCorp and sign an agreement. If the license is an issue for you, check out the open-source project [OpenTofu](https://opentofu.org/), which is compatible with Terraform as it's a fork.

\*\***Documentation**: I'm considering only official documentation, not documentation for community projects or third parties. And this is of course my subjective rating.

As I wrote earlier, the biggest difference is in the model each tool uses. Terraform is declarative – we describe the desired end state. Ansible is imperative – we describe how to get from state A to state B.

Terraform is very popular in the cloud world today, mainly because the declarative model goes hand in hand with the cloud. I can create a server however I want, as many servers as I want, and then throw them away again. This wasn't possible in the past when servers had to be purchased.

But that doesn't mean Ansible has lost its place. There are still plenty of data centers that need to be managed. And there are still plenty of companies that simply don't trust the public cloud, or can't use it due to regulations. For them, Ansible remains an often indispensable tool for server management.

It's also worth noting that Terraform and Ansible aren't direct competitors. Terraform handles creating and managing resources (servers, DNS records, certificates, etc.), while Ansible focuses on configuring existing servers and their long-term maintenance. In a simple analogy, Ansible takes care of what's inside the box, while Terraform determines how many boxes of what kind we want.

## Not Just for Public Cloud

Today, anyone who can write a bit of [Golang](https://go.dev/) can create a Terraform provider. That's why providers exist for virtually everything – from AWS, Azure, GCP, Cloudflare, through OpenStack, GitLab, and GitHub, to Keycloak, Google Workspace, or even Unifi (Ubiquiti) routers.

## Terraform and DevOps

Terraform has become a key and practically indispensable DevOps tool for infrastructure management. Not only thanks to its capabilities and features, but also through integration with other DevOps tools like GitLab.

At the same time, Terraform enjoys great popularity in the DevOps community. Even though the license change raised a number of questions and discussions about the project's future, Terraform remains immensely popular.

## HashiCorp

![HashiCorp logo](https://cdn.mares.cz/hashicorp_horizontal_4d2ee169f4.png)

As I mentioned in the introduction, Terraform was created by Mitchell Hashimoto, co-founder of [HashiCorp](https://www.hashicorp.com/). Today he has definitively left the company and focuses on other projects.

HashiCorp is a dominant player in the DevOps tools and infrastructure management space. But Terraform isn't their only product – on the contrary, they have a whole range of them:

- [Vault](https://www.vaultproject.io/) – secrets, encryption, certificates, and automatic rotation (renewal)

- [Consul](https://www.consul.io/) – service discovery, monitoring, and service mesh

- [Nomad](https://www.nomadproject.io/) – container orchestration, similar to [Kubernetes](https://kubernetes.io/)

- [Packer](https://www.packer.io/) – building images for virtual servers – operating system and configuration, all in one

- [Vagrant](https://www.vagrantup.com/) – creating and managing virtual environments, today practically replaced by [Docker](https://www.docker.com/)

- [Waypoint](https://www.waypointproject.io/) – a developer tool for creating new applications/projects, deployments, automated pipelines, and their execution

- [Boundary](https://www.boundaryproject.io/) – managing access from anywhere to anywhere, based on user identity

## Terraform in Practice

- For a practical example, I don't have to look far – I personally have 95% of my infrastructure in Terraform, publicly on GitHub: [github.com/vojtechmares/infrastructure](https://github.com/vojtechmares/infrastructure).

- Terraform was the tool we chose at [GLAMI](https://www.glami.cz/) for managing infrastructure in [AWS](https://aws.amazon.com/), where we ran all Machine Learning services – including model training and inference. Both on GPU and CPU, primarily on Kubernetes.

  Meanwhile, the backend (web) ran on physical servers, managed by Ansible.

As a consultant and a developer, I'm very fond of Terraform. It allows me to describe infrastructure as code and share it with colleagues and future colleagues via Git. It's a unified, standardized format (Terraform has its own built-in formatter that formats your code: `terraform fmt`). Everything is in one place, and there's no need to search through consoles or ask colleagues where a piece of infrastructure came from and how it's actually configured.
