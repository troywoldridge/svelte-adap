// scripts/seed/products.ts

import { db } from '../src/lib/db'
import { products, subcategories } from '../src/lib/db/schema'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import { eq } from 'drizzle-orm'

const csvPath = path.resolve('table_data/products')

async function main() {
	console.log('⏳ Seeding products from', csvPath)

	const fileContent = fs.readFileSync(csvPath, 'utf8')
	const records = parse(fileContent, {
  columns: false,
  skip_empty_lines: true,
  relax_quotes: true,
  escape: '"',
  relax_column_count: true,
});

	for (const row of records) {
		const [
			id,
			name,
			shortcode,
			createdAt,
			updatedAt,
			slug,
			uuid,
			optionsJson,
			pricingJson
		] = row

		// Try to infer subcategory from slug prefix
		const sub = await db.query.subcategories.findFirst({
			where: eq(subcategories.slug, slug.split('-').slice(0, 2).join('-'))
		})

		if (!sub) {
			console.warn(`⚠️ Skipping "${name}" — no subcategory found for slug "${slug}"`)
			continue
		}

		await db.insert(products).values({
			id: Number(id),
			name,
			slug,
			shortcode,
			uuid,
			subcategoryId: sub.id,
			createdAt: new Date(createdAt),
			updatedAt: new Date(updatedAt),
		})

		console.log(`✅ Inserted: ${name}`)
	}

	console.log('🌱 Done seeding products.')
	process.exit(0)
}

main().catch((err) => {
	console.error('❌ Seed failed:', err)
	process.exit(1)
})
