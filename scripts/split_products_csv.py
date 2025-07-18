import csv
import json
import re
from pathlib import Path

# === Paths ===
input_csv_path = Path("table_data/products.csv")
output_dir = Path("output_data")
output_dir.mkdir(parents=True, exist_ok=True)

products_csv = output_dir / "products_clean.csv"
options_csv = output_dir / "product_options.csv"
pricing_csv = output_dir / "product_pricing.csv"

# === Helpers ===
def clean_json_like_string(raw_list):
    text = ' '.join(raw_list)
    text = text.replace("'", '"')
    text = re.sub(r'"\s*:', '":', text)
    text = re.sub(r'([{\[,])\s*"', r'\1"', text)
    text = re.sub(r'"\s*([}\],])', r'"\1', text)
    return text.strip()

def try_parse_json(raw, context, product_id):
    try:
        return json.loads(raw)
    except Exception as e:
        print(f"[{context}] Parse error for Product ID {product_id}: {e}")
        print(f"[{context}] Raw input (preview): {raw[:120]}...\n")
        return []

# === File Writing Setup ===
with input_csv_path.open('r', encoding='utf-8') as infile, \
     products_csv.open('w', newline='', encoding='utf-8') as p_out, \
     options_csv.open('w', newline='', encoding='utf-8') as o_out, \
     pricing_csv.open('w', newline='', encoding='utf-8') as pr_out:

    reader = csv.reader(infile)
    header = next(reader)  # Skip header row

    products_writer = csv.DictWriter(p_out, fieldnames=["id", "name", "slug", "uuid"])
    options_writer = csv.DictWriter(o_out, fieldnames=["product_id", "id", "name", "group", "hidden"])
    pricing_writer = csv.DictWriter(pr_out, fieldnames=["product_id", "hash", "value", "markup"])

    products_writer.writeheader()
    options_writer.writeheader()
    pricing_writer.writeheader()

    for row_num, row in enumerate(reader, start=2):  # start=2 to account for header
        try:
            product_id = row[0]
            name = row[1]
            slug = row[6]
            uuid = row[7]

            # Write core product row
            products_writer.writerow({
                "id": product_id,
                "name": name,
                "slug": slug,
                "uuid": uuid
            })

            # === OPTIONS PARSE ===
            raw_options = clean_json_like_string(row[8:80])
            parsed_options = try_parse_json(raw_options, "Options", product_id)
            for opt in parsed_options:
                options_writer.writerow({
                    "product_id": product_id,
                    "id": opt.get("id"),
                    "name": opt.get("name"),
                    "group": opt.get("group"),
                    "hidden": opt.get("hidden")
                })

            # === PRICING PARSE ===
            raw_pricing = clean_json_like_string(row[80:])
            parsed_pricing = try_parse_json(raw_pricing, "Pricing", product_id)
            for price in parsed_pricing:
                pricing_writer.writerow({
                    "product_id": product_id,
                    "hash": price.get("hash"),
                    "value": price.get("value"),
                    "markup": price.get("markup")
                })

        except Exception as err:
            print(f"[Row Fail] Row {row_num} — Product ID {row[0]} — {err}")
