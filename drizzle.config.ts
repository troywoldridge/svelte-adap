// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // required!
  dbCredentials: {
    host: 'localhost',
    port: 5432,
    user: 'troyuser',
    password: 'Elizabeth71676',
    database: 'troydb',
    ssl: false,
  }
} satisfies Config;
