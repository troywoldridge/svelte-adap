// scripts/print-products.ts
import { db } from '../src/lib/db';
import { categories, subcategories, products } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';

async function run() {
	const allCategories = await db.select().from(categories);

	for (const cat of allCategories) {
		console.log(`📂 Category: ${cat.name} [id=${cat.id}]`);

		const subs = await db
			.select()
			.from(subcategories)
			.where(eq(subcategories.categoryId, cat.id));

		for (const sub of subs) {
			console.log(`  └─ 📁 Subcategory: ${sub.name} [id=${sub.id}]`);

			const prods = await db
				.select()
				.from(products)
				.where(eq(products.subcategoryId, sub.id));

			for (const prod of prods) {
				console.log(`      └─ 📦 Product: ${prod.name} [id=${prod.id}]`);
			}
		}
	}

	process.exit(0);
}

run().catch((err) => {
	console.error('❌ Failed to print product catalog:', err);
	process.exit(1);
});
