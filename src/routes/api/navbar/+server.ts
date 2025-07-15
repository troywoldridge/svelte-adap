// src/routes/api/navbar/+server.ts
import { db } from '$lib/db';
import { categories, subcategories } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

export const GET = async () => {
  const cats = await db.select().from(categories);
  const subs = await db.select().from(subcategories);

  const data = cats.map((cat) => ({
    ...cat,
    subcategories: subs.filter((sub) => sub.categoryId === cat.id)
  }));

  return new Response(JSON.stringify(data));
};
