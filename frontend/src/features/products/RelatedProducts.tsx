import { useEffect, useRef, useState } from 'react';
import { getProducts } from '../../api/products';
import type { Product } from '../../types';
import ProductCard from '../../components/ProductCard';
import styles from './RelatedProducts.module.css';

interface RelatedProductsProps {
  categorySlug: string;
  excludeId: number;
}

/** Horizontal "related items" carousel: other products in the same category. */
export default function RelatedProducts({ categorySlug, excludeId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    getProducts({ category: categorySlug, limit: 20 })
      .then((result) => {
        if (!cancelled) setProducts(result.products.filter((product) => product.id !== excludeId));
      })
      .catch(() => {
        // Related items are non-critical; leave the section empty on failure.
      });
    return () => {
      cancelled = true;
    };
  }, [categorySlug, excludeId]);

  if (products.length === 0) {
    return null;
  }

  const scrollByAmount = (amount: number) =>
    trackRef.current?.scrollBy({ left: amount, behavior: 'smooth' });

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Products related to this item</h2>
      <div className={styles.carousel}>
        <button
          type="button"
          className={styles.navLeft}
          aria-label="Scroll left"
          onClick={() => scrollByAmount(-600)}
        >
          ‹
        </button>
        <div className={styles.track} ref={trackRef}>
          {products.map((product) => (
            <div key={product.id} className={styles.item}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <button
          type="button"
          className={styles.navRight}
          aria-label="Scroll right"
          onClick={() => scrollByAmount(600)}
        >
          ›
        </button>
      </div>
    </section>
  );
}
