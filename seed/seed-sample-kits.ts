// seed/seed-sample-kits.ts
import { db } from '../src/lib/db';
import { categories, subcategories, products } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedSampleKits() {
  console.log('📦 Seeding: Sample Kits...');

  // Step 1: Insert or retrieve "Sample Kits" category
  const inserted = await db
    .insert(categories)
    .values({ name: 'Sample Kits' })
    .onConflictDoNothing()
    .returning({ id: categories.id });

  let categoryId = inserted[0]?.id;

  if (!categoryId) {
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, 'Sample Kits'))
      .limit(1);

    categoryId = existing[0]?.id;
  }

  if (!categoryId) {
    throw new Error('❌ Sample Kits category already exists or failed to insert.');
  }

  // Step 2: Define subcategories and products
  const catalog = [
    {
      name: 'Business Card Kits',
      products: [
        'Standard Business Card Kit',
        'Specialty Business Card Kit',
        'Writable Coatings Kit'
      ]
    },
    {
      name: 'Paper Swatch Kits',
      products: [
        'Uncoated Swatch Kit',
        'Glossy Paper Kit',
        'Eco-Friendly Paper Kit'
      ]
    },
    {
      name: 'Large Format Kits',
      products: [
        'Vinyl Samples Kit',
        'Rigid Substrate Kit',
        'Banner Materials Kit'
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

  console.log('✅ Sample Kits seeded successfully.');
}

seedSampleKits().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
