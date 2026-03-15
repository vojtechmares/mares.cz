---
title: Helm vs Kustomize vs YAML
description: There are several ways to deploy applications to a Kubernetes cluster — in this article, we'll look at three major ones.
keywords: ["kubernetes", "deployment", "helm", "kustomize", "yaml"]
tags: ["kubernetes"]
trainingAd: kubernetes
draft: false
publish_time: 2024-10-01
---

There are several ways to deploy applications to a Kubernetes cluster — in this article, we'll look at three major ones.

## YAML

> YAML is a human-friendly data serialization
> language for all programming languages.

[YAML](https://yaml.org/) is a human-readable data serialization format for all programming languages.

In Kubernetes, YAML is practically everywhere — from cluster configuration to application deployment.
But that's not the only place where YAML is popular; it has spread elsewhere too. For example, in CI/CD pipeline definitions.

Here is an example of a deployment in YAML:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.14.2
          ports:
            - containerPort: 80
```

YAML as such is a fairly clean and readable way to get applications into Kubernetes,
but since it's just a text file, it lacks any flexibility.
If we want to deploy using YAML, we either need to generate YAML, override it based on a hierarchy, or template YAML files.
And that's where Kustomize and Helm come in.

Something worth knowing is that JSON is a subset of YAML. So any JSON text
inserted into a YAML file is a valid YAML file.

However, be careful with indentation in YAML. YAML is extremely sensitive to spaces and indentation.
With an incorrect structure, it can cause quite a headache. If you don't like Python because of indentation,
YAML probably won't be your favorite either.

When working with YAML, you might also find the [yq](https://mikefarah.gitbook.io/yq/) tool handy, which allows you
to work with YAML objects on the command line.

For example, getting a value from a YAML file:

```bash
yq eval '.spec.replicas' deployment.yaml
```

If we use the previous example as `deployment.yaml`, we get the value `3`.

`yq` is an alternative to `jq`, which works with JSON — that might come in handy too.

To apply plain YAML manifests, we use `kubectl`:

```bash
kubectl apply -f deployment.yaml
```

## Kustomize

[Kustomize](https://kustomize.io/) is a tool that allows you to declaratively modify YAML files.
We still have static YAML files, but we can now create different variants of applications from a single source.

Kustomize has been part of `kubectl` since version **1.14**, but it can also be used standalone.

Kustomize works with a directory structure where the root directory contains a `kustomization.yaml` file
that holds information about which files to modify/override and how.

Kustomize essentially does nothing more than override YAML — a map of keys and values through hierarchical file loading.

Example of a `kustomization.yaml` file in the `base` directory:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization

resources:
  - configmap.yaml
  - deployment.yaml
  - ingress.yaml
  - service.yaml
```

Example of a `kustomization.yaml` file in the `overlays/production` directory:

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
bases:
  - ../../base
patchesStrategicMerge:
  - ingress.yaml
```

When using Kustomize, the following structure is typically followed:

```tree
.
├── base
|   ├── configmap.yaml
│   ├── deployment.yaml
|   ├── ingress.yaml
│   ├── service.yaml
│   └── kustomization.yaml
└── overlays
    ├── production
    |   ├── ingress.yaml
    │   └── kustomization.yaml
    └── staging
        ├── ingress.yaml
        └── kustomization.yaml
```

- The `base` directory contains the base configuration of the application we want to deploy.
  That means all the manifests that make up the application.

- The `overlays` directory contains different variants of either all or just some of the manifests
  that we want to modify or add.

If you want to check the resulting YAML manifest without applying it to the cluster,
you can use the following command:

```bash
kustomize build overlays/production
```

You can manually review the output in the command line or save it to a file and review it in an editor, or automatically
in a CI/CD pipeline using a tool such as [`kubeconform`](https://github.com/yannh/kubeconform) or [Kyverno](https://kyverno.io/).

Then, using `kubectl apply` with the `-k` flag, we can apply Kustomize files:

```bash
kubectl apply -k overlays/production
```

## Helm

[Helm](https://helm.sh/) takes a different approach to YAML files.
Since Helm is written in [Go](https://go.dev/), it uses Go templates to inject values
into YAML that we provide, and then renders the final YAML manifest, which it sends to the Kubernetes cluster
based on the context in our kubeconfig.

Because YAML is sensitive to indentation and whitespace in general,
many people dislike or outright hate Helm (just check Twitter/X).
In my opinion, it's a matter of getting used to it, but with more complex Helm charts (i.e., packages) and especially YAML templating,
it's not as clean as plain YAML.

On the other hand, Helm is, in my view, a great tool for delivering applications to third-party customers.
In this regard, Helm is much easier to distribute and use than Kustomize or plain YAML.
And thanks to Helm's integration into virtually all [GitOps](/en/blog/gitops-a-argocd) tools (such as [Argo CD](https://argoproj.github.io/cd/) or [FluxCD](https://fluxcd.io/)),
using them is not a problem either.

What is somewhat problematic with Helm is working with Custom Resource Definitions (CRDs),
which Helm can manage, but the solution isn't ideal.
Helm offers CRD support through the `crds` folder, but the problem arises during updates or uninstallation of a Helm chart,
where CRDs are neither updated nor uninstalled. A hack/workaround is to put them in the `templates` folder,
but that's not an ideal solution given the nature of CRDs.

Helm is a command-line tool (unless you're using GitOps), so typical usage looks like this:

```bash
# if installing a Helm chart from a local directory:
# helm install <release name> <path>
helm install mychart ./mychart

# if installing a Helm chart from a Helm registry:
# 1. add Helm registry
# helm repo add <repository name> <repository URL>
helm repo add myrepo https://myrepo.com/charts
# 2. update repository
helm repo update
# 3. install Helm chart
# helm install <release name> <chart name>
helm install mychart myrepo/mychart

# alternatively, it's possible (and from experience, better) to use
# helm upgrade --install <release name> <chart name>
helm upgrade --install mychart myrepo/mychart

# uninstall Helm chart
helm uninstall mychart
```

If you're googling information about Helm, only look for Helm 3.x, which is the current and supported version.

### Helm chart

A Helm chart is a package that holds all the manifests and also contains a `values.yaml` file,
which describes what values can be injected into the Helm chart.

Since YAML doesn't have a defined schema for how a file should look (what values and keys should be, etc.),
the community started creating [JSON schemas](https://json-schema.org/) for YAML files to validate what values can be inserted.
These JSON schemas can also be used by IDEs that support schemas, such as [Visual Studio Code](https://code.visualstudio.com/).

A Helm chart consists of several parts:

- `charts` — a folder where you can include additional Helm charts that your application needs (optional).
- `templates` — a folder containing Go templates that render the final YAML manifest.
- `values.yaml` — a file containing the default values for the Helm chart.
- `Chart.yaml` — a file containing metadata about the Helm chart, such as version, name, description, etc.
- `Chart.lock` — a file containing dependencies on other Helm charts (optional); it "locks" specific versions for compatibility and build immutability.

The JSON schema for `values.yaml` is merely a community convention and doesn't have a clearly defined name, but it's usually called `values.schema.json`.

And the Helm chart directory structure may look like this:

```tree
.
├── charts
├── templates
│   ├── _helpers.tpl
│   ├── configmap.yaml
│   ├── deployment.yaml
│   ├── ingress.yaml
│   └── service.yaml
├── values.yaml
├── Chart.yaml
└── Chart.lock
```

### Helm registry

To share and install Helm charts, there is the [Helm registry](https://artifacthub.io/), or you can run your own,
or today you can also use [OCI registries](https://helm.sh/docs/topics/registries/).

A Helm registry is essentially a directory of Helm charts that holds both an index and all versions of Helm charts.

When uploading a Helm chart to a registry, the chart is packed into a tarball and then uploaded to the registry.
Depending on the registry server, an index (`index.yaml`) containing information about all Helm charts is created automatically,
or it needs to be generated manually.

If you want your own self-hosted registry, you can use [Harbor](https://goharbor.io/) or **GitHub Pages**, for example.

### Helm templating

As I wrote above, Helm uses Go templates that allow injecting values into YAML manifests.

Example of a `deployment.yaml` file with Helm templating:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-deployment
spec:
  replicas: {{ .Values.replicas }}
  selector:
    matchLabels:
      app: {{ .Release.Name }}
  template:
    metadata:
      labels:
        app: {{ .Release.Name }}
    spec:
      containers:
      - name: {{ .Release.Name }}
        image: {{ .Values.image }}
        ports:
        - containerPort: {{ .Values.port }}
```

Helm has several "global" variables — `Chart`, `Release`, and `Values` — that provide access to various data.
In templates, you can also use a number of functions like `trim`, `toYaml`, and others (see the [documentation](https://helm.sh/docs/chart_template_guide/getting_started/)).
Or conditionally include parts of the manifest using `if` and `else` blocks.

Another important part of Helm are `define` blocks, which allow you to create custom functions and thus simplify templates.
These templates are typically stored in the `templates/_helpers.tpl` file.

Example of a `_helpers.tpl` file:

```go
{{- define "mychart.labels" -}}
labels:
  app: {{ .Release.Name }}
{{- end -}}
```

And then in the `deployment.yaml` file:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-deployment
spec:
  replicas: {{ .Values.replicas }}
  selector:
    matchLabels:
      app: {{ .Release.Name }}
  template:
    metadata:
      {{ include "mychart.labels" . }}
    spec:
      containers:
      - name: {{ .Release.Name }}
        image: {{ .Values.image }}
        ports:
        - containerPort: {{ .Values.port }}
```

## Other Approaches

YAML, Helm, and Kustomize are not the only ways to deploy applications to Kubernetes.

### jsonnet

[Jsonnet](https://jsonnet.org/) is another templating language that can generate JSON and YAML files.
I personally don't have much experience with it, but it's another very popular tool for working with Kubernetes manifests.

### Terraform

[Terraform](https://www.terraform.io/), which I wrote about in [this article](/en/blog/terraform-infrastruktura-jako-kod), is also an option for deploying applications to a Kubernetes cluster.

Specifically, using the [Kubernetes provider](https://registry.terraform.io/providers/hashicorp/kubernetes/latest/docs), we can create and manage resources in a Kubernetes cluster.
Individual _resources_ are then native _Terraform resources_ in HCL (HashiCorp Configuration Language).

Example of an NGINX deployment in Terraform:

```hcl
resource "kubernetes_deployment" "nginx" {
  metadata {
    name = "nginx-deployment"
  }

  spec {
    replicas = 3

    selector {
      match_labels = {
        app = "nginx"
      }
    }

    template {
      metadata {
        labels = {
          app = "nginx"
        }
      }

      spec {
        container {
          image = "nginx:1.14.2"
          name  = "nginx"

          port {
            container_port = 80
          }
        }
      }
    }
  }
}
```

Or you can use the community [kubectl provider](https://registry.terraform.io/providers/gavinbunney/kubectl/latest/docs), which doesn't manage resources in HCL but directly applies YAML files.
Another useful provider is the [Helm provider](https://registry.terraform.io/providers/hashicorp/helm/latest/docs), which allows managing Helm charts
through Terraform.

```hcl
resource "helm_release" "nginx" {
  name       = "nginx"
  repository = "https://charts.bitnami.com/bitnami"
  chart      = "nginx"
  version    = "8.9.0"

  set {
    name  = "replicaCount"
    value = "3"
  }
}
```

### Operators

A [Kubernetes Operator](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/) is technically an application
that builds on existing Kubernetes APIs and resources in its code and creates abstractions on top of them.
In general, they extend Kubernetes capabilities and allow automating operations that would otherwise be manual.

An operator, in order to create its resources — so-called Custom Resources (CR) — uses Custom Resource Definitions (CRDs),
which describe to Kubernetes what the resources managed by the operator look like. The operator then runs a controller
that manages these resources.

But all CRD and CR definitions are again typically in YAML, or we can manage them through Kustomize or Helm.
So it doesn't really help us that much.
