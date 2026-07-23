# Stage 1: Build Prisma Client
FROM node:26-slim AS builder
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate

# Stage 2: Final minimal production image
FROM node:26-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install --omit=dev
COPY --from=builder /app/prisma/generated ./prisma/generated
COPY src ./src/

EXPOSE 8000
CMD ["sh", "-c", "npx prisma db push && node src/server.js"]
