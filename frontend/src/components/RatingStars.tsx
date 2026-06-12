import styles from './RatingStars.module.css';

interface RatingStarsProps {
  /** 0–5; null renders an empty row of stars. */
  rating: number | null;
}

/**
 * Five stars with a partial orange fill proportional to the rating, achieved by
 * overlaying a clipped filled row on top of a grey row.
 */
export default function RatingStars({ rating }: RatingStarsProps) {
  const value = rating ?? 0;
  const fillPercent = (value / 5) * 100;

  return (
    <span className={styles.stars} role="img" aria-label={`${value.toFixed(1)} out of 5 stars`}>
      <span className={styles.back}>★★★★★</span>
      <span className={styles.front} style={{ width: `${fillPercent}%` }}>
        ★★★★★
      </span>
    </span>
  );
}
