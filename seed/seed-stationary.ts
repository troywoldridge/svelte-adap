// seed/seed-stationary.ts
import { db } from '../src/lib/db';
import { categories, subcategories, products } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedStationary() {
  console.log('📝 Seeding: Stationary');

  // 1. Find or insert "Stationary" category
  let categoryRecord = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, 'Stationary'))
    .then(rows => rows[0]);

  if (!categoryRecord) {
    [categoryRecord] = await db
      .insert(categories)
      .values({ name: 'Stationary' })
      .returning({ id: categories.id });
    console.log('📁 Inserted new category: Stationary');
  } else {
    console.log('📁 Found existing category: Stationary');
  }

  const subcats = [
    {
      name: 'Letterhead',
      products: ['70lb Uncoated', '70lb Linen']
    },
    {
      name: 'Envelopes',
      products: ['#10 Regular', '#10 Window', '6x9 Booklet', '9x12 Booklet']
    },
    {
      name: 'Notepads',
      products: ['50 Sheets', '100 Sheets', 'Custom Sizes']
    },
    {
      name: 'NCR Forms',
      products: ['2 Part (White/Canary)', '3 Part (White/Canary/Pink)']
    },
    {
      name: 'Supply Boxes',
      products: ['Stationary Box - Small', 'Stationary Box - Large']
    }
  ];

  for (const sub of subcats) {
    // 2. Insert subcategory
    const [subcat] = await db
      .insert(subcategories)
      .values({
        name: sub.name,
        categoryId: categoryRecord.id
      })
      .returning({ id: subcategories.id });

    // 3. Insert all products under the subcategory
    await db.insert(products).values(
      sub.products.map((prodName) => ({
        name: prodName,
        subcategoryId: subcat.id
      }))
    );
    console.log(`📂 Subcategory "${sub.name}" with ${sub.products.length} products seeded.`);
  }

  console.log('✅ Done seeding: Stationary');
}

seedStationary().catch((err) => {
  console.error('❌ Failed seeding Stationary:', err);
  process.exit(1);
});
