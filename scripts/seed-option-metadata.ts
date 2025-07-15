import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { db } from '../src/lib/db';
import { options, optionMetadata } from '../src/lib/db/schema';
import { randomUUID } from 'crypto';

interface RawOptionRow {
  option_value_uuid: string;
  option_id: string;
  sort: string;
  option_code: string;
  value: string;
  flag: string;
  created_at: string;
  updated_at: string;
}

function inferInputType(code: string, values: string[]): string {
  if (code === 'qty') return 'number';
  if (values.length <= 4) return 'radio';
  return 'dropdown';
}

function inferRange(values: string[]): {
  min: number | null;
  max: number | null;
  step: number | null;
  unit: string | null;
} {
  const nums = values.map((v) => parseInt(v)).filter((v) => !isNaN(v));
  if (nums.length === 0) return { min: null, max: null, step: null, unit: null };
  const sorted = nums.sort((a, b) => a - b);
  const step = sorted.length >= 2 ? sorted[1] - sorted[0] : null;
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    step: step || null,
    unit: 'pcs'
  };
}

async function seedOptionMetadata() {
  try {
    // 1. Get distinct option codes and their UUIDs
    const allOptions = await db.select({
      uuid: options.uuid,
      code: options.name,
      value: options.group
    }).from(options);

    // 2. Group by option code (e.g., "qty", "size", etc.)
    const grouped = new Map<string, { uuid: string; value: string }[]>();

    for (const row of allOptions) {
      const code = row.code.trim().toLowerCase();
      if (!grouped.has(code)) grouped.set(code, []);
      grouped.get(code)!.push({ uuid: row.uuid, value: row.value });
    }

    // 3. Build metadata rows
    const metadataRows = Array.from(grouped.entries()).map(([code, group]) => {
      const label =
        code === 'qty' ? 'Quantity'
        : code === 'size' ? 'Size'
        : code === 'coating' ? 'Coating Type'
        : code.charAt(0).toUpperCase() + code.slice(1);

      const values = group.map((g) => g.value);
      const inputType = inferInputType(code, values);
      const range = inferRange(values);

      return {
        id: randomUUID(),
        optionId: group[0].uuid, // arbitrary (used to link UI element to DB option group)
        label,
        inputType,
        min: range.min,
        max: range.max,
        step: range.step,
        unit: range.unit,
        showPrice: false,
        required: true
      };
    });

    await db.insert(optionMetadata).values(metadataRows);
    console.log(`✅ Seeded ${metadataRows.length} option metadata entries from options table`);
  } catch (err) {
    console.error('❌ Error seeding metadata:', err);
  }
}

seedOptionMetadata();
