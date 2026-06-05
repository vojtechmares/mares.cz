# mares.cz

Personal website built with Astro 6, deployed to Vercel.

## Overview

Bilingual (Czech/English) server-side rendered website that uses Astro Content Collections.

## Tech Stack

- **Framework**: Astro 6 with SSR
- **Runtime**: Node.js 24
- **UI**: React 19
- **Styling**: Tailwind CSS v4
- **Content**: Astro Content Collections
- **Deployment**: Vercel (`@astrojs/vercel` adapter, region `fra1`)

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Run the app locally through the Vercel runtime
vercel dev
```

## Testing

```bash
# Unit tests (Vitest)
pnpm test

# E2E tests (Playwright)
npx playwright test
```

## Contributing

- Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages
- Sign off all commits with `--signoff` flag
- Run `pnpm format:fix` before committing

## License

Private project - All rights reserved
