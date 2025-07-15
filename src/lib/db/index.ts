// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type { InferModel } from 'drizzle-orm';

// Setup the PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432'),
  user: process.env.DB_USER || 'troyuser',
  password: process.env.DB_PASSWORD || 'Elizabeth71676',
  database: process.env.DB_NAME || 'troydb',
  ssl: false,
});

// Initialize Drizzle with schema and connection
export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });


// 👇 Individually re-export tables for direct imports
export const {
	categories,
	subcategories,
	products
} = schema;

// 👇 Optional: Typed models for safety and auto-complete
export type Category = InferModel<typeof categories>;
export type Subcategory = InferModel<typeof subcategories>;
export type Product = InferModel<typeof products>;

// 👇 Optional: For inserts (e.g. seeders/forms)
export type NewCategory = InferModel<typeof categories, 'insert'>;
export type NewSubcategory = InferModel<typeof subcategories, 'insert'>;
export type NewProduct = InferModel<typeof products, 'insert'>;
