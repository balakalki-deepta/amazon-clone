/**
 * Database seed script.
 *
 * Pulls the product catalog from the public DummyJSON API and loads it into our
 * schema: categories (deduplicated), products, product images, and product
 * specifications — plus a single default user (the assignment's "logged-in user").
 *
 * We only store image *URLs* (DummyJSON hosts the binaries on its CDN), which is
 * exactly how a real catalog references an object store / CDN.
 *
 * Run with:  npm run db:seed        (from the backend/ folder)
 */

import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// limit=0 tells DummyJSON to return the entire catalog in one response.
const DUMMYJSON_URL = 'https://dummyjson.com/products?limit=0';

const DEFAULT_USER = {
  email: 'demo@amazonclone.dev',
  name: 'Demo User',
};

// ---------------------------------------------------------------------------
// Source data shape (only the fields we actually consume).
// ---------------------------------------------------------------------------

interface DummyDimensions {
  width?: number;
  height?: number;
  depth?: number;
}

interface DummyProduct {
  id: number;
  title: string;
  description?: string;
  category: string;
  price: number;
  discountPercentage?: number;
  rating?: number;
  stock?: number;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: DummyDimensions;
  warrantyInformation?: string;
  shippingInformation?: string;
  returnPolicy?: string;
  minimumOrderQuantity?: number;
  images?: string[];
  thumbnail?: string;
}

interface DummyResponse {
  products: DummyProduct[];
  total: number;
}

// ---------------------------------------------------------------------------
// Small pure helpers.
// ---------------------------------------------------------------------------

