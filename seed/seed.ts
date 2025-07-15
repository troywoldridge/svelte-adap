// seed/seed.ts
import { db } from '../src/lib/db';
import { categories, subcategories, products } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🧹 Clearing old data...');
  await db.delete(products);
  await db.delete(subcategories);
  await db.delete(categories);

  console.log('📦 Seeding fixed top-level categories...');
  const insertedCategories = await db
    .insert(categories)
    .values([
      { name: 'Business Cards' },
      { name: 'Print Products' },
      { name: 'Large Format' },
      { name: 'Stationary' },
      { name: 'Promotional' },
      { name: 'Labels & Packaging' },
      { name: 'Apparel' },
      { name: 'Sample Kits' }
    ])
    .onConflictDoNothing()
    .returning();

  const printProducts = insertedCategories.find(c => c.name === 'Print Products');
  if (!printProducts) {
    throw new Error('❌ Print Products category not found');
  }

  const catalog = [
    {
      name: 'Postcards',
      products: [
        '10pt + Matte Finish',
        '14pt + Matte Finish',
        '16pt + Matte Finish',
        '14pt + UV (High Gloss)',
        '16pt + UV (High Gloss)',
        '18pt Gloss Lamination',
        '18pt Matte / Silk Lamination',
        '10pt + AQ',
        '14pt + AQ',
        '16pt + AQ',
        '13pt Enviro Uncoated',
        '13pt Linen Uncoated',
        '14pt Writable + AQ (C1S)',
        '14pt Writable + UV (C1S)',
        'Metallic Foil',
        'Kraft Paper',
        'Durable',
        'SPOT UV',
        'Pearl Paper'
      ]
    },
    {
      name: 'Flyers',
      products: [
        '100lb Gloss Text',
        '100lb + Matte Finish',
        '100lb + UV (High Gloss)',
        '80lb Enviro Uncoated',
        '70lb Linen Uncoated'
      ]
    },
    {
      name: 'Brochures',
      products: [
        '100lb Gloss Text',
        '100lb + UV (High Gloss)',
        '100lb + Matte Finish',
        '80lb Enviro Uncoated'
      ]
    },
    {
      name: 'Bookmarks',
      products: [
        '14pt + Matte Finish',
        '14pt + UV (High Gloss)',
        '10pt + Matte Finish',
        '18pt Matte / Silk Lamination',
        '18pt Gloss Lamination',
        '14pt Writable + UV (C1S)',
        '16pt + Matte Finish',
        '16pt + UV (High Gloss)',
        '13pt Enviro Uncoated',
        '13pt Linen Uncoated',
        '18pt Matte Lam + SPOT UV'
      ]
    },
    {
      name: 'Booklets',
      products: [
        '80lb Gloss Text (8.5 x 5.5)SALE',
        '80lb Gloss Text (8.5 x 11)SALE',
        '100lb Gloss Text (8.5 x 5.5)',
        '100lb Gloss Text (8.5 x 11)',
        '60lb Offset Text (8.5 x 5.5)',
        '60lb Offset Text (8.5 x 11)',
        '80lb Silk Text (8.5 x 5.5)',
        '80lb Silk Text (8.5 x 11)',
        '100lb Silk Text (8.5 x 5.5)',
        '100lb Silk Text (8.5 x 11)'
      ]
    },
    {
      name: 'Magnets',
      products: [
        'Magnets (14pt)',
        'Car Magnets (30mil)',
        'Cut to Shape Magnets (30mil)',
        'Cut to Shape Magnets (20Mil)'
      ]
    },
    {
      name: 'Greeting Cards',
      products: [
        '14pt + Matte Finish',
        '14pt + UV (High Gloss)',
        '14pt Writable + UV (C1S)',
        '13pt Enviro Uncoated',
        '14pt + AQ',
        '14pt Writable + AQ (C1S)',
        'Metallic Foil',
        'Kraft Paper',
        'Spot UV',
        'Pearl Paper'
      ]
    },
    {
      name: 'Invitations / Announcements',
      products: [
        '14pt Matte Finish',
        '14pt Writable + AQ (C1S)',
        '14pt AQ',
        '14pt UV',
        'Kraft Paper',
        'Pearl Paper',
        'Metallic Foil'
      ]
    },
    {
      name: 'Numbered Tickets',
      products: ['Tickets (14pt)']
    },
    {
      name: 'Wall Calendars',
      products: ['80lb Gloss TextSALE', '100lb Gloss Text']
    },
    {
      name: 'Variable Printing',
      products: ['14pt']
    },
    {
      name: 'Posters',
      products: [
        '100lb Gloss Text',
        '100lb + Matte Finish',
        '100lb + UV (High Gloss)',
        '80lb Enviro Uncoated',
        '8pt C2S'
      ]
    },
    {
      name: 'Door Hangers',
      products: [
        '14pt + Matte Finish',
        '14pt + UV (High Gloss)',
        '13pt Enviro Uncoated',
        '14pt + AQ'
      ]
    },
    {
      name: 'Digital Sheets',
      products: [
        '14pt + Matte Finish',
        '13pt Enviro Uncoated',
        '100lb Gloss Text',
        '100lb + Matte Finish',
        '80lb Enviro Uncoated'
      ]
    },
    {
      name: 'Folded Business Cards',
      products: [
        '14pt + Matte Finish',
        '14pt + UV (High Gloss)',
        '13pt Enviro Uncoated'
      ]
    },
    {
      name: 'Tent Cards',
      products: ['14pt + Matte Finish']
    },
    {
      name: 'Plastics',
      products: ['14pt Plastic']
    },
    {
      name: 'Tear Cards',
      products: [
        '14pt + Matte Finish',
        '14pt + UV (High Gloss)',
        '13pt Enviro Uncoated'
      ]
    },
    {
      name: 'Clings',
      products: ['Transparent Clings', 'White Opaque Clings']
    }
  ];

  

  console.log(`📂 Inserting subcategories and products under "${printProducts.name}"...`);

  for (const sub of catalog) {
    const insertedSub = await db
      .insert(subcategories)
      .values({
        name: sub.name,
        categoryId: printProducts.id
      })
      .returning({ id: subcategories.id });

    const subId = insertedSub[0]?.id;
    if (!subId) continue;

    await db.insert(products).values(
      sub.products.map(name => ({
        name,
        subcategoryId: subId
      }))
    );
  }

  

  console.log('✅ All products seeded successfully.');
}



seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
