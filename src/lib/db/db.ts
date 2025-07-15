import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'troyuser',
  password: 'Elizabeth71676',
  database: 'troydb',
});

export const db = drizzle(pool);
