---
title: GitOps and Argo CD
description: In this article, we'll look at GitOps and the Argo CD tool, which is one of the tools for implementing GitOps.
keywords: ["git", "gitlab", "github", "argocd", "gitops", "kargo", "argocd autopilot"]
tags: ["kubernetes", "gitops"]
trainingAd: argo-cd
draft: false
publish_time: 2024-09-24
---

In this article, we'll look at GitOps and the Argo CD tool, which is one of the tools for implementing GitOps.

## What Is GitOps

GitOps is a way to deploy changes to an environment using Git, where all changes are recorded as commits in a Git repository.

GitOps has really started gaining traction in recent years, alongside [Kubernetes](https://kubernetes.io).
Because everything in Kubernetes is declarative and can be described in configuration files (YAML, jsonnet, ...), including with tools like [Kustomize](https://kustomize.io/) or [Helm](https://helm.sh/).

Kustomize essentially just overlays YAML based on a hierarchy. And even Helm, which works as a YAML templating system, needs to get its values from somewhere,
and those can be stored in a file -- again, we arrive at a declarative approach.

From here on I'll focus on GitOps and Kubernetes, but GitOps can be found elsewhere too.

GitOps is based on several principles:

- **Declarative configuration**: All changes are described in configuration files (e.g., YAML) and the application is deployed based on these files.
- **Automation**: Deployment is fully automated and happens without manual intervention.
- **Continuous delivery**: Changes are deployed continuously as soon as they are approved and tested.
- **Recoverability**: Because everything is stored in Git, practically anything can be recovered without special tools, and recovery doesn't take too long.

The main advantage of GitOps over other methods is that GitOps guarantees the correctness of settings in the Kubernetes cluster,
because once a change makes it to the repository, it is automatically applied. Or when the cluster state changes and differs from what it should be,
GitOps automatically re-applies the configuration and returns to the correct state, thus preventing so-called config drift. For example, Argo CD checks for changes every two minutes (by default).
The second big advantage is that everything is stored in the repository, so the configuration repository can also be considered a backup, and just like a regular application,
the environment can be restored from the repository.

Because everything is stored in the repository and the "active part" of the system works as an agent in the cluster,
which regularly pulls the repository and looks for changes compared to the current cluster state.
And if it finds a change, it automatically applies it.

## GitOps vs CI/CD

GitOps handles the automation of deploying applications to the cluster (when talking about Kubernetes),
which is often the same goal as CI/CD.

**So why another paradigm that solves the same thing?**

CI/CD pipelines work on a push principle. That is, when a new version is released or configuration changes,
a pipeline is triggered that runs tests, etc. And if everything is fine, deployment happens at the end of the pipeline.

This is a very straightforward approach, but if the cluster itself breaks, it will likely not be possible
to deploy a new version without changes. You'll probably need to modify some CI/CD pipeline configuration.
This blocks us and creates a manual task that **someone** has to do.

Another difference is the case where you have multiple Kubernetes clusters.
In a CI/CD pipeline, this is fairly manageable for two or three clusters, but if you have dozens or hundreds,
it becomes extremely difficult to manage.

With GitOps/Argo CD we still have a single identical repository from which any number of Argo CD instances can pull across different clusters and even across clouds.
If we additionally wanted or needed to create specific configuration for a cluster,
region, or perhaps by country, we'd just create a configuration file and load such configuration using an **ApplicationSet**, for example.
But such a solution works better with a single Argo CD instance or at least not with an Argo CD instance in every cluster.

## The Chicken and Egg Problem

One so-far universally unsolved problem with GitOps:

> What came first, the chicken or the egg?

With GitOps practices and tools, it is essentially impossible to get those same GitOps tools into the cluster before you install them there.

Today there are many different approaches and tools trying to solve this problem.
Typically it's a "bootstrap script" or CLI tool that you can use to install GitOps tools into the cluster.
Alternatively, if you manage your Kubernetes clusters with [Terraform](/en/blog/terraform-infrastruktura-jako-kod), you can use, for example,
the [Helm provider](https://registry.terraform.io/providers/hashicorp/helm/latest) and install Argo CD into every cluster via Terraform. Which is a fairly elegant solution:

```hcl
provider "helm" {
  kubernetes {
    config_path = "~/.kube/config"
  }
}

resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  namespace        = "argocd"
  create_namespace = true
  version          = "7.6.1"  # Helm chart version

  # to configure the Helm chart, use
  # values = [] array where you can insert YAML snippets
  # values = [
  #   file("${path.module}/values.yaml"),
  # ]
  # or a set {} object where you can set values
  # set {
  #   name  = "server.service.type"
  #   value = "LoadBalancer"
  # }
}
```

## Argo CD

![argo.png](https://cdn.mares.cz/argo_2ee95661b5.png)

[Argo CD](https://argoproj.github.io/cd/) is an open-source tool that builds on the GitOps paradigm.
It is one of the most popular tools for GitOps in the Kubernetes ecosystem.
It is primarily developed by [Akuity](https://akuity.io/), although today it falls under [CNCF](https://www.cncf.io/) and the [project](https://landscape.cncf.io/?item=app-definition-and-development--continuous-integration-delivery--argo) has _Graduated_ status.

Argo is actually a whole family of tools that integrate with and extend Kubernetes.

- **Argo CD** - GitOps tool for Kubernetes
- [Argo Workflows](https://argoproj.github.io/workflows/) - Workflow engine for Kubernetes (Jobs on steroids: pipelines, regular and periodic with cron); internally used by [KubeFlow](https://www.kubeflow.org/), for example.
- [Argo Events](https://argoproj.github.io/events/) - Eventing system for Kubernetes, with many integrations (AWS, calendar, Slack, PubSub, webhooks, and more...)
- [Argo Rollouts](https://argoproj.github.io/rollouts/) - Advanced application deployment to Kubernetes (blue/green, canary, ...)

Argo CD supports plain YAML manifests, as well as Kustomize, jsonnet, and Helm.
It also works seamlessly with Kubernetes operators and the _custom resources_ they bring.

Argo CD has several of its own _resources_ that describe applications, projects, and their grouping.

- **Application** - a resource describing an application, source repository, version, and optionally Helm values, etc.

  Example of an Argo CD application that manages my Argo CD instance:

  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: Application
  metadata:
    name: argo-cd
    namespace: argocd
    annotations:
      argocd.argoproj.io/sync-wave: "1"
    # finalizers on the application,
    # if the finalizer `resources-finalizer.argocd.argoproj.io` is present,
    # then when the Argo CD application is deleted, all resources
    # created by this application are automatically (cascadingly) deleted
    finalizers:
      - resources-finalizer.argocd.argoproj.io
  spec:
    project: argo
    syncPolicy:
      automated:
        # automatically delete if removed
        prune: true
        # automatically restore if changed
        selfHeal: true
      syncOptions:
        - CreateNamespace=true
    # which Kubernetes cluster to deploy the application to
    # in this case the same cluster where Argo CD runs
    # but it's possible to choose other cluster(s) that the Argo CD instance knows (see config)
    destination:
      server: "https://kubernetes.default.svc"
      namespace: argocd
    source:
      # Helm chart name
      chart: argo-cd
      # Helm repository URL
      repoURL: https://argoproj.github.io/argo-helm
      # Helm chart version
      targetRevision: 7.4.7
      helm:
        # Helm release name
        releaseName: argocd
        # helm values directly in the application manifest,
        # they can also be stored in a separate file in the same repository
        valuesObject:
          global:
            domain: argocd.example.com # example, I don't want to expose my Argo CD publicly :P
          server:
            ingress:
              enabled: true
              ingressClassName: nginx
              annotations:
                nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
                nginx.ingress.kubernetes.io/ssl-passthrough: "true"
                nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
              tls: true

            # internal certificate for HTTPS already on the *Pod*
            # rather than at the *Ingress*
            certificate:
              enabled: true
              issuer:
                group: "cert-manager.io"
                kind: "ClusterIssuer"
                name: "letsencrypt-dns-production"
  ```

- **Project** - a project that groups various applications; it also defines what types of resources can be managed within the project and in which namespaces.

  Example of an Argo CD project under which all Argo components fall:

  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: AppProject
  metadata:
    annotations:
      argocd.argoproj.io/sync-options: PruneLast=true
      argocd.argoproj.io/sync-wave: "1"
    name: argo
    namespace: argocd
  spec:
    clusterResourceWhitelist:
      - group: "*"
        kind: "*"
    description: argo project
    destinations:
      - namespace: "*"
        server: "*"
    namespaceResourceWhitelist:
      - group: "*"
        kind: "*"
    sourceRepos:
      - "*"
  ```

- **ApplicationSet** - a collection of applications, i.e., one application installed multiple times. For example, for individual tenants or into multiple clusters.

  Example of an Argo CD ApplicationSet that deploys a Guestbook application to three clusters:

  ```yaml
  apiVersion: argoproj.io/v1alpha1
  kind: ApplicationSet
  metadata:
    name: guestbook
  spec:
    goTemplate: true
    goTemplateOptions: ["missingkey=error"]
    generators:
      - list:
          elements:
            - cluster: engineering-dev
              url: https://1.2.3.4
            - cluster: engineering-prod
              url: https://2.4.6.8
            - cluster: finance-preprod
              url: https://9.8.7.6
    template:
      metadata:
        name: "{{.cluster}}-guestbook"
      spec:
        project: my-project
        source:
          repoURL: https://git.example.com/infra-team/cluster-deployments.git
          targetRevision: HEAD
          path: guestbook/{{.cluster}}
        destination:
          server: "{{.url}}"
          namespace: guestbook
  ```

  A list of all generators and how to use them can be found in the [documentation](https://argo-cd.readthedocs.io/en/stable/operator-manual/applicationset/Generators/).

A popular alternative to Argo CD is [FluxCD](https://fluxcd.io/).

### How to Get Started with Argo CD?

First, you need to install Argo CD into the cluster.

There are several options: [Kustomize](https://kustomize.sigs.k8s.io/), [Helm](https://helm.sh/), or [Argo CD Autopilot](#argocd-autopilot) (which I cover later). Which tool you choose is up to your preference.

**Kustomize**:

```yaml
# kustomization.yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
namespace: argocd
resources:
  - https://raw.githubusercontent.com/argoproj/argo-cd/v2.7.2/manifests/install.yaml
```

**Helm**:

```yaml
# argocd-values.yaml
global:
  domain: argocd.example.com

certificate:
  enabled: true

server:
  ingress:
    enabled: true
    ingressClassName: nginx
    annotations:
      nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
      nginx.ingress.kubernetes.io/ssl-passthrough: "true"
    tls: true
```

```bash
helm repo add argo https://argoproj.github.io/argo-helm
helm repo update
helm install argocd argo/argo-cd --namespace argocd --create-namespace --values ./argocd-values.yaml
```

With that, Argo CD is in the cluster and we can add the first repository, create the first application,
and start deploying applications with Argo CD using GitOps.

You can add a repository via the `argocd` CLI (more on that later) or in the UI.
In the UI, add a repository in Settings > Repositories > +Connect Repository.

There you fill in the URL, username and password (or a token instead of a password), or you can use SSH.

After adding the repository, we create the first application that will point to our repository.

```yaml
# hello-world-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: hello-world
  namespace: argocd
spec:
  destination:
    namespace: default
    server: https://kubernetes.default.svc
  project: testing
  source:
    repoURL: https://git.example.com/our/repo
    targetRevision: HEAD
    path: hello-world
```

Since the application is a Kubernetes resource, we need to get it into the cluster, which we do with `kubectl`.

```bash
kubectl apply -f hello-world-app.yaml
```

And in the Argo CD UI we should now see our **hello-world** application!

To avoid having to add each application individually to the cluster via `kubectl`,
a so-called **app-of-apps** pattern is used -- an application of applications.

This is an Argo CD application that points to a repository and a directory where all manifests of all applications are stored.

But then you need to use finalizers so that when an application is removed, it gets deleted from the cluster. Or conversely,
so that nothing is deleted automatically, preventing potential mistakes and problems.

Such an **app-of-apps** typically looks something like this:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: app-of-apps
  namespace: argocd
  annotations:
    argocd.argoproj.io/sync-wave: "-1"
spec:
  project: cd
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
  source:
    path: apps/
    directory:
      # recurse=true, as the name suggests, means Argo CD looks for manifests in all subdirectories
      # which can sometimes be useful
      recurse: true
    repoURL: git@gitlab.example.com:infra/gitops.git
    targetRevision: HEAD
  destination:
    server: "https://kubernetes.default.svc"
    namespace: default
```

If we want to better organize things in the Argo CD UI -- which is a good idea with a larger number of applications,
or if you're deploying dedicated application instances for individual tenants -- it's good to use projects.

```yaml
apiVersion: argoproj.io/v1alpha1
kind: AppProject
metadata:
  name: testing
  namespace: argocd
spec:
  description: Testing project
  destinations:
    - namespace: "*"
      server: "*"
  sourceRepos:
    - "*"
  clusterResourceWhitelist:
    - group: "*"
      kind: "*"
  namespaceResourceWhitelist:
    - group: "*"
      kind: "*"
```

In a project, among other things, we define which clusters, _namespaces_, and which types of _resources_ the applications in the project can manage.
This lets us globally prohibit _ClusterRole_ resources, for example.
And using [Kyverno](https://kyverno.io/), inject _ResourceQuota_ and _NetworkPolicy_ into every _namespace_
to limit permissions and prevent individual instances from interacting with each other.

### Argo CD CLI

[`argocd`](https://argo-cd.readthedocs.io/en/stable/cli_installation/) is a CLI (command-line) tool that makes working with Argo CD easier. You can use it to create applications, projects, get information about applications, manage clusters in Argo CD, manage repositories (Git, Helm, ...), and more.

If you're a terminal enthusiast, definitely check out `argocd`. It's a great tool that lets you get started with Argo CD in just a few minutes without having to learn CRDs and write them manually --
though today ChatGPT or GitHub Copilot can help you with that quite quickly.

1. Port-forward to the Argo CD _Service_

   ```bash
   kubectl port-forward svc/argocd-server -n argocd 8080:443
   ```

2. Get the default password for the `admin` user

   ```bash
   argocd admin initial-password -n argocd
   ```

3. Open your web browser and go to
   `http://localhost:8080` and log in

### Argo CD Autopilot

[Argo CD Autopilot](https://argocd-autopilot.readthedocs.io/en/stable/) is a CLI tool
that helps you quickly deploy Argo CD to a cluster and then manage all applications, projects, etc.
Argo CD Autopilot has an opinionated view of what the Git repository that Argo CD watches should look like
and handles the repository structure (directories, files, applications, projects, ...).

So it can greatly simplify your work -- you don't have to think about where things belong, as Argo CD Autopilot handles that for you.
On the other hand, like any opinionated tool, it's not very flexible and its approach may not suit you.

```bash
# A Git token is needed for repository access
# Where you get the token depends on your Git server
# GitHub - Personal Access Token under your account: Settings > Developer Settings > Classic Token
# GitLab - Personal Access Token or group Deploy Token
export GIT_TOKEN="xxx"

# HTTPS path to the repository
export GIT_REPO=https://gitlab.example.com/<group>/<repo>

# Bootstrap Argo CD into the cluster and set up the repository
# Note: argocd-autopilot automatically pushes to the repository
argocd-autopilot repo bootstrap
```

In Argo CD you'll then see three applications:

- **autopilot-bootstrap** - the bootstrap of the entire Autopilot and Argo CD
- **argo-cd** - the Argo CD deployment via Kustomize from the `bootstrap/argo-cd/` directory
- **root** - the application that encompasses all projects;
  by default there are no projects and the `projects/` directory contains only an empty "dummy" file

```bash
# create a new project
argocd-autopilot project create testing

# create a new application
argocd-autopilot app create hello-world \
  --app github.com/argoproj-labs/argocd-autopilot/examples/demo-app/ \
  -p testing \
  --wait-timeout 2m
```

### Argo CD Image Updater Plugin

[Argo CD Image Updater](https://argocd-image-updater.readthedocs.io/en/stable/) handles automatic watching of Docker/OCI registries
to check whether a new image version matching, for example, a regular expression is available.

If a new _image_ is available, it automatically modifies the Argo CD application manifest, triggering an automatic deployment of the new version.
It also makes a _commit_ to the Git repository to keep everything up to date.

It's a simple and straightforward solution, but it's actually too simple and you can't do more complex things with it.
If you want something more sophisticated, check out [Kargo](#kargo).

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  annotations:
    # All you need is this annotation on the Argo CD application
    # and the Image Updater plugin installed and configured -- everything then works automatically (automagically :D)
    argocd-image-updater.argoproj.io/image-list: gcr.io/heptio-images/ks-guestbook-demo:^0.1
    # to update the Git repository, you also need to add this annotation:
    argocd-image-updater.argoproj.io/write-back-method: git
    # alternatively, the value `argocd` is available -- in that case no push (write-back) to the repository is made
    # and changes are kept only in Argo CD, which goes against the GitOps principle: what's in the repo is deployed
  name: guestbook
  namespace: argocd
spec:
  destination:
    namespace: guestbook
    server: https://kubernetes.default.svc
  project: default
  source:
    path: helm-guestbook
    repoURL: https://github.com/argocd-example-apps/argocd-example-apps
    targetRevision: HEAD
```

### Kargo

![kargo-guestbook-screenshot.png](https://cdn.mares.cz/kargo_guestbook_screenshot_6a67ec4003.png)
_Kargo screenshot for the demo "guestbook" application_

[Kargo](https://kargo.akuity.io/) is an open-source project from Akuity that builds on Argo CD and Rollouts and aims to fill the missing link
in the chain of delivering software from Git to production.

Kargo builds its own "pipelines" that handle deploying an application to environments (_stages_) and also the progressive promotion of individual versions (_freight_)
across environments.

Thanks to Kargo we also get a very nice visualization of which version of the application is currently in which environment.

Let's break down the individual Kargo concepts:

- **Project** - A Project is a set of related _resources_ within Kargo that describe one or more pipelines and is the fundamental unit in Kargo

- **Stage** - Often it's an environment, but to avoid confusion, Kargo defines the term _Stage_, which relates primarily to purpose rather than location.
  _Stage_ is the most important concept in Kargo; individual _Stages_ are linked together (but must not form a cycle!). Typically it starts with **test** or **dev** and ends at **prod**.

- **Freight** - This is the second most important concept in Kargo. "A single piece of freight" is a set of references to one or more versioned artifacts.

  Such artifacts are:
  - Images in a repository (e.g., Docker Hub)
  - Kubernetes manifests (in a Git repository)
  - Helm charts (in a Helm chart or OCI repository)

  _Freight_ is thus a set of references to these artifacts that make up one version of the application,
  which progresses through individual _Stages_.

- **Warehouse** - The source of _Freights_. A _Warehouse_ watches one or more image repositories, Git repositories, or Helm repositories. When it finds a new version, a new _Freight_ is created.

- **Promotion** - A request to move a _Freight_ from one _Stage_ to another. A _Promotion_ can be automatic or manual.

Kargo then uses Argo CD **ApplicationSets** to create applications for individual _Stages_:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: kargo-demo
  namespace: argocd
spec:
  generators:
    - list:
        elements:
          - stage: test
          - stage: uat
          - stage: prod
  template:
    metadata:
      name: kargo-demo-{{stage}}
      annotations:
        kargo.akuity.io/authorized-stage: kargo-demo:{{stage}}
    spec:
      project: default
      source:
        repoURL: ${GITOPS_REPO_URL}
        targetRevision: stage/{{stage}}
        path: stages/{{stage}}
      destination:
        server: https://kubernetes.default.svc
        namespace: kargo-demo-{{stage}}
      syncPolicy:
        syncOptions:
          - CreateNamespace=true
```

Then we create all the necessary _resources_, namely _Stages_, _Project_, and _Warehouse_:

```yaml
# kargo-demo.yaml
apiVersion: kargo.akuity.io/v1alpha1
kind: Project
metadata:
  name: kargo-demo
---
apiVersion: v1
kind: Secret
type: Opaque
metadata:
  name: kargo-demo-repo
  namespace: kargo-demo
  labels:
    kargo.akuity.io/cred-type: git
stringData:
  repoURL: ${GITOPS_REPO_URL}
  username: ${GITHUB_USERNAME}
  password: ${GITHUB_PAT}
---
apiVersion: kargo.akuity.io/v1alpha1
kind: Warehouse
metadata:
  name: kargo-demo
  namespace: kargo-demo
spec:
  subscriptions:
    - image:
        repoURL: public.ecr.aws/nginx/nginx
        semverConstraint: ^1.26.0
        discoveryLimit: 5
---
apiVersion: kargo.akuity.io/v1alpha1
kind: Stage
metadata:
  name: test
  namespace: kargo-demo
spec:
  requestedFreight:
    - origin:
        kind: Warehouse
        name: kargo-demo
      sources:
        direct: true
  promotionMechanisms:
    gitRepoUpdates:
      - repoURL: ${GITOPS_REPO_URL}
        writeBranch: stage/test
        kustomize:
          images:
            - image: public.ecr.aws/nginx/nginx
              path: stages/test
    argoCDAppUpdates:
      - appName: kargo-demo-test
        appNamespace: argocd
---
apiVersion: kargo.akuity.io/v1alpha1
kind: Stage
metadata:
  name: uat
  namespace: kargo-demo
spec:
  requestedFreight:
    - origin:
        kind: Warehouse
        name: kargo-demo
      sources:
        stages:
          - test
  promotionMechanisms:
    gitRepoUpdates:
      - repoURL: ${GITOPS_REPO_URL}
        writeBranch: stage/uat
        kustomize:
          images:
            - image: public.ecr.aws/nginx/nginx
              path: stages/uat
    argoCDAppUpdates:
      - appName: kargo-demo-uat
        appNamespace: argocd
---
apiVersion: kargo.akuity.io/v1alpha1
kind: Stage
metadata:
  name: prod
  namespace: kargo-demo
spec:
  requestedFreight:
    - origin:
        kind: Warehouse
        name: kargo-demo
      sources:
        stages:
          - uat
  promotionMechanisms:
    gitRepoUpdates:
      - repoURL: ${GITOPS_REPO_URL}
        writeBranch: stage/prod
        kustomize:
          images:
            - image: public.ecr.aws/nginx/nginx
              path: stages/prod
    argoCDAppUpdates:
      - appName: kargo-demo-prod
        appNamespace: argocd
```

To get these _resources_ into the cluster, we use the `kargo` CLI, not kubectl!:

```bash
kargo apply -f kargo-demo.yaml
```

After that, you should see something similar to the screenshot above in the Kargo dashboard.

Kargo is powerful but complex. If you're interested in learning more, I recommend trying their demos [kargo-simple](https://github.com/akuity/kargo-simple) and [kargo-advanced](https://github.com/akuity/kargo-advanced) on GitHub -- covering it here would fill a standalone blog post or more.
If you'd be interested in that, tweet at [@vojtechmares\_](https://x.com/vojtechmares_) on Twitter/X.
