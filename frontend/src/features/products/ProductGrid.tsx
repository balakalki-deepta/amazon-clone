import type { Product } from '../../types';
import ProductCard from '../../components/ProductCard';

interface ProductGridProps {
  products: Product[];
}

/** Responsive grid: 2 columns on phones, auto-fill from ~220px up. */
export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 min-[520px]:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] min-[520px]:gap-3.5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
