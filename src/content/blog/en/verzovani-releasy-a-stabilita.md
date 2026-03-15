---
title: Versioning, Releases, and Stability
description: Versioning. A common topic, and another problem alongside "naming things, cache invalidation, off by one errors" – the fourth IT problem is versioning. What versioning schemes exist, how I use them and why, and which ones are unsuitable. Versioning isn't just about one thing either – today we version source code of a service, we have a version of the product/application as a whole, and then we also version things like machine learning models. In short, versioning is fun.
keywords: ["versioning", "application", "api", "product", "breaking changes", "stability"]
tags: [""]
draft: true
publish_time: 2020-01-01
---

Originally, this article was supposed to be about "Versioning Schemes," but as I was writing, things got out of hand, and so here we are.

## Versioning

Versioning is an endless topic – which scheme to choose, when to update which part of the version (e.g., MAJOR, MINOR, PATCH in Semantic Versioning). At the same time, with a version we announce changes and, depending on the scheme, we practically guarantee a contract that when you update, nothing will break – or conversely, that you'll need to make larger or smaller changes on your side.

### Versioning Schemes

Versioning schemes give us greater flexibility so that we don't just have a single number that we increment, requiring everything to always be checked (though automated tests in a pipeline should always run). They tell us how the behavior of our software is changing and what changes to expect between versions. So essentially, a scheme serves to make it easier to communicate what has changed. And at the same time, machine-readable versions enable building update automations where we don't have to manually update individual dependencies ourselves.

Here's a list of the most common versioning schemes I've encountered in recent years:

- [**Semantic Versioning**](https://semver.org/) (SemVer) – probably the most widely used scheme today, in the format MAJOR.MINOR.PATCH, where a change in the MAJOR number indicates backward-incompatible changes. Today it's practically the standard in the world of shared libraries, especially in the JavaScript ecosystem.
- [**ZeroVer**](https://0ver.org/) – a scheme very similar to Semantic Versioning, with the difference that the first number is forever zero. Backward-incompatible changes are announced in advance (deprecated) and eventually simply removed. For a long time, React was on ZeroVer, for example, before switching to Semantic Versioning a few years ago.
- [**CalVer**](https://calver.org/) – a versioning scheme tied to the calendar, i.e., the version number corresponds to a date. Backward-incompatible changes are handled similarly to ZeroVer – announce end of support and a removal date. The most well-known example in the IT world is probably the Linux distribution Ubuntu, which releases a new long-term support (LTS) version every even year in April, e.g., 22.04, 24.04,...
- **Simplified SemVer** – SemVer but without the PATCH version, so just MAJOR.MINOR.
- **Majors only** – Only MAJOR version numbers, i.e., signaling only backward-incompatible changes. The most well-known user is probably Google, which uses this internally in their monorepo and continuously tests everything. This approach is also very commonly used for API versioning.

### Breaking Changes

When releasing a new version, if we care (and we should) about backward compatibility, it's important to clearly identify versions that contain backward-incompatible changes (breaking changes).

Typically, this is indicated by the first number in the versioning scheme, or the changelog explicitly states that something will stop working.

What's important not to forget is what actually constitutes a breaking change:

- renaming a field
- changing default behavior
- adding a new required field
- changes (adding/removing) values in an enumerate (enum)
- if a field type is "oneOf," the allowed types must not change (add/remove) – essentially an enum but for objects
- changing a default value
- changing a null value (`0` vs `null`)
- changing string length

For API reference, I'll point to Google's [AIP-180: Backwards compatibility](https://google.aip.dev/180)

### So How Should We Version

So how should we actually version things? In my opinion, there's no universal answer, because in different places we need to communicate different information, and in some cases too many versions just create noise (for example, end users don't need to be informed about some internal system change).

- **Versioning libraries**

  For libraries, I always choose **SemVer** today. It's the standard and practically all developers know SemVer, and it gives sufficient control over individual versions:
  - Major: clearly indicates backward-incompatible changes
  - Minor: adds new features
  - Patch: fixes bugs

  The exception is when I'm creating a new library/prototype – I'd use **ZeroVer** and simply develop as fast as needed, deprioritizing stability ("move fast, break things, fix them later"). But such an approach can't last forever, and you need to set a deadline for when the project either dies or a stable version 1.0 is released.

  An alternative approach is to have **ZeroVer** everywhere and define a period during which support/compatibility is guaranteed before something gets removed. At that point, your entire ecosystem can work this way, which requires discipline, time, and code "hygiene."

- **Versioning components**

  By component, I mean something like a service in the microservices world, for example.

  The version of such a component isn't as important to me as its API, through which services communicate with each other. It doesn't matter whether the API is synchronous (like REST) or asynchronous (like queues).

- **Versioning APIs**

  APIs – the interfaces through which services or entire systems communicate. Ultimately, it doesn't matter whether you're using modern gRPC, REST, JSON-RPC, GraphQL, or older APIs like SOAP. You should always version them.

- **Versioning products**

  This is **the version** that end users, ordinary people, will see. They don't really care about what changed technically. What matters to them is new features, improvements to existing ones, and bug fixes. But by bug fixes I mean something that doesn't work for the user, not that a button had the wrong border radius that didn't match your design system.

### The Human Perception of High Version Numbers

The last thing I want to address in this article is the psychological effect of versions on people. Even when we know nothing about a version, from experience, people tend to prefer low versions like 2.4.9 over "high" ones like 49.143.77, even though technically they're exactly the same.

I think lower versions feel more appealing to us because they suggest some stability and "maturity," but they don't actually account for when the version was released – that's a secondary consideration at best.

In a way, this penalizes someone who diligently follows a scheme and makes changes transparently.

What we shouldn't overlook is how long it took for a project/application/library to produce that many versions. In the example of 49.143.77, for software I use and expect stability from, I don't mind daily minor and patch versions, but for major versions I don't think releasing more frequently than quarterly is acceptable. Sure, not every major version necessarily implies a complete rewrite. Ideally, with stability in mind, you'd never have to deal with incompatibility, but in the real world, once every year or two seems OK to me. But then again, it depends on the application.

## Releases

## Stability

Stability is essentially the opposite of backward-incompatible changes. Through versions following a versioning scheme, we clearly state which versions will contain incompatible changes and which versions should work without issues when upgrading, say, a library.

There are also several ways to guarantee stability and gradually introduce features that could potentially be incompatible but are "opt-in" and therefore don't break default behavior.

Two approaches make sense to me:

- stability through channels: alpha, beta, stable. New features pass through individual channels and gradually "bubble up" to stable. Kubernetes uses this approach, for example. Its strength is that you can make incompatible changes in alpha/beta versions and iterate toward a stable solution over time without breaking the stable API. The cost of this approach is the effort required and the amount of code that needs to be maintained.
- tied to releases: with each version (major/minor, not patch) something new arrives, but it doesn't always have to be finished, and subsequent behavior changes may require a new major version.

Also, once I release a version, I should never delete it. Sometimes you might accidentally release a new version when you didn't mean to, or it contains changes that weren't ready yet. That's unfortunate, yes, but I still wouldn't delete the released version – I'd just move forward incrementally. What I like from the Rust/Python world are so-called "yanked versions." When you release a version that either shouldn't have been released, has something wrong with it, or contains a major security vulnerability, you simply mark it as "yanked" and the package registry (along with the package manager) will avoid the version and won't even display it on the website (or in an RSS feed, for example). But that doesn't mean you can't install that version if you explicitly request it – you should just see a warning.
