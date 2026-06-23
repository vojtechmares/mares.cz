---
title: Docker and the Dominance of Backend Containerization
description: In this article, I'll cover the history of containers, application containerization, and the history of container orchestration.
keywords:
  ["docker", "container", "backend", "kubernetes", "docker swarm", "apache mesos", "hashicorp nomad", "12factor app"]
tags: ["kontejnery", "kubernetes"]
trainingAd: docker
draft: false
publish_time: 2024-09-10
redirectFrom: ["docker-a-dominance-kontejnerizace-backendu"]
alternate: "docker-a-dominance-kontejnerizace-backendu"
---

In this article, I'll cover the history of containers, application containerization, and the history of container orchestration.

## What Is a Container?

Before we can talk about anything else, let's recall what a container actually is.

A container is a package that contains an application and all its dependencies.
When we run a containerized application, the engine or runtime (such as Docker)
ensures that the application process runs in isolation from other processes on the host machine.
By isolation we mean separation of the filesystem, network interfaces (each container has its own `localhost`), and processes.
It also allows us to limit how many resources (CPU, RAM, disk) a container can use.

### Glossary

In this article, I'll use several terms in both Czech and English. Because these terms are often overloaded
and have many meanings, I'd like to define how I'll be using them:

- **container** - an instance of a container (a running application)
- **image** - a container image, i.e., a template from which a container is created, also known as an artifact
- **build** - the process of creating a container image (how to create an image from application source code)
- **runtime** or **engine** - a process running on the host machine that handles starting, stopping, restarting, configuring, etc. of containers (running processes)
- **registry** - a place where container images are stored, both public and private
- **Open Container Initiative (OCI)** - a container standardization effort created by Docker, CoreOS, and others to enable easy portability of containers between different runtimes (engines)
- **OCI specification** - the specification, i.e., the defined image format
- **CRI specification** (Container Runtime Interface) - a specification for how an orchestrator (e.g., Kubernetes) can communicate with a runtime (engine)
- **orchestration** - management and running of containers across multiple hosts, i.e., a tool for managing and running containers across multiple hosts

## The Power of Containers

As I mentioned, containers solve application isolation from the host machine, but that's not all.

Thanks to containers and their build process, which can be run again and again anywhere with the same result,
containers have become a universal solution to the "It works on my machine" problem.

