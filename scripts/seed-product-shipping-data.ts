import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { db } from '../src/lib/db';
import { productShippingData } from '../src/lib/db/schema';

interface RawShippingRow {
  uuid: string;
  productId: string;
  weightLb: string;
  weightOz: string;
  quantityPerPackage: string;
  isAvailable: string;
  createdAt: string;
  updatedAt: string;
  length: string;
  width: string;
  height: string;
}

async function seedProductShippingData() {
  try {
    const filePath = path.resolve('table_data', 'product_Shipping_data');
    const csvData = fs.readFileSync(filePath, 'utf8');
    const records: RawShippingRow[] = parse(csvData, {
      columns: false,
      skip_empty_lines: true,
      trim: true,
    }).map((row: string[]) => ({
      uuid: row[0],
      productId: row[1],
      weightLb: row[2],
      weightOz: row[3],
      quantityPerPackage: row[4],
      isAvailable: row[5],
      createdAt: row[6],
      updatedAt: row[7],
      length: row[8],
      width: row[9],
      height: row[10],
    }));

    // Insert rows in batches or all at once:
    await db.insert(productShippingData).values(
      records.map((r) => ({
        uuid: r.uuid,
        productId: r.productId,
        weightLb: parseFloat(r.weightLb),
        weightOz: parseFloat(r.weightOz),
        quantityPerPackage: parseInt(r.quantityPerPackage, 10),
        isAvailable: parseInt(r.isAvailable, 10),
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
        length: parseFloat(r.length),
        width: parseFloat(r.width),
        height: parseFloat(r.height),
      }))
    );

    console.log(`✅ Seeded ${records.length} product shipping data rows`);
  } catch (err) {
    console.error('❌ Error seeding product shipping data:', err);
  }
}

seedProductShippingData();
