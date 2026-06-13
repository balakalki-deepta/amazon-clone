import { apiClient } from './client';

/**
 * Pings the API health endpoint. Uses a long timeout so a single request can
 * wait out a free-tier cold start (the server can take ~50s to wake).
 */
export async function checkHealth(timeoutMs = 60000): Promise<void> {
  await apiClient.get('/health', { timeout: timeoutMs });
}
