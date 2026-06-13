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
    <span
      className="relative inline-block text-sm leading-none tracking-[1px]"
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
    >
      <span className="text-[#d5d9d9]">★★★★★</span>
      <span
        className="absolute left-0 top-0 overflow-hidden whitespace-nowrap text-amazon-star"
        style={{ width: `${fillPercent}%` }}
      >
        ★★★★★
      </span>
    </span>
  );
}
