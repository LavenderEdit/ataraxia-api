FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS production

WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist ./dist

# Copiamos migraciones y configuraciones necesarias
COPY --from=builder /usr/src/app/src/database/migrations ./src/database/migrations
COPY --from=builder /usr/src/app/nest-cli.json ./

EXPOSE 8081

ENV PORT=8081
ENV NODE_ENV=production

CMD ["node", "dist/main"]