---
title: GitLab CI vs GitHub Actions
description: "An in-depth comparison of GitLab CI and GitHub Actions — covering pipelines, runners, and key features of both CI/CD platforms."
keywords: ["git", "ci", "runner", "gitlab ci", "github actions", "gitlab", "github"]
tags: ["continuous-integration"]
trainingAd: github-actions
draft: false
publish_time: 2024-09-16
alternate: "gitlab-ci-vs-github-actions"
---

In this article, I'll go in depth on the very popular CI/CD tools GitLab CI and GitHub Actions.
Not just from the pipeline perspective, but also runners and other features.

## GitLab vs GitHub

[GitHub](https://github.com/) and [GitLab](https://gitlab.com/) are tools and platforms for hosting Git repositories, and today they both offer solutions for automating
application testing and deployment, i.e., CI/CD. GitHub is currently the best-known and most popular platform and has become practically the home for nearly all open-source projects.

Probably the biggest difference is that GitHub is closed-source and a self-hosted instance is only available through GitHub Enterprise,
while GitLab is open-source and can be hosted on your own server without needing a license, though you can purchase one
for additional features.

GitHub offers paid features for individuals and companies (teams).
Meanwhile, GitLab's paid licenses are aimed only at companies (though nothing stops you from getting a license for yourself).

But that's not all these platforms offer today. Both GitHub and GitLab provide services for hosting packages
(NPM, Maven, Pip, NuGet, ...) as well as OCI images (Docker images). And other DevOps tools/integrations. But I'll either mention these features only briefly
or not at all, saving them for a future article.

Today another very popular GitHub service is GitHub Copilot, an AI tool that helps you write code. It's like your coding partner.
It sometimes makes things up, but it can save you work. GitLab came out roughly a year later with a similar tool, GitLab Duo Chat.

One last piece of information that may be important to some: GitHub is owned by Microsoft, while GitLab is an independent company, publicly traded on the stock exchange ([Nasdaq: GTLB](https://www.nasdaq.com/market-activity/stocks/gtlb)).

## What Is CI/CD?

CI/CD stands for Continuous Integration/Continuous Deployment (or Continuous Delivery).
It is the process of automatically testing and deploying code to production.
CI/CD is important for rapid application development and deployment.

CI is an essential part of the DevOps mindset -- it automates and ensures code quality on every change
pushed to the repository. At the same time, it gives us near-instant feedback on the state of the code.

CI today typically includes:

- running tests
- code quality checks
- application builds

CD then handles:

- deploying the application to environments (development, test, staging, production, ...)

### Continuous Deployment vs Continuous Delivery

These are two very similar terms that are often used interchangeably. But sometimes they mean different things.

Honestly, it doesn't matter much -- what matters is agreeing on whether both terms mean the same thing to you or not.
If they mean something different, the most common distinction I encounter is that one means fully automated deployment
and the other requires manual approval (e.g., clicking a button) before deployment proceeds.

## GitLab CI

The fundamental building blocks of GitLab CI are:

- **pipeline** - defines when it runs and what the default values are (`defaults`)
- **stage** - a phase in which jobs run
- **job** - a single task within a stage
- **include** (templates) - reusable pipeline parts, in different files, repositories, or even GitLab instances

A pipeline is always defined in the `.gitlab-ci.yml` file in the root directory of the repository. But you can then reference other files either in the same repository or another.
Or even on a different GitLab instance.

### GitLab CI Examples

Let's look at a simple example, for a JavaScript application:

```yaml
# .gitlab-ci.yml

defaults:
  image: node:lts

stages:
  - install
  - test
  - build
  - deploy

install:
  stage: install
  script:
    - npm ci
  # cache the node_modules folder for subsequent jobs in this pipeline
  cache:
    paths:
      - node_modules/
    # cache is invalidated when the package-lock.json file changes
    key:
      files:
        - package-lock.json

test:
  stage: test
  script:
    - npm run test

build:
  stage: build
  script:
    - npm run build

deploy:
  stage: deploy
  script:
    - ./scripts/deploy.sh
```

Such a pipeline is beautifully simple, but in the real world it won't be enough. For example, deploying to different environments --
say to a staging environment from the main branch and to production from a release branch.

For conditional job execution we can use `rules`:

```yaml
# .gitlab-ci.yml
# ...

deploy-staging:
  stage: deploy
  script:
    - ./scripts/deploy.sh staging
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy-production:
  stage: deploy
  script:
    - ./scripts/deploy.sh production
  rules:
    - if: $CI_COMMIT_BRANCH == "release"
```

Another useful feature is `before_script`:

```yaml
# .gitlab-ci.yml
# ...

before_script:
  - echo "Hello, world!"

test:
  stage: test
  script:
    - npm run test
```

`before_script` runs before every job in the pipeline when defined globally. But it can also be defined for specific jobs only.
If defined both globally and locally, only the local definition is used.

The last thing we'll look at is working with Docker:

```yaml
# .gitlab-ci.yml

defaults:
  image: docker:20.10

services:
  - docker:20.10-dind

stages:
  - build

build:
  stage: build
  variables:
    DOCKER_HOST: tcp://docker:2375/
    IMAGE: $CI_REGISTRY_IMAGE
    IMAGE_TAG: $CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
    - docker info
  script:
    - docker buildx create --name $CI_PROJECT_NAME-builder --use
    - docker buildx build --provenance=false --platform linux/amd64,linux/arm64 -t $IMAGE:$IMAGE_TAG --push .
    - docker manifest inspect $IMAGE:$IMAGE_TAG
```

Or you can configure the Runner to have direct access to the Docker socket, but that's a security risk.

I won't go into more detail in this article -- covering everything would fill a whole series of articles.

If you're interested in learning more about GitLab CI without reading hours of documentation, come to my [GitLab CI training](/en/training/gitlab-ci). Note: I'm still preparing it.

### Templates

GitLab offers a list of [pre-made pipelines](https://gitlab.com/gitlab-org/gitlab-foss/tree/master/lib/gitlab/ci/templates) (templates),
but this approach to code reuse is outdated and is being replaced by the [CI/CD Catalog](https://docs.gitlab.com/ee/ci/components/).

You can find the CI/CD Catalog on any GitLab version **17.0.0** and above under **Explore** -> **CI/CD Catalog**. Or at the URL `your-gitlab.com/explore/catalog`.

You can then add a component from the catalog to your pipeline:

```yaml
include:
  - component: $CI_SERVER_FQDN/my-org/security-components/secret-detection@1.0.0
    inputs:
      stage: build
```

Thanks to `inputs`, GitLab gets closer to GitHub Actions in terms of code reusability across projects.

If you're interested in the CI/CD Catalog, check out the interactive [beta demo](https://gitlab.navattic.com/cicd-catalog).

### GitLab Runner

[GitLab Runner](https://docs.gitlab.com/runner/) is an open-source project written in Go that can run on Linux, Windows, and macOS.

Probably the easiest way to run a Runner is in Docker. GitLab Runner can be started in Docker with a single command:

```bash
docker run -d \
    --name gitlab-runner \
    --restart always \
    -v /etc/gitlab-runner:/etc/gitlab-runner \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -v /builds:/builds \
    -v /etc/hosts:/etc/hosts \
    gitlab/gitlab-runner:latest
```

Then you need to register the Runner with GitLab (whether GitLab.com or your own GitLab instance). I use a shell script like this (`register-runner.sh`).

It requires 2 arguments, with an optional third for the runner name, e.g., `./register-runner.sh https://gitlab.com/ my-runner-token blog-runner-01`:

```bash
#!/usr/bin/env bash

if [ $# -z 2 ]; then
  echo "[ERROR] At least two arguments must be supplied, #1 is GitLab URl, #2 is GitLab Runner Token, #3 and optional is GitLab Runner Name"
  exit 1
fi

GITLAB_URL=$1
GITLAB_RUNNER_TOKEN=$2
GITLAB_RUNNER_NAME=${3:-$(hostname)}

docker exec gitlab-runner gitlab-runner register \
   --non-interactive \
   --url ${GITLAB_URL} \
   --registration-token ${GITLAB_RUNNER_TOKEN} \
   --name ${GITLAB_RUNNER_NAME} \
   --executor docker \
   --docker-pull-policy if-not-present \
   --docker-image docker:git \
   --docker-volumes '/var/run/docker.sock:/var/run/docker.sock' \
   --docker-volumes '/builds:/builds' \
   --docker-volumes '/etc/hosts:/etc/hosts'
```

The Runner config will be stored in `/etc/gitlab-runner/config.toml` and looks something like this:

```toml
concurrent = 2
check_interval = 0
user = "gitlab-runner"
shutdown_timeout = 0

[session_server]
  session_timeout = 1800

[[runners]]
  name = "blog-runner-01"
  url = "https://gitlab.com"
  id = 0
  token = "my-runner-token"
  token_obtained_at = 0001-01-01T00:00:00Z
  token_expires_at = 0001-01-01T00:00:00Z
  executor = "docker"
  [runners.docker]
    tls_verify = false
    image = "docker:git"
    privileged = false
    disable_entrypoint_overwrite = false
    oom_kill_disable = false
    disable_cache = false
    cache_dir = "/cache"
    volumes = ["/var/run/docker.sock:/var/run/docker.sock", "/builds:/builds", "/etc/hosts:/etc/hosts", "/cache:/cache"]
    pull_policy = ["if-not-present"]
    shm_size = 0
```

I'd like to highlight a few things:

- `concurrent` - how many jobs can run simultaneously
- `executor` - which executor we're using, in this case Docker
- `volumes` - which volumes are mounted in Docker; in my case `/var/run/docker.sock`, `/builds`, `/etc/hosts`, and `/cache`. As I mentioned above, be careful with the Docker socket -- it's a security risk. Since Docker runs as **root**, you're essentially giving root access to third parties.

More about GitLab Runner configuration can be found in the [documentation](https://docs.gitlab.com/runner/configuration/).

### Scaling Runners

Previously, GitLab Runner supported the Docker Machine executor, which could automatically create (and dispose of) virtual machines in the cloud.
GitLab Runner itself didn't handle the overhead -- Docker Machine took care of everything. But [Docker Machine](https://github.com/docker/machine) was archived at the end of September 2021 and is no longer supported.
GitLab maintained a [Docker Machine fork](https://gitlab.com/gitlab-org/ci-cd/docker-machine) for some time. But starting with GitLab version [**17.1.0**](https://about.gitlab.com/releases/2024/06/20/gitlab-17-1-released/) (June 2024), a replacement is available
in the form of the [Fleeting](https://gitlab.com/gitlab-org/fleeting/fleeting) plugin for GitLab Runner, which handles scaling of runner machines in the cloud.

Fleeting is open-source, making it very easy to write your own plugin for your infrastructure. There are already several official and community
plugins for various cloud providers. Currently supported are [AWS](https://gitlab.com/gitlab-org/fleeting/plugins/aws), [Azure](https://gitlab.com/gitlab-org/fleeting/plugins/azure), [GCP](https://gitlab.com/gitlab-org/fleeting/plugins/googlecloud), [Kubernetes](https://gitlab.com/gitlab-org/fleeting/fleeting-plugin-kubernetes), [Hetzner Cloud](https://gitlab.com/hetznercloud/fleeting-plugin-hetzner), and [OpenStack](https://github.com/sardinasystems/fleeting-plugin-openstack). For VMware vSphere, [GitLab is looking for contributors](https://gitlab.com/gitlab-org/gitlab-runner/-/issues/36931).

Another executor is Kubernetes, meaning you can deploy the Runner directly into a Kubernetes cluster and scale as needed. With the help of Cluster Autoscaler, you can also scale the cluster itself -- and thus theoretically scale to infinity.

A list of all executors and their configuration can be found in the [documentation](https://docs.gitlab.com/runner/executors/).

## GitHub Actions

The fundamental building blocks of GitHub Actions are:

- **workflow** (pipeline) - describes when the workflow runs, its name; it can be independent or wait for another workflow
- **job** - a single task within a workflow
- **step** - a single task (step) within a job
- **action** - a reusable step

A workflow is defined in a `.github/workflows/*.yml` file. A single repository can have multiple workflow files. But they must always be in the `.github/workflows/` directory.

### GitHub Actions Examples

Let's look at a simple example, for a JavaScript application:

```yaml
# .github/workflows/nodejs.yml

name: Node.js CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4
      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
      - run: npm ci
      - run: npm run build
      - run: npm run test
```

Again, this is a trivial pipeline, but you have to start somewhere.

Docker build and push to GitHub Container Registry:

```yaml
# .github/workflows/docker-build.yml

name: Docker build

on:
  push:
    branches:
      - '*'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
- name: checkout
        uses: actions/checkout@v4
        with:
          ref: ${{ github.head_ref }} # checkout the correct branch name
          fetch-tags: true

      - name: setup qemu
        uses: docker/setup-qemu-action@v3

      - name: setup docker
        uses: docker/setup-buildx-action@v3

      - name: login to ghcr.io
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: docker metadata
        uses: docker/metadata-action@v5
        id: meta
        with:
          images: |
            ghcr.io/${{ github.repository }}
          tags: |
            type=ref,event=branch,suffix=-${{ github.sha }}
            type=sha,format=long
            type=raw,value=latest,enable=${{ github.ref == format('refs/heads/{0}', 'main') }}

      - name: build and push
        uses: docker/build-push-action@v6
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

Note: this is again a multi-platform Docker image build for `linux/amd64` and `linux/arm64`.

If you want to use more sophisticated solutions than bash scripts or existing actions that may not suit your needs,
you can use the "GitHub script" action, which lets you write JavaScript and work with the GitHub API via its SDK:

```yaml
# .github/workflows/github-script.yml

name: GitHub Script

on:
  push:
    branches:
      - "*"

jobs:
  script:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run a script
        uses: actions/github-script@v5
        with:
          script: |
            const { data: issues } = await github.issues.listForRepo({
              owner: context.repo.owner,
              repo: context.repo.repo,
            });
            core.setOutput('issues', JSON.stringify(issues));
```

The example above lists all issues in the repository in JSON format.

If you're interested in GitHub Actions and want to learn more or improve your existing workflows,
I'm also preparing a [training](/en/training/github-actions) for GitHub Actions.

### Custom Actions

If you don't want to "hack" JavaScript in your pipeline, you can create your own action that you can then use anywhere in your workflows.
Actions are written in JavaScript/TypeScript and are packaged into a Docker image or just a `Dockerfile` (Linux only), or you can compose actions to create so-called composite actions.

More about custom actions can be found in the [documentation](https://docs.github.com/en/actions/creating-actions).

### GitHub Actions Runner

[GitHub Actions Runner](https://github.com/actions/runner) is an open-source project written in C# that can run on Linux, Windows, and macOS.

You can assign a Runner to a repository or an organization.

For a repository, the procedure is as follows:

1. Go to your repository
2. Open the **Settings** tab
3. In the left menu, select **Actions**
4. In the expanded **Runners** section
5. Click the **New self-hosted runner** button
6. Follow the instructions -- it's a few shell commands you run on the target machine

Such a Runner handles only one job at a time. The Runner can be scaled using GitHub webhooks -- when you receive a `workflow_job` event with `queued` activity.

Or you can use the GitHub [Actions Runner Controller](https://github.com/actions/actions-runner-controller), a Kubernetes operator that lets you run (and scale) Runners on a Kubernetes cluster.

More about GitHub Actions Runner configuration can be found in the [documentation](https://docs.github.com/en/actions/hosting-your-own-runners/about-self-hosted-runners).

### Scaling Runners

The official GitHub runner can only handle one job at a time.
This means if you have several workflows that could run in parallel but only one runner,
they will run sequentially. Because the GitHub Actions runner processes jobs from one workflow sequentially, and only after it completes
moves on to the next workflow.

So to scale runners, we need to run multiple GitHub runner instances. Either on one machine (virtual or physical)
or across multiple machines. On your own hardware, GitHub runners don't scale well, but in the cloud it's very easy --
you just spin up and tear down machines as needed.

Alternatively, if you run runners in Kubernetes, scaling is easier up to a configured maximum, and [actions-runner-controller](https://github.com/actions/actions-runner-controller)
manages the number of runners automatically. If it runs out of resources and you have [Cluster Autoscaler](https://github.com/kubernetes/autoscaler) in your cluster, you can automatically scale the cluster nodes
and thus the runners as well.

## Final Comparison

|                        | GitLab CI           | GitHub Actions  |
| ---------------------- | ------------------- | --------------- |
| Open-source platform   | Yes                 | No              |
| Open-source runner     | Yes                 | Yes             |
| Runner scaling         | Yes                 | Yes             |
| Extensibility          | Yes                 | Yes             |
| Multiple pipelines     | No<sup>1</sup>      | Yes             |
| Environment            | Docker, Shell       | OS              |
| Runner parallelization | Yes, configurable   | No              |
| Runner scaling         | Yes<sup>2</sup>     | Yes<sup>3</sup> |
| Reusability, templates | Yes, file inclusion | Yes, actions    |

1. GitLab CI does allow multiple pipelines, but the configuration is somewhat cumbersome -- these are so-called parent-child pipelines.
2. GitLab Runner can be scaled using the [Fleeting](https://docs.gitlab.com/runner/fleet_scaling/fleeting.html) system or by deploying the Runner to a Kubernetes cluster and scaling there.
3. GitHub Actions Runner can be scaled using webhooks to launch new runners, or via [actions-runner-controller](https://github.com/actions/actions-runner-controller) also on a Kubernetes cluster.

### A Year with GitHub Actions

_What follows is a personal experience with GitHub and GitHub Actions -- your experience may differ._

At [cybroslabs](https://www.cybroslabs.com/) we decided to use GitHub because we plan to publish several projects as open-source in the future,
and to avoid having to rewrite all pipelines from GitLab CI to GitHub Actions, we decided to start on GitHub and use Actions from the get-go.

When GitHub works as it should, everything is fine, but...

Over the course of a year, it happened several times that workflows took a very long time (sometimes tens of minutes) to start...
With about four workflows per repository, that's a pretty bad situation. We solved the runner issue by setting up our own self-hosted runner.

We also had problems several times with GitHub CodeSearch, both within a repository and across the organization. Which certainly didn't help.

Because our applications run on Kubernetes, we use [GitHub Container Registry (ghcr.io)](https://github.com/features/packages),
but private packages can only be accessed with a GitHub Personal Access Token (PAT), so everything depends on a user -- you can't create a token at the organization or repository level.
Which is really not great.

So internal projects will eventually be migrated to our own GitLab, with only open-source remaining on GitHub.

So my personal experience has been mediocre -- I'd rate it 6/10. I personally prefer GitLab and its CI solution.
