/**
 * Health-check route: GET /api/health
 *
 * A tiny endpoint to confirm the server is up. Useful for local sanity checks
 * and for deployment platforms' health probes.
 */

import { Router } from 'express';
import { sendSuccess } from '../../utils/apiResponse';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  sendSuccess(res, { status: 'ok', uptime: process.uptime() });
});
