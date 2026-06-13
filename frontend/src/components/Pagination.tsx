import { Button } from '@/components/ui/button';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Previous / Next pager. Renders nothing when there's only one page. */
export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-center gap-4 pb-2 pt-6" aria-label="Pagination">
      <Button variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        ‹ Previous
      </Button>
      <span className="text-sm text-amazon-muted">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next ›
      </Button>
    </nav>
  );
}
