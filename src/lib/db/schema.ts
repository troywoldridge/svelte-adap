// src/lib/db/schema.ts
import { real, pgTable, serial, text, integer, boolean, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';


export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const subcategories = pgTable('subcategories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  categoryId: uuid('category_id').references(() => categories.id).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});


export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  handle: varchar('handle', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull(),
  uuid: uuid('uuid').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

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

export const productShippingData = pgTable('product_shipping_data', {
  uuid: uuid('uuid').primaryKey(),
  productId: uuid('product_id').notNull(),
  weightLb: real('weight_lb').notNull(),
  weightOz: real('weight_oz').notNull(),
  quantityPerPackage: integer('quantity_per_package').notNull(),
  isAvailable: integer('is_available').notNull(),  // or boolean('is_available') if you want
  createdAt: timestamp('created_at', { mode: 'date' }),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
  length: real('length').notNull(),
  width: real('width').notNull(),
  height: real('height').notNull(),
});


export const options = pgTable('options', {
  id: integer('id').notNull(),
  optionId: integer('option_id').notNull(),
  group: text('group').notNull(), // ✅ not `group_id`
  name: text('name').notNull(),
  hidden: text('hidden').notNull(), // or boolean
  createdAt: timestamp('created_at', { mode: 'date' }),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
  uuid: uuid('uuid').primaryKey(),
});

export const optionMetadata = pgTable('option_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  optionId: uuid('option_id').notNull().references(() => options.uuid),
  label: text('label').notNull(),
  inputType: text('input_type').notNull(),
  min: integer('min'),
  max: integer('max'),
  step: integer('step'),
  unit: text('unit'),
  showPrice: boolean('show_price').default(false),
  required: boolean('required').default(false),
});
function float(arg0: string) {
  throw new Error('Function not implemented.');
}

