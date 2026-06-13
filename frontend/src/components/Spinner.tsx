import { cn } from '@/lib/utils';

/** Centered loading spinner. */
export default function Spinner({ className }: { className?: string }) {
  return (
    <div className={cn('flex justify-center p-12', className)}>
      <span
        role="status"
        aria-label="Loading"
        className="h-9 w-9 animate-spin rounded-full border-4 border-[#e7e9ec] border-t-amazon-orange"
      />
    </div>
  );
}
