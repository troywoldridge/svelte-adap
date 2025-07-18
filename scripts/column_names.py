import csv

with open("table_data/products.csv", "r", encoding="utf-8") as f:
    reader = csv.reader(f)
    headers = next(reader)
    print("\n📌 CSV Column Names:\n")
    for i, name in enumerate(headers):
        print(f"{i+1:2d}: {name}")
