import type { ProductDetail } from '../../types';

interface ProductInfoSectionProps {
  product: ProductDetail;
}

const headingClass =
  'mb-3 border-t border-amazon-border pt-4 text-[22px] font-semibold [&:not(:first-child)]:mt-7';

/**
 * End-of-page detail block (Amazon style): a "Product description" with stacked
 * images, then a "Product information" table built from the product's specs.
 */
export default function ProductInfoSection({ product }: ProductInfoSectionProps) {
  const uniqueImages = [...new Set(product.images.map((image) => image.url))];
  const spec = (key: string) => product.specifications.find((s) => s.key === key)?.value;

  const rows: { label: string; value: string }[] = [];
  const addRow = (label: string, value: string | null | undefined) => {
    if (value) rows.push({ label, value });
  };
  addRow('Brand', product.brand);
  addRow('Category', product.category.name);
  addRow('Item model number', product.sku);
  addRow('Item weight', spec('Weight'));
  addRow('Product dimensions', spec('Dimensions'));
  addRow(
    'Customer rating',
    product.rating !== null ? `${product.rating.toFixed(1)} out of 5` : null,
  );
  addRow('Warranty', spec('Warranty'));
  addRow('Shipping', spec('Shipping'));
  addRow('Returns', spec('Return Policy'));
  addRow('Minimum order quantity', spec('Minimum Order Quantity'));

  return (
    <section className="mt-2">
      {product.description && (
        <>
          <h2 className={headingClass}>Product description</h2>
          <p className="max-w-[800px] text-sm leading-[1.7] text-amazon-ink">
            {product.description}
          </p>
          <div className="mt-4 flex flex-col items-center gap-5">
            {uniqueImages.map((url, index) => (
              <img
                key={url}
                src={url}
                alt={`${product.title} — view ${index + 1}`}
                className="w-full max-w-[600px] object-contain"
                loading="lazy"
              />
            ))}
          </div>
        </>
      )}

      {rows.length > 0 && (
        <>
          <h2 className={headingClass}>Product information</h2>
          <table className="w-full max-w-[800px] border-collapse text-sm">
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th className="w-[35%] border-b border-amazon-border bg-[#f7f8f8] px-3 py-[9px] text-left align-top font-semibold text-amazon-muted">
                    {row.label}
                  </th>
                  <td className="border-b border-amazon-border px-3 py-[9px] text-left align-top">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
