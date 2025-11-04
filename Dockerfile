FROM node:24.11-alpine3.22 AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat

FROM base AS pkg

RUN npm install --global pnpm

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
# Therefore, the `-deps` steps will be skipped if only the source code changes.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

FROM pkg AS prod-deps
RUN pnpm install --frozen-lockfile --prod

FROM pkg AS build-deps
RUN pnpm install --frozen-lockfile

FROM build-deps AS build
COPY . .
RUN pnpm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

CMD ["node", "./dist/server/entry.mjs"]
