import csv
import json
import re
from pathlib import Path

input_csv_path = Path("table_data/products.csv")
output_dir = Path("output_data")
output_dir.mkdir(parents=True, exist_ok=True)

products_csv = output_dir / "products_clean.csv"
options_csv = output_dir / "product_options.csv"
pricing_csv = output_dir / "product_pricing.csv"


import re

def fix_object_stream(raw_list):
    """
    Cleans malformed JSON-like stream of objects and returns a valid JSON string.
    """

    # Step 1: Merge lines and normalize quotes
    joined = ' '.join(raw_list)
    joined = joined.replace("'", '"')
    joined = joined.replace('""', '"')  # remove double-double quotes

    # Step 2: Fix cases where [ is incorrectly used in place of {
    # Convert things like: ["key": "value"] → {"key": "value"}
    joined = re.sub(r'\[\s*"', '{ "', joined)
    joined = re.sub(r'"\s*]', '" }', joined)

    # Step 3: Add commas between objects
    joined = re.sub(r'}\s*{', '},{', joined)

    # Step 4: Fix missing commas between key/value pairs
    # Before: "name": "250" "group": "qty"  → After: "name": "250", "group": "qty"
    joined = re.sub(r'(":\s*"[^"]+")\s*(")', r'\1, \2', joined)
    joined = re.sub(r'(":\s*[^",\]}]+)\s*(")', r'\1, \2', joined)

    # Step 5: Final cleanup of missing commas between fields (more general)
    joined = re.sub(r'(":[^,{\[]+)\s+"', r'\1, "', joined)
    joined = re.sub(r'"\s*("[a-zA-Z0-9_]+")\s*:', r'", \1:', joined)

    # Wrap in array
    return f"[{joined}]"

with input_csv_path.open('r', encoding='utf-8') as infile, \
        products_csv.open('w', newline='', encoding='utf-8') as p_out, \
        options_csv.open('w', newline='', encoding='utf-8') as o_out, \
        pricing_csv.open('w', newline='', encoding='utf-8') as pr_out:

    reader = csv.reader(infile)
    products_writer = csv.DictWriter(p_out, fieldnames=["id", "name", "slug", "uuid"])
    options_writer = csv.DictWriter(o_out, fieldnames=["product_id", "id", "name", "group", "hidden"])
    pricing_writer = csv.DictWriter(pr_out, fieldnames=["product_id", "hash", "value", "markup"])

    products_writer.writeheader()
    options_writer.writeheader()
    pricing_writer.writeheader()

    next(reader)  # skip header

    for row in reader:
        try:
            product_id = row[0]
            name = row[1]
            slug = row[6]
            uuid = row[7]

            products_writer.writerow({
                "id": product_id,
                "name": name,
                "slug": slug,
                "uuid": uuid
            })

            # --- Parse Options (columns 8–79) ---
            try:
                raw_options = fix_object_stream(row[8:80])
                options = json.loads(raw_options)
                for opt in options:
                    options_writer.writerow({
                        "product_id": product_id,
                        "id": opt.get("id"),
                        "name": opt.get("name"),
                        "group": opt.get("group"),
                        "hidden": opt.get("hidden")
                    })
            except Exception as e:
                print(f"[Options] Parse error for Product ID {product_id}: {e}")
                print(f"[Options] Raw input (preview): {raw_options[:300]}")

            # --- Parse Pricing (columns 80+) ---
            try:
                raw_pricing = fix_object_stream(row[80:])
                pricing = json.loads(raw_pricing)
                for price in pricing:
                    pricing_writer.writerow({
                        "product_id": product_id,
                        "hash": price.get("hash"),
                        "value": price.get("value"),
                        "markup": price.get("markup")
                    })
            except Exception as e:
                print(f"[Pricing] Parse error for Product ID {product_id}: {e}")
                print(f"[Pricing] Raw input (preview): {raw_pricing[:300]}")

        except Exception as err:
            print(f"[Row Fail] Product ID {row[0]} — {err}")
