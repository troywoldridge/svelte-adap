import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';
import slugify from 'slugify';
import { db } from '../src/lib/db';
import { products } from '../src/lib/db/schema.js';
import { eq } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const csvPath = path.join(__dirname, '../table_data/products.cleaned.csv');

const parser = fs
  .createReadStream(csvPath)
  .pipe(parse({ columns: true, skip_empty_lines: true, trim: true }));

const seen = new Set<string>();
let inserted = 0;
let updated = 0;

const main = async () => {
  for await (const row of parser) {
    // Avoid duplicates by UUID or product_code (choose which fits your data best)
    const uniqueKey = row.uuid || row.product_code;
    if (!uniqueKey || seen.has(uniqueKey)) {
      continue;
    }
    seen.add(uniqueKey);

    // Extract fields and normalize them
    const id = row.uuid || randomUUID(); // Use UUID from CSV or generate new
    const product_code = row.product_code?.trim() || '';
    const product_name = row.name?.trim() || row.product_name?.trim() || 'Unnamed Product';
    const slug = slugify(product_name, { lower: true, strict: true });

    // Use category_uuid and subcategory_uuid fields from CSV (make sure they exist!)
    const category_id = row.category_uuid || '';
    const subcategory_id = row.subcategory_uuid || '';

    // Fallback check for category and subcategory - you can customize this
    if (!category_id) {
      console.warn(`⚠️ Missing category UUID for product "${product_name}" - skipping`);
      continue;
    }
    if (!subcategory_id) {
      console.warn(`⚠️ Missing subcategory UUID for product "${product_name}" - skipping`);
      continue;
    }

    const now = new Date();

    try {
      // Check if product already exists by UUID or product_code
      const existing = await db
        .select()
        .from(products)
        .where(
          eq(products.id, id)
        );

      if (existing.length > 0) {
        // Update existing
        await db
          .update(products)
          .set({
            product_code,
            product_name,
            slug,
            category_id,
            subcategory_id,
            updated_at: now,
          })
          .where(eq(products.id, id));
        updated++;
      } else {
        // Insert new product
        await db.insert(products).values({
          id,
          product_code,
          product_name,
          slug,
          category_id,
          subcategory_id,
          created_at: now,
          updated_at: now,
        });
        inserted++;
      }
    } catch (err) {
      console.error(`❌ Failed to insert/update product "${product_name}": ${err.message}`);
    }
  }

  console.log(`✅ Inserted: ${inserted}, Updated: ${updated}, Skipped: ${seen.size - inserted - updated}`);
};

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
