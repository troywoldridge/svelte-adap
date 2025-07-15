import { db } from '../src/lib/db';
import { categories, subcategories, products } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedApparel() {
  console.log('🧢 Seeding: Apparel...');

  // Try inserting, but fetch if it already exists
  const inserted = await db
    .insert(categories)
    .values({ name: 'Apparel' })
    .onConflictDoNothing()
    .returning({ id: categories.id });

  let categoryId = inserted[0]?.id;

  if (!categoryId) {
    const existing = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.name, 'Apparel'))
      .limit(1);

    categoryId = existing[0]?.id;
  }

  if (!categoryId) {
    throw new Error('❌ Failed to get Apparel category ID');
  }

  const catalog = [
    {
      name: 'T-Shirts',
      products: [
        'Short Sleeve Cotton T-Shirts',
        'Performance T-Shirts',
        'Long Sleeve T-Shirts',
        'Ringer T-Shirts',
        'Youth T-Shirts'
      ]
    },
    {
      name: 'Hoodies & Sweatshirts',
      products: [
        'Pullover Hoodies',
        'Zip-Up Hoodies',
        'Crewneck Sweatshirts',
        'Fleece Hoodies'
      ]
    },
    {
      name: 'Headwear',
      products: [
        'Baseball Caps',
        'Beanies',
        'Trucker Hats',
        'Snapbacks'
      ]
    },
    {
      name: 'Workwear',
      products: [
        'Hi-Vis Vests',
        'Polo Shirts',
        'Aprons',
        'Button-Down Work Shirts'
      ]
    },
    {
      name: 'Outerwear',
      products: [
        'Windbreakers',
        'Softshell Jackets',
        'Puffer Vests',
        'Rain Jackets'
      ]
    }
  ];

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

  console.log('✅ Apparel seeded successfully.');
}

seedApparel().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
