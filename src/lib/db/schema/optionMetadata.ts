// src/lib/db/schema/optionMetadata.ts
import { pgTable, uuid, text, boolean, integer } from 'drizzle-orm/pg-core';

export const optionMetadata = pgTable('option_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  optionId: uuid('option_id').notNull().references(() => options.id), // links to options table
  label: text('label').notNull(),       // e.g., "Size", "Quantity"
  inputType: text('input_type').notNull(), // "dropdown", "radio", "number"
  min: integer('min'),                  // optional min value (for number inputs)
  max: integer('max'),                  // optional max value
  step: integer('step'),                // optional step for number inputs
  unit: text('unit'),                   // optional unit e.g. "pcs", "inches"
  showPrice: boolean('show_price').default(false),
  required: boolean('required').default(false)
});
