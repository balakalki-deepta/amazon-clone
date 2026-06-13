import styles from './ProductFeatures.module.css';

export interface ProductFeature {
  icon: string;
  label: string;
  sub?: string;
}

/** Amazon-style horizontal row of trust/feature icons (delivery, returns, etc.). */
export default function ProductFeatures({ features }: { features: ProductFeature[] }) {
  if (features.length === 0) {
    return null;
  }
  return (
    <div className={styles.row}>
      {features.map((feature) => (
        <div key={feature.label} className={styles.feature}>
          <span className={styles.icon}>{feature.icon}</span>
          <span className={styles.label}>{feature.label}</span>
          {feature.sub && <span className={styles.sub}>{feature.sub}</span>}
        </div>
      ))}
    </div>
  );
}
