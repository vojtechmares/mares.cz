---
title: S3 as the FTP of the Cloud
description: In this article, we take a closer look at AWS S3, also known as object storage, and how it has become practically the standard for cloud storage. We also look at cloud-hosted and self-hosted solutions.
keywords: ["s3", "aws", "object storage", "cloud", "cloud native"]
tags: ["object-storage"]
draft: false
publish_time: 2024-10-28
---

In this article, we take a closer look at AWS S3, also known as object storage, and how it has become practically the standard for cloud storage. We also look at cloud-hosted and self-hosted solutions.

## What Is S3

S3, or Simple Storage Service, is a cloud storage (or object storage) service from Amazon (AWS) that allows you to store and manage an unlimited amount of data (objects) using a very simple API.

The storage unit is called a "bucket," into which you can upload files (objects).

Thanks to a standardized API and SDKs for virtually every programming language, S3 is very easy to use and integrate.

S3 also offers many additional features, such as:

- data encryption
- versioning – similar to Git, S3 stores all versions of files
- lifecycle management – automatic moving of files to different storage classes, deletion of old files or versions
- storage classes – different types of storage with varying prices and availability

### The Origins of S3

S3 was created at Amazon in 2006. As Amazon grew and needed more and more infrastructure, they internally built various tools, APIs, and services that made it easier to work with infrastructure (hardware) and data. At the same time, they realized that such solutions could be useful for other companies too, and that's how AWS – Amazon Web Services – was born.

S3 was one of the first services Amazon offered and it was the very first cloud storage service.

Thanks to high S3 limits (max 5 TB per object and max 5 GB per upload request, otherwise uploads must be split via multipart upload), availability, simple API, pricing, and above all enormous reliability (AWS now guarantees 99.999999999% reliability), S3 quickly became extremely popular.

Additionally, AWS released SDKs (Software Development Kits) for many languages, which also greatly facilitated and helped S3 adoption.

## Object Storage FTW!

Object storage is the umbrella term for all the various implementations of cloud storage.

Over time, all cloud providers, as well as self-hosted projects, started implementing their own object storage solutions.

So today we have the following options:

| **Name**                           | **API**          | **Infrastructure** |
| ---------------------------------- | ---------------- | ------------------ |
| AWS S3                             | S3               | Cloud              |
| GCP Cloud Storage<sup>1</sup>      | proprietary + S3 | Cloud              |
| Azure Blob Storage<sup>1</sup>     | proprietary + S3 | Cloud              |
| Cloudflare R2                      | S3               | Cloud              |
| Digital Ocean Spaces               | S3               | Cloud              |
| Hetzner Object Storage<sup>2</sup> | S3               | Cloud              |
| Ceph Object Gateway                | S3               | Self-hosted        |
| OpenStack Swift                    | S3               | Self-hosted        |
| MinIO                              | S3               | Self-hosted        |
| Garage                             | S3               | Self-hosted        |

1. Google Cloud Storage and Azure Blob Storage have their own APIs but also support S3 without any code changes, making it easier to adopt their object storage solutions.
2. Hetzner Object Storage has been available since November 2024 and is therefore the newest member of the object storage provider family.

### AWS S3

https://aws.amazon.com/s3/

Let's first take a closer look at AWS S3 – the pioneer and the original.

AWS today offers S3 in virtually all regions and provides all features available within the S3 API (as you'd expect, since they created S3).

- data encryption
- versioning
- lifecycle management
- storage classes
- hosting static content over HTTP
- ACL (Access Control List)
- _and much more_

### Cloudflare R2

https://www.cloudflare.com/en-gb/developer-platform/r2/

At the end of September 2021, Cloudflare announced its object storage solution R2, which is built on the S3 API. While it doesn't support all S3 API features, a huge selling point is zero egress fees (i.e., no cost for transferring data out of storage).

R2 is also very nicely integrated into other Cloudflare services today, such as [Cloudflare Cache Reserve](https://developers.cloudflare.com/cache/advanced-configuration/cache-reserve/#cache-reserve).

Thanks to "zero egress fees," it's a very attractive solution for distributing static content, such as software installations, sharing images, or files in general.

Cloudflare R2 has a fairly simple pricing model:

- $0.015 / GB / month, first 10 GB free
- $4.50 / million Class A requests, first million free
- $0.36 / million Class B requests, first ten million free

> A **Class A** request is, for example, uploading objects, listing bucket contents, or listing buckets themselves. A **Class B** request is downloading objects. So you pay for wanting to download an object, but not for the data transfer to the internet.

### OpenStack Swift

https://wiki.openstack.org/wiki/Swift

[OpenStack](https://www.openstack.org/) is an open-source cloud platform that was created in 2010 and is very popular today for self-hosted cloud solutions. OpenStack offers a range of components that you can combine to create your own cloud tailored to your needs.

OpenStack Swift is the component for object storage. Swift is built on the S3 API but doesn't offer all S3 API features.

### MinIO

https://min.io/

[MinIO](https://min.io/) is an open-source object storage solution built on the S3 API that allows you to easily self-host your own object storage.

MinIO is a standalone project that can be deployed in many different ways, from installation via system packages, Docker, to a Kubernetes operator. This makes MinIO very flexible.

If the features available in the open-source version aren't enough, you can purchase the commercial MinIO Enterprise version. However, it should be noted that the enterprise version is quite expensive, so it's worth considering whether enterprise is worth it for you.

## So Is S3 the New FTP?

**TL;DR: Yes and no.**

S3 as a technology today enables many things, from storing a virtually unlimited number of files (and folders) through encryption, versioning, and various "storage classes" to hosting static web content.

Some of these things were already possible with FTP, but FTP has its limits. Meanwhile, S3 seems unbeatable. The only thing that's still somewhat complicated with S3, in my experience, is self-hosting, but MinIO is managing to change that.

So S3/object storage has become practically the universal API for cloud and serverless applications, enjoys enormous popularity, and is supported across many projects. If you're looking for a solution for storing data other than directly on the filesystem, you can't go wrong with S3.
