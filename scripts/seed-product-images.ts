import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { db } from '../src/lib/db';
import { productImages } from '../src/lib/db/schema';

interface RawImageRow {
  id: string;
  image_url: string;
  alt: string;
  created_at: string;
  updated_at: string;
  product_id: string;
  position: string;
  cloudflare_id: string;
}

async function seedProductImages() {
  try {
    const filePath = path.resolve('table_data', 'product_images');
    const csvData = fs.readFileSync(filePath, 'utf8');
    const records: RawImageRow[] = parse(csvData, {
      columns: false,
      skip_empty_lines: true,
      trim: true
    }).map((row: string[]) => ({
      id: row[0],
      image_url: row[1],
      alt: row[2],
      created_at: row[3],
      updated_at: row[4],
      product_id: row[5],
      position: row[6],
      cloudflare_id: row[7]
    }));

    const entries = records.map((r) => ({
      id: r.id,
      imageUrl: r.image_url,
      alt: r.alt,
      createdAt: new Date(r.created_at),
      updatedAt: new Date(r.updated_at),
      productId: r.product_id,
      position: parseInt(r.position),
      cloudflareId: r.cloudflare_id
    }));

    await db.insert(productImages).values(entries);
    console.log(`✅ Seeded ${entries.length} product images.`);
  } catch (err) {
    console.error('❌ Error seeding product images:', err);
  }
}

seedProductImages();
