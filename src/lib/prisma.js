import dotenv from "dotenv";

dotenv.config();
import {PrismaClient } from "../../prisma/generated/client.ts"

// Import the driver adapter for your specific database (example uses PostgreSQL)
import { PrismaPg } from "@prisma/adapter-pg";
// Initialize the adapter according to your driver's requirements

console.log("DATABASE_URL =", process.env.DATABASE_URL);

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
// Pass the adapter instance to PrismaClient
const prisma = new PrismaClient({ adapter });

export {prisma}