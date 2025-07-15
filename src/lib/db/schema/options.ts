import { pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

export const options = pgTable('options', {
  id: integer('id').primaryKey().notNull(),
  optionId: integer('option_id').notNull(),
  group: text('group').notNull(), // ✅ not `group_id`
  name: text('name').notNull(),
  hidden: text('hidden').notNull(), // or boolean
  createdAt: timestamp('created_at', { mode: 'date' }),
  updatedAt: timestamp('updated_at', { mode: 'date' }),
  uuid: uuid('uuid').primaryKey(),
});
