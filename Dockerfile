FROM node:20-alpine AS builder

WORKDIR /usr/src/app

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

COPY --from=builder /usr/src/app/nest-cli.json ./

COPY --from=builder /usr/src/app/src/database/migrations ./src/database/migrations

EXPOSE 8081

CMD ["node", "dist/main"]