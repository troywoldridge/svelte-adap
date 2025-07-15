// +page.server.ts
import type { PageServerLoad } from './$types';
import { db } from '$lib/db';
import { categories, subcategories, products } from '$lib/db/schema';
import { eq, and } from 'drizzle-orm';

export const load: PageServerLoad = async ({ params }) => {
	try {
		const categoryId = parseInt(params.categoryId);
		const subId = parseInt(params.subId);
		const productId = parseInt(params.productId);

		if (isNaN(categoryId) || isNaN(subId) || isNaN(productId)) {
			return {
				product: null,
				subcategory: null,
				category: null
			};
		}

		const [product] = await db
			.select()
			.from(products)
			.where(and(eq(products.id, productId), eq(products.subcategoryId, subId)));

		const [subcategory] = await db
			.select()
			.from(subcategories)
			.where(and(eq(subcategories.id, subId), eq(subcategories.categoryId, categoryId)));

		const [category] = await db
			.select()
			.from(categories)
			.where(eq(categories.id, categoryId));

		return {
			product: product ?? null,
			subcategory: subcategory ?? null,
			category: category ?? null
		};
	} catch (err) {
		console.error('❌ Product page load error:', err);
		return {
			product: null,
			subcategory: null,
			category: null
		};
	}
};
