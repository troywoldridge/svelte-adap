// scripts/seed-options.ts
import fs from 'fs/promises';
import path from 'path';
import { db } from '../src/lib/db'; // or wherever your Drizzle db instance is
import { options } from '../src/lib/db/schema'; // adjust path to your schema
import { parse } from 'csv-parse/sync';

async function seedOptions() {
  const filePath = path.join(process.cwd(), 'table_data', 'options');
  const fileContent = await fs.readFile(filePath, 'utf-8');

  const records = parse(fileContent, {
  columns: false,               // or true if you have headers
  skip_empty_lines: true,
  relax_quotes: true,           // ← 💥 allows imperfect quotes
  trim: true,
  relax_column_count: true      // ← helpful if some rows are irregular
});

  const parsed = records.map((row) => ({
    id: Number(row[0]),
    optionId: Number(row[1]),
    group: row[2],
    name: row[3],
    hidden: row[4] === 't', // convert to boolean
    createdAt: new Date(row[5]),
    updatedAt: new Date(row[6]),
    uuid: row[7],
  }));

  console.log(`✅ Seeding ${parsed.length} options...`);
  await db.insert(options).values(parsed);
  console.log('🌱 Done seeding options.');
}

seedOptions().catch((err) => {
  console.error('❌ Error seeding options:', err);
});
