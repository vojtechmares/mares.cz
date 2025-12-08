# mares.cz

Personal website built with Astro 5, deployed as a containerized application to Kubernetes.

## Overview

Bilingual (Czech/English) server-side rendered website that fetches content from Strapi CMS and training session data from Notion API.

## Tech Stack

- **Framework**: Astro 5 with SSR
- **Runtime**: Node.js 24 (Alpine)
- **Server**: Fastify
- **Styling**: Tailwind CSS v4
- **Content**: Strapi CMS + Notion API
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

- `STRAPI_API_URL` - Strapi CMS endpoint
- `STRAPI_API_TOKEN` - Strapi authentication token
- `NOTION_API_KEY` - Notion API key
- `NOTION_TRAINING_SESSIONS_DATABASE_ID` - Notion database ID
- `DISABLE_ANALYTICS` - Disable Google Analytics (optional)

## Contributing

- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Sign off all commits with `--signoff` flag
- Run `pnpm format:fix` before committing

## License

Private project - All rights reserved
