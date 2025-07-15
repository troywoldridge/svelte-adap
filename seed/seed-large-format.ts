// seed/seed-large-format.ts
import { db } from '../src/lib/db';
import { categories, subcategories, products } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedLargeFormat() {
  console.log('📦 Seeding "Large Format"...');

  // Step 1: Check if category already exists
  const existingCategory = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, 'Large Format'));


  const largeFormatCategoryId = existingCategory[0]?.id;

  let categoryId: number;

  if (largeFormatCategoryId) {
    console.log('⚠️ "Large Format" already exists. Reusing it.');
    categoryId = largeFormatCategoryId;
  } else {
    const inserted = await db
      .insert(categories)
      .values({ name: 'Large Format' })
      .returning({ id: categories.id });
    categoryId = inserted[0].id;
    console.log('✅ Inserted "Large Format" category.');
  }

  // Define subcategories and products
  const largeFormat = [
    {
      name: 'Coroplast Signs',
      products: ['4mm Coroplast (Single Sided)', '4mm Coroplast (Double Sided)', '10mm Coroplast']
    },
    {
      name: 'Banners',
      products: ['13oz Matte Vinyl Banner', '13oz Gloss Vinyl Banner', '18oz Heavy Duty Banner']
    },
    {
      name: 'Aluminum Signs',
      products: ['.040 Aluminum', '.063 Aluminum', 'Reflective Aluminum']
    },
    {
      name: 'Table Covers',
      products: ['6ft Stretch Cover', '8ft Stretch Cover', '6ft Throw Cover']
    },
    {
      name: 'Adhesive Vinyl',
      products: ['Calendared Vinyl', 'Cast Vinyl with Laminate', 'Floor Graphics']
    },
    {
      name: 'Window Graphics',
      products: ['Perforated Vinyl', 'Static Cling', 'Opaque Window Decals']
    }
  ];

  for (const sub of largeFormat) {
    const subcatInsert = await db
      .insert(subcategories)
      .values({
        name: sub.name,
        categoryId
      })
      .returning({ id: subcategories.id });

    const subcategoryId = subcatInsert[0]?.id;

    if (!subcategoryId) {
      console.warn(`❌ Failed to insert subcategory: ${sub.name}`);
      continue;
    }

    await db.insert(products).values(
      sub.products.map((name) => ({
        name,
        subcategoryId
      }))
    );

    console.log(`✅ Inserted "${sub.name}" with ${sub.products.length} products`);
  }

  console.log('🎉 "Large Format" seeding complete.');
}

seedLargeFormat().catch((err) => {
  console.error('❌ Seeding error:', err);
  process.exit(1);
});
