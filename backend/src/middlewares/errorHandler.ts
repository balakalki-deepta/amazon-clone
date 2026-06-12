/**
 * The single place that turns thrown errors into HTTP responses.
 *
 * Express recognises a middleware with four arguments as an error handler. It's
 * mounted last, so anything thrown (or passed to next(err)) anywhere upstream
 * lands here and is sent in our standard error envelope.
 */

import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express needs the 4-arg signature to detect an error handler.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  // Known, intentional errors carry their own status + code.
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ error: { message: err.message, code: err.code } });
    return;
  }

  // Validation failures (zod) → 400 with per-field details.
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        message: 'Invalid request',
        code: 'VALIDATION_ERROR',
        details: err.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
    return;
  }

  // Anything else is unexpected: log it (in non-production) and hide details.
  if (env.nodeEnv !== 'production') {
    console.error('Unhandled error:', err);
  }
  res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } });
}
