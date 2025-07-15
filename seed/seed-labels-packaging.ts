// seed/seed-labels-packaging.ts
import { db } from '../src/lib/db';
import { categories, subcategories, products } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedLabelsPackaging() {
  console.log('📦 Seeding: Labels & Packaging...');

  // Step 1: Insert or get existing category
  const inserted = await db
    .insert(categories)
    .values({ name: 'Labels & Packaging' })
    .onConflictDoNothing()
    .returning({ id: categories.id });

  let categoryId = inserted[0]?.id;

  if (!categoryId) {
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, 'Labels & Packaging'))
      .limit(1);

    categoryId = existing[0]?.id;
  }

  if (!categoryId) {
    throw new Error('❌ Labels & Packaging category already exists or failed to insert.');
  }

  // Step 2: Define subcategories and products
  const catalog = [
    {
      name: 'Labels',
      products: [
        'Gloss Paper Labels',
        'Matte Paper Labels',
        'Clear Poly Labels',
        'Foil Labels',
        'Waterproof Vinyl Labels',
        'Roll Labels'
      ]
    },
    {
      name: 'Stickers',
      products: [
        'Die-Cut Stickers',
        'Kiss-Cut Stickers',
        'Circle Stickers',
        'Square Stickers',
        'Bumper Stickers'
      ]
    },
    {
      name: 'Packaging',
      products: [
        'Custom Boxes',
        'Mailer Boxes',
        'Product Sleeves',
        'Hang Tags',
        'Bag Labels'
      ]
    }
  ];

  // Step 3: Insert subcategories and products
  for (const sub of catalog) {
    const insertedSub = await db
      .insert(subcategories)
      .values({ name: sub.name, categoryId })
      .onConflictDoNothing()
      .returning({ id: subcategories.id });

    let subcategoryId = insertedSub[0]?.id;

    if (!subcategoryId) {
      const existingSub = await db
        .select({ id: subcategories.id })
        .from(subcategories)
        .where(eq(subcategories.name, sub.name))
        .limit(1);
      subcategoryId = existingSub[0]?.id;
    }

    if (!subcategoryId) continue;

    await db.insert(products).values(
      sub.products.map((name) => ({
        name,
        subcategoryId
      }))
    );
  }

  console.log('✅ Labels & Packaging seeded successfully.');
}

seedLabelsPackaging().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
