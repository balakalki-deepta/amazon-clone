/**
 * Server entry point.
 *
 * Verifies the database connection, starts the HTTP server, and shuts down
 * cleanly on termination signals (so Prisma releases its connections).
 */

import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './lib/prisma';

async function start(): Promise<void> {
  // Fail fast if the database is unreachable.
  await prisma.$connect();

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`🚀 API listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  // Graceful shutdown: stop accepting requests, then disconnect Prisma.
  const shutdown = async (signal: string): Promise<void> => {
    console.log(`\n${signal} received — shutting down...`);
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

start().catch(async (error) => {
  console.error('Failed to start server:', error);
  await prisma.$disconnect();
  process.exit(1);
});
