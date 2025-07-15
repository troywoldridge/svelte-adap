// src/lib/db/schema/subcategories.ts
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { categories } from './categories';
import { relations } from 'drizzle-orm';

export const subcategories = pgTable('subcategories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});
