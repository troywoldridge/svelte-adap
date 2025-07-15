// seed/seed-business-cards.ts
import { db } from '../src/lib/db';
import { categories, subcategories, products } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedBusinessCards() {
  console.log('🧹 Removing existing Business Cards data if present...');

  // Check if category already exists
  const existingCategory = await db
    .select()
    .from(categories)
    .where(eq(categories.name, 'Business Cards'))
    .then(rows => rows[0]);

  if (existingCategory) {
    const subs = await db
      .select()
      .from(subcategories)
      .where(eq(subcategories.categoryId, existingCategory.id));

    const subIds = subs.map(s => s.id);

    if (subIds.length > 0) {
      await db.delete(products).where(
        subcategories.id.in(subIds)
      );
      await db.delete(subcategories).where(
        eq(subcategories.categoryId, existingCategory.id)
      );
    }

    await db.delete(categories).where(eq(categories.id, existingCategory.id));
    console.log('🗑️ Old Business Cards data removed.');
  }

  console.log('📦 Inserting Business Cards category...');
  const [businessCards] = await db
    .insert(categories)
    .values({ name: 'Business Cards' })
    .returning({ id: categories.id });

  const [standardSub, specialtySub] = await db
    .insert(subcategories)
    .values([
      { name: 'Standard', categoryId: businessCards.id },
      { name: 'Specialty', categoryId: businessCards.id }
    ])
    .returning({ id: subcategories.id, name: subcategories.name });

  const standardProducts = [
    'Quick Ship Business Cards',
    '14pt (Profit Maximizer)',
    '14pt + Matte Finish',
    '14pt + UV (High Gloss)',
    '16pt + Matte Finish',
    '16pt + UV (High Gloss)',
    '13pt Enviro Uncoated',
    '14pt Writable + AQ (C1S)',
    '14pt Writable + UV (C1S)'
  ];

  const specialtyProducts = [
    'Metallic Foil (Raised)',
    'Kraft Paper',
    'Spot UV',
    'Die Cut',
    '32pt Painted Edge',
    'Pearl Paper',
    'Laminated',
    'Plastic'
  ];

  console.log('📂 Inserting Standard products...');
  await db.insert(products).values(
    standardProducts.map(name => ({
      name,
      subcategoryId: standardSub.id
    }))
  );

  console.log('📂 Inserting Specialty products...');
  await db.insert(products).values(
    specialtyProducts.map(name => ({
      name,
      subcategoryId: specialtySub.id
    }))
  );

  console.log('✅ Business Cards seeding complete!');
}

seedBusinessCards().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
