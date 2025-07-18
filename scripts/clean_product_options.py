import csv
import json
import re
from pathlib import Path

# === CONFIG ===
INPUT_FILE = Path("/home/troy/table_data/products.csv")
OUTPUT_FILE = Path("/home/troy/table_data/products.cleaned.jsonl")

# === CLEANING FUNCTION ===
def clean_json_string(messy_str: str) -> list | dict | None:
    try:
        # Replace single quotes with double quotes
        cleaned = messy_str.replace("'", '"')
        # Fix malformed keys: '"name"' → "name"
        cleaned = re.sub(r'"\\?"([a-zA-Z0-9 _\-]+)\\?"\s*:', r'"\1":', cleaned)
        # Unwrap double-wrapped strings: '""Text""' → '"Text"'
        cleaned = re.sub(r'""([^"]+)""', r'"\1"', cleaned)
        return json.loads(cleaned)
    except Exception:
        return None  # fallback

# === PROCESS ===
def clean_csv_file():
    with open(INPUT_FILE, newline='', encoding='utf-8') as infile, open(OUTPUT_FILE, 'w', encoding='utf-8') as outfile:
        reader = csv.reader(infile)
        headers = next(reader)

        for row in reader:
            product_id = row[0]
            product_name = row[1]
            slug = row[5]
            uuid = row[6]
            raw_options = row[7]
            raw_pricing = row[8]

            cleaned = {
                "id": product_id,
                "name": product_name,
                "slug": slug,
                "uuid": uuid,
                "options": clean_json_string(raw_options),
                "pricing": clean_json_string(raw_pricing),
            }

            # Write one cleaned line at a time as JSONL
            outfile.write(json.dumps(cleaned) + "\n")

    print(f"✅ Cleaned data written to: {OUTPUT_FILE}")

if __name__ == "__main__":
    clean_csv_file()
