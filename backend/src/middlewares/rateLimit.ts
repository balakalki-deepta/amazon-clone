/**
 * Basic rate limiting: caps how many requests one client (IP) can make in a
 * short window, so the API can't be hammered or abused. The response uses our
 * standard error envelope.
 */

import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200, // up to 200 requests per IP per minute — generous for normal browsing
  standardHeaders: true, // send RateLimit-* headers
  legacyHeaders: false,
  message: {
    error: { message: 'Too many requests, please slow down.', code: 'RATE_LIMITED' },
  },
});
