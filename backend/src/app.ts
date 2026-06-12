/**
 * Builds and wires up the Express application.
 *
 * Order matters: global middleware first, then feature routes, then the 404
 * handler, then the error handler last. Keeping app construction in its own
 * function (separate from starting the server) makes it easy to test later.
 */

import express from 'express';
import cors from 'cors';

import { env } from './config/env';
import { healthRouter } from './modules/health/health.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

export function createApp() {
  const app = express();

  // Global middleware.
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());

  // Feature routes (more added as we build modules).
  app.use('/api/health', healthRouter);

  // Fallbacks — must come after all routes.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
