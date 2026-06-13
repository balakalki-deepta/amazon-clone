import type { ReactNode } from 'react';
import styles from './ProductFeatures.module.css';

export type FeatureIconName = 'delivery' | 'returns' | 'warranty' | 'cod' | 'secure' | 'brand';

export interface ProductFeature {
  name: FeatureIconName;
  label: string;
}

// Small line icons (Amazon-style), drawn with currentColor so CSS controls the tint.
const ICONS: Record<FeatureIconName, ReactNode> = {
  delivery: (
    <>
      <path d="M3 7h11v8H3z" />
      <path d="M14 10h3.5L21 13v2h-7" />
      <circle cx="7.5" cy="17" r="1.6" />
      <circle cx="17" cy="17" r="1.6" />
    </>
  ),
  returns: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" />
      <path d="M20 4v4h-4" />
    </>
  ),
  warranty: (
    <>
      <path d="M12 3l7 3v5c0 4.5-3 7.4-7 9-4-1.6-7-4.5-7-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  cod: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="1.5" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  secure: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="1.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
  brand: (
    <>
      <circle cx="12" cy="9" r="5" />
      <path d="M8.5 13l-1 7L12 18l4.5 2-1-7" />
    </>
  ),
};

/** Amazon-style row of small trust/feature icons with short labels. */
export default function ProductFeatures({ features }: { features: ProductFeature[] }) {
  if (features.length === 0) {
    return null;
  }
  return (
    <div className={styles.row}>
      {features.map((feature) => (
        <div key={feature.label} className={styles.feature}>
          <span className={styles.iconWrap}>
            <svg
              viewBox="0 0 24 24"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {ICONS[feature.name]}
            </svg>
          </span>
          <span className={styles.label}>{feature.label}</span>
        </div>
      ))}
    </div>
  );
}
