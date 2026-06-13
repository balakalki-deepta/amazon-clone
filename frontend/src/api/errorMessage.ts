/**
 * Pulls a user-friendly message out of an API error.
 *
 * Our backend returns errors as { error: { message, code } }. This reads that
 * message (e.g. "Insufficient stock for ...") so the UI can show the real reason
 * instead of a generic "something went wrong".
 */

import axios from 'axios';

interface ApiErrorBody {
  error?: { message?: string; code?: string };
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const message = error.response?.data?.error?.message;
    if (message) {
      return message;
    }
  }
  return fallback;
}
