import { useState } from 'react';
import type { ProductImage } from '../types';
import { cn } from '@/lib/utils';

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
    return (
      <div className="flex min-h-[360px] items-center justify-center bg-white text-amazon-muted">
        No image available
      </div>
    );
  }

  return (
    <div className="flex gap-3 max-[600px]:flex-col-reverse">
      {sources.length > 1 && (
        <div className="flex flex-col gap-2 max-[600px]:flex-row max-[600px]:overflow-x-auto">
          {sources.map((src, index) => (
            <button
              key={`${index}-${src}`}
              type="button"
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-md border bg-white p-0.5',
                index === activeIndex && 'border-amazon-link shadow-[0_0_0_1px_#007185]',
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1}`}
            >
              <img src={src} alt="" className="max-h-full max-w-full object-contain" />
            </button>
          ))}
        </div>
      )}
      <div className="flex min-h-[360px] flex-1 items-center justify-center bg-white">
        <img
          src={sources[activeIndex]}
          alt={title}
          className="max-h-[420px] max-w-full object-contain"
        />
      </div>
    </div>
  );
}
