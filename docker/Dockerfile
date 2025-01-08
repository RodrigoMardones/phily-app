# syntax=docker.io/docker/dockerfile:1

FROM oven/bun:alpine AS base

# 1. Install dependencies only when needed
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
WORKDIR /app
# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./
COPY . .
RUN bun install
COPY .env.production .env.production
RUN bun run build

# 2. Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder  /app/.next/standalone ./
COPY --from=builder  /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT=3000

CMD HOSTNAME="0.0.0.0" bun run server.js