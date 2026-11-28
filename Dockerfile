# syntax=docker/dockerfile:1

FROM node:22-alpine AS base

# Install all dependencies (including dev) for the Vite build
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install --no-audit --no-fund; fi

# Build the client bundle into /app/dist
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Optional build-time variable (set in Coolify as a build variable if needed)
ARG VITE_ALCHEMY_RPC_URL
ENV VITE_ALCHEMY_RPC_URL=$VITE_ALCHEMY_RPC_URL
RUN npm run build

# Production runtime: Express server + static dist
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev --no-audit --no-fund; fi \
  && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 wallet
USER wallet

EXPOSE 3000

CMD ["node_modules/.bin/tsx", "server.ts"]
