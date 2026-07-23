import dotenv from 'dotenv';

dotenv.config();

import http from 'http';
import app from './app.js';
import { prisma } from './lib/prisma.js';


const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    // Test Prisma database connection
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected via Prisma ORM.');

    server.listen(PORT, () => {
      console.log(`🚀 AI Gym Personal Trainer Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database or start server:', error);
    process.exit(1);
  }
};

startServer();

const shutdown = async (signal) => {
  console.log(`\n${signal} signal received. Shutting down gracefully...`);
  server.close(async () => {
    console.log('HTTP server closed.');
    await prisma.$disconnect();
    console.log('Prisma disconnected.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});