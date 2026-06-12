import type { Category } from '../../types';
import styles from './CategorySidebar.module.css';

interface CategorySidebarProps {
  categories: Category[];
  activeCategory?: string;
  /** Called with a slug to filter, or undefined to clear the filter. */
  onSelect: (slug?: string) => void;
}

/** Amazon-style "Department" filter list. */
export default function CategorySidebar({
  categories,
  activeCategory,
  onSelect,
}: CategorySidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.heading}>Department</h2>
      <ul className={styles.list}>
        <li>
          <button
            type="button"
            className={activeCategory ? styles.link : styles.active}
            onClick={() => onSelect(undefined)}
          >
            All
          </button>
        </li>
        {categories.map((category) => (
          <li key={category.id}>
            <button
              type="button"
              className={activeCategory === category.slug ? styles.active : styles.link}
              onClick={() => onSelect(category.slug)}
            >
              {category.name} <span className={styles.count}>({category.productCount})</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