![docker-was-born.jpeg](https://cdn.mares.cz/docker_was_born_0a36fc3f36.jpeg)

### So What Are the Advantages?

- builds can be performed repeatedly with the same result (deterministic build)
- a container is isolated, so it cannot affect other containers or the host machine
- reusability: you can run a container as many times and wherever you want (provided you have enough resources)
- ubiquity: it's a well-known concept today and has become the de facto standard for building applications (of course, there are exceptions)
- distribution: thanks to specifications for what an image should look like (such as OCI), it's easy to upload, store, and download images practically anywhere -- all you need is internet access

## Docker

![Docker Inc. logo](https://cdn.mares.cz/docker_logo_blue_c2bfc3ed50.png)

[Docker](https://www.docker.com/) is: a project, a company, a container runtime (engine), a build tool, an image registry, and an orchestration tool.

That's a lot for one word, so let's break it down:

- Docker container & image - the basics, what we typically mean when we talk about Docker and containers. That is, images and containers as described above -- running processes

- Docker Inc. - the company behind the Docker project.

- [Docker Hub](https://hub.docker.com/) - the largest public image registry, the typical place where open-source projects publish their images

- [Docker Engine](https://docs.docker.com/engine/) - the runtime that runs on the host machine and handles starting, stopping, restarting, configuring, etc. of containers (running processes); it can also create container images, i.e., build

- [Docker Compose](https://docs.docker.com/compose/) - a tool for defining and running multi-container applications, i.e., applications composed of multiple containers

- [Docker Swarm](https://docs.docker.com/engine/swarm/) - container orchestration, i.e., a tool for managing and running containers across multiple hosts; today it's largely declining and has been practically overtaken by [Kubernetes](https://kubernetes.io/)

## Alternatives to Docker

- [Podman](https://podman.io/) - a Docker replacement that doesn't need to run as a daemon, so root access isn't required

- [Orbstack](https://orbstack.dev/) (macOS only) - a Docker replacement with better macOS integration

- [Linux Containers (LXC)](https://linuxcontainers.org/) (and LXD) - OS-level virtualization, i.e., containers but without Docker; now supports OCI; natively supported in [Proxmox](https://www.proxmox.com/en/proxmox-virtual-environment/overview) and [OpenStack](https://www.openstack.org/), for example

## Image Name and Tag

Every image has its own name, which is used, for example, to choose the registry where we want to push the image.
And a tag is an identifier for a specific build. It can be a git commit hash, a git tag, or something else.

Images without a registry prefix are automatically pulled from [Docker Hub](https://hub.docker.com), which is treated as the default registry.

Other public registries include [Quay.io](https://quay.io/) and [GitHub Container Registry (ghcr.io)](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

To push to GHCR, for example, the image name must contain its URL: `ghcr.io/vojtechmares/container-images/cikit`.

A build and push would then look like this:

```sh
export TAG="some-tag"

docker build -t ghcr.io/vojtechmares/container-images/cikit:$TAG .
docker push ghcr.io/vojtechmares/container-images/cikit:$TAG
```

### Tag

Tags are used to version individual builds. If you don't specify a tag, `latest` is used by default.

For development versions, a git commit hash is typically sufficient, but for production versions I recommend using a version number, such as a git tag,
so it's clear which version of the source code a specific image corresponds to. While a commit hash also satisfies this requirement,
people typically don't remember them very well.

For better clarity, I use the format `$BRANCH-$SHORT_COMMIT_HASH` for development versions, e.g., `main-09a682bf`.
And for releases, a version with a `v` prefix, e.g., `v1.17.4`.

This makes it easy to set up rules in GitLab for deleting old tags so they don't take up space, while keeping all release versions.

And for build and push in GitLab CI, my pipeline looks like this:

```yaml
stages:
  - build
  # ...

build:docker:
  stage: build
  image: docker:git
  services:
    - docker:dind
  variables:
    IMAGE: $CI_REGISTRY_IMAGE
    TAG: $CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
    - docker info
  script:
    - docker buildx create --name website --use
    - docker buildx build --provenance=false --platform linux/amd64,linux/arm64 -t $IMAGE:$TAG --push .
    - docker manifest inspect $IMAGE:$TAG
# ...
```

If you don't want to use `services`, you can configure the runner to have the Docker socket available directly.
However, this carries a security risk and such a configuration should be carefully considered.
I'll write more about GitLab CI some other time. If you're interested in such configuration, check the [GitLab documentation](https://docs.gitlab.com/ee/ci/docker/using_docker_build.html).

## Efficient Container Builds

Containers are nice and you can stuff everything into a single `Dockerfile` and be done with it, nothing fancy.
That's one way to go, but not a very optimal one. You can work more effectively with `Dockerfile` or use other tools
to build images so the result is as small as possible.

- `Dockerfile` - a file describing how the container should be built
  Example for Node.js:

  ```dockerfile
  # syntax=docker/dockerfile:1
  FROM node:lts

  WORKDIR /app

  COPY package*.json ./

  RUN npm install

  COPY . .

  RUN npm run build

  CMD ["node", "index.js"]
  ```

  And building:

  ```sh
  # the `Dockerfile` must be in the current directory
  docker build -t $IMAGE:$TAG .
  ```

- **multi-stage `Dockerfile`** - a technique where we create multiple images, each meant for one part of the application (e.g., build, test, runtime)

  Example of a multi-stage `Dockerfile` for Node.js that I use to build this website:

  ```dockerfile
  # syntax=docker/dockerfile:1
  FROM node:20-alpine AS base

  # 1. Install dependencies only when needed
  FROM base AS deps
  # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
  RUN apk add --no-cache libc6-compat

  WORKDIR /app

  # Install dependencies based on the preferred package manager
  COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
  RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i; \
    else echo "Lockfile not found." && exit 1; \
    fi

  # 2. Rebuild the source code only when needed
  FROM base AS builder
  WORKDIR /app
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  # This will do the trick, use the corresponding env file for each environment.
  # COPY .env.production.sample .env.production
  RUN npm run build

  # 3. Production image, copy all the files and run next
  FROM base AS runner
  WORKDIR /app

  ENV NODE_ENV=production

  RUN addgroup -g 1001 -S nodejs
  RUN adduser -u 1001 -S nextjs

  COPY --from=builder /app/public ./public

  # Automatically leverage output traces to reduce image size
  # https://nextjs.org/docs/advanced-features/output-file-tracing
  COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
  COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
  COPY --from=builder --chown=nextjs:nodejs /app/images ./images

  USER nextjs

  EXPOSE 3000

  ENV PORT=3000
  # ENV HOSTNAME=0.0.0.0

  CMD node server.js
  ```

  Thanks to splitting into multiple stages and copying only the essentials, the final image is under 90 MB including images, compared to the original 500 MB when I started with a plain `node:lts` image.

### Optimizing the Final Image

- **multi-stage build** - the final image contains only the application build and necessary dependencies; for example, tests can be excluded

- **Alpine vs Debian** - changing the base image can save tens of MB; for example, Alpine is an excellent choice, but watch out for compatibility: Alpine is built on musl, while Debian uses glibc; if you need glibc, consider `debian-slim`

- **distroless** - an absolutely minimalist image, without a shell (bash, sh, ...) or other system tools; it contains only DNS resolver configuration and glibc, but the application needs to be self-sufficient, or you can use a distroless base specifically for Node.js or JVM

- **alternatives** - language-specific tools (ko.build, Jib, ...) that create an image from source code and handle both the application build and the image itself, eliminating the need for a `Dockerfile`; this is very convenient but you lose some control over the build process

### Docker buildx

[Docker buildx](https://docs.docker.com/buildx/working-with-buildx/) is a tool that enables building images for multiple platforms (amd64, arm64, armv7, ppc64le, s390x, ...), for example for Raspberry Pi, but also for cloud environments running a different architecture than the development machine.

It's a great way to build so-called multi-platform images for multiple architectures without needing to build on target machines.

Example build using `docker buildx`:

```sh
# create a buildx builder instance
docker buildx create --name website --use

# the actual build with the --platform flag
docker buildx build --platform linux/amd64,linux/arm64 -t $IMAGE:$TAG --push .
```

## Build Tools

Because the container ecosystem has been booming for several years, the number of tools
to help us create container images has also grown.

- Docker & Dockerfile - the most common way to create images; unfortunately Docker isn't the fastest (especially on macOS); for building, the Docker daemon needs to run as root and the build user must have access to the Docker socket (i.e., broad permissions), which is quite a security risk

- [Kaniko](https://github.com/GoogleContainerTools/kaniko) - an open-source tool from Google that can build images on Kubernetes without requiring a privileged container; the resulting image is OCI-compatible, though it tends to be a few MB larger than with Docker

- [Buildah](https://buildah.io/) - a tool for building OCI images; it's an independent open-source tool and an interesting Docker alternative

- [Podman](https://podman.io/) - an open-source Docker alternative that is fully compatible -- you can alias `docker` to `podman` -- but without needing to run as root, which is great for security; Podman is strongly supported by Red Hat and is therefore often seen in their ecosystem from Fedora through RHEL to Fedora CoreOS

- [Buildpacks](https://buildpacks.io/) - an open-source [CNCF](https://www.cncf.io/) project that originated from Heroku Buildpacks; it creates an image from source code rather than a Dockerfile, which is great for developers who don't want to deal with Dockerfiles but want an efficient and small image; on the other hand, Buildpacks have certain limitations and aren't as flexible as `Dockerfile`

- Language-specific tools
  - [ko.build](https://ko.build/) (Golang) - a simple open-source application that creates an image from a Go application; just point it at `main.go` and it handles the rest; configuration is only via environment variables which can be a bit clunky in the terminal, but it's a great CI tool

  - [Jib](https://github.com/GoogleContainerTools/jib) (Java) - essentially ko but for Java

## 12-Factor App

[12-factor app](https://12factor.net/) is a methodology for writing modern applications that are easily scalable and deployable to the cloud.

The twelve factors that make up a "12-factor app":

> 1. Codebase - One codebase tracked in revision control, many deploys
> 2. Dependencies - Explicitly declare and isolate dependencies
> 3. Config - Store config in the environment
> 4. Backing services - Treat backing services as attached resources
> 5. Build, release, run - Strictly separate build and run stages
> 6. Processes - Execute the app as one or more stateless processes
> 7. Port binding - Export services via port binding
> 8. Concurrency - Scale out via the process model
> 9. Disposability - Maximize robustness with fast startup and graceful shutdown
> 10. Dev/prod parity - Keep development, staging, and production as similar as possible
> 11. Logs - Treat logs as event streams
> 12. Admin processes - Run admin/management tasks as one-off processes

Why do I bring up 12-factor? Thanks to containers, it has become incredibly easy to follow this methodology.
And thanks to its straightforwardness, the same applies to containerization -- they go hand in hand. At the same time, today's tools for running
containers, like Kubernetes, are designed to run applications exactly this way.

## Orchestration

The power of containers isn't just in their portability and universality. Containers have spread tremendously thanks to the development of orchestration tools --
software that manages running containers across multiple machines. Even across thousands of machines in a cluster!

One of the pioneers of container orchestration was Google, which in 2003 began building the internal tool Borg to manage all their clusters and run all their applications.
From Borg came the open-source project Kubernetes, which was founded at Google in 2014. I wrote more about the history of Kubernetes in the article [Why Kubernetes?](/en/blog/why-kubernetes#trochu-v%C3%ADc-historie).

Below I've expanded on popular orchestration tools, from managed services to solutions you can run yourself.

### Docker Swarm

Swarm was one of the first publicly available solutions for running containerized applications on multiple machines simultaneously.

It's a very simple tool, but it never really took off. If you want to run multiple containers on a single machine, Docker Compose is sufficient.
And for multiple machines, it's better to choose something else, like Kubernetes, which is more flexible and provides greater control and easy scalability.

### Apache Mesos

Mesos isn't exactly an orchestration tool; it could be better compared to a "datacenter operating system" that enables running various applications, including containers, on multiple machines simultaneously.

Mesos is a long-standing project that was created in 2009 with its first release in 2010. The project was nearly abandoned in 2021, but ultimately survived
due to its prevalence in legacy environments.

Today, however, it's more a matter of time before Mesos disappears from production environments entirely. For example, Apache Spark marked Mesos support as _deprecated_ in version 3.2 (2021) and support will be completely removed in the near future.

### HashiCorp Nomad

Nomad is a tool from HashiCorp that aims to be simple yet flexible enough to run both containerized and non-containerized applications,
whether on bare metal or in the cloud.

Nomad is fairly popular for its simplicity, but like all container orchestration tools, it has been overtaken by Kubernetes.

### Kubernetes

The best-known, most widespread, and practically the standard for container orchestration and operation. Both in the cloud and on your own machines.

As I mentioned, Kubernetes originates from Google's internal tool Borg, which was developed since 2003. In 2014, Kubernetes was born as an open-source project
that enables anyone to run applications on multiple machines simultaneously in containers.

Thanks to CNCF (Cloud Native Computing Foundation), a huge ecosystem has formed around Kubernetes and cloud-native applications and tools,
pushing this whole world forward.

**CNCF** is a non-profit organization under the [Linux Foundation](https://www.linuxfoundation.org/) that fosters the development of cloud-native technologies and tools.
Its current annual budget is over $150M, and thanks to a broad membership base of many companies, it is fairly immune to the demise of individual companies.
Therefore, its projects are safe in the long term and can be relied upon not to disappear overnight. All CNCF projects are also open-source under the Apache 2.0 license.

### Kamal

[Kamal](https://kamal-deploy.org/) (originally MRSK), created by [David Heinemeier Hansson](https://dhh.dk/), the creator of the Ruby on Rails framework and CTO of [37signals](https://37signals.com/).

Hansson created Kamal, which builds on Docker and a few bash scripts, across multiple machines. He was frustrated that all other tools are incredibly complicated and require entire teams
to maintain them, like Kubernetes. At the same time, with 37signals' departure from the cloud to their own hardware, he didn't want any crazy solution, so Kamal was born.

More about the Kamal story on the Hey blog: [Kamal 1.0](https://world.hey.com/dhh/kamal-1-0-5304ff9e).

In the Czech Republic, [Fakturoid](https://www.fakturoid.cz/) runs on Kamal, for example.

### Google Cloud Run

[Google Cloud Run](https://cloud.google.com/run) is a service from Google that enables running containerized applications on Google Cloud Platform.

Cloud Run is today built on Kubernetes and [Knative](https://knative.dev/docs/), so you could theoretically build it yourself on your own hardware, but that's not what Cloud Run is meant for.
Cloud Run instead handles all the problems of running containers for you. You just need to specify which image, how many replicas, and optionally scaling rules.

Cloud Run is a very convenient service for running containerized applications, but you also pay a premium for that convenience.

### AWS Fargate

[Fargate](https://aws.amazon.com/fargate/) is a service from Amazon that enables running containerized applications on AWS.
It is essentially an alternative to Google Cloud Run, but from Amazon.

Unlike Cloud Run, Fargate is built on [Firecracker](https://firecracker-microvm.github.io/), which is Amazon's technology for running so-called microVMs.
It is therefore full OS virtualization, but extremely optimized for speed. Firecracker is today the backend not only for Fargate but also for AWS Lambda.

### Fly.io

[Fly.io](https://fly.io/) is a newer player in the containerized application hosting space.
It offers a simple interface and is overall a very convenient service where you can easily spin up the database you need,
attach storage, etc. -- all in containers.

Fly.io doesn't bet on Kubernetes but on its own system built entirely from scratch in [Rust](https://www.rust-lang.org/), with networking built on [WireGuard](https://www.wireguard.com/).
