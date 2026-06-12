/**
 * The single axios instance every API call goes through.
 *
 * Centralising it here means base URL, headers, and (later) interceptors are
 * defined once. Components never import axios directly — they call typed
 * functions in src/api/* that use this client.
 */

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api';

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});
