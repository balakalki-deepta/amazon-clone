import { useEffect, useRef, useState } from 'react';
import { getProducts } from '../../api/products';
import type { Product } from '../../types';
import ProductCard from '../../components/ProductCard';
import { Button } from '@/components/ui/button';

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
    <section className="mt-2">
      <h2 className="mb-3.5 border-t border-amazon-border pt-4 text-xl font-semibold">
        Products related to this item
      </h2>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="flex-none rounded-full text-xl"
          aria-label="Scroll left"
          onClick={() => scrollByAmount(-600)}
        >
          ‹
        </Button>
        <div
          ref={trackRef}
          className="flex min-w-0 flex-1 gap-3.5 overflow-x-auto scroll-smooth pb-1.5"
        >
          {products.map((product) => (
            <div key={product.id} className="w-[200px] flex-none max-[520px]:w-[150px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="flex-none rounded-full text-xl"
          aria-label="Scroll right"
          onClick={() => scrollByAmount(600)}
        >
          ›
        </Button>
      </div>
    </section>
  );
}
