import { PrismaClient } from "@prisma/client";

const globalThisForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma = globalThisForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalThisForPrisma.prisma = prisma;
