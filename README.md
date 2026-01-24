# mares.cz

Personal website built with Astro 5, deployed as a containerized application to Kubernetes.

## Overview

Bilingual (Czech/English) server-side rendered website that uses Astro Content Collections.

## Tech Stack

- **Framework**: Astro 5 with SSR
- **Runtime**: Node.js 24 (Alpine)
- **Server**: Fastify
- **Styling**: Tailwind CSS v4
- **Content**: Astro Content Collections
- **Deployment**: Kubernetes with Helm

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm run-like-prod
```

## Docker

```bash
# Build container image
task docker:build

# Run container locally
task docker:run
```

## Environment Variables

Required variables (store in `.prod.env` for local development):

- `DISABLE_ANALYTICS` - Disable Google Analytics (optional)

## Contributing

- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Sign off all commits with `--signoff` flag
- Run `pnpm format:fix` before committing

## License

Private project - All rights reserved
