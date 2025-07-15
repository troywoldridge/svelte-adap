// src/lib/db/schema.ts
import { pgTable, uuid, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  alt: text('alt'),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).notNull(),
  productId: uuid('product_id').notNull(), // FK to products.uuid
  position: integer('position').notNull(), // e.g. 1 for main, 2, 3...
  cloudflareId: text('cloudflare_id').notNull()
});
