// src/lib/db/schema/products.ts
import { pgTable, uuid, varchar, timestamp, text, integer } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { subcategories } from './subcategories';

// Products Table
export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  handle: varchar('handle', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  subcategoryId: uuid('subcategory_id').notNull().references(() => subcategories.id, { onDelete: 'cascade' }),
});
