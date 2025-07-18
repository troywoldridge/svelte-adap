import csv
import json

# Input file paths
jsonl_path = "cleaned_blobs.jsonl"
product_ids_path = "product_ids.txt"

# Output file paths
options_csv = "product_options.csv"
pricing_csv = "product_pricing.csv"

# Read all product IDs
with open(product_ids_path, "r") as f:
    product_ids = [line.strip() for line in f if line.strip()]

# Read all JSON blobs (one per line)
with open(jsonl_path, "r") as f:
    json_blobs = [json.loads(line.strip()) for line in f if line.strip()]

# Sanity check
if len(product_ids) != len(json_blobs):
    raise ValueError("Number of product IDs doesn't match number of JSON blobs")

# Write options and pricing CSVs
with open(options_csv, "w", newline='') as optfile, open(pricing_csv, "w", newline='') as pricefile:
    opt_writer = csv.writer(optfile)
    price_writer = csv.writer(pricefile)

    # Write headers
    opt_writer.writerow(["product_id", "option_type", "value"])
    price_writer.writerow(["product_id", "quantity", "price"])

    for i, blob in enumerate(json_blobs):
        pid = product_ids[i]

        print(f"[{i+1}/{len(product_ids)}] Processing product: {pid}")

        # Write product options
        options = blob.get("productOptions", {})
        for option_type, value in options.items():
            opt_writer.writerow([pid, option_type, value])

        # Write tiered pricing
        price2 = blob.get("price2", {})
        for qty, price in price2.items():
            price_writer.writerow([pid, qty, price])

# Final status
print("\n✅ Done!")
print(f"Processed {len(json_blobs)} products.")
print(f"→ Output saved to:\n   - {options_csv}\n   - {pricing_csv}")
