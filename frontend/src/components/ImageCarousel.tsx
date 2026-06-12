import { useState } from 'react';
import type { ProductImage } from '../types';
import styles from './ImageCarousel.module.css';

interface ImageCarouselProps {
  images: ProductImage[];
  title: string;
  /** Used when the product has no gallery images. */
  fallback: string | null;
}

/**
 * Product image gallery: a vertical strip of thumbnails (hover or click to
 * select) beside a large main image — the Amazon detail-page pattern.
 */
export default function ImageCarousel({ images, title, fallback }: ImageCarouselProps) {
  const sources = images.length > 0 ? images.map((image) => image.url) : fallback ? [fallback] : [];
  const [activeIndex, setActiveIndex] = useState(0);

  if (sources.length === 0) {
    return <div className={styles.noImage}>No image available</div>;
  }

  return (
    <div className={styles.gallery}>
      {sources.length > 1 && (
        <div className={styles.thumbs}>
          {sources.map((src, index) => (
            <button
              key={`${index}-${src}`}
              type="button"
              className={index === activeIndex ? styles.thumbActive : styles.thumb}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
            >
              <img src={src} alt="" />
            </button>
          ))}
        </div>
      )}
      <div className={styles.main}>
        <img src={sources[activeIndex]} alt={title} />
      </div>
    </div>
  );
}
