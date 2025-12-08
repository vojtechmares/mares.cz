# syntax=docker/dockerfile:1

FROM node:24.11-alpine3.22 AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat

FROM base AS pkg

ENV HUSKY=0
RUN npm install --global pnpm

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
# Therefore, the `-deps` steps will be skipped if only the source code changes.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

FROM pkg AS prod-deps
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

FROM pkg AS build-deps
RUN pnpm install --frozen-lockfile

FROM build-deps AS build

ENV NODE_ENV="production"

COPY . .
RUN \
  --mount=type=secret,id=STRAPI_API_URL,env=STRAPI_API_URL \
  --mount=type=secret,id=STRAPI_API_TOKEN,env=STRAPI_API_TOKEN \
  --mount=type=secret,id=NOTION_API_KEY,env=NOTION_API_KEY \
  --mount=type=secret,id=NOTION_TRAINING_SESSIONS_DATABASE_ID,env=NOTION_TRAINING_SESSIONS_DATABASE_ID \
  pnpm run build

FROM base AS runtime

RUN adduser -D nodejs

COPY --chown=nodejs:nodejs --from=build /app/src/fonts ./src/fonts
COPY --chown=nodejs:nodejs --from=build /app/src/images ./src/images
COPY --chown=nodejs:nodejs --from=build /app/server.mjs ./
COPY --chown=nodejs:nodejs --from=prod-deps /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs --from=build /app/dist ./dist

EXPOSE 8080

USER nodejs

CMD ["node", "./server.mjs"]
