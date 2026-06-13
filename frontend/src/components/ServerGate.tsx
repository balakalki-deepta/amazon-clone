import { useEffect, useState, type ReactNode } from 'react';
import { checkHealth } from '@/api/health';
import { Button } from '@/components/ui/button';

const MAX_WAIT_MS = 10 * 60 * 1000; // poll for at most 10 minutes
const RETRY_DELAY_MS = 2500;
const SHOW_MESSAGE_AFTER_MS = 2000;

type Status = 'checking' | 'waking' | 'ready' | 'timeout';

/**
 * Gates the app behind a server health check so the free-tier cold start never
 * shows errors. While the server wakes it shows a "starting up" screen and polls
 * /api/health (up to 10 minutes); once healthy it renders the app.
 */
export default function ServerGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>('checking');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setTimeout>;
    const deadline = Date.now() + MAX_WAIT_MS;

    // If the first check takes a moment, show the "starting up" message.
    const messageTimer = setTimeout(() => {
      if (!cancelled) setStatus((current) => (current === 'checking' ? 'waking' : current));
    }, SHOW_MESSAGE_AFTER_MS);

    const ping = async () => {
      try {
        await checkHealth();
        if (!cancelled) setStatus('ready');
      } catch {
        if (cancelled) return;
        if (Date.now() >= deadline) {
          setStatus('timeout');
          return;
        }
        setStatus('waking');
        retryTimer = setTimeout(ping, RETRY_DELAY_MS);
      }
    };

    void ping();

    return () => {
      cancelled = true;
      clearTimeout(messageTimer);
      clearTimeout(retryTimer);
    };
  }, [attempt]);

  if (status === 'ready') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-amazon-bg px-6 text-center">
      <p className="text-2xl font-bold">
        amazon<span className="text-amazon-orange">.clone</span>
      </p>

      {status === 'timeout' ? (
        <>
          <p className="max-w-md text-amazon-ink">
            We couldn't reach the server. It may be taking longer than usual to start.
          </p>
          <Button
            onClick={() => {
              setStatus('checking');
              setAttempt((n) => n + 1);
            }}
            className="rounded-full border border-[#fcd200] bg-amazon-yellow text-amazon-ink hover:bg-amazon-yellow-hover"
          >
            Try again
          </Button>
        </>
      ) : (
        <>
          <span
            role="status"
            aria-label="Loading"
            className="h-9 w-9 animate-spin rounded-full border-4 border-[#e7e9ec] border-t-amazon-orange"
          />
          {status === 'waking' && (
            <p className="max-w-sm text-amazon-muted">
              Starting up the server… The free server sleeps when idle, so the first load can take
              up to a minute. Hang tight!
            </p>
          )}
        </>
      )}
    </div>
  );
}
