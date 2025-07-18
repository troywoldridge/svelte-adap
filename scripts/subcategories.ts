import path from 'path'
import fs from 'fs'
import { parse } from 'csv-parse/sync'
import slugify from 'slugify'
import { db } from '../src/lib/db'
import { subcategories } from '../src/lib/db/schema'
import { eq } from 'drizzle-orm'
import { v5 as uuidv5 } from 'uuid'

const UUID_NAMESPACE = 'c9b71f08-1e6f-4d53-8b31-33eae34567bb' // Same namespace as categories

const csvPath = path.resolve('table_data/product_subcategory.csv')

// Helper: generate unique slug by checking db to avoid duplicates
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let slug = baseSlug
  let suffix = 1
  while (await db.query.subcategories.findFirst({ where: eq(subcategories.slug, slug) })) {
    slug = `${baseSlug}-${suffix}`
    suffix++
  }
  return slug
}

async function main() {
  console.log('⏳ Seeding subcategories from', csvPath)

  let fileContent: string
  try {
    fileContent = fs.readFileSync(csvPath, 'utf8')
  } catch (err) {
    console.error('❌ Error reading CSV:', err)
    process.exit(1)
  }

  let records: any[]
  try {
    records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      delimiter: ',', // comma-separated CSV
      quote: '"',
      relax_column_count: true,
    })
  } catch (err) {
    console.error('❌ Error parsing CSV:', err)
    process.exit(1)
  }

  let count = 0

  for (const row of records) {
    const rawName = row['subcategory_name']?.trim()
    const rawSubId = row['subcategory_id']?.trim()
    const rawCatId = row['category_id']?.trim()

    if (!rawName || !rawSubId || !rawCatId) {
      console.warn(`⚠️ Skipping row — missing required fields:`, row)
      continue
    }

    // Generate UUIDs consistently for subcategory and category IDs (must match categories seeding)
    const id = uuidv5(rawSubId, UUID_NAMESPACE)
    const categoryId = uuidv5(rawCatId.toLowerCase().replace(/\s+/g, '-'), UUID_NAMESPACE)

    // Generate base slug and then a unique slug if needed
    let baseSlug: string
    try {
      baseSlug = slugify(rawName, { lower: true, strict: true })
    } catch {
      console.warn(`⚠️ Slugify failed:`, row)
      continue
    }

    const slug = await generateUniqueSlug(baseSlug)

    // Check if this subcategory already exists by ID
    const exists = await db.query.subcategories.findFirst({
      where: eq(subcategories.id, id),
    })
    if (exists) {
      console.log(`⚠️ Already exists: ${rawName}`)
      continue
    }

    // Parse dates safely or use current date
    let createdAt = new Date()
    let updatedAt = new Date()
    try {
      createdAt = new Date(row['created_at'])
      updatedAt = new Date(row['updated_at'])
    } catch {
      console.warn(`⚠️ Invalid dates, using current time:`, row)
    }

    try {
      await db.insert(subcategories).values({
        id,
        name: rawName,
        slug,
        categoryId,
        createdAt,
        updatedAt,
      })
      console.log(`✅ Inserted: ${rawName}`)
      count++
    } catch (insertErr) {
      console.error(`❌ Failed to insert subcategory ${rawName}:`, insertErr)
    }
  }

  console.log(`🌱 Done. Seeded ${count} subcategories.`)
  process.exit(0)
}

main().catch(err => {
  console.error('❌ Subcategory seed failed:', err)
  process.exit(1)
})
