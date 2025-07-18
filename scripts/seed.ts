import { db } from '../src/lib/db';
import { subcategories } from '../src/lib/db/schema';

import { v4 as uuidv4 } from 'uuid';

const CATEGORY_MAP = {
  'Business Cards': 'a389c7a3-1b7a-5a7f-9e7f-67331b0ce95d',
  'Print Products': '8e36b2eb-f6e7-5d2b-8aee-afb66dccd1d3',
  'Labels / Stickers': '57c05394-9fae-5dcb-aac4-576afca7c16f',
  'Stationary': '9ec3ddd0-26a0-5722-933a-cf914908faeb',
  'Large Format': '048824be-65ac-5d38-ac90-db96c1cc4bd8',
  'Promotional': '0592a955-ca84-581b-a764-cee13df5d31d',
  'Apparel': 'ef09e14a-01ad-599f-81db-48ac9839d982'
};

const SUBCATEGORY_CATEGORY_MAP: Record<string, string> = {
  'Specialty Business Cards': 'Business Cards',
  'Folded Business Cards': 'Business Cards',

  'Postcards': 'Print Products',
  'Flyers': 'Print Products',
  'Brochures': 'Print Products',
  'Booklets': 'Print Products',
  'Bookmarks': 'Print Products',
  'Greeting Cards': 'Print Products',
  'Posters': 'Print Products',
  'Door Hangers': 'Print Products',
  'Presentation Folders': 'Print Products',
  'Variable Printing': 'Print Products',
  'Tear Cards': 'Print Products',
  'Tent Cards': 'Print Products',
  'Digital Sheets': 'Print Products',
  'Specialty Post Cards': 'Print Products',
  'Specialty Greeting Cards': 'Print Products',
  'Invitations': 'Print Products',
  'Marketing Collateral': 'Print Products',

  'Letterhead': 'Stationary',
  'Envelopes': 'Stationary',
  'Notepads': 'Stationary',
  'NCR Forms': 'Stationary',
  'Supply Boxes': 'Stationary',

  'Roll Labels / Stickers': 'Labels / Stickers',
  'Square Cut Labels / Stickers': 'Labels / Stickers',

  'Coroplast Signs & Yard Signs': 'Large Format',
  'Foam Board': 'Large Format',
  'Vinyl Banners': 'Large Format',
  'Pull Up Banners': 'Large Format',
  'Window Graphics': 'Large Format',
  'Car Magnets': 'Large Format',
  'Large Format Posters': 'Large Format',
  'Styrene Signs': 'Large Format',
  'Display Board / POP': 'Large Format',
  'Canvas': 'Large Format',
  'Sintra/Rigid Board': 'Large Format',
  'X-Frame Banners': 'Large Format',
  'A-Frame Signs': 'Large Format',
  'Wall Calendars': 'Large Format',
  'Wall Decals': 'Large Format',
  'Covid-19-Decals': 'Large Format',
  'White Vinyl': 'Large Format',
  'Aluminum Signs': 'Large Format',
  'Table Covers': 'Large Format',
  'Floor Graphics': 'Large Format',
  'Adhesive Vinyl': 'Large Format',
  'Miscellaneous / Hardware': 'Large Format',
};

const SUBCATEGORY_LIST = [...new Set(Object.keys(SUBCATEGORY_CATEGORY_MAP))].sort();

async function seedSubcategories() {
  for (const name of SUBCATEGORY_LIST) {
    const categoryName = SUBCATEGORY_CATEGORY_MAP[name];
    const categoryId = CATEGORY_MAP[categoryName];

    if (!categoryId) {
      console.error(`⚠️ Missing category for subcategory: ${name}`);
      continue;
    }

    const id = uuidv4();
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');

      await db.delete(subcategories).execute();


    await db.insert(subcategories).values({
      id,
      name,
      slug,
      categoryId: categoryId,  // <-- Use mapped categoryId here dynamically
      created_at: new Date(),
      updated_at: new Date(),
    });

    console.log(`✅ Inserted: ${name} → ${categoryName}`);
  }

  console.log('\n🎉 Subcategories seeded successfully.\n');
}

seedSubcategories().catch((err) => {
  console.error('Error seeding subcategories:', err);
});
