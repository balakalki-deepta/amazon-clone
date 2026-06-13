/**
 * One-off, idempotent data backfill: ensure every product has at least two
 * images so the carousel/thumbnail strip always shows.
 *
 * Unlike the seed, this NEVER clears data — it only *adds* missing images to
 * products that have fewer than two. It's safe to run on every deploy (it's a
 * no-op once all products already have >= 2 images), which is how the live
 * database gets fixed without a destructive re-seed.
 *
 * For a product with one image it adds the product's thumbnail as a distinct
 * second image (falling back to duplicating the existing image).
 *
 * Run with:  npm run db:backfill-images
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const products = await prisma.product.findMany({
    include: { images: { orderBy: { position: 'asc' } } },
  });

  const newImages: Prisma.ProductImageCreateManyInput[] = [];

  for (const product of products) {
    if (product.images.length >= 2) {
      continue; // already fine
    }

    const firstUrl = product.images[0]?.url ?? product.thumbnailUrl;
    if (!firstUrl) {
      continue; // nothing we can use for this product
    }

    // Prefer a genuinely different second image (the thumbnail); else duplicate.
    const secondUrl =
      product.thumbnailUrl && product.thumbnailUrl !== firstUrl ? product.thumbnailUrl : firstUrl;

    if (product.images.length === 0) {
      newImages.push({ productId: product.id, url: firstUrl, position: 0, altText: product.title });
      newImages.push({
        productId: product.id,
        url: secondUrl,
        position: 1,
        altText: product.title,
      });
    } else {
      // Exactly one image at position 0 — add the second.
      newImages.push({
        productId: product.id,
        url: secondUrl,
        position: 1,
        altText: product.title,
      });
    }
  }

  if (newImages.length === 0) {
    console.log('✅ All products already have at least two images — nothing to backfill.');
    return;
  }

  await prisma.productImage.createMany({ data: newImages });
  console.log(`✅ Backfilled ${newImages.length} image row(s).`);
}

main()
  .catch((error) => {
    console.error('❌ Image backfill failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
