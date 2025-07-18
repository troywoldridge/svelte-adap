import { pgTable, text, timestamp, uuid, integer, boolean } from 'drizzle-orm/pg-core';

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