/** "Mens Watches" -> "mens-watches" (URL-safe, lower-case). */
function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** "home-decoration" -> "Home Decoration" (human-friendly display name). */
function humanize(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/** Build ordered image rows; safely handles a missing/empty images array. */
function buildImages(product: DummyProduct): Prisma.ProductImageCreateWithoutProductInput[] {
  let urls = (product.images ?? []).filter((url): url is string => Boolean(url));

  // Fall back to the thumbnail when there are no gallery images.
  if (urls.length === 0 && product.thumbnail) {
    urls = [product.thumbnail];
  }
  // Ensure at least two images so the carousel/thumbnail strip always shows.
  // Prefer a genuinely different image (the product thumbnail) as the second;
  // only duplicate the single image when nothing else is available.
  if (urls.length === 1) {
    urls =
      product.thumbnail && product.thumbnail !== urls[0]
        ? [urls[0], product.thumbnail]
        : [urls[0], urls[0]];
  }

  return urls.map((url, index) => ({
    url,
    position: index,
    altText: product.title,
  }));
}

/** Map the source's scattered detail fields into key/value spec rows, skipping anything missing. */
function buildSpecifications(
  product: DummyProduct,
): Prisma.ProductSpecificationCreateWithoutProductInput[] {
  const specs: { specKey: string; specValue: string }[] = [];

  if (product.brand) {
    specs.push({ specKey: 'Brand', specValue: product.brand });
  }
  if (typeof product.weight === 'number') {
    specs.push({ specKey: 'Weight', specValue: `${product.weight} kg` });
  }
  if (product.dimensions) {
    const { width, height, depth } = product.dimensions;
    if (width != null && height != null && depth != null) {
      specs.push({ specKey: 'Dimensions', specValue: `${width} × ${height} × ${depth} cm` });
    }
  }
  if (product.warrantyInformation) {
    specs.push({ specKey: 'Warranty', specValue: product.warrantyInformation });
  }
  if (product.shippingInformation) {
    specs.push({ specKey: 'Shipping', specValue: product.shippingInformation });
  }
  if (product.returnPolicy) {
    specs.push({ specKey: 'Return Policy', specValue: product.returnPolicy });
  }
  if (typeof product.minimumOrderQuantity === 'number') {
    specs.push({
      specKey: 'Minimum Order Quantity',
      specValue: String(product.minimumOrderQuantity),
    });
  }

  return specs.map((spec, index) => ({ ...spec, position: index }));
}

// ---------------------------------------------------------------------------
// Data access steps.
// ---------------------------------------------------------------------------

async function fetchProducts(): Promise<DummyProduct[]> {
  const response = await fetch(DUMMYJSON_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as DummyResponse;
  return data.products ?? [];
}

/**
 * Wipe existing data so the seed is idempotent (safe to re-run).
 * Deletion order respects foreign keys: children before parents.
 */
async function clearDatabase(): Promise<void> {
  await prisma.$transaction([
    prisma.orderItem.deleteMany(),
    prisma.order.deleteMany(),
    prisma.cartItem.deleteMany(),
    prisma.cart.deleteMany(),
    prisma.productSpecification.deleteMany(),
    prisma.productImage.deleteMany(),
    prisma.product.deleteMany(),
    prisma.category.deleteMany(),
    prisma.address.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

async function seedDefaultUser(): Promise<void> {
  await prisma.user.create({ data: DEFAULT_USER });
}

/**
 * Create one category per distinct source category slug (deduplicated via a Set),
 * and return a slug -> id map so products can be linked.
 */
async function seedCategories(products: DummyProduct[]): Promise<Map<string, number>> {
  const slugs = [...new Set(products.map((p) => p.category).filter(Boolean))];
  const slugToId = new Map<string, number>();

  for (const slug of slugs) {
    const category = await prisma.category.create({
      data: { name: humanize(slug), slug },
    });
    slugToId.set(slug, category.id);
  }

  return slugToId;
}

/**
 * Create products with their images and specs using nested writes, all inside a
 * single transaction so the catalog is loaded atomically (all or nothing).
 * Guarantees unique slug/sku even if the source has collisions.
 */
async function seedProducts(
  products: DummyProduct[],
  categoryMap: Map<string, number>,
): Promise<number> {
  const usedSlugs = new Set<string>();
  const usedSkus = new Set<string>();
  const creates: Prisma.PrismaPromise<unknown>[] = [];

  for (const product of products) {
    const categoryId = categoryMap.get(product.category);
    if (categoryId === undefined) {
      continue; // category missing from source — skip safely
    }

    // Ensure a unique, URL-safe slug.
    let slug = slugify(product.title) || `product-${product.id}`;
    if (usedSlugs.has(slug)) {
      slug = `${slug}-${product.id}`;
    }
    usedSlugs.add(slug);

    // Ensure a unique SKU (nulls are allowed to repeat; non-null must be unique).
    let sku: string | null = product.sku ?? null;
    if (sku) {
      if (usedSkus.has(sku)) {
        sku = `${sku}-${product.id}`;
      }
      usedSkus.add(sku);
    }

    creates.push(
      prisma.product.create({
        data: {
          title: product.title,
          slug,
          description: product.description ?? '',
          brand: product.brand ?? null,
          sku,
          price: product.price,
          discountPercentage: product.discountPercentage ?? 0,
          stock: product.stock ?? 0,
          rating: product.rating ?? null,
          thumbnailUrl: product.thumbnail ?? null,
          category: { connect: { id: categoryId } },
          images: { create: buildImages(product) },
          specifications: { create: buildSpecifications(product) },
        },
      }),
    );
  }

  await prisma.$transaction(creates);
  return creates.length;
}

// ---------------------------------------------------------------------------
// Entry point.
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('🌱 Seeding database...');

  // Idempotent guard: skip if the catalog is already populated, so this is safe
  // to run on every deploy without wiping existing orders. Set FORCE_SEED=true
  // to re-seed anyway (this clears and reloads everything).
  const force = process.env.FORCE_SEED === 'true';
  const existingProducts = await prisma.product.count();
  if (!force && existingProducts > 0) {
    console.log(
      `   Database already has ${existingProducts} products — skipping (set FORCE_SEED=true to re-seed).`,
    );
    return;
  }

  const products = await fetchProducts();
  console.log(`   Fetched ${products.length} products from DummyJSON.`);

  await clearDatabase();
  console.log('   Cleared existing data.');

  await seedDefaultUser();
  console.log(`   Created default user: ${DEFAULT_USER.email}`);

  const categoryMap = await seedCategories(products);
  console.log(`   Created ${categoryMap.size} categories.`);

  const productCount = await seedProducts(products, categoryMap);
  console.log(`   Created ${productCount} products with images & specifications.`);

  console.log('✅ Seed complete.');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
