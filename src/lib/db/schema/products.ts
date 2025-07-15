// src/lib/db/schema/products.ts
import { pgTable, uuid, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { subcategories } from './subcategories';

export const products = pgTable('products', {
	id: uuid('id').primaryKey().defaultRandom(),
	slug: varchar('slug', { length: 255 }).notNull().unique(), // URL slug
	name: varchar('name', { length: 255 }).notNull(),
	description: text('description'),
	categoryId: uuid('category_id')
		.references(() => categories.id)
		.notNull(),
	subcategoryId: uuid('subcategory_id')
		.references(() => subcategories.id)
		.notNull(),
	sortOrder: integer('sort_order').default(0), // Optional display order
	createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});
