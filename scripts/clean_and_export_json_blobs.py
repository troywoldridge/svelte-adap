import csv
import json
import re

input_path = "products.csv"
output_path = "cleaned_blobs.jsonl"
error_log_path = "error_log.txt"

# Replace these with your actual JSON-containing column names from the CSV header
json_columns = ["options_json", "pricing_json"]  

def clean_json_like_string(bad_json_str):
    if not bad_json_str:
        return None

    # Remove newlines, carriage returns
    clean_str = bad_json_str.replace("\n", " ").replace("\r", " ")

    # Replace single quotes with double quotes
    clean_str = clean_str.replace("'", '"')

    # Fix escaped quotes inside values (unescape \" to ")
    clean_str = re.sub(r'\\"', '"', clean_str)

    # Remove trailing commas before closing braces/brackets
    clean_str = re.sub(r',(\s*[}\]])', r'\1', clean_str)

    try:
        return json.loads(clean_str)
    except json.JSONDecodeError as e:
        return None

total_rows = 0
cleaned_count = 0
error_lines = []

with open(input_path, "r", encoding="utf-8") as infile, \
     open(output_path, "w", encoding="utf-8") as outfile:

    reader = csv.DictReader(infile)
    for line_num, row in enumerate(reader, start=2):  # start=2 to account for header row

        total_rows += 1

        # We'll store cleaned JSON objects for each JSON column in the row
        cleaned_row = {}

        for col in json_columns:
            raw_blob = row.get(col, "").strip()
            cleaned = clean_json_like_string(raw_blob)
            if cleaned is None and raw_blob != "":
                # Failed to clean this column for this row
                error_lines.append((line_num, col, raw_blob))
            cleaned_row[col] = cleaned

        # Write cleaned JSON objects line by line — one JSON per column per row
        # You can customize this output format based on your needs
        outfile.write(json.dumps({
            "line": line_num,
            "product_id": row.get("id", ""),
            "cleaned_data": cleaned_row
        }) + "\n")

        cleaned_count += 1

if error_lines:
    with open(error_log_path, "w", encoding="utf-8") as errfile:
        for line_num, col, blob in error_lines:
            errfile.write(f"Line {line_num}, Column '{col}': {blob}\n")

print("\n✅ Cleaning complete!")
print(f"Total CSV rows processed: {total_rows}")
print(f"✅ Rows processed with JSON cleaning: {cleaned_count}")
print(f"❌ Failed JSON cleaning entries: {len(error_lines)}")

if error_lines:
    print(f"→ See failed lines in: {error_log_path}")
print(f"→ Cleaned JSON blobs saved to: {output_path}")
