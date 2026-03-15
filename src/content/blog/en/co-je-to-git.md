---
title: What Is Git?
description: What is Git? Perhaps a trivial question for some, but for others it's still a mystery. A brief summary of what Git is and how to use it.
keywords: ["git", "version control", "vcs", "source code", "gitlab", "github"]
tags: ["git"]
trainingAd: git
draft: false
publish_time: 2024-08-19
---

What is Git? Perhaps a trivial question for some, but for others it's still a mystery. A brief summary of what Git is and how to use it.

## TL;DR

Git is a version control system for files, primarily text files, making it ideal for source code. But it can also manage any type of file.

Git allows you to save changes over time, so you can see what was changed, when, and by whom. It also supports branching, so you can work on multiple things at once and then merge them together.
And last but not least, you can share such a repository with other people (on a team) and collaborate on a single project. The repository is stored on a Git server, from which everyone pulls the latest changes.

## A Bit of History

Git was created in 2005 by [Linus Torvalds](https://en.wikipedia.org/wiki/Linus_Torvalds), the creator of the Linux kernel. Linus took this step after the previous system, BitKeeper (specifically the company developing BitKeeper), revoked the free license that developers had been using for Linux kernel development.

Linus, having learned from his experience with BitKeeper, decided to write his own version control system. The main requirements were:

- speed
- simplicity
- strong support for parallel development (i.e., using branches)
- fully distributed (i.e., remote server)
- efficient handling of large projects (like the Linux kernel) in terms of speed and disk space

## Fundamental Building Blocks

### Repository

A repository is the place where files are stored. On your computer, it will be a folder in which Git tracks all files across all subdirectories.

If you don't want Git to track certain files or folders, you can use a `.gitignore` file to specify which files you don't want tracked.

### Commit

A commit is the basic element in Git. It is a "point in time" in your project. A commit contains information about what was changed, who changed it, and when. A commit is also identified by a unique identifier (hash). A commit belongs to a branch.

### Branch

A branch is a divergence from the main branch (formerly `master`, now `main`). A branch allows you to work on different features independently. Once work on a branch is complete, you can merge it back into the main branch.

Merging can be done via **merge** or **rebase**. The difference is that merge preserves the branch history, while rebase "rewrites" the history and creates a linear history (branches are not visible in the history).

## Working with Git

### Clone

Clone is the first step where you download a repository from a Git server to your computer. This creates a local copy of the repository that you can work with.

```shell
git clone $URL
```

### Add

Add is the step where you stage files that you want to commit.

```shell
git add .
# or
git add path/to/file.txt
```

### Commit

Commit is the step where you save changes to the repository. You must first add the files you want to commit to the so-called _stage_ and then commit.

```shell
git commit
```

### Push

Push is the step where you send commits from your local repository to the Git server.

```shell
git push
```

### Pull

Pull is used to download changes from the Git server to your local repository.

```shell
git pull
```

### Switch/checkout

Switch/checkout is the step where you switch between branches.

```shell
git switch $BRANCH
# or
git checkout $BRANCH

# create a new branch
git checkout -b $BRANCH
# or
git switch -c $BRANCH
```

### Status

Status in the command line shows the state of your local repository -- whether there are any changes and whether they are _staged_ or not.

```shell
git status
```

### Merge

Merge is used to combine two branches together. Merge joins the specified branch into the current one (`git status`).

```shell
git merge $BRANCH
```

### Rebase

Rebase can merge the commit history of two branches together. Rebase rewrites the history and creates a linear history.

```shell
git rebase $BRANCH
```

### Cherry pick

Cherry pick allows you to select a single commit from another branch and apply it to the current branch.

Note that cherry pick creates a new commit with a new hash -- it does not copy it!

```shell
git cherry-pick $COMMIT_HASH
```

### Pull/merge request

On Git servers (GitHub, GitLab, Bitbucket, ...) you can create a so-called pull request (GitHub, Bitbucket) or merge request (GitLab). This way you can request to merge your branch into the main branch. The merge/rebase (depending on the strategy for the given repository) then happens on the Git server side rather than in your local repository.

### Fork

On a Git server you can also create a so-called _fork_, i.e., a copy of a repository into your account. This way you can work on a project that isn't yours, and then create a pull/merge request.

## Git Client

You can work with Git through the command line, but also with graphical clients.

### Git on the Command Line

Git can be used from the command line. All you need is Git installed and you can start using commands like `git clone`, `git commit`, `git push`, `git pull`, `git merge`, `git rebase`, `git cherry-pick`, `git branch`, `git checkout`, `git log`, `git status`, `git diff`, `git blame`, `git tag`, `git fetch`, `git remote`, `git config`, `git stash`, `git revert`, `git reset`, `git show`, `git grep`, `git bisect`, `git reflog`, `git submodule`, `git worktree`, `git clean`, `git help`, `git version`, ...

### Git GUI Clients

[GitHub Desktop](https://github.com/apps/desktop), [GitKraken Desktop](https://www.gitkraken.com/git-client), [SourceTree](https://www.sourcetreeapp.com/), [Fork](https://git-fork.com/) (macOS only), [Tower](https://www.git-tower.com/), and more...

## Git Server

A Git server is an indispensable part of the Git ecosystem. It is the central point where changes are stored and from which others can pull changes. Today there are several servers that allow you to host your repositories for free, with paid options for advanced features. Or you can host some of them on your own server.

### GitHub

[`github.com`](https://github.com)

GitHub is by far the most popular Git server today. GitHub offers free hosting for public repositories and paid hosting for private ones. GitHub is owned by Microsoft.

GitHub dominates the open-source world and is also popular among developers who want to make their code publicly available.

GitHub also offers CI/CD through GitHub Actions, which are free for both public and private repositories.

### GitLab

[`gitlab.com`](https://gitlab.com)

GitLab is number two in the Git server space. It is open-source with a dual license (some features require payment). GitLab can be very easily hosted on your own server.

GitLab is very popular among companies that want to keep their code on their own servers rather than in the cloud.

At the same time, GitLab has long offered a CI/CD solution that is very easy to use and very popular.

GitLab has also become very popular among developers.

### Bitbucket

[`bitbucket.org`](https://bitbucket.org)

Bitbucket is a Git server owned by Atlassian. Bitbucket is popular among companies that use other Atlassian products like Jira, Confluence, Trello, ...

Bitbucket offers CI/CD through Bitbucket Pipelines, which are free for both public and private repositories.

These days it doesn't enjoy as much popularity as before, but in large corporations it still has strong support, precisely because of its integration with other Atlassian products.

### Others

[Gogs](https://gogs.io/), [Gitea](https://about.gitea.com/), [Forgejo](https://forgejo.org/), [cgit](https://git.zx2c4.com/cgit/about/), ...

These are some of the many alternative Git servers that you can host yourself, or for some (e.g., Gitea) you can use hosted versions. They are smaller, often community-driven projects. In recent years, however, they have been growing in popularity.

Forgejo is a fork of Gitea where the community maintains compatibility with Gitea, but the project itself is governed by the community rather than a company, as is the case with Gitea.

Gitea and Forgejo now support CI/CD whose definitions are syntactically identical to GitHub Actions, making it easy to migrate between them.

## Alternatives to Git

Because Git is the dominant version control system today, it's hard to find an alternative that is as popular. But they do exist.

These are primarily older systems, or some huge companies like Google or Meta use their own systems because their sheer size and the fact that they keep everything in a single repository (a so-called monorepo) makes it very challenging to scale such a version control system.

Among the still actively used alternatives are:

- [Mercurial](https://www.mercurial-scm.org/), notable users include NGINX.
- [Subversion (SVN)](https://subversion.apache.org/), notable users include the Apache Software Foundation.

## Conclusion

Git is a great and practically indispensable tool for software development. Without it, working on a larger project is essentially a walk through hell.

Thanks to servers like GitHub and GitLab, Git has become the most popular version control system in the world.
