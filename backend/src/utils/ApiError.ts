/**
 * A typed application error.
 *
 * Anywhere in the app we can `throw new ApiError(...)` (or use a factory like
 * `ApiError.notFound()`); the central error-handling middleware turns it into a
 * proper HTTP response. This keeps controllers/services free of res.status(...)
 * error plumbing.
 */

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;

  constructor(statusCode: number, message: string, code = 'ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }

  static badRequest(message = 'Bad request'): ApiError {
    return new ApiError(400, message, 'BAD_REQUEST');
  }

  static notFound(message = 'Resource not found'): ApiError {
    return new ApiError(404, message, 'NOT_FOUND');
  }
}
