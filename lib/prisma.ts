import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Sets up WebSocket connection for Neon to bypass firewall on port 5432
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
    console.error("CRITICAL ERROR: DATABASE_URL is missing from environment variables.");
}

const connectionString = `${process.env.DATABASE_URL}`;

const globalForPrisma = global as unknown as { prisma: PrismaClient };

const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);

export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        adapter,
        log: ['warn', 'error']
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
