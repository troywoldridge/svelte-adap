// seed/seed-promotional.ts
import { db } from '../src/lib/db';
import { categories, subcategories, products } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seedPromotional() {
  console.log('🎁 Seeding: Promotional');

  // 1. Find or insert the "Promotional" category
  let categoryRecord = await db
    .select({ id: categories.id })
    .from(categories)
    .where(eq(categories.name, 'Promotional'))
    .then(rows => rows[0]);

  if (!categoryRecord) {
    [categoryRecord] = await db
      .insert(categories)
      .values({ name: 'Promotional' })
      .returning({ id: categories.id });
    console.log('📁 Inserted new category: Promotional');
  } else {
    console.log('📁 Found existing category: Promotional');
  }

  const promoData = [
    {
      name: 'Pens',
      products: [
        'Stick Pens',
        'Click Pens',
        'Gel Pens',
        'Eco Pens',
        'Stylus Pens'
      ]
    },
    {
      name: 'Drinkware',
      products: [
        '11oz Mugs',
        '20oz Tumblers',
        'Water Bottles',
        'Custom Can Coolers'
      ]
    },
    {
      name: 'Tech Accessories',
      products: [
        'Phone Wallets',
        'Pop Grips',
        'USB Drives',
        'Bluetooth Speakers'
      ]
    },
    {
      name: 'Office Items',
      products: [
        'Sticky Notes',
        'Desk Pads',
        'Clipboards',
        'Lanyards'
      ]
    },
    {
      name: 'Bags',
      products: [
        'Drawstring Backpacks',
        'Reusable Grocery Bags',
        'Tote Bags',
        'Laptop Sleeves'
      ]
    }
  ];

  for (const sub of promoData) {
    const [subcat] = await db
      .insert(subcategories)
      .values({
        name: sub.name,
        categoryId: categoryRecord.id
      })
      .returning({ id: subcategories.id });

    await db.insert(products).values(
      sub.products.map(productName => ({
        name: productName,
        subcategoryId: subcat.id
      }))
    );

    console.log(`📂 Subcategory "${sub.name}" with ${sub.products.length} products seeded.`);
  }

  console.log('✅ Done seeding: Promotional');
}

seedPromotional().catch((err) => {
  console.error('❌ Failed seeding Promotional:', err);
  process.exit(1);
});
