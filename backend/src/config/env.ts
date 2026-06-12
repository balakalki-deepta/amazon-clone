/**
 * Typed, validated access to environment variables.
 *
 * Everything that reads configuration imports `env` from here — we never touch
 * `process.env` elsewhere. That keeps config in one place and fails fast at
 * startup if something required is missing.
 */

import dotenv from 'dotenv';

dotenv.config();

/** Read a required variable, throwing immediately if it's absent. */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required('DATABASE_URL'),
  /** Frontend origin allowed to call this API (CORS). */
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
} as const;
