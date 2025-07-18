// scripts/products.ts

import { db } from '../src/lib/db';
import { products, subcategories } from '../src/lib/db/schema';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const csvPath = path.resolve('table_data/products');

async function main() {
	console.log('⏳ Seeding products from', csvPath);

	const fileContent = fs.readFileSync(csvPath, 'utf8');

	const records = parse(fileContent, {
		columns: false,
		skip_empty_lines: true,
		relax_quotes: true,
		escape: '"',
		relax_column_count: true
	});

	for (const row of records) {
		const [
			_id, // ignored (old serial ID)
			name,
			shortcode,
			createdAt,
			updatedAt,
			slug,
			productUuid,
			optionsJson,
			pricingJson
		] = row;

		// Use first two parts of slug to match subcategory slug
		const subSlug = slug.split('-').slice(0, 2).join('-');

		const sub = await db.query.subcategories.findFirst({
			where: eq(subcategories.slug, subSlug)
		});

		if (!sub) {
			console.warn(`⚠️ Skipping "${name}" — no subcategory found for slug "${subSlug}"`);
			continue;
		}

		await db.insert(products).values({
			id: productUuid || randomUUID(), // fallback if uuid is missing
			name,
			handle: shortcode,
			slug,
			uuid: productUuid || randomUUID(), // optional if id === uuid
			createdAt: new Date(createdAt),
			updatedAt: new Date(updatedAt),
			subcategoryId: sub.id
		});

		console.log(`✅ Inserted: ${name}`);
	}

	console.log('🌱 Done seeding products.');
	process.exit(0);
}

main().catch((err) => {
	console.error('❌ Seed failed:', err);
	process.exit(1);
});
