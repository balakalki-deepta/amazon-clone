import type { ProductDetail } from '../../types';
import styles from './ProductInfoSection.module.css';

interface ProductInfoSectionProps {
  product: ProductDetail;
}

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
    <section className={styles.section}>
      {product.description && (
        <>
          <h2 className={styles.heading}>Product description</h2>
          <p className={styles.description}>{product.description}</p>
          <div className={styles.images}>
            {uniqueImages.map((url, index) => (
              <img
                key={url}
                src={url}
                alt={`${product.title} — view ${index + 1}`}
                className={styles.image}
                loading="lazy"
              />
            ))}
          </div>
        </>
      )}

      {rows.length > 0 && (
        <>
          <h2 className={styles.heading}>Product information</h2>
          <table className={styles.table}>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label}>
                  <th>{row.label}</th>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </section>
  );
}
