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

def fix_object_stream(raw_list):
    import re

    joined = ' '.join(raw_list)
    joined = joined.replace("'", '"').replace('""', '"').strip()

    # Step 1: Add commas between key-value pairs missing commas
    # This inserts a comma between closing quote or number and the next quote if missing
    # For example: "3.5 x 2"  "group": -> "3.5 x 2", "group":
    joined = re.sub(r'("\s+)(?=[a-zA-Z0-9_]+\s*":)', '", ', joined)

    # Step 2: Ensure objects start with { and end with }
    if not joined.startswith('['):
        joined = f'[{joined}'
    if not joined.endswith(']'):
        joined = f'{joined}]'

    # Step 3: Replace opening keys without braces with proper object start
    joined = re.sub(r'\[\s*"([a-zA-Z0-9_]+)"\s*:', r'[{"\1":', joined)

    # Step 4: Add commas between objects if missing
    joined = re.sub(r'}\s*{', '},{', joined)

    # Step 5: Fix broken key/value segments like "markup": , → "markup": null
    joined = re.sub(r'"([a-zA-Z0-9_]+)"\s*:\s*,\s*"', r'"\1": "",', joined)
    joined = re.sub(r'"([a-zA-Z0-9_]+)"\s*:\s*,\s*(?=[}\]])', r'"\1": null', joined)
    joined = re.sub(r'"([a-zA-Z0-9_]+)"\s*:\s*,', r'"\1": null,', joined)

    # Step 6: Clean up dangling close characters and duplicate closing brackets
    joined = re.sub(r'}\s*\]{2,}', '}]}', joined)
    joined = re.sub(r']\s*"}', '"]}', joined)
    joined = re.sub(r'\]\s*{', '],{', joined)

    # Step 7: Fix trailing syntax garbage
    joined = re.sub(r'"}\s*]".*$', '"}]', joined)
    joined = re.sub(r'}\s*]\s*"{.*$', '}]', joined)

    return joined



# Main CSV parse and write
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
