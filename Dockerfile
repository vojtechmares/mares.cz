# syntax=docker/dockerfile:1
FROM --platform=$BUILDPLATFORM node:22-alpine AS base

FROM --platform=$BUILDPLATFORM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install


FROM --platform=$BUILDPLATFORM base AS builder

WORKDIR /app

RUN corepack enable pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG CMS_API_URL="https://cms.mareshq.com/api"
ARG CMS_API_TOKEN

# COPY .env.production.sample .env.production
RUN pnpm run build

FROM --platform=$TARGETPLATFORM base AS runtime

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/images ./images
COPY --from=builder --chown=nextjs:nodejs /app/content ./content

USER nextjs

EXPOSE 3000

ENV PORT=3000
# ENV HOSTNAME=0.0.0.0

CMD ["node", "./server.js"]
