// src/lib/db/schema.ts
import { real, pgTable, text, integer, boolean, varchar, timestamp, uuid } from 'drizzle-orm/pg-core';

// Categories Table
export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Subcategories
export const subcategories = pgTable('subcategories', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  category_id: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Products
export const products = pgTable('products', {
  id: uuid('id').primaryKey(),
  product_code: text('product_code').notNull(),
  product_name: text('product_name').notNull(),
  category_id: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'cascade' }),
  subcategory_id: uuid('subcategory_id')
    .notNull()
    .references(() => subcategories.id, { onDelete: 'cascade' }),
  is_featured: boolean('is_featured').default(false),
  slug: text('slug').notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Product Images Table
export const productImages = pgTable('product_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  imageUrl: text('image_url').notNull(),
  alt: text('alt'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  position: integer('position').notNull(), // order for images
  cloudflareId: text('cloudflare_id').notNull(),
});

// Product Shipping Data Table
export const productShippingData = pgTable('product_shipping_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
  weightLb: real('weight_lb').notNull(),
  weightOz: real('weight_oz').notNull(),
  quantityPerPackage: integer('quantity_per_package').notNull(),
  isAvailable: boolean('is_available').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  length: real('length').notNull(),
  width: real('width').notNull(),
  height: real('height').notNull(),
});

// Options Table - use UUID primary key only, remove integer id
export const options = pgTable('options', {
  uuid: uuid('uuid').primaryKey().defaultRandom(),
  optionId: integer('option_id').notNull(),
  group: text('group').notNull(),
  name: text('name').notNull(),
  hidden: boolean('hidden').notNull().default(false),  // better as boolean
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Option Metadata Table
export const optionMetadata = pgTable('option_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  optionId: uuid('option_id').notNull().references(() => options.uuid, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  inputType: text('input_type').notNull(),
  min: integer('min'),
  max: integer('max'),
  step: integer('step'),
  unit: text('unit'),
  showPrice: boolean('show_price').notNull().default(false),
  required: boolean('required').notNull().default(false),
});
