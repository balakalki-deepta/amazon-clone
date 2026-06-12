/**
 * Builds and wires up the Express application.
 *
 * Order matters: global middleware first, then feature routes, then the 404
 * handler, then the error handler last. Keeping app construction in its own
 * function (separate from starting the server) makes it easy to test later.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { env } from './config/env';
import { healthRouter } from './modules/health/health.routes';
import { productRouter } from './modules/products/product.routes';
import { categoryRouter } from './modules/categories/category.routes';
import { orderRouter } from './modules/orders/order.routes';
import { apiLimiter } from './middlewares/rateLimit';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

export function createApp() {
  const app = express();

  // Trust the first proxy (Render/most hosts) so the real client IP is used for
  // rate limiting. Harmless in local development.
  app.set('trust proxy', 1);

  // Security & parsing middleware.
  app.use(helmet()); // sensible secure HTTP headers
  app.use(cors({ origin: env.corsOrigin })); // only allow our frontend origin
  app.use(express.json({ limit: '100kb' })); // reject oversized JSON bodies
  app.use(apiLimiter); // basic per-IP rate limit

  // Feature routes (more added as we build modules).
  app.use('/api/health', healthRouter);
  app.use('/api/products', productRouter);
  app.use('/api/categories', categoryRouter);
  app.use('/api/orders', orderRouter);

  // Fallbacks — must come after all routes.
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
