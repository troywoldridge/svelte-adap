import csv
import re

INPUT_PATH = "products.csv"
OUTPUT_PATH = "products.cleaned.csv"


def clean_line(line):
    # Remove leading/trailing whitespace
    line = line.strip()
    # Replace smart quotes or strange characters
    line = line.replace("“", '"').replace("”", '"').replace("’", "'")
    # Fix double double-quotes
    line = re.sub(r'""+', '"', line)
    return line

def clean_csv():
    with open(INPUT_PATH, newline='', encoding="utf-8", errors='replace') as infile, \
         open(OUTPUT_PATH, mode="w", newline='', encoding="utf-8") as outfile:

        reader = csv.reader((clean_line(line) for line in infile), skipinitialspace=True)
        writer = csv.writer(outfile)

        for row in reader:
            clean_row = [cell.strip() if isinstance(cell, str) else cell for cell in row]
            writer.writerow(clean_row)

    print(f"✅ Cleaned CSV written to: {OUTPUT_PATH}")

if __name__ == "__main__":
    clean_csv()
