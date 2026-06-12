/**
 * Helpers for our consistent JSON response envelope.
 *
 *   success → { "data": ... }
 *   error   → { "error": { "message": ..., "code": ... } }   (sent by errorHandler)
 *
 * Using one shape everywhere means the frontend always unwraps responses the
 * same way.
 */

import type { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): void {
  res.status(statusCode).json({ data });
}
