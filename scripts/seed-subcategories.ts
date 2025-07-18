import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { randomUUID } from 'crypto';
import { fileURLToPath } from 'url';
import { db } from '../src/lib/db';
import { subcategories } from '../src/lib/db/schema.js';
import slugify from 'slugify';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.join(__dirname, '../table_data/product_subcategory.csv');

// Known numeric ID to UUID mapping
const CATEGORY_ID_MAP: Record<string, string> = {
  '1': 'a389c7a3-1b7a-5a7f-9e7f-67331b0ce95d', // Business Cards
  '2': '8e36b2eb-f6e7-5d2b-8aee-afb66dccd1d3', // Print Products
  '3': '048824be-65ac-5d38-ac90-db96c1cc4bd8', // Large Format
  '4': 'ef09e14a-01ad-599f-81db-48ac9839d982', // Apparel
  '5': '0592a955-ca84-581b-a764-cee13df5d31d', // Promotional
  '6': '9ec3ddd0-26a0-5722-933a-cf914908faeb', // Stationary
  '7': '57c05394-9fae-5dcb-aac4-576afca7c16f', // Labels / Stickers
};

const parser = fs
  .createReadStream(csvPath)
  .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }));

const seen = new Set<string>();
let inserted = 0;
let updated = 0;

const main = async () => {
  for await (const row of parser) {
    const name = row.subcategory_name?.trim();
    if (!name || seen.has(name)) {
      continue;
    }
    seen.add(name);

    const slug = slugify(name, { lower: true, strict: true });

    // Resolve category ID with fallback to 'Print Products' if unknown or '0'
    let categoryId = CATEGORY_ID_MAP[row.category_id];
    if (!categoryId || row.category_id === '0') {
      categoryId = CATEGORY_ID_MAP['2']; // Print Products fallback
      if (!categoryId) {
        console.warn(`⚠️ Print Products category UUID missing in map! Skipping "${name}"`);
        continue;
      }
    }

    const now = new Date();

    try {
      // Check if already exists
      const existing = await db
        .select()
        .from(subcategories)
        .where(eq(subcategories.slug, slug));

      if (existing.length > 0) {
        await db
          .update(subcategories)
          .set({ name, category_id: categoryId, updated_at: now })
          .where(eq(subcategories.slug, slug));
        updated++;
      } else {
        await db.insert(subcategories).values({
          id: randomUUID(),
          name,
          slug,
          category_id: categoryId,
          created_at: now,
          updated_at: now,
        });
        inserted++;
      }
    } catch (err) {
      console.error(`❌ Failed to insert "${name}": ${err.message}`);
    }
  }

  console.log(`✅ Inserted: ${inserted}, Updated: ${updated}, Skipped: ${seen.size - inserted - updated}`);
};

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
