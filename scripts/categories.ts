import { db } from '../src/lib/db'
import { categories } from '../src/lib/db/schema'
import slugify from 'slugify'
import { v5 as uuidv5 } from 'uuid'

const UUID_NAMESPACE = 'c9b71f08-1e6f-4d53-8b31-33eae34567bb'  // fixed namespace, same for both scripts

const CATEGORY_NAMES = [
  'Business Cards',
  'Print Products',
  'Large Format',
  'Stationary',
  'Promotional',
  'Apparel',
  'Labels / Stickers',
]

async function main() {
  let count = 0

  for (const [index, name] of CATEGORY_NAMES.entries()) {
    // Generate a stable string for UUID generation — for example, use index as string or name itself
    const categoryIdString = name.toLowerCase().replace(/\s+/g, '-')  // slug-like string

    const id = uuidv5(categoryIdString, UUID_NAMESPACE)
    const slug = slugify(name, { lower: true, strict: true })

    await db.insert(categories).values({
      id,
      name,
      slug,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    console.log(`✅ Inserted category: ${name}`)
    count++
  }

  console.log(`🌱 Done. Seeded ${count} categories.`)
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Category seeding failed:', err)
  process.exit(1)
})
