import type { Category } from '../../types';
import { cn } from '@/lib/utils';

interface CategorySidebarProps {
  categories: Category[];
  activeCategory?: string;
  /** Called with a slug to filter, or undefined to clear the filter. */
  onSelect: (slug?: string) => void;
}

const itemClass = (active: boolean) =>
  cn(
    'w-full rounded px-1.5 py-[5px] text-left text-sm text-amazon-ink hover:text-amazon-link-hover hover:underline',
    active && 'font-bold text-amazon-link-hover',
  );

/** Amazon-style "Department" filter list. */
export default function CategorySidebar({
  categories,
  activeCategory,
  onSelect,
}: CategorySidebarProps) {
  return (
    <aside className="self-start rounded bg-white p-3.5">
      <h2 className="mb-2 text-base font-bold">Department</h2>
      <ul className="flex flex-col gap-0.5">
        <li>
          <button
            type="button"
            className={itemClass(!activeCategory)}
            onClick={() => onSelect(undefined)}
          >
            All
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className={itemClass(activeCategory === category.slug)}
              onClick={() => onSelect(category.slug)}
            >
              {category.name}{' '}
              <span className="text-xs text-amazon-muted">({category.productCount})</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
