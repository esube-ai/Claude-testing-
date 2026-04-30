FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci --ignore-scripts

FROM base AS build
COPY . .
RUN npm run build
RUN npm run build:server

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production --ignore-scripts

COPY --from=build /app/dist ./dist
RUN mkdir -p data

# Seed the DB at build time (data dir is a volume in prod)
COPY --from=build /app/server/db ./server/db
RUN node dist/server/db/seed.js || true

EXPOSE 3001
CMD ["node", "dist/server/index.js"]
