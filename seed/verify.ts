// scripts/print-products.ts
import { db } from '$lib/db';
import { categories, subcategories, products } from '$lib/db/schema';

async function run() {
	const cats = await db.select().from(categories);
	for (const cat of cats) {
		console.log(`📂 Category: ${cat.name} [id=${cat.id}]`);
		const subs = await db.select().from(subcategories).where(subcategories.categoryId.eq(cat.id));
		for (const sub of subs) {
			console.log(`  └─ 📁 Subcategory: ${sub.name} [id=${sub.id}]`);
			const prods = await db.select().from(products).where(products.subcategoryId.eq(sub.id));
			for (const prod of prods) {
				console.log(`      └─ 📦 Product: ${prod.name} [id=${prod.id}]`);
			}
		}
	}
	process.exit(0);
}

run().catch(console.error);
