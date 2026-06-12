/**
 * The single place that turns thrown errors into HTTP responses.
 *
 * Express recognises a middleware with four arguments as an error handler. It's
 * mounted last, so anything thrown (or passed to next(err)) anywhere upstream
 * lands here and is sent in our standard error envelope.
 */

import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { ApiError } from '../utils/ApiError';
import { env } from '../config/env';

// Express needs the 4-argument signature to recognise this as an error handler.
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
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

  // Known database errors (Prisma) → friendly status codes.
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      // Record the query expected to exist was not found.
      res.status(404).json({ error: { message: 'Resource not found', code: 'NOT_FOUND' } });
      return;
    }
    if (err.code === 'P2002') {
      // Unique constraint violation.
      res.status(409).json({ error: { message: 'That record already exists', code: 'CONFLICT' } });
      return;
    }
    // Other Prisma errors fall through to the generic 500 below.
  }

  // Anything else is unexpected: log it (in non-production) and hide details.
  if (env.nodeEnv !== 'production') {
    console.error('Unhandled error:', err);
  }
  res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL_ERROR' } });
}
