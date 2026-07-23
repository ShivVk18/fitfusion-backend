# ---------- Builder ----------
FROM node:26-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./

RUN npm install
RUN npx prisma generate

# ---------- Runtime ----------
FROM node:26-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/
COPY prisma.config.ts ./
COPY src ./src/

RUN npm install --omit=dev

COPY --from=builder /app/prisma/generated ./prisma/generated

EXPOSE 8000

CMD ["node", "src/server.js"]