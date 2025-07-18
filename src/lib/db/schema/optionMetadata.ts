// src/lib/db/schema/optionMetadata.ts
import { pgTable, uuid, text, boolean, integer } from 'drizzle-orm/pg-core';

// Option Metadata Table
export const optionMetadata = pgTable('option_metadata', {
  id: uuid('id').primaryKey().defaultRandom(),
  optionId: uuid('option_id').notNull().references(() => Option.uuid, { onDelete: 'cascade' }),
  label: text('label').notNull(),
  inputType: text('input_type').notNull(),
  min: integer('min'),
  max: integer('max'),
  step: integer('step'),
  unit: text('unit'),
  showPrice: boolean('show_price').notNull().default(false),
  required: boolean('required').notNull().default(false),
});
