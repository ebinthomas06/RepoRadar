// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Standard Next.js + Prisma singleton pattern: without this, every hot
// reload in dev spins up a new PrismaClient (and a new connection pool),
// which exhausts Supabase's connection limit within minutes.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// The adapter is what actually opens the Postgres connection now —
// PrismaClient itself no longer does this internally.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}