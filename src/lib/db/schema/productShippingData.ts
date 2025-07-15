import { pgTable, uuid, float, integer, timestamp } from 'drizzle-orm/pg-core';

export const productShippingData = pgTable('product_shipping_data', {
  uuid: uuid('uuid').primaryKey(),
  productId: uuid('product_id').notNull(),
  weightLb: float('weight_lb').notNull(),
  weightOz: float('weight_oz').notNull(),
  quantityPerPackage: integer('quantity_per_package').notNull(),
  isAvailable: integer('is_available').notNull(),  // consider boolean if you want: boolean('is_available')
  createdAt: timestamp('created_at', { mode: 'date' }),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
  length: float('length').notNull(),
  width: float('width').notNull(),
  height: float('height').notNull(),
});
