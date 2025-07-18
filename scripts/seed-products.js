import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';
import { fileURLToPath } from 'url';
import { drizzleClient } from './lib/db.js';
import { products } from './lib/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, '../table_data/products.cleaned.csv');

const parser = fs
  .createReadStream(csvPath)
  .pipe(
    parse({
      columns: true,
      skip_empty_lines: true,
      relax_quotes: true,            // ✅ allows poorly closed quotes
      trim: true,
      relax_column_count: true,      // ✅ if some lines are shorter/longer
      skip_records_with_error: true, // ✅ just skip broken lines
    })
  );

const main = async () => {
  const db = drizzleClient();

  let count = 0;
  for await (const record of parser) {
    try {
      // example insert
      await db.insert(products).values({
        id: record.id,
        product_name: record.product_name,
        category_uuid: record.category_uuid,
        subcategory_uuid: record.subcategory_uuid,
        price: parseFloat(record.price ?? '0'),
        created_at: new Date(),
      });
      count++;
    } catch (err) {
      console.warn(`[WARN] Skipping product id=${record.id} due to error: ${err.message}`);
    }
  }

  console.log(`✅ Done. Seeded ${count} products.`);
  process.exit(0);
};

main().catch((err) => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